# NYSE Pair Trading Viewer

This is a lightweight browser app for exploring pair-trading candidates from NYSE price history.

## What it does

- Filters stocks by latest price range.
- Limits comparisons to `NYSE` rows.
- Ranks pairs by a simple similarity score based on:
  - normalized price correlation
  - average normalized gap
  - volatility spread
- Lets you inspect the top pairs on a normalized price chart.

## CSV format

Upload a CSV with these columns:

```csv
date,ticker,exchange,close
2026-01-02,KO,NYSE,61.42
2026-01-02,PEP,NYSE,181.55
```

Requirements:

- one row per ticker per trading day
- `date` in `YYYY-MM-DD`
- `exchange` should be `NYSE` for rows you want included
- enough history for the chosen lookback window

## Run

Open [index.html](/Users/nis/Desktop/coding/pair_trading/index.html) in a browser.

If you want live or larger-scale market data later, the next step is adding a backend that pulls NYSE history from a real provider and then replacing the sample dataset / CSV upload flow.
