/**
 * ServiceResultBox.tsx
 * Result renderer for service API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Service {
  id: number | string;
  serviceName: string;
  servicePrice: number;
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
  id?: undefined;
}

type ServiceResultData = Service | Service[] | ErrorData | SuccessMessage | string | null | undefined;

interface ServiceResultBoxProps  { data: ServiceResultData; isNew?: boolean; isUpdate?: boolean; }
interface ServiceTileProps       { service: Service; index: number; }
interface ServiceGridProps       { services: Service[]; }
interface SingleServiceCardProps { service: Service; isNew?: boolean; isUpdate?: boolean; }
interface ErrorCardProps         { data: ErrorData; }
interface SuccessCardProps       { message: string; }

// ─── service type config ──────────────────────────────────────────────────────
interface ServiceMeta { icon: string; color: string; bg: string; border: string; grad: string; }

const getServiceMeta = (name = ""): ServiceMeta => {
  const n = name.toUpperCase();
  if (n.includes("DELIVERY"))    return { icon: "🚚", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", grad: "linear-gradient(135deg,#92400E,#D97706)" };
  if (n.includes("MAINTENANCE")) return { icon: "🔧", color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", grad: "linear-gradient(135deg,#1E3A8A,#2563EB)" };
  if (n.includes("INSTALL"))     return { icon: "⚙️", color: "#0D9488", bg: "#F0FDFA", border: "#99F6E4", grad: "linear-gradient(135deg,#0F766E,#0D9488)" };
  if (n.includes("REPAIR"))      return { icon: "🛠️", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", grad: "linear-gradient(135deg,#991B1B,#DC2626)" };
  if (n.includes("CONSULT"))     return { icon: "💼", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
  return { icon: "⚡", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", grad: "linear-gradient(135deg,#5B21B6,#7C3AED)" };
};

const fmtMoney = (n?: number): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes svb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes svb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes svb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .svb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .svb-mono   { font-family:'DM Mono',monospace !important; }

  .svb-card { animation:svb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .svb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(124,58,237,.14);
    transform:translateY(-2px);
  }
  .svb-service-tile { animation:svb-up .32s cubic-bezier(.22,1,.36,1) both; }
  .svb-service-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 16px 36px rgba(0,0,0,.12);
    transform:translateY(-4px);
  }
  .svb-success-icon circle { animation:svb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .svb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:svb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }
  .svb-error-card  { animation:svb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .svb-empty-state { animation:svb-pop .35s ease both; }
`;

// ─── Service Tile ─────────────────────────────────────────────────────────────
const ServiceTile: React.FC<ServiceTileProps> = ({ service, index }) => {
  const { id, serviceName, servicePrice } = service;
  const { icon, color, bg, border, grad } = getServiceMeta(serviceName);

  return (
    <div className="svb-service-tile bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.07),0 8px 20px rgba(0,0,0,.08)", animationDelay: `${index * 60}ms` }}>
      <div className="flex items-start justify-between p-5 pb-4" style={{ background: grad }}>
        <div className="w-12.5 h-12.5 rounded-[14px] bg-white/20 flex items-center justify-center text-2xl shrink-0">{icon}</div>
        <span className="svb-mono text-[11px] text-white/55 font-semibold pt-1">ID #{id}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">Service Name</div>
          <div className="text-base font-extrabold text-gray-900">{serviceName}</div>
        </div>
        <div className="flex items-center justify-between rounded-[10px] px-3.5 py-2.5 border mt-auto" style={{ background: bg, borderColor: border }}>
          <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color }}>Service Fee</span>
          <span className="svb-mono text-[20px] font-black" style={{ color }}>{fmtMoney(servicePrice)}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Service Grid ─────────────────────────────────────────────────────────────
const ServiceGrid: React.FC<ServiceGridProps> = ({ services }) => (
  <>
    <div className="mb-3.5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-xs font-bold text-violet-600">
        ⚡ {services.length} service{services.length !== 1 ? "s" : ""}
      </span>
    </div>
    <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
      {services.map((s, i) => <ServiceTile key={s.id} service={s} index={i} />)}
    </div>
  </>
);

// ─── Single Service Card ──────────────────────────────────────────────────────
const SingleServiceCard: React.FC<SingleServiceCardProps> = ({ service, isNew = false, isUpdate = false }) => {
  const { id, serviceName, servicePrice } = service;
  const { icon, color, grad } = getServiceMeta(serviceName);
  const headerGrad = isNew ? "linear-gradient(135deg,#065F46,#059669)" : isUpdate ? "linear-gradient(135deg,#1E3A8A,#2563EB)" : grad;
  const headerLabel = isNew ? "SERVICE CREATED" : isUpdate ? "SERVICE UPDATED" : "SERVICE";

  return (
    <div className="svb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-[13px] bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="text-xl font-extrabold text-white leading-tight">{serviceName}</div>
          </div>
        </div>
        <span className="svb-mono text-[13px] text-white/50">ID #{id}</span>
      </div>
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-x-5 gap-y-3.5 max-sm:grid-cols-1">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🗂️ Service ID</div>
            <div className="svb-mono text-sm font-semibold text-gray-900">#{id}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🏷️ Name</div>
            <div className="text-sm font-semibold text-gray-900">{serviceName}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">💰 Price</div>
            <div className="svb-mono text-[18px] font-black" style={{ color }}>{fmtMoney(servicePrice)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "svb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="svb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
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
    <div className="svb-error-card rounded-[14px] overflow-hidden border border-red-200">
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
          <pre className="svb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const ServiceResultBox: React.FC<ServiceResultBoxProps> = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return (
      <div className="svb-root mt-4">
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
  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as Service).id === undefined;
  const isSingle     = isObj && !isError && (data as Service).id !== undefined && (data as Service).serviceName !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="svb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SingleServiceCard service={data as Service} isNew={isNew} isUpdate={isUpdate} />}
      {isArray && (data as Service[]).length === 0 && (
        <div className="svb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-sm font-semibold text-gray-600">No services found</div>
        </div>
      )}
      {isArray && (data as Service[]).length > 0 && <ServiceGrid services={data as Service[]} />}
    </div>
  );
};

export default ServiceResultBox;