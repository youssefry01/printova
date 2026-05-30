/**
 * RoleResultBox.tsx
 * Result renderer for all role-related API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Role {
  roleId: number | string;
  roleName: string;
}

interface UserRolesData {
  userId: number | string;
  email: string;
  roles: string[];
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

interface SuccessMessage {
  message: string;
  roleId?: undefined;
  userId?: undefined;
}

type RoleResultData = Role | Role[] | UserRolesData | ErrorData | SuccessMessage | string | null | undefined;

interface RoleResultBoxProps  { data: RoleResultData; }
interface SingleRoleCardProps { role: Role; }
interface RoleGridProps       { roles: Role[]; }
interface UserRolesCardProps  { data: UserRolesData; }
interface RoleBadgeProps      { name: string; }
interface ErrorCardProps      { data: ErrorData; }
interface SuccessCardProps    { message: string; }

// ─── role palette ─────────────────────────────────────────────────────────────
interface RolePalette { color: string; bg: string; border: string; icon: string; grad: string; }

const ROLE_PALETTE: Record<string, RolePalette> = {
  ADMIN:      { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "👑", grad: "linear-gradient(135deg,#991B1B,#DC2626)" },
  MANAGER:    { color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "🏢", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" },
  TECHNICIAN: { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD", icon: "🔧", grad: "linear-gradient(135deg,#075985,#0284C7)" },
  DELIVERY:   { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "🚚", grad: "linear-gradient(135deg,#92400E,#D97706)" },
  CUSTOMER:   { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "👤", grad: "linear-gradient(135deg,#065F46,#059669)" },
};
const fallbackPalette: RolePalette = { color: "#475569", bg: "#F8FAFC", border: "#E2E8F0", icon: "🔖", grad: "linear-gradient(135deg,#334155,#475569)" };
const rp = (name?: string): RolePalette => ROLE_PALETTE[name?.toUpperCase() ?? ""] ?? fallbackPalette;

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

  .rlb-card { animation:rlb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .rlb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(71,85,105,.15);
    transform:translateY(-2px);
  }
  .rlb-role-pill { animation:rlb-up .32s cubic-bezier(.22,1,.36,1) both; }
  .rlb-role-pill:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 14px 32px rgba(0,0,0,.1);
    transform:translateY(-2px);
  }
  .rlb-success-icon circle { animation:rlb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .rlb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:rlb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }
  .rlb-error-card  { animation:rlb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .rlb-empty-state { animation:rlb-pop .35s ease both; }
`;

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge: React.FC<RoleBadgeProps> = ({ name }) => {
  const p = rp(name);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border"
      style={{ color: p.color, background: p.bg, borderColor: p.border }}>
      {p.icon} {name}
    </span>
  );
};

// ─── Single Role Card ─────────────────────────────────────────────────────────
const SingleRoleCard: React.FC<SingleRoleCardProps> = ({ role }) => {
  const { roleId, roleName } = role;
  const p = rp(roleName);
  return (
    <div className="rlb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center gap-3.5 px-5 py-4" style={{ background: p.grad }}>
        <div className="w-11.5 h-11.5 rounded-xl bg-white/20 flex items-center justify-center text-[22px] shrink-0">{p.icon}</div>
        <div>
          <div className="text-[11px] text-white/65 font-bold tracking-widest">ROLE</div>
          <div className="text-xl font-extrabold text-white">{roleName}</div>
        </div>
        <div className="rlb-mono ml-auto text-[13px] text-white/55">ID #{roleId}</div>
      </div>
      <div className="px-5 py-3.5">
        <div className="flex gap-x-8 gap-y-3 flex-wrap">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Role ID</div>
            <div className="rlb-mono text-sm font-semibold text-gray-900">#{roleId}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">Role Name</div>
            <RoleBadge name={roleName} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Role Grid ────────────────────────────────────────────────────────────────
const RoleGrid: React.FC<RoleGridProps> = ({ roles }) => (
  <>
    <div className="flex items-center gap-2 mb-3.5">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500">
        🔖 {roles.length} role{roles.length !== 1 ? "s" : ""} in system
      </div>
    </div>
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
      {roles.map((r, i) => {
        const p = rp(r.roleName);
        return (
          <div key={r.roleId} className="rlb-role-pill flex items-center gap-3.5 px-4 py-3.5 bg-white rounded-[14px] border-l-4 transition-all duration-200 cursor-default"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,.07),0 6px 16px rgba(0,0,0,.07)", borderLeftColor: p.color, animationDelay: `${i * 50}ms` }}>
            <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-xl shrink-0 border" style={{ background: p.bg, borderColor: p.border }}>{p.icon}</div>
            <div>
              <div className="rlb-mono text-[11px] text-gray-400 mb-0.5">#{r.roleId}</div>
              <div className="text-sm font-bold" style={{ color: p.color }}>{r.roleName}</div>
            </div>
          </div>
        );
      })}
    </div>
  </>
);

// ─── User Roles Card ──────────────────────────────────────────────────────────
const UserRolesCard: React.FC<UserRolesCardProps> = ({ data }) => {
  const { userId, email, roles } = data;
  return (
    <div className="rlb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: "linear-gradient(135deg, #1E293B 0%, #475569 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center text-xl shrink-0">🛡️</div>
          <div>
            <div className="text-[11px] text-white/60 font-bold tracking-widest">USER ROLES</div>
            <div className="text-base font-bold text-white">{email}</div>
          </div>
        </div>
        <span className="rlb-mono text-[13px] text-white/50">User #{userId}</span>
      </div>
      <div className="px-5 py-4">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-2.5">Assigned Roles</div>
        {roles && roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {roles.map((r) => <RoleBadge key={r} name={r} />)}
          </div>
        ) : (
          <div className="text-[13px] text-gray-400">No roles assigned</div>
        )}
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "rlb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="rlb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke="#059669" strokeWidth="1.5" />
      <path d="M11 18.5l5 5 9-10" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Success</div>
      <div className="text-sm font-semibold text-emerald-900 mt-0.5">{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="rlb-error-card rounded-[14px] overflow-hidden border border-red-200">
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: "linear-gradient(135deg,#991B1B,#DC2626)" }}>
        <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center text-lg shrink-0">⚠️</div>
        <div>
          <div className="text-[11px] text-white/65 font-bold tracking-widest">REQUEST FAILED</div>
          <div className="text-base font-bold text-white">Action Could Not Be Completed</div>
        </div>
      </div>
      <div className="p-4 bg-red-50">
        {message && (
          <div className={`flex items-start gap-2.5 bg-red-100 border border-red-200 border-l-[3px] border-l-red-600 rounded-r-lg p-2.5 ${hasExtra ? "mb-3.5" : ""}`}>
            <span className="text-sm mt-0.5 shrink-0">🔴</span>
            <span className="text-sm font-semibold text-red-900 leading-relaxed">{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre className="rlb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const RoleResultBox: React.FC<RoleResultBoxProps> = ({ data }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="rlb-root mt-4">
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );
  const isSuccessMsg = isObj && !isError && (data as SuccessMessage).message !== undefined && (data as Role).roleId === undefined && (data as UserRolesData).userId === undefined;
  const isUserRoles  = isObj && !isError && (data as UserRolesData).userId !== undefined && (data as UserRolesData).roles !== undefined;
  const isSingleRole = isObj && !isError && (data as Role).roleId !== undefined && (data as Role).roleName !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="rlb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isUserRoles  && <UserRolesCard data={data as UserRolesData} />}
      {isSingleRole && <SingleRoleCard role={data as Role} />}
      {isArray && (data as Role[]).length === 0 && (
        <div className="rlb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">🔖</div>
          <div className="text-sm font-semibold text-gray-600">No roles found</div>
        </div>
      )}
      {isArray && (data as Role[]).length > 0 && <RoleGrid roles={data as Role[]} />}
    </div>
  );
};

export default RoleResultBox;