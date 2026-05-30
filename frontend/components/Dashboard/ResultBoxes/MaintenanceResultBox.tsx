/**
 * MaintenanceResultBox.tsx
 * Universal result renderer for maintenance API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface MaintenanceRecord {
  maintenanceId: number | string;
  customerId?: number | string;
  technicianUserId?: number | string;
  paymentMethod?: string;
  totalAmount?: number;
  serviceId?: number | string;
  servicePrice?: number;
  address?: string;
  description?: string;
  date?: string;
  completedAt?: string;
  createdAt?: string;
  maintenanceStatus?: string;
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  maintenanceId?: undefined;
  [key: string]: unknown;
}

type MaintenanceResultData = MaintenanceRecord | MaintenanceRecord[] | ErrorData | null | undefined;

interface MaintenanceResultBoxProps { data: MaintenanceResultData; }
interface MaintenanceCardProps      { record: MaintenanceRecord; index?: number; isCompleteResult?: boolean; }
interface SummaryStripProps         { records: MaintenanceRecord[]; }
interface StatusBadgeProps          { status?: string; }
interface FieldProps                { label: string; value?: string | null; mono?: boolean; accent?: boolean; }
interface ErrorCardProps            { data: ErrorData; }

// ─── status config ────────────────────────────────────────────────────────────
interface StatusMeta { color: string; bg: string; border: string; icon: string; }

const STATUS: Record<string, StatusMeta> = {
  Scheduled: { color: "#1D4ED8", bg: "#EFF6FF", border: "#DBEAFE", icon: "◷" },
  Completed: { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", icon: "✓" },
  Cancelled: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "✕" },
};

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (iso?: string): string | null => {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const fmtMoney = (n?: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
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

  .rb-card { animation: rb-fadeUp .38s cubic-bezier(.22,1,.36,1) both; }
  .rb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(29,78,216,.14);
    transform: translateY(-2px);
  }
  .rb-error-card  { animation: rb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .rb-empty-state { animation: rb-pop .35s cubic-bezier(.22,1,.36,1) both; }

  @media (max-width: 480px) {
    .rb-people-grid  { grid-template-columns: 1fr 1fr !important; }
    .rb-dates-grid   { grid-template-columns: 1fr !important; }
    .rb-money-flex   { flex-direction: column !important; }
    .rb-summary-row  { flex-direction: column !important; }
    .rb-total-amount { font-size: 20px !important; }
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const m = STATUS[status ?? ""] ?? { color: "#9CA3AF", bg: "#F3F4F6", border: "#E5E7EB", icon: "?" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      <span className="w-1.75 h-1.75 rounded-full shrink-0" style={{ background: m.color }} />
      {status?.toUpperCase() ?? "UNKNOWN"}
    </span>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<FieldProps> = ({ label, value, mono, accent }) => (
  <div>
    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">{label}</div>
    <div className={`text-sm font-semibold ${mono ? "rb-mono" : ""}`} style={{ color: accent ? "#1D4ED8" : "#111827" }}>
      {value ?? "—"}
    </div>
  </div>
);

// ─── Maintenance Card ─────────────────────────────────────────────────────────
const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ record, index = 0, isCompleteResult = false }) => {
  const { maintenanceId, customerId, technicianUserId, paymentMethod, totalAmount, serviceId, servicePrice, address, description, date, completedAt, createdAt, maintenanceStatus } = record;
  const headerGrad = isCompleteResult ? "linear-gradient(135deg, #065F46 0%, #059669 100%)" : "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)";

  return (
    <div className="rb-card bg-white rounded-[18px] overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08)", animationDelay: `${index * 90}ms` }}>

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3">
          <div className="w-10.5 h-10.5 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0"
            style={{ animation: isCompleteResult ? "rb-pulse-ring 1.8s ease-out 1" : "none" }}>
            {isCompleteResult ? "✅" : "🔧"}
          </div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">
              {isCompleteResult ? "COMPLETED MAINTENANCE" : "MAINTENANCE REQUEST"}
            </div>
            <div className="rb-mono text-xl font-bold text-white">#{maintenanceId}</div>
          </div>
        </div>
        <StatusBadge status={maintenanceStatus} />
      </div>

      {/* body */}
      <div className="px-5 py-4">
        {description && (
          <div className="flex gap-2.5 items-start bg-gray-50 border-l-[3px] border-blue-600 rounded-r-[10px] px-3.5 py-2.5 mb-4">
            <span className="text-[15px] mt-0.5 shrink-0">💬</span>
            <p className="m-0 text-sm text-gray-700 leading-relaxed">{description}</p>
          </div>
        )}

        {address && (
          <div className="flex items-start gap-2 mb-4">
            <span className="text-base mt-0.5 shrink-0">📍</span>
            <span className="text-sm text-gray-600">{address}</span>
          </div>
        )}

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="rb-people-grid grid grid-cols-3 gap-x-5 gap-y-3 mb-4">
          <Field label="👤 Customer ID"   value={`#${customerId}`}       mono />
          <Field label="🛠️ Technician ID" value={`#${technicianUserId}`} mono />
          <Field label="🗂️ Service ID"    value={`#${serviceId}`}        mono />
        </div>

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="rb-money-flex flex items-center flex-wrap gap-x-7 gap-y-3 mb-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">💳 Payment Method</div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold border bg-emerald-50 text-emerald-600 border-emerald-200 mt-1">
              {paymentMethod}
            </span>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">🏷️ Service Price</div>
            <div className="rb-mono text-sm font-semibold text-gray-900 mt-1">{fmtMoney(servicePrice)}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">TOTAL AMOUNT</div>
            <div className="rb-mono rb-total-amount text-[26px] font-extrabold text-blue-700 mt-0.5">{fmtMoney(totalAmount)}</div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="rb-dates-grid grid grid-cols-3 gap-x-5 gap-y-2.5">
          <Field label="📅 Scheduled For" value={fmtDate(date)}                        accent />
          <Field label="✅ Completed At"  value={fmtDate(completedAt) ?? "Not yet"} />
          <Field label="🕐 Created At"    value={fmtDate(createdAt) ?? undefined} />
        </div>
      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip: React.FC<SummaryStripProps> = ({ records }) => {
  const counts = records.reduce<Record<string, number>>((acc, r) => {
    const s = r.maintenanceStatus ?? "Unknown";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",     value: records.length,          color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "Scheduled", value: counts.Scheduled ?? 0,   color: "#1D4ED8", bg: "#EFF6FF" },
    { label: "Completed", value: counts.Completed ?? 0,   color: "#059669", bg: "#ECFDF5" },
    { label: "Cancelled", value: counts.Cancelled ?? 0,   color: "#DC2626", bg: "#FEF2F2" },
  ];

  return (
    <div className="rb-summary-row flex gap-2.5 flex-wrap mb-4">
      {pills.map(({ label, value, color, bg }) => (
        <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] border flex-1 basis-27.5"
          style={{ borderColor: `${color}30`, background: bg }}>
          <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-extrabold text-base shrink-0"
            style={{ background: `${color}18`, color }}>{value}</div>
          <div>
            <div className="text-[11px] text-gray-400 font-semibold">{label}</div>
            <div className="text-[13px] font-bold" style={{ color }}>record{value !== 1 ? "s" : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
  <div className="rb-empty-state py-9 px-6 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
    <div className="text-4xl mb-2.5">📭</div>
    <div className="text-[15px] font-semibold text-gray-600">No results found</div>
    <div className="text-[13px] mt-1">Try a different status filter</div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="rb-error-card rounded-[14px] overflow-hidden border border-red-200">
      <div className="flex items-center gap-3 px-5 py-3.5" style={{ background: "linear-gradient(135deg, #991B1B 0%, #DC2626 100%)" }}>
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
          <pre className="rb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const MaintenanceResultBox: React.FC<MaintenanceResultBoxProps> = ({ data }) => {
  if (data === null || data === undefined) return null;

  const isError =
    typeof data === "object" && !Array.isArray(data) &&
    (
      (data as ErrorData).success === false ||
      (data as ErrorData).error !== undefined ||
      ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400) ||
      ((data as ErrorData).message !== undefined && (data as MaintenanceRecord).maintenanceId === undefined)
    );

  const isSingleRecord =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    (data as MaintenanceRecord).maintenanceId !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="rb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError && <ErrorCard data={data as ErrorData} />}
      {isSingleRecord && (
        <MaintenanceCard
          record={data as MaintenanceRecord}
          index={0}
          isCompleteResult={(data as MaintenanceRecord).maintenanceStatus === "Completed"}
        />
      )}
      {isArray && (data as MaintenanceRecord[]).length === 0 && <EmptyState />}
      {isArray && (data as MaintenanceRecord[]).length > 0 && (
        <>
          <SummaryStrip records={data as MaintenanceRecord[]} />
          <div className="flex flex-col gap-4">
            {(data as MaintenanceRecord[]).map((r, i) => (
              <MaintenanceCard key={r.maintenanceId} record={r} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MaintenanceResultBox;