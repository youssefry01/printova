/**
 * RoleResultBox.jsx
 * Result renderer for all role-related API responses.
 *
 * Handles:
 *  • Array of roles     → role grid cards (Get All Roles)
 *  • Single role object → single role card (Get By ID / Add Role)
 *  • User roles object  → user + roles display (Get User Roles)
 *  • { message: "..." } → success toast card
 *  • Plain string       → success toast card (Remove User Role)
 *  • Error              → ErrorCard
 *  • null               → nothing
 */

import React from "react";

// ─── design tokens ────────────────────────────────────────────────────────────
const T = {
  slate:       "#475569",
  slateLight:  "#F8FAFC",
  slateMid:    "#E2E8F0",
  slateDark:   "#1E293B",
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

// ─── role palette (same as UserResultBox for consistency) ─────────────────────
const ROLE_PALETTE = {
  ADMIN:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "👑", grad: "linear-gradient(135deg,#991B1B,#DC2626)" },
  MANAGER:    { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "🏢", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" },
  TECHNICIAN: { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD", icon: "🔧", grad: "linear-gradient(135deg,#075985,#0284C7)" },
  DELIVERY:   { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "🚚", grad: "linear-gradient(135deg,#92400E,#D97706)" },
  CUSTOMER:   { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "👤", grad: "linear-gradient(135deg,#065F46,#059669)" },
};
const fallbackPalette = { color: T.slate, bg: T.slateLight, border: T.slateMid, icon: "🔖", grad: "linear-gradient(135deg,#334155,#475569)" };
const rp = (name) => ROLE_PALETTE[name?.toUpperCase()] ?? fallbackPalette;

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes rlb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes rlb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes rlb-check {
    0%   { stroke-dashoffset: 40; }
    100% { stroke-dashoffset: 0;  }
  }

  .rlb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .rlb-mono   { font-family:'DM Mono',monospace !important; }

  .rlb-card {
    background:${T.white};
    border-radius:16px;
    overflow:hidden;
    box-shadow:0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08);
    animation:rlb-up .35s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .2s,transform .2s;
  }
  .rlb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(71,85,105,.15);
    transform:translateY(-2px);
  }

  /* role pill card in grid */
  .rlb-role-pill {
    display:flex; align-items:center; gap:14px;
    padding:14px 18px;
    background:${T.white};
    border-radius:14px;
    box-shadow:0 1px 3px rgba(0,0,0,.07),0 6px 16px rgba(0,0,0,.07);
    animation:rlb-up .32s cubic-bezier(.22,1,.36,1) both;
    transition:box-shadow .18s,transform .18s;
    border-left:4px solid transparent;
  }
  .rlb-role-pill:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 14px 32px rgba(0,0,0,.1);
    transform:translateY(-2px);
  }

  .rlb-field-label {
    font-size:10px; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase;
    color:${T.gray400}; margin-bottom:3px;
  }
  .rlb-field-value { font-size:14px; font-weight:600; color:${T.gray900}; }

  .rlb-divider { height:1px; background:${T.gray100}; margin:14px 0; }

  .rlb-role-badge {
    display:inline-flex; align-items:center; gap:5px;
    padding:3px 10px; border-radius:99px;
    font-size:11px; font-weight:700; letter-spacing:.05em;
  }

  .rlb-success-icon circle { animation:rlb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .rlb-success-icon path   {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:rlb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  @media (max-width:480px) {
    .rlb-role-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Role Badge inline ────────────────────────────────────────────────────────
const RoleBadge = ({ name }) => {
  const p = rp(name);
  return (
    <span className="rlb-role-badge" style={{ color:p.color, background:p.bg, border:`1px solid ${p.border}` }}>
      {p.icon} {name}
    </span>
  );
};

// ─── Single Role Card ─────────────────────────────────────────────────────────
const SingleRoleCard = ({ role }) => {
  const { roleId, roleName } = role;
  const p = rp(roleName);
  return (
    <div className="rlb-card">
      <div style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 22px", background:p.grad }}>
        <div style={{
          width:46, height:46, borderRadius:12,
          background:"rgba(255,255,255,.18)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:22, flexShrink:0,
        }}>{p.icon}</div>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", fontWeight:700, letterSpacing:".08em" }}>ROLE</div>
          <div style={{ fontSize:20, fontWeight:800, color:T.white }}>{roleName}</div>
        </div>
        <div className="rlb-mono" style={{ marginLeft:"auto", fontSize:13, color:"rgba(255,255,255,.55)" }}>
          ID #{roleId}
        </div>
      </div>
      <div style={{ padding:"14px 22px" }}>
        <div style={{ display:"flex", gap:"20px 32px", flexWrap:"wrap" }}>
          <div>
            <div className="rlb-field-label">Role ID</div>
            <div className="rlb-field-value rlb-mono">#{roleId}</div>
          </div>
          <div>
            <div className="rlb-field-label">Role Name</div>
            <RoleBadge name={roleName} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Role Grid (Get All) ──────────────────────────────────────────────────────
const RoleGrid = ({ roles }) => (
  <>
    <div style={{ marginBottom:14, display:"flex", alignItems:"center", gap:8 }}>
      <div style={{
        display:"inline-flex", alignItems:"center", gap:6,
        padding:"4px 12px", borderRadius:99,
        background:T.slateLight, border:`1px solid ${T.slateMid}`,
        fontSize:12, fontWeight:700, color:T.slate,
      }}>
        🔖 {roles.length} role{roles.length !== 1 ? "s" : ""} in system
      </div>
    </div>
    <div className="rlb-role-grid" style={{
      display:"grid",
      gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))",
      gap:12,
    }}>
      {roles.map((r, i) => {
        const p = rp(r.roleName);
        return (
          <div key={r.roleId} className="rlb-role-pill"
            style={{ borderLeftColor:p.color, animationDelay:`${i * 50}ms` }}>
            <div style={{
              width:40, height:40, borderRadius:10,
              background:p.bg, border:`1px solid ${p.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:20, flexShrink:0,
            }}>{p.icon}</div>
            <div>
              <div className="rlb-mono" style={{ fontSize:11, color:T.gray400, marginBottom:2 }}>#{r.roleId}</div>
              <div style={{ fontSize:14, fontWeight:700, color:p.color }}>{r.roleName}</div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

// ─── User Roles Card ──────────────────────────────────────────────────────────
const UserRolesCard = ({ data }) => {
  const { userId, email, roles } = data;
  return (
    <div className="rlb-card">
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexWrap:"wrap", gap:10, padding:"16px 22px",
        background:"linear-gradient(135deg, #1E293B 0%, #475569 100%)",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"rgba(255,255,255,.15)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:20, flexShrink:0,
          }}>🛡️</div>
          <div>
            <div style={{ fontSize:11, color:"rgba(255,255,255,.6)", fontWeight:700, letterSpacing:".08em" }}>USER ROLES</div>
            <div style={{ fontSize:16, fontWeight:700, color:T.white }}>{email}</div>
          </div>
        </div>
        <span className="rlb-mono" style={{ fontSize:13, color:"rgba(255,255,255,.5)" }}>User #{userId}</span>
      </div>
      <div style={{ padding:"16px 22px" }}>
        <div className="rlb-field-label" style={{ marginBottom:10 }}>Assigned Roles</div>
        {roles && roles.length > 0 ? (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {roles.map((r) => <RoleBadge key={r} name={r} />)}
          </div>
        ) : (
          <div style={{ fontSize:13, color:T.gray400 }}>No roles assigned</div>
        )}
      </div>
    </div>
  );
};

// ─── Success Toast Card ───────────────────────────────────────────────────────
const SuccessCard = ({ message }) => (
  <div style={{
    display:"flex", alignItems:"center", gap:14,
    padding:"14px 20px", borderRadius:14,
    background:T.greenLight, border:`1px solid ${T.greenMid}`,
    animation:"rlb-pop .35s cubic-bezier(.22,1,.36,1) both",
  }}>
    {/* animated checkmark */}
    <svg className="rlb-success-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ flexShrink:0 }}>
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke={T.green} strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div style={{ fontSize:12, fontWeight:700, color:T.green, letterSpacing:".06em", textTransform:"uppercase" }}>
        Success
      </div>
      <div style={{ fontSize:14, fontWeight:600, color:"#065F46", marginTop:2 }}>{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard = ({ data }) => {
  const message = data?.error || data?.message || null;
  const hasExtra = Object.keys(data).some(k => !["error","message","success"].includes(k));
  return (
    <div style={{ borderRadius:14, overflow:"hidden", border:"1px solid #FECACA", animation:"rlb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
      <div style={{
        display:"flex", alignItems:"center", gap:12, padding:"14px 20px",
        background:"linear-gradient(135deg,#991B1B,#DC2626)",
      }}>
        <div style={{
          width:38, height:38, borderRadius:10, background:"rgba(255,255,255,.18)",
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0,
        }}>⚠️</div>
        <div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,.65)", fontWeight:700, letterSpacing:".08em" }}>REQUEST FAILED</div>
          <div style={{ fontSize:16, fontWeight:700, color:T.white }}>Action Could Not Be Completed</div>
        </div>
      </div>
      <div style={{ padding:"16px 20px", background:T.redLight }}>
        {message && (
          <div style={{
            display:"flex", alignItems:"flex-start", gap:10,
            background:"#FEE2E2", border:"1px solid #FECACA",
            borderLeft:`3px solid ${T.red}`, borderRadius:"0 8px 8px 0",
            padding:"10px 14px", marginBottom: hasExtra ? 14 : 0,
          }}>
            <span style={{ fontSize:14, marginTop:1, flexShrink:0 }}>🔴</span>
            <span style={{ fontSize:14, fontWeight:600, color:"#7F1D1D", lineHeight:1.5 }}>{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre style={{
            margin:0, fontSize:11, color:"#7F1D1D", fontFamily:"'DM Mono',monospace",
            whiteSpace:"pre-wrap", wordBreak:"break-word",
            background:"#FEE2E2", borderRadius:8, padding:"10px 14px",
          }}>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const RoleResultBox = ({ data }) => {
  if (data === null || data === undefined) return null;

  // plain string → success (e.g. "Role removed successfully")
  if (typeof data === "string") {
    return (
      <div className="rlb-root" style={{ marginTop:16 }}>
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj = typeof data === "object" && !Array.isArray(data);

  // error detection — never flag plain success messages as errors
  const isError = isObj && (
    data.success === false ||
    data.error !== undefined ||
    (data.status && data.status >= 400)
  );

  // { message: "Role added successfully" }
  const isSuccessMsg = isObj && !isError && data.message !== undefined && data.roleId === undefined && data.userId === undefined;

  // { userId, email, roles: [...] }
  const isUserRoles = isObj && !isError && data.userId !== undefined && data.roles !== undefined;

  // single role { roleId, roleName }
  const isSingleRole = isObj && !isError && data.roleId !== undefined && data.roleName !== undefined;

  // array of roles
  const isArray = Array.isArray(data);

  return (
    <div className="rlb-root" style={{ marginTop:16 }}>
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data} />}
      {isSuccessMsg && <SuccessCard message={data.message} />}
      {isUserRoles  && <UserRolesCard data={data} />}
      {isSingleRole && <SingleRoleCard role={data} />}

      {isArray && data.length === 0 && (
        <div style={{
          padding:"28px 20px", borderRadius:14, border:`2px dashed ${T.gray200}`,
          textAlign:"center", color:T.gray400, animation:"rlb-pop .35s ease both",
        }}>
          <div style={{ fontSize:32, marginBottom:8 }}>🔖</div>
          <div style={{ fontSize:14, fontWeight:600, color:T.gray600 }}>No roles found</div>
        </div>
      )}

      {isArray && data.length > 0 && <RoleGrid roles={data} />}
    </div>
  );
};

export default RoleResultBox;