/**
 * UserResultBox.tsx
 * Result renderer for user API responses.
 *
 * Handles:
 *  • Array  → summary strip + user grid cards (Get All Users)
 *  • Object → single user card (Get By ID / Update)
 *  • Error  → ErrorCard ({ success:false, error:"..." } or HTTP error)
 *  • null   → nothing
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Role {
  roleName: string;
}

interface User {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  roles?: Role[];
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

type UserResultData = User | User[] | ErrorData | null | undefined;

interface UserResultBoxProps {
  data: UserResultData;
  isUpdate?: boolean;
}

interface UserCardProps {
  user: User;
  isUpdate?: boolean;
}

interface MiniUserCardProps {
  user: User;
  index: number;
}

interface SummaryStripProps {
  users: User[];
}

interface ErrorCardProps {
  data: ErrorData;
}

interface AvatarProps {
  firstName: string;
  lastName: string;
  roleName: string;
  size?: number;
}

interface RoleBadgeProps {
  roleName: string;
}

interface FieldProps {
  label: string;
  value?: string | number | null;
  mono?: boolean;
}

// ─── role styling ─────────────────────────────────────────────────────────────
type RoleKey = "ADMIN" | "MANAGER" | "TECHNICIAN" | "DELIVERY" | "CUSTOMER";

interface RoleMeta {
  color: string;
  bg: string;
  border: string;
  icon: string;
  badge: string;
}

const ROLE_META: Record<string, RoleMeta> = {
  ADMIN:      { color: "#DC2626", bg: "#FEF2F2",   border: "#FECACA", icon: "👑", badge: "bg-red-50 text-red-600 border-red-200"     },
  MANAGER:    { color: "#7C3AED", bg: "#F5F3FF",   border: "#DDD6FE", icon: "🏢", badge: "bg-violet-50 text-violet-600 border-violet-200" },
  TECHNICIAN: { color: "#0284C7", bg: "#F0F9FF",   border: "#BAE6FD", icon: "🔧", badge: "bg-sky-50 text-sky-600 border-sky-200"        },
  DELIVERY:   { color: "#D97706", bg: "#FFFBEB",   border: "#FDE68A", icon: "🚚", badge: "bg-amber-50 text-amber-600 border-amber-200"   },
  CUSTOMER:   { color: "#059669", bg: "#ECFDF5",   border: "#A7F3D0", icon: "👤", badge: "bg-emerald-50 text-emerald-600 border-emerald-200" },
};

const AVATAR_GRAD: Record<string, string> = {
  ADMIN:      "linear-gradient(135deg, #991B1B, #DC2626)",
  MANAGER:    "linear-gradient(135deg, #5B21B6, #7C3AED)",
  TECHNICIAN: "linear-gradient(135deg, #075985, #0284C7)",
  DELIVERY:   "linear-gradient(135deg, #92400E, #D97706)",
  CUSTOMER:   "linear-gradient(135deg, #065F46, #059669)",
};

const getRoleName = (roles?: Role[]): string => roles?.[0]?.roleName ?? "UNKNOWN";

// ─── helpers ─────────────────────────────────────────────────────────────────
const initials = (first?: string, last?: string): string =>
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

  .urb-root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .urb-mono   { font-family: 'DM Mono', monospace !important; }

  .urb-card {
    animation: urb-fadeUp .38s cubic-bezier(.22,1,.36,1) both;
  }
  .urb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(79,70,229,.14);
    transform: translateY(-2px);
  }

  .urb-mini-card {
    animation: urb-fadeUp .35s cubic-bezier(.22,1,.36,1) both;
  }
  .urb-mini-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 16px 36px rgba(79,70,229,.15);
    transform: translateY(-3px);
  }

  .urb-error-card {
    animation: urb-pop .35s cubic-bezier(.22,1,.36,1) both;
  }
  .urb-empty-state {
    animation: urb-pop .35s cubic-bezier(.22,1,.36,1) both;
  }
`;

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge: React.FC<RoleBadgeProps> = ({ roleName }) => {
  const m = ROLE_META[roleName] ?? { color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB", icon: "?", badge: "bg-gray-100 text-gray-500 border-gray-200" };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border ${m.badge}`}
    >
      {m.icon} {roleName}
    </span>
  );
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar: React.FC<AvatarProps> = ({ firstName, lastName, roleName, size = 52 }) => {
  const grad = AVATAR_GRAD[roleName] ?? "linear-gradient(135deg, #374151, #111827)";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: grad,
        fontSize: size * 0.36,
        boxShadow: "0 2px 8px rgba(0,0,0,.2)",
        flexShrink: 0,
      }}
      className="flex items-center justify-center font-extrabold text-white tracking-wide"
    >
      {initials(firstName, lastName)}
    </div>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<FieldProps> = ({ label, value, mono }) => (
  <div>
    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">{label}</div>
    <div className={`text-sm font-semibold text-gray-900 ${mono ? "urb-mono" : ""}`}>{value ?? "—"}</div>
  </div>
);

// ─── Single / Detail User Card ────────────────────────────────────────────────
const UserCard: React.FC<UserCardProps> = ({ user, isUpdate = false }) => {
  const { id, firstName, lastName, email, phone, address, roles } = user;
  const roleName = getRoleName(roles);
  const headerGrad = isUpdate
    ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
    : "linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)";

  return (
    <div
      className="urb-card bg-white rounded-[18px] overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08)" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4"
        style={{ background: headerGrad }}
      >
        <div className="flex items-center gap-3.5">
          <Avatar firstName={firstName} lastName={lastName} roleName={roleName} size={48} />
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">
              {isUpdate ? "USER UPDATED" : "USER PROFILE"}
            </div>
            <div className="text-xl font-extrabold text-white leading-tight">
              {firstName} {lastName}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <RoleBadge roleName={roleName} />
          <span className="urb-mono text-xs text-white/55 font-medium">ID #{id}</span>
        </div>
      </div>

      {/* body */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-x-5 gap-y-3.5 max-sm:grid-cols-2">
          <Field label="✉️ Email"   value={email} />
          <Field label="📞 Phone"   value={phone} mono />
          <Field label="📍 Address" value={address} />
        </div>
      </div>
    </div>
  );
};

// ─── Mini User Card (for grid) ────────────────────────────────────────────────
const MiniUserCard: React.FC<MiniUserCardProps> = ({ user, index }) => {
  const { id, firstName, lastName, email, phone, address, roles } = user;
  const roleName = getRoleName(roles);
  const grad = AVATAR_GRAD[roleName] ?? "linear-gradient(135deg, #374151, #111827)";

  return (
    <div
      className="urb-mini-card bg-white rounded-[14px] overflow-hidden flex flex-col transition-all duration-200"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,.07), 0 6px 18px rgba(0,0,0,.07)",
        animationDelay: `${index * 40}ms`,
      }}
    >
      {/* colored top strip */}
      <div className="h-1.5" style={{ background: grad }} />

      <div className="p-4 flex-1">
        {/* avatar + name row */}
        <div className="flex items-center gap-2.5 mb-3">
          <Avatar firstName={firstName} lastName={lastName} roleName={roleName} size={40} />
          <div className="min-w-0">
            <div className="text-sm font-bold text-gray-900 truncate">
              {firstName} {lastName}
            </div>
            <div className="urb-mono text-[11px] text-gray-400 mt-0.5">#{id}</div>
          </div>
        </div>

        {/* role badge */}
        <div className="mb-3">
          <RoleBadge roleName={roleName} />
        </div>

        <div className="h-px bg-gray-100 my-2.5" />

        {/* contact details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs shrink-0">✉️</span>
            <span className="text-xs text-gray-600 truncate">{email}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs shrink-0">📞</span>
            <span className="urb-mono text-xs text-gray-600">{phone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs shrink-0">📍</span>
            <span className="text-xs text-gray-600">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip: React.FC<SummaryStripProps> = ({ users }) => {
  const roleCounts = users.reduce<Record<string, number>>((acc, u) => {
    const r = getRoleName(u.roles);
    acc[r] = (acc[r] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",       value: users.length,              color: "#4F46E5", bg: "#EEF2FF", border: "#4F46E540" },
    { label: "Admins",      value: roleCounts.ADMIN      ?? 0, color: "#DC2626", bg: "#FEF2F2", border: "#DC262640" },
    { label: "Managers",    value: roleCounts.MANAGER    ?? 0, color: "#7C3AED", bg: "#F5F3FF", border: "#7C3AED40" },
    { label: "Technicians", value: roleCounts.TECHNICIAN ?? 0, color: "#0284C7", bg: "#F0F9FF", border: "#0284C740" },
    { label: "Delivery",    value: roleCounts.DELIVERY   ?? 0, color: "#D97706", bg: "#FFFBEB", border: "#D9770640" },
    { label: "Customers",   value: roleCounts.CUSTOMER   ?? 0, color: "#059669", bg: "#ECFDF5", border: "#05966940" },
  ];

  return (
    <div className="flex gap-2 flex-wrap mb-4.5 max-sm:flex-col">
      {pills.map(({ label, value, color, bg, border }) => (
        <div
          key={label}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border flex-1 basis-24"
          style={{ borderColor: border, background: bg }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0"
            style={{ background: `${color}18`, color }}
          >
            {value}
          </div>
          <div className="text-[11px] font-bold" style={{ color }}>{label}</div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
  <div className="urb-empty-state py-9 px-6 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
    <div className="text-4xl mb-2.5">👥</div>
    <div className="text-[15px] font-semibold text-gray-600">No users found</div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));

  return (
    <div className="urb-error-card rounded-[14px] overflow-hidden border border-red-200">
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: "linear-gradient(135deg, #991B1B 0%, #DC2626 100%)" }}
      >
        <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center text-lg shrink-0">
          ⚠️
        </div>
        <div>
          <div className="text-[11px] text-white/65 font-bold tracking-widest">REQUEST FAILED</div>
          <div className="text-base font-bold text-white">Action Could Not Be Completed</div>
        </div>
      </div>
      <div className="p-4 bg-red-50">
        {message && (
          <div
            className={`flex items-start gap-2.5 bg-red-100 border border-red-200 border-l-[3px] border-l-red-600 rounded-r-lg p-2.5 ${hasExtra ? "mb-3.5" : ""}`}
          >
            <span className="text-sm mt-0.5 shrink-0">🔴</span>
            <span className="text-sm font-semibold text-red-900 leading-relaxed">{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre className="urb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap break-words bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const UserResultBox: React.FC<UserResultBoxProps> = ({ data, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  const isError =
    typeof data === "object" &&
    !Array.isArray(data) &&
    (
      (data as ErrorData).success === false ||
      (data as ErrorData).error !== undefined ||
      ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400) ||
      (
        (data as ErrorData).message !== undefined &&
        (data as User).id === undefined
      )
    );

  const isSingleUser =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    (data as User).id !== undefined &&
    (data as User).firstName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="urb-root mt-4">
      <style>{GLOBAL_CSS}</style>

      {isError && <ErrorCard data={data as ErrorData} />}

      {isSingleUser && <UserCard user={data as User} isUpdate={isUpdate} />}

      {isArray && (data as User[]).length === 0 && <EmptyState />}

      {isArray && (data as User[]).length > 0 && (
        <>
          <SummaryStrip users={data as User[]} />
          <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
            {(data as User[]).map((u, i) => (
              <MiniUserCard key={u.id} user={u} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserResultBox;