WEALTHARIA — MUTUAL FUND RESEARCH UPDATE

Files:
- ai.html — updated AI Tools page
- api/moneycontrol-mf.js — Vercel Serverless Function

GitHub upload:
1. Upload/replace ai.html in the repository root.
2. Create the api folder if it does not already exist.
3. Upload moneycontrol-mf.js inside api/.
4. Commit both files to main.
5. Vercel will deploy the API at /api/moneycontrol-mf.

The API retrieves the Moneycontrol Mutual Fund Performance Tracker. It intentionally does NOT call CAGR/XIRR interchangeably. A genuine SIP XIRR needs dated cash flows/NAV history. If that input is unavailable, the UI shows a dash instead of an invented number.

The Type of Mutual Funds explainer explicitly includes Flexi Cap.
