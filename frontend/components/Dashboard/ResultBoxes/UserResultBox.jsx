/**
 * UserResultBox.jsx
 * Result renderer for user API responses.
 *
 * Handles:
 *  • Array  → summary strip + user grid cards (Get All Users)
 *  • Object → single user card (Get By ID / Update)
 *  • Error  → ErrorCard ({ success:false, error:"..." } or HTTP error)
 *  • null   → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  indigo:       "#4F46E5",
  indigoLight:  "#EEF2FF",
  indigoMid:    "#C7D2FE",
  indigoDark:   "#3730A3",
  violet:       "#7C3AED",
  violetLight:  "#F5F3FF",
  green:        "#059669",
  greenLight:   "#ECFDF5",
  amber:        "#D97706",
  amberLight:   "#FFFBEB",
  sky:          "#0284C7",
  skyLight:     "#F0F9FF",
  pink:         "#DB2777",
  pinkLight:    "#FDF2F8",
  red:          "#DC2626",
  redLight:     "#FEF2F2",
  gray50:       "#F9FAFB",
  gray100:      "#F3F4F6",
  gray200:      "#E5E7EB",
  gray400:      "#9CA3AF",
  gray500:      "#6B7280",
  gray600:      "#4B5563",
  gray700:      "#374151",
  gray900:      "#111827",
  white:        "#FFFFFF",
};

// ─── role styling ─────────────────────────────────────────────────────────────
const ROLE_META = {
  ADMIN:      { color: T.red,    bg: "#FEF2F2", border: "#FECACA", icon: "👑" },
  MANAGER:    { color: T.violet, bg: T.violetLight, border: "#DDD6FE", icon: "🏢" },
  TECHNICIAN: { color: T.sky,    bg: T.skyLight,    border: "#BAE6FD", icon: "🔧" },
  DELIVERY:   { color: T.amber,  bg: T.amberLight,  border: "#FDE68A", icon: "🚚" },
  CUSTOMER:   { color: T.green,  bg: T.greenLight,  border: "#A7F3D0", icon: "👤" },
};

// avatar gradient per role
const AVATAR_GRAD = {
  ADMIN:      "linear-gradient(135deg, #991B1B, #DC2626)",
  MANAGER:    "linear-gradient(135deg, #5B21B6, #7C3AED)",
  TECHNICIAN: "linear-gradient(135deg, #075985, #0284C7)",
  DELIVERY:   "linear-gradient(135deg, #92400E, #D97706)",
  CUSTOMER:   "linear-gradient(135deg, #065F46, #059669)",
};

const getRoleName = (roles) => roles?.[0]?.roleName ?? "UNKNOWN";

// ─── helpers ─────────────────────────────────────────────────────────────────
const initials = (first, last) =>
  `${(first?.[0] ?? "").toUpperCase()}${(last?.[0] ?? "").toUpperCase()}`;

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes urb-fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes urb-pop {
    0%   { transform: scale(.92); opacity: 0; }
    60%  { transform: scale(1.03);            }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes urb-fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .urb-root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .urb-mono   { font-family: 'DM Mono', monospace !important; }

  /* single card */
  .urb-card {
    background: ${T.white};
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08);
    animation: urb-fadeUp .38s cubic-bezier(.22,1,.36,1) both;
    transition: box-shadow .2s, transform .2s;
  }
  .urb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(79,70,229,.14);
    transform: translateY(-2px);
  }

  /* grid mini card */
  .urb-mini-card {
    background: ${T.white};
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,.07), 0 6px 18px rgba(0,0,0,.07);
    animation: urb-fadeUp .35s cubic-bezier(.22,1,.36,1) both;
    transition: box-shadow .18s, transform .18s;
    display: flex;
    flex-direction: column;
  }
  .urb-mini-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 16px 36px rgba(79,70,229,.15);
    transform: translateY(-3px);
  }

  .urb-field-label {
    font-size: 10px; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase;
    color: ${T.gray400}; margin-bottom: 3px;
  }
  .urb-field-value {
    font-size: 14px; font-weight: 600; color: ${T.gray900};
  }

  .urb-role-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 99px;
    font-size: 11px; font-weight: 700; letter-spacing: .05em;
  }

  .urb-divider { height: 1px; background: ${T.gray100}; margin: 14px 0; }

  .urb-summary-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: 10px;
    border: 1px solid ${T.gray200}; background: ${T.white};
    flex: 1 1 100px;
  }

  .urb-user-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }

  @media (max-width: 480px) {
    .urb-user-grid      { grid-template-columns: 1fr !important; }
    .urb-detail-grid    { grid-template-columns: 1fr 1fr !important; }
    .urb-summary-row    { flex-direction: column !important; }
  }
`;

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ roleName }) => {
  const m = ROLE_META[roleName] ?? { color: T.gray500, bg: T.gray100, border: T.gray200, icon: "?" };
  return (
    <span className="urb-role-badge" style={{ color: m.color, background: m.bg, border: `1px solid ${m.border}` }}>
      {m.icon} {roleName}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ firstName, lastName, roleName, size = 52 }) => {
  const grad = AVATAR_GRAD[roleName] ?? "linear-gradient(135deg, #374151, #111827)";
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.28,
      background: grad,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 800, color: T.white,
      flexShrink: 0, letterSpacing: ".02em",
      boxShadow: "0 2px 8px rgba(0,0,0,.2)",
    }}>
      {initials(firstName, lastName)}
    </div>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field = ({ label, value, mono }) => (
  <div>
    <div className="urb-field-label">{label}</div>
    <div className={`urb-field-value ${mono ? "urb-mono" : ""}`}>{value ?? "—"}</div>
  </div>
);

// ─── Single / Detail User Card ────────────────────────────────────────────────
const UserCard = ({ user, isUpdate = false }) => {
  const { id, firstName, lastName, email, phone, address, roles } = user;
  const roleName = getRoleName(roles);
  const m = ROLE_META[roleName] ?? { color: T.indigo, bg: T.indigoLight };
  const headerGrad = isUpdate
    ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
    : `linear-gradient(135deg, ${T.indigoDark} 0%, ${T.indigo} 100%)`;

  return (
    <div className="urb-card">
      {/* header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 10,
        padding: "16px 22px",
        background: headerGrad,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar firstName={firstName} lastName={lastName} roleName={roleName} size={48} />
          <div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,.65)", fontWeight: 700, letterSpacing: ".08em" }}>
              {isUpdate ? "USER UPDATED" : "USER PROFILE"}
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.white, lineHeight: 1.2 }}>
              {firstName} {lastName}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <RoleBadge roleName={roleName} />
          <span className="urb-mono" style={{ fontSize: 12, color: "rgba(255,255,255,.55)", fontWeight: 500 }}>
            ID #{id}
          </span>
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "18px 22px" }}>
        <div className="urb-detail-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "14px 20px",
        }}>
          <Field label="✉️ Email"   value={email} />
          <Field label="📞 Phone"   value={phone} mono />
          <Field label="📍 Address" value={address} />
        </div>
      </div>
    </div>
  );
};

// ─── Mini User Card (for grid) ────────────────────────────────────────────────
const MiniUserCard = ({ user, index }) => {
  const { id, firstName, lastName, email, phone, address, roles } = user;
  const roleName = getRoleName(roles);
  const m = ROLE_META[roleName] ?? { color: T.gray500, bg: T.gray100, border: T.gray200, icon: "?" };
  const grad = AVATAR_GRAD[roleName] ?? "linear-gradient(135deg, #374151, #111827)";

  return (
    <div className="urb-mini-card" style={{ animationDelay: `${index * 40}ms` }}>
      {/* colored top strip */}
      <div style={{ height: 5, background: grad }} />

      <div style={{ padding: "14px 16px", flex: 1 }}>
        {/* avatar + name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Avatar firstName={firstName} lastName={lastName} roleName={roleName} size={40} />
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 14, fontWeight: 700, color: T.gray900,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {firstName} {lastName}
            </div>
            <div className="urb-mono" style={{ fontSize: 11, color: T.gray400, marginTop: 1 }}>#{id}</div>
          </div>
        </div>

        {/* role badge */}
        <div style={{ marginBottom: 12 }}>
          <RoleBadge roleName={roleName} />
        </div>

        <div className="urb-divider" style={{ margin: "10px 0" }} />

        {/* contact details */}
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>✉️</span>
            <span style={{
              fontSize: 12, color: T.gray600,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{email}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>📞</span>
            <span className="urb-mono" style={{ fontSize: 12, color: T.gray600 }}>{phone}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ fontSize: 12, flexShrink: 0 }}>📍</span>
            <span style={{ fontSize: 12, color: T.gray600 }}>{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip = ({ users }) => {
  const roleCounts = users.reduce((acc, u) => {
    const r = getRoleName(u.roles);
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",      value: users.length,             color: T.indigo, bg: T.indigoLight },
    { label: "Admins",     value: roleCounts.ADMIN      ?? 0, color: T.red,    bg: "#FEF2F2"    },
    { label: "Managers",   value: roleCounts.MANAGER    ?? 0, color: T.violet, bg: T.violetLight },
    { label: "Technicians",value: roleCounts.TECHNICIAN ?? 0, color: T.sky,    bg: T.skyLight    },
    { label: "Delivery",   value: roleCounts.DELIVERY   ?? 0, color: T.amber,  bg: T.amberLight  },
    { label: "Customers",  value: roleCounts.CUSTOMER   ?? 0, color: T.green,  bg: T.greenLight  },
  ];

  return (
    <div className="urb-summary-row" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
      {pills.map(({ label, value, color, bg }) => (
        <div key={label} className="urb-summary-pill" style={{ borderColor: `${color}30`, background: bg }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: `${color}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14, color,
            flexShrink: 0,
          }}>{value}</div>
          <div style={{ fontSize: 11, color, fontWeight: 700 }}>{label}</div>
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
    animation: "urb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    <div style={{ fontSize: 36, marginBottom: 10 }}>👥</div>
    <div style={{ fontSize: 15, fontWeight: 600, color: T.gray600 }}>No users found</div>
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
      animation: "urb-pop .35s cubic-bezier(.22,1,.36,1) both",
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
            <span style={{ fontSize: 14, fontWeight: 600, color: "#7F1D1D", lineHeight: 1.5 }}>{message}</span>
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
const UserResultBox = ({ data, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  const isError =
    typeof data === "object" && !Array.isArray(data) &&
    (
      data.success === false ||
      data.error !== undefined ||
      (data.status && data.status >= 400) ||
      (data.message !== undefined && data.id === undefined)
    );

  const isSingleUser =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    data.id !== undefined &&
    data.firstName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="urb-root" style={{ marginTop: 16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError && <ErrorCard data={data} />}

      {isSingleUser && <UserCard user={data} isUpdate={isUpdate} />}

      {isArray && data.length === 0 && <EmptyState />}

      {isArray && data.length > 0 && (
        <>
          <SummaryStrip users={data} />
          <div className="urb-user-grid">
            {data.map((u, i) => (
              <MiniUserCard key={u.id} user={u} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserResultBox;