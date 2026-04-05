const state = {
  datasetName: "Built-in sample NYSE data",
  records: [],
  seriesMap: new Map(),
  pairs: [],
  activePairId: null,
};

const elements = {
  minPrice: document.querySelector("#minPrice"),
  maxPrice: document.querySelector("#maxPrice"),
  lookbackDays: document.querySelector("#lookbackDays"),
  topPairs: document.querySelector("#topPairs"),
  minPriceValue: document.querySelector("#minPriceValue"),
  maxPriceValue: document.querySelector("#maxPriceValue"),
  lookbackValue: document.querySelector("#lookbackValue"),
  topPairsValue: document.querySelector("#topPairsValue"),
  csvInput: document.querySelector("#csvInput"),
  resetButton: document.querySelector("#resetButton"),
  pairList: document.querySelector("#pairList"),
  chartTitle: document.querySelector("#chartTitle"),
  chartSummary: document.querySelector("#chartSummary"),
  statUniverse: document.querySelector("#statUniverse"),
  statEligible: document.querySelector("#statEligible"),
  statPairs: document.querySelector("#statPairs"),
  pairChart: document.querySelector("#pairChart"),
};

const SAMPLE_SERIES = buildSampleSeries();

function buildSampleSeries() {
  const tickers = [
    { ticker: "KO", exchange: "NYSE", base: 58, drift: 0.12, wave: 0.9 },
    { ticker: "PEP", exchange: "NYSE", base: 182, drift: 0.19, wave: 1.05 },
    { ticker: "XOM", exchange: "NYSE", base: 108, drift: 0.24, wave: 1.3 },
    { ticker: "CVX", exchange: "NYSE", base: 154, drift: 0.22, wave: 1.18 },
    { ticker: "JPM", exchange: "NYSE", base: 171, drift: 0.2, wave: 1.1 },
    { ticker: "BAC", exchange: "NYSE", base: 36, drift: 0.09, wave: 1.12 },
    { ticker: "WMT", exchange: "NYSE", base: 63, drift: 0.16, wave: 0.82 },
    { ticker: "TGT", exchange: "NYSE", base: 141, drift: 0.15, wave: 0.84 },
    { ticker: "CAT", exchange: "NYSE", base: 287, drift: 0.28, wave: 1.36 },
    { ticker: "DE", exchange: "NYSE", base: 378, drift: 0.3, wave: 1.42 },
    { ticker: "DAL", exchange: "NYSE", base: 41, drift: 0.08, wave: 1.46 },
    { ticker: "UAL", exchange: "NYSE", base: 45, drift: 0.085, wave: 1.42 },
  ];

  const start = new Date("2025-11-03T00:00:00Z");
  const records = [];

  for (let day = 0; day < 180; day += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + day);

    tickers.forEach((config, index) => {
      const pairBias =
        config.ticker === "KO" ? 0.18 :
        config.ticker === "PEP" ? 0.2 :
        config.ticker === "XOM" ? 0.25 :
        config.ticker === "CVX" ? 0.24 :
        config.ticker === "DAL" ? 0.16 :
        config.ticker === "UAL" ? 0.165 :
        config.drift;
      const seasonal = Math.sin((day + index * 3) / 9) * config.wave;
      const secondary = Math.cos((day + index * 5) / 17) * (config.wave * 0.45);
      const noise = Math.sin((day * (index + 2)) / 31) * 0.25;
      const close = Number(
        (config.base + pairBias * day + seasonal + secondary + noise).toFixed(2)
      );
      records.push({
        date: date.toISOString().slice(0, 10),
        ticker: config.ticker,
        exchange: config.exchange,
        close,
      });
    });
  }

  return records;
}

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  if (!headerLine) {
    return [];
  }

  const headers = headerLine.split(",").map((header) => header.trim().toLowerCase());
  const getIndex = (name) => headers.indexOf(name);
  const dateIndex = getIndex("date");
  const tickerIndex = getIndex("ticker");
  const exchangeIndex = getIndex("exchange");
  const closeIndex = getIndex("close");

  if ([dateIndex, tickerIndex, exchangeIndex, closeIndex].some((value) => value === -1)) {
    throw new Error("CSV must include date,ticker,exchange,close columns.");
  }

  return lines
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split(",").map((part) => part.trim());
      return {
        date: parts[dateIndex],
        ticker: parts[tickerIndex].toUpperCase(),
        exchange: parts[exchangeIndex].toUpperCase(),
        close: Number(parts[closeIndex]),
      };
    })
    .filter((row) => row.date && row.ticker && row.exchange && Number.isFinite(row.close));
}

function buildSeriesMap(records) {
  const seriesMap = new Map();

  records.forEach((record) => {
    if (!seriesMap.has(record.ticker)) {
      seriesMap.set(record.ticker, {
        ticker: record.ticker,
        exchange: record.exchange,
        points: [],
      });
    }
    seriesMap.get(record.ticker).points.push({
      date: record.date,
      close: record.close,
    });
  });

  seriesMap.forEach((series) => {
    series.points.sort((a, b) => a.date.localeCompare(b.date));
    series.latestClose = series.points.at(-1)?.close ?? 0;
  });

  return seriesMap;
}

function pearsonCorrelation(a, b) {
  const length = Math.min(a.length, b.length);
  if (length < 3) {
    return 0;
  }

  const seriesA = a.slice(-length);
  const seriesB = b.slice(-length);
  const meanA = seriesA.reduce((sum, value) => sum + value, 0) / length;
  const meanB = seriesB.reduce((sum, value) => sum + value, 0) / length;

  let numerator = 0;
  let denomA = 0;
  let denomB = 0;

  for (let index = 0; index < length; index += 1) {
    const devA = seriesA[index] - meanA;
    const devB = seriesB[index] - meanB;
    numerator += devA * devB;
    denomA += devA * devA;
    denomB += devB * devB;
  }

  const denominator = Math.sqrt(denomA * denomB);
  return denominator === 0 ? 0 : numerator / denominator;
}

function normalizedSeries(points, lookback) {
  const trimmed = points.slice(-lookback);
  const anchor = trimmed[0]?.close ?? 1;
  return trimmed.map((point) => ({
    date: point.date,
    close: point.close,
    normalized: (point.close / anchor) * 100,
  }));
}

function meanAbsoluteGap(seriesA, seriesB) {
  const length = Math.min(seriesA.length, seriesB.length);
  if (length === 0) {
    return Number.POSITIVE_INFINITY;
  }

  let total = 0;
  for (let index = 0; index < length; index += 1) {
    total += Math.abs(seriesA[index].normalized - seriesB[index].normalized);
  }
  return total / length;
}

function volatility(series) {
  if (series.length < 2) {
    return 0;
  }

  let total = 0;
  for (let index = 1; index < series.length; index += 1) {
    const change = (series[index].normalized - series[index - 1].normalized) / series[index - 1].normalized;
    total += change * change;
  }
  return Math.sqrt(total / (series.length - 1));
}

function computePairs() {
  const minPrice = Number(elements.minPrice.value);
  const maxPrice = Number(elements.maxPrice.value);
  const lookback = Number(elements.lookbackDays.value);
  const limit = Number(elements.topPairs.value);
  const previousActivePairId = state.activePairId;

  const universe = Array.from(state.seriesMap.values()).filter(
    (series) =>
      series.exchange === "NYSE" &&
      series.latestClose >= minPrice &&
      series.latestClose <= maxPrice &&
      series.points.length >= lookback
  );

  const pairs = [];

  for (let left = 0; left < universe.length; left += 1) {
    for (let right = left + 1; right < universe.length; right += 1) {
      const first = universe[left];
      const second = universe[right];
      const normalizedA = normalizedSeries(first.points, lookback);
      const normalizedB = normalizedSeries(second.points, lookback);
      const correlation = pearsonCorrelation(
        normalizedA.map((point) => point.normalized),
        normalizedB.map((point) => point.normalized)
      );
      const gap = meanAbsoluteGap(normalizedA, normalizedB);
      const volSpread = Math.abs(volatility(normalizedA) - volatility(normalizedB));
      const similarityScore = correlation * 100 - gap * 2.5 - volSpread * 120;

      pairs.push({
        id: `${first.ticker}-${second.ticker}`,
        first,
        second,
        normalizedA,
        normalizedB,
        correlation,
        gap,
        volSpread,
        similarityScore,
      });
    }
  }

  pairs.sort((a, b) => b.similarityScore - a.similarityScore);
  state.pairs = pairs.slice(0, limit);
  state.activePairId =
    state.pairs.find((pair) => pair.id === previousActivePairId)?.id ??
    state.pairs[0]?.id ??
    null;

  elements.statUniverse.textContent = `${state.seriesMap.size} stocks`;
  elements.statEligible.textContent = `${universe.length} stocks`;
  elements.statPairs.textContent = `${state.pairs.length} results`;

  renderPairList();
  renderActivePair();
}

function renderPairList() {
  if (state.pairs.length === 0) {
    elements.pairList.innerHTML = `
      <div class="empty-state">
        No pairs matched this price range and lookback window. Widen the range
        or load a larger NYSE dataset.
      </div>
    `;
    return;
  }

  elements.pairList.innerHTML = state.pairs
    .map((pair) => {
      const isActive = pair.id === state.activePairId;
      return `
        <button class="pair-item ${isActive ? "is-active" : ""}" data-pair-id="${pair.id}" type="button">
          <div class="pair-head">
            <div>
              <div class="pair-symbols">${pair.first.ticker} / ${pair.second.ticker}</div>
              <div class="pair-price">$${pair.first.latestClose.toFixed(2)} and $${pair.second.latestClose.toFixed(2)}</div>
            </div>
            <span class="metric-pill">${pair.similarityScore.toFixed(1)} score</span>
          </div>
          <div class="pair-metrics">
            <span class="metric-pill">corr ${pair.correlation.toFixed(3)}</span>
            <span class="metric-pill alt">gap ${pair.gap.toFixed(2)}</span>
            <span class="metric-pill">vol ${pair.volSpread.toFixed(3)}</span>
          </div>
        </button>
      `;
    })
    .join("");

  elements.pairList.querySelectorAll(".pair-item").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePairId = button.dataset.pairId;
      renderPairList();
      renderActivePair();
    });
  });
}

function renderActivePair() {
  const pair = state.pairs.find((entry) => entry.id === state.activePairId);
  if (!pair) {
    elements.chartTitle.textContent = "Select a pair";
    elements.chartSummary.textContent = `Data source: ${state.datasetName}.`;
    drawEmptyChart();
    return;
  }

  elements.chartTitle.textContent = `${pair.first.ticker} vs ${pair.second.ticker}`;
  elements.chartSummary.textContent =
    `Correlation ${pair.correlation.toFixed(3)}, average normalized gap ${pair.gap.toFixed(2)}, ` +
    `volatility spread ${pair.volSpread.toFixed(3)}. Data source: ${state.datasetName}.`;

  drawChart(pair);
}

function drawEmptyChart() {
  const canvas = elements.pairChart;
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#6d6154";
  context.font = "18px IBM Plex Mono";
  context.fillText("No pair selected", 40, 50);
}

function drawChart(pair) {
  const canvas = elements.pairChart;
  const context = canvas.getContext("2d");
  const padding = { top: 20, right: 16, bottom: 38, left: 54 };
  const width = canvas.width;
  const height = canvas.height;
  const pointsA = pair.normalizedA;
  const pointsB = pair.normalizedB;
  const allValues = [...pointsA, ...pointsB].map((point) => point.normalized);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueSpan = Math.max(maxValue - minValue, 1);

  context.clearRect(0, 0, width, height);
  context.fillStyle = "#fcfaf6";
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(31, 27, 22, 0.12)";
  context.lineWidth = 1;

  for (let tick = 0; tick <= 4; tick += 1) {
    const y = padding.top + ((height - padding.top - padding.bottom) / 4) * tick;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
  }

  context.fillStyle = "#6d6154";
  context.font = "12px IBM Plex Mono";

  for (let tick = 0; tick <= 4; tick += 1) {
    const value = maxValue - (valueSpan / 4) * tick;
    const y = padding.top + ((height - padding.top - padding.bottom) / 4) * tick;
    context.fillText(value.toFixed(1), 10, y + 4);
  }

  const drawLine = (series, color) => {
    context.beginPath();
    series.forEach((point, index) => {
      const x =
        padding.left +
        (index / Math.max(series.length - 1, 1)) * (width - padding.left - padding.right);
      const y =
        padding.top +
        ((maxValue - point.normalized) / valueSpan) * (height - padding.top - padding.bottom);
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.strokeStyle = color;
    context.lineWidth = 3;
    context.stroke();
  };

  drawLine(pointsA, "#1e6b5c");
  drawLine(pointsB, "#c85f31");

  context.fillStyle = "#1e6b5c";
  context.fillRect(width - 175, 18, 14, 14);
  context.fillStyle = "#1f1b16";
  context.fillText(pair.first.ticker, width - 154, 30);
  context.fillStyle = "#c85f31";
  context.fillRect(width - 98, 18, 14, 14);
  context.fillStyle = "#1f1b16";
  context.fillText(pair.second.ticker, width - 77, 30);

  const firstDate = pointsA[0]?.date ?? "";
  const lastDate = pointsA.at(-1)?.date ?? "";
  context.fillStyle = "#6d6154";
  context.fillText(firstDate, padding.left, height - 14);
  context.fillText(lastDate, width - padding.right - 78, height - 14);
}

function updateLabels() {
  let minPrice = Number(elements.minPrice.value);
  let maxPrice = Number(elements.maxPrice.value);

  if (minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
    elements.minPrice.value = String(minPrice);
    elements.maxPrice.value = String(maxPrice);
  }

  elements.minPriceValue.textContent = `$${minPrice}`;
  elements.maxPriceValue.textContent = `$${maxPrice}`;
  elements.lookbackValue.textContent = `${elements.lookbackDays.value} trading days`;
  elements.topPairsValue.textContent = `${elements.topPairs.value} pairs`;
}

function loadRecords(records, datasetName) {
  state.records = records;
  state.datasetName = datasetName;
  state.seriesMap = buildSeriesMap(records);
  updateLabels();
  computePairs();
}

function wireEvents() {
  [elements.minPrice, elements.maxPrice, elements.lookbackDays, elements.topPairs].forEach((input) => {
    input.addEventListener("input", () => {
      updateLabels();
      computePairs();
    });
  });

  elements.csvInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const text = await file.text();
    try {
      const records = parseCsv(text);
      loadRecords(records, file.name);
    } catch (error) {
      window.alert(error.message);
    }
  });

  elements.resetButton.addEventListener("click", () => {
    loadRecords(SAMPLE_SERIES, "Built-in sample NYSE data");
    elements.csvInput.value = "";
  });
}

wireEvents();
loadRecords(SAMPLE_SERIES, "Built-in sample NYSE data");
