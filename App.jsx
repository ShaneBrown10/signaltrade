import React, { useState, useMemo, useEffect } from "react";
import {
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Radio,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  Newspaper,
  CalendarDays,
  Layers,
  Bell,
  Star,
  Settings,
  ChevronRight,
  Clock,
  AlertCircle,
  Target,
  CheckCircle2,
  XCircle,
  Crosshair,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Mock data base template (Fallback / Initial State Structure)
// ---------------------------------------------------------------------------

const ORDER = ["UK100", "JPN225", "DAX", "SPX500", "US30", "NAS100", "FRA40", "AU200"];

const INITIAL_INDEX_DATA = {
  UK100: {
    label: "UK100",
    fullName: "FTSE 100",
    session: "London · market open",
    price: 10497.29,
    change: 25.1,
    changePercent: 0.24,
    bias: "BULLISH",
    confidence: 61,
    sentiment: { bullish: 55, neutral: 26, bearish: 19 },
    range: { low: 35, high: 65 },
    volatility: "MEDIUM",
    volScore: 44,
    levels: { r3: 10560, r2: 10535, r1: 10515, pivot: 10495, s1: 10475, s2: 10450, s3: 10425 },
  },
  JPN225: {
    label: "JPN225",
    fullName: "Nikkei 225",
    session: "Tokyo · closed",
    price: 68557.73,
    change: 813.94,
    changePercent: 1.2,
    bias: "BULLISH",
    confidence: 74,
    sentiment: { bullish: 68, neutral: 16, bearish: 16 },
    range: { low: 150, high: 300 },
    volatility: "HIGH",
    volScore: 71,
    levels: { r3: 69100, r2: 68900, r1: 68720, pivot: 68550, s1: 68380, s2: 68200, s3: 68000 },
  },
  DAX: {
    label: "DAX",
    fullName: "Germany 40",
    session: "Frankfurt · market open",
    price: 25067.09,
    change: -50.27,
    changePercent: -0.2,
    bias: "NEUTRAL",
    confidence: 44,
    sentiment: { bullish: 34, neutral: 40, bearish: 26 },
    range: { low: -25, high: 30 },
    volatility: "LOW",
    volScore: 26,
    levels: { r3: 25180, r2: 25140, r1: 25105, pivot: 25065, s1: 25025, s2: 24985, s3: 24945 },
  },
  SPX500: {
    label: "SPX500",
    fullName: "S&P 500",
    session: "New York · pre-market",
    price: 7575.39,
    change: 31.64,
    changePercent: 0.42,
    bias: "BULLISH",
    confidence: 69,
    sentiment: { bullish: 60, neutral: 20, bearish: 20 },
    range: { low: 55, high: 75 },
    volatility: "LOW",
    volScore: 29,
    levels: { r3: 7610, r2: 7598, r1: 7587, pivot: 7575, s1: 7563, s2: 7551, s3: 7538 },
  },
  US30: {
    label: "US30",
    fullName: "Dow Jones",
    session: "New York · pre-market",
    price: 52637.01,
    change: 149.6,
    changePercent: 0.29,
    bias: "BULLISH",
    confidence: 58,
    sentiment: { bullish: 52, neutral: 26, bearish: 22 },
    range: { low: 60, high: 145 },
    volatility: "MEDIUM",
    volScore: 45,
    levels: { r3: 52950, r2: 52840, r1: 52740, pivot: 52630, s1: 52520, s2: 52410, s3: 52300 },
  },
  NAS100: {
    label: "NAS100",
    fullName: "Nasdaq 100",
    session: "New York · pre-market",
    price: 29825.11,
    change: 98.01,
    changePercent: 0.33,
    bias: "BULLISH",
    confidence: 66,
    sentiment: { bullish: 58, neutral: 22, bearish: 20 },
    range: { low: 120, high: 220 },
    volatility: "HIGH",
    volScore: 68,
    levels: { r3: 30050, r2: 29970, r1: 29900, pivot: 29820, s1: 29740, s2: 29660, s3: 29580 },
  },
  FRA40: {
    label: "FRA40",
    fullName: "CAC 40",
    session: "Paris · market open",
    price: 8338.97,
    change: 12.48,
    changePercent: 0.15,
    bias: "NEUTRAL",
    confidence: 46,
    sentiment: { bullish: 38, neutral: 38, bearish: 24 },
    range: { low: 15, high: 35 },
    volatility: "LOW",
    volScore: 30,
    levels: { r3: 8390, r2: 8370, r1: 8355, pivot: 8340, s1: 8325, s2: 8305, s3: 8285 },
  },
  AU200: {
    label: "AU200",
    fullName: "S&P/ASX 200",
    session: "Sydney · closed",
    price: 8806.0,
    change: 43.81,
    changePercent: 0.5,
    bias: "BULLISH",
    confidence: 55,
    sentiment: { bullish: 48, neutral: 28, bearish: 24 },
    range: { low: 20, high: 55 },
    volatility: "MEDIUM",
    volScore: 40,
    levels: { r3: 8870, r2: 8845, r1: 8825, pivot: 8805, s1: 8785, s2: 8760, s3: 8735 },
  },
};

const NEWS_ITEMS = [
  { id: 1, headline: "Fed signals patience as core inflation cools for a third month", source: "Reuters", time: "12m ago", tag: "SPX500", sentiment: "BULLISH", summary: "Officials struck a measured tone on rate cuts, but softer inflation prints have futures markets leaning toward easier policy into year-end." },
  { id: 2, headline: "BOJ hints at gradual policy normalization, yen firms", source: "Bloomberg", time: "38m ago", tag: "JPN225", sentiment: "BEARISH", summary: "A stronger yen is pressuring export-heavy names on the Nikkei, with auto and electronics majors leading the pullback." },
  { id: 3, headline: "Eurozone flash PMI beats expectations, DAX extends gains", source: "Handelsblatt", time: "1h ago", tag: "DAX", sentiment: "BULLISH", summary: "Manufacturing and services both surprised to the upside, easing recession concerns for Germany's largest exporters." },
  { id: 4, headline: "UK retail sales unexpectedly contract in June", source: "Financial Times", time: "2h ago", tag: "UK100", sentiment: "BEARISH", summary: "Consumer-facing names on the FTSE slipped after spending data missed forecasts, reviving questions on household demand." },
  { id: 5, headline: "Wall Street futures steady ahead of key earnings week", source: "CNBC", time: "3h ago", tag: "US30", sentiment: "NEUTRAL", summary: "Traders are holding positioning flat into a heavy slate of large-cap earnings, with implied volatility ticking modestly higher." },
  { id: 6, headline: "ECB officials signal no rush to cut rates further this quarter", source: "Reuters", time: "4h ago", tag: "DAX", sentiment: "NEUTRAL", summary: "Commentary was broadly balanced, keeping European equity futures range-bound in early trade." },
  { id: 7, headline: "Dollar index slips as broader risk appetite improves", source: "MarketWatch", time: "5h ago", tag: "MACRO", sentiment: "BULLISH", summary: "A softer greenback is providing a tailwind across major indices, particularly names with meaningful overseas revenue exposure." },
  { id: 8, headline: "Geopolitical tensions rattle energy markets, indices cautious", source: "Associated Press", time: "6h ago", tag: "MACRO", sentiment: "BEARISH", summary: "Crude's sharp move higher is weighing on sentiment broadly, with traders trimming risk ahead of the weekend." },
  { id: 9, headline: "Mega-cap chip rally lifts Nasdaq 100 to fresh session highs", source: "Bloomberg", time: "45m ago", tag: "NAS100", sentiment: "BULLISH", summary: "Continued AI infrastructure spending is powering semiconductor and cloud names, with the index brushing against record territory." },
  { id: 10, headline: "CAC 40 drifts sideways as luxury names offset energy weakness", source: "Les Echos", time: "1h ago", tag: "FRA40", sentiment: "NEUTRAL", summary: "Gains in high-end consumer names are roughly balancing softer oil-linked stocks, keeping Paris in a tight range." },
  { id: 11, headline: "ASX 200 extends advance as miners track firmer iron ore", source: "Australian Financial Review", time: "7h ago", tag: "AU200", sentiment: "BULLISH", summary: "Resource heavyweights are leading gains as commodity prices firm, with the big four banks also contributing modest support." },
];

const CALENDAR_EVENTS = [
  {
    day: "Today",
    events: [
      { time: "08:30", currency: "GBP", event: "UK GDP m/m", impact: "HIGH", prev: "0.2%", forecast: "0.1%", actual: "0.3%" },
      { time: "09:00", currency: "EUR", event: "German Ifo Business Climate", impact: "MEDIUM", prev: "88.3", forecast: "88.9", actual: "—" },
      { time: "12:30", currency: "USD", event: "Initial Jobless Claims", impact: "MEDIUM", prev: "235K", forecast: "230K", actual: "—" },
      { time: "14:00", currency: "USD", event: "Existing Home Sales", impact: "LOW", prev: "4.11M", forecast: "4.15M", actual: "—" },
      { time: "23:50", currency: "JPY", event: "BOJ Core CPI", impact: "HIGH", prev: "2.3%", forecast: "2.2%", actual: "—" },
    ],
  },
  {
    day: "Tomorrow",
    events: [
      { time: "01:30", currency: "JPY", event: "Tokyo CPI y/y", impact: "HIGH", prev: "2.2%", forecast: "2.1%", actual: "—" },
      { time: "09:00", currency: "EUR", event: "Eurozone Flash PMI", impact: "MEDIUM", prev: "51.2", forecast: "51.5", actual: "—" },
      { time: "12:30", currency: "USD", event: "Durable Goods Orders", impact: "MEDIUM", prev: "0.3%", forecast: "0.2%", actual: "—" },
      { time: "14:00", currency: "USD", event: "Fed Chair Powell Speech", impact: "HIGH", prev: "—", forecast: "—", actual: "—" },
    ],
  },
];

const CANDLES_4H = {
  JPN225: [
    { time: "Mon 04:00", open: 68300, high: 68420, low: 68100, close: 68250 },
    { time: "Mon 08:00", open: 68250, high: 68300, low: 67980, close: 68050 },
    { time: "Mon 12:00", open: 68050, high: 68120, low: 67750, close: 67900 },
    { time: "Mon 16:00", open: 67900, high: 68150, low: 67850, close: 68100 },
    { time: "Mon 20:00", open: 68100, high: 68450, low: 68050, close: 68400 },
    { time: "Tue 00:00", open: 68400, high: 68700, low: 68350, close: 68557.73 },
  ],
};

const CANDLES_10MIN = {
  JPN225: [
    { time: "09:40", open: 68520, high: 68530, low: 68505, close: 68515 },
    { time: "09:50", open: 68515, high: 68520, low: 68490, close: 68498 },
    { time: "10:00", open: 68498, high: 68505, low: 68470, close: 68480 },
    { time: "10:10", open: 68480, high: 68500, low: 68478, close: 68495 },
    { time: "10:20", open: 68495, high: 68525, low: 68490, close: 68518 },
    { time: "10:30", open: 68522, high: 68565, low: 68515, close: 68557.73 },
  ],
};

const CANDLES_BY_TIMEFRAME = {
  "4HR": CANDLES_4H,
  "10MIN": CANDLES_10MIN,
};

const TIMEFRAME_COPY = {
  "4HR": { triggerLabel: "4HR Bullish Overshadow confirmed — anchor candle body cleared", patternName: "4HR Overshadow" },
  "10MIN": { triggerLabel: "10MIN Momentum Trigger confirmed — anchor candle body cleared", patternName: "10MIN Momentum Trigger" },
};

// ---------------------------------------------------------------------------
// Strategy execution math engine
// ---------------------------------------------------------------------------

function getQualification(data) {
  const { bias, sentiment } = data;
  if (bias === "BULLISH") {
    if (sentiment.bullish > 60) {
      return { status: "QUALIFIED", direction: "BUY", reason: `${sentiment.bullish}% bullish probability — above the 60% threshold` };
    }
    return { status: "DISQUALIFIED", direction: null, reason: sentiment.bullish === 60 ? "60% bullish probability — must be strictly above 60%" : `${sentiment.bullish}% bullish probability — below the 60% threshold` };
  }
  if (bias === "BEARISH") {
    if (sentiment.bearish > 60) {
      return { status: "QUALIFIED", direction: "SELL", reason: `${sentiment.bearish}% bearish probability — above the 60% threshold` };
    }
    return { status: "DISQUALIFIED", direction: null, reason: sentiment.bearish === 60 ? "60% bearish probability — must be strictly above 60%" : `${sentiment.bearish}% bearish probability — below the 60% threshold` };
  }
  return { status: "DISQUALIFIED", direction: null, reason: "Neutral structural bias — no directional edge" };
}

function detectOvershadowSignal(candles, direction) {
  if (!candles || candles.length < 4) return null;

  for (let i = 1; i < candles.length - 1; i++) {
    const prev = candles[i - 1];
    const curr = candles[i];
    const next = candles[i + 1];

    const isSwingLow = direction === "BUY" && curr.low < prev.low && curr.low < next.low;
    const isSwingHigh = direction === "SELL" && curr.high > prev.high && curr.high > next.high;
    if (!isSwingLow && !isSwingHigh) continue;

    const anchorIndex = i - 2;
    if (anchorIndex < 0) continue;
    const anchor = candles[anchorIndex];
    const anchorTop = Math.max(anchor.open, anchor.close);
    const anchorBottom = Math.min(anchor.open, anchor.close);

    for (let j = i + 1; j <= Math.min(i + 3, candles.length - 1); j++) {
      const bar = candles[j];
      if (direction === "BUY" && Math.min(bar.open, bar.close) > anchorTop) {
        return { direction: "BUY", swingIndex: i, anchorIndex, triggerIndex: j, stopLoss: curr.low, entry: bar.close };
      }
      if (direction === "SELL" && Math.max(bar.open, bar.close) < anchorBottom) {
        return { direction: "SELL", swingIndex: i, anchorIndex, triggerIndex: j, stopLoss: curr.high, entry: bar.close };
      }
    }
  }
  return null;
}

// Theme Config blocks
const BIAS_THEME = {
  BULLISH: { text: "text-emerald-400", bar: "bg-emerald-400", softBg: "bg-emerald-400/10", border: "border-emerald-400/30", glow: "shadow-[0_0_40px_-12px_rgba(52,211,153,0.35)]" },
  BEARISH: { text: "text-rose-400", bar: "bg-rose-400", softBg: "bg-rose-400/10", border: "border-rose-400/30", glow: "shadow-[0_0_40px_-12px_rgba(251,113,133,0.35)]" },
  NEUTRAL: { text: "text-amber-300", bar: "bg-amber-300", softBg: "bg-amber-300/10", border: "border-amber-300/30", glow: "shadow-[0_0_40px_-12px_rgba(252,211,77,0.3)]" },
};
const VOL_THEME = { HIGH: "text-rose-400 bg-rose-400/10 border-rose-400/30", MEDIUM: "text-amber-300 bg-amber-300/10 border-amber-300/30", LOW: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" };
const IMPACT_THEME = { HIGH: { dot: "bg-rose-400", text: "text-rose-400", label: "High" }, MEDIUM: { dot: "bg-amber-300", text: "text-amber-300", label: "Medium" }, LOW: { dot: "bg-slate-500", text: "text-slate-400", label: "Low" } };

function fmt(n, digits = 2) { return n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits }); }
function signed(n, digits = 2) { return `${n >= 0 ? "+" : ""}${fmt(n, digits)}`; }
function fmtPrice(n) { return `$${fmt(n)}`; }

// ---------------------------------------------------------------------------
// Shared UI Modules
// ---------------------------------------------------------------------------

function SentimentDonut({ sentiment }) {
  const size = 168; const stroke = 16; const r = (size - stroke) / 2; const c = 2 * Math.PI * r;
  const segs = [
    { key: "bullish", value: sentiment.bullish, color: "#34d399" },
    { key: "neutral", value: sentiment.neutral, color: "#fcd34d" },
    { key: "bearish", value: sentiment.bearish, color: "#fb7185" },
  ];
  let offsetAcc = 0;
  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={stroke} />
        {segs.map((seg) => {
          const len = (seg.value / 100) * c; const dashoffset = -offsetAcc; offsetAcc += len;
          return <circle key={seg.key} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={seg.color} strokeWidth={stroke} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={dashoffset} style={{ transition: "stroke-dasharray 500ms ease, stroke-dashoffset 500ms ease" }} />;
        })}
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold text-slate-100 tabular-nums">{sentiment.bullish}%</span>
        <span className="text-[10px] uppercase tracking-widest text-slate-500">Bullish</span>
      </div>
    </div>
  );
}

function TickerTape({ active, onSelect, marketData }) {
  const items = ORDER.map((key) => marketData[key]);
  const track = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-slate-950/60">
      <div className="ticker-track flex w-max items-center gap-8 py-2 px-4">
        {track.map((d, i) => {
          const up = d.change >= 0;
          return (
            <button key={`${d.label}-${i}`} onClick={() => onSelect(d.label)} className={`flex shrink-0 items-center gap-2 text-xs font-mono tracking-tight transition-colors ${d.label === active ? "text-slate-100" : "text-slate-500 hover:text-slate-300"}`}>
              <span className="font-semibold">{d.label}</span>
              <span className="tabular-nums">{fmtPrice(d.price)}</span>
              <span className={`flex items-center gap-0.5 tabular-nums ${up ? "text-emerald-400" : "text-rose-400"}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {signed(d.changePercent)}%
              </span>
            </button>
          );
        })}
      </div>
      <style>{`.ticker-track { animation: ticker-scroll 32s linear infinite; } @keyframes ticker-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

const PAGES = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "news", label: "News", icon: Newspaper },
  { key: "calendar", label: "Calendar", icon: CalendarDays },
  { key: "levels", label: "Levels", icon: Layers },
  { key: "signals", label: "Signals", icon: Target },
];

function PageNav({ page, setPage }) {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-3">
      <div className="flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-1">
        {PAGES.map(({ key, label, icon: Icon }) => {
          const isActive = key === page;
          return (
            <button key={key} onClick={() => setPage(key)} className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${isActive ? "bg-slate-800 text-slate-100 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IndexTabs({ active, setActive, marketData }) {
  return (
    <div className="mx-auto max-w-2xl overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center gap-2">
        {ORDER.map((key) => {
          const d = marketData[key];
          const isActive = key === active;
          const upColor = d.change >= 0 ? "text-emerald-400" : "text-rose-400";
          return (
            <button key={key} onClick={() => setActive(key)} className={`flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-4 py-2 transition-all ${isActive ? "border-slate-700 bg-slate-900 shadow-sm" : "border-transparent bg-slate-900/40 hover:bg-slate-900/70"}`}>
              <span className={`text-xs font-semibold tracking-tight ${isActive ? "text-slate-100" : "text-slate-400"}`}>{d.label}</span>
              <span className={`font-mono text-[11px] tabular-nums ${upColor}`}>{signed(d.changePercent)}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard page view module
// ---------------------------------------------------------------------------

function DashboardPage({ active, marketData }) {
  const data = marketData[active];
  const theme = BIAS_THEME[data.bias];
  const isUp = data.change >= 0;
  const BiasIcon = data.bias === "BULLISH" ? TrendingUp : data.bias === "BEARISH" ? TrendingDown : Minus;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-slate-500">
            {data.fullName} <span className="h-1 w-1 rounded-full bg-slate-700" /> {data.session}
          </div>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold tabular-nums text-slate-50">{fmtPrice(data.price)}</span>
            <span className={`flex items-center gap-1 font-mono text-sm font-medium tabular-nums ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
              {isUp ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
              {signed(data.change)} ({signed(data.changePercent)}%)
            </span>
          </div>
        </div>
      </div>

      <section className={`rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-900/60 p-5 shadow-xl ${theme.glow}`}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Market Bias</span>
          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${theme.border} ${theme.softBg} ${theme.text}`}>{data.confidence}% confidence</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.softBg} ${theme.text}`}><BiasIcon size={22} strokeWidth={2.5} /></span>
          <span className={`text-3xl font-extrabold tracking-tight ${theme.text}`}>{data.bias}</span>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full rounded-full ${theme.bar} transition-all duration-500`} style={{ width: `${data.confidence}%` }} />
        </div>
        <div className="my-5 h-px w-full bg-slate-800" />
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="order-2 flex flex-col gap-2.5 sm:order-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Sentiment Probability</span>
            {[
              { label: "Bullish", value: data.sentiment.bullish, color: "bg-emerald-400" },
              { label: "Neutral", value: data.sentiment.neutral, color: "bg-amber-300" },
              { label: "Bearish", value: data.sentiment.bearish, color: "bg-rose-400" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-xs">
                <span className={`h-2 w-2 rounded-full ${s.color}`} />
                <span className="w-14 text-slate-400">{s.label}</span>
                <span className="font-mono font-medium tabular-nums text-slate-200">{s.value}%</span>
              </div>
            ))}
          </div>
          <div className="order-1 sm:order-2"><SentimentDonut sentiment={data.sentiment} /></div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Expected Range</span>
          <div className="mt-2 font-mono text-lg font-semibold tabular-nums text-slate-100">{signed(data.range.low, 0)} <span className="text-slate-600">to</span> {signed(data.range.high, 0)}</div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full w-2/3 rounded-full ${theme.bar} opacity-70`} />
          </div>
          <span className="mt-1.5 block text-[10px] text-slate-500">points, next session</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Volatility / Risk</span>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-bold tracking-wide ${VOL_THEME[data.volatility]}`}><Zap size={12} />{data.volatility}</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${data.volatility === "HIGH" ? "bg-rose-400" : data.volatility === "MEDIUM" ? "bg-amber-300" : "bg-emerald-400"}`} style={{ width: `${data.volScore}%` }} />
          </div>
          <span className="mt-1.5 block text-[10px] text-slate-500">risk score {data.volScore}/100</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// News Page Module
// ---------------------------------------------------------------------------

function NewsPage() {
  const [filter, setFilter] = useState("ALL");
  const filters = ["ALL", ...ORDER, "MACRO"];
  const filtered = filter === "ALL" ? NEWS_ITEMS : NEWS_ITEMS.filter((n) => n.tag === filter);

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">
      <div className="mb-4 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold tracking-tight transition-colors ${filter === f ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-800/80 bg-slate-900/40 text-slate-500 hover:text-slate-300"}`}>
            {f === "ALL" ? "All" : f === "MACRO" ? "Macro" : f}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {filtered.map((n) => {
          const theme = BIAS_THEME[n.sentiment];
          const Icon = n.sentiment === "BULLISH" ? TrendingUp : n.sentiment === "BEARISH" ? TrendingDown : Minus;
          return (
            <article key={n.id} className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${theme.softBg} ${theme.text}`}><Icon size={14} strokeWidth={2.5} /></span>
                  <span className="rounded-full border border-slate-700/80 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{n.tag === "MACRO" ? "Macro" : n.tag}</span>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-500"><Clock size={11} />{n.time}</span>
              </div>
              <h3 className="mt-3 text-sm font-semibold leading-snug text-slate-100">{n.headline}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-400">{n.summary}</p>
              <span className="mt-2 block text-[11px] font-medium text-slate-600">{n.source}</span>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Calendar Page Module
// ---------------------------------------------------------------------------

function CalendarPage() {
  const [impactFilter, setImpactFilter] = useState("ALL");
  const impacts = ["ALL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">
      <div className="mb-4 flex items-center gap-2">
        {impacts.map((i) => (
          <button key={i} onClick={() => setImpactFilter(i)} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${impactFilter === i ? "border-slate-700 bg-slate-800 text-slate-100" : "border-slate-800/80 bg-slate-900/40 text-slate-500 hover:text-slate-300"}`}>
            {i !== "ALL" && <span className={`h-1.5 w-1.5 rounded-full ${IMPACT_THEME[i].dot}`} />}
            {i === "ALL" ? "All" : IMPACT_THEME[i].label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6">
        {CALENDAR_EVENTS.map((group) => {
          const events = impactFilter === "ALL" ? group.events : group.events.filter((e) => e.impact === impactFilter);
          if (events.length === 0) return null;
          return (
            <div key={group.day}>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{group.day}</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-sm">
                {events.map((e, i) => (
                  <div key={`${group.day}-${i}`} className={`flex items-center gap-3 px-4 py-3 ${i !== events.length - 1 ? "border-b border-slate-800/60" : ""}`}>
                    <span className="w-12 shrink-0 font-mono text-xs tabular-nums text-slate-400">{e.time}</span>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${IMPACT_THEME[e.impact].dot}`} />
                    <span className="w-11 shrink-0 rounded-md bg-slate-800/80 px-1.5 py-0.5 text-center text-[10px] font-bold text-slate-300">{e.currency}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-slate-200">{e.event}</p></div>
                    <div className="hidden shrink-0 gap-3 text-right font-mono text-[11px] tabular-nums text-slate-500 sm:flex">
                      <span title="Previous">P {e.prev}</span>
                      <span title="Forecast">F {e.forecast}</span>
                      <span className={e.actual !== "—" ? "font-semibold text-slate-200" : ""} title="Actual">A {e.actual}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-600">
        <AlertCircle size={12} /> Times shown in GMT · P = previous, F = forecast, A = actual
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key Levels Page Module
// ---------------------------------------------------------------------------

function LevelLadder({ data }) {
  const { levels, price } = data;
  const rows = [
    { key: "r3", label: "R3", value: levels.r3, kind: "res" },
    { key: "r2", label: "R2", value: levels.r2, kind: "res" },
    { key: "r1", label: "R1", value: levels.r1, kind: "res" },
    { key: "pivot", label: "PIVOT", value: levels.pivot, kind: "pivot" },
    { key: "s1", label: "S1", value: levels.s1, kind: "sup" },
    { key: "s2", label: "S2", value: levels.s2, kind: "sup" },
    { key: "s3", label: "S3", value: levels.s3, kind: "sup" },
  ];
  const top = levels.r3; const bottom = levels.s3; const span = top - bottom;
  const pricePct = Math.min(100, Math.max(0, ((top - price) / span) * 100));

  const kindStyle = {
    res: "text-rose-400 border-rose-400/20 bg-rose-400/5",
    pivot: "text-amber-300 border-amber-300/25 bg-amber-300/5",
    sup: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
  };

  return (
    <div className="relative">
      <div className="absolute left-[68px] top-2 bottom-2 w-px bg-slate-800" />
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.key} className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${kindStyle[row.kind]}`}>
            <span className="w-11 shrink-0 text-[11px] font-bold tracking-wide">{row.label}</span>
            <span className="relative z-10 h-2 w-2 shrink-0 rounded-full bg-current" />
            <span className="font-mono text-sm font-semibold tabular-nums text-slate-100">{fmtPrice(row.value)}</span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute left-0 right-0 flex items-center gap-2" style={{ top: `calc(${pricePct}% - 1px)` }}>
        <div className="h-px flex-1 bg-slate-100/40 [background-image:repeating-linear-gradient(to_right,rgba(226,232,240,0.6)_0,rgba(226,232,240,0.6)_4px,transparent_4px,transparent_8px)]" />
        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold tabular-nums text-slate-900 shadow">{fmtPrice(price)}</span>
      </div>
    </div>
  );
}

// LevelsPage module definitions
function LevelsPage({ active, marketData }) {
  const data = marketData[active];
  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">{data.fullName} · Key Levels</h2>
          <p className="text-[11px] text-slate-500">Pivot points from prior session, updated intraday</p>
        </div>
        <span className="font-mono text-sm font-semibold tabular-nums text-slate-100">{fmtPrice(data.price)}</span>
      </div>
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 pt-6 shadow-sm"><LevelLadder data={data} /></div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Nearest Resistance</span>
          <div className="mt-2 font-mono text-lg font-semibold tabular-nums text-rose-400">{fmtPrice(data.levels.r1)}</div>
          <span className="mt-1.5 block text-[10px] text-slate-500">{fmt(Math.abs(data.levels.r1 - data.price), 1)} pts away</span>
        </div>
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-sm">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Nearest Support</span>
          <div className="mt-2 font-mono text-lg font-semibold tabular-nums text-emerald-400">{fmtPrice(data.levels.s1)}</div>
          <span className="mt-1.5 block text-[10px] text-slate-500">{fmt(Math.abs(data.price - data.levels.s1), 1)} pts away</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signals System Module
// ---------------------------------------------------------------------------

function CandlestickMini({ candles, signal }) {
  const width = 560; const height = 200; const padX = 28; const padY = 16;
  const slot = (width - padX * 2) / candles.length; const bodyWidth = Math.min(22, slot * 0.5);
  const highs = candles.map((c) => c.high); const lows = candles.map((c) => c.low);
  const max = Math.max(...highs); const min = Math.min(...lows); const span = max - min || 1;
  const yFor = (v) => padY + (1 - (v - min) / span) * (height - padY * 2);
  const xFor = (i) => padX + slot * i + slot / 2;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      {candles.map((c, i) => {
        const up = c.close >= c.open; const x = xFor(i); const color = up ? "#34d399" : "#fb7185";
        const isAnchor = i === signal.anchorIndex; const isSwing = i === signal.swingIndex; const isTrigger = i === signal.triggerIndex;
        return (
          <g key={i}>
            <line x1={x} x2={x} y1={yFor(c.high)} y2={yFor(c.low)} stroke={color} strokeWidth={1.5} />
            <rect x={x - bodyWidth / 2} y={yFor(Math.max(c.open, c.close))} width={bodyWidth} height={Math.max(2, Math.abs(yFor(c.open) - yFor(c.close)))} fill={color} opacity={isTrigger ? 1 : 0.85} stroke={isTrigger ? "#f8fafc" : "none"} strokeWidth={isTrigger ? 1.5 : 0} rx={2} />
            {isAnchor && <text x={x} y={yFor(c.high) - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fcd34d">A</text>}
            {isSwing && <text x={x} y={yFor(c.low) + 16} textAnchor="middle" fontSize="11" fontWeight="700" fill="#94a3b8">SL</text>}
            {isTrigger && <text x={x} y={yFor(c.high) - 8} textAnchor="middle" fontSize="11" fontWeight="700" fill="#34d399">▲</text>}
          </g>
        );
      })}
      <line x1={padX} x2={width - padX} y1={yFor(Math.max(candles[signal.anchorIndex].open, candles[signal.anchorIndex].close))} y2={yFor(Math.max(candles[signal.anchorIndex].open, candles[signal.anchorIndex].close))} stroke="#fcd34d" strokeDasharray="3 4" strokeWidth={1} opacity={0.5} />
      <line x1={padX} x2={width - padX} y1={yFor(signal.stopLoss)} y2={yFor(signal.stopLoss)} stroke="#fb7185" strokeDasharray="3 4" strokeWidth={1} opacity={0.6} />
    </svg>
  );
}

function SignalCard({ tickerKey, timeframe, marketData }) {
  const data = marketData[tickerKey];
  const qual = getQualification(data);
  const candles = CANDLES_BY_TIMEFRAME[timeframe][tickerKey];
  const signal = qual.status === "QUALIFIED" && candles ? detectOvershadowSignal(candles, qual.direction) : null;
  const copy = TIMEFRAME_COPY[timeframe];

  if (qual.status !== "QUALIFIED") {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
        <div className="flex items-center gap-3">
          <XCircle size={16} className="shrink-0 text-slate-600" />
          <div>
            <div className="text-sm font-semibold text-slate-300">{tickerKey} <span className="font-normal text-slate-500">· {data.fullName}</span></div>
            <p className="text-[11px] text-slate-500">{qual.reason} — macro/sentiment conditions not met</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-slate-700/80 bg-slate-800/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">No trigger search</span>
      </div>
    );
  }

  const dirTheme = qual.direction === "BUY" ? BIAS_THEME.BULLISH : BIAS_THEME.BEARISH;
  const DirIcon = qual.direction === "BUY" ? TrendingUp : TrendingDown;
  const riskDistance = signal ? Math.abs(signal.entry - signal.stopLoss) : null;

  return (
    <div className={`rounded-2xl border bg-gradient-to-b from-slate-900 to-slate-900/60 p-4 shadow-xl ${dirTheme.border} ${dirTheme.glow}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${dirTheme.softBg} ${dirTheme.text}`}><Target size={16} strokeWidth={2.5} /></span>
          <div>
            <div className="text-sm font-bold text-slate-100">{tickerKey} <span className="font-normal text-slate-500">· {data.fullName}</span></div>
            <p className="text-[11px] text-slate-500">{qual.reason}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${dirTheme.border} ${dirTheme.softBg} ${dirTheme.text}`}><CheckCircle2 size={12} />Qualified</span>
      </div>

      {signal ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${dirTheme.softBg} ${dirTheme.text}`}><DirIcon size={22} strokeWidth={2.5} /></span>
            <div>
              <div className={`text-2xl font-extrabold tracking-tight ${dirTheme.text}`}>{timeframe} {qual.direction} SIGNAL</div>
              <p className="text-[11px] text-slate-500">{copy.triggerLabel}</p>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
            <CandlestickMini candles={candles} signal={signal} />
            <div className="mt-2 flex items-center gap-4 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-300" /> A · anchor candle</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-400" /> SL · swing low</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> ▲ · {timeframe === "4HR" ? "overshadow" : "momentum"} trigger</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{timeframe === "4HR" ? "Entry (trigger close)" : "Scalp Entry"}</span>
              <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-slate-100">{fmtPrice(signal.entry)}</div>
            </div>
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-3">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-400/80">Invalidation / Stop-Loss</span>
              <div className="mt-1 font-mono text-lg font-semibold tabular-nums text-rose-400">{fmtPrice(signal.stopLoss)}</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/40 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{timeframe === "4HR" ? "Swing Range" : "Scalp Range"}</span>
            <span className="font-mono text-xs font-semibold tabular-nums text-slate-300">{fmt(riskDistance, 2)} pts</span>
          </div>
          <p className="mt-2 text-[10px] text-slate-600">Stop set at the swing {qual.direction === "BUY" ? "low" : "high"} — the fractal level that invalidates this structure.</p>
        </>
      ) : (
        <p className="mt-3 text-xs text-slate-400">Sentiment conditions are met, but no confirmed {copy.patternName} breakout has printed yet — no trade triggered.</p>
      )}
    </div>
  );
}

function SignalsPage({ marketData }) {
  const [timeframe, setTimeframe] = useState("4HR");
  return (
    <div className="mx-auto max-w-2xl px-4 pb-8">
      <div className="mb-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2"><Crosshair size={15} className="text-slate-400" /><h2 className="text-sm font-semibold text-slate-100">Multi-Layer Signal Filter</h2></div>
          <div className="flex shrink-0 items-center gap-1 rounded-full border border-slate-800/80 bg-slate-950/60 p-1">
            {["4HR", "10MIN"].map((tf) => (
              <button key={tf} onClick={() => setTimeframe(tf)} className={`rounded-full px-3 py-1 text-[11px] font-bold tracking-wide transition-all ${timeframe === tf ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}>{tf}</button>
            ))}
          </div>
        </div>
        <p className="mt-2.5 text-[12px] leading-relaxed text-slate-500">A ticker only qualifies for a BUY/SELL trigger search when its structural bias is directional (not Neutral) and its sentiment probability sits strictly above 60%. Everything else is disqualified before any {timeframe === "4HR" ? "4HR chart pattern" : "10MIN chart pattern"} is even checked.</p>
      </div>
      <div className="flex flex-col gap-3">
        {ORDER.map((key) => <SignalCard key={key} tickerKey={key} timeframe={timeframe} marketData={marketData} />)}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2 text-center text-[11px] text-slate-600"><AlertCircle size={12} />Illustrative mock data and rules-based logic · not financial advice</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Core App Shell & Integration Router
// ---------------------------------------------------------------------------

export default function TradeIndicesApp() {
  const [page, setPage] = useState("dashboard");
  const [active, setActive] = useState("SPX500");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Initialize state with fallback template data
  const [marketData, setMarketData] = useState(INITIAL_INDEX_DATA);

  useEffect(() => {
    const fetchLivePrices = async () => {
      try {
        const apiKey = "95930185850d4373b4322f36d612a15f";
        const symbols = "SPX,DJI,IXIC,FTSE"; 
        
        const response = await fetch(
          `https://api.twelvedata.com/quote?symbol=${symbols}&apikey=${apiKey}`
        );
        const data = await response.json();

        setMarketData((prev) => {
          const next = { ...prev };
          
          // Sync index price endpoints smoothly with current UI layouts
          if (data.SPX && data.SPX.close) {
            next.SPX500.price = parseFloat(data.SPX.close);
            next.SPX500.change = parseFloat(data.SPX.change || 0);
            next.SPX500.changePercent = parseFloat(data.SPX.percent_change || 0);
          }
          if (data.DJI && data.DJI.close) {
            next.US30.price = parseFloat(data.DJI.close);
            next.US30.change = parseFloat(data.DJI.change || 0);
            next.US30.changePercent = parseFloat(data.DJI.percent_change || 0);
          }
          if (data.IXIC && data.IXIC.close) {
            next.NAS100.price = parseFloat(data.IXIC.close);
            next.NAS100.change = parseFloat(data.IXIC.change || 0);
            next.NAS100.changePercent = parseFloat(data.IXIC.percent_change || 0);
          }
          if (data.FTSE && data.FTSE.close) {
            next.UK100.price = parseFloat(data.FTSE.close);
            next.UK100.change = parseFloat(data.FTSE.change || 0);
            next.UK100.changePercent = parseFloat(data.FTSE.percent_change || 0);
          }
          
          return next;
        });
      } catch (error) {
        console.error("Error pulling live index updates:", error);
      }
    };

    fetchLivePrices();
    
    // Auto refresh cycle mapped every 60 seconds
    const interval = setInterval(fetchLivePrices, 60000); 
    return () => clearInterval(interval);
  }, []);

  const showIndexTabs = page === "dashboard" || page === "levels";

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans antialiased">
      <TickerTape
        active={active}
        marketData={marketData}
        onSelect={(label) => {
          setActive(label);
          setPage("dashboard");
        }}
      />

      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <button onClick={() => setMenuOpen(true)} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-900 hover:text-slate-100" aria-label="Open menu"><Menu size={20} /></button>
          <h1 className="text-[15px] font-bold tracking-tight text-slate-50">Trade Indices</h1>
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-2.5 py-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-emerald-400">Live Feed</span>
          </div>
        </div>

        <PageNav page={page} setPage={setPage} />
        {showIndexTabs && <IndexTabs active={active} setActive={setActive} marketData={marketData} />}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-slate-800 bg-slate-950 p-5">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-sm font-bold tracking-tight text-slate-50">Trade Indices</span>
              <button onClick={() => setMenuOpen(false)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-slate-100" aria-label="Close menu"><X size={18} /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {PAGES.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => { setPage(key); setMenuOpen(false); }} className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${page === key ? "bg-slate-900 text-slate-100" : "text-slate-300 hover:bg-slate-900 hover:text-slate-100"}`}>
                  <span className="flex items-center gap-3"><Icon size={16} className="text-slate-500" />{label}</span>
                  <ChevronRight size={14} className="text-slate-600" />
                </button>
              ))}
              <div className="my-2 h-px w-full bg-slate-800" />
              {[
                { icon: Star, label: "Watchlist" },
                { icon: Bell, label: "Alerts" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-slate-900 hover:text-slate-100">
                  <span className="flex items-center gap-3"><Icon size={16} className="text-slate-500" />{label}</span>
                  <ChevronRight size={14} className="text-slate-600" />
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="pt-5">
        {page === "dashboard" && <DashboardPage active={active} marketData={marketData} />}
        {page === "news" && <NewsPage />}
        {page === "calendar" && <CalendarPage />}
        {page === "levels" && <LevelsPage active={active} marketData={marketData} />}
        {page === "signals" && <SignalsPage marketData={marketData} />}

        <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 px-4 pb-4 text-[11px] text-slate-600">
          <Radio size={12} />
          Connected to Twelve Data API Feed
        </div>
        <div className="mt-1 font-mono tracking-wide text-slate-700">
            © {new Date().getFullYear()} Shane Brown. All rights reserved.
        </div>
      </main>
    </div>
  );
}
