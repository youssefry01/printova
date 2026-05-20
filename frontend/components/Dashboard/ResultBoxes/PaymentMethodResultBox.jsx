/**
 * PaymentMethodResultBox.jsx
 * Result renderer for payment method API responses.
 *
 * Handles:
 *  • Array of payment methods  → card grid (Get All)
 *  • Single method obj         → detail card (Get By ID / Add / Update)
 *  • { message: "..." }        → success toast (Delete)
 *  • Error                     → ErrorCard
 *  • null                      → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  // brand
  indigo:      "#4F46E5",
  indigoBg:    "#EEF2FF",
  indigoMid:   "#A5B4FC",
  indigoDark:  "#3730A3",
  indigoDeep:  "#1E1B4B",

  teal:        "#0D9488",
  tealBg:      "#F0FDFA",
  tealMid:     "#5EEAD4",
  tealDark:    "#0F766E",

  violet:      "#7C3AED",
  violetBg:    "#F5F3FF",
  violetMid:   "#C4B5FD",
  violetDark:  "#5B21B6",

  amber:       "#D97706",
  amberBg:     "#FFFBEB",
  amberMid:    "#FCD34D",
  amberDark:   "#92400E",

  emerald:     "#10B981",
  emeraldBg:   "#ECFDF5",
  emeraldMid:  "#6EE7B7",
  emeraldDark: "#065F46",

  rose:        "#F43F5E",
  roseBg:      "#FFF1F2",
  roseMid:     "#FDA4AF",
  roseDark:    "#881337",

  sky:         "#0EA5E9",
  skyBg:       "#F0F9FF",
  skyMid:      "#7DD3FC",
  skyDark:     "#0C4A6E",

  slate100:    "#F1F5F9",
  slate200:    "#E2E8F0",
  slate300:    "#CBD5E1",
  slate400:    "#94A3B8",
  slate500:    "#64748B",
  slate600:    "#475569",
  slate700:    "#334155",
  slate800:    "#1E293B",
  slate900:    "#0F172A",
  white:       "#FFFFFF",
};

// ─── method appearance config ─────────────────────────────────────────────────
const getMethodMeta = (code = "", name = "") => {
  const c = code.toUpperCase();
  const n = name.toUpperCase();
  if (c === "COD"  || n.includes("CASH"))   return { icon: "💵", color: T.teal,   bg: T.tealBg,   border: T.tealMid,   grad: `linear-gradient(135deg,${T.tealDark},${T.teal})`    };
  if (c === "CARD" || n.includes("CARD"))   return { icon: "💳", color: T.indigo, bg: T.indigoBg, border: T.indigoMid, grad: `linear-gradient(135deg,${T.indigoDeep},${T.indigo})` };
  if (c === "BANK" || n.includes("BANK"))   return { icon: "🏦", color: T.sky,    bg: T.skyBg,    border: T.skyMid,    grad: `linear-gradient(135deg,${T.skyDark},${T.sky})`       };
  if (c === "CRPT" || n.includes("CRYPTO")) return { icon: "₿",  color: T.amber,  bg: T.amberBg,  border: T.amberMid,  grad: `linear-gradient(135deg,${T.amberDark},${T.amber})`   };
  // default
  return { icon: "🪙", color: T.violet, bg: T.violetBg, border: T.violetMid, grad: `linear-gradient(135deg,${T.violetDark},${T.violet})` };
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @keyframes pmrb-rise {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pmrb-pop {
    0%   { transform:scale(.88); opacity:0; }
    60%  { transform:scale(1.03); }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes pmrb-check {
    0%   { stroke-dashoffset:44; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes pmrb-shine {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .pmrb-root * { box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
  .pmrb-mono   { font-family:'JetBrains Mono',monospace !important; }

  .pmrb-card {
    background:${T.white};
    border:1px solid #E8ECF4;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.05),0 10px 30px rgba(79,70,229,.08);
    animation:pmrb-rise .38s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .pmrb-card:hover {
    box-shadow:0 4px 10px rgba(0,0,0,.07),0 20px 44px rgba(79,70,229,.14);
    transform:translateY(-3px);
  }

  .pmrb-method-tile {
    background:${T.white};
    border:1px solid #E8ECF4;
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.05),0 6px 18px rgba(0,0,0,.07);
    animation:pmrb-rise .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
    display:flex; flex-direction:column;
  }
  .pmrb-method-tile:hover {
    box-shadow:0 4px 10px rgba(0,0,0,.08),0 16px 36px rgba(79,70,229,.12);
    transform:translateY(-4px);
  }

  .pmrb-code-pill {
    display:inline-flex; align-items:center; justify-content:center;
    padding:3px 10px; border-radius:7px;
    font-size:11px; font-weight:700; letter-spacing:.1em;
    font-family:'JetBrains Mono',monospace;
  }

  .pmrb-detail-label {
    font-size:9.5px; font-weight:700;
    text-transform:uppercase; letter-spacing:.1em;
    color:${T.slate400}; margin-bottom:4px;
  }
  .pmrb-detail-value {
    font-size:14px; font-weight:700; color:${T.slate800};
  }

  .pmrb-shine-strip {
    height:3px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);
    background-size:200% auto;
    animation:pmrb-shine 2.2s linear infinite;
  }

  .pmrb-success-path {
    stroke-dasharray:44; stroke-dashoffset:44;
    animation:pmrb-check .45s .2s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:480px) {
    .pmrb-grid { grid-template-columns:1fr !important; }
    .pmrb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
`;

// ─── Code Pill ────────────────────────────────────────────────────────────────
const CodePill = ({ code, color, bg, border }) => (
  <span className="pmrb-code-pill" style={{ background: bg, color, border: `1px solid ${border}` }}>
    {code}
  </span>
);

// ─── Method Tile (grid) ───────────────────────────────────────────────────────
const MethodTile = ({ method, index }) => {
  const { paymentMethodId, paymentMethodCode, paymentMethodName } = method;
  const { icon, color, bg, border, grad } = getMethodMeta(paymentMethodCode, paymentMethodName);

  return (
    <div className="pmrb-method-tile" style={{ animationDelay: `${index * 70}ms` }}>
      {/* gradient header */}
      <div style={{ background: grad, padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            width: 46, height: 46, borderRadius: 13,
            background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22,
          }}>{icon}</div>
          <span className="pmrb-mono" style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontWeight: 500 }}>
            ID #{paymentMethodId}
          </span>
        </div>
      </div>
      {/* shine strip */}
      <div className="pmrb-shine-strip" style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,.5), transparent)` }} />

      {/* body */}
      <div style={{ padding: "14px 18px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div className="pmrb-detail-label">Method Name</div>
          <div style={{ fontSize: 15, fontWeight: 800, color: T.slate900 }}>{paymentMethodName}</div>
        </div>
        <div style={{ marginTop: "auto" }}>
          <div className="pmrb-detail-label" style={{ marginBottom: 6 }}>Code</div>
          <CodePill code={paymentMethodCode} color={color} bg={bg} border={border} />
        </div>
      </div>
    </div>
  );
};

// ─── Method Grid (Get All) ────────────────────────────────────────────────────
const MethodGrid = ({ methods }) => (
  <>
    <div style={{ marginBottom: 14 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 99,
        background: T.indigoBg, border: `1px solid ${T.indigoMid}`,
        fontSize: 12, fontWeight: 700, color: T.indigo,
      }}>
        💳 {methods.length} method{methods.length !== 1 ? "s" : ""}
      </span>
    </div>
    <div
      className="pmrb-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 14,
      }}
    >
      {methods.map((m, i) => (
        <MethodTile key={m.paymentMethodId} method={m} index={i} />
      ))}
    </div>
  </>
);

// ─── Single Method Card ───────────────────────────────────────────────────────
const SingleMethodCard = ({ method, isNew = false, isUpdate = false }) => {
  const { paymentMethodId, paymentMethodCode, paymentMethodName } = method;
  const { icon, color, bg, border, grad } = getMethodMeta(paymentMethodCode, paymentMethodName);

  const headerGrad = isNew
    ? `linear-gradient(135deg, ${T.emeraldDark}, ${T.emerald})`
    : isUpdate
    ? `linear-gradient(135deg, ${T.skyDark}, ${T.sky})`
    : grad;

  const headerLabel = isNew ? "METHOD CREATED" : isUpdate ? "METHOD UPDATED" : "PAYMENT METHOD";
  const headerBadge = isNew ? "✨ New" : isUpdate ? "✏️ Updated" : null;

  return (
    <div className="pmrb-card">
      {/* header */}
      <div style={{ background: headerGrad, padding: "18px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 15,
              background: "rgba(255,255,255,.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>{icon}</div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.55)", fontWeight: 700, letterSpacing: ".1em", fontFamily: "'JetBrains Mono',monospace", marginBottom: 3 }}>
                {headerLabel}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: T.white, lineHeight: 1.15 }}>
                {paymentMethodName}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
            <span className="pmrb-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.45)" }}>
              ID #{paymentMethodId}
            </span>
            {headerBadge && (
              <span style={{
                fontSize: 11, fontWeight: 700, color: T.white,
                padding: "3px 10px", borderRadius: 99,
                background: "rgba(255,255,255,.2)", border: "1px solid rgba(255,255,255,.25)",
              }}>
                {headerBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="pmrb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px 20px",
        }}>
          <div>
            <div className="pmrb-detail-label">🗂️ ID</div>
            <div className="pmrb-detail-value pmrb-mono">#{paymentMethodId}</div>
          </div>
          <div>
            <div className="pmrb-detail-label">🏷️ Name</div>
            <div className="pmrb-detail-value">{paymentMethodName}</div>
          </div>
          <div>
            <div className="pmrb-detail-label">🔑 Code</div>
            <div style={{ marginTop: 2 }}>
              <CodePill code={paymentMethodCode} color={color} bg={bg} border={border} />
            </div>
          </div>
        </div>

        {/* accent bar */}
        <div style={{
          marginTop: 16, height: 3, borderRadius: 99,
          background: `linear-gradient(90deg, ${color}, transparent)`,
          opacity: .35,
        }} />
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard = ({ message }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 14,
    padding: "14px 20px", borderRadius: 14,
    background: T.emeraldBg, border: `1px solid ${T.emeraldMid}`,
    animation: "pmrb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.emerald} strokeWidth="1.5" />
      <path className="pmrb-success-path" d="M11 18.5l5 5 9-10" stroke={T.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.emerald, letterSpacing: ".08em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace" }}>
        Success
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: T.emeraldDark, marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${T.roseMid}`, animation: "pmrb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "14px 20px",
        background: `linear-gradient(135deg, ${T.roseDark}, ${T.rose})`,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,.18)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
        }}>⚠️</div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: ".1em", fontFamily: "'JetBrains Mono',monospace" }}>REQUEST FAILED</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: T.white }}>Action Could Not Be Completed</div>
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: T.roseBg }}>
        {message && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#FFE4E6", border: "1px solid #FECDD3",
            borderLeft: `3px solid ${T.rose}`, borderRadius: "0 8px 8px 0",
            padding: "10px 14px", marginBottom: hasExtra ? 12 : 0,
          }}>
            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>🔴</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.roseDark, lineHeight: 1.5 }}>{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre style={{
            margin: 0, fontSize: 11, color: T.roseDark, fontFamily: "'JetBrains Mono',monospace",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "#FFE4E6", borderRadius: 8, padding: "10px 14px",
          }}>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PaymentMethodResultBox = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="pmrb-root" style={{ marginTop: 16 }}>
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

  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.paymentMethodId === undefined;
  const isSingle     = isObj && !isError && data.paymentMethodId !== undefined;

  return (
    <div className="pmrb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SingleMethodCard method={data} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "32px 20px", borderRadius: 16, border: `2px dashed ${T.slate200}`,
          textAlign: "center", animation: "pmrb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💳</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.slate600 }}>No payment methods found</div>
          <div style={{ fontSize: 13, color: T.slate400, marginTop: 4 }}>Add a method to get started.</div>
        </div>
      )}

      {isArray && data.length > 0 && <MethodGrid methods={data} />}
    </div>
  );
};

export default PaymentMethodResultBox;