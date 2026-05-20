/**
 * PartsResultBox.jsx
 * Result renderer for parts API responses.
 *
 * Handles:
 *  • Array of parts    → card grid (Get All)
 *  • Single part obj   → detail card (Get By ID / Add / Update)
 *  • { message: "..." } → success toast
 *  • Error             → ErrorCard
 *  • null              → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  indigo:      "#4F46E5",
  indigoLight: "#EEF2FF",
  indigoMid:   "#C7D2FE",
  indigoDark:  "#3730A3",
  violet:      "#7C3AED",
  green:       "#059669",
  greenLight:  "#ECFDF5",
  greenMid:    "#A7F3D0",
  greenDark:   "#065F46",
  blue:        "#2563EB",
  blueLight:   "#EFF6FF",
  red:         "#DC2626",
  redLight:    "#FEF2F2",
  amber:       "#D97706",
  amberLight:  "#FFFBEB",
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

// ─── category config ──────────────────────────────────────────────────────────
const getCategoryMeta = (category = "") => {
  const c = category.toUpperCase();
  if (c.includes("TONER") || c.includes("INK"))
    return { icon: "🖨️", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  if (c.includes("FUSER"))
    return { icon: "🔥", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  if (c.includes("MAINTENANCE"))
    return { icon: "🧰", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (c.includes("ROLLER"))
    return { icon: "⚙️", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (c.includes("DRUM"))
    return { icon: "🔵", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (c.includes("FORMATTER") || c.includes("BOARD"))
    return { icon: "🖥️", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", grad: "linear-gradient(135deg,#065F46,#059669)" };
  // default indigo
  return { icon: "🔩", color: T.indigo, bg: T.indigoLight, border: T.indigoMid, grad: `linear-gradient(135deg,${T.indigoDark},${T.indigo})` };
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n ?? 0);

const getStockStatus = (qty) => {
  if (qty === 0) return { label: "Out of Stock", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", dot: "#DC2626" };
  if (qty <= 5)  return { label: "Low Stock",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706" };
  return               { label: "In Stock",      color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", dot: "#059669" };
};

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

  .prb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:prb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .prb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(79,70,229,.14);
    transform:translateY(-2px);
  }

  .prb-part-tile {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08);
    animation:prb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
    display:flex;
    flex-direction:column;
  }
  .prb-part-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }

  .prb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .prb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }
  .prb-divider     { height:1px; background:${T.gray100}; margin:14px 0; }

  .prb-success-icon circle { animation:prb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .prb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:prb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:640px) {
    .prb-part-grid  { grid-template-columns:1fr !important; }
    .prb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
  @media (max-width:400px) {
    .prb-detail-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Stock Badge ──────────────────────────────────────────────────────────────
const StockBadge = ({ qty }) => {
  const { label, color, bg, border, dot } = getStockStatus(qty);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99,
      background: bg, border: `1px solid ${border}`,
      fontSize: 11, fontWeight: 700, color,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", background: dot, flexShrink: 0,
        boxShadow: `0 0 0 2px ${bg}`,
      }} />
      {label}
    </span>
  );
};

// ─── Part Tile (grid) ─────────────────────────────────────────────────────────
const PartTile = ({ part, index }) => {
  const { partId, partName, partDescription, categoryName, supplierName, currentPrice, stockQuantity } = part;
  const { icon, color, bg, border, grad } = getCategoryMeta(categoryName);
  const stock = getStockStatus(stockQuantity);

  return (
    <div className="prb-part-tile" style={{ animationDelay: `${index * 55}ms` }}>
      {/* gradient header */}
      <div style={{
        background: grad,
        padding: "18px 18px 14px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 13,
          background: "rgba(255,255,255,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span className="prb-mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>
            ID #{partId}
          </span>
          {/* Stock pill on tile header */}
          <span style={{
            fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.9)",
            background: "rgba(0,0,0,.2)", borderRadius: 99, padding: "2px 8px",
          }}>
            Qty: {stockQuantity}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {/* name */}
        <div>
          <div className="prb-field-label">Part Name</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: T.gray900, lineHeight: 1.3 }}>{partName}</div>
        </div>

        {/* category + supplier */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color,
            background: bg, border: `1px solid ${border}`,
            borderRadius: 6, padding: "2px 8px",
          }}>{categoryName}</span>
          <span style={{
            fontSize: 10, fontWeight: 600, color: T.gray500,
            background: T.gray100, borderRadius: 6, padding: "2px 8px",
          }}>{supplierName}</span>
        </div>

        {/* description if present */}
        {partDescription && (
          <div style={{ fontSize: 11, color: T.gray500, lineHeight: 1.5, flex: 1 }}>
            {partDescription}
          </div>
        )}

        {/* price + stock row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: bg, border: `1px solid ${border}`,
          borderRadius: 10, padding: "9px 13px",
          marginTop: "auto",
        }}>
          <StockBadge qty={stockQuantity} />
          <span className="prb-mono" style={{ fontSize: 17, fontWeight: 900, color }}>
            {fmtMoney(currentPrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Part Grid (Get All) ──────────────────────────────────────────────────────
const PartGrid = ({ parts }) => {
  const outOfStock = parts.filter(p => p.stockQuantity === 0).length;
  const lowStock   = parts.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 5).length;

  return (
    <>
      {/* summary bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "4px 12px", borderRadius: 99,
          background: T.indigoLight, border: `1px solid ${T.indigoMid}`,
          fontSize: 12, fontWeight: 700, color: T.indigo,
        }}>
          🔩 {parts.length} part{parts.length !== 1 ? "s" : ""}
        </span>
        {outOfStock > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: "#FEF2F2", border: "1px solid #FECACA",
            fontSize: 12, fontWeight: 700, color: "#DC2626",
          }}>
            ⚠️ {outOfStock} out of stock
          </span>
        )}
        {lowStock > 0 && (
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 12px", borderRadius: 99,
            background: "#FFFBEB", border: "1px solid #FDE68A",
            fontSize: 12, fontWeight: 700, color: "#D97706",
          }}>
            📉 {lowStock} low stock
          </span>
        )}
      </div>

      <div className="prb-part-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
        gap: 16,
      }}>
        {parts.map((p, i) => (
          <PartTile key={p.partId} part={p} index={i} />
        ))}
      </div>
    </>
  );
};

// ─── Single Part Card ─────────────────────────────────────────────────────────
const SinglePartCard = ({ part, isNew = false, isUpdate = false }) => {
  const { partId, partName, partDescription, categoryName, supplierName, currentPrice, stockQuantity } = part;
  const { icon, color, bg, border, grad } = getCategoryMeta(categoryName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : grad;

  const headerLabel = isNew ? "PART CREATED" : isUpdate ? "PART UPDATED" : "SPARE PART";

  return (
    <div className="prb-card">
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
            <div style={{ fontSize: 20, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
              {partName}
            </div>
          </div>
        </div>
        <span className="prb-mono" style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
          ID #{partId}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        {/* description */}
        {partDescription && (
          <div style={{
            fontSize: 13, color: T.gray600, lineHeight: 1.6,
            background: T.gray50, borderRadius: 10, padding: "10px 14px",
            marginBottom: 16, border: `1px solid ${T.gray200}`,
          }}>
            {partDescription}
          </div>
        )}

        <div className="prb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "14px 20px",
        }}>
          <div>
            <div className="prb-field-label">🗂️ Part ID</div>
            <div className="prb-field-value prb-mono">#{partId}</div>
          </div>
          <div>
            <div className="prb-field-label">🏷️ Category</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color,
                background: bg, border: `1px solid ${border}`,
                borderRadius: 6, padding: "2px 8px",
              }}>{categoryName}</span>
            </div>
          </div>
          <div>
            <div className="prb-field-label">🏭 Supplier</div>
            <div className="prb-field-value" style={{ fontSize: 13 }}>{supplierName}</div>
          </div>
          <div>
            <div className="prb-field-label">💰 Current Price</div>
            <div className="prb-field-value prb-mono" style={{ fontSize: 18, fontWeight: 900, color }}>
              {fmtMoney(currentPrice)}
            </div>
          </div>
          <div>
            <div className="prb-field-label">📦 Stock</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
              <StockBadge qty={stockQuantity} />
              <span className="prb-mono" style={{ fontSize: 14, fontWeight: 700, color: T.gray700 }}>
                {stockQuantity} units
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard = ({ message }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 20px", borderRadius: 14,
    background: T.greenLight, border: `1px solid ${T.greenMid}`,
    animation: "prb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="prb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
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
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "prb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
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
const PartsResultBox = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="prb-root" style={{ marginTop: 16 }}>
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isError = isObj && (
    data.success === false ||
    data.error !== undefined ||
    (data.status && data.status >= 400)
  );
  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.partId === undefined;
  const isSingle     = isObj && !isError && data.partId !== undefined && data.partName !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="prb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SinglePartCard part={data} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "prb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🔩</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No parts found</div>
        </div>
      )}

      {isArray && data.length > 0 && <PartGrid parts={data} />}
    </div>
  );
};

export default PartsResultBox;