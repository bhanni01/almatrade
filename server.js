const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

loadEnv(path.join(__dirname, ".env"));

const HOST = process.env.HOST || "127.0.0.1";
const PORT = Number(process.env.PORT || 3000);
const STATIC_FILES = {
  "/": "index.html",
  "/app.js": "app.js",
  "/styles.css": "styles.css",
};

const COMMON_TICKER_WORDS = new Set([
  "A",
  "AI",
  "ALL",
  "AM",
  "AND",
  "ANY",
  "ARE",
  "ATM",
  "BE",
  "BEST",
  "BIG",
  "BUY",
  "BY",
  "CEO",
  "CFO",
  "DD",
  "DO",
  "EV",
  "FDA",
  "FOR",
  "GO",
  "GOOD",
  "HOLD",
  "HOT",
  "IMO",
  "IN",
  "IPO",
  "IS",
  "IT",
  "LOL",
  "LONG",
  "LOW",
  "NEWS",
  "NOW",
  "OH",
  "ON",
  "OR",
  "OTC",
  "OUT",
  "PM",
  "PR",
  "PT",
  "RS",
  "SEC",
  "SELL",
  "SO",
  "TO",
  "USA",
  "UPS",
  "WE",
  "WOW",
  "YOLO"
]);

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }
    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function sendFile(response, filePath) {
  const ext = path.extname(filePath);
  const contentType =
    ext === ".html" ? "text/html; charset=utf-8" :
    ext === ".js" ? "application/javascript; charset=utf-8" :
    ext === ".css" ? "text/css; charset=utf-8" :
    "text/plain; charset=utf-8";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    response.writeHead(200, { "Content-Type": contentType });
    response.end(content);
  });
}

function getEnvConfig() {
  return {
    clientId: process.env.REDDIT_CLIENT_ID || "",
    clientSecret: process.env.REDDIT_CLIENT_SECRET || "",
    username: process.env.REDDIT_USERNAME || "",
    password: process.env.REDDIT_PASSWORD || "",
    userAgent: process.env.REDDIT_USER_AGENT || "pair-strategy-lab/1.0",
  };
}

async function getAccessToken() {
  const config = getEnvConfig();
  if (!config.clientId || !config.clientSecret) {
    throw new Error("Missing REDDIT_CLIENT_ID or REDDIT_CLIENT_SECRET.");
  }

  const usePasswordGrant = Boolean(config.username && config.password);
  const form = new URLSearchParams(
    usePasswordGrant
      ? {
          grant_type: "password",
          username: config.username,
          password: config.password,
        }
      : {
          grant_type: "client_credentials",
        }
  );

  const authHeader = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64");
  const tokenResponse = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": config.userAgent,
    },
    body: form,
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    throw new Error(`Reddit token request failed: ${tokenResponse.status} ${errorText}`);
  }

  const tokenPayload = await tokenResponse.json();
  if (!tokenPayload.access_token) {
    throw new Error("Reddit token response did not include an access token.");
  }

  return tokenPayload.access_token;
}

async function redditGetJson(token, requestUrl) {
  const { userAgent } = getEnvConfig();
  const response = await fetch(requestUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "User-Agent": userAgent,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Reddit API request failed: ${response.status} ${errorText}`);
  }

  return response.json();
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase();
}

function looksLikeLounge(title) {
  const normalized = normalizeTitle(title);
  return (
    normalized.includes("lounge") ||
    normalized.includes("daily discussion") ||
    normalized.includes("daily thread") ||
    normalized.includes("what are your moves")
  );
}

async function fetchSubredditPosts({ token, subreddit, postLimit, days, loungeOnly }) {
  const listing = await redditGetJson(
    token,
    `https://oauth.reddit.com/r/${encodeURIComponent(subreddit)}/new.json?limit=${postLimit}`
  );
  const nowSeconds = Math.floor(Date.now() / 1000);
  const maxAgeSeconds = days * 24 * 60 * 60;
  const posts = (listing.data?.children || [])
    .map((child) => child.data)
    .filter(Boolean)
    .filter((post) => nowSeconds - post.created_utc <= maxAgeSeconds);

  const loungePosts = posts.filter((post) => looksLikeLounge(post.title));
  if (loungeOnly && loungePosts.length > 0) {
    return loungePosts;
  }
  return loungeOnly ? posts.slice(0, Math.min(posts.length, 5)) : posts;
}

function flattenComments(children, bucket = []) {
  for (const child of children || []) {
    if (!child || child.kind !== "t1" || !child.data) {
      continue;
    }
    bucket.push({
      id: child.data.id,
      body: child.data.body || "",
      author: child.data.author || "[deleted]",
      score: child.data.score || 0,
      createdUtc: child.data.created_utc || 0,
    });

    const replies = child.data.replies?.data?.children;
    if (Array.isArray(replies)) {
      flattenComments(replies, bucket);
    }
  }
  return bucket;
}

async function fetchPostCommentBundle({ token, subreddit, postId, commentLimit }) {
  const payload = await redditGetJson(
    token,
    `https://oauth.reddit.com/r/${encodeURIComponent(subreddit)}/comments/${postId}.json?limit=${commentLimit}&depth=8&sort=top`
  );
  const postData = payload?.[0]?.data?.children?.[0]?.data;
  const commentTree = payload?.[1]?.data?.children || [];
  return {
    post: postData,
    comments: flattenComments(commentTree),
  };
}

function extractTickers(text) {
  const candidates = String(text || "").match(/\$?[A-Z]{2,5}\b/g) || [];
  return [...new Set(
    candidates
      .map((candidate) => candidate.replace(/^\$/, ""))
      .filter((ticker) => !COMMON_TICKER_WORDS.has(ticker))
  )];
}

function buildPairAnalytics(postBundles, minMentions) {
  const tickerCounts = new Map();
  const pairCounts = new Map();
  const pairExamples = new Map();
  const sourcePosts = [];

  for (const bundle of postBundles) {
    const post = bundle.post || {};
    sourcePosts.push({
      id: post.id,
      title: post.title || "(untitled)",
      permalink: post.permalink ? `https://reddit.com${post.permalink}` : "",
      commentCount: bundle.comments.length,
      createdUtc: post.created_utc || 0,
    });

    const documents = [
      {
        text: `${post.title || ""}\n${post.selftext || ""}`,
        sourceType: "post",
        permalink: post.permalink ? `https://reddit.com${post.permalink}` : "",
        score: post.score || 0,
      },
      ...bundle.comments.map((comment) => ({
        text: comment.body,
        sourceType: "comment",
        permalink: post.permalink ? `https://reddit.com${post.permalink}${comment.id ? comment.id + "/" : ""}` : "",
        score: comment.score,
      })),
    ];

    for (const document of documents) {
      const tickers = extractTickers(document.text);
      if (tickers.length === 0) {
        continue;
      }

      for (const ticker of tickers) {
        tickerCounts.set(ticker, (tickerCounts.get(ticker) || 0) + 1);
      }

      for (let left = 0; left < tickers.length; left += 1) {
        for (let right = left + 1; right < tickers.length; right += 1) {
          const pairKey = [tickers[left], tickers[right]].sort().join("|");
          pairCounts.set(pairKey, (pairCounts.get(pairKey) || 0) + 1);
          if (!pairExamples.has(pairKey)) {
            pairExamples.set(pairKey, []);
          }
          const examples = pairExamples.get(pairKey);
          if (examples.length < 4) {
            examples.push({
              sourceType: document.sourceType,
              score: document.score,
              text: document.text.slice(0, 280),
            });
          }
        }
      }
    }
  }

  const topTickers = [...tickerCounts.entries()]
    .map(([ticker, mentions]) => ({ ticker, mentions }))
    .sort((left, right) => right.mentions - left.mentions)
    .slice(0, 20);

  const pairs = [...pairCounts.entries()]
    .map(([pairKey, coMentions]) => {
      const [tickerA, tickerB] = pairKey.split("|");
      const mentionsA = tickerCounts.get(tickerA) || 0;
      const mentionsB = tickerCounts.get(tickerB) || 0;
      return {
        pair: [tickerA, tickerB],
        coMentions,
        mentionsA,
        mentionsB,
        combinedMentions: mentionsA + mentionsB,
        score: coMentions * 100 + Math.min(mentionsA, mentionsB) * 10,
        examples: pairExamples.get(pairKey) || [],
      };
    })
    .filter((pair) => pair.coMentions >= minMentions)
    .sort((left, right) => right.score - left.score);

  return {
    distinctTickerCount: tickerCounts.size,
    topTickers,
    pairs,
    sourcePosts,
  };
}

async function handlePairsRequest(requestUrl, response) {
  const subreddit = requestUrl.searchParams.get("subreddit") || "pennystocks";
  const days = clampNumber(requestUrl.searchParams.get("days"), 7, 1, 30);
  const postLimit = clampNumber(requestUrl.searchParams.get("postLimit"), 15, 3, 50);
  const commentLimit = clampNumber(requestUrl.searchParams.get("commentLimit"), 250, 50, 500);
  const minMentions = clampNumber(requestUrl.searchParams.get("minMentions"), 2, 1, 20);
  const pairLimit = clampNumber(requestUrl.searchParams.get("pairLimit"), 12, 3, 30);
  const loungeOnly = requestUrl.searchParams.get("mode") !== "all";

  try {
    const token = await getAccessToken();
    const posts = await fetchSubredditPosts({
      token,
      subreddit,
      postLimit,
      days,
      loungeOnly,
    });

    const postBundles = [];
    for (const post of posts) {
      const bundle = await fetchPostCommentBundle({
        token,
        subreddit,
        postId: post.id,
        commentLimit,
      });
      postBundles.push(bundle);
    }

    const analytics = buildPairAnalytics(postBundles, minMentions);
    sendJson(response, 200, {
      subreddit,
      mode: loungeOnly ? "lounge" : "all",
      generatedAt: new Date().toISOString(),
      filters: {
        days,
        postLimit,
        commentLimit,
        minMentions,
        pairLimit,
      },
      stats: {
        postsAnalyzed: postBundles.length,
        commentsAnalyzed: postBundles.reduce((sum, bundle) => sum + bundle.comments.length, 0),
        distinctTickers: analytics.distinctTickerCount,
      },
      topTickers: analytics.topTickers,
      pairs: analytics.pairs.slice(0, pairLimit),
      sourcePosts: analytics.sourcePosts,
    });
  } catch (error) {
    sendJson(response, 500, {
      error: error.message,
    });
  }
}

function clampNumber(value, fallback, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.min(Math.max(parsed, min), max);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (requestUrl.pathname === "/api/health") {
    sendJson(response, 200, {
      ok: true,
      hasClientId: Boolean(process.env.REDDIT_CLIENT_ID),
      hasClientSecret: Boolean(process.env.REDDIT_CLIENT_SECRET),
      hasUsername: Boolean(process.env.REDDIT_USERNAME),
      hasPassword: Boolean(process.env.REDDIT_PASSWORD),
    });
    return;
  }

  if (requestUrl.pathname === "/api/reddit/pairs") {
    handlePairsRequest(requestUrl, response);
    return;
  }

  const staticFile = STATIC_FILES[requestUrl.pathname];
  if (staticFile) {
    sendFile(response, path.join(__dirname, staticFile));
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found");
});

server.on("error", (error) => {
  console.error(`Server failed to start on ${HOST}:${PORT}: ${error.message}`);
  process.exit(1);
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
