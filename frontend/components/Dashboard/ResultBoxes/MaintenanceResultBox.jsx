/**
 * MaintenanceResultBox.jsx
 * Universal result renderer for maintenance API responses.
 *
 * Handles:
 *  • Array  → list of MaintenanceCard (Get All Technician Maintenances)
 *  • Object → single MaintenanceCard   (Complete Maintenance)
 *  • Error  → ErrorCard
 *  • null   → nothing
 */

import React from "react";

// ─── tokens ──────────────────────────────────────────────────────────────────
const T = {
  blue:       "#1D4ED8",
  blueLight:  "#EFF6FF",
  blueMid:    "#DBEAFE",
  navyDark:   "#1E3A8A",
  green:      "#059669",
  greenLight: "#ECFDF5",
  red:        "#DC2626",
  redLight:   "#FEF2F2",
  amber:      "#D97706",
  amberLight: "#FFFBEB",
  gray50:     "#F9FAFB",
  gray100:    "#F3F4F6",
  gray200:    "#E5E7EB",
  gray400:    "#9CA3AF",
  gray600:    "#4B5563",
  gray700:    "#374151",
  gray900:    "#111827",
  white:      "#FFFFFF",
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

const STATUS = {
  Scheduled: { color: T.blue,  bg: T.blueLight,  border: T.blueMid,   icon: "◷" },
  Completed: { color: T.green, bg: T.greenLight,  border: "#A7F3D0",   icon: "✓" },
  Cancelled: { color: T.red,   bg: T.redLight,    border: "#FECACA",   icon: "✕" },
};

// ─── tiny atoms ──────────────────────────────────────────────────────────────
const css = String.raw; // for syntax highlighting in editors

const GLOBAL_CSS = css`
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes rb-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes rb-pop {
    0%   { transform: scale(.92); opacity: 0; }
    60%  { transform: scale(1.03);            }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes rb-pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(29,78,216,.35); }
    70%  { box-shadow: 0 0 0 10px rgba(29,78,216,0); }
    100% { box-shadow: 0 0 0 0 rgba(29,78,216,0);   }
  }

  .rb-root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .rb-mono   { font-family: 'DM Mono', monospace; }

  .rb-card {
    background: ${T.white};
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08);
    animation: rb-fadeUp .38s cubic-bezier(.22,1,.36,1) both;
    transition: box-shadow .2s, transform .2s;
  }
  .rb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(29,78,216,.14);
    transform: translateY(-2px);
  }

  .rb-field-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .09em;
    text-transform: uppercase;
    color: ${T.gray400};
    margin-bottom: 3px;
  }
  .rb-field-value {
    font-size: 14px;
    font-weight: 600;
    color: ${T.gray900};
  }

  .rb-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 11px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .05em;
  }
  .rb-chip-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .rb-divider {
    height: 1px;
    background: ${T.gray100};
    margin: 14px 0;
  }

  .rb-summary-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid ${T.gray200};
    background: ${T.white};
    flex: 1 1 110px;
  }

  .rb-tag {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
  }

  @media (max-width: 480px) {
    .rb-people-grid  { grid-template-columns: 1fr 1fr !important; }
    .rb-dates-grid   { grid-template-columns: 1fr !important; }
    .rb-money-flex   { flex-direction: column !important; }
    .rb-summary-row  { flex-direction: column !important; }
    .rb-total-amount { font-size: 20px !important; }
  }
`;

// ─── Badge ───────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const m = STATUS[status] ?? { color: T.gray400, bg: T.gray100, border: T.gray200, icon: "?" };
  return (
    <span className="rb-chip" style={{
      color: m.color, background: m.bg,
      border: `1px solid ${m.border}`,
    }}>
      <span className="rb-chip-dot" style={{ background: m.color }} />
      {status?.toUpperCase() ?? "UNKNOWN"}
    </span>
  );
};

// ─── Field ───────────────────────────────────────────────────────────────────
const Field = ({ label, value, mono, accent }) => (
  <div>
    <div className="rb-field-label">{label}</div>
    <div className={`rb-field-value ${mono ? "rb-mono" : ""}`}
      style={{ color: accent ? T.blue : T.gray900 }}>
      {value ?? "—"}
    </div>
  </div>
);

// ─── MaintenanceCard ─────────────────────────────────────────────────────────
const MaintenanceCard = ({ record, index = 0, isCompleteResult = false }) => {
  const {
    maintenanceId, customerId, technicianUserId, paymentMethod,
    totalAmount, serviceId, servicePrice, address, description,
    date, completedAt, createdAt, maintenanceStatus,
  } = record;

  const headerGrad = isCompleteResult
    ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
    : "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)";

  return (
    <div className="rb-card" style={{ animationDelay: `${index * 90}ms` }}>

      {/* ── header ── */}
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
            animation: isCompleteResult ? "rb-pulse-ring 1.8s ease-out 1" : "none",
          }}>
            {isCompleteResult ? "✅" : "🔧"}
          </div>
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {isCompleteResult ? "COMPLETED MAINTENANCE" : "MAINTENANCE REQUEST"}
            </div>
            <div className="rb-mono" style={{ fontSize: 20, fontWeight: 700, color: T.white }}>
              #{maintenanceId}
            </div>
          </div>
        </div>
        <StatusBadge status={maintenanceStatus} />
      </div>

      {/* ── body ── */}
      <div style={{ padding: "18px 22px" }}>

        {/* description */}
        {description && (
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            background: T.gray50, borderLeft: `3px solid ${T.blue}`,
            borderRadius: "0 10px 10px 0", padding: "10px 14px",
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0 }}>💬</span>
            <p style={{ margin: 0, fontSize: 14, color: T.gray700, lineHeight: 1.65 }}>{description}</p>
          </div>
        )}

        {/* address */}
        {address && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 8,
            marginBottom: 16,
          }}>
            <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>📍</span>
            <span style={{ fontSize: 14, color: T.gray600 }}>{address}</span>
          </div>
        )}

        <div className="rb-divider" />

        {/* IDs grid */}
        <div className="rb-people-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px 20px",
          marginBottom: 16,
        }}>
          <Field label="👤 Customer ID"   value={`#${customerId}`}       mono />
          <Field label="🛠️ Technician ID" value={`#${technicianUserId}`} mono />
          <Field label="🗂️ Service ID"    value={`#${serviceId}`}        mono />
        </div>

        <div className="rb-divider" />

        {/* money row */}
        <div className="rb-money-flex" style={{
          display: "flex", alignItems: "center",
          flexWrap: "wrap", gap: "12px 28px",
          marginBottom: 16,
        }}>
          {/* payment method */}
          <div>
            <div className="rb-field-label">💳 Payment Method</div>
            <span className="rb-tag" style={{
              background: T.greenLight, color: T.green,
              border: `1px solid #A7F3D0`, marginTop: 4,
            }}>{paymentMethod}</span>
          </div>

          {/* service price */}
          <div>
            <div className="rb-field-label">🏷️ Service Price</div>
            <div className="rb-mono rb-field-value" style={{ marginTop: 4 }}>{fmtMoney(servicePrice)}</div>
          </div>

          {/* total – pushed right */}
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <div className="rb-field-label">TOTAL AMOUNT</div>
            <div className="rb-mono rb-total-amount" style={{
              fontSize: 26, fontWeight: 800, color: T.blue,
              marginTop: 2,
            }}>{fmtMoney(totalAmount)}</div>
          </div>
        </div>

        <div className="rb-divider" />

        {/* dates */}
        <div className="rb-dates-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px 20px",
        }}>
          <Field label="📅 Scheduled For" value={fmtDate(date)}        accent />
          <Field label="✅ Completed At"  value={fmtDate(completedAt) ?? "Not yet"} />
          <Field label="🕐 Created At"    value={fmtDate(createdAt)} />
        </div>

      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip = ({ records }) => {
  const counts = records.reduce((acc, r) => {
    acc[r.maintenanceStatus] = (acc[r.maintenanceStatus] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",     value: records.length,          color: T.blue,  bg: T.blueLight  },
    { label: "Scheduled", value: counts.Scheduled ?? 0,   color: T.blue,  bg: T.blueLight  },
    { label: "Completed", value: counts.Completed ?? 0,   color: T.green, bg: T.greenLight },
    { label: "Cancelled", value: counts.Cancelled ?? 0,   color: T.red,   bg: T.redLight   },
  ];

  return (
    <div className="rb-summary-row" style={{
      display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18,
    }}>
      {pills.map(({ label, value, color, bg }) => (
        <div key={label} className="rb-summary-pill" style={{ borderColor: `${color}30`, background: bg }}>
          <div style={{
            width: 36, height: 36, borderRadius: 9,
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 16, color,
          }}>{value}</div>
          <div>
            <div style={{ fontSize: 11, color: T.gray400, fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 13, color, fontWeight: 700 }}>record{value !== 1 ? "s" : ""}</div>
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
    animation: "rb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.gray600 }}>No results found</div>
    <div style={{ fontSize: 13, marginTop: 4 }}>Try a different status filter</div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  // pull out a human-readable message if available
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => k !== "error" && k !== "message" && k !== "success");

  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: `1px solid #FECACA`,
      animation: "rb-pop .35s cubic-bezier(.22,1,.36,1) both",
    }}>
      {/* red header */}
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

      {/* body */}
      <div style={{ padding: "16px 20px", background: T.redLight }}>
        {message && (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 10,
            background: "#FEE2E2", border: `1px solid #FECACA`,
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

        {/* only show raw JSON dump if there are extra unknown fields */}
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
const MaintenanceResultBox = ({ data }) => {
  if (data === null || data === undefined) return null;

  // detect error shape: { success: false }, { error: "..." }, HTTP error status, or stray message
  const isError =
    (typeof data === "object" && !Array.isArray(data)) &&
    (
      data.success === false ||
      data.error !== undefined ||
      (data.status && data.status >= 400) ||
      (data.message !== undefined && data.maintenanceId === undefined)
    );

  // detect single completed maintenance
  const isSingleRecord =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data.maintenanceId !== undefined;

  // detect array
  const isArray = Array.isArray(data);

  return (
    <div className="rb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError && <ErrorCard data={data} />}

      {isSingleRecord && (
        <MaintenanceCard record={data} index={0} isCompleteResult={data.maintenanceStatus === "Completed"} />
      )}

      {isArray && data.length === 0 && <EmptyState />}

      {isArray && data.length > 0 && (
        <>
          <SummaryStrip records={data} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.map((r, i) => (
              <MaintenanceCard key={r.maintenanceId} record={r} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenanceResultBox;