/**
 * StockResultBox.tsx
 * Result renderer for stock API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface StockItem {
  stockId: number | string;
  partId: number | string;
  partName: string;
  stockQuantity: number;
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

interface AdjustResponse {
  message: string;
  stockQuantity: number;
  stockId?: undefined;
}

interface SuccessMessage {
  message: string;
  stockId?: undefined;
  stockQuantity?: undefined;
}

type StockResultData = StockItem | StockItem[] | ErrorData | AdjustResponse | SuccessMessage | string | null | undefined;

interface StockResultBoxProps   { data: StockResultData; isUpdate?: boolean; }
interface StockTileProps        { stock: StockItem; index: number; }
interface StockGridProps        { items: StockItem[]; }
interface SingleStockCardProps  { stock: StockItem; isUpdate?: boolean; }
interface AdjustSuccessCardProps { stockQuantity: number; message: string; }
interface ErrorCardProps        { data: ErrorData; }
interface SuccessCardProps      { message: string; }

// ─── part type config ─────────────────────────────────────────────────────────
interface PartMeta { icon: string; color: string; bg: string; border: string; grad: string; }

const getPartMeta = (name = ""): PartMeta => {
  const n = name.toUpperCase();
  if (n.includes("TONER") || n.includes("CARTRIDGE")) return { icon: "🖨️", color: "#4F46E5", bg: "#EEF2FF", border: "#C7D2FE", grad: "linear-gradient(135deg,#312E81,#4F46E5)" };
  if (n.includes("DRUM"))        return { icon: "🥁", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("FUSER"))       return { icon: "🔥", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (n.includes("MAINTENANCE") || n.includes("BOX")) return { icon: "🔧", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", grad: "linear-gradient(135deg,#065F46,#059669)" };
  if (n.includes("ROLLER"))      return { icon: "⚙️", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (n.includes("FORMATTER") || n.includes("BOARD")) return { icon: "💻", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  if (n.includes("PRINTHEAD") || n.includes("HEAD"))  return { icon: "🖊️", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  return { icon: "📦", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
};

// ─── stock status ─────────────────────────────────────────────────────────────
interface StockStatus { label: string; color: string; bg: string; border: string; dot: string; }

const getStockStatus = (qty: number): StockStatus => {
  if (qty === 0) return { label: "Out of Stock", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#DC2626" };
  if (qty <= 10) return { label: "Low Stock",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706" };
  return               { label: "In Stock",     color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#059669" };
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes skb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes skb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes skb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes skb-pulse-dot {
    0%, 100% { opacity:1; transform:scale(1);   }
    50%       { opacity:.5; transform:scale(1.4); }
  }

  .skb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .skb-mono   { font-family:'DM Mono',monospace !important; }

  .skb-card { animation:skb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .skb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(13,148,136,.14);
    transform:translateY(-2px);
  }
  .skb-stock-tile { animation:skb-up .32s cubic-bezier(.22,1,.36,1) both; }
  .skb-stock-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }
  .skb-success-icon circle { animation:skb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .skb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:skb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }
  .skb-pulse-dot {
    display:inline-block;
    width:7px; height:7px; border-radius:50%;
    animation:skb-pulse-dot 1.8s ease-in-out infinite;
  }
  .skb-error-card  { animation:skb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .skb-empty-state { animation:skb-pop .35s ease both; }
`;

// ─── Stock Tile ───────────────────────────────────────────────────────────────
const StockTile: React.FC<StockTileProps> = ({ stock, index }) => {
  const { stockId, partId, partName, stockQuantity } = stock;
  const { icon, color, bg, border, grad } = getPartMeta(partName);
  const status = getStockStatus(stockQuantity);

  return (
    <div className="skb-stock-tile bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08)", animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between p-4 pb-3.5" style={{ background: grad }}>
        <div className="w-12 h-12 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="skb-mono text-[10px] text-white/50 font-semibold">STOCK #{stockId}</span>
          <span className="skb-mono text-[10px] text-white/40 font-medium">PART #{partId}</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Part Name</div>
          <div className="text-[13px] font-extrabold text-gray-900 leading-snug">{partName}</div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border" style={{ background: status.bg, borderColor: status.border }}>
          <span className="skb-pulse-dot" style={{ background: status.dot }} />
          <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: status.color }}>{status.label}</span>
        </div>
        <div className="flex items-center justify-between rounded-[10px] px-3.5 py-2.5 border mt-auto" style={{ background: bg, borderColor: border }}>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color }}>Qty</span>
          <span className="skb-mono text-[22px] font-black" style={{ color }}>{stockQuantity}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Stock Grid ───────────────────────────────────────────────────────────────
const StockGrid: React.FC<StockGridProps> = ({ items }) => {
  const outOfStock = items.filter((s) => s.stockQuantity === 0).length;
  const lowStock   = items.filter((s) => s.stockQuantity > 0 && s.stockQuantity <= 10).length;

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-3.5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-600">
          📦 {items.length} part{items.length !== 1 ? "s" : ""}
        </span>
        {outOfStock > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-red-600">
            🔴 {outOfStock} out of stock
          </span>
        )}
        {lowStock > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-600">
            🟡 {lowStock} low stock
          </span>
        )}
      </div>
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
        {items.map((s, i) => <StockTile key={s.stockId} stock={s} index={i} />)}
      </div>
    </>
  );
};

// ─── Single Stock Card ────────────────────────────────────────────────────────
const SingleStockCard: React.FC<SingleStockCardProps> = ({ stock, isUpdate = false }) => {
  const { stockId, partId, partName, stockQuantity } = stock;
  const { icon, color, grad } = getPartMeta(partName);
  const status = getStockStatus(stockQuantity);
  const headerGrad = isUpdate ? "linear-gradient(135deg,#1E3A8A,#2563EB)" : grad;
  const headerLabel = isUpdate ? "STOCK UPDATED" : "STOCK RECORD";

  return (
    <div className="skb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="text-lg font-extrabold text-white leading-tight">{partName}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="skb-mono text-xs text-white/50">STOCK #{stockId}</span>
          <span className="skb-mono text-[11px] text-white/35">PART #{partId}</span>
        </div>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-4 gap-x-5 gap-y-3.5 items-start max-sm:grid-cols-2">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🗂️ Stock ID</div>
            <div className="skb-mono text-sm font-semibold text-gray-900">#{stockId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🔩 Part ID</div>
            <div className="skb-mono text-sm font-semibold text-gray-900">#{partId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">📦 Quantity</div>
            <div className="skb-mono text-[20px] font-black" style={{ color }}>{stockQuantity}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">📊 Status</div>
            <div className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 mt-0.5 border" style={{ background: status.bg, borderColor: status.border }}>
              <span className="skb-pulse-dot" style={{ background: status.dot }} />
              <span className="text-[11px] font-bold tracking-wide" style={{ color: status.color }}>{status.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Adjust Success Card ──────────────────────────────────────────────────────
const AdjustSuccessCard: React.FC<AdjustSuccessCardProps> = ({ stockQuantity, message }) => {
  const status = getStockStatus(stockQuantity);
  return (
    <div className="rounded-[14px] overflow-hidden border border-emerald-200" style={{ animation: "skb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
      <div className="flex items-center gap-3.5 px-5 py-3.5" style={{ background: "linear-gradient(135deg,#065F46,#059669)" }}>
        <svg className="skb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="17" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
          <path d="M11 18.5l5 5 9-10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div className="text-[11px] text-white/65 font-bold tracking-widest">STOCK ADJUSTED</div>
          <div className="text-base font-bold text-white">{message}</div>
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-4 bg-emerald-50">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-0.5">New Quantity</div>
          <div className="skb-mono text-[28px] font-black text-emerald-600 leading-none">{stockQuantity}</div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-[10px] px-3.5 py-2 border" style={{ background: status.bg, borderColor: status.border }}>
          <span className="skb-pulse-dot" style={{ background: status.dot }} />
          <span className="text-xs font-bold tracking-widest" style={{ color: status.color }}>{status.label}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "skb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="skb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
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
    <div className="skb-error-card rounded-[14px] overflow-hidden border border-red-200">
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
          <pre className="skb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const StockResultBox: React.FC<StockResultBoxProps> = ({ data, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="skb-root mt-4">
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isArray = Array.isArray(data);

  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );

  const isAdjust = isObj && !isError &&
    (data as AdjustResponse).message !== undefined &&
    (data as AdjustResponse).stockQuantity !== undefined &&
    (data as AdjustResponse).stockId === undefined;

  const isSuccessMsg = isObj && !isError && !isAdjust &&
    (data as SuccessMessage).message !== undefined &&
    (data as StockItem).stockId === undefined;

  const isSingle = isObj && !isError && !isAdjust &&
    (data as StockItem).stockId !== undefined &&
    (data as StockItem).partName !== undefined;

  return (
    <div className="skb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isAdjust     && <AdjustSuccessCard stockQuantity={(data as AdjustResponse).stockQuantity} message={(data as AdjustResponse).message} />}
      {isSingle     && <SingleStockCard stock={data as StockItem} isUpdate={isUpdate} />}
      {isArray && (data as StockItem[]).length === 0 && (
        <div className="skb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-sm font-semibold text-gray-600">No stock records found</div>
        </div>
      )}
      {isArray && (data as StockItem[]).length > 0 && <StockGrid items={data as StockItem[]} />}
    </div>
  );
};

export default StockResultBox;