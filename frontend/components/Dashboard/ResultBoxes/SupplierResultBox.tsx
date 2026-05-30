/**
 * SupplierResultBox.tsx
 * Result renderer for supplier API responses.
 *
 * Handles:
 *  • Array of suppliers  → contact card grid (Get All)
 *  • Single supplier obj → detail card (Get By ID / Add / Update)
 *  • { message: "..." } → success toast
 *  • Error              → ErrorCard
 *  • null               → nothing
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Supplier {
  id: number | string;
  supplierName: string;
  supplierEmail: string;
  supplierPhone?: string;
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
  id?: never;
  supplierName?: never;
}

type SupplierResultData = Supplier | Supplier[] | ErrorData | SuccessMessage | string | null | undefined;

interface SupplierResultBoxProps {
  data: SupplierResultData;
  isNew?: boolean;
  isUpdate?: boolean;
}

interface SingleSupplierCardProps {
  supplier: Supplier;
  isNew?: boolean;
  isUpdate?: boolean;
}

interface SupplierMiniCardProps {
  supplier: Supplier;
  index: number;
}

interface SupplierGridProps {
  suppliers: Supplier[];
}

interface ContactRowProps {
  icon: string;
  value?: string;
  href?: string;
  mono?: boolean;
}

interface SuccessCardProps {
  message: string;
}

interface ErrorCardProps {
  data: ErrorData;
}

// ─── brand color detection from supplier name ─────────────────────────────────
interface SupplierAccent {
  color: string;
  bg: string;
  border: string;
  initBg: string;
}

const getSupplierAccent = (name = ""): SupplierAccent => {
  const n = name.toLowerCase();
  if (n.includes("hp"))      return { color: "#0096D6", bg: "#EFF9FF", border: "#BAE6FD", initBg: "linear-gradient(135deg,#005F8E,#0096D6)" };
  if (n.includes("canon"))   return { color: "#CC0000", bg: "#FEF2F2", border: "#FECACA", initBg: "linear-gradient(135deg,#991B1B,#CC0000)" };
  if (n.includes("epson"))   return { color: "#0033A0", bg: "#EFF6FF", border: "#BFDBFE", initBg: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("brother")) return { color: "#006CB4", bg: "#F0F9FF", border: "#BAE6FD", initBg: "linear-gradient(135deg,#075985,#006CB4)" };
  if (n.includes("xerox"))   return { color: "#E5202E", bg: "#FEF2F2", border: "#FECACA", initBg: "linear-gradient(135deg,#991B1B,#E5202E)" };
  if (n.includes("ricoh"))   return { color: "#005BAC", bg: "#EFF6FF", border: "#BFDBFE", initBg: "linear-gradient(135deg,#1E3A8A,#005BAC)" };
  return { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", initBg: "linear-gradient(135deg,#065F46,#059669)" };
};

const initials = (name = ""): string =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes sb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes sb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes sb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .sb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .sb-mono   { font-family:'DM Mono',monospace !important; }

  .sb-card {
    animation: sb-up .35s cubic-bezier(.22,1,.36,1) both;
  }
  .sb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 18px 40px rgba(5,150,105,.14);
    transform: translateY(-2px);
  }

  .sb-supplier-card {
    animation: sb-up .32s cubic-bezier(.22,1,.36,1) both;
  }
  .sb-supplier-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 14px 32px rgba(5,150,105,.14);
    transform: translateY(-3px);
  }

  .sb-contact-row:hover { background: #F9FAFB; }

  .sb-success-icon circle { animation: sb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .sb-success-icon path {
    stroke-dasharray: 40; stroke-dashoffset: 40;
    animation: sb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }

  .sb-error-card { animation: sb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .sb-success-toast { animation: sb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .sb-empty { animation: sb-pop .35s ease both; }

  @media (max-width:600px) {
    .sb-supplier-grid { grid-template-columns: 1fr !important; }
    .sb-detail-grid   { grid-template-columns: 1fr !important; }
  }
`;

// ─── Supplier Avatar ──────────────────────────────────────────────────────────
const SupplierAvatar: React.FC<{ name: string; size?: number }> = ({ name, size = 48 }) => {
  const { initBg } = getSupplierAccent(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.25,
        background: initBg,
        fontSize: size * 0.32,
        boxShadow: "0 2px 8px rgba(0,0,0,.18)",
        flexShrink: 0,
      }}
      className="flex items-center justify-center font-extrabold text-white tracking-wide"
    >
      {initials(name) || "SP"}
    </div>
  );
};

// ─── Contact Row ──────────────────────────────────────────────────────────────
const ContactRow: React.FC<ContactRowProps> = ({ icon, value, href, mono }) => (
  <div className="sb-contact-row flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors duration-150">
    <span className="text-sm shrink-0">{icon}</span>
    {href ? (
      <a
        href={href}
        className={`text-[13px] text-teal-600 font-semibold no-underline hover:underline ${mono ? "sb-mono" : ""}`}
      >
        {value}
      </a>
    ) : (
      <span className={`text-[13px] text-gray-700 font-semibold ${mono ? "sb-mono" : ""}`}>{value}</span>
    )}
  </div>
);

// ─── Supplier Mini Card (grid) ────────────────────────────────────────────────
const SupplierMiniCard: React.FC<SupplierMiniCardProps> = ({ supplier, index }) => {
  const { id, supplierName, supplierEmail, supplierPhone } = supplier;
  const { color } = getSupplierAccent(supplierName);

  return (
    <div
      className="sb-supplier-card bg-white rounded-[14px] overflow-hidden flex flex-col transition-all duration-200"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,.07), 0 6px 16px rgba(0,0,0,.07)",
        animationDelay: `${index * 55}ms`,
      }}
    >
      {/* top accent strip */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}88)` }} />

      <div className="p-4">
        {/* header row */}
        <div className="flex items-center gap-3 mb-3.5">
          <SupplierAvatar name={supplierName} size={44} />
          <div className="min-w-0">
            <div
              className="text-sm font-bold text-gray-900 leading-snug"
              style={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties}
            >
              {supplierName}
            </div>
            <div className="sb-mono text-[11px] text-gray-400 mt-0.5">ID #{id}</div>
          </div>
        </div>

        {/* contact details */}
        <div className="bg-gray-50 rounded-[10px] border border-gray-200 overflow-hidden">
          <ContactRow icon="✉️" value={supplierEmail} href={`mailto:${supplierEmail}`} />
          <div className="h-px bg-gray-100" />
          <ContactRow icon="📞" value={supplierPhone} href={`tel:${supplierPhone}`} mono />
        </div>
      </div>
    </div>
  );
};

// ─── Supplier Grid (Get All) ──────────────────────────────────────────────────
const SupplierGrid: React.FC<SupplierGridProps> = ({ suppliers }) => (
  <>
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-600 mb-3.5">
      🏭 {suppliers.length} supplier{suppliers.length !== 1 ? "s" : ""}
    </div>
    <div
      className="sb-supplier-grid"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}
    >
      {suppliers.map((s, i) => (
        <SupplierMiniCard key={s.id} supplier={s} index={i} />
      ))}
    </div>
  </>
);

// ─── Single Supplier Card ─────────────────────────────────────────────────────
const SingleSupplierCard: React.FC<SingleSupplierCardProps> = ({ supplier, isNew = false, isUpdate = false }) => {
  const { id, supplierName, supplierEmail, supplierPhone } = supplier;
  const { initBg } = getSupplierAccent(supplierName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : initBg;

  const headerLabel = isNew ? "SUPPLIER ADDED" : isUpdate ? "SUPPLIER UPDATED" : "SUPPLIER";

  return (
    <div
      className="sb-card bg-white rounded-2xl overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06), 0 10px 28px rgba(0,0,0,.08)" }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4"
        style={{ background: headerGrad }}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-[46px] h-[46px] rounded-xl bg-white/20 flex items-center justify-center text-[13px] font-extrabold text-white tracking-wide shrink-0">
            {initials(supplierName) || "SP"}
          </div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="text-[19px] font-extrabold text-white leading-tight">{supplierName}</div>
          </div>
        </div>
        <span className="sb-mono text-[13px] text-white/50">ID #{id}</span>
      </div>

      {/* body */}
      <div className="px-5 py-4">
        <div className="sb-detail-grid grid grid-cols-3 gap-x-5 gap-y-3.5">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🏭 Supplier ID</div>
            <div className="sb-mono text-sm font-semibold text-gray-900">#{id}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">✉️ Email</div>
            <a href={`mailto:${supplierEmail}`} className="text-sm font-semibold text-teal-600 no-underline block">
              {supplierEmail}
            </a>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">📞 Phone</div>
            <a href={`tel:${supplierPhone}`} className="sb-mono text-sm font-semibold text-teal-600 no-underline block">
              {supplierPhone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="sb-success-toast flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200">
    <svg className="sb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
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
    <div className="sb-error-card rounded-[14px] overflow-hidden border border-red-200">
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: "linear-gradient(135deg,#991B1B,#DC2626)" }}
      >
        <div className="w-9 h-9 rounded-[10px] bg-white/20 flex items-center justify-center text-lg shrink-0">⚠️</div>
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
          <pre className="sb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap break-words bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const SupplierResultBox: React.FC<SupplierResultBoxProps> = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="sb-root mt-4">
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj = typeof data === "object" && !Array.isArray(data);

  const isError =
    isObj &&
    (
      (data as ErrorData).success === false ||
      (data as ErrorData).error !== undefined ||
      ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
    );

  const isSuccessMsg =
    isObj && !isError &&
    (data as ErrorData).message !== undefined &&
    (data as Supplier).id === undefined;

  const isSingle =
    isObj && !isError &&
    (data as Supplier).id !== undefined &&
    (data as Supplier).supplierName !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="sb-root mt-4">
      <style>{GLOBAL_CSS}</style>

      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as ErrorData).message!} />}
      {isSingle     && <SingleSupplierCard supplier={data as Supplier} isNew={isNew} isUpdate={isUpdate} />}

      {isArray && (data as Supplier[]).length === 0 && (
        <div className="sb-empty py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">🏭</div>
          <div className="text-sm font-semibold text-gray-600">No suppliers found</div>
        </div>
      )}

      {isArray && (data as Supplier[]).length > 0 && <SupplierGrid suppliers={data as Supplier[]} />}
    </div>
  );
};

export default SupplierResultBox;