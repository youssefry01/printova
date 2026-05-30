/**
 * PartsResultBox.tsx
 * Result renderer for parts API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Part {
  partId: number | string;
  partName: string;
  partDescription?: string;
  categoryName?: string;
  supplierName?: string;
  currentPrice?: number;
  stockQuantity: number;
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

interface SuccessMessage { message: string; partId?: undefined; }

type PartsResultData = Part | Part[] | ErrorData | SuccessMessage | string | null | undefined;

interface PartsResultBoxProps  { data: PartsResultData; isNew?: boolean; isUpdate?: boolean; }
interface PartTileProps        { part: Part; index: number; }
interface PartGridProps        { parts: Part[]; }
interface SinglePartCardProps  { part: Part; isNew?: boolean; isUpdate?: boolean; }
interface StockBadgeProps      { qty: number; }
interface ErrorCardProps       { data: ErrorData; }
interface SuccessCardProps     { message: string; }

// ─── category config ──────────────────────────────────────────────────────────
interface CategoryMeta { icon: string; color: string; bg: string; border: string; grad: string; }

const getCategoryMeta = (category = ""): CategoryMeta => {
  const c = category.toUpperCase();
  if (c.includes("TONER") || c.includes("INK"))   return { icon: "🖨️", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  if (c.includes("FUSER"))                         return { icon: "🔥", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  if (c.includes("MAINTENANCE"))                   return { icon: "🧰", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (c.includes("ROLLER"))                        return { icon: "⚙️", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (c.includes("DRUM"))                          return { icon: "🔵", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (c.includes("FORMATTER") || c.includes("BOARD")) return { icon: "🖥️", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", grad: "linear-gradient(135deg,#065F46,#059669)" };
  return { icon: "🔩", color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE", grad: "linear-gradient(135deg,#3730A3,#4F46E5)" };
};

interface StockStatus { label: string; color: string; bg: string; border: string; dot: string; }

const getStockStatus = (qty: number): StockStatus => {
  if (qty === 0) return { label: "Out of Stock", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#DC2626" };
  if (qty <= 5)  return { label: "Low Stock",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706" };
  return               { label: "In Stock",      color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#059669" };
};

const fmtMoney = (n?: number): string =>
  new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n ?? 0);

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes prb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes prb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes prb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .prb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .prb-mono   { font-family:'DM Mono',monospace !important; }

  .prb-card { animation:prb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .prb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(79,70,229,.14);
    transform:translateY(-2px);
  }
  .prb-part-tile { animation:prb-up .32s cubic-bezier(.22,1,.36,1) both; }
  .prb-part-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }
  .prb-success-icon circle { animation:prb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .prb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:prb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }
  .prb-error-card  { animation:prb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .prb-empty-state { animation:prb-pop .35s ease both; }

  @media (max-width:640px) {
    .prb-part-grid   { grid-template-columns:1fr !important; }
    .prb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
  @media (max-width:400px) {
    .prb-detail-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge: React.FC<StockBadgeProps> = ({ qty }) => {
  const { label, color, bg, border, dot } = getStockStatus(qty);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border" style={{ color, background: bg, borderColor: border }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot, boxShadow: `0 0 0 2px ${bg}` }} />
      {label}
    </span>
  );
};

// ─── Part Tile ────────────────────────────────────────────────────────────────
const PartTile: React.FC<PartTileProps> = ({ part, index }) => {
  const { partId, partName, partDescription, categoryName, supplierName, currentPrice, stockQuantity } = part;
  const { icon, color, bg, border, grad } = getCategoryMeta(categoryName);

  return (
    <div className="prb-part-tile bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08)", animationDelay: `${index * 55}ms` }}>
      <div className="flex items-start justify-between p-4 pb-3.5" style={{ background: grad }}>
        <div className="w-11.5 h-11.5 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
        <div className="flex flex-col items-end gap-1">
          <span className="prb-mono text-[10px] text-white/50 font-semibold">ID #{partId}</span>
          <span className="text-[10px] font-bold text-white/90 bg-black/20 rounded-full px-2 py-0.5">Qty: {stockQuantity}</span>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-2.5">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Part Name</div>
          <div className="text-sm font-extrabold text-gray-900 leading-snug">{partName}</div>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md border" style={{ color, background: bg, borderColor: border }}>{categoryName}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500">{supplierName}</span>
        </div>

        {partDescription && (
          <div className="text-[11px] text-gray-500 leading-relaxed flex-1">{partDescription}</div>
        )}

        <div className="flex items-center justify-between rounded-[10px] px-3 py-2.5 border mt-auto" style={{ background: bg, borderColor: border }}>
          <StockBadge qty={stockQuantity} />
          <span className="prb-mono text-[17px] font-black" style={{ color }}>{fmtMoney(currentPrice)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Part Grid ────────────────────────────────────────────────────────────────
const PartGrid: React.FC<PartGridProps> = ({ parts }) => {
  const outOfStock = parts.filter((p) => p.stockQuantity === 0).length;
  const lowStock   = parts.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= 5).length;

  return (
    <>
      <div className="flex gap-2 mb-3.5 flex-wrap">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">
          🔩 {parts.length} part{parts.length !== 1 ? "s" : ""}
        </span>
        {outOfStock > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600">
            ⚠️ {outOfStock} out of stock
          </span>
        )}
        {lowStock > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-600">
            📉 {lowStock} low stock
          </span>
        )}
      </div>
      <div className="prb-part-grid grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))" }}>
        {parts.map((p, i) => <PartTile key={p.partId} part={p} index={i} />)}
      </div>
    </>
  );
};

// ─── Single Part Card ─────────────────────────────────────────────────────────
const SinglePartCard: React.FC<SinglePartCardProps> = ({ part, isNew = false, isUpdate = false }) => {
  const { partId, partName, partDescription, categoryName, supplierName, currentPrice, stockQuantity } = part;
  const { icon, color, bg, border, grad } = getCategoryMeta(categoryName);
  const headerGrad = isNew ? "linear-gradient(135deg,#065F46,#059669)" : isUpdate ? "linear-gradient(135deg,#1E3A8A,#2563EB)" : grad;
  const headerLabel = isNew ? "PART CREATED" : isUpdate ? "PART UPDATED" : "SPARE PART";

  return (
    <div className="prb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="text-xl font-extrabold text-white leading-tight">{partName}</div>
          </div>
        </div>
        <span className="prb-mono text-[13px] text-white/50">ID #{partId}</span>
      </div>

      <div className="px-5 py-4">
        {partDescription && (
          <div className="text-[13px] text-gray-600 leading-relaxed bg-gray-50 rounded-[10px] px-3.5 py-2.5 mb-4 border border-gray-200">
            {partDescription}
          </div>
        )}

        <div className="prb-detail-grid grid grid-cols-3 gap-x-5 gap-y-3.5 max-sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🗂️ Part ID</div>
            <div className="prb-mono text-sm font-semibold text-gray-900">#{partId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">🏷️ Category</div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-md border" style={{ color, background: bg, borderColor: border }}>{categoryName}</span>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🏭 Supplier</div>
            <div className="text-[13px] font-semibold text-gray-900">{supplierName}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">💰 Current Price</div>
            <div className="prb-mono text-lg font-black" style={{ color }}>{fmtMoney(currentPrice)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">📦 Stock</div>
            <div className="flex items-center gap-2">
              <StockBadge qty={stockQuantity} />
              <span className="prb-mono text-sm font-bold text-gray-700">{stockQuantity} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "prb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="prb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
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
    <div className="prb-error-card rounded-[14px] overflow-hidden border border-red-200">
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
          <pre className="prb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PartsResultBox: React.FC<PartsResultBoxProps> = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return <div className="prb-root mt-4"><style>{GLOBAL_CSS}</style><SuccessCard message={data} /></div>;
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );
  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as Part).partId === undefined;
  const isSingle     = isObj && !isError && (data as Part).partId !== undefined && (data as Part).partName !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="prb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SinglePartCard part={data as Part} isNew={isNew} isUpdate={isUpdate} />}
      {isArray && (data as Part[]).length === 0 && (
        <div className="prb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">🔩</div>
          <div className="text-sm font-semibold text-gray-600">No parts found</div>
        </div>
      )}
      {isArray && (data as Part[]).length > 0 && <PartGrid parts={data as Part[]} />}
    </div>
  );
};

export default PartsResultBox;