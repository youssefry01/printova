/**
 * SupplierResultBox.jsx
 * Result renderer for supplier API responses.
 *
 * Handles:
 *  • Array of suppliers  → contact card grid (Get All)
 *  • Single supplier obj → detail card (Get By ID / Add / Update)
 *  • { message: "..." } → success toast
 *  • Error              → ErrorCard
 *  • null               → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  emerald:      "#059669",
  emeraldLight: "#ECFDF5",
  emeraldMid:   "#A7F3D0",
  emeraldDark:  "#065F46",
  teal:         "#0D9488",
  tealLight:    "#F0FDFA",
  green:        "#059669",
  greenLight:   "#ECFDF5",
  greenMid:     "#A7F3D0",
  red:          "#DC2626",
  redLight:     "#FEF2F2",
  gray50:       "#F9FAFB",
  gray100:      "#F3F4F6",
  gray200:      "#E5E7EB",
  gray300:      "#D1D5DB",
  gray400:      "#9CA3AF",
  gray500:      "#6B7280",
  gray600:      "#4B5563",
  gray700:      "#374151",
  gray900:      "#111827",
  white:        "#FFFFFF",
};

// ─── brand color detection from supplier name ─────────────────────────────────
const getSupplierAccent = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("hp"))      return { color: "#0096D6", bg: "#EFF9FF", border: "#BAE6FD", initBg: "linear-gradient(135deg,#005F8E,#0096D6)" };
  if (n.includes("canon"))   return { color: "#CC0000", bg: "#FEF2F2", border: "#FECACA", initBg: "linear-gradient(135deg,#991B1B,#CC0000)" };
  if (n.includes("epson"))   return { color: "#0033A0", bg: "#EFF6FF", border: "#BFDBFE", initBg: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("brother")) return { color: "#006CB4", bg: "#F0F9FF", border: "#BAE6FD", initBg: "linear-gradient(135deg,#075985,#006CB4)" };
  if (n.includes("xerox"))   return { color: "#E5202E", bg: "#FEF2F2", border: "#FECACA", initBg: "linear-gradient(135deg,#991B1B,#E5202E)" };
  if (n.includes("ricoh"))   return { color: "#005BAC", bg: "#EFF6FF", border: "#BFDBFE", initBg: "linear-gradient(135deg,#1E3A8A,#005BAC)" };
  // default emerald
  return { color: T.emerald, bg: T.emeraldLight, border: T.emeraldMid, initBg: "linear-gradient(135deg,#065F46,#059669)" };
};

const initials = (name = "") =>
  name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("");

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes sb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes sb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes sb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .sb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .sb-mono   { font-family:'DM Mono',monospace !important; }

  .sb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:sb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .sb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(5,150,105,.14);
    transform:translateY(-2px);
  }

  /* supplier contact card */
  .sb-supplier-card {
    background:${T.white};
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 6px 16px rgba(0,0,0,.07);
    animation:sb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .18s,transform .18s;
    display:flex;
    flex-direction:column;
  }
  .sb-supplier-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 14px 32px rgba(5,150,105,.14);
    transform:translateY(-3px);
  }

  .sb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .sb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }
  .sb-divider     { height:1px; background:${T.gray100}; margin:14px 0; }

  .sb-contact-row {
    display:flex; align-items:center; gap:8px;
    padding:7px 10px; border-radius:8px;
    transition:background .15s;
  }
  .sb-contact-row:hover { background:${T.gray50}; }

  .sb-summary-count {
    display:inline-flex; align-items:center; gap:6px;
    padding:4px 12px; border-radius:99px;
    background:${T.emeraldLight}; border:1px solid ${T.emeraldMid};
    font-size:12px; font-weight:700; color:${T.emerald};
    margin-bottom:14px;
  }

  .sb-success-icon circle { animation:sb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .sb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:sb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:600px) {
    .sb-supplier-grid { grid-template-columns:1fr !important; }
    .sb-detail-grid   { grid-template-columns:1fr !important; }
  }
`;

// ─── Supplier Avatar ──────────────────────────────────────────────────────────
const SupplierAvatar = ({ name, size = 48 }) => {
  const { initBg } = getSupplierAccent(name);
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25,
      background: initBg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.32, fontWeight: 800, color: T.white,
      flexShrink: 0, letterSpacing: ".02em",
      boxShadow: "0 2px 8px rgba(0,0,0,.18)",
    }}>
      {initials(name) || "SP"}
    </div>
  );
};

// ─── Contact Row ──────────────────────────────────────────────────────────────
const ContactRow = ({ icon, value, href, mono }) => (
  <div className="sb-contact-row">
    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
    {href ? (
      <a href={href} style={{
        fontSize: 13, color: T.teal, fontWeight: 600,
        textDecoration: "none", fontFamily: mono ? "'DM Mono',monospace" : "inherit",
      }}
        onMouseOver={e => e.target.style.textDecoration = "underline"}
        onMouseOut={e => e.target.style.textDecoration = "none"}
      >{value}</a>
    ) : (
      <span className={mono ? "sb-mono" : ""} style={{ fontSize: 13, color: T.gray700, fontWeight: 600 }}>{value}</span>
    )}
  </div>
);

// ─── Supplier Grid Card (mini) ────────────────────────────────────────────────
const SupplierMiniCard = ({ supplier, index }) => {
  const { id, supplierName, supplierEmail, supplierPhone } = supplier;
  const { color, bg, border } = getSupplierAccent(supplierName);

  return (
    <div className="sb-supplier-card" style={{ animationDelay: `${index * 55}ms` }}>
      {/* top accent strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

      <div style={{ padding: "16px" }}>
        {/* header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <SupplierAvatar name={supplierName} size={44} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: T.gray900,
              lineHeight: 1.3, overflow: "hidden",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {supplierName}
            </div>
            <div className="sb-mono" style={{ fontSize: 11, color: T.gray400, marginTop: 2 }}>ID #{id}</div>
          </div>
        </div>

        {/* contact details */}
        <div style={{
          background: T.gray50, borderRadius: 10,
          border: `1px solid ${T.gray200}`,
          overflow: "hidden",
        }}>
          <ContactRow icon="✉️" value={supplierEmail} href={`mailto:${supplierEmail}`} />
          <div style={{ height: 1, background: T.gray100 }} />
          <ContactRow icon="📞" value={supplierPhone} href={`tel:${supplierPhone}`} mono />
        </div>
      </div>
    </div>
  );
};

// ─── Supplier Grid (Get All) ──────────────────────────────────────────────────
const SupplierGrid = ({ suppliers }) => (
  <>
    <div className="sb-summary-count">
      🏭 {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}
    </div>
    <div className="sb-supplier-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
      gap: 14,
    }}>
      {suppliers.map((s, i) => (
        <SupplierMiniCard key={s.id} supplier={s} index={i} />
      ))}
    </div>
  </>
);

// ─── Single Supplier Card ─────────────────────────────────────────────────────
const SingleSupplierCard = ({ supplier, isNew = false, isUpdate = false }) => {
  const { id, supplierName, supplierEmail, supplierPhone } = supplier;
  const { color, bg, border, initBg } = getSupplierAccent(supplierName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : initBg;

  const headerLabel = isNew ? "SUPPLIER ADDED" : isUpdate ? "SUPPLIER UPDATED" : "SUPPLIER";

  return (
    <div className="sb-card">
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10, padding: "16px 22px",
        background: headerGrad,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12,
            background: "rgba(255,255,255,.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: T.white, letterSpacing: ".02em",
            flexShrink: 0,
          }}>
            {initials(supplierName) || "SP"}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {headerLabel}
            </div>
            <div style={{ fontSize: 19, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
              {supplierName}
            </div>
          </div>
        </div>
        <span className="sb-mono" style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
          ID #{id}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="sb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "14px 20px",
        }}>
          <div>
            <div className="sb-field-label">🏭 Supplier ID</div>
            <div className="sb-field-value sb-mono">#{id}</div>
          </div>
          <div>
            <div className="sb-field-label">✉️ Email</div>
            <a href={`mailto:${supplierEmail}`} style={{
              fontSize: 14, fontWeight: 600, color: T.teal,
              textDecoration: "none", display: "block",
            }}>{supplierEmail}</a>
          </div>
          <div>
            <div className="sb-field-label">📞 Phone</div>
            <a href={`tel:${supplierPhone}`} style={{
              fontSize: 14, fontWeight: 600, color: T.teal,
              textDecoration: "none", display: "block", fontFamily: "'DM Mono',monospace",
            }}>{supplierPhone}</a>
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
    animation: "sb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="sb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.green} strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: T.green, letterSpacing: ".06em", textTransform: "uppercase" }}>
        Success
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.emeraldDark, marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));
  return (
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "sb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
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
const SupplierResultBox = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="sb-root" style={{ marginTop: 16 }}>
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

  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.id === undefined;

  const isSingle = isObj && !isError && data.id !== undefined && data.supplierName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="sb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SingleSupplierCard supplier={data} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "sb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏭</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No suppliers found</div>
        </div>
      )}

      {isArray && data.length > 0 && <SupplierGrid suppliers={data} />}
    </div>
  );
};

export default SupplierResultBox;