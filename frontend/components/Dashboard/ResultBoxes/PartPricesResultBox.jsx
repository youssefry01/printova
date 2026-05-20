/**
 * PartPricesResultBox.jsx
 * Result renderer for part prices API responses.
 *
 * Handles:
 *  • Array of price records → table/card grid (Get All / Get By Part ID)
 *  • Single price record    → detail card (Get Latest / Add)
 *  • { message: "..." }    → success toast
 *  • Error                 → ErrorCard
 *  • null                  → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  teal:       "#0D9488",
  tealLight:  "#F0FDFA",
  tealMid:    "#99F6E4",
  tealDark:   "#0F766E",
  tealDeep:   "#134E4A",
  green:      "#059669",
  greenLight: "#ECFDF5",
  greenMid:   "#A7F3D0",
  greenDark:  "#065F46",
  cyan:       "#0891B2",
  cyanLight:  "#ECFEFF",
  cyanMid:    "#A5F3FC",
  red:        "#DC2626",
  redLight:   "#FEF2F2",
  gray50:     "#F9FAFB",
  gray100:    "#F3F4F6",
  gray200:    "#E5E7EB",
  gray300:    "#D1D5DB",
  gray400:    "#9CA3AF",
  gray500:    "#6B7280",
  gray600:    "#4B5563",
  gray700:    "#374151",
  gray900:    "#111827",
  white:      "#FFFFFF",
};

const fmtMoney = (n) =>
  new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n ?? 0);

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const fmtTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const fmtRelative = (iso) => {
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

  .ppb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:ppb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .ppb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(13,148,136,.14);
    transform:translateY(-2px);
  }

  .ppb-table-row {
    display:grid;
    grid-template-columns:60px 70px 1fr 1fr 1fr;
    align-items:center;
    padding:10px 18px;
    border-bottom:1px solid ${T.gray100};
    transition:background .15s;
    animation:ppb-row .28s cubic-bezier(.22,1,.36,1) both;
  }
  .ppb-table-row:last-child { border-bottom:none; }
  .ppb-table-row:hover { background:${T.tealLight}; }
  .ppb-table-head {
    display:grid;
    grid-template-columns:60px 70px 1fr 1fr 1fr;
    align-items:center;
    padding:9px 18px;
    background:${T.gray50};
    border-bottom:1px solid ${T.gray200};
  }

  .ppb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .ppb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }

  .ppb-success-icon circle { animation:ppb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .ppb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:ppb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:600px) {
    .ppb-table-row, .ppb-table-head {
      grid-template-columns:50px 60px 1fr 1fr !important;
    }
    .ppb-col-time { display:none !important; }
    .ppb-detail-grid { grid-template-columns:1fr 1fr !important; }
  }
  @media (max-width:400px) {
    .ppb-table-row, .ppb-table-head {
      grid-template-columns:44px 1fr 1fr !important;
    }
    .ppb-col-partid { display:none !important; }
    .ppb-detail-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Price Table (array) ──────────────────────────────────────────────────────
const PriceTable = ({ prices, isLatest = false }) => {
  const headerLabel = isLatest
    ? `LATEST PRICE · PART #${prices[0]?.partId ?? ""}`
    : `${prices.length} PRICE RECORD${prices.length !== 1 ? "S" : ""}`;

  return (
    <div className="ppb-card">
      {/* header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px",
        background: `linear-gradient(135deg,${T.tealDeep},${T.teal})`,
        flexWrap: "wrap", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11,
            background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
          }}>💹</div>
          <div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: ".08em" }}>
              PRICE HISTORY
            </div>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.white }}>{headerLabel}</div>
          </div>
        </div>
        {/* total / latest badge */}
        <span className="ppb-mono" style={{
          fontSize: 13, fontWeight: 700,
          background: "rgba(255,255,255,.15)", borderRadius: 8,
          padding: "4px 12px", color: "rgba(255,255,255,.9)",
        }}>
          {fmtMoney(prices[prices.length - 1]?.price)}
        </span>
      </div>

      {/* table */}
      <div>
        {/* thead */}
        <div className="ppb-table-head">
          {["#", "Part", "Price", "Valid From", "Time"].map((h, i) => (
            <div key={h} className={`ppb-field-label${i === 4 ? " ppb-col-time" : i === 1 ? " ppb-col-partid" : ""}`}>
              {h}
            </div>
          ))}
        </div>

        {/* rows */}
        {prices.map((p, idx) => {
          const isNewest = idx === prices.length - 1 && prices.length > 1;
          return (
            <div
              key={p.priceId}
              className="ppb-table-row"
              style={{ animationDelay: `${idx * 45}ms` }}
            >
              {/* price id */}
              <div className="ppb-mono" style={{ fontSize: 12, color: T.gray400, fontWeight: 600 }}>
                #{p.priceId}
              </div>

              {/* part id */}
              <div className="ppb-col-partid ppb-mono" style={{ fontSize: 12, color: T.gray500, fontWeight: 600 }}>
                Part #{p.partId}
              </div>

              {/* price */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span className="ppb-mono" style={{
                  fontSize: 14, fontWeight: 900,
                  color: isNewest ? T.teal : T.gray700,
                }}>
                  {fmtMoney(p.price)}
                </span>
                {isNewest && (
                  <span style={{
                    fontSize: 9, fontWeight: 800, color: T.teal,
                    background: T.tealLight, border: `1px solid ${T.tealMid}`,
                    borderRadius: 99, padding: "1px 6px", letterSpacing: ".05em",
                  }}>LATEST</span>
                )}
              </div>

              {/* valid from */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: T.gray700 }}>{fmtDate(p.validFrom)}</div>
                <div style={{ fontSize: 10, color: T.gray400, marginTop: 1 }}>{fmtRelative(p.validFrom)}</div>
              </div>

              {/* time */}
              <div className="ppb-col-time ppb-mono" style={{ fontSize: 11, color: T.gray400 }}>
                {fmtTime(p.validFrom)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Single Price Card ────────────────────────────────────────────────────────
const SinglePriceCard = ({ record, isNew = false, isLatest = false }) => {
  const { priceId, partId, price, validFrom } = record;

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isLatest
    ? `linear-gradient(135deg,${T.tealDeep},${T.teal})`
    : `linear-gradient(135deg,${T.tealDeep},${T.teal})`;

  const headerLabel = isNew ? "PRICE ADDED" : isLatest ? "LATEST PRICE" : "PRICE RECORD";

  return (
    <div className="ppb-card">
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
          }}>💹</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {headerLabel}
            </div>
            <div className="ppb-mono" style={{ fontSize: 22, fontWeight: 900, color: T.white, lineHeight: 1.2 }}>
              {fmtMoney(price)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="ppb-mono" style={{ fontSize: 11, color: "rgba(255,255,255,.5)" }}>Price ID</div>
          <div className="ppb-mono" style={{ fontSize: 15, color: "rgba(255,255,255,.8)", fontWeight: 700 }}>
            #{priceId}
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="ppb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "14px 20px",
        }}>
          <div>
            <div className="ppb-field-label">🗂️ Price ID</div>
            <div className="ppb-field-value ppb-mono">#{priceId}</div>
          </div>
          <div>
            <div className="ppb-field-label">🔩 Part ID</div>
            <div className="ppb-field-value ppb-mono">#{partId}</div>
          </div>
          <div>
            <div className="ppb-field-label">💰 Price</div>
            <div className="ppb-field-value ppb-mono" style={{ fontSize: 18, fontWeight: 900, color: T.teal }}>
              {fmtMoney(price)}
            </div>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <div className="ppb-field-label">📅 Valid From</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, flexWrap: "wrap" }}>
              <span style={{
                fontSize: 14, fontWeight: 700, color: T.gray900,
              }}>{fmtDate(validFrom)}</span>
              <span className="ppb-mono" style={{ fontSize: 12, color: T.gray500 }}>
                {fmtTime(validFrom)}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, color: T.teal,
                background: T.tealLight, border: `1px solid ${T.tealMid}`,
                borderRadius: 99, padding: "2px 8px",
              }}>{fmtRelative(validFrom)}</span>
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
    animation: "ppb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg className="ppb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
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
    <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #FECACA", animation: "ppb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
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
const PartPricesResultBox = ({ data, isNew = false, isLatest = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="ppb-root" style={{ marginTop: 16 }}>
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
  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.priceId === undefined;
  const isSingle     = isObj && !isError && data.priceId !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="ppb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SinglePriceCard record={data} isNew={isNew} isLatest={isLatest} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "28px 20px", borderRadius: 14, border: `2px dashed ${T.gray200}`,
          textAlign: "center", color: T.gray400, animation: "ppb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💹</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.gray600 }}>No price records found</div>
        </div>
      )}

      {isArray && data.length > 0 && <PriceTable prices={data} isLatest={isLatest} />}
    </div>
  );
};

export default PartPricesResultBox;