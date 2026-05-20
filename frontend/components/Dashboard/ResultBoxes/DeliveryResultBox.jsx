/**
 * OrderResultBox.jsx
 * Result renderer for delivery-order API responses.
 *
 * Handles:
 *  • Array  → summary strip + list of OrderCards
 *  • Object → single OrderCard  (Complete Order response)
 *  • Error  → ErrorCard  ({ success:false, error:"..." } or HTTP error)
 *  • null   → nothing
 */

import React, { useState } from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  blue:        "#1D4ED8",
  blueLight:   "#EFF6FF",
  blueMid:     "#DBEAFE",
  navyDark:    "#1E3A8A",
  teal:        "#0D9488",
  tealDark:    "#0F766E",
  tealLight:   "#F0FDFA",
  tealMid:     "#99F6E4",
  green:       "#059669",
  greenLight:  "#ECFDF5",
  amber:       "#D97706",
  amberLight:  "#FFFBEB",
  amberMid:    "#FDE68A",
  red:         "#DC2626",
  redLight:    "#FEF2F2",
  gray50:      "#F9FAFB",
  gray100:     "#F3F4F6",
  gray200:     "#E5E7EB",
  gray300:     "#D1D5DB",
  gray400:     "#9CA3AF",
  gray500:     "#6B7280",
  gray600:     "#4B5563",
  gray700:     "#374151",
  gray900:     "#111827",
  white:       "#FFFFFF",
};

// ─── status map ───────────────────────────────────────────────────────────────
const STATUS = {
  Pending:   { color: T.amber,  bg: T.amberLight, border: T.amberMid,  label: "PENDING"   },
  Completed: { color: T.green,  bg: T.greenLight, border: "#A7F3D0",   label: "COMPLETED" },
  Cancelled: { color: T.red,    bg: T.redLight,   border: "#FECACA",   label: "CANCELLED" },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};
const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes orb-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes orb-pop {
    0%   { transform: scale(.92); opacity: 0; }
    60%  { transform: scale(1.03);            }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes orb-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(13,148,136,.4); }
    70%  { box-shadow: 0 0 0 10px rgba(13,148,136,0); }
    100% { box-shadow: 0 0 0 0 rgba(13,148,136,0);   }
  }
  @keyframes orb-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  .orb-root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .orb-mono   { font-family: 'DM Mono', monospace !important; }

  .orb-card {
    background: ${T.white};
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08);
    animation: orb-fadeUp .38s cubic-bezier(.22,1,.36,1) both;
    transition: box-shadow .2s, transform .2s;
  }
  .orb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(13,148,136,.15);
    transform: translateY(-2px);
  }

  .orb-field-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase;
    color: ${T.gray400}; margin-bottom: 3px;
  }
  .orb-field-value {
    font-size: 14px; font-weight: 600; color: ${T.gray900};
  }

  .orb-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 11px; border-radius: 99px;
    font-size: 11px; font-weight: 700; letter-spacing: .05em;
  }
  .orb-badge-dot {
    width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0;
  }

  .orb-divider { height: 1px; background: ${T.gray100}; margin: 14px 0; }

  .orb-tag {
    display: inline-block; padding: 2px 10px; border-radius: 6px;
    font-size: 12px; font-weight: 700;
  }

  .orb-summary-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 10px;
    border: 1px solid ${T.gray200}; background: ${T.white};
    flex: 1 1 110px;
  }

  /* items table */
  .orb-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orb-table th {
    text-align: left; padding: 7px 10px;
    font-size: 10px; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: ${T.gray400};
    background: ${T.gray50}; border-bottom: 1px solid ${T.gray200};
  }
  .orb-table td {
    padding: 9px 10px; border-bottom: 1px solid ${T.gray100};
    color: ${T.gray700}; vertical-align: middle;
  }
  .orb-table tr:last-child td { border-bottom: none; }
  .orb-table tr:hover td { background: ${T.tealLight}; }

  /* toggle button */
  .orb-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 8px; border: 1px solid ${T.tealMid};
    background: ${T.tealLight}; color: ${T.tealDark};
    font-size: 12px; font-weight: 700; cursor: pointer;
    transition: background .15s, border-color .15s;
    font-family: 'Sora', sans-serif;
  }
  .orb-toggle:hover { background: ${T.tealMid}; border-color: ${T.teal}; }

  @media (max-width: 480px) {
    .orb-ids-grid    { grid-template-columns: 1fr 1fr !important; }
    .orb-dates-grid  { grid-template-columns: 1fr !important; }
    .orb-money-flex  { flex-direction: column !important; }
    .orb-summary-row { flex-direction: column !important; }
    .orb-total       { font-size: 20px !important; }
    .orb-table th, .orb-table td { padding: 6px 6px !important; font-size: 11px !important; }
  }
`;

// ─── atoms ────────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS[status] ?? { color: T.gray400, bg: T.gray100, border: T.gray200 };
  return (
    <span className="orb-badge" style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
      <span className="orb-badge-dot" style={{ background: m.color }} />
      {(status ?? "UNKNOWN").toUpperCase()}
    </span>
  );
};

const Field = ({ label, value, mono, accent }) => (
  <div>
    <div className="orb-field-label">{label}</div>
    <div className={`orb-field-value ${mono ? "orb-mono" : ""}`}
      style={{ color: accent ? T.teal : T.gray900 }}>
      {value ?? "—"}
    </div>
  </div>
);

// ─── Items Table ─────────────────────────────────────────────────────────────
const ItemsTable = ({ items }) => {
  const [open, setOpen] = useState(false);
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div className="orb-field-label" style={{ margin: 0 }}>
          📦 Order Items ({items.length})
        </div>
        <button className="orb-toggle" onClick={() => setOpen(o => !o)}>
          <span style={{ fontSize: 13 }}>{open ? "▲" : "▼"}</span>
          {open ? "Hide Items" : "Show Items"}
        </button>
      </div>

      {open && (
        <div style={{
          borderRadius: 10, overflow: "hidden",
          border: `1px solid ${T.gray200}`,
          animation: "orb-pop .25s cubic-bezier(.22,1,.36,1) both",
        }}>
          <table className="orb-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item ID</th>
                <th>Part ID</th>
                <th>Stock ID</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.orderItemId}>
                  <td style={{ color: T.gray400, fontWeight: 600 }}>{i + 1}</td>
                  <td className="orb-mono" style={{ color: T.tealDark, fontWeight: 700 }}>#{item.orderItemId}</td>
                  <td className="orb-mono">#{item.partId}</td>
                  <td className="orb-mono">#{item.stockId}</td>
                  <td>
                    <span style={{
                      display: "inline-block", padding: "1px 8px", borderRadius: 5,
                      background: T.tealLight, color: T.tealDark,
                      fontWeight: 700, fontSize: 12,
                    }}>{item.quantity}</span>
                  </td>
                  <td className="orb-mono">{fmtMoney(item.unitPrice)}</td>
                  <td className="orb-mono" style={{ fontWeight: 700, color: T.gray900 }}>
                    {fmtMoney(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} style={{
                  padding: "8px 10px", textAlign: "right",
                  fontSize: 11, fontWeight: 700, letterSpacing: ".07em",
                  color: T.gray400, textTransform: "uppercase",
                  background: T.gray50, borderTop: `1px solid ${T.gray200}`,
                }}>
                  Items Subtotal
                </td>
                <td className="orb-mono" style={{
                  padding: "8px 10px", fontWeight: 800, color: T.teal,
                  background: T.gray50, borderTop: `1px solid ${T.gray200}`,
                }}>
                  {fmtMoney(items.reduce((s, it) => s + it.totalPrice, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard = ({ record, index = 0, isCompleteResult = false }) => {
  const {
    orderId, customerId, deliveryUserId, paymentMethod,
    totalAmount, serviceId, servicePrice, address,
    completedAt, createdAt, orderStatus, items,
  } = record;

  const headerGrad = isCompleteResult
    ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
    : "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)";

  return (
    <div className="orb-card" style={{ animationDelay: `${index * 90}ms` }}>

      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
        padding: "16px 22px",
        background: headerGrad,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: "rgba(255,255,255,.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
            animation: isCompleteResult ? "orb-pulse 1.8s ease-out 1" : "none",
          }}>
            {isCompleteResult ? "✅" : "🚚"}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {isCompleteResult ? "ORDER COMPLETED" : "DELIVERY ORDER"}
            </div>
            <div className="orb-mono" style={{ fontSize: 20, fontWeight: 700, color: T.white }}>
              #{orderId}
            </div>
          </div>
        </div>
        <StatusBadge status={orderStatus} />
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>

        {/* address */}
        {address && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: T.tealLight, borderLeft: `3px solid ${T.teal}`,
            borderRadius: "0 10px 10px 0", padding: "10px 14px",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }}>📍</span>
            <span style={{ fontSize: 14, color: T.tealDark, fontWeight: 600 }}>{address}</span>
          </div>
        )}

        <div className="orb-divider" />

        {/* IDs grid */}
        <div className="orb-ids-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px 20px",
          marginBottom: 16,
        }}>
          <Field label="👤 Customer ID"  value={`#${customerId}`}      mono />
          <Field label="🚴 Delivery Guy" value={`#${deliveryUserId}`}  mono />
          <Field label="🗂️ Service ID"   value={`#${serviceId}`}       mono />
        </div>

        <div className="orb-divider" />

        {/* money row */}
        <div className="orb-money-flex" style={{
          display: "flex", alignItems: "center",
          flexWrap: "wrap", gap: "12px 28px",
          marginBottom: 16,
        }}>
          <div>
            <div className="orb-field-label">💳 Payment Method</div>
            <span className="orb-tag" style={{
              background: T.tealLight, color: T.tealDark,
              border: `1px solid ${T.tealMid}`, marginTop: 4,
            }}>{paymentMethod}</span>
          </div>

          <div>
            <div className="orb-field-label">🏷️ Service Price</div>
            <div className="orb-mono orb-field-value" style={{ marginTop: 4 }}>{fmtMoney(servicePrice)}</div>
          </div>

          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div className="orb-field-label">TOTAL AMOUNT</div>
            <div className="orb-mono orb-total" style={{
              fontSize: 26, fontWeight: 800, color: T.teal, marginTop: 2,
            }}>{fmtMoney(totalAmount)}</div>
          </div>
        </div>

        <div className="orb-divider" />

        {/* items table */}
        <div style={{ marginBottom: 16 }}>
          <ItemsTable items={items} />
        </div>

        <div className="orb-divider" />

        {/* dates */}
        <div className="orb-dates-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px 20px",
        }}>
          <Field label="✅ Completed At" value={fmtDate(completedAt) ?? "Not yet"} />
          <Field label="🕐 Created At"   value={fmtDate(createdAt)} accent />
        </div>

      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip = ({ records }) => {
  const counts = records.reduce((acc, r) => {
    acc[r.orderStatus] = (acc[r.orderStatus] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",     value: records.length,        color: T.teal,  bg: T.tealLight  },
    { label: "Pending",   value: counts.Pending   ?? 0, color: T.amber, bg: T.amberLight },
    { label: "Completed", value: counts.Completed ?? 0, color: T.green, bg: T.greenLight },
    { label: "Cancelled", value: counts.Cancelled ?? 0, color: T.red,   bg: T.redLight   },
  ];

  return (
    <div className="orb-summary-row" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}>
      {pills.map(({ label, value, color, bg }) => (
        <div key={label} className="orb-summary-pill" style={{ borderColor: `${color}30`, background: bg }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color,
          }}>{value}</div>
          <div>
            <div style={{ fontSize: 11, color: T.gray400, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 13, color, fontWeight: 700 }}>order{value !== 1 ? "s" : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div style={{
    padding: "36px 24px", borderRadius: 14,
    border: `2px dashed ${T.gray200}`,
    textAlign: "center", color: T.gray400,
    animation: "orb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.gray600 }}>No orders found</div>
    <div style={{ fontSize: 13, marginTop: 4 }}>Try a different status filter</div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error", "message", "success"].includes(k));

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: "1px solid #FECACA",
      animation: "orb-pop .35s cubic-bezier(.22,1,.36,1) both",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 20px",
        background: "linear-gradient(135deg, #991B1B 0%, #DC2626 100%)",
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "rgba(255,255,255,.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, flexShrink: 0,
        }}>⚠️</div>
        <div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
            REQUEST FAILED
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>
            Action Could Not Be Completed
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 20px", background: T.redLight }}>
        {message && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#FEE2E2", border: "1px solid #FECACA",
            borderLeft: `3px solid ${T.red}`,
            borderRadius: "0 8px 8px 0",
            padding: "10px 14px", marginBottom: hasExtra ? 14 : 0,
          }}>
            <span style={{ fontSize: 14, marginTop: 1, flexShrink: 0 }}>🔴</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#7F1D1D", lineHeight: 1.5 }}>
              {message}
            </span>
          </div>
        )}
        {hasExtra && (
          <pre style={{
            margin: 0, fontSize: 11, color: "#7F1D1D",
            fontFamily: "'DM Mono', monospace",
            whiteSpace: "pre-wrap", wordBreak: "break-word",
            background: "#FEE2E2", borderRadius: 8, padding: "10px 14px",
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const OrderResultBox = ({ data }) => {
  if (data === null || data === undefined) return null;

  const isError =
    typeof data === "object" && !Array.isArray(data) &&
    (
      data.success === false ||
      data.error !== undefined ||
      (data.status && data.status >= 400) ||
      (data.message !== undefined && data.orderId === undefined)
    );

  const isSingleRecord =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data.orderId !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="orb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError && <ErrorCard data={data} />}

      {isSingleRecord && (
        <OrderCard
          record={data}
          index={0}
          isCompleteResult={data.orderStatus === "Completed"}
        />
      )}

      {isArray && data.length === 0 && <EmptyState />}

      {isArray && data.length > 0 && (
        <>
          <SummaryStrip records={data} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.map((r, i) => (
              <OrderCard key={r.orderId} record={r} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderResultBox;