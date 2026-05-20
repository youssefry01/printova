/**
 * StockResultBox.jsx
 * Result renderer for stock API responses.
 *
 * Handles:
 *  • Array of stock items  → card grid (Get All)
 *  • Single stock obj      → detail card (Get By Part ID / Update)
 *  • { stockQuantity, message } → adjust success card
 *  • { message: "..." }    → success toast
 *  • Error                 → ErrorCard
 *  • null                  → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  teal:        "#0D9488",
  tealLight:   "#F0FDFA",
  tealMid:     "#99F6E4",
  tealDark:    "#0F766E",
  teal2:       "#14B8A6",
  green:       "#059669",
  greenLight:  "#ECFDF5",
  greenMid:    "#A7F3D0",
  greenDark:   "#065F46",
  amber:       "#D97706",
  amberLight:  "#FFFBEB",
  amberMid:    "#FDE68A",
  amberDark:   "#92400E",
  red:         "#DC2626",
  redLight:    "#FEF2F2",
  redMid:      "#FECACA",
  blue:        "#2563EB",
  blueLight:   "#EFF6FF",
  indigo:      "#4F46E5",
  indigoLight: "#EEF2FF",
  gray50:      "#F9FAFB",
  gray100:     "#F3F4F6",
  gray200:     "#E5E7EB",
  gray400:     "#9CA3AF",
  gray500:     "#6B7280",
  gray600:     "#4B5563",
  gray700:     "#374151",
  gray900:     "#111827",
  white:       "#FFFFFF",
};

// ─── part type config ─────────────────────────────────────────────────────────
const getPartMeta = (name = "") => {
  const n = name.toUpperCase();
  if (n.includes("TONER") || n.includes("CARTRIDGE"))
    return { icon: "🖨️", color: T.indigo,  bg: T.indigoLight, border: "#C7D2FE", grad: "linear-gradient(135deg,#312E81,#4F46E5)" };
  if (n.includes("DRUM"))
    return { icon: "🥁", color: T.blue,   bg: T.blueLight,   border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("FUSER"))
    return { icon: "🔥", color: T.amber,  bg: T.amberLight,  border: T.amberMid, grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (n.includes("MAINTENANCE") || n.includes("BOX"))
    return { icon: "🔧", color: T.green,  bg: T.greenLight,  border: T.greenMid, grad: "linear-gradient(135deg,#065F46,#059669)" };
  if (n.includes("ROLLER"))
    return { icon: "⚙️", color: T.teal,  bg: T.tealLight,   border: T.tealMid,  grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (n.includes("FORMATTER") || n.includes("BOARD"))
    return { icon: "💻", color: "#7C3AED", bg: "#F5F3FF",   border: "#DDD6FE",   grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  if (n.includes("PRINTHEAD") || n.includes("HEAD"))
    return { icon: "🖊️", color: T.red,   bg: T.redLight,    border: T.redMid,   grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  // default teal
  return { icon: "📦", color: T.teal, bg: T.tealLight, border: T.tealMid, grad: `linear-gradient(135deg,${T.tealDark},${T.teal})` };
};

// ─── stock status badge config ────────────────────────────────────────────────
const getStockStatus = (qty) => {
  if (qty === 0)   return { label: "Out of Stock", color: T.red,   bg: T.redLight,   border: T.redMid,   dot: T.red   };
  if (qty <= 10)   return { label: "Low Stock",    color: T.amber, bg: T.amberLight, border: T.amberMid, dot: T.amber };
  return             { label: "In Stock",     color: T.green, bg: T.greenLight, border: T.greenMid, dot: T.green };
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

  .skb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:skb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .skb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(13,148,136,.14);
    transform:translateY(-2px);
  }

  .skb-stock-tile {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08);
    animation:skb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
    display:flex;
    flex-direction:column;
  }
  .skb-stock-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }

  .skb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .skb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }
  .skb-divider     { height:1px; background:${T.gray100}; margin:14px 0; }

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

  @media (max-width:500px) {
    .skb-stock-grid { grid-template-columns:1fr !important; }
    .skb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
`;

// ─── Stock Tile (grid) ────────────────────────────────────────────────────────
const StockTile = ({ stock, index }) => {
  const { stockId, partId, partName, stockQuantity } = stock;
  const { icon, color, bg, border, grad } = getPartMeta(partName);
  const status = getStockStatus(stockQuantity);

  return (
    <div className="skb-stock-tile" style={{ animationDelay: `${index * 60}ms` }}>
      {/* gradient header */}
      <div style={{
        background: grad,
        padding: "18px 18px 14px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 13,
          background: "rgba(255,255,255,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span className="skb-mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>
            STOCK #{stockId}
          </span>
          <span className="skb-mono" style={{ fontSize: 10, color: "rgba(255,255,255,.4)", fontWeight: 500 }}>
            PART #{partId}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div className="skb-field-label">Part Name</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: T.gray900, lineHeight: 1.35 }}>{partName}</div>
        </div>

        {/* status badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          background: status.bg, border: `1px solid ${status.border}`,
          borderRadius: 8, padding: "6px 10px",
        }}>
          <span className="skb-pulse-dot" style={{ background: status.dot }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: status.color, letterSpacing: ".06em", textTransform: "uppercase" }}>
            {status.label}
          </span>
        </div>

        {/* quantity bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: bg, border: `1px solid ${border}`,
          borderRadius: 10, padding: "10px 14px",
          marginTop: "auto",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: ".06em", textTransform: "uppercase" }}>
            Qty
          </span>
          <span className="skb-mono" style={{ fontSize: 22, fontWeight: 900, color }}>
            {stockQuantity}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Stock Grid (Get All) ─────────────────────────────────────────────────────
const StockGrid = ({ items }) => {
  const outOfStock = items.filter(s => s.stockQuantity === 0).length;
  const lowStock   = items.filter(s => s.stockQuantity > 0 && s.stockQuantity <= 10).length;

  return (
    <>
      {/* summary row */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 99,
          background: T.tealLight, border: `1px solid ${T.tealMid}`,
          fontSize: 12, fontWeight: 700, color: T.teal,
        }}>
          📦 {items.length} part{items.length !== 1 ? "s" : ""}
        </span>
        {outOfStock > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: T.redLight, border: `1px solid ${T.redMid}`,
            fontSize: 12, fontWeight: 700, color: T.red,
          }}>
            🔴 {outOfStock} out of stock
          </span>
        )}
        {lowStock > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: T.amberLight, border: `1px solid ${T.amberMid}`,
            fontSize: 12, fontWeight: 700, color: T.amber,
          }}>
            🟡 {lowStock} low stock
          </span>
        )}
      </div>

      <div className="skb-stock-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: 16,
      }}>
        {items.map((s, i) => (
          <StockTile key={s.stockId} stock={s} index={i} />
        ))}
      </div>
    </>
  );
};

// ─── Single Stock Card ────────────────────────────────────────────────────────
const SingleStockCard = ({ stock, isUpdate = false }) => {
  const { stockId, partId, partName, stockQuantity } = stock;
  const { icon, color, bg, border, grad } = getPartMeta(partName);
  const status = getStockStatus(stockQuantity);

  const headerGrad = isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : grad;

  const headerLabel = isUpdate ? "STOCK UPDATED" : "STOCK RECORD";

  return (
    <div className="skb-card">
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, padding: "16px 22px",
        background: headerGrad,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13,
            background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>{icon}</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {headerLabel}
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
              {partName}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <span className="skb-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.5)" }}>
            STOCK #{stockId}
          </span>
          <span className="skb-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.35)" }}>
            PART #{partId}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="skb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: "14px 20px",
          alignItems: "start",
        }}>
          <div>
            <div className="skb-field-label">🗂️ Stock ID</div>
            <div className="skb-field-value skb-mono">#{stockId}</div>
          </div>
          <div>
            <div className="skb-field-label">🔩 Part ID</div>
            <div className="skb-field-value skb-mono">#{partId}</div>
          </div>
          <div>
            <div className="skb-field-label">📦 Quantity</div>
            <div className="skb-field-value skb-mono" style={{ fontSize: 20, fontWeight: 900, color }}>
              {stockQuantity}
            </div>
          </div>
          <div>
            <div className="skb-field-label">📊 Status</div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: status.bg, border: `1px solid ${status.border}`,
              borderRadius: 8, padding: "5px 10px", marginTop: 2,
            }}>
              <span className="skb-pulse-dot" style={{ background: status.dot }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: status.color, letterSpacing: ".05em" }}>
                {status.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Adjust Success Card ──────────────────────────────────────────────────────
const AdjustSuccessCard = ({ stockQuantity, message }) => {
  const status = getStockStatus(stockQuantity);

  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      border: `1px solid ${T.greenMid}`,
      animation: "skb-pop .35s cubic-bezier(.22,1,.36,1) both",
    }}>
      {/* top bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
        background: "linear-gradient(135deg,#065F46,#059669)",
      }}>
        <svg className="skb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="18" cy="18" r="17" fill="rgba(255,255,255,.2)" stroke="rgba(255,255,255,.6)" strokeWidth="1.5" />
          <path d="M11 18.5l5 5 9-10" stroke={T.white} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
            STOCK ADJUSTED
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{message}</div>
        </div>
      </div>

      {/* quantity display */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 22px", background: T.greenLight,
      }}>
        <div>
          <div className="skb-field-label" style={{ color: T.gray500 }}>New Quantity</div>
          <div className="skb-mono" style={{ fontSize: 28, fontWeight: 900, color: T.green, lineHeight: 1 }}>
            {stockQuantity}
          </div>
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: status.bg, border: `1px solid ${status.border}`,
          borderRadius: 10, padding: "8px 14px",
        }}>
          <span className="skb-pulse-dot" style={{ background: status.dot }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: status.color, letterSpacing: ".06em" }}>
            {status.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Generic Success Toast ────────────────────────────────────────────────────
const SuccessCard = ({ message }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 20px", borderRadius: 14,
    background: T.greenLight, border: `1px solid ${T.greenMid}`,
    animation: "skb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="skb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.green} strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.green, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Success
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.greenDark, marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "skb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
        background: "linear-gradient(135deg,#991B1B,#DC2626)",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,.18)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
        }}>⚠️</div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>REQUEST FAILED</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>Action Could Not Be Completed</div>
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: T.redLight }}>
        {message && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#FEE2E2", border: "1px solid #FECACA",
            borderLeft: `3px solid ${T.red}`, borderRadius: "0 8px 8px 0",
            padding: "10px 14px", marginBottom: hasExtra ? 14 : 0,
          }}>
            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>🔴</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#7F1D1D", lineHeight: 1.5 }}>{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre style={{
            margin: 0, fontSize: 11, color: "#7F1D1D", fontFamily: "'DM Mono',monospace",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "#FEE2E2", borderRadius: 8, padding: "10px 14px",
          }}>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const StockResultBox = ({ data, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="skb-root" style={{ marginTop: 16 }}>
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isArray = Array.isArray(data);

  const isError = isObj && (
    data.success === false ||
    data.error !== undefined ||
    (data.status && data.status >= 400)
  );

  // Adjust response: has message + stockQuantity but no stockId
  const isAdjust = isObj && !isError &&
    data.message !== undefined &&
    data.stockQuantity !== undefined &&
    data.stockId === undefined;

  // Generic success message (no id, no stockQuantity)
  const isSuccessMsg = isObj && !isError && !isAdjust &&
    data.message !== undefined &&
    data.stockId === undefined;

  // Single stock record
  const isSingle = isObj && !isError && !isAdjust &&
    data.stockId !== undefined &&
    data.partName !== undefined;

  return (
    <div className="skb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isAdjust     && <AdjustSuccessCard stockQuantity={data.stockQuantity} message={data.message} />}
      {isSingle     && <SingleStockCard stock={data} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "skb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No stock records found</div>
        </div>
      )}

      {isArray && data.length > 0 && <StockGrid items={data} />}
    </div>
  );
};

export default StockResultBox;