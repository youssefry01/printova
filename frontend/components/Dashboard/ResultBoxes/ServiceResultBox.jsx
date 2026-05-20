/**
 * ServiceResultBox.jsx
 * Result renderer for service API responses.
 *
 * Handles:
 *  • Array of services  → card grid (Get All)
 *  • Single service obj → detail card (Get By ID / Add / Update)
 *  • { message: "..." } → success toast
 *  • Error              → ErrorCard
 *  • null               → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  purple:      "#7C3AED",
  purpleLight: "#F5F3FF",
  purpleMid:   "#DDD6FE",
  purpleDark:  "#5B21B6",
  violet:      "#6D28D9",
  green:       "#059669",
  greenLight:  "#ECFDF5",
  greenMid:    "#A7F3D0",
  greenDark:   "#065F46",
  blue:        "#2563EB",
  blueLight:   "#EFF6FF",
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

// ─── service type config ──────────────────────────────────────────────────────
const getServiceMeta = (name = "") => {
  const n = name.toUpperCase();
  if (n.includes("DELIVERY"))    return { icon: "🚚", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (n.includes("MAINTENANCE")) return { icon: "🔧", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("INSTALL"))     return { icon: "⚙️", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (n.includes("REPAIR"))      return { icon: "🛠️", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  if (n.includes("CONSULT"))     return { icon: "💼", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  // default purple
  return { icon: "⚡", color: T.purple, bg: T.purpleLight, border: T.purpleMid, grad: `linear-gradient(135deg,${T.purpleDark},${T.purple})` };
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes svb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes svb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes svb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes svb-count {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0);   }
  }

  .svb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .svb-mono   { font-family:'DM Mono',monospace !important; }

  .svb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:svb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .svb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(124,58,237,.14);
    transform:translateY(-2px);
  }

  .svb-service-tile {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08);
    animation:svb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
    display:flex;
    flex-direction:column;
  }
  .svb-service-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }

  .svb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .svb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }
  .svb-divider     { height:1px; background:${T.gray100}; margin:14px 0; }

  .svb-success-icon circle { animation:svb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .svb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:svb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:500px) {
    .svb-service-grid { grid-template-columns:1fr !important; }
    .svb-detail-grid  { grid-template-columns:1fr 1fr !important; }
  }
`;

// ─── Service Tile (grid) ──────────────────────────────────────────────────────
const ServiceTile = ({ service, index }) => {
  const { id, serviceName, servicePrice } = service;
  const { icon, color, bg, border, grad } = getServiceMeta(serviceName);

  return (
    <div className="svb-service-tile" style={{ animationDelay: `${index * 60}ms` }}>
      {/* gradient header */}
      <div style={{
        background: grad,
        padding: "20px 20px 16px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: "rgba(255,255,255,.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0,
        }}>{icon}</div>
        <span className="svb-mono" style={{
          fontSize: 11, color: "rgba(255,255,255,.55)", fontWeight: 600, paddingTop: 4,
        }}>ID #{id}</span>
      </div>

      {/* body */}
      <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div className="svb-field-label">Service Name</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: T.gray900 }}>{serviceName}</div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: bg, border: `1px solid ${border}`,
          borderRadius: 10, padding: "10px 14px",
          marginTop: "auto",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: ".06em", textTransform: "uppercase" }}>
            Service Fee
          </span>
          <span className="svb-mono" style={{ fontSize: 20, fontWeight: 900, color }}>
            {fmtMoney(servicePrice)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Service Grid (Get All) ───────────────────────────────────────────────────
const ServiceGrid = ({ services }) => (
  <>
    <div style={{ marginBottom: 14 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 99,
        background: T.purpleLight, border: `1px solid ${T.purpleMid}`,
        fontSize: 12, fontWeight: 700, color: T.purple,
      }}>
        ⚡ {services.length} service{services.length !== 1 ? "s" : ""}
      </span>
    </div>
    <div className="svb-service-grid" style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: 16,
    }}>
      {services.map((s, i) => (
        <ServiceTile key={s.id} service={s} index={i} />
      ))}
    </div>
  </>
);

// ─── Single Service Card ──────────────────────────────────────────────────────
const SingleServiceCard = ({ service, isNew = false, isUpdate = false }) => {
  const { id, serviceName, servicePrice } = service;
  const { icon, color, bg, border, grad } = getServiceMeta(serviceName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : grad;

  const headerLabel = isNew ? "SERVICE CREATED" : isUpdate ? "SERVICE UPDATED" : "SERVICE";

  return (
    <div className="svb-card">
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
              {serviceName}
            </div>
          </div>
        </div>
        <span className="svb-mono" style={{ fontSize: 13, color: "rgba(255,255,255,.5)" }}>
          ID #{id}
        </span>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="svb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "14px 20px",
        }}>
          <div>
            <div className="svb-field-label">🗂️ Service ID</div>
            <div className="svb-field-value svb-mono">#{id}</div>
          </div>
          <div>
            <div className="svb-field-label">🏷️ Name</div>
            <div className="svb-field-value">{serviceName}</div>
          </div>
          <div>
            <div className="svb-field-label">💰 Price</div>
            <div className="svb-field-value svb-mono" style={{ fontSize: 18, fontWeight: 900, color }}>
              {fmtMoney(servicePrice)}
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
    animation: "svb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="svb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
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
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "svb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
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
const ServiceResultBox = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="svb-root" style={{ marginTop: 16 }}>
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

  const isSingle = isObj && !isError && data.id !== undefined && data.serviceName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="svb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SingleServiceCard service={data} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "svb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No services found</div>
        </div>
      )}

      {isArray && data.length > 0 && <ServiceGrid services={data} />}
    </div>
  );
};

export default ServiceResultBox;