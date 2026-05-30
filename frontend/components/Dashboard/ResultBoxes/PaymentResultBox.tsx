/**
 * PaymentResultBox.tsx
 * Result renderer for payment API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Payment {
  paymentId: number | string;
  paymentMethodName?: string;
  paymentStatus?: string;
  paymentAmount?: number;
  paymentDate?: string;
  orderId?: number | string;
  maintenanceId?: number | string;
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
  paymentId?: undefined;
}

type PaymentResultData = Payment | Payment[] | ErrorData | SuccessMessage | string | null | undefined;

interface PaymentResultBoxProps  { data: PaymentResultData; }
interface PaymentTableProps      { payments: Payment[]; }
interface SinglePaymentCardProps { payment: Payment; }
interface StatusBadgeProps       { status?: string; }
interface LinkChipProps          { payment: Payment; }
interface ErrorCardProps         { data: ErrorData; }
interface SuccessCardProps       { message: string; }

// ─── status meta ─────────────────────────────────────────────────────────────
interface StatusMeta { color: string; bg: string; dot: string; label: string; }

const statusMeta = (status?: string): StatusMeta => {
  if (!status) return { color: "#94A3B8", bg: "#F1F5F9", dot: "#94A3B8", label: "UNKNOWN" };
  const s = status.toUpperCase();
  if (s === "COMPLETED") return { color: "#065F46", bg: "#ECFDF5", dot: "#10B981", label: "COMPLETED" };
  if (s === "PENDING")   return { color: "#92400E", bg: "#FFFBEB", dot: "#F59E0B", label: "PENDING"   };
  if (s === "FAILED")    return { color: "#881337", bg: "#FFF1F2", dot: "#F43F5E", label: "FAILED"    };
  return { color: "#0C4A6E", bg: "#F0F9FF", dot: "#0EA5E9", label: s };
};

// ─── link meta ────────────────────────────────────────────────────────────────
interface LinkMeta { type: string; id: number | string; icon: string; color: string; bg: string; border: string; }

const linkMeta = (p: Payment): LinkMeta | null => {
  if (p.orderId)       return { type: "Order",       id: p.orderId,       icon: "📦", color: "#0EA5E9", bg: "#F0F9FF", border: "#7DD3FC" };
  if (p.maintenanceId) return { type: "Maintenance", id: p.maintenanceId, icon: "🔧", color: "#D97706", bg: "#FFFBEB", border: "#FCD34D" };
  return null;
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtMoney = (n?: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

const fmtDate = (iso?: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
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

  .pmb-shell {
    background:#FFFFFF;
    border:1px solid #E8ECF0;
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 1px 3px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.9);
    animation:pmb-pop .38s cubic-bezier(.22,1,.36,1) both;
  }

  .pmb-table-row {
    animation: pmb-row .3s cubic-bezier(.22,1,.36,1) both;
    transition: background .15s;
  }
  .pmb-table-row:hover { background: #F1F5F9; }

  .pmb-pending-dot { animation:pmb-pulse 1.8s ease-in-out infinite; }

  .pmb-success-path {
    stroke-dasharray:44; stroke-dashoffset:44;
    animation:pmb-check .45s .2s cubic-bezier(.22,1,.36,1) forwards;
  }

  .pmb-error-card  { animation:pmb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .pmb-empty-state { animation:pmb-pop .35s ease both; }

  @media (max-width:540px) {
    .pmb-detail-grid { grid-template-columns:1fr 1fr !important; }
    .pmb-table-col-date { display:none !important; }
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { color, bg, dot, label } = statusMeta(status);
  const isPending = label === "PENDING";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide"
      style={{ background: bg, color }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isPending ? "pmb-pending-dot" : ""}`}
        style={{ background: dot }}
      />
      {label}
    </span>
  );
};

// ─── Link Chip ────────────────────────────────────────────────────────────────
const LinkChip: React.FC<LinkChipProps> = ({ payment }) => {
  const meta = linkMeta(payment);
  if (!meta) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span
      className="pmb-mono inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold border"
      style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
    >
      {meta.icon} {meta.type} #{meta.id}
    </span>
  );
};

// ─── Payment Table ────────────────────────────────────────────────────────────
const PaymentTable: React.FC<PaymentTableProps> = ({ payments }) => {
  const completed = payments.filter((p) => p.paymentStatus === "COMPLETED").length;
  const pending   = payments.filter((p) => p.paymentStatus === "PENDING").length;
  const total     = payments.reduce((s, p) => s + (p.paymentAmount ?? 0), 0);

  return (
    <div className="pmb-shell">
      {/* header */}
      <div
        className="flex items-center justify-between flex-wrap gap-3 px-6 py-5"
        style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10.5 h-10.5 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">💳</div>
          <div>
            <div className="pmb-mono text-[11px] text-white/45 tracking-widest mb-0.5">PAYMENT LEDGER</div>
            <div className="pmb-serif text-[22px] font-bold text-white leading-none">All Transactions</div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="px-3.5 py-1.5 rounded-[10px] bg-white/7 border border-white/12">
            <div className="pmb-mono text-[9px] text-white/40 tracking-widest">TOTAL</div>
            <div className="pmb-mono text-base font-semibold text-white">{fmtMoney(total)}</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-[10px] bg-emerald-50 border border-emerald-200">
            <div className="pmb-mono text-[9px] text-emerald-800 tracking-widest">COMPLETED</div>
            <div className="pmb-mono text-base font-semibold text-emerald-800">{completed}</div>
          </div>
          <div className="px-3.5 py-1.5 rounded-[10px] bg-amber-50 border border-amber-300">
            <div className="pmb-mono text-[9px] text-amber-800 tracking-widest">PENDING</div>
            <div className="pmb-mono text-base font-semibold text-amber-800">{pending}</div>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {["ID", "Status", "Amount", "Linked To", "Date"].map((h) => (
                <th key={h} className="pmb-mono px-4 py-2.5 text-left text-[10px] font-bold tracking-widest uppercase text-slate-500 whitespace-nowrap">
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
                style={{ borderBottom: i < payments.length - 1 ? "1px solid #E8ECF0" : "none", animationDelay: `${i * 35}ms` }}
              >
                <td className="px-4 py-3">
                  <span className="pmb-mono text-xs text-slate-500 font-medium">#{p.paymentId}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.paymentStatus} />
                </td>
                <td className="px-4 py-3">
                  <span className="pmb-mono text-sm font-semibold" style={{ color: p.paymentStatus === "COMPLETED" ? "#065F46" : "#1E293B" }}>
                    {fmtMoney(p.paymentAmount)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <LinkChip payment={p} />
                </td>
                <td className="pmb-table-col-date px-4 py-3">
                  <span className="pmb-mono text-[11px] text-slate-400">{fmtDate(p.paymentDate)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div className="flex justify-between items-center px-5 py-2.5 bg-slate-50 border-t border-slate-200">
        <span className="pmb-mono text-[11px] text-slate-400">{payments.length} record{payments.length !== 1 ? "s" : ""}</span>
        <span className="pmb-mono text-[11px] text-slate-400">All payments · Cash on Delivery</span>
      </div>
    </div>
  );
};

// ─── Single Payment Card ──────────────────────────────────────────────────────
const SinglePaymentCard: React.FC<SinglePaymentCardProps> = ({ payment }) => {
  const { paymentId, paymentMethodName, paymentStatus, paymentAmount, paymentDate } = payment;
  const { label } = statusMeta(paymentStatus);
  const link = linkMeta(payment);
  const isCompleted = label === "COMPLETED";

  const headerBg = isCompleted
    ? "linear-gradient(135deg, #065F46 0%, #10B981 100%)"
    : "linear-gradient(135deg, #0F172A 0%, #334155 100%)";

  return (
    <div className="pmb-shell">
      {/* header */}
      <div className="px-6 py-5" style={{ background: headerBg }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-white/15 flex items-center justify-center text-2xl shrink-0">
              {isCompleted ? "✅" : "⏳"}
            </div>
            <div>
              <div className="pmb-mono text-[10px] text-white/50 tracking-widest mb-1">PAYMENT RECEIPT</div>
              <div className="pmb-serif text-[26px] font-bold text-white leading-none">{fmtMoney(paymentAmount)}</div>
            </div>
          </div>
          <div className="pmb-mono px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[11px] font-semibold text-white/90 whitespace-nowrap">
            ID #{paymentId}
          </div>
        </div>
      </div>

      {/* body */}
      <div className="px-6 py-5">
        <div className="pmb-detail-grid grid grid-cols-3 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-1">
            <div className="pmb-mono text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">🔖 Status</div>
            <div><StatusBadge status={paymentStatus} /></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="pmb-mono text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">💳 Method</div>
            <div className="pmb-serif text-[13px] font-semibold text-slate-800">{paymentMethodName}</div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="pmb-mono text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">📅 Date</div>
            <div className="pmb-mono text-xs font-medium text-slate-600">{fmtDate(paymentDate)}</div>
          </div>
          {link && (
            <div className="flex flex-col gap-1 col-span-full">
              <div className="pmb-mono text-[9.5px] font-semibold uppercase tracking-widest text-slate-400">🔗 Linked To</div>
              <div className="mt-0.5"><LinkChip payment={payment} /></div>
            </div>
          )}
        </div>

        {/* amount bar */}
        <div
          className="mt-4 px-4 py-3.5 rounded-xl flex items-center justify-between border"
          style={{
            background: isCompleted ? "#ECFDF5" : "#FFFBEB",
            borderColor: isCompleted ? "#6EE7B7" : "#FCD34D",
          }}
        >
          <span
            className="text-[11px] font-bold tracking-widest uppercase"
            style={{ color: isCompleted ? "#065F46" : "#92400E" }}
          >
            Total Amount Paid
          </span>
          <span
            className="pmb-mono text-[22px] font-semibold"
            style={{ color: isCompleted ? "#065F46" : "#92400E" }}
          >
            {fmtMoney(paymentAmount)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div
    className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200"
    style={{ animation: "pmb-pop .35s cubic-bezier(.22,1,.36,1) both" }}
  >
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="shrink-0">
      <circle cx="18" cy="18" r="17" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
      <path className="pmb-success-path" d="M11 18.5l5 5 9-10" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <div>
      <div className="pmb-mono text-[11px] font-bold text-emerald-600 tracking-widest uppercase">Success</div>
      <div className="pmb-serif text-[15px] font-semibold text-emerald-900 mt-0.5">{message}</div>
    </div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="pmb-error-card rounded-2xl overflow-hidden border border-rose-300">
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ background: "linear-gradient(135deg, #881337, #F43F5E)" }}
      >
        <div className="w-10 h-10 rounded-[11px] bg-white/20 flex items-center justify-center text-lg shrink-0">⚠️</div>
        <div>
          <div className="pmb-mono text-[10px] text-white/60 font-bold tracking-widest">REQUEST FAILED</div>
          <div className="pmb-serif text-lg font-bold text-white">Payment Not Found</div>
        </div>
      </div>
      <div className="p-4 bg-rose-50">
        {message && (
          <div className={`flex items-start gap-2.5 bg-rose-100 border border-rose-200 border-l-[3px] border-l-rose-500 rounded-r-lg p-2.5 ${hasExtra ? "mb-3" : ""}`}>
            <span className="text-sm mt-0.5 shrink-0">🔴</span>
            <span className="pmb-serif text-sm font-semibold text-rose-900 leading-relaxed">{message}</span>
          </div>
        )}
        {hasExtra && (
          <pre className="pmb-mono m-0 text-[11px] text-rose-900 whitespace-pre-wrap wrap-break-word bg-rose-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const PaymentResultBox: React.FC<PaymentResultBoxProps> = ({ data }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="pmb-root mt-4">
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

  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as Payment).paymentId === undefined;
  const isSingle     = isObj && !isError && (data as Payment).paymentId !== undefined;

  return (
    <div className="pmb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SinglePaymentCard payment={data as Payment} />}
      {isArray && (data as Payment[]).length === 0 && (
        <div className="pmb-empty-state py-8 px-5 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <div className="text-4xl mb-2.5">💳</div>
          <div className="pmb-serif text-base font-semibold text-slate-600">No payments found</div>
          <div className="text-[13px] text-slate-400 mt-1">There are no payment records to display.</div>
        </div>
      )}
      {isArray && (data as Payment[]).length > 0 && <PaymentTable payments={data as Payment[]} />}
    </div>
  );
};

export default PaymentResultBox;