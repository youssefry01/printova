/**
 * CategoryResultBox.jsx
 * Result renderer for category API responses.
 *
 * Handles:
 *  • Array of categories  → icon grid (Get All)
 *  • Single category obj  → detail card (Get By ID / Add / Update)
 *  • { message: "..." }   → success toast
 *  • Error                → ErrorCard
 *  • null                 → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  orange:      "#EA580C",
  orangeLight: "#FFF7ED",
  orangeMid:   "#FED7AA",
  orangeDark:  "#9A3412",
  amber:       "#D97706",
  amberLight:  "#FFFBEB",
  green:       "#059669",
  greenLight:  "#ECFDF5",
  greenMid:    "#A7F3D0",
  red:         "#DC2626",
  redLight:    "#FEF2F2",
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

// ─── category icon mapping (by keyword in name) ───────────────────────────────
const getCategoryIcon = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("toner") || n.includes("ink"))       return { icon: "🖨️", color: "#0EA5E9", bg: "#F0F9FF", border: "#BAE6FD" };
  if (n.includes("fuser"))                            return { icon: "🔥", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" };
  if (n.includes("maintenance") || n.includes("kit")) return { icon: "🧰", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
  if (n.includes("roller"))                           return { icon: "⚙️", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" };
  if (n.includes("drum"))                             return { icon: "🥁", color: "#0F766E", bg: "#F0FDFA", border: "#99F6E4" };
  if (n.includes("formatter") || n.includes("board")) return { icon: "🖥️", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
  return { icon: "📦", color: T.orange, bg: T.orangeLight, border: T.orangeMid };
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes cb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes cb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes cb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .cb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .cb-mono   { font-family:'DM Mono',monospace !important; }

  .cb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:cb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .cb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(234,88,12,.14);
    transform:translateY(-2px);
  }

  .cb-cat-tile {
    background:${T.white};
    border-radius:14px;
    padding:16px;
    display:flex;
    flex-direction:column;
    gap:10px;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 6px 16px rgba(0,0,0,.07);
    animation:cb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .18s,transform .18s;
    border-top:3px solid transparent;
    cursor:default;
  }
  .cb-cat-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 14px 32px rgba(0,0,0,.1);
    transform:translateY(-3px);
  }

  .cb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .cb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }
  .cb-divider     { height:1px; background:${T.gray100}; margin:14px 0; }

  .cb-success-icon circle { animation:cb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .cb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:cb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:480px) {
    .cb-cat-grid { grid-template-columns:1fr 1fr !important; }
    .cb-detail-grid { grid-template-columns:1fr !important; }
  }
  @media (max-width:340px) {
    .cb-cat-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Category Tile (grid card) ────────────────────────────────────────────────
const CategoryTile = ({ cat, index }) => {
  const { id, categoryName, categoryDescription } = cat;
  const { icon, color, bg, border } = getCategoryIcon(categoryName);

  return (
    <div className="cb-cat-tile" style={{ borderTopColor: color, animationDelay: `${index * 45}ms` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 10,
          background: bg, border: `1px solid ${border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>{icon}</div>
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 13, fontWeight: 700, color: T.gray900,
            lineHeight: 1.3,
          }}>{categoryName}</div>
          <div className="cb-mono" style={{ fontSize: 11, color: T.gray400, marginTop: 2 }}>
            ID #{id}
          </div>
        </div>
      </div>
      {categoryDescription && (
        <div style={{
          fontSize: 12, color: T.gray500, lineHeight: 1.5,
          background: T.gray50, borderRadius: 8, padding: "6px 10px",
        }}>
          {categoryDescription}
        </div>
      )}
    </div>
  );
};

// ─── Category Grid (Get All) ──────────────────────────────────────────────────
const CategoryGrid = ({ categories }) => (
  <>
    <div style={{ marginBottom: 14 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 99,
        background: T.orangeLight, border: `1px solid ${T.orangeMid}`,
        fontSize: 12, fontWeight: 700, color: T.orange,
      }}>
        📦 {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
      </span>
    </div>
    <div className="cb-cat-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: 12,
    }}>
      {categories.map((c, i) => (
        <CategoryTile key={c.id} cat={c} index={i} />
      ))}
    </div>
  </>
);

// ─── Single Category Card (Get By ID / Add / Update) ─────────────────────────
const SingleCategoryCard = ({ cat, isNew = false, isUpdate = false }) => {
  const { id, categoryName, categoryDescription } = cat;
  const { icon, color, bg, border } = getCategoryIcon(categoryName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : `linear-gradient(135deg,${T.orangeDark},${T.orange})`;

  const headerLabel = isNew ? "CATEGORY CREATED" : isUpdate ? "CATEGORY UPDATED" : "CATEGORY";

  return (
    <div className="cb-card">
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, padding: "16px 22px",
        background: headerGrad,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, flexShrink: 0,
          }}>{icon}</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {headerLabel}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
              {categoryName}
            </div>
          </div>
        </div>
        <span className="cb-mono" style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
          ID #{id}
        </span>
      </div>

      <div style={{ padding: "16px 22px" }}>
        <div className="cb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "14px 20px",
        }}>
          <div>
            <div className="cb-field-label">🗂️ Category ID</div>
            <div className="cb-field-value cb-mono">#{id}</div>
          </div>
          <div>
            <div className="cb-field-label">🏷️ Name</div>
            <div className="cb-field-value">{categoryName}</div>
          </div>
        </div>

        {categoryDescription && (
          <>
            <div className="cb-divider" />
            <div>
              <div className="cb-field-label">📝 Description</div>
              <div style={{
                fontSize: 14, color: T.gray700, lineHeight: 1.6,
                background: T.gray50, borderLeft: `3px solid ${color}`,
                borderRadius: "0 8px 8px 0", padding: "8px 12px", marginTop: 4,
              }}>
                {categoryDescription}
              </div>
            </div>
          </>
        )}
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
    animation: "cb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="cb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.green} strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.green, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Success
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#065F46", marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "cb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
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
const CategoryResultBox = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  // plain string → success
  if (typeof data === "string") {
    return (
      <div className="cb-root" style={{ marginTop: 16 }}>
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj = typeof data === "object" && !Array.isArray(data);

  const isError = isObj && (
    data.success === false ||
    data.error !== undefined ||
    (data.status && data.status >= 400)
  );

  // { message: "Category deleted successfully" }
  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.id === undefined;

  // single category { id, categoryName, ... }
  const isSingle = isObj && !isError && data.id !== undefined && data.categoryName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="cb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SingleCategoryCard cat={data} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "cb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No categories found</div>
        </div>
      )}

      {isArray && data.length > 0 && <CategoryGrid categories={data} />}
    </div>
  );
};

export default CategoryResultBox;