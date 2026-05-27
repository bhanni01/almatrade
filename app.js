const PAIR_SIGNALS = [
  {
    pair: ["QQQ", "XLK"],
    relation: "High overlap between Nasdaq growth and the technology sector sleeve.",
    explanation:
      "When QQQ stretches ahead of XLK, the relationship often pulls back toward the tighter tech basket. Right now the setup assumes QQQ is the leader and XLK is the laggard.",
    confidence: "High",
    timePeriod: "1 to 3 weeks",
    stockA: {
      ticker: "QQQ",
      direction: "Down",
      entryPrice: "$609.20",
      targetPrice: "$592",
      exitPrice: "$592",
      summary: "Expected to cool off slightly toward the pair mean.",
    },
    stockB: {
      ticker: "XLK",
      direction: "Up",
      entryPrice: "$139.54",
      targetPrice: "$144",
      exitPrice: "$144",
      summary: "Expected to catch up as the lagging side of the pair.",
    },
  },
  {
    pair: ["XME", "EWG"],
    relation: "Cyclical metals and mining exposure linked to Germany's industrial cycle.",
    explanation:
      "The pair tends to move with global manufacturing sentiment. The cleaner mean-reversion case is XME easing back while EWG recovers.",
    confidence: "Medium",
    timePeriod: "2 to 4 weeks",
    stockA: {
      ticker: "XME",
      direction: "Down",
      entryPrice: "$119.35",
      targetPrice: "$113",
      exitPrice: "$113",
      summary: "Expected to retrace after leading the cyclical move.",
    },
    stockB: {
      ticker: "EWG",
      direction: "Up",
      entryPrice: "$44.29",
      targetPrice: "$46",
      exitPrice: "$46",
      summary: "Expected to rebound toward the pair balance point.",
    },
  },
  {
    pair: ["TNA", "TLT"],
    relation: "Risk-on small caps against long-duration Treasuries.",
    explanation:
      "This is a wider macro relationship than the others. The simple read is that the risk-on leg is stretched and the defensive bond leg is due for a bounce.",
    confidence: "Low",
    timePeriod: "1 to 2 weeks",
    stockA: {
      ticker: "TNA",
      direction: "Down",
      entryPrice: "$53.12",
      targetPrice: "$49",
      exitPrice: "$49",
      summary: "Expected to fade if the risk trade cools.",
    },
    stockB: {
      ticker: "TLT",
      direction: "Up",
      entryPrice: "$87.25",
      targetPrice: "$91",
      exitPrice: "$91",
      summary: "Expected to recover as money rotates toward duration.",
    },
  },
  {
    pair: ["FAS", "FAZ"],
    relation: "Opposite leveraged financial ETFs with tightly linked but path-dependent moves.",
    explanation:
      "Because these are inverse leveraged products, the simple pair view is direct: if FAS is overextended, FAZ becomes the catch-up side.",
    confidence: "Medium",
    timePeriod: "3 to 7 trading days",
    stockA: {
      ticker: "FAS",
      direction: "Down",
      entryPrice: "$170.83",
      targetPrice: "$160",
      exitPrice: "$160",
      summary: "Expected to pull back from the stretched bullish side.",
    },
    stockB: {
      ticker: "FAZ",
      direction: "Up",
      entryPrice: "$43.97",
      targetPrice: "$46",
      exitPrice: "$46",
      summary: "Expected to rise as the bearish hedge side rebounds.",
    },
  },
  {
    pair: ["XLF", "XLU"],
    relation: "Financials versus defensive utilities.",
    explanation:
      "This pair reflects sector rotation. The current simple read is that financials have run too far ahead and utilities have room to recover.",
    confidence: "Medium",
    timePeriod: "2 to 5 weeks",
    stockA: {
      ticker: "XLF",
      direction: "Down",
      entryPrice: "$52.51",
      targetPrice: "$50",
      exitPrice: "$50",
      summary: "Expected to soften as the cyclical side mean-reverts.",
    },
    stockB: {
      ticker: "XLU",
      direction: "Up",
      entryPrice: "$43.07",
      targetPrice: "$45",
      exitPrice: "$45",
      summary: "Expected to grind higher as the defensive side catches up.",
    },
  },
  {
    pair: ["EWC", "EWA"],
    relation: "Two commodity-linked developed market country ETFs.",
    explanation:
      "Canada and Australia often respond to similar global growth and commodity regimes. The setup assumes EWC is rich and EWA is cheap relative to the pair.",
    confidence: "High",
    timePeriod: "2 to 4 weeks",
    stockA: {
      ticker: "EWC",
      direction: "Down",
      entryPrice: "$55.85",
      targetPrice: "$53",
      exitPrice: "$53",
      summary: "Expected to slip back toward the relationship midpoint.",
    },
    stockB: {
      ticker: "EWA",
      direction: "Up",
      entryPrice: "$26.74",
      targetPrice: "$28",
      exitPrice: "$28",
      summary: "Expected to move up as the lagging side closes the gap.",
    },
  },
  {
    pair: ["QLD", "QID"],
    relation: "Bull and bear leveraged Nasdaq products.",
    explanation:
      "This pair is mechanically linked but volatile. The simple read is that the long leveraged side is extended and the inverse side is due for a bounce.",
    confidence: "Low",
    timePeriod: "2 to 5 trading days",
    stockA: {
      ticker: "QLD",
      direction: "Down",
      entryPrice: "$71.96",
      targetPrice: "$67",
      exitPrice: "$67",
      summary: "Expected to pull back with the overextended bullish leg.",
    },
    stockB: {
      ticker: "QID",
      direction: "Up",
      entryPrice: "$19.41",
      targetPrice: "$21",
      exitPrice: "$21",
      summary: "Expected to rise as the inverse side rebounds.",
    },
  },
];

const CONFIDENCE_SCORE = {
  High: 3,
  Medium: 2,
  Low: 1,
};

const STORAGE_KEY = "pair-strategy-lab-state";
const SHARE_PARAM = "snapshot";

const state = {
  activeIndex: 0,
  selectedPairs: new Set([0, 1, 5]),
  filters: {
    confidence: "All",
    horizon: "All",
  },
  screenerSort: {
    key: "weight",
    direction: "desc",
  },
  regime: "balanced",
  stress: 35,
  plotAxes: {
    x: "modeledEdge",
    y: "stressScore",
  },
  monte: {
    trials: 2000,
    noisePct: 80,
    seed: 1337,
  },
  backtest: {
    history: 252,
    lookback: 20,
    entryZ: 2,
    exitZ: 0.5,
  },
};

const elements = {
  pairTabs: document.querySelector("#pairTabs"),
  relationTitle: document.querySelector("#relationTitle"),
  relationText: document.querySelector("#relationText"),
  relationExplanation: document.querySelector("#relationExplanation"),
  confidence: document.querySelector("#confidence"),
  timePeriod: document.querySelector("#timePeriod"),
  distortionSlider: document.querySelector("#distortionSlider"),
  distortionValue: document.querySelector("#distortionValue"),
  tensionFill: document.querySelector("#tensionFill"),
  reversionOdds: document.querySelector("#reversionOdds"),
  breakoutRisk: document.querySelector("#breakoutRisk"),
  payoutSkew: document.querySelector("#payoutSkew"),
  shockNarrative: document.querySelector("#shockNarrative"),
  stockAName: document.querySelector("#stockAName"),
  stockADirection: document.querySelector("#stockADirection"),
  stockAEntry: document.querySelector("#stockAEntry"),
  stockATarget: document.querySelector("#stockATarget"),
  stockAExit: document.querySelector("#stockAExit"),
  stockATime: document.querySelector("#stockATime"),
  stockASummary: document.querySelector("#stockASummary"),
  stockBName: document.querySelector("#stockBName"),
  stockBDirection: document.querySelector("#stockBDirection"),
  stockBEntry: document.querySelector("#stockBEntry"),
  stockBTarget: document.querySelector("#stockBTarget"),
  stockBExit: document.querySelector("#stockBExit"),
  stockBTime: document.querySelector("#stockBTime"),
  stockBSummary: document.querySelector("#stockBSummary"),
  capitalInput: document.querySelector("#capitalInput"),
  riskInput: document.querySelector("#riskInput"),
  confidenceFilter: document.querySelector("#confidenceFilter"),
  horizonFilter: document.querySelector("#horizonFilter"),
  sizingMode: document.querySelector("#sizingMode"),
  stopBudgetInput: document.querySelector("#stopBudgetInput"),
  regimeSelect: document.querySelector("#regimeSelect"),
  stressInput: document.querySelector("#stressInput"),
  stressValue: document.querySelector("#stressValue"),
  targetPairsInput: document.querySelector("#targetPairsInput"),
  themeCapInput: document.querySelector("#themeCapInput"),
  selectedCount: document.querySelector("#selectedCount"),
  riskDeployed: document.querySelector("#riskDeployed"),
  expectedPnL: document.querySelector("#expectedPnL"),
  avgConfidence: document.querySelector("#avgConfidence"),
  shareSnapshot: document.querySelector("#shareSnapshot"),
  shareFeedback: document.querySelector("#shareFeedback"),
  scenarioNarrative: document.querySelector("#scenarioNarrative"),
  scenarioExpectedPnL: document.querySelector("#scenarioExpectedPnL"),
  scenarioConfidenceDrag: document.querySelector("#scenarioConfidenceDrag"),
  scenarioBreakRisk: document.querySelector("#scenarioBreakRisk"),
  scenarioWeakestPair: document.querySelector("#scenarioWeakestPair"),
  scenarioRows: document.querySelector("#scenarioRows"),
  concentrationSummary: document.querySelector("#concentrationSummary"),
  primaryTheme: document.querySelector("#primaryTheme"),
  overlapScore: document.querySelector("#overlapScore"),
  diversificationRead: document.querySelector("#diversificationRead"),
  concentrationRows: document.querySelector("#concentrationRows"),
  autoBuildBook: document.querySelector("#autoBuildBook"),
  builderRoster: document.querySelector("#builderRoster"),
  builderScore: document.querySelector("#builderScore"),
  builderTradeoff: document.querySelector("#builderTradeoff"),
  builderNarrative: document.querySelector("#builderNarrative"),
  builderChecklist: document.querySelector("#builderChecklist"),
  plotSummary: document.querySelector("#plotSummary"),
  plotXSelect: document.querySelector("#plotXSelect"),
  plotYSelect: document.querySelector("#plotYSelect"),
  crossSectionPlot: document.querySelector("#crossSectionPlot"),
  allocationRows: document.querySelector("#allocationRows"),
  exportBook: document.querySelector("#exportBook"),
  toggleCurrentPair: document.querySelector("#toggleCurrentPair"),
  screenerSummary: document.querySelector("#screenerSummary"),
  screenerRows: document.querySelector("#screenerRows"),
  monteSummary: document.querySelector("#monteSummary"),
  monteTrials: document.querySelector("#monteTrials"),
  monteNoise: document.querySelector("#monteNoise"),
  monteNoiseValue: document.querySelector("#monteNoiseValue"),
  monteReseed: document.querySelector("#monteReseed"),
  monteMedian: document.querySelector("#monteMedian"),
  monteMean: document.querySelector("#monteMean"),
  monteP5: document.querySelector("#monteP5"),
  monteP95: document.querySelector("#monteP95"),
  monteWinRate: document.querySelector("#monteWinRate"),
  monteWorst: document.querySelector("#monteWorst"),
  monteHistogram: document.querySelector("#monteHistogram"),
  monteNarrative: document.querySelector("#monteNarrative"),
  backtestSummary: document.querySelector("#backtestSummary"),
  btHistory: document.querySelector("#btHistory"),
  btLookback: document.querySelector("#btLookback"),
  btEntryZ: document.querySelector("#btEntryZ"),
  btEntryZValue: document.querySelector("#btEntryZValue"),
  btExitZ: document.querySelector("#btExitZ"),
  btExitZValue: document.querySelector("#btExitZValue"),
  btTotalReturn: document.querySelector("#btTotalReturn"),
  btTrades: document.querySelector("#btTrades"),
  btWinRate: document.querySelector("#btWinRate"),
  btProfitFactor: document.querySelector("#btProfitFactor"),
  btMaxDD: document.querySelector("#btMaxDD"),
  btSharpe: document.querySelector("#btSharpe"),
  btZChart: document.querySelector("#btZChart"),
  btEquityChart: document.querySelector("#btEquityChart"),
  backtestNarrative: document.querySelector("#backtestNarrative"),
  ticketTitle: document.querySelector("#ticketTitle"),
  ticketStatus: document.querySelector("#ticketStatus"),
  planRiskBudget: document.querySelector("#planRiskBudget"),
  planGrossExposure: document.querySelector("#planGrossExposure"),
  planExpectedReward: document.querySelector("#planExpectedReward"),
  planRewardRisk: document.querySelector("#planRewardRisk"),
  planMaxHold: document.querySelector("#planMaxHold"),
  planHedgeSplit: document.querySelector("#planHedgeSplit"),
  legATicker: document.querySelector("#legATicker"),
  legAAction: document.querySelector("#legAAction"),
  legAEntry: document.querySelector("#legAEntry"),
  legATarget: document.querySelector("#legATarget"),
  legAStop: document.querySelector("#legAStop"),
  legAShares: document.querySelector("#legAShares"),
  legANotional: document.querySelector("#legANotional"),
  legBTicker: document.querySelector("#legBTicker"),
  legBAction: document.querySelector("#legBAction"),
  legBEntry: document.querySelector("#legBEntry"),
  legBTarget: document.querySelector("#legBTarget"),
  legBStop: document.querySelector("#legBStop"),
  legBShares: document.querySelector("#legBShares"),
  legBNotional: document.querySelector("#legBNotional"),
  planNarrative: document.querySelector("#planNarrative"),
  planChecklist: document.querySelector("#planChecklist"),
};

function parseDollar(value) {
  return Number(String(value).replace(/[$,]/g, ""));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value, digits = 1) {
  return `${(value * 100).toFixed(digits)}%`;
}

function formatCount(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSessions(value) {
  return `${value} sessions`;
}

function formatSignedMoney(value) {
  return `${value >= 0 ? "+" : "-"}${formatMoney(Math.abs(value))}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function encodeSnapshot(payload) {
  return window.btoa(
    encodeURIComponent(JSON.stringify(payload)).replace(/%([0-9A-F]{2})/g, (_, hex) =>
      String.fromCharCode(Number.parseInt(hex, 16))
    )
  );
}

function decodeSnapshot(value) {
  const binary = window.atob(value);
  const encoded = Array.from(binary, (char) =>
    `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
  ).join("");
  return JSON.parse(decodeURIComponent(encoded));
}

function getTimeBucket(timePeriod) {
  if (timePeriod.includes("trading days") || timePeriod.includes("1 to 2 weeks")) {
    return "Short";
  }
  if (timePeriod.includes("2 to 4 weeks") || timePeriod.includes("1 to 3 weeks")) {
    return "Medium";
  }
  return "Long";
}

function getMaxHoldSessions(timePeriod) {
  const match = String(timePeriod).match(/(\d+)\s+to\s+(\d+)\s+(trading days|weeks)/i);
  if (!match) {
    return 15;
  }

  const upper = Number(match[2]);
  return match[3].toLowerCase() === "weeks" ? upper * 5 : upper;
}

function getFilteredIndices() {
  return PAIR_SIGNALS.map((_, index) => index).filter((index) => {
    const signal = PAIR_SIGNALS[index];
    if (state.filters.confidence !== "All" && signal.confidence !== state.filters.confidence) {
      return false;
    }

    const bucket = getTimeBucket(signal.timePeriod);
    if (state.filters.horizon !== "All" && bucket !== state.filters.horizon) {
      return false;
    }

    return true;
  });
}

function getSelectedFilteredIndices() {
  return getFilteredIndices().filter((index) => state.selectedPairs.has(index));
}

function getBudgetInputs() {
  const capital = Math.max(1000, Number(elements.capitalInput.value) || 100000);
  const riskPct = clamp((Number(elements.riskInput.value) || 5) / 100, 0.01, 0.2);
  const stopBudgetPct = clamp((Number(elements.stopBudgetInput.value) || 2.2) / 100, 0.005, 0.1);
  return {
    capital,
    riskPct,
    stopBudgetPct,
    maxRiskDollars: capital * riskPct,
  };
}

function getPairDistortionBias(index) {
  if (index === state.activeIndex) {
    return Number(elements.distortionSlider.value) / 10;
  }
  return 0;
}

function getStressIntensity() {
  return clamp((Number(elements.stressInput.value) || state.stress || 35) / 100, 0, 1);
}

function getPairTags(signal) {
  const members = new Set([signal.pair[0], signal.pair[1], signal.stockA.ticker, signal.stockB.ticker]);
  const tags = new Set();

  if ([...members].some((ticker) => ["QQQ", "XLK", "QLD", "QID", "TNA"].includes(ticker))) {
    tags.add("growth");
  }
  if ([...members].some((ticker) => ["TLT", "XLU", "FAZ", "QID"].includes(ticker))) {
    tags.add("defensive");
  }
  if ([...members].some((ticker) => ["XME", "EWC", "EWA", "XLF", "FAS"].includes(ticker))) {
    tags.add("cyclical");
  }
  if ([...members].some((ticker) => ["TLT", "XLU"].includes(ticker))) {
    tags.add("rates");
  }
  if ([...members].some((ticker) => ["FAS", "FAZ", "QLD", "QID", "TNA"].includes(ticker))) {
    tags.add("leveraged");
  }
  if (signal.confidence === "Low") {
    tags.add("fragile");
  }

  return tags;
}

function getThemeLabel(tag) {
  const labels = {
    growth: "Growth beta",
    defensive: "Defensive ballast",
    cyclical: "Cyclical beta",
    rates: "Rates sensitivity",
    leveraged: "Leverage path risk",
    fragile: "Fragile thesis",
  };

  return labels[tag] || tag;
}

function getRegimeProfile() {
  const profiles = {
    balanced: {
      label: "Balanced tape",
      narrative:
        "The market is trading in two-way flow. Mean reversion still matters, but dislocations close at a normal pace instead of violently snapping back.",
      edgeShift: 0,
      breakShift: 0,
      confidenceDrag: 0,
      tagAdjustments: {
        leveraged: { edge: -0.03, break: 0.03 },
      },
    },
    riskOff: {
      label: "Risk-off flush",
      narrative:
        "Liquidity thins out, crowded growth trades de-rate, and defensive catch-up ideas hold together better than high-beta spreads.",
      edgeShift: -0.06,
      breakShift: 0.08,
      confidenceDrag: 0.2,
      tagAdjustments: {
        growth: { edge: -0.12, break: 0.1 },
        cyclical: { edge: -0.08, break: 0.07 },
        defensive: { edge: 0.05, break: -0.03 },
        rates: { edge: 0.04, break: -0.02 },
        leveraged: { edge: -0.14, break: 0.12 },
        fragile: { edge: -0.08, break: 0.05 },
      },
    },
    riskOn: {
      label: "Risk-on chase",
      narrative:
        "Momentum stays hot and crowded leaders can remain overextended. The book gets paid faster when it owns the laggard side without leaning too hard on inverse products.",
      edgeShift: 0.03,
      breakShift: 0.02,
      confidenceDrag: 0.08,
      tagAdjustments: {
        growth: { edge: 0.06, break: -0.02 },
        cyclical: { edge: 0.04, break: -0.01 },
        defensive: { edge: -0.05, break: 0.03 },
        leveraged: { edge: -0.02, break: 0.06 },
      },
    },
    inflation: {
      label: "Inflation shock",
      narrative:
        "Rates volatility dominates. Commodity and financial sleeves can keep pressing while duration-heavy hedges become less reliable.",
      edgeShift: -0.02,
      breakShift: 0.05,
      confidenceDrag: 0.14,
      tagAdjustments: {
        cyclical: { edge: 0.03, break: 0.01 },
        rates: { edge: -0.09, break: 0.08 },
        defensive: { edge: -0.04, break: 0.04 },
        growth: { edge: -0.03, break: 0.03 },
        leveraged: { edge: -0.08, break: 0.09 },
      },
    },
  };

  return profiles[state.regime] || profiles.balanced;
}

function getPairScenarioMetrics(index) {
  const signal = PAIR_SIGNALS[index];
  const profile = getRegimeProfile();
  const intensity = getStressIntensity();
  const tags = getPairTags(signal);
  let edgeModifier = profile.edgeShift;
  let breakModifier = profile.breakShift;

  for (const tag of tags) {
    if (profile.tagAdjustments[tag]) {
      edgeModifier += profile.tagAdjustments[tag].edge || 0;
      breakModifier += profile.tagAdjustments[tag].break || 0;
    }
  }

  const distortionRelief = Math.abs(getPairDistortionBias(index)) * 0.04;
  const edgeDelta = edgeModifier * intensity + distortionRelief;
  const breakRisk = clamp(0.18 + breakModifier * intensity + (tags.has("leveraged") ? 0.05 : 0), 0.05, 0.92);
  const confidencePenalty = clamp(profile.confidenceDrag * intensity + (tags.has("fragile") ? 0.08 * intensity : 0), 0, 0.7);
  const stressScore = clamp(0.62 + edgeDelta - breakRisk * 0.28 - confidencePenalty * 0.4, 0.05, 0.95);

  return {
    profile,
    edgeDelta,
    breakRisk,
    confidencePenalty,
    stressScore,
  };
}

function getPairExpectedReturn(index) {
  const signal = PAIR_SIGNALS[index];
  const sideAReturn = Math.abs(
    (parseDollar(signal.stockA.targetPrice) - parseDollar(signal.stockA.entryPrice)) /
      parseDollar(signal.stockA.entryPrice)
  );
  const sideBReturn = Math.abs(
    (parseDollar(signal.stockB.targetPrice) - parseDollar(signal.stockB.entryPrice)) /
      parseDollar(signal.stockB.entryPrice)
  );
  const base = (sideAReturn + sideBReturn) / 2;
  const confidenceBoost = 1 + CONFIDENCE_SCORE[signal.confidence] * 0.08;
  const distortionBoost = 1 + Math.abs(getPairDistortionBias(index)) * 0.2;
  const scenario = getPairScenarioMetrics(index);
  return base * confidenceBoost * distortionBoost * (1 + scenario.edgeDelta) * (1 - scenario.confidencePenalty * 0.35);
}

function getPairWeight(index) {
  const signal = PAIR_SIGNALS[index];
  const confidenceWeight = CONFIDENCE_SCORE[signal.confidence];
  const horizon = getTimeBucket(signal.timePeriod);
  const horizonPenalty = horizon === "Short" ? 0.8 : horizon === "Medium" ? 1 : 0.9;
  const distortionEdge = index === state.activeIndex ? 1 + Math.abs(getPairDistortionBias(index)) * 0.35 : 1;
  const scenario = getPairScenarioMetrics(index);
  const stressWeight = 0.7 + scenario.stressScore * 0.9;
  const breakPenalty = 1 - scenario.breakRisk * 0.2;
  return confidenceWeight * horizonPenalty * distortionEdge * stressWeight * breakPenalty;
}

function getTradeSide(direction) {
  return direction === "Up" ? "Long" : "Short";
}

function getSizingWeights(signal) {
  const mode = elements.sizingMode.value;
  const distortion = Number(elements.distortionSlider.value);
  const moveA = Math.abs(
    (parseDollar(signal.stockA.targetPrice) - parseDollar(signal.stockA.entryPrice)) /
      parseDollar(signal.stockA.entryPrice)
  );
  const moveB = Math.abs(
    (parseDollar(signal.stockB.targetPrice) - parseDollar(signal.stockB.entryPrice)) /
      parseDollar(signal.stockB.entryPrice)
  );

  if (mode === "conviction") {
    if (distortion === 0) {
      return {
        aWeight: 0.5,
        bWeight: 0.5,
        label: "Conviction weighted",
      };
    }

    const baseTilt = signal.confidence === "High" ? 0.08 : signal.confidence === "Medium" ? 0.05 : 0.03;
    const distortionTilt = Math.min(0.08, Math.abs(distortion) * 0.01);
    const tilt = Math.min(0.16, baseTilt + distortionTilt);
    const laggardIsA = distortion < 0;
    return laggardIsA
      ? {
          aWeight: 0.5 + tilt,
          bWeight: 0.5 - tilt,
          label: "Conviction weighted",
        }
      : {
          aWeight: 0.5 - tilt,
          bWeight: 0.5 + tilt,
          label: "Conviction weighted",
        };
  }

  if (mode === "volatility") {
    const inverseA = 1 / Math.max(moveA, 0.01);
    const inverseB = 1 / Math.max(moveB, 0.01);
    const total = inverseA + inverseB;
    return {
      aWeight: inverseA / total,
      bWeight: inverseB / total,
      label: "Volatility adjusted",
    };
  }

  return {
    aWeight: 0.5,
    bWeight: 0.5,
    label: "Balanced",
  };
}

function getLegExpectedReturn(stock) {
  return Math.abs((parseDollar(stock.targetPrice) - parseDollar(stock.entryPrice)) / parseDollar(stock.entryPrice));
}

function sizePairLegs({ riskBudget, stopPct, sizing, signal }) {
  const entryA = parseDollar(signal.stockA.entryPrice);
  const entryB = parseDollar(signal.stockB.entryPrice);
  const stopRiskA = entryA * stopPct;
  const stopRiskB = entryB * stopPct;
  const riskBudgetA = riskBudget * sizing.aWeight;
  const riskBudgetB = riskBudget * sizing.bWeight;
  const sharesA = Math.max(1, Math.floor(riskBudgetA / Math.max(stopRiskA, 0.01)));
  const sharesB = Math.max(1, Math.floor(riskBudgetB / Math.max(stopRiskB, 0.01)));
  const notionalA = sharesA * entryA;
  const notionalB = sharesB * entryB;
  const actualRiskA = sharesA * stopRiskA;
  const actualRiskB = sharesB * stopRiskB;

  return {
    entryA,
    entryB,
    sharesA,
    sharesB,
    notionalA,
    notionalB,
    actualRiskA,
    actualRiskB,
    actualRisk: actualRiskA + actualRiskB,
    actualGrossExposure: notionalA + notionalB,
  };
}

function getPortfolioRows(indices) {
  const { maxRiskDollars, stopBudgetPct } = getBudgetInputs();
  if (!indices.length) {
    return [];
  }

  const baseRows = indices.map((index) => ({
    index,
    signal: PAIR_SIGNALS[index],
    weight: getPairWeight(index),
    expectedReturn: getPairExpectedReturn(index),
  }));
  const totalWeight = baseRows.reduce((sum, row) => sum + row.weight, 0);

  return baseRows.map((row) => {
    const riskBudget = totalWeight > 0 ? (maxRiskDollars * row.weight) / totalWeight : 0;
    const grossExposure = stopBudgetPct > 0 ? riskBudget / stopBudgetPct : 0;
    const expectedPnL = grossExposure * row.expectedReturn;
    return {
      ...row,
      pairLabel: `${row.signal.pair[0]} / ${row.signal.pair[1]}`,
      riskBudget,
      grossExposure,
      expectedPnL,
      weightPct: totalWeight > 0 ? (row.weight / totalWeight) * 100 : 0,
    };
  });
}

function getScreenedRows(indices) {
  const rows = indices
    .map((index) => {
      const signal = PAIR_SIGNALS[index];
      return {
        index,
        signal,
        pairLabel: `${signal.pair[0]} / ${signal.pair[1]}`,
        modeledEdge: getPairExpectedReturn(index),
        weight: getPairWeight(index),
        stressScore: getPairScenarioMetrics(index).stressScore,
        selected: state.selectedPairs.has(index),
      };
    });

  const sorters = {
    confidence: (left, right) => CONFIDENCE_SCORE[left.signal.confidence] - CONFIDENCE_SCORE[right.signal.confidence],
    modeledEdge: (left, right) => left.modeledEdge - right.modeledEdge,
    weight: (left, right) => left.weight - right.weight,
    stressScore: (left, right) => left.stressScore - right.stressScore,
  };

  const sorter = sorters[state.screenerSort.key] || sorters.weight;
  const direction = state.screenerSort.direction === "asc" ? 1 : -1;

  return rows.sort((left, right) => {
    const primary = sorter(left, right) * direction;
    if (primary !== 0) {
      return primary > 0 ? 1 : -1;
    }
    return left.pairLabel.localeCompare(right.pairLabel);
  });
}

function toggleScreenerSort(key) {
  if (state.screenerSort.key === key) {
    state.screenerSort.direction = state.screenerSort.direction === "desc" ? "asc" : "desc";
    return;
  }

  state.screenerSort.key = key;
  state.screenerSort.direction = key === "confidence" ? "desc" : "desc";
}

function buildSortLabel(key, label) {
  if (state.screenerSort.key !== key) {
    return label;
  }
  return `${label} ${state.screenerSort.direction === "desc" ? "↓" : "↑"}`;
}

function getSelectedBookExportRows() {
  const selectedFiltered = getSelectedFilteredIndices();
  return getPortfolioRows(selectedFiltered)
    .sort((left, right) => right.weight - left.weight)
    .map((row) => ({
      pair: row.pairLabel,
      confidence: row.signal.confidence,
      horizon: row.signal.timePeriod,
      weightPct: row.weightPct,
      riskBudget: row.riskBudget,
      expectedPnL: row.expectedPnL,
    }));
}

function getPlotMetricConfig() {
  return {
    modeledEdge: {
      label: "Modeled edge",
      format: (value) => formatPercent(value, 1),
    },
    stressScore: {
      label: "Stress fit",
      format: (value) => formatPercent(value, 0),
    },
    breakRisk: {
      label: "Break risk",
      format: (value) => formatPercent(value, 0),
    },
    riskBudget: {
      label: "Risk budget",
      format: (value) => formatMoney(value),
    },
    grossExposure: {
      label: "Gross exposure",
      format: (value) => formatMoney(value),
    },
  };
}

function mixColor(start, end, weight) {
  const ratio = clamp(weight, 0, 1);
  const mixed = start.map((channel, index) => Math.round(channel + (end[index] - channel) * ratio));
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}

function getViridisColor(value) {
  const stops = [
    { at: 0, color: [68, 1, 84] },
    { at: 0.25, color: [59, 82, 139] },
    { at: 0.5, color: [33, 145, 140] },
    { at: 0.75, color: [94, 201, 98] },
    { at: 1, color: [253, 231, 37] },
  ];

  const safeValue = clamp(value, 0, 1);
  for (let index = 1; index < stops.length; index += 1) {
    const left = stops[index - 1];
    const right = stops[index];
    if (safeValue <= right.at) {
      const localRatio = (safeValue - left.at) / (right.at - left.at);
      return mixColor(left.color, right.color, localRatio);
    }
  }

  return mixColor(stops[stops.length - 2].color, stops[stops.length - 1].color, 1);
}

function getPlotRows(indices) {
  const portfolioMap = new Map(getPortfolioRows(indices).map((row) => [row.index, row]));
  return getScreenedRows(indices).map((row) => {
    const scenario = getPairScenarioMetrics(row.index);
    const portfolioRow = portfolioMap.get(row.index);
    return {
      ...row,
      breakRisk: scenario.breakRisk,
      riskBudget: portfolioRow?.riskBudget || 0,
      grossExposure: portfolioRow?.grossExposure || 0,
      weightPct: portfolioRow?.weightPct || 0,
    };
  });
}

function buildTicks(min, max, count = 5) {
  if (min === max) {
    return [min];
  }

  return Array.from({ length: count }, (_, index) => min + ((max - min) * index) / (count - 1));
}

function getConcentrationRows(indices) {
  const portfolioRows = getPortfolioRows(indices);
  if (!portfolioRows.length) {
    return [];
  }

  const themeMap = new Map();

  portfolioRows.forEach((row) => {
    const tags = [...getPairTags(row.signal)];
    tags.forEach((tag) => {
      const current = themeMap.get(tag) || {
        tag,
        label: getThemeLabel(tag),
        grossExposure: 0,
        riskBudget: 0,
        pairs: [],
      };
      current.grossExposure += row.grossExposure;
      current.riskBudget += row.riskBudget;
      current.pairs.push(row.pairLabel);
      themeMap.set(tag, current);
    });
  });

  const totalGross = portfolioRows.reduce((sum, row) => sum + row.grossExposure, 0);

  return [...themeMap.values()]
    .map((row) => ({
      ...row,
      overlapPct: totalGross > 0 ? row.grossExposure / totalGross : 0,
      pairCount: row.pairs.length,
    }))
    .sort((left, right) => right.overlapPct - left.overlapPct);
}

function getBuilderConstraints() {
  return {
    targetPairs: clamp(Number(elements.targetPairsInput.value) || 4, 1, PAIR_SIGNALS.length),
    themeCap: clamp((Number(elements.themeCapInput.value) || 55) / 100, 0.25, 0.9),
  };
}

function getRecommendedBook() {
  const filtered = getFilteredIndices();
  const candidates = getScreenedRows(filtered).slice().sort((left, right) => right.weight - left.weight);
  const { targetPairs, themeCap } = getBuilderConstraints();
  const chosen = [];
  const skipped = [];
  const themeCounts = new Map();

  const canAddCandidate = (candidate, allowSoftCap = false) => {
    const nextCount = chosen.length + 1;
    const tags = [...getPairTags(candidate.signal)];

    return tags.every((tag) => {
      const currentCount = themeCounts.get(tag) || 0;
      const nextShare = (currentCount + 1) / nextCount;
      return allowSoftCap || nextShare <= themeCap;
    });
  };

  candidates.forEach((candidate) => {
    if (chosen.length >= targetPairs) {
      return;
    }

    if (canAddCandidate(candidate)) {
      chosen.push(candidate);
      [...getPairTags(candidate.signal)].forEach((tag) => {
        themeCounts.set(tag, (themeCounts.get(tag) || 0) + 1);
      });
      return;
    }

    skipped.push(candidate);
  });

  if (chosen.length < targetPairs) {
    skipped.forEach((candidate) => {
      if (chosen.length >= targetPairs) {
        return;
      }
      if (chosen.some((row) => row.index === candidate.index)) {
        return;
      }
      if (canAddCandidate(candidate, true)) {
        chosen.push(candidate);
        [...getPairTags(candidate.signal)].forEach((tag) => {
          themeCounts.set(tag, (themeCounts.get(tag) || 0) + 1);
        });
      }
    });
  }

  const chosenIndices = chosen.map((row) => row.index);
  const concentration = getConcentrationRows(chosenIndices);
  const scoreBase = chosen.reduce((sum, row) => sum + row.weight * (0.55 + row.stressScore * 0.45), 0);
  const overlapPenalty = concentration.slice(0, 2).reduce((sum, row) => sum + row.overlapPct, 0) * 18;
  const qualityScore = clamp(scoreBase * 8 - overlapPenalty, 0, 100);
  const topSkipped = skipped[0] || null;
  const primaryCrowding = concentration[0] || null;

  return {
    chosen,
    chosenIndices,
    skipped,
    concentration,
    qualityScore,
    primaryCrowding,
    topSkipped,
    themeCap,
    targetPairs,
  };
}

function getSerializableState() {
  return {
    activeIndex: state.activeIndex,
    selectedPairs: [...state.selectedPairs].sort((left, right) => left - right),
    filters: { ...state.filters },
    capitalInput: elements.capitalInput.value,
    riskInput: elements.riskInput.value,
    distortion: elements.distortionSlider.value,
    sizingMode: elements.sizingMode.value,
    stopBudgetInput: elements.stopBudgetInput.value,
    regime: state.regime,
    stress: elements.stressInput.value,
    targetPairsInput: elements.targetPairsInput.value,
    themeCapInput: elements.themeCapInput.value,
    plotAxes: { ...state.plotAxes },
    screenerSort: { ...state.screenerSort },
    monte: { ...state.monte },
    backtest: { ...state.backtest },
  };
}

function buildSnapshotUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodeSnapshot(getSerializableState()));
  return url.toString();
}

function syncSnapshotUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set(SHARE_PARAM, encodeSnapshot(getSerializableState()));
  window.history.replaceState({}, "", url);
}

function setShareFeedback(message, isError = false) {
  elements.shareFeedback.textContent = message;
  elements.shareFeedback.style.color = isError ? "var(--down)" : "var(--muted)";
}

async function copySnapshotLink() {
  const url = buildSnapshotUrl();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
    } else {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setShareFeedback("Snapshot link copied.");
  } catch (error) {
    setShareFeedback("Copy failed. Use the URL bar link.", true);
  }
}

function exportBookCsv() {
  const rows = getSelectedBookExportRows();
  if (!rows.length) {
    return;
  }

  const header = ["Pair", "Confidence", "Horizon", "WeightPct", "RiskBudgetUSD", "ExpectedPnLUSD"];
  const lines = rows.map((row) => [
    row.pair,
    row.confidence,
    row.horizon,
    row.weightPct.toFixed(2),
    row.riskBudget.toFixed(2),
    row.expectedPnL.toFixed(2),
  ]);

  const csv = [header, ...lines]
    .map((fields) => fields.map((field) => `"${String(field).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `pair-book-${stamp}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function buildPlanChecklist(plan) {
  const items = [];
  const earlyReview = Math.max(2, Math.round(plan.maxHoldSessions * 0.35));

  items.push(
    `${plan.sideA.action} ${plan.signal.stockA.ticker} and ${plan.sideB.action} ${plan.signal.stockB.ticker} with a ${plan.hedgeSplit} gross split under ${plan.sizingLabel.toLowerCase()} sizing.`
  );

  if (Math.abs(plan.distortion) >= 7) {
    items.push("Stretch is extreme. Work the order in clips instead of crossing full size on the first print.");
  } else {
    items.push("Spread tension is moderate. One clean entry is acceptable if the open is liquid and the spread is stable.");
  }

  if (plan.rewardRisk < 1.5) {
    items.push("Reward to risk is thin at the current stop budget. Wait for a cleaner dislocation or tighten the stop before sizing up.");
  } else {
    items.push("Modeled reward to risk is healthy. If the spread starts converging early, let the trade work instead of taking the first small win.");
  }

  items.push(
    `Reassess after ${formatSessions(earlyReview)}. If the pair is still widening or the thesis has not started to play out, cut it before the full ${formatSessions(plan.maxHoldSessions)} window expires.`
  );

  if (!plan.isLive) {
    items.push("This pair is not currently in the selected book. The ticket is a preview using the present risk settings as if you added it now.");
  }

  return items;
}

function getActivePlan() {
  const signal = PAIR_SIGNALS[state.activeIndex];
  if (!signal) {
    return null;
  }

  const selectedFiltered = getSelectedFilteredIndices();
  const isLive = selectedFiltered.includes(state.activeIndex);
  const scope = isLive ? selectedFiltered : [...new Set([...selectedFiltered, state.activeIndex])];
  const portfolioRow = getPortfolioRows(scope).find((row) => row.index === state.activeIndex);

  if (!portfolioRow) {
    return null;
  }

  const stopPct = getBudgetInputs().stopBudgetPct;
  const sizing = getSizingWeights(signal);
  const sizedLegs = sizePairLegs({
    riskBudget: portfolioRow.riskBudget,
    stopPct,
    sizing,
    signal,
  });
  const { entryA, entryB } = sizedLegs;
  const targetA = parseDollar(signal.stockA.targetPrice);
  const targetB = parseDollar(signal.stockB.targetPrice);
  const baseExpectedReward =
    sizedLegs.notionalA * getLegExpectedReturn(signal.stockA) +
    sizedLegs.notionalB * getLegExpectedReturn(signal.stockB);
  const scenario = getPairScenarioMetrics(state.activeIndex);
  const expectedReward = baseExpectedReward * (1 + scenario.edgeDelta) * (1 - scenario.breakRisk * 0.28);
  const rewardRisk = sizedLegs.actualRisk > 0 ? expectedReward / sizedLegs.actualRisk : 0;
  const sideAAction = getTradeSide(signal.stockA.direction);
  const sideBAction = getTradeSide(signal.stockB.direction);
  const stopA = sideAAction === "Long" ? entryA * (1 - stopPct) : entryA * (1 + stopPct);
  const stopB = sideBAction === "Long" ? entryB * (1 - stopPct) : entryB * (1 + stopPct);
  const grossSplitA = sizedLegs.actualGrossExposure > 0 ? (sizedLegs.notionalA / sizedLegs.actualGrossExposure) * 100 : 50;
  const grossSplitB = sizedLegs.actualGrossExposure > 0 ? (sizedLegs.notionalB / sizedLegs.actualGrossExposure) * 100 : 50;
  const hedgeSplit = `${Math.round(grossSplitA)} / ${Math.round(grossSplitB)}`;
  const maxHoldSessions = getMaxHoldSessions(signal.timePeriod);
  const distortion = Number(elements.distortionSlider.value);

  const plan = {
    signal,
    isLive,
    sizingLabel: sizing.label,
    distortion,
    riskBudget: portfolioRow.riskBudget,
    actualRisk: sizedLegs.actualRisk,
    grossExposure: sizedLegs.actualGrossExposure,
    expectedReward,
    rewardRisk,
    hedgeSplit,
    maxHoldSessions,
    scenario,
    sideA: {
      ticker: signal.stockA.ticker,
      action: sideAAction,
      entry: entryA,
      target: targetA,
      stop: stopA,
      shares: sizedLegs.sharesA,
      notional: sizedLegs.notionalA,
    },
    sideB: {
      ticker: signal.stockB.ticker,
      action: sideBAction,
      entry: entryB,
      target: targetB,
      stop: stopB,
      shares: sizedLegs.sharesB,
      notional: sizedLegs.notionalB,
    },
  };

  return {
    ...plan,
    checklist: buildPlanChecklist(plan),
  };
}

function persistState() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(getSerializableState()));
  } catch (error) {
    // Ignore persistence failures in private browsing or restricted environments.
  }
}

function applySavedState(saved) {
  if (!saved || typeof saved !== "object") {
    return;
  }

  if (Number.isInteger(saved.activeIndex)) {
    state.activeIndex = clamp(saved.activeIndex, 0, PAIR_SIGNALS.length - 1);
  }
  if (Array.isArray(saved.selectedPairs)) {
    state.selectedPairs = new Set(
      saved.selectedPairs.filter((index) => Number.isInteger(index) && index >= 0 && index < PAIR_SIGNALS.length)
    );
  }
  if (saved.filters?.confidence) {
    state.filters.confidence = saved.filters.confidence;
  }
  if (saved.filters?.horizon) {
    state.filters.horizon = saved.filters.horizon;
  }
  if (saved.screenerSort?.key && saved.screenerSort?.direction) {
    state.screenerSort = saved.screenerSort;
  }
  if (saved.plotAxes?.x && saved.plotAxes?.y) {
    state.plotAxes = saved.plotAxes;
  }
  if (saved.regime) {
    state.regime = saved.regime;
  }
  if (saved.stress !== undefined) {
    state.stress = clamp(Number(saved.stress) || 35, 0, 100);
  }

  if (saved.capitalInput !== undefined) {
    elements.capitalInput.value = saved.capitalInput;
  }
  if (saved.riskInput !== undefined) {
    elements.riskInput.value = saved.riskInput;
  }
  if (saved.distortion !== undefined) {
    elements.distortionSlider.value = saved.distortion;
  }
  if (saved.sizingMode !== undefined) {
    elements.sizingMode.value = saved.sizingMode;
  }
  if (saved.stopBudgetInput !== undefined) {
    elements.stopBudgetInput.value = saved.stopBudgetInput;
  }
  if (saved.targetPairsInput !== undefined) {
    elements.targetPairsInput.value = saved.targetPairsInput;
  }
  if (saved.themeCapInput !== undefined) {
    elements.themeCapInput.value = saved.themeCapInput;
  }
  elements.regimeSelect.value = state.regime;
  elements.stressInput.value = String(state.stress);
  elements.plotXSelect.value = state.plotAxes.x;
  elements.plotYSelect.value = state.plotAxes.y;

  elements.confidenceFilter.value = state.filters.confidence;
  elements.horizonFilter.value = state.filters.horizon;

  if (saved.monte && typeof saved.monte === "object") {
    state.monte.trials = clamp(Number(saved.monte.trials) || state.monte.trials, 100, 20000);
    state.monte.noisePct = clamp(Number(saved.monte.noisePct) || state.monte.noisePct, 10, 400);
    if (Number.isFinite(saved.monte.seed)) {
      state.monte.seed = (Number(saved.monte.seed) >>> 0) || state.monte.seed;
    }
  }
  elements.monteTrials.value = String(state.monte.trials);
  elements.monteNoise.value = String(state.monte.noisePct);

  if (saved.backtest && typeof saved.backtest === "object") {
    state.backtest.history = clamp(Math.round(Number(saved.backtest.history) || state.backtest.history), 120, 756);
    state.backtest.lookback = clamp(Math.round(Number(saved.backtest.lookback) || state.backtest.lookback), 10, 90);
    state.backtest.entryZ = clamp(Number(saved.backtest.entryZ) || state.backtest.entryZ, 1, 3.5);
    state.backtest.exitZ = clamp(Number(saved.backtest.exitZ) || state.backtest.exitZ, 0, 2);
  }
  elements.btHistory.value = String(state.backtest.history);
  elements.btLookback.value = String(state.backtest.lookback);
  elements.btEntryZ.value = String(state.backtest.entryZ);
  elements.btExitZ.value = String(state.backtest.exitZ);
}

function hydrateState() {
  let loaded = false;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      applySavedState(JSON.parse(raw));
      loaded = true;
    }
  } catch (error) {
    // Ignore malformed local state and continue with defaults.
  }

  try {
    const snapshot = new URL(window.location.href).searchParams.get(SHARE_PARAM);
    if (snapshot) {
      applySavedState(decodeSnapshot(snapshot));
      setShareFeedback(loaded ? "Loaded shared snapshot over saved local state." : "Loaded shared snapshot.");
    }
  } catch (error) {
    setShareFeedback("Snapshot link was invalid. Using local defaults.", true);
  }
}

function renderTabs() {
  const filtered = getFilteredIndices();

  if (!filtered.includes(state.activeIndex)) {
    state.activeIndex = filtered.length ? filtered[0] : 0;
  }

  elements.pairTabs.innerHTML = filtered.length
    ? filtered
        .map((index) => {
          const entry = PAIR_SIGNALS[index];
          const active = index === state.activeIndex ? "is-active" : "";
          const selected = state.selectedPairs.has(index) ? "is-selected" : "";
          return `
            <button class="pair-tab ${active} ${selected}" type="button" data-index="${index}">
              ${entry.pair[0]} / ${entry.pair[1]}
            </button>
          `;
        })
        .join("")
    : '<p class="empty-note">No pairs match current filters.</p>';

  elements.pairTabs.querySelectorAll(".pair-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeIndex = Number(button.dataset.index);
      renderAll();
    });
  });
}

function renderSignal() {
  const signal = PAIR_SIGNALS[state.activeIndex];
  if (!signal) {
    return;
  }

  elements.relationTitle.textContent = `${signal.pair[0]} and ${signal.pair[1]}`;
  elements.relationText.textContent = signal.relation;
  elements.relationExplanation.textContent = signal.explanation;
  elements.confidence.textContent = `${signal.confidence} confidence`;
  elements.timePeriod.textContent = signal.timePeriod;

  renderStockCard(
    signal.stockA,
    elements.stockAName,
    elements.stockADirection,
    elements.stockAEntry,
    elements.stockATarget,
    elements.stockAExit,
    elements.stockATime,
    elements.stockASummary
  );
  renderStockCard(
    signal.stockB,
    elements.stockBName,
    elements.stockBDirection,
    elements.stockBEntry,
    elements.stockBTarget,
    elements.stockBExit,
    elements.stockBTime,
    elements.stockBSummary
  );
}

function renderStockCard(stock, nameEl, directionEl, entryEl, targetEl, exitEl, timeEl, summaryEl) {
  nameEl.textContent = stock.ticker;
  directionEl.textContent = stock.direction;
  directionEl.dataset.direction = stock.direction.toLowerCase();
  entryEl.textContent = stock.entryPrice;
  targetEl.textContent = stock.targetPrice;
  exitEl.textContent = stock.exitPrice;
  timeEl.textContent = PAIR_SIGNALS[state.activeIndex].timePeriod;
  summaryEl.textContent = stock.summary;
}

function renderDistortion() {
  const signal = PAIR_SIGNALS[state.activeIndex];
  const distortion = Number(elements.distortionSlider.value);
  const pressure = Math.abs(distortion);
  const reversionOdds = Math.max(18, Math.min(92, 52 + pressure * 4));
  const breakoutRisk = Math.max(8, Math.min(78, 14 + pressure * 3));
  const payoutSkew = (
    pressure * 1.4 +
    (signal.confidence === "High" ? 2.8 : signal.confidence === "Medium" ? 1.3 : -0.7)
  ).toFixed(1);
  const leadingTicker = distortion >= 0 ? signal.stockA.ticker : signal.stockB.ticker;
  const laggingTicker = distortion >= 0 ? signal.stockB.ticker : signal.stockA.ticker;

  elements.distortionValue.textContent =
    distortion === 0 ? "Neutral" : `${distortion > 0 ? "+" : ""}${distortion} sigma stretch`;
  elements.tensionFill.style.width = `${((distortion + 10) / 20) * 100}%`;
  elements.reversionOdds.textContent = `${reversionOdds}%`;
  elements.breakoutRisk.textContent = `${breakoutRisk}%`;
  elements.payoutSkew.textContent = `${payoutSkew}x`;
  elements.shockNarrative.textContent =
    distortion === 0
      ? "The pair is sitting near its center. No side is screaming for a fade here."
      : `${leadingTicker} is being treated as the stretched leg and ${laggingTicker} as the catch-up leg. At this distortion, the setup favors a snap-back trade, but breakout risk rises fast once the stretch stays elevated.`;
}

function renderSelectionToggle() {
  const signal = PAIR_SIGNALS[state.activeIndex];
  const pairLabel = `${signal.pair[0]} / ${signal.pair[1]}`;
  const isSelected = state.selectedPairs.has(state.activeIndex);
  elements.toggleCurrentPair.textContent = isSelected ? `Remove ${pairLabel}` : `Add ${pairLabel}`;
  elements.toggleCurrentPair.dataset.mode = isSelected ? "remove" : "add";
}

function renderPortfolio() {
  const selectedFiltered = getSelectedFilteredIndices();

  if (!selectedFiltered.length) {
    elements.allocationRows.innerHTML = `
      <tr>
        <td colspan="6" class="empty-note">No selected pairs in current filter scope.</td>
      </tr>
    `;
    elements.selectedCount.textContent = "0";
    elements.riskDeployed.textContent = formatMoney(0);
    elements.expectedPnL.textContent = formatMoney(0);
    elements.avgConfidence.textContent = "-";
    elements.exportBook.disabled = true;
    return;
  }

  const rows = getPortfolioRows(selectedFiltered).sort((left, right) => right.weight - left.weight);

  let totalRisk = 0;
  let totalExpectedPnL = 0;
  let totalConfidenceScore = 0;

  elements.allocationRows.innerHTML = rows
    .map((row) => {
      totalRisk += row.riskBudget;
      totalExpectedPnL += row.expectedPnL;
      totalConfidenceScore += CONFIDENCE_SCORE[row.signal.confidence];

      return `
        <tr>
          <td>${row.pairLabel}</td>
          <td>${row.signal.confidence}</td>
          <td>${row.signal.timePeriod}</td>
          <td>${row.weightPct.toFixed(1)}%</td>
          <td>${formatMoney(row.riskBudget)}</td>
          <td>${formatMoney(row.expectedPnL)}</td>
        </tr>
      `;
    })
    .join("");

  elements.selectedCount.textContent = String(selectedFiltered.length);
  elements.riskDeployed.textContent = formatMoney(totalRisk);
  elements.expectedPnL.textContent = formatMoney(totalExpectedPnL);

  const averageConfidence = totalConfidenceScore / selectedFiltered.length;
  const confidenceLabel = averageConfidence >= 2.6 ? "High" : averageConfidence >= 1.7 ? "Medium" : "Low";
  elements.avgConfidence.textContent = confidenceLabel;
  elements.exportBook.disabled = false;
}

function renderConcentrationRadar() {
  const selectedFiltered = getSelectedFilteredIndices();
  const rows = getConcentrationRows(selectedFiltered);

  if (!rows.length) {
    elements.concentrationSummary.textContent = "No live book to measure";
    elements.primaryTheme.textContent = "-";
    elements.overlapScore.textContent = "0%";
    elements.diversificationRead.textContent = "-";
    elements.concentrationRows.innerHTML = '<p class="empty-note">Add pairs to the book to inspect theme crowding.</p>';
    return;
  }

  const primary = rows[0];
  const overlapScore = rows.slice(0, 3).reduce((sum, row) => sum + row.overlapPct, 0);
  const diversificationRead =
    overlapScore >= 1.35 ? "Crowded" : overlapScore >= 1 ? "Balanced with tilt" : "Diversified";

  elements.concentrationSummary.textContent = `${rows.length} recurring themes detected across ${selectedFiltered.length} live pairs`;
  elements.primaryTheme.textContent = primary.label;
  elements.overlapScore.textContent = formatPercent(overlapScore, 0);
  elements.diversificationRead.textContent = diversificationRead;
  elements.concentrationRows.innerHTML = rows
    .map((row) => `
      <article class="concentration-row">
        <div class="concentration-row-head">
          <div>
            <h4>${row.label}</h4>
            <p>${row.pairCount} pair${row.pairCount === 1 ? "" : "s"} exposed</p>
          </div>
          <strong>${formatPercent(row.overlapPct, 0)}</strong>
        </div>
        <div class="concentration-bar">
          <div class="concentration-fill" style="width: ${Math.max(row.overlapPct * 100, 6)}%"></div>
        </div>
        <p class="concentration-meta">${formatMoney(row.grossExposure)} gross exposure across ${row.pairs.join(", ")}</p>
      </article>
    `)
    .join("");
}

function renderBuilder() {
  const recommendation = getRecommendedBook();
  const roster = recommendation.chosen.map((row) => row.pairLabel);

  if (!roster.length) {
    elements.builderRoster.textContent = "-";
    elements.builderScore.textContent = "0";
    elements.builderTradeoff.textContent = "-";
    elements.builderNarrative.textContent = "The current filters leave the builder with no valid candidates.";
    elements.builderChecklist.innerHTML = '<li>Loosen the confidence or horizon filters to produce a buildable roster.</li>';
    elements.autoBuildBook.disabled = true;
    return;
  }

  const crowding = recommendation.primaryCrowding
    ? `${recommendation.primaryCrowding.label} at ${formatPercent(recommendation.primaryCrowding.overlapPct, 0)}`
    : "No meaningful crowding";
  const topIdea = recommendation.chosen[0];
  const builderNotes = [
    `Lead with ${topIdea.pairLabel}. It carries the strongest combined book weight and regime-adjusted fit in the filtered universe.`,
    `The builder stops at ${recommendation.targetPairs} pair${recommendation.targetPairs === 1 ? "" : "s"} and tries to keep any one theme under ${formatPercent(recommendation.themeCap, 0)} overlap.`,
    recommendation.topSkipped
      ? `Highest-quality skip: ${recommendation.topSkipped.pairLabel}. It was left out to avoid stacking more of the same macro sleeve into the book.`
      : "No high-ranking candidate was forced out by the diversification rules.",
    recommendation.primaryCrowding
      ? `Primary residual crowding is still ${crowding.toLowerCase()}, so that is the sleeve to monitor first if the book starts moving as one trade.`
      : "The proposed roster is relatively balanced across the current theme map.",
  ];

  elements.builderRoster.textContent = roster.join(", ");
  elements.builderScore.textContent = `${Math.round(recommendation.qualityScore)}/100`;
  elements.builderTradeoff.textContent = recommendation.topSkipped ? recommendation.topSkipped.pairLabel : "None";
  elements.builderNarrative.textContent = `This builder behaves like a PM assistant: it starts with the highest-quality screened pairs, then refuses additional names when they crowd the same theme too aggressively. The result is a book that is still return-seeking, but less likely to be a disguised one-factor bet.`;
  elements.builderChecklist.innerHTML = builderNotes.map((item) => `<li>${item}</li>`).join("");
  elements.autoBuildBook.disabled = false;
}

function renderCrossSectionPlot() {
  const filtered = getFilteredIndices();
  const rows = getPlotRows(filtered);
  const metricConfig = getPlotMetricConfig();
  const xKey = state.plotAxes.x;
  const yKey = state.plotAxes.y;

  if (!rows.length || !metricConfig[xKey] || !metricConfig[yKey]) {
    elements.plotSummary.textContent = "No data available for the current filters";
    elements.crossSectionPlot.innerHTML = "";
    return;
  }

  const xValues = rows.map((row) => row[xKey]);
  const yValues = rows.map((row) => row[yKey]);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);
  const xPadding = xMin === xMax ? Math.max(Math.abs(xMin) * 0.1, 1) : (xMax - xMin) * 0.12;
  const yPadding = yMin === yMax ? Math.max(Math.abs(yMin) * 0.1, 1) : (yMax - yMin) * 0.12;
  const domain = {
    left: xMin - xPadding,
    right: xMax + xPadding,
    bottom: yMin - yPadding,
    top: yMax + yPadding,
  };

  const frame = { left: 92, right: 820, top: 34, bottom: 432 };
  const plotWidth = frame.right - frame.left;
  const plotHeight = frame.bottom - frame.top;
  const mapX = (value) => frame.left + ((value - domain.left) / Math.max(domain.right - domain.left, 0.0001)) * plotWidth;
  const mapY = (value) => frame.bottom - ((value - domain.bottom) / Math.max(domain.top - domain.bottom, 0.0001)) * plotHeight;
  const xTicks = buildTicks(domain.left, domain.right, 5);
  const yTicks = buildTicks(domain.bottom, domain.top, 5);
  const highestWeight = Math.max(...rows.map((row) => row.weight || 0), 0.0001);
  const highlighted = rows.reduce((best, row) => (!best || row.weight > best.weight ? row : best), null);

  const gridX = xTicks
    .map((tick) => {
      const x = mapX(tick);
      return `<g><line x1="${x}" y1="${frame.top}" x2="${x}" y2="${frame.bottom}" class="plot-grid-line"></line><text x="${x}" y="460" class="plot-tick">${escapeHtml(metricConfig[xKey].format(tick))}</text></g>`;
    })
    .join("");
  const gridY = yTicks
    .map((tick) => {
      const y = mapY(tick);
      return `<g><line x1="${frame.left}" y1="${y}" x2="${frame.right}" y2="${y}" class="plot-grid-line"></line><text x="76" y="${y + 4}" class="plot-tick plot-tick-left">${escapeHtml(metricConfig[yKey].format(tick))}</text></g>`;
    })
    .join("");
  const points = rows
    .map((row) => {
      const cx = mapX(row[xKey]);
      const cy = mapY(row[yKey]);
      const radius = 8 + (row.weight / highestWeight) * 14;
      const color = getViridisColor(row.stressScore);
      const stroke = row.selected ? "#181511" : "rgba(24, 21, 17, 0.28)";
      return `
        <g class="plot-point ${row.selected ? "is-selected" : ""} ${row.index === state.activeIndex ? "is-active" : ""}">
          <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${color}" stroke="${stroke}" stroke-width="${row.index === state.activeIndex ? 3 : 1.5}" opacity="0.9"></circle>
          <text x="${cx}" y="${cy - radius - 8}" class="plot-label">${escapeHtml(row.signal.pair[0])}/${escapeHtml(row.signal.pair[1])}</text>
          <title>${row.pairLabel}
${metricConfig[xKey].label}: ${metricConfig[xKey].format(row[xKey])}
${metricConfig[yKey].label}: ${metricConfig[yKey].format(row[yKey])}
Stress fit: ${formatPercent(row.stressScore, 0)}
Status: ${row.selected ? "In book" : "Watchlist"}</title>
        </g>
      `;
    })
    .join("");

  elements.plotSummary.textContent = `${rows.length} pairs shown. Color maps stress fit, marker size maps modeled book weight, and the darkest outline marks the active pair.`;
  elements.crossSectionPlot.innerHTML = `
    <defs>
      <linearGradient id="viridisBar" x1="0%" x2="100%" y1="0%" y2="0%">
        <stop offset="0%" stop-color="${getViridisColor(0)}"></stop>
        <stop offset="25%" stop-color="${getViridisColor(0.25)}"></stop>
        <stop offset="50%" stop-color="${getViridisColor(0.5)}"></stop>
        <stop offset="75%" stop-color="${getViridisColor(0.75)}"></stop>
        <stop offset="100%" stop-color="${getViridisColor(1)}"></stop>
      </linearGradient>
    </defs>
    <rect x="${frame.left}" y="${frame.top}" width="${plotWidth}" height="${plotHeight}" rx="20" class="plot-panel"></rect>
    ${gridX}
    ${gridY}
    <line x1="${frame.left}" y1="${frame.bottom}" x2="${frame.right}" y2="${frame.bottom}" class="plot-axis"></line>
    <line x1="${frame.left}" y1="${frame.top}" x2="${frame.left}" y2="${frame.bottom}" class="plot-axis"></line>
    ${points}
    <text x="${(frame.left + frame.right) / 2}" y="500" class="plot-axis-label">${escapeHtml(metricConfig[xKey].label)}</text>
    <text x="28" y="${(frame.top + frame.bottom) / 2}" class="plot-axis-label plot-axis-label-vertical">${escapeHtml(metricConfig[yKey].label)}</text>
    <g transform="translate(690 472)">
      <rect x="0" y="0" width="140" height="12" rx="999" fill="url(#viridisBar)"></rect>
      <text x="0" y="-8" class="plot-legend-label">Stress fit</text>
      <text x="0" y="30" class="plot-legend-tick">Low</text>
      <text x="122" y="30" class="plot-legend-tick">High</text>
    </g>
    ${
      highlighted
        ? `<text x="${frame.left}" y="20" class="plot-highlight">Highest weight: ${escapeHtml(highlighted.pairLabel)}</text>`
        : ""
    }
  `;
}

function autoBuildBook() {
  const recommendation = getRecommendedBook();
  state.selectedPairs = new Set(recommendation.chosenIndices);

  if (recommendation.chosenIndices.length) {
    state.activeIndex = recommendation.chosenIndices[0];
    setShareFeedback(`Built ${recommendation.chosenIndices.length} pair book from current filters.`);
  } else {
    setShareFeedback("Builder found no valid roster for the current filters.", true);
  }

  renderAll();
}

function renderScenarioStudio() {
  const selectedFiltered = getSelectedFilteredIndices();
  const profile = getRegimeProfile();
  const intensity = getStressIntensity();
  elements.stressValue.textContent = `${Math.round(intensity * 100)}% intensity`;

  if (!selectedFiltered.length) {
    elements.scenarioNarrative.textContent = `${profile.label} is selected, but there is no live book in the current filter scope to stress.`;
    elements.scenarioExpectedPnL.textContent = formatMoney(0);
    elements.scenarioConfidenceDrag.textContent = "0 bps";
    elements.scenarioBreakRisk.textContent = "0%";
    elements.scenarioWeakestPair.textContent = "-";
    elements.scenarioRows.innerHTML = '<p class="empty-note">Add pairs to the book to see stressed outcomes.</p>';
    return;
  }

  const rows = getPortfolioRows(selectedFiltered)
    .map((row) => {
      const scenario = getPairScenarioMetrics(row.index);
      const stressedPnL = row.expectedPnL * (1 - scenario.breakRisk * 0.55) * (1 - scenario.confidencePenalty * 0.25);
      return {
        ...row,
        scenario,
        stressedPnL,
      };
    })
    .sort((left, right) => right.stressedPnL - left.stressedPnL);

  const totalStressedPnL = rows.reduce((sum, row) => sum + row.stressedPnL, 0);
  const averageConfidenceDrag = rows.reduce((sum, row) => sum + row.scenario.confidencePenalty, 0) / rows.length;
  const averageBreakRisk = rows.reduce((sum, row) => sum + row.scenario.breakRisk, 0) / rows.length;
  const weakest = rows.reduce((current, row) => (row.stressedPnL < current.stressedPnL ? row : current), rows[0]);

  elements.scenarioNarrative.textContent = `${profile.narrative} At ${Math.round(
    intensity * 100
  )}% intensity, the range below shows which live pairs keep their edge and which ones start breaking character.`;
  elements.scenarioExpectedPnL.textContent = formatSignedMoney(totalStressedPnL);
  elements.scenarioConfidenceDrag.textContent = `${(averageConfidenceDrag * 100).toFixed(0)} bps`;
  elements.scenarioBreakRisk.textContent = formatPercent(averageBreakRisk, 0);
  elements.scenarioWeakestPair.textContent = weakest ? weakest.pairLabel : "-";
  elements.scenarioRows.innerHTML = rows
    .map((row) => {
      const scoreClass =
        row.scenario.stressScore >= 0.66 ? "is-strong" : row.scenario.stressScore >= 0.48 ? "is-mixed" : "is-fragile";
      return `
        <article class="scenario-row ${scoreClass}">
          <div class="scenario-row-head">
            <div>
              <p class="section-label">Stress Fit</p>
              <h3>${row.pairLabel}</h3>
            </div>
            <span class="scenario-score">${Math.round(row.scenario.stressScore * 100)}</span>
          </div>
          <div class="scenario-metrics">
            <div>
              <span>Base P/L</span>
              <strong>${formatSignedMoney(row.expectedPnL)}</strong>
            </div>
            <div>
              <span>Stressed P/L</span>
              <strong>${formatSignedMoney(row.stressedPnL)}</strong>
            </div>
            <div>
              <span>Break risk</span>
              <strong>${formatPercent(row.scenario.breakRisk, 0)}</strong>
            </div>
            <div>
              <span>Confidence drag</span>
              <strong>${(row.scenario.confidencePenalty * 100).toFixed(0)} bps</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function createSeededRng(seed) {
  let cursor = (seed >>> 0) || 1;
  return function next() {
    cursor = (cursor + 0x6d2b79f5) >>> 0;
    let t = cursor;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleNormal(rng) {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function getMonteInputs() {
  const trials = clamp(Number(elements.monteTrials.value) || 2000, 100, 20000);
  const noisePct = clamp(Number(elements.monteNoise.value) || 80, 10, 400) / 100;
  return { trials, noisePct };
}

function getMonteRows() {
  const selectedFiltered = getSelectedFilteredIndices();
  if (!selectedFiltered.length) {
    return [];
  }
  return getPortfolioRows(selectedFiltered).map((row) => {
    const scenario = getPairScenarioMetrics(row.index);
    return {
      ...row,
      breakRisk: scenario.breakRisk,
      confidencePenalty: scenario.confidencePenalty,
      stressScore: scenario.stressScore,
    };
  });
}

function simulateBookOutcomes(rows, trials, noisePct, seed) {
  const rng = createSeededRng(seed);
  const outcomes = new Array(trials);
  let breakHits = 0;
  let bookBreaks = 0;

  for (let trial = 0; trial < trials; trial += 1) {
    let bookPnL = 0;
    let trialBreaks = 0;

    for (const row of rows) {
      const breakRoll = rng();
      if (breakRoll < row.breakRisk) {
        const stopShare = 0.7 + rng() * 0.3;
        bookPnL -= row.riskBudget * stopShare;
        breakHits += 1;
        trialBreaks += 1;
        continue;
      }

      const sigmaScale = noisePct * (0.6 + row.confidencePenalty * 1.6);
      const meanPnL = row.expectedPnL;
      const sigma = Math.max(Math.abs(meanPnL) * sigmaScale, row.riskBudget * 0.25);
      const draw = meanPnL + sampleNormal(rng) * sigma;
      const floor = -row.riskBudget * 1.1;
      bookPnL += Math.max(draw, floor);
    }

    if (trialBreaks > 0) {
      bookBreaks += 1;
    }
    outcomes[trial] = bookPnL;
  }

  return { outcomes, breakHits, bookBreaks };
}

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  const next = sorted[Math.min(base + 1, sorted.length - 1)];
  return sorted[base] + rest * (next - sorted[base]);
}

function summarizeOutcomes(outcomes) {
  if (!outcomes.length) {
    return null;
  }
  const sorted = outcomes.slice().sort((a, b) => a - b);
  const sum = outcomes.reduce((acc, value) => acc + value, 0);
  const wins = outcomes.reduce((acc, value) => acc + (value > 0 ? 1 : 0), 0);
  return {
    sorted,
    mean: sum / outcomes.length,
    median: quantile(sorted, 0.5),
    p05: quantile(sorted, 0.05),
    p95: quantile(sorted, 0.95),
    worst: sorted[0],
    best: sorted[sorted.length - 1],
    winRate: wins / outcomes.length,
  };
}

function buildHistogramBins(sorted, binCount) {
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  if (min === max) {
    return [{ start: min, end: max + 1, count: sorted.length }];
  }

  const span = max - min;
  const padded = span * 0.04;
  const lo = min - padded;
  const hi = max + padded;
  const width = (hi - lo) / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => ({
    start: lo + index * width,
    end: lo + (index + 1) * width,
    count: 0,
  }));

  for (const value of sorted) {
    const offset = Math.min(binCount - 1, Math.max(0, Math.floor((value - lo) / width)));
    bins[offset].count += 1;
  }
  return bins;
}

function renderMonteCarlo() {
  const rows = getMonteRows();
  if (!rows.length) {
    elements.monteSummary.textContent = "No live book to simulate";
    elements.monteMedian.textContent = "-";
    elements.monteMean.textContent = "-";
    elements.monteP5.textContent = "-";
    elements.monteP95.textContent = "-";
    elements.monteWinRate.textContent = "-";
    elements.monteWorst.textContent = "-";
    elements.monteHistogram.innerHTML = "";
    elements.monteNarrative.textContent =
      "Add at least one pair to the book to run the Monte Carlo distribution.";
    elements.monteNoiseValue.textContent = `${Math.round(getMonteInputs().noisePct * 100)}%`;
    return;
  }

  const { trials, noisePct } = getMonteInputs();
  elements.monteNoiseValue.textContent = `${Math.round(noisePct * 100)}%`;

  const seed = state.monte.seed ^ rows.length ^ Math.round(noisePct * 1000) ^ trials;
  const { outcomes, bookBreaks } = simulateBookOutcomes(rows, trials, noisePct, seed);
  const summary = summarizeOutcomes(outcomes);
  if (!summary) {
    return;
  }

  elements.monteMedian.textContent = formatSignedMoney(summary.median);
  elements.monteMean.textContent = formatSignedMoney(summary.mean);
  elements.monteP5.textContent = formatSignedMoney(summary.p05);
  elements.monteP95.textContent = formatSignedMoney(summary.p95);
  elements.monteWinRate.textContent = formatPercent(summary.winRate, 0);
  elements.monteWorst.textContent = formatSignedMoney(summary.worst);

  const breakRate = bookBreaks / trials;
  elements.monteSummary.textContent = `${formatCount(trials)} simulated paths · ${formatPercent(
    breakRate,
    0
  )} of trials hit at least one stop`;

  elements.monteNarrative.textContent = buildMonteNarrative(summary, breakRate, rows.length);
  elements.monteHistogram.innerHTML = drawMonteHistogram(summary, outcomes.length);
}

function buildMonteNarrative(summary, breakRate, pairCount) {
  const skew =
    summary.mean - summary.median > Math.abs(summary.median) * 0.1
      ? "right-skewed (a few big winners pull the mean above the median)"
      : summary.median - summary.mean > Math.abs(summary.median) * 0.1
        ? "left-skewed (a thick downside tail pulls the mean below the median)"
        : "roughly symmetric";
  const downsideHint =
    summary.p05 < 0
      ? `a one-in-twenty path loses ${formatMoney(Math.abs(summary.p05))} or more`
      : `even the bottom 5% of paths stay above ${formatMoney(summary.p05)}`;
  return `Across the ${pairCount}-pair live book, the outcome distribution is ${skew}. The middle path lands at ${formatSignedMoney(
    summary.median
  )} and the upper 5% reaches ${formatSignedMoney(summary.p95)}. On the downside, ${downsideHint}, while ${formatPercent(
    breakRate,
    0
  )} of simulated trials see at least one pair stopped out.`;
}

function drawMonteHistogram(summary, sampleCount) {
  const frame = { left: 80, right: 880, top: 32, bottom: 320 };
  const plotWidth = frame.right - frame.left;
  const plotHeight = frame.bottom - frame.top;
  const binCount = clamp(Math.round(Math.sqrt(sampleCount) * 0.9), 18, 48);
  const bins = buildHistogramBins(summary.sorted, binCount);
  const maxCount = bins.reduce((max, bin) => Math.max(max, bin.count), 1);
  const lo = bins[0].start;
  const hi = bins[bins.length - 1].end;
  const mapX = (value) => frame.left + ((value - lo) / Math.max(hi - lo, 0.0001)) * plotWidth;
  const xTicks = buildTicks(lo, hi, 6);

  const barGap = 2;
  const bars = bins
    .map((bin) => {
      const barX = mapX(bin.start);
      const nextX = mapX(bin.end);
      const width = Math.max(nextX - barX - barGap, 1);
      const height = (bin.count / maxCount) * plotHeight;
      const y = frame.bottom - height;
      const center = (bin.start + bin.end) / 2;
      const tone = center >= 0 ? "var(--up)" : "var(--down)";
      return `<rect x="${barX}" y="${y}" width="${width}" height="${height}" fill="${tone}" opacity="0.78" rx="3"></rect>`;
    })
    .join("");

  const zeroX = lo <= 0 && hi >= 0 ? mapX(0) : null;
  const markers = [
    { value: summary.p05, label: "P5", color: "var(--down)" },
    { value: summary.median, label: "Median", color: "var(--ink)" },
    { value: summary.p95, label: "P95", color: "var(--up)" },
  ]
    .map((marker) => {
      const x = mapX(marker.value);
      return `
        <g class="monte-marker">
          <line x1="${x}" y1="${frame.top - 6}" x2="${x}" y2="${frame.bottom}" stroke="${marker.color}" stroke-width="1.5" stroke-dasharray="4 4"></line>
          <text x="${x}" y="${frame.top - 10}" class="monte-marker-label" fill="${marker.color}">${marker.label} ${formatSignedMoney(marker.value)}</text>
        </g>
      `;
    })
    .join("");

  const xTickMarks = xTicks
    .map((tick) => {
      const x = mapX(tick);
      return `
        <g>
          <line x1="${x}" y1="${frame.bottom}" x2="${x}" y2="${frame.bottom + 4}" class="plot-axis"></line>
          <text x="${x}" y="${frame.bottom + 18}" class="plot-tick">${escapeHtml(formatSignedMoney(tick))}</text>
        </g>
      `;
    })
    .join("");

  const yTicks = buildTicks(0, maxCount, 4);
  const yTickMarks = yTicks
    .map((tick) => {
      const y = frame.bottom - (tick / Math.max(maxCount, 1)) * plotHeight;
      return `
        <g>
          <line x1="${frame.left - 4}" y1="${y}" x2="${frame.right}" y2="${y}" class="plot-grid-line"></line>
          <text x="${frame.left - 10}" y="${y + 4}" class="plot-tick plot-tick-left">${formatCount(Math.round(tick))}</text>
        </g>
      `;
    })
    .join("");

  return `
    <rect x="${frame.left}" y="${frame.top}" width="${plotWidth}" height="${plotHeight}" rx="20" class="plot-panel"></rect>
    ${yTickMarks}
    ${zeroX !== null ? `<line x1="${zeroX}" y1="${frame.top}" x2="${zeroX}" y2="${frame.bottom}" class="monte-zero"></line>` : ""}
    ${bars}
    ${markers}
    <line x1="${frame.left}" y1="${frame.bottom}" x2="${frame.right}" y2="${frame.bottom}" class="plot-axis"></line>
    <line x1="${frame.left}" y1="${frame.top}" x2="${frame.left}" y2="${frame.bottom}" class="plot-axis"></line>
    ${xTickMarks}
    <text x="${(frame.left + frame.right) / 2}" y="${frame.bottom + 44}" class="plot-axis-label">Book P/L (USD)</text>
    <text x="28" y="${(frame.top + frame.bottom) / 2}" class="plot-axis-label plot-axis-label-vertical">Trial count</text>
  `;
}

function renderScreener() {
  const filtered = getFilteredIndices();
  const rows = getScreenedRows(filtered);
  const selectedCount = rows.filter((row) => row.selected).length;
  const totalWeight = rows.reduce((sum, row) => sum + row.weight, 0);

  elements.screenerSummary.textContent = rows.length
    ? `${selectedCount} of ${rows.length} filtered pairs are in book`
    : "No pairs match the current filters";

  if (!rows.length) {
    elements.exportBook.disabled = getSelectedFilteredIndices().length === 0;
    elements.screenerRows.innerHTML = `
      <tr>
        <td colspan="9" class="empty-note">Adjust the filters to surface more pair candidates.</td>
      </tr>
    `;
    return;
  }

  document.querySelectorAll(".sort-button").forEach((button) => {
    const label = button.dataset.sortKey === "confidence"
      ? "Confidence"
      : button.dataset.sortKey === "modeledEdge"
        ? "Modeled Edge"
        : button.dataset.sortKey === "weight"
          ? "Book Weight"
          : "Stress Fit";
    button.textContent = buildSortLabel(button.dataset.sortKey, label);
  });

  elements.screenerRows.innerHTML = rows
    .map((row, rank) => {
      const normalizedWeight = totalWeight > 0 ? row.weight / totalWeight : 0;
      const isActive = row.index === state.activeIndex;
      return `
        <tr class="${isActive ? "is-active-row" : ""}">
          <td>${rank + 1}</td>
          <td>${row.pairLabel}</td>
          <td>${row.signal.confidence}</td>
          <td>${row.signal.timePeriod}</td>
          <td>${formatPercent(row.modeledEdge, 1)}</td>
          <td>${formatPercent(normalizedWeight, 1)}</td>
          <td>${formatPercent(row.stressScore, 0)}</td>
          <td><span class="table-status ${row.selected ? "is-selected" : "is-watch"}">${row.selected ? "In book" : "Watchlist"}</span></td>
          <td>
            <div class="table-actions">
              <button class="table-button" type="button" data-action="open" data-index="${row.index}">Open</button>
              <button class="table-button ${row.selected ? "is-remove" : "is-add"}" type="button" data-action="toggle" data-index="${row.index}">
                ${row.selected ? "Remove" : "Add"}
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  elements.screenerRows.querySelectorAll(".table-button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      if (button.dataset.action === "open") {
        state.activeIndex = index;
      } else if (state.selectedPairs.has(index)) {
        state.selectedPairs.delete(index);
      } else {
        state.selectedPairs.add(index);
      }
      renderAll();
    });
  });

}

function renderLeg(side, tickerEl, actionEl, entryEl, targetEl, stopEl, sharesEl, notionalEl) {
  tickerEl.textContent = side.ticker;
  actionEl.textContent = side.action;
  actionEl.dataset.direction = side.action.toLowerCase();
  entryEl.textContent = formatMoney(side.entry);
  targetEl.textContent = formatMoney(side.target);
  stopEl.textContent = formatMoney(side.stop);
  sharesEl.textContent = formatCount(side.shares);
  notionalEl.textContent = formatMoney(side.notional);
}

function renderExecutionPlanner() {
  const plan = getActivePlan();
  if (!plan) {
    return;
  }

  elements.ticketTitle.textContent = `${plan.signal.pair[0]} / ${plan.signal.pair[1]} ticket`;
  elements.ticketStatus.textContent = plan.isLive ? "In book" : "Preview if added";
  elements.ticketStatus.dataset.mode = plan.isLive ? "live" : "preview";
  elements.planRiskBudget.textContent = `${formatMoney(plan.actualRisk)} of ${formatMoney(plan.riskBudget)}`;
  elements.planGrossExposure.textContent = formatMoney(plan.grossExposure);
  elements.planExpectedReward.textContent = formatMoney(plan.expectedReward);
  elements.planRewardRisk.textContent = `${plan.rewardRisk.toFixed(2)}x`;
  elements.planMaxHold.textContent = formatSessions(plan.maxHoldSessions);
  elements.planHedgeSplit.textContent = plan.hedgeSplit;

  renderLeg(
    plan.sideA,
    elements.legATicker,
    elements.legAAction,
    elements.legAEntry,
    elements.legATarget,
    elements.legAStop,
    elements.legAShares,
    elements.legANotional
  );
  renderLeg(
    plan.sideB,
    elements.legBTicker,
    elements.legBAction,
    elements.legBEntry,
    elements.legBTarget,
    elements.legBStop,
    elements.legBShares,
    elements.legBNotional
  );

  elements.planNarrative.textContent = `${plan.signal.pair[0]} / ${plan.signal.pair[1]} ${
    plan.isLive ? "already sits inside the current book" : "is currently out of book"
  }, so the planner ${plan.isLive ? "sizes the live trade" : "shows the ticket you would run if added now"}. Under the ${
    getRegimeProfile().label.toLowerCase()
  } regime, the setup carries about ${formatPercent(plan.scenario.breakRisk, 0)} break risk. With a ${formatPercent(
    getBudgetInputs().stopBudgetPct,
    1
  )} stop budget and ${plan.sizingLabel.toLowerCase()} construction, the sized ticket uses ${formatMoney(
    plan.actualRisk
  )} of stop risk across about ${formatMoney(
    plan.grossExposure
  )} of gross exposure for a modeled ${formatMoney(plan.expectedReward)} upside if the spread mean-reverts on schedule.`;
  elements.planChecklist.innerHTML = plan.checklist.map((item) => `<li>${item}</li>`).join("");
}

function getBacktestInputs() {
  const history = clamp(Math.round(Number(elements.btHistory.value) || 252), 120, 756);
  const lookback = clamp(Math.round(Number(elements.btLookback.value) || 20), 10, 90);
  const entryZ = clamp(Number(elements.btEntryZ.value) || 2, 1, 3.5);
  let exitZ = clamp(Number(elements.btExitZ.value) || 0.5, 0, 2);
  if (exitZ >= entryZ) {
    exitZ = Math.max(0, entryZ - 0.5);
  }
  return { history, lookback, entryZ, exitZ };
}

function buildPairPriceHistory(index, history) {
  const signal = PAIR_SIGNALS[index];
  const baseA = parseDollar(signal.stockA.entryPrice) || 100;
  const baseB = parseDollar(signal.stockB.entryPrice) || 100;
  // Confidence shapes how cleanly the synthetic spread mean-reverts.
  const conviction = CONFIDENCE_SCORE[signal.confidence] || 2;
  const phi = 0.9 + conviction * 0.015; // stickier reversion for higher-confidence pairs
  const spreadAmplitude = 0.07 - conviction * 0.008; // tighter pairs swing a touch less in log terms
  const driftVol = 0.009;
  const spreadSigma = 0.392; // keeps the OU stationary std near 1.0 at this phi range
  const seed = (((index + 1) * 2654435761) ^ (history * 40503) ^ 0x9e3779b9) >>> 0;
  const rng = createSeededRng(seed);

  const sessions = [];
  let ouState = sampleNormal(rng);
  let commonLog = 0;
  for (let t = 0; t < history; t += 1) {
    ouState = phi * ouState + sampleNormal(rng) * spreadSigma;
    commonLog += driftVol * sampleNormal(rng) + 0.0002; // gentle shared drift
    const logA = commonLog + 0.5 * ouState * spreadAmplitude;
    const logB = commonLog - 0.5 * ouState * spreadAmplitude;
    sessions.push({
      t,
      spreadUnit: ouState,
      logSpread: logA - logB,
      priceA: baseA * Math.exp(logA),
      priceB: baseB * Math.exp(logB),
    });
  }
  return { signal, sessions };
}

function summarizeBacktest(points, trades) {
  const equity = points.map((point) => point.equity);
  const totalReturn = equity.length ? equity[equity.length - 1] - 1 : 0;

  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const value of equity) {
    peak = Math.max(peak, value);
    if (peak > 0) {
      maxDrawdown = Math.max(maxDrawdown, (peak - value) / peak);
    }
  }

  const returns = [];
  for (let i = 1; i < equity.length; i += 1) {
    if (equity[i - 1] > 0) {
      returns.push(equity[i] / equity[i - 1] - 1);
    }
  }
  const meanR = returns.length ? returns.reduce((sum, value) => sum + value, 0) / returns.length : 0;
  const varR = returns.length
    ? returns.reduce((sum, value) => sum + (value - meanR) ** 2, 0) / returns.length
    : 0;
  const sharpe = varR > 0 ? (meanR / Math.sqrt(varR)) * Math.sqrt(252) : 0;

  const wins = trades.filter((trade) => trade.ret > 0);
  const losses = trades.filter((trade) => trade.ret < 0);
  const grossWin = wins.reduce((sum, trade) => sum + trade.ret, 0);
  const grossLoss = Math.abs(losses.reduce((sum, trade) => sum + trade.ret, 0));
  const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0;
  const winRate = trades.length ? wins.length / trades.length : 0;
  const avgHold = trades.length ? trades.reduce((sum, trade) => sum + trade.hold, 0) / trades.length : 0;

  return { totalReturn, maxDrawdown, sharpe, profitFactor, winRate, avgHold };
}

function computeBacktest() {
  const inputs = getBacktestInputs();
  const { signal, sessions } = buildPairPriceHistory(state.activeIndex, inputs.history);

  const points = [];
  const entries = [];
  const trades = [];
  let position = 0; // +1 long the spread, -1 short the spread
  let entrySpread = 0;
  let entryT = 0;
  let realized = 1; // equity index multiplier, starts at 1.0 (chart shows x100)
  const stopZ = inputs.entryZ * 1.8;

  for (let t = 0; t < sessions.length; t += 1) {
    let z = 0;
    if (t >= inputs.lookback) {
      let sum = 0;
      for (let k = t - inputs.lookback; k < t; k += 1) {
        sum += sessions[k].spreadUnit;
      }
      const mean = sum / inputs.lookback;
      let varSum = 0;
      for (let k = t - inputs.lookback; k < t; k += 1) {
        const delta = sessions[k].spreadUnit - mean;
        varSum += delta * delta;
      }
      const std = Math.sqrt(varSum / inputs.lookback) || 1e-6;
      z = (sessions[t].spreadUnit - mean) / std;
    }

    // Close an open position once the spread reverts back through the exit band
    // (a profit-taking exit) or runs further against us past the stop band.
    if (position !== 0) {
      const reverted = position === 1 ? z >= -inputs.exitZ : z <= inputs.exitZ;
      const stopped = position === 1 ? z <= -stopZ : z >= stopZ;
      if (reverted || stopped) {
        const ret = position * (sessions[t].logSpread - entrySpread);
        realized *= 1 + ret;
        trades.push({
          ret,
          hold: t - entryT,
          side: position === 1 ? "Long spread" : "Short spread",
          stopped,
        });
        position = 0;
      }
    }

    // Open a fresh position when a flat book sees the spread stretch past entry.
    if (position === 0 && t >= inputs.lookback) {
      if (z >= inputs.entryZ) {
        position = -1;
        entrySpread = sessions[t].logSpread;
        entryT = t;
        entries.push({ t, z, side: -1 });
      } else if (z <= -inputs.entryZ) {
        position = 1;
        entrySpread = sessions[t].logSpread;
        entryT = t;
        entries.push({ t, z, side: 1 });
      }
    }

    const unrealized = position !== 0 ? position * (sessions[t].logSpread - entrySpread) : 0;
    points.push({ t, z, equity: realized * (1 + unrealized), position });
  }

  return { signal, inputs, points, entries, trades, metrics: summarizeBacktest(points, trades) };
}

function drawZScoreChart(points, entries, entryZ, exitZ) {
  const frame = { left: 64, right: 892, top: 28, bottom: 300 };
  const plotWidth = frame.right - frame.left;
  const plotHeight = frame.bottom - frame.top;
  const count = points.length;
  const maxAbs = points.reduce((max, point) => Math.max(max, Math.abs(point.z)), entryZ * 1.4);
  const yMax = Math.max(Math.ceil(maxAbs * 2) / 2, entryZ + 0.5, 3);
  const yMin = -yMax;
  const mapX = (t) => frame.left + (count <= 1 ? 0 : (t / (count - 1)) * plotWidth);
  const mapY = (z) => frame.bottom - ((z - yMin) / (yMax - yMin)) * plotHeight;

  const band = (hi, lo, cls) =>
    `<rect x="${frame.left}" y="${mapY(hi).toFixed(1)}" width="${plotWidth}" height="${(mapY(lo) - mapY(hi)).toFixed(1)}" class="${cls}"></rect>`;
  const bands =
    band(yMax, entryZ, "bt-band-entry") +
    band(-entryZ, yMin, "bt-band-entry") +
    band(exitZ, -exitZ, "bt-band-exit");

  const thresholds =
    [entryZ, -entryZ]
      .map((z) => `<line x1="${frame.left}" y1="${mapY(z).toFixed(1)}" x2="${frame.right}" y2="${mapY(z).toFixed(1)}" class="bt-threshold"></line>`)
      .join("") +
    [exitZ, -exitZ]
      .map((z) => `<line x1="${frame.left}" y1="${mapY(z).toFixed(1)}" x2="${frame.right}" y2="${mapY(z).toFixed(1)}" class="bt-threshold-soft"></line>`)
      .join("") +
    `<line x1="${frame.left}" y1="${mapY(0).toFixed(1)}" x2="${frame.right}" y2="${mapY(0).toFixed(1)}" class="plot-axis"></line>`;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${mapX(point.t).toFixed(1)} ${mapY(clamp(point.z, yMin, yMax)).toFixed(1)}`)
    .join(" ");
  const zLine = `<path d="${linePath}" class="bt-zline"></path>`;

  const markers = entries
    .map((entry) => {
      const tone = entry.side === 1 ? "var(--up)" : "var(--down)";
      return `<circle cx="${mapX(entry.t).toFixed(1)}" cy="${mapY(clamp(entry.z, yMin, yMax)).toFixed(1)}" r="3.4" fill="${tone}" stroke="var(--surface)" stroke-width="1"></circle>`;
    })
    .join("");

  const yTicks = buildTicks(yMin, yMax, 5)
    .map(
      (z) =>
        `<g><line x1="${frame.left - 4}" y1="${mapY(z).toFixed(1)}" x2="${frame.right}" y2="${mapY(z).toFixed(1)}" class="plot-grid-line"></line><text x="${frame.left - 10}" y="${(mapY(z) + 4).toFixed(1)}" class="plot-tick plot-tick-left">${z.toFixed(1)}</text></g>`
    )
    .join("");
  const xTicks = buildTicks(0, Math.max(count - 1, 1), 6)
    .map((t) => {
      const x = mapX(t);
      return `<g><line x1="${x.toFixed(1)}" y1="${frame.bottom}" x2="${x.toFixed(1)}" y2="${frame.bottom + 4}" class="plot-axis"></line><text x="${x.toFixed(1)}" y="${frame.bottom + 18}" class="plot-tick">${Math.round(t)}</text></g>`;
    })
    .join("");

  return `
    <rect x="${frame.left}" y="${frame.top}" width="${plotWidth}" height="${plotHeight}" rx="18" class="plot-panel"></rect>
    ${bands}
    ${yTicks}
    ${thresholds}
    ${zLine}
    ${markers}
    <line x1="${frame.left}" y1="${frame.bottom}" x2="${frame.right}" y2="${frame.bottom}" class="plot-axis"></line>
    <line x1="${frame.left}" y1="${frame.top}" x2="${frame.left}" y2="${frame.bottom}" class="plot-axis"></line>
    ${xTicks}
    <text x="${(frame.left + frame.right) / 2}" y="${frame.bottom + 40}" class="plot-axis-label">Trading session</text>
    <text x="22" y="${(frame.top + frame.bottom) / 2}" class="plot-axis-label plot-axis-label-vertical">Spread z-score</text>
  `;
}

function drawEquityChart(points) {
  const frame = { left: 64, right: 892, top: 28, bottom: 250 };
  const plotWidth = frame.right - frame.left;
  const plotHeight = frame.bottom - frame.top;
  const count = points.length;
  const equity = points.map((point) => point.equity);
  const lo = Math.min(1, ...equity);
  const hi = Math.max(1, ...equity);
  const pad = Math.max((hi - lo) * 0.08, 0.005);
  const padLo = lo - pad;
  const padHi = hi + pad;
  const mapX = (t) => frame.left + (count <= 1 ? 0 : (t / (count - 1)) * plotWidth);
  const mapY = (value) => frame.bottom - ((value - padLo) / (padHi - padLo)) * plotHeight;

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${mapX(point.t).toFixed(1)} ${mapY(point.equity).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${mapX(count - 1).toFixed(1)} ${mapY(padLo).toFixed(1)} L ${mapX(0).toFixed(1)} ${mapY(padLo).toFixed(1)} Z`;
  const finishedUp = equity[equity.length - 1] >= 1;
  const tone = finishedUp ? "is-up" : "is-down";

  const yTicks = buildTicks(padLo, padHi, 5)
    .map(
      (value) =>
        `<g><line x1="${frame.left - 4}" y1="${mapY(value).toFixed(1)}" x2="${frame.right}" y2="${mapY(value).toFixed(1)}" class="plot-grid-line"></line><text x="${frame.left - 10}" y="${(mapY(value) + 4).toFixed(1)}" class="plot-tick plot-tick-left">${(value * 100).toFixed(0)}</text></g>`
    )
    .join("");
  const xTicks = buildTicks(0, Math.max(count - 1, 1), 6)
    .map((t) => {
      const x = mapX(t);
      return `<g><line x1="${x.toFixed(1)}" y1="${frame.bottom}" x2="${x.toFixed(1)}" y2="${frame.bottom + 4}" class="plot-axis"></line><text x="${x.toFixed(1)}" y="${frame.bottom + 18}" class="plot-tick">${Math.round(t)}</text></g>`;
    })
    .join("");

  return `
    <rect x="${frame.left}" y="${frame.top}" width="${plotWidth}" height="${plotHeight}" rx="18" class="plot-panel"></rect>
    ${yTicks}
    <line x1="${frame.left}" y1="${mapY(1).toFixed(1)}" x2="${frame.right}" y2="${mapY(1).toFixed(1)}" class="bt-threshold-soft"></line>
    <path d="${areaPath}" class="bt-equity-area ${tone}"></path>
    <path d="${linePath}" class="bt-equity-line ${tone}"></path>
    <line x1="${frame.left}" y1="${frame.bottom}" x2="${frame.right}" y2="${frame.bottom}" class="plot-axis"></line>
    <line x1="${frame.left}" y1="${frame.top}" x2="${frame.left}" y2="${frame.bottom}" class="plot-axis"></line>
    ${xTicks}
    <text x="${(frame.left + frame.right) / 2}" y="${frame.bottom + 40}" class="plot-axis-label">Trading session</text>
    <text x="22" y="${(frame.top + frame.bottom) / 2}" class="plot-axis-label plot-axis-label-vertical">Equity index (start 100)</text>
  `;
}

function buildBacktestNarrative(signal, metrics, trades, inputs) {
  const pairLabel = `${signal.pair[0]} / ${signal.pair[1]}`;
  if (!trades.length) {
    return `Over ${inputs.history} synthetic sessions the ${pairLabel} spread never stretched past ${inputs.entryZ.toFixed(
      1
    )}σ on a ${inputs.lookback}-session lookback, so the rule stayed flat. Loosen the entry threshold or shorten the lookback to surface trades.`;
  }
  const verdict =
    metrics.totalReturn >= 0
      ? `compounded to +${formatPercent(metrics.totalReturn, 1)}`
      : `bled -${formatPercent(Math.abs(metrics.totalReturn), 1)}`;
  const edge =
    metrics.winRate >= 0.5
      ? "The reversion edge held up"
      : "Reversion misfired more often than not";
  return `Trading the spread on a ${inputs.entryZ.toFixed(1)}σ entry / ${inputs.exitZ.toFixed(
    1
  )}σ exit rule, ${pairLabel} took ${formatCount(trades.length)} round trips over ${inputs.history} sessions and ${verdict} (start 100). ${edge} at a ${formatPercent(
    metrics.winRate,
    0
  )} hit rate, the worst peak-to-trough dip was ${formatPercent(
    metrics.maxDrawdown,
    1
  )}, and the realized Sharpe landed near ${metrics.sharpe.toFixed(
    2
  )}. The price path is a deterministic synthetic series seeded from the pair, so this is a behavior sketch of the rule, not a historical claim.`;
}

function renderBacktest() {
  const { signal, inputs, points, entries, trades, metrics } = computeBacktest();

  elements.btEntryZValue.textContent = `${inputs.entryZ.toFixed(1)}σ`;
  elements.btExitZValue.textContent = `${inputs.exitZ.toFixed(1)}σ`;
  elements.backtestSummary.textContent = `${signal.pair[0]} / ${signal.pair[1]} · ${inputs.history} sessions · ${inputs.lookback}-session lookback`;

  elements.btTotalReturn.textContent = `${metrics.totalReturn >= 0 ? "+" : "-"}${formatPercent(Math.abs(metrics.totalReturn), 1)}`;
  elements.btTotalReturn.style.color = metrics.totalReturn >= 0 ? "var(--up)" : "var(--down)";
  elements.btTrades.textContent = formatCount(trades.length);
  elements.btWinRate.textContent = trades.length ? formatPercent(metrics.winRate, 0) : "-";
  elements.btProfitFactor.textContent = trades.length
    ? Number.isFinite(metrics.profitFactor)
      ? metrics.profitFactor.toFixed(2)
      : "∞"
    : "-";
  elements.btMaxDD.textContent = formatPercent(metrics.maxDrawdown, 1);
  elements.btSharpe.textContent = metrics.sharpe.toFixed(2);

  elements.btZChart.innerHTML = drawZScoreChart(points, entries, inputs.entryZ, inputs.exitZ);
  elements.btEquityChart.innerHTML = drawEquityChart(points);
  elements.backtestNarrative.textContent = buildBacktestNarrative(signal, metrics, trades, inputs);
}

function renderAll() {
  renderTabs();
  renderScenarioStudio();
  renderSignal();
  renderDistortion();
  renderSelectionToggle();
  renderPortfolio();
  renderConcentrationRadar();
  renderBuilder();
  renderCrossSectionPlot();
  renderExecutionPlanner();
  renderMonteCarlo();
  renderBacktest();
  renderScreener();
  persistState();
  syncSnapshotUrl();
}

hydrateState();

elements.distortionSlider.addEventListener("input", () => {
  renderAll();
});

elements.toggleCurrentPair.addEventListener("click", () => {
  if (state.selectedPairs.has(state.activeIndex)) {
    state.selectedPairs.delete(state.activeIndex);
  } else {
    state.selectedPairs.add(state.activeIndex);
  }
  renderAll();
});

elements.confidenceFilter.addEventListener("change", () => {
  state.filters.confidence = elements.confidenceFilter.value;
  renderAll();
});

elements.horizonFilter.addEventListener("change", () => {
  state.filters.horizon = elements.horizonFilter.value;
  renderAll();
});

[elements.capitalInput, elements.riskInput, elements.stopBudgetInput, elements.targetPairsInput, elements.themeCapInput].forEach((input) => {
  input.addEventListener("input", () => {
    renderAll();
  });
});

elements.sizingMode.addEventListener("change", () => {
  renderAll();
});

elements.regimeSelect.addEventListener("change", () => {
  state.regime = elements.regimeSelect.value;
  renderAll();
});

elements.stressInput.addEventListener("input", () => {
  state.stress = clamp(Number(elements.stressInput.value) || 35, 0, 100);
  renderAll();
});

[elements.plotXSelect, elements.plotYSelect].forEach((select) => {
  select.addEventListener("change", () => {
    state.plotAxes.x = elements.plotXSelect.value;
    state.plotAxes.y = elements.plotYSelect.value;
    renderAll();
  });
});

elements.exportBook.addEventListener("click", () => {
  exportBookCsv();
});

elements.shareSnapshot.addEventListener("click", () => {
  copySnapshotLink();
});

elements.autoBuildBook.addEventListener("click", () => {
  autoBuildBook();
});

document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", () => {
    toggleScreenerSort(button.dataset.sortKey);
    renderAll();
  });
});

elements.monteTrials.addEventListener("change", () => {
  state.monte.trials = clamp(Number(elements.monteTrials.value) || 2000, 100, 20000);
  renderAll();
});

elements.monteNoise.addEventListener("input", () => {
  state.monte.noisePct = clamp(Number(elements.monteNoise.value) || 80, 10, 400);
  renderAll();
});

elements.monteReseed.addEventListener("click", () => {
  state.monte.seed = (Math.floor(Math.random() * 2 ** 31) >>> 0) || 1;
  renderAll();
});

[elements.btHistory, elements.btLookback, elements.btEntryZ, elements.btExitZ].forEach((input) => {
  input.addEventListener("input", () => {
    const inputs = getBacktestInputs();
    state.backtest.history = inputs.history;
    state.backtest.lookback = inputs.lookback;
    state.backtest.entryZ = inputs.entryZ;
    state.backtest.exitZ = inputs.exitZ;
    renderAll();
  });
});

renderAll();
