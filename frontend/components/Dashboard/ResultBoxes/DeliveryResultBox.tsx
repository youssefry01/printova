/**
 * DeliveryResultBox.tsx
 * Result renderer for delivery-order API responses.
 */

import React, { useState } from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  orderItemId: number | string;
  partId: number | string;
  stockId: number | string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderRecord {
  orderId: number | string;
  customerId?: number | string;
  deliveryUserId?: number | string;
  paymentMethod?: string;
  totalAmount?: number;
  serviceId?: number | string;
  servicePrice?: number;
  address?: string;
  completedAt?: string;
  createdAt?: string;
  orderStatus?: string;
  items?: OrderItem[];
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  orderId?: undefined;
  [key: string]: unknown;
}

type OrderResultData = OrderRecord | OrderRecord[] | ErrorData | null | undefined;

interface DeliveryResultBoxProps { data: OrderResultData; }
interface OrderCardProps      { record: OrderRecord; index?: number; isCompleteResult?: boolean; }
interface SummaryStripProps   { records: OrderRecord[]; }
interface ItemsTableProps     { items?: OrderItem[]; }
interface StatusBadgeProps    { status?: string; }
interface FieldProps          { label: string; value?: string | null; mono?: boolean; accent?: boolean; }
interface ErrorCardProps      { data: ErrorData; }

// ─── status config ────────────────────────────────────────────────────────────
interface StatusMeta { color: string; bg: string; border: string; }

const STATUS: Record<string, StatusMeta> = {
  Pending:   { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  Completed: { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  Cancelled: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
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

  @keyframes orb-fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0);    }
  }
  @keyframes orb-pop {
    0%   { transform: scale(.92); opacity: 0; }
    60%  { transform: scale(1.03);            }
    100% { transform: scale(1);   opacity: 1; }
  }
  @keyframes orb-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(13,148,136,.4); }
    70%  { box-shadow: 0 0 0 10px rgba(13,148,136,0); }
    100% { box-shadow: 0 0 0 0 rgba(13,148,136,0);   }
  }

  .orb-root * { box-sizing: border-box; font-family: 'Sora', sans-serif; }
  .orb-mono   { font-family: 'DM Mono', monospace !important; }

  .orb-card { animation: orb-fadeUp .38s cubic-bezier(.22,1,.36,1) both; }
  .orb-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,.08), 0 20px 48px rgba(13,148,136,.15);
    transform: translateY(-2px);
  }

  .orb-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orb-table th {
    text-align: left; padding: 7px 10px;
    font-size: 10px; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: #9CA3AF;
    background: #F9FAFB; border-bottom: 1px solid #E5E7EB;
  }
  .orb-table td {
    padding: 9px 10px; border-bottom: 1px solid #F3F4F6;
    color: #374151; vertical-align: middle;
  }
  .orb-table tr:last-child td { border-bottom: none; }
  .orb-table tr:hover td { background: #F0FDFA; }

  .orb-toggle {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 12px; border-radius: 8px; border: 1px solid #99F6E4;
    background: #F0FDFA; color: #0F766E;
    font-size: 12px; font-weight: 700; cursor: pointer;
    transition: background .15s, border-color .15s;
    font-family: 'Sora', sans-serif;
  }
  .orb-toggle:hover { background: #99F6E4; border-color: #0D9488; }

  .orb-items-reveal { animation: orb-pop .25s cubic-bezier(.22,1,.36,1) both; }
  .orb-error-card   { animation: orb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .orb-empty-state  { animation: orb-pop .35s cubic-bezier(.22,1,.36,1) both; }

  @media (max-width: 480px) {
    .orb-ids-grid    { grid-template-columns: 1fr 1fr !important; }
    .orb-dates-grid  { grid-template-columns: 1fr !important; }
    .orb-money-flex  { flex-direction: column !important; }
    .orb-summary-row { flex-direction: column !important; }
    .orb-total       { font-size: 20px !important; }
    .orb-table th, .orb-table td { padding: 6px 6px !important; font-size: 11px !important; }
  }
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const m = STATUS[status ?? ""] ?? { color: "#9CA3AF", bg: "#F3F4F6", border: "#E5E7EB" };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide border"
      style={{ color: m.color, background: m.bg, borderColor: m.border }}>
      <span className="w-1.75 h-1.75 rounded-full shrink-0" style={{ background: m.color }} />
      {(status ?? "UNKNOWN").toUpperCase()}
    </span>
  );
};

// ─── Field ────────────────────────────────────────────────────────────────────
const Field: React.FC<FieldProps> = ({ label, value, mono, accent }) => (
  <div>
    <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">{label}</div>
    <div className={`text-sm font-semibold ${mono ? "orb-mono" : ""}`} style={{ color: accent ? "#0D9488" : "#111827" }}>
      {value ?? "—"}
    </div>
  </div>
);

// ─── Items Table ──────────────────────────────────────────────────────────────
const ItemsTable: React.FC<ItemsTableProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
          📦 Order Items ({items.length})
        </div>
        <button className="orb-toggle" onClick={() => setOpen((o) => !o)}>
          <span className="text-[13px]">{open ? "▲" : "▼"}</span>
          {open ? "Hide Items" : "Show Items"}
        </button>
      </div>

      {open && (
        <div className="orb-items-reveal rounded-[10px] overflow-hidden border border-gray-200">
          <table className="orb-table">
            <thead>
              <tr>
                {["#", "Item ID", "Part ID", "Stock ID", "Qty", "Unit Price", "Total"].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.orderItemId}>
                  <td className="text-gray-400 font-semibold">{i + 1}</td>
                  <td className="orb-mono font-bold text-teal-700">#{item.orderItemId}</td>
                  <td className="orb-mono">#{item.partId}</td>
                  <td className="orb-mono">#{item.stockId}</td>
                  <td>
                    <span className="inline-block px-2 py-0.5 rounded-[5px] bg-teal-50 text-teal-700 font-bold text-xs">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="orb-mono">{fmtMoney(item.unitPrice)}</td>
                  <td className="orb-mono font-bold text-gray-900">{fmtMoney(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6} className="orb-mono px-2.5 py-2 text-right text-[11px] font-bold tracking-widest uppercase text-gray-400 bg-gray-50 border-t border-gray-200">
                  Items Subtotal
                </td>
                <td className="orb-mono px-2.5 py-2 font-extrabold text-teal-600 bg-gray-50 border-t border-gray-200">
                  {fmtMoney(items.reduce((s, it) => s + it.totalPrice, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

// ─── Order Card ───────────────────────────────────────────────────────────────
const OrderCard: React.FC<OrderCardProps> = ({ record, index = 0, isCompleteResult = false }) => {
  const { orderId, customerId, deliveryUserId, paymentMethod, totalAmount, serviceId, servicePrice, address, completedAt, createdAt, orderStatus, items } = record;
  const headerGrad = isCompleteResult
    ? "linear-gradient(135deg, #065F46 0%, #059669 100%)"
    : "linear-gradient(135deg, #0F766E 0%, #0D9488 100%)";

  return (
    <div className="orb-card bg-white rounded-[18px] overflow-hidden transition-all duration-200"
      style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06), 0 12px 32px rgba(0,0,0,.08)", animationDelay: `${index * 90}ms` }}>

      {/* header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3">
          <div className="w-10.5 h-10.5 rounded-xl bg-white/20 flex items-center justify-center text-xl shrink-0"
            style={{ animation: isCompleteResult ? "orb-pulse 1.8s ease-out 1" : "none" }}>
            {isCompleteResult ? "✅" : "🚚"}
          </div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">
              {isCompleteResult ? "ORDER COMPLETED" : "DELIVERY ORDER"}
            </div>
            <div className="orb-mono text-xl font-bold text-white">#{orderId}</div>
          </div>
        </div>
        <StatusBadge status={orderStatus} />
      </div>

      {/* body */}
      <div className="px-5 py-4">
        {address && (
          <div className="flex items-start gap-2.5 bg-teal-50 border-l-[3px] border-teal-500 rounded-r-[10px] px-3.5 py-2.5 mb-4">
            <span className="text-[15px] mt-0.5 shrink-0">📍</span>
            <span className="text-sm text-teal-700 font-semibold">{address}</span>
          </div>
        )}

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="orb-ids-grid grid grid-cols-3 gap-x-5 gap-y-3 mb-4">
          <Field label="👤 Customer ID"  value={`#${customerId}`}     mono />
          <Field label="🚴 Delivery Guy" value={`#${deliveryUserId}`} mono />
          <Field label="🗂️ Service ID"   value={`#${serviceId}`}      mono />
        </div>

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="orb-money-flex flex items-center flex-wrap gap-x-7 gap-y-3 mb-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">💳 Payment Method</div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200 mt-1">
              {paymentMethod}
            </span>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">🏷️ Service Price</div>
            <div className="orb-mono text-sm font-semibold text-gray-900 mt-1">{fmtMoney(servicePrice)}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400">TOTAL AMOUNT</div>
            <div className="orb-mono orb-total text-[26px] font-extrabold text-teal-600 mt-0.5">{fmtMoney(totalAmount)}</div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="mb-4">
          <ItemsTable items={items} />
        </div>

        <div className="h-px bg-gray-100 my-3.5" />

        <div className="orb-dates-grid grid grid-cols-2 gap-x-5 gap-y-2.5">
          <Field label="✅ Completed At" value={fmtDate(completedAt) ?? "Not yet"} />
          <Field label="🕐 Created At"   value={fmtDate(createdAt) ?? undefined}   accent />
        </div>
      </div>
    </div>
  );
};

// ─── Summary Strip ────────────────────────────────────────────────────────────
const SummaryStrip: React.FC<SummaryStripProps> = ({ records }) => {
  const counts = records.reduce<Record<string, number>>((acc, r) => {
    const s = r.orderStatus ?? "Unknown";
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const pills = [
    { label: "Total",     value: records.length,          color: "#0D9488", bg: "#F0FDFA" },
    { label: "Pending",   value: counts.Pending   ?? 0,   color: "#D97706", bg: "#FFFBEB" },
    { label: "Completed", value: counts.Completed ?? 0,   color: "#059669", bg: "#ECFDF5" },
    { label: "Cancelled", value: counts.Cancelled ?? 0,   color: "#DC2626", bg: "#FEF2F2" },
  ];

  return (
    <div className="orb-summary-row flex gap-2.5 flex-wrap mb-4">
      {pills.map(({ label, value, color, bg }) => (
        <div key={label} className="flex items-center gap-2 px-3.5 py-2 rounded-[10px] border flex-1 basis-27.5"
          style={{ borderColor: `${color}30`, background: bg }}>
          <div className="w-9 h-9 rounded-[9px] flex items-center justify-center font-extrabold text-base shrink-0"
            style={{ background: `${color}18`, color }}>{value}</div>
          <div>
            <div className="text-[11px] text-gray-400 font-semibold">{label}</div>
            <div className="text-[13px] font-bold" style={{ color }}>order{value !== 1 ? "s" : ""}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
  <div className="orb-empty-state py-9 px-6 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
    <div className="text-4xl mb-2.5">📭</div>
    <div className="text-[15px] font-semibold text-gray-600">No orders found</div>
    <div className="text-[13px] mt-1">Try a different status filter</div>
  </div>
);

// ─── Error Card ───────────────────────────────────────────────────────────────
const ErrorCard: React.FC<ErrorCardProps> = ({ data }) => {
  const message = data?.error ?? data?.message ?? null;
  const hasExtra = Object.keys(data).some((k) => !["error", "message", "success"].includes(k));
  return (
    <div className="orb-error-card rounded-[14px] overflow-hidden border border-red-200">
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
          <pre className="orb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const DeliveryResultBox: React.FC<DeliveryResultBoxProps> = ({ data }) => {
  if (data === null || data === undefined) return null;

  const isError =
    typeof data === "object" && !Array.isArray(data) &&
    (
      (data as ErrorData).success === false ||
      (data as ErrorData).error !== undefined ||
      ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400) ||
      ((data as ErrorData).message !== undefined && (data as OrderRecord).orderId === undefined)
    );

  const isSingleRecord =
    !isError &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    (data as OrderRecord).orderId !== undefined;

  const isArray = Array.isArray(data);

  return (
    <div className="orb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError && <ErrorCard data={data as ErrorData} />}
      {isSingleRecord && (
        <OrderCard
          record={data as OrderRecord}
          index={0}
          isCompleteResult={(data as OrderRecord).orderStatus === "Completed"}
        />
      )}
      {isArray && (data as OrderRecord[]).length === 0 && <EmptyState />}
      {isArray && (data as OrderRecord[]).length > 0 && (
        <>
          <SummaryStrip records={data as OrderRecord[]} />
          <div className="flex flex-col gap-4">
            {(data as OrderRecord[]).map((r, i) => (
              <OrderCard key={r.orderId} record={r} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryResultBox;