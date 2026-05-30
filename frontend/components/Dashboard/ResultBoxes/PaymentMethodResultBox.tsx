/**
 * PaymentMethodResultBox.tsx
 * Result renderer for payment method API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface PaymentMethod {
  paymentMethodId: number | string;
  paymentMethodCode: string;
  paymentMethodName: string;
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
  paymentMethodId?: undefined;
}

type PaymentMethodResultData = PaymentMethod | PaymentMethod[] | ErrorData | SuccessMessage | string | null | undefined;

interface PaymentMethodResultBoxProps { data: PaymentMethodResultData; isNew?: boolean; isUpdate?: boolean; }
interface MethodTileProps             { method: PaymentMethod; index: number; }
interface MethodGridProps             { methods: PaymentMethod[]; }
interface SingleMethodCardProps       { method: PaymentMethod; isNew?: boolean; isUpdate?: boolean; }
interface CodePillProps               { code: string; color: string; bg: string; border: string; }
interface ErrorCardProps              { data: ErrorData; }
interface SuccessCardProps            { message: string; }

// ─── method appearance config ─────────────────────────────────────────────────
interface MethodMeta { icon: string; color: string; bg: string; border: string; grad: string; }

const getMethodMeta = (code = "", name = ""): MethodMeta => {
  const c = code.toUpperCase();
  const n = name.toUpperCase();
  if (c === "COD"  || n.includes("CASH"))   return { icon: "💵", color: "#0D9488", bg: "#F0FDFA", border: "#5EEAD4", grad: "linear-gradient(135deg,#0F766E,#0D9488)"   };
  if (c === "CARD" || n.includes("CARD"))   return { icon: "💳", color: "#4F46E5", bg: "#EEF2FF", border: "#A5B4FC", grad: "linear-gradient(135deg,#1E1B4B,#4F46E5)"   };
  if (c === "BANK" || n.includes("BANK"))   return { icon: "🏦", color: "#0EA5E9", bg: "#F0F9FF", border: "#7DD3FC", grad: "linear-gradient(135deg,#0C4A6E,#0EA5E9)"   };
  if (c === "CRPT" || n.includes("CRYPTO")) return { icon: "₿",  color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", grad: "linear-gradient(135deg,#92400E,#D97706)"   };
  return { icon: "🪙", color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @keyframes pmrb-rise {
    from { opacity:0; transform:translateY(12px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes pmrb-pop {
    0%   { transform:scale(.88); opacity:0; }
    60%  { transform:scale(1.03); }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes pmrb-check {
    0%   { stroke-dashoffset:44; }
    100% { stroke-dashoffset:0;  }
  }
  @keyframes pmrb-shine {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }

  .pmrb-root * { box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif; }
  .pmrb-mono   { font-family:'JetBrains Mono',monospace !important; }

  .pmrb-card {
    animation:pmrb-rise .38s cubic-bezier(.22,1,.36,1) both;
  }
  .pmrb-card:hover {
    box-shadow:0 4px 10px rgba(0,0,0,.07),0 20px 44px rgba(79,70,229,.14);
    transform:translateY(-3px);
  }

  .pmrb-method-tile {
    animation:pmrb-rise .32s cubic-bezier(.22,1,.36,1) both;
  }
  .pmrb-method-tile:hover {
    box-shadow:0 4px 10px rgba(0,0,0,.08),0 16px 36px rgba(79,70,229,.12);
    transform:translateY(-4px);
  }

  .pmrb-shine-strip {
    height:3px;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,.5),transparent);
    background-size:200% auto;
    animation:pmrb-shine 2.2s linear infinite;
  }

  .pmrb-success-path {
    stroke-dasharray:44; stroke-dashoffset:44;
    animation:pmrb-check .45s .2s cubic-bezier(.22,1,.36,1) forwards;
  }

  .pmrb-error-card  { animation:pmrb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .pmrb-empty-state { animation:pmrb-pop .35s ease both; }

  @media (max-width:480px) {
    .pmrb-grid         { grid-template-columns:1fr !important; }
    .pmrb-detail-grid  { grid-template-columns:1fr 1fr !important; }
  }
`;

// ─── Code Pill ────────────────────────────────────────────────────────────────
const CodePill: React.FC<CodePillProps> = ({ code, color, bg, border }) => (
  <span
    className="pmrb-mono inline-flex items-center justify-center px-2.5 py-0.5 rounded-[7px] text-[11px] font-bold tracking-widest border"
    style={{ background: bg, color, borderColor: border }}
  >
    {code}
  </span>
);

// ─── Method Tile ──────────────────────────────────────────────────────────────
const MethodTile: React.FC<MethodTileProps> = ({ method, index }) => {
  const { paymentMethodId, paymentMethodCode, paymentMethodName } = method;
  const { icon, color, bg, border, grad } = getMethodMeta(paymentMethodCode, paymentMethodName);

  return (
    <div
      className="pmrb-method-tile bg-white border border-[#E8ECF4] rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.05),0 6px 18px rgba(0,0,0,.07)", animationDelay: `${index * 70}ms` }}
    >
      {/* gradient header */}
      <div className="flex items-center justify-between p-4 pb-3.5" style={{ background: grad }}>
        <div className="w-11.5 h-11.5 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px]">{icon}</div>
        <span className="pmrb-mono text-[10px] text-white/50 font-medium">ID #{paymentMethodId}</span>
      </div>
      {/* shine strip */}
      <div className="pmrb-shine-strip" />

      {/* body */}
      <div className="p-4 flex-1 flex flex-col gap-2.5">
        <div>
          <div className="pmrb-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1">Method Name</div>
          <div className="text-[15px] font-extrabold text-slate-900">{paymentMethodName}</div>
        </div>
        <div className="mt-auto">
          <div className="pmrb-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Code</div>
          <CodePill code={paymentMethodCode} color={color} bg={bg} border={border} />
        </div>
      </div>
    </div>
  );
};

// ─── Method Grid ─────────────────────────────────────────────────────────────
const MethodGrid: React.FC<MethodGridProps> = ({ methods }) => (
  <>
    <div className="mb-3.5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-600">
        💳 {methods.length} method{methods.length !== 1 ? "s" : ""}
      </span>
    </div>
    <div className="pmrb-grid grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
      {methods.map((m, i) => <MethodTile key={m.paymentMethodId} method={m} index={i} />)}
    </div>
  </>
);

// ─── Single Method Card ───────────────────────────────────────────────────────
const SingleMethodCard: React.FC<SingleMethodCardProps> = ({ method, isNew = false, isUpdate = false }) => {
  const { paymentMethodId, paymentMethodCode, paymentMethodName } = method;
  const { icon, color, bg, border, grad } = getMethodMeta(paymentMethodCode, paymentMethodName);

  const headerGrad = isNew
    ? "linear-gradient(135deg, #065F46, #10B981)"
    : isUpdate
    ? "linear-gradient(135deg, #0C4A6E, #0EA5E9)"
    : grad;

  const headerLabel = isNew ? "METHOD CREATED" : isUpdate ? "METHOD UPDATED" : "PAYMENT METHOD";
  const headerBadge = isNew ? "✨ New" : isUpdate ? "✏️ Updated" : null;

  return (
    <div
      className="pmrb-card bg-white border border-[#E8ECF4] rounded-[18px] overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.05),0 10px 30px rgba(79,70,229,.08)" }}
    >
      {/* header */}
      <div className="px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-[15px] bg-white/20 flex items-center justify-center text-2xl shrink-0">{icon}</div>
            <div>
              <div className="pmrb-mono text-[10px] text-white/55 font-bold tracking-widest mb-0.5">{headerLabel}</div>
              <div className="text-[22px] font-extrabold text-white leading-tight">{paymentMethodName}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="pmrb-mono text-[11px] text-white/45">ID #{paymentMethodId}</span>
            {headerBadge && (
              <span className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full bg-white/20 border border-white/25">
                {headerBadge}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="px-5 py-4">
        <div className="pmrb-detail-grid grid grid-cols-3 gap-x-5 gap-y-4">
          <div>
            <div className="pmrb-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1">🗂️ ID</div>
            <div className="pmrb-mono text-sm font-bold text-slate-800">#{paymentMethodId}</div>
          </div>
          <div>
            <div className="pmrb-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1">🏷️ Name</div>
            <div className="text-sm font-bold text-slate-800">{paymentMethodName}</div>
          </div>
          <div>
            <div className="pmrb-mono text-[9.5px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">🔑 Code</div>
            <CodePill code={paymentMethodCode} color={color} bg={bg} border={border} />
          </div>
        </div>

        {/* accent bar */}
        <div className="mt-4 h-0.5 rounded-full opacity-35" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div
    className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200"
    style={{ animation: "pmrb-pop .35s cubic-bezier(.22,1,.36,1) both" }}
  >
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
      <path className="pmrb-success-path" d="M11 18.5l5 5 9-10" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div className="pmrb-mono text-[10px] font-bold text-emerald-600 tracking-widest uppercase">Success</div>
      <div className="text-sm font-bold text-emerald-900 mt-0.5">{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="pmrb-error-card rounded-2xl overflow-hidden border border-rose-300">
      <div
        className="flex items-center gap-3 px-5 py-3.5"
        style={{ background: "linear-gradient(135deg, #881337, #F43F5E)" }}
      >
        <div className="w-10 h-10 rounded-[11px] bg-white/20 flex items-center justify-center text-lg shrink-0">⚠️</div>
        <div>
          <div className="pmrb-mono text-[10px] text-white/60 font-bold tracking-widest">REQUEST FAILED</div>
          <div className="text-[17px] font-extrabold text-white">Action Could Not Be Completed</div>
        </div>
      </div>
      <div className="p-4 bg-rose-50">
        {message && (
          <div className={`flex items-start gap-2.5 bg-rose-100 border border-rose-200 border-l-[3px] border-l-rose-500 rounded-r-lg p-2.5 ${hasExtra ? "mb-3" : ""}`}>
            <span className="text-sm mt-0.5 shrink-0">🔴</span>
            <span className="text-sm font-semibold text-rose-900 leading-relaxed">{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre className="pmrb-mono m-0 text-[11px] text-rose-900 whitespace-pre-wrap wrap-break-word bg-rose-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PaymentMethodResultBox: React.FC<PaymentMethodResultBoxProps> = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="pmrb-root mt-4">
        <style>{GLOBAL_CSS}</style>
        <SuccessCard message={data} />
      </div>
    );
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isArray = Array.isArray(data);

  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );

  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as PaymentMethod).paymentMethodId === undefined;
  const isSingle     = isObj && !isError && (data as PaymentMethod).paymentMethodId !== undefined;

  return (
    <div className="pmrb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SingleMethodCard method={data as PaymentMethod} isNew={isNew} isUpdate={isUpdate} />}
      {isArray && (data as PaymentMethod[]).length === 0 && (
        <div className="pmrb-empty-state py-8 px-5 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="text-4xl mb-2.5">💳</div>
          <div className="text-[15px] font-bold text-slate-600">No payment methods found</div>
          <div className="text-[13px] text-slate-400 mt-1">Add a method to get started.</div>
        </div>
      )}
      {isArray && (data as PaymentMethod[]).length > 0 && <MethodGrid methods={data as PaymentMethod[]} />}
    </div>
  );
};

export default PaymentMethodResultBox;