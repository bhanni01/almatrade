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
  selectedCount: document.querySelector("#selectedCount"),
  riskDeployed: document.querySelector("#riskDeployed"),
  expectedPnL: document.querySelector("#expectedPnL"),
  avgConfidence: document.querySelector("#avgConfidence"),
  allocationRows: document.querySelector("#allocationRows"),
  exportBook: document.querySelector("#exportBook"),
  toggleCurrentPair: document.querySelector("#toggleCurrentPair"),
  screenerSummary: document.querySelector("#screenerSummary"),
  screenerRows: document.querySelector("#screenerRows"),
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
  return base * confidenceBoost * distortionBoost;
}

function getPairWeight(index) {
  const signal = PAIR_SIGNALS[index];
  const confidenceWeight = CONFIDENCE_SCORE[signal.confidence];
  const horizon = getTimeBucket(signal.timePeriod);
  const horizonPenalty = horizon === "Short" ? 0.8 : horizon === "Medium" ? 1 : 0.9;
  const distortionEdge = index === state.activeIndex ? 1 + Math.abs(getPairDistortionBias(index)) * 0.35 : 1;
  return confidenceWeight * horizonPenalty * distortionEdge;
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
        selected: state.selectedPairs.has(index),
      };
    });

  const sorters = {
    confidence: (left, right) => CONFIDENCE_SCORE[left.signal.confidence] - CONFIDENCE_SCORE[right.signal.confidence],
    modeledEdge: (left, right) => left.modeledEdge - right.modeledEdge,
    weight: (left, right) => left.weight - right.weight,
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
  const entryA = parseDollar(signal.stockA.entryPrice);
  const entryB = parseDollar(signal.stockB.entryPrice);
  const targetA = parseDollar(signal.stockA.targetPrice);
  const targetB = parseDollar(signal.stockB.targetPrice);
  const rawNotionalA = portfolioRow.grossExposure * sizing.aWeight;
  const rawNotionalB = portfolioRow.grossExposure * sizing.bWeight;
  const sharesA = Math.max(1, Math.floor(rawNotionalA / entryA));
  const sharesB = Math.max(1, Math.floor(rawNotionalB / entryB));
  const notionalA = sharesA * entryA;
  const notionalB = sharesB * entryB;
  const actualGrossExposure = notionalA + notionalB;
  const expectedReward = actualGrossExposure * portfolioRow.expectedReturn;
  const rewardRisk = portfolioRow.riskBudget > 0 ? expectedReward / portfolioRow.riskBudget : 0;
  const sideAAction = getTradeSide(signal.stockA.direction);
  const sideBAction = getTradeSide(signal.stockB.direction);
  const stopA = sideAAction === "Long" ? entryA * (1 - stopPct) : entryA * (1 + stopPct);
  const stopB = sideBAction === "Long" ? entryB * (1 - stopPct) : entryB * (1 + stopPct);
  const hedgeSplit = `${Math.round(sizing.aWeight * 100)} / ${Math.round(sizing.bWeight * 100)}`;
  const maxHoldSessions = getMaxHoldSessions(signal.timePeriod);
  const distortion = Number(elements.distortionSlider.value);

  const plan = {
    signal,
    isLive,
    sizingLabel: sizing.label,
    distortion,
    riskBudget: portfolioRow.riskBudget,
    grossExposure: actualGrossExposure,
    expectedReward,
    rewardRisk,
    hedgeSplit,
    maxHoldSessions,
    sideA: {
      ticker: signal.stockA.ticker,
      action: sideAAction,
      entry: entryA,
      target: targetA,
      stop: stopA,
      shares: sharesA,
      notional: notionalA,
    },
    sideB: {
      ticker: signal.stockB.ticker,
      action: sideBAction,
      entry: entryB,
      target: targetB,
      stop: stopB,
      shares: sharesB,
      notional: notionalB,
    },
  };

  return {
    ...plan,
    checklist: buildPlanChecklist(plan),
  };
}

function persistState() {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        activeIndex: state.activeIndex,
        selectedPairs: [...state.selectedPairs],
        filters: state.filters,
        capitalInput: elements.capitalInput.value,
        riskInput: elements.riskInput.value,
        distortion: elements.distortionSlider.value,
        sizingMode: elements.sizingMode.value,
        stopBudgetInput: elements.stopBudgetInput.value,
        screenerSort: state.screenerSort,
      })
    );
  } catch (error) {
    // Ignore persistence failures in private browsing or restricted environments.
  }
}

function hydrateState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    const saved = JSON.parse(raw);
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

    elements.confidenceFilter.value = state.filters.confidence;
    elements.horizonFilter.value = state.filters.horizon;
  } catch (error) {
    // Ignore malformed local state and continue with defaults.
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
        <td colspan="8" class="empty-note">Adjust the filters to surface more pair candidates.</td>
      </tr>
    `;
    return;
  }

  document.querySelectorAll(".sort-button").forEach((button) => {
    const label = button.dataset.sortKey === "confidence"
      ? "Confidence"
      : button.dataset.sortKey === "modeledEdge"
        ? "Modeled Edge"
        : "Book Weight";
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
  elements.planRiskBudget.textContent = formatMoney(plan.riskBudget);
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
  }, so the planner ${plan.isLive ? "sizes the live trade" : "shows the ticket you would run if added now"}. With a ${formatPercent(
    getBudgetInputs().stopBudgetPct,
    1
  )} stop budget and ${plan.sizingLabel.toLowerCase()} construction, the setup supports about ${formatMoney(
    plan.grossExposure
  )} of gross exposure for a modeled ${formatMoney(plan.expectedReward)} upside if the spread mean-reverts on schedule.`;
  elements.planChecklist.innerHTML = plan.checklist.map((item) => `<li>${item}</li>`).join("");
}

function renderAll() {
  renderTabs();
  renderSignal();
  renderDistortion();
  renderSelectionToggle();
  renderPortfolio();
  renderExecutionPlanner();
  renderScreener();
  persistState();
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

[elements.capitalInput, elements.riskInput, elements.stopBudgetInput].forEach((input) => {
  input.addEventListener("input", () => {
    renderAll();
  });
});

elements.sizingMode.addEventListener("change", () => {
  renderAll();
});

elements.exportBook.addEventListener("click", () => {
  exportBookCsv();
});

document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", () => {
    toggleScreenerSort(button.dataset.sortKey);
    renderAll();
  });
});

renderAll();
