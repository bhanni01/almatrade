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

const state = {
  activeIndex: 0,
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
};

function renderTabs() {
  elements.pairTabs.innerHTML = PAIR_SIGNALS.map((entry, index) => {
    const active = index === state.activeIndex ? "is-active" : "";
    return `
      <button class="pair-tab ${active}" type="button" data-index="${index}">
        ${entry.pair[0]} / ${entry.pair[1]}
      </button>
    `;
  }).join("");

  elements.pairTabs.querySelectorAll(".pair-tab").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeIndex = Number(button.dataset.index);
      renderTabs();
      renderSignal();
    });
  });
}

function renderSignal() {
  const signal = PAIR_SIGNALS[state.activeIndex];
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

  renderDistortion();
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
  const payoutSkew = (pressure * 1.4 + (signal.confidence === "High" ? 2.8 : signal.confidence === "Medium" ? 1.3 : -0.7)).toFixed(1);
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
      ? `The pair is sitting near its center. No side is screaming for a fade here.`
      : `${leadingTicker} is being treated as the stretched leg and ${laggingTicker} as the catch-up leg. At this distortion, the setup favors a snap-back trade, but breakout risk rises fast once the stretch stays elevated.`;
}

elements.distortionSlider.addEventListener("input", () => {
  renderDistortion();
});

renderTabs();
renderSignal();
