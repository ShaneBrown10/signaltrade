import React, { useState, useEffect } from 'react';

// =========================================================================
// 1. CONFIGURATION & CONFIG CONSTANTS
// =========================================================================
const API_KEY = "d9b6bkpr01qmk4gke3e0d9b6bkpr01qmk4gke3eg";
const TICKERS = ["SPY", "QQQ", "DIA", "EWU", "EWJ", "EWG", "EWQ", "EWA"];

// Friendly names mapping for your dashboard display
const TICKER_NAMES = {
  SPY: "S&P 500 ETF (US)",
  QQQ: "Nasdaq 100 ETF (US)",
  DIA: "Dow Jones ETF (US)",
  EWU: "MSCI United Kingdom ETF",
  EWJ: "MSCI Japan ETF",
  EWG: "MSCI Germany ETF",
  EWQ: "MSCI France ETF",
  EWA: "MSCI Australia ETF"
};

// Clean initial state matches Finnhub's mapping fields
const initialMarketData = TICKERS.reduce((acc, ticker) => {
  acc[ticker] = {
    symbol: ticker,
    name: TICKER_NAMES[ticker] || ticker,
    price: 0,
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    open: 0,
    prevClose: 0,
    session: "Loading..."
  };
  return acc;
}, {});

// =========================================================================
// 2. CUSTOM FINNHUB DATA FETCHING HOOK
// =========================================================================
function useFinnhubData() {
  const [marketData, setMarketData] = useState(initialMarketData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinnhubQuotes = async () => {
      setError(null);
      try {
        const fetchPromises = TICKERS.map(async (symbol) => {
          const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Failed to fetch ${symbol}`);
          }
          const data = await response.json();
          return { symbol, data };
        });

        const results = await Promise.all(fetchPromises);

        setMarketData((prevData) => {
          const updated = { ...prevData };
          results.forEach(({ symbol, data }) => {
            if (data && data.c !== undefined && data.c !== 0) {
              updated[symbol] = {
                ...updated[symbol],
                price: parseFloat(data.c),               // 'c': Current price
                change: parseFloat(data.d || 0),         // 'd': Change
                changePercent: parseFloat(data.dp || 0),  // 'dp': Percent change
                high: parseFloat(data.h || 0),           // 'h': High price of the day
                low: parseFloat(data.l || 0),            // 'l': Low price of the day
                open: parseFloat(data.o || 0),           // 'o': Open price of the day
                prevClose: parseFloat(data.pc || 0),     // 'pc': Previous close price
                session: "Finnhub Live"
              };
            } else {
              updated[symbol].session = "No Data Available";
            }
          });
          return updated;
        });
      } catch (err) {
        console.error("Finnhub update error: ", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinnhubQuotes();

    // Polls every 30 seconds (safe under Finnhub's 60 calls/minute limit)
    const interval = setInterval(fetchFinnhubQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  return { marketData, loading, error };
}

// =========================================================================
// 3. MAIN DASHBOARD RENDER COMPONENT
// =========================================================================
export default function App() {
  const { marketData, loading, error } = useFinnhubData();
  const [selectedTicker, setSelectedTicker] = useState("SPY");

  const activeDetails = marketData[selectedTicker];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Global Indices Monitor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time ETF tracking powered by Finnhub APIs
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          {loading && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          <span className="text-slate-400 uppercase font-mono tracking-wider">
            {loading ? "Updating pricing..." : "Quotes Active (30s Polling)"}
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Market Grid Lists (Left-side / 2 Columns Wide) */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-300 px-1">Watchlist Indices</h2>
          
          {error && (
            <div className="bg-rose-950/40 border border-rose-800/80 text-rose-200 px-4 py-3 rounded-lg text-sm">
              ⚠️ <strong>Data sync error:</strong> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(marketData).map((item) => {
              const isPositive = item.change >= 0;
              const isSelected = selectedTicker === item.symbol;

              return (
                <div
                  key={item.symbol}
                  onClick={() => setSelectedTicker(item.symbol)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border duration-150 ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950/20"
                      : "bg-slate-900/50 hover:bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.symbol}
                      </span>
                      <h3 className="text-sm font-medium text-slate-300 mt-1 truncate max-w-[150px]">
                        {item.name}
                      </h3>
                    </div>
                    <span className={`text-xs font-mono font-semibold px-2 py-1 rounded ${
                      isPositive 
                        ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" 
                        : "bg-rose-950/60 text-rose-400 border border-rose-800/40"
                    }`}>
                      {isPositive ? "+" : ""}{item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline mt-4">
                    <span className="text-xl font-bold font-mono">
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-500">
                      {item.session}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed Side Panel (Right-side / 1 Column Wide) */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-semibold text-slate-300 mb-4 border-b border-slate-800 pb-3">
            Symbol Detail View
          </h2>

          {activeDetails ? (
            <div>
              <div className="mb-6">
                <span className="text-sm font-mono text-cyan-400 font-bold uppercase">{activeDetails.symbol}</span>
                <h3 className="text-2xl font-bold mt-1 text-slate-100">{activeDetails.name}</h3>
                <p className="text-3xl font-mono font-bold mt-3 text-slate-50">
                  ${activeDetails.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className={`text-sm font-mono mt-1 ${activeDetails.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeDetails.change >= 0 ? '▲ +' : '▼ '}
                  {activeDetails.change.toFixed(2)} ({activeDetails.changePercent.toFixed(2)}%)
                </p>
              </div>

              <div className="space-y-3 font-mono text-sm pt-2">
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Daily Open</span>
                  <span className="text-slate-200">${activeDetails.open.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Daily High</span>
                  <span className="text-slate-200 text-emerald-400">${activeDetails.high.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Daily Low</span>
                  <span className="text-slate-200 text-rose-400">${activeDetails.low.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/60 pb-2">
                  <span className="text-slate-400">Prev. Close</span>
                  <span className="text-slate-200">${activeDetails.prevClose.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <span className="text-xxs text-slate-500 uppercase tracking-widest font-mono">
                  Data sourced instantly via Finnhub API socket
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              Select a ticker from the left side panel to view detailed intraday ranges.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
