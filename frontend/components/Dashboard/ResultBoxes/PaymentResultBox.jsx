/**
 * PaymentResultBox.jsx
 * Result renderer for payment API responses.
 *
 * Handles:
 *  • Array of payments   → timeline table (Get All)
 *  • Single payment obj  → detail card (Get By ID)
 *  • { message: "..." }  → success toast
 *  • Error               → ErrorCard
 *  • null                → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  ink:        "#0D1117",
  inkSoft:    "#161B22",
  surface:    "#FFFFFF",
  border:     "#E8ECF0",
  borderDark: "#D0D7DE",

  emerald:    "#10B981",
  emeraldBg:  "#ECFDF5",
  emeraldMid: "#6EE7B7",
  emeraldDark:"#065F46",

  amber:      "#F59E0B",
  amberBg:    "#FFFBEB",
  amberMid:   "#FCD34D",
  amberDark:  "#92400E",

  sky:        "#0EA5E9",
  skyBg:      "#F0F9FF",
  skyMid:     "#7DD3FC",
  skyDark:    "#0C4A6E",

  rose:       "#F43F5E",
  roseBg:     "#FFF1F2",
  roseMid:    "#FDA4AF",
  roseDark:   "#881337",

  slate100:   "#F1F5F9",
  slate200:   "#E2E8F0",
  slate300:   "#CBD5E1",
  slate400:   "#94A3B8",
  slate500:   "#64748B",
  slate600:   "#475569",
  slate700:   "#334155",
  slate800:   "#1E293B",
  slate900:   "#0F172A",
  white:      "#FFFFFF",
};

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const statusMeta = (status) => {
  if (!status) return { color: T.slate400, bg: T.slate100, dot: T.slate400, label: "UNKNOWN" };
  const s = status.toUpperCase();
  if (s === "COMPLETED") return { color: T.emeraldDark, bg: T.emeraldBg, dot: T.emerald, label: "COMPLETED" };
  if (s === "PENDING")   return { color: T.amberDark,   bg: T.amberBg,   dot: T.amber,   label: "PENDING"   };
  if (s === "FAILED")    return { color: T.roseDark,    bg: T.roseBg,    dot: T.rose,     label: "FAILED"    };
  return { color: T.skyDark, bg: T.skyBg, dot: T.sky, label: s };
};

const linkMeta = (p) => {
  if (p.orderId)       return { type: "Order",       id: p.orderId,       icon: "📦", color: T.sky,    bg: T.skyBg,    border: T.skyMid    };
  if (p.maintenanceId) return { type: "Maintenance", id: p.maintenanceId, icon: "🔧", color: T.amber,  bg: T.amberBg,  border: T.amberMid  };
  return null;
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;0,9..144,700;1,9..144,300&display=swap');

  @keyframes pmb-rise {
    from { opacity:0; transform:translateY(10px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pmb-pop {
    0%   { transform:scale(.92); opacity:0; }
    55%  { transform:scale(1.02); }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes pmb-check {
    0%   { stroke-dashoffset:44; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes pmb-row {
    from { opacity:0; transform:translateX(-6px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes pmb-pulse {
    0%,100% { opacity:1; }
    50%     { opacity:.45; }
  }

  .pmb-root * { box-sizing:border-box; }
  .pmb-serif  { font-family:'Fraunces', Georgia, serif !important; }
  .pmb-mono   { font-family:'IBM Plex Mono', 'Courier New', monospace !important; }
  .pmb-sans   { font-family:'Fraunces', Georgia, serif; }

  .pmb-shell {
    background:${T.white};
    border:1px solid ${T.border};
    border-radius:20px;
    overflow:hidden;
    box-shadow:
      0 1px 3px rgba(0,0,0,.04),
      0 8px 24px rgba(0,0,0,.06),
      inset 0 1px 0 rgba(255,255,255,.9);
    animation:pmb-pop .38s cubic-bezier(.22,1,.36,1) both;
  }

  .pmb-table-row {
    animation: pmb-row .3s cubic-bezier(.22,1,.36,1) both;
    transition: background .15s;
  }
  .pmb-table-row:hover { background: ${T.slate100}; }

  .pmb-status-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 9px; border-radius:99px;
    font-size:10px; font-weight:600; letter-spacing:.06em;
  }
  .pmb-status-dot {
    width:6px; height:6px; border-radius:50%; flex-shrink:0;
  }

  .pmb-link-chip {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 9px; border-radius:8px;
    font-size:11px; font-weight:600;
    font-family:'IBM Plex Mono',monospace;
  }

  .pmb-detail-field {
    display:flex; flex-direction:column; gap:4px;
  }
  .pmb-detail-label {
    font-size:9.5px; font-weight:600;
    text-transform:uppercase; letter-spacing:.1em;
    color:${T.slate400};
  }
  .pmb-detail-value {
    font-size:14px; font-weight:600;
    color:${T.slate800};
    font-family:'Fraunces',Georgia,serif;
  }

  .pmb-divider { height:1px; background:${T.border}; }

  .pmb-success-path {
    stroke-dasharray:44; stroke-dashoffset:44;
    animation:pmb-check .45s .2s cubic-bezier(.22,1,.36,1) forwards;
  }

  .pmb-pending-dot { animation:pmb-pulse 1.8s ease-in-out infinite; }

  @media (max-width:540px) {
    .pmb-detail-grid { grid-template-columns:1fr 1fr !important; }
    .pmb-table-col-date { display:none !important; }
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const { color, bg, dot, label } = statusMeta(status);
  const isPending = label === "PENDING";
  return (
    <span className="pmb-status-badge" style={{ background: bg, color }}>
      <span className={`pmb-status-dot ${isPending ? "pmb-pending-dot" : ""}`} style={{ background: dot }} />
      {label}
    </span>
  );
};

// ─── Link Chip ────────────────────────────────────────────────────────────────
const LinkChip = ({ payment }) => {
  const meta = linkMeta(payment);
  if (!meta) return <span style={{ color: T.slate400, fontSize: 12 }}>—</span>;
  return (
    <span className="pmb-link-chip" style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}>
      {meta.icon} {meta.type} #{meta.id}
    </span>
  );
};

// ─── Payment Table (Get All) ──────────────────────────────────────────────────
const PaymentTable = ({ payments }) => {
  const completed = payments.filter(p => p.paymentStatus === "COMPLETED").length;
  const pending   = payments.filter(p => p.paymentStatus === "PENDING").length;
  const total     = payments.reduce((s, p) => s + (p.paymentAmount || 0), 0);

  return (
    <div className="pmb-shell">
      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, ${T.slate900} 0%, ${T.slate800} 100%)`,
        padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(255,255,255,.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>💳</div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.45)", letterSpacing: ".1em", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 2 }}>
              PAYMENT LEDGER
            </div>
            <div className="pmb-serif" style={{ fontSize: 22, fontWeight: 700, color: T.white, lineHeight: 1 }}>
              All Transactions
            </div>
          </div>
        </div>

        {/* summary pills */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <div style={{
            padding: "6px 14px", borderRadius: 10,
            background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)",
          }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", letterSpacing: ".08em", fontFamily: "'IBM Plex Mono',monospace" }}>TOTAL</div>
            <div className="pmb-mono" style={{ fontSize: 16, fontWeight: 600, color: T.white }}>{fmtMoney(total)}</div>
          </div>
          <div style={{
            padding: "6px 14px", borderRadius: 10,
            background: T.emeraldBg, border: `1px solid ${T.emeraldMid}`,
          }}>
            <div style={{ fontSize: 9, color: T.emeraldDark, letterSpacing: ".08em", fontFamily: "'IBM Plex Mono',monospace" }}>COMPLETED</div>
            <div className="pmb-mono" style={{ fontSize: 16, fontWeight: 600, color: T.emeraldDark }}>{completed}</div>
          </div>
          <div style={{
            padding: "6px 14px", borderRadius: 10,
            background: T.amberBg, border: `1px solid ${T.amberMid}`,
          }}>
            <div style={{ fontSize: 9, color: T.amberDark, letterSpacing: ".08em", fontFamily: "'IBM Plex Mono',monospace" }}>PENDING</div>
            <div className="pmb-mono" style={{ fontSize: 16, fontWeight: 600, color: T.amberDark }}>{pending}</div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: T.slate100, borderBottom: `1px solid ${T.border}` }}>
              {["ID", "Status", "Amount", "Linked To", "Date"].map((h) => (
                <th key={h} style={{
                  padding: "10px 16px", textAlign: "left",
                  fontSize: 10, fontWeight: 700, letterSpacing: ".09em",
                  color: T.slate500, textTransform: "uppercase",
                  fontFamily: "'IBM Plex Mono',monospace",
                  whiteSpace: "nowrap",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr
                key={p.paymentId}
                className="pmb-table-row"
                style={{
                  borderBottom: i < payments.length - 1 ? `1px solid ${T.border}` : "none",
                  animationDelay: `${i * 35}ms`,
                }}
              >
                <td style={{ padding: "12px 16px" }}>
                  <span className="pmb-mono" style={{ fontSize: 12, color: T.slate500, fontWeight: 500 }}>
                    #{p.paymentId}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <StatusBadge status={p.paymentStatus} />
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span className="pmb-mono" style={{
                    fontSize: 14, fontWeight: 600,
                    color: p.paymentStatus === "COMPLETED" ? T.emeraldDark : T.slate800,
                  }}>
                    {fmtMoney(p.paymentAmount)}
                  </span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <LinkChip payment={p} />
                </td>
                <td className="pmb-table-col-date" style={{ padding: "12px 16px" }}>
                  <span className="pmb-mono" style={{ fontSize: 11, color: T.slate400 }}>
                    {fmtDate(p.paymentDate)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: "10px 20px", background: T.slate100,
        borderTop: `1px solid ${T.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span className="pmb-mono" style={{ fontSize: 11, color: T.slate400 }}>
          {payments.length} record{payments.length !== 1 ? "s" : ""}
        </span>
        <span className="pmb-mono" style={{ fontSize: 11, color: T.slate400 }}>
          All payments · Cash on Delivery
        </span>
      </div>
    </div>
  );
};

// ─── Single Payment Card ──────────────────────────────────────────────────────
const SinglePaymentCard = ({ payment }) => {
  const { paymentId, paymentMethodName, paymentStatus, paymentAmount, paymentDate } = payment;
  // eslint-disable-next-line no-unused-vars
  const { color, bg, dot, label } = statusMeta(paymentStatus);
  const link = linkMeta(payment);

  const isCompleted = label === "COMPLETED";
  const headerBg = isCompleted
    ? `linear-gradient(135deg, ${T.emeraldDark} 0%, ${T.emerald} 100%)`
    : `linear-gradient(135deg, ${T.slate900} 0%, ${T.slate700} 100%)`;

  return (
    <div className="pmb-shell">
      {/* ── Header ── */}
      <div style={{ background: headerBg, padding: "20px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16,
              background: "rgba(255,255,255,.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, flexShrink: 0,
            }}>
              {isCompleted ? "✅" : "⏳"}
            </div>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.5)", letterSpacing: ".1em", fontFamily: "'IBM Plex Mono',monospace", marginBottom: 4 }}>
                PAYMENT RECEIPT
              </div>
              <div className="pmb-serif" style={{ fontSize: 26, fontWeight: 700, color: T.white, lineHeight: 1.1 }}>
                {fmtMoney(paymentAmount)}
              </div>
            </div>
          </div>
          <div style={{
            padding: "5px 12px", borderRadius: 99,
            background: "rgba(255,255,255,.15)", border: "1px solid rgba(255,255,255,.2)",
            fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,.9)",
            fontFamily: "'IBM Plex Mono',monospace",
            whiteSpace: "nowrap",
          }}>
            ID #{paymentId}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "20px 24px" }}>
        <div className="pmb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "18px 24px",
        }}>

          <div className="pmb-detail-field">
            <div className="pmb-detail-label">🔖 Status</div>
            <div><StatusBadge status={paymentStatus} /></div>
          </div>

          <div className="pmb-detail-field">
            <div className="pmb-detail-label">💳 Method</div>
            <div className="pmb-detail-value" style={{ fontSize: 13 }}>{paymentMethodName}</div>
          </div>

          <div className="pmb-detail-field">
            <div className="pmb-detail-label">📅 Date</div>
            <div className="pmb-mono" style={{ fontSize: 12, fontWeight: 500, color: T.slate600 }}>
              {fmtDate(paymentDate)}
            </div>
          </div>

          {link && (
            <div className="pmb-detail-field" style={{ gridColumn: "1 / -1" }}>
              <div className="pmb-detail-label">🔗 Linked To</div>
              <div style={{ marginTop: 2 }}><LinkChip payment={payment} /></div>
            </div>
          )}

        </div>

        {/* amount bar */}
        <div style={{
          marginTop: 18, padding: "14px 18px", borderRadius: 12,
          background: isCompleted ? T.emeraldBg : T.amberBg,
          border: `1px solid ${isCompleted ? T.emeraldMid : T.amberMid}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".07em", textTransform: "uppercase", color: isCompleted ? T.emeraldDark : T.amberDark }}>
            Total Amount Paid
          </span>
          <span className="pmb-mono" style={{ fontSize: 22, fontWeight: 600, color: isCompleted ? T.emeraldDark : T.amberDark }}>
            {fmtMoney(paymentAmount)}
          </span>
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
    background: T.emeraldBg, border: `1px solid ${T.emeraldMid}`,
    animation: "pmb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.emerald} strokeWidth="1.5" />
      <path className="pmb-success-path" d="M11 18.5l5 5 9-10" stroke={T.emerald} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: T.emerald, letterSpacing: ".07em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono',monospace" }}>
        Success
      </div>
      <div className="pmb-serif" style={{ fontSize: 15, fontWeight: 600, color: T.emeraldDark, marginTop: 2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));
  return (
    <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${T.roseMid}`, animation: "pmb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
        background: `linear-gradient(135deg, ${T.roseDark}, ${T.rose})`,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: "rgba(255,255,255,.18)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
        }}>⚠️</div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: ".1em", fontFamily: "'IBM Plex Mono',monospace" }}>REQUEST FAILED</div>
          <div className="pmb-serif" style={{ fontSize: 18, fontWeight: 700, color: T.white }}>Payment Not Found</div>
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
            <span style={{ fontSize: 14, fontWeight: 600, color: T.roseDark, lineHeight: 1.5, fontFamily: "'Fraunces',serif" }}>{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre style={{
            margin: 0, fontSize: 11, color: T.roseDark, fontFamily: "'IBM Plex Mono',monospace",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "#FFE4E6", borderRadius: 8, padding: "10px 14px",
          }}>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PaymentResultBox = ({ data }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="pmb-root" style={{ marginTop: 16 }}>
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

  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.paymentId === undefined;
  const isSingle     = isObj && !isError && data.paymentId !== undefined;

  return (
    <div className="pmb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isSingle     && <SinglePaymentCard payment={data} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding: "32px 20px", borderRadius: 16, border: `2px dashed ${T.slate200}`,
          textAlign: "center", animation: "pmb-pop .35s ease both",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>💳</div>
          <div className="pmb-serif" style={{ fontSize: 16, fontWeight: 600, color: T.slate600 }}>No payments found</div>
          <div style={{ fontSize: 13, color: T.slate400, marginTop: 4 }}>There are no payment records to display.</div>
        </div>
      )}

      {isArray && data.length > 0 && <PaymentTable payments={data} />}
    </div>
  );
};

export default PaymentResultBox;