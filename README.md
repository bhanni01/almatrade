# Research Pair Trading Viewer

This app now uses the local research saved in `offlimit/` instead of Reddit or a
generic NYSE scan.

The current source is:

- `offlimit/Pairs Trading Copula Vs Cointegration.html`

## What it shows

- the core takeaway from the saved QuantConnect article
- the two compared methods: copula and cointegration
- the ETF pair universe used in the research
- detail cards for each curated ETF pair

The pair universe extracted from the saved article includes:

- `QQQ / XLK`
- `XME / EWG`
- `TNA / TLT`
- `FAS / FAZ`
- `XLF / XLU`
- `EWC / EWA`
- `QLD / QID`

## Run

Open [index.html](/Users/nis/Desktop/coding/pair_trading/index.html) in a browser.

If you want to serve it locally:

```bash
cd /Users/nis/Desktop/coding/pair_trading
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- This viewer is a research digest, not a live trading engine.
- The saved article says the copula-based approach outperformed the cointegration
  benchmark in the tested setup.
- `offlimit/` is now ignored by git so the saved research assets stay local.
