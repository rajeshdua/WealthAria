// WealthAria — Moneycontrol Mutual Fund research adapter
// Vercel Serverless Function (Node.js 22/24 compatible)
//
// Important: this endpoint never invents or relabels returns.
// Moneycontrol publishes multiple return measures (including annualised/lumpsum
// and SIP-related views). A genuine SIP XIRR requires dated cash flows/NAVs.
// If those inputs are not available from the retrieved source, the API returns
// null for XIRR rather than calling CAGR "XIRR".

const TRACKER_URL = 'https://www.moneycontrol.com/mutual-funds/performance-tracker/';
const TRACKER_MOBILE_URL = 'https://m.moneycontrol.com/mutual-funds/performance_tracker.php';

const CATEGORY_GROUPS = {
  all: 'All categories',
  equity: 'Equity',
  hybrid: 'Hybrid',
  debt: 'Debt',
  solution: 'Solution Oriented',
  other: 'Other'
};

function cleanText(value) {
  return String(value || '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function htmlToText(html) {
  return cleanText(html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  );
}

function extractCategoryAverages(html) {
  // Moneycontrol's tracker contains category labels followed by a return value.
  // This parser is intentionally conservative: only values that are visibly
  // adjacent to a known category are returned.
  const text = htmlToText(html);
  const categories = [
    'Multi Cap Fund','Large Cap Fund','Large & Mid Cap Fund','Mid Cap Fund','Small Cap Fund',
    'ELSS','Dividend Yield Fund','Sectoral/Thematic','Contra Fund','Focused Fund','Value Fund',
    'Aggressive Hybrid Fund','Conservative Hybrid Fund','Arbitrage Fund','Equity Savings',
    'Dynamic Asset Allocation or Balanced Advantage','Multi Asset Allocation','Low Duration Fund',
    'Short Duration Fund','Medium Duration Fund','Medium to Long Duration Fund','Long Duration Fund',
    'Dynamic Bond Fund','Gilt Fund','Corporate Bond Fund','Credit Risk Fund','Floater Fund',
    'Banking and PSU Fund','Ultra Short Duration Fund','Liquid Fund','Money Market Fund','Overnight Fund',
    'Childrens Fund','Retirement Fund','Investment cum Insurance','Fund of Funds','Index Funds/ETFs'
  ];
  const out = [];
  for (const category of categories) {
    const escaped = category.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(escaped + '\\s+(-?\\d+(?:\\.\\d+)?%|--)', 'i');
    const match = text.match(re);
    if (match) {
      out.push({ category, averageReturn: match[1] });
    }
  }
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const categoryKey = String(req.query?.category || 'all').toLowerCase();
  const category = CATEGORY_GROUPS[categoryKey] || CATEGORY_GROUPS.all;

  try {
    const response = await fetch(TRACKER_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WealthAriaResearch/1.0)',
        'Accept': 'text/html,application/xhtml+xml'
      },
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`Moneycontrol returned HTTP ${response.status}`);
    }

    const html = await response.text();
    const averages = extractCategoryAverages(html);

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    res.status(200).json({
      ok: true,
      source: 'Moneycontrol Mutual Fund Performance Tracker',
      sourceUrl: TRACKER_URL,
      mobileSourceUrl: TRACKER_MOBILE_URL,
      category,
      categoryAverages: averages,
      topFunds: [],
      xirr: {
        oneYear: null,
        threeYear: null,
        fiveYear: null,
        sinceInception: null,
        status: 'not_verified',
        reason: 'Fund-level SIP XIRR requires dated SIP cash flows/NAV history. Moneycontrol return/CAGR figures are not relabelled as XIRR.'
      },
      note: 'Live Moneycontrol data was retrieved. Fund-level SIP XIRR is shown only when the required dated cash-flow inputs are available and independently calculated.'
    });
  } catch (error) {
    res.status(502).json({
      ok: false,
      error: 'Unable to retrieve Moneycontrol data right now.',
      detail: error?.message || String(error),
      sourceUrl: TRACKER_URL,
      category,
      xirr: { status: 'not_verified' }
    });
  }
}
