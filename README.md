# Pair Strategy Lab

This project is now a portfolio-oriented ETF pair strategy viewer.

## What changed

- Added a strategy lab layout with capital and risk controls.
- Added confidence and horizon filters for pair discovery.
- Added pair selection controls and a live allocated trade book table.
- Added a ranked signal screener so filtered pairs can be compared and added to the book quickly.
- Added sortable screener columns and CSV export for the selected book.
- Added shareable snapshot links that recreate the current filters, sizing inputs, active pair, distortion, and selected book from the URL.
- Added portfolio-level metrics: selected count, deployed risk, expected P/L, and average confidence.
- Kept the original pair relationship and distortion engine, and wired distortion into allocation weighting.

## Run

Open `index.html` in a browser.

Or use the local server:

```bash
npm start
```

Then visit `http://127.0.0.1:3000`.

## Notes

- This remains a research UI, not an execution engine.
- Risk and expected P/L values are model-driven approximations for planning.
