/**
 * PartPricesResultBox.tsx
 * Result renderer for part prices API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface PriceRecord {
  priceId: number | string;
  partId: number | string;
  price: number;
  validFrom?: string;
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

interface SuccessMessage { message: string; priceId?: undefined; }

type PartPricesResultData = PriceRecord | PriceRecord[] | ErrorData | SuccessMessage | string | null | undefined;

interface PartPricesResultBoxProps { data: PartPricesResultData; isNew?: boolean; isLatest?: boolean; }
interface PriceTableProps          { prices: PriceRecord[]; isLatest?: boolean; }
interface SinglePriceCardProps     { record: PriceRecord; isNew?: boolean; isLatest?: boolean; }
interface ErrorCardProps           { data: ErrorData; }
interface SuccessCardProps         { message: string; }

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtMoney = (n?: number): string =>
  new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtTime = (iso?: string): string => {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const fmtRelative = (iso?: string): string => {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30)  return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes ppb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes ppb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes ppb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes ppb-row {
    from { opacity:0; transform:translateX(-8px); }
    to   { opacity:1; transform:translateX(0);    }
  }

  .ppb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .ppb-mono   { font-family:'DM Mono',monospace !important; }

  .ppb-card { animation:ppb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .ppb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(13,148,136,.14);
    transform:translateY(-2px);
  }

  .ppb-table-row {
    display:grid;
    grid-template-columns:60px 70px 1fr 1fr 1fr;
    align-items:center;
    padding:10px 18px;
    border-bottom:1px solid #F3F4F6;
    transition:background .15s;
    animation:ppb-row .28s cubic-bezier(.22,1,.36,1) both;
  }
  .ppb-table-row:last-child { border-bottom:none; }
  .ppb-table-row:hover { background:#F0FDFA; }
  .ppb-table-head {
    display:grid;
    grid-template-columns:60px 70px 1fr 1fr 1fr;
    align-items:center;
    padding:9px 18px;
    background:#F9FAFB;
    border-bottom:1px solid #E5E7EB;
  }

  .ppb-success-icon circle { animation:ppb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .ppb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:ppb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  .ppb-error-card  { animation:ppb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .ppb-empty-state { animation:ppb-pop .35s ease both; }

  @media (max-width:600px) {
    .ppb-table-row, .ppb-table-head { grid-template-columns:50px 60px 1fr 1fr !important; }
    .ppb-col-time { display:none !important; }
    .ppb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
  @media (max-width:400px) {
    .ppb-table-row, .ppb-table-head { grid-template-columns:44px 1fr 1fr !important; }
    .ppb-col-partid { display:none !important; }
    .ppb-detail-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Price Table ──────────────────────────────────────────────────────────────
const PriceTable: React.FC<PriceTableProps> = ({ prices, isLatest = false }) => {
  const headerLabel = isLatest
    ? `LATEST PRICE · PART #${prices[0]?.partId ?? ""}`
    : `${prices.length} PRICE RECORD${prices.length !== 1 ? "S" : ""}`;

  return (
    <div className="ppb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-5 py-3.5" style={{ background: "linear-gradient(135deg,#134E4A,#0D9488)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[11px] bg-white/20 flex items-center justify-center text-xl shrink-0">💹</div>
          <div>
            <div className="text-[10px] text-white/60 font-bold tracking-widest">PRICE HISTORY</div>
            <div className="text-[15px] font-extrabold text-white">{headerLabel}</div>
          </div>
        </div>
        <span className="ppb-mono text-[13px] font-bold bg-white/15 rounded-lg px-3 py-1 text-white/90">
          {fmtMoney(prices[prices.length - 1]?.price)}
        </span>
      </div>

      {/* table */}
      <div>
        <div className="ppb-table-head">
          {["#", "Part", "Price", "Valid From", "Time"].map((h, i) => (
            <div key={h} className={`text-[10px] font-bold tracking-widest uppercase text-gray-400${i === 4 ? " ppb-col-time" : i === 1 ? " ppb-col-partid" : ""}`}>
              {h}
            </div>
          ))}
        </div>

        {prices.map((p, idx) => {
          const isNewest = idx === prices.length - 1 && prices.length > 1;
          return (
            <div key={p.priceId} className="ppb-table-row" style={{ animationDelay: `${idx * 45}ms` }}>
              <div className="ppb-mono text-xs text-gray-400 font-semibold">#{p.priceId}</div>
              <div className="ppb-col-partid ppb-mono text-xs text-gray-500 font-semibold">Part #{p.partId}</div>
              <div className="flex items-center gap-1.5">
                <span className="ppb-mono text-sm font-black" style={{ color: isNewest ? "#0D9488" : "#374151" }}>
                  {fmtMoney(p.price)}
                </span>
                {isNewest && (
                  <span className="ppb-mono text-[9px] font-extrabold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-1.5 py-px tracking-wide">
                    LATEST
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-gray-700">{fmtDate(p.validFrom)}</div>
                <div className="text-[10px] text-gray-400 mt-px">{fmtRelative(p.validFrom)}</div>
              </div>
              <div className="ppb-col-time ppb-mono text-[11px] text-gray-400">{fmtTime(p.validFrom)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Single Price Card ────────────────────────────────────────────────────────
const SinglePriceCard: React.FC<SinglePriceCardProps> = ({ record, isNew = false, isLatest = false }) => {
  const { priceId, partId, price, validFrom } = record;
  const headerGrad = isNew ? "linear-gradient(135deg,#065F46,#059669)" : "linear-gradient(135deg,#134E4A,#0D9488)";
  const headerLabel = isNew ? "PRICE ADDED" : isLatest ? "LATEST PRICE" : "PRICE RECORD";

  return (
    <div className="ppb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">💹</div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="ppb-mono text-[22px] font-black text-white leading-tight">{fmtMoney(price)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="ppb-mono text-[11px] text-white/50">Price ID</div>
          <div className="ppb-mono text-[15px] text-white/80 font-bold">#{priceId}</div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="ppb-detail-grid grid grid-cols-3 gap-x-5 gap-y-3.5">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🗂️ Price ID</div>
            <div className="ppb-mono text-sm font-semibold text-gray-900">#{priceId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🔩 Part ID</div>
            <div className="ppb-mono text-sm font-semibold text-gray-900">#{partId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">💰 Price</div>
            <div className="ppb-mono text-lg font-black text-teal-600">{fmtMoney(price)}</div>
          </div>
          <div className="col-span-full">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">📅 Valid From</div>
            <div className="flex items-center gap-2.5 flex-wrap mt-1">
              <span className="text-sm font-bold text-gray-900">{fmtDate(validFrom)}</span>
              <span className="ppb-mono text-xs text-gray-500">{fmtTime(validFrom)}</span>
              <span className="ppb-mono text-[11px] font-bold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5">
                {fmtRelative(validFrom)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "ppb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="ppb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Success</div>
      <div className="text-sm font-semibold text-emerald-900 mt-0.5">{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="ppb-error-card rounded-[14px] overflow-hidden border border-red-200">
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: "linear-gradient(135deg,#991B1B,#DC2626)" }}>
        <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center text-lg shrink-0">⚠️</div>
        <div>
          <div className="text-[11px] text-white/65 font-bold tracking-widest">REQUEST FAILED</div>
          <div className="text-base font-bold text-white">Action Could Not Be Completed</div>
        </div>
      </div>
      <div className="p-4 bg-red-50">
        {message && (
          <div className={`flex items-start gap-2.5 bg-red-100 border border-red-200 border-l-[3px] border-l-red-600 rounded-r-lg p-2.5 ${hasExtra ? "mb-3.5" : ""}`}>
            <span className="text-sm mt-0.5 shrink-0">🔴</span>
            <span className="text-sm font-semibold text-red-900 leading-relaxed">{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre className="ppb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PartPricesResultBox: React.FC<PartPricesResultBoxProps> = ({ data, isNew = false, isLatest = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return <div className="ppb-root mt-4"><style>{GLOBAL_CSS}</style><SuccessCard message={data} /></div>;
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );
  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as PriceRecord).priceId === undefined;
  const isSingle     = isObj && !isError && (data as PriceRecord).priceId !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="ppb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SinglePriceCard record={data as PriceRecord} isNew={isNew} isLatest={isLatest} />}
      {isArray && (data as PriceRecord[]).length === 0 && (
        <div className="ppb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">💹</div>
          <div className="text-sm font-semibold text-gray-600">No price records found</div>
        </div>
      )}
      {isArray && (data as PriceRecord[]).length > 0 && <PriceTable prices={data as PriceRecord[]} isLatest={isLatest} />}
    </div>
  );
};

export default PartPricesResultBox;