/**
 * CategoryResultBox.tsx
 * Result renderer for category API responses.
 */

import React from "react";

// ─── types ────────────────────────────────────────────────────────────────────
interface Category {
  id: number | string;
  categoryName: string;
  categoryDescription?: string;
}

interface ErrorData {
  success?: boolean;
  error?: string;
  message?: string;
  status?: number;
  [key: string]: unknown;
}

interface SuccessMessage { message: string; id?: undefined; }

type CategoryResultData = Category | Category[] | ErrorData | SuccessMessage | string | null | undefined;

interface CategoryResultBoxProps    { data: CategoryResultData; isNew?: boolean; isUpdate?: boolean; }
interface CategoryTileProps         { cat: Category; index: number; }
interface CategoryGridProps         { categories: Category[]; }
interface SingleCategoryCardProps   { cat: Category; isNew?: boolean; isUpdate?: boolean; }
interface ErrorCardProps            { data: ErrorData; }
interface SuccessCardProps          { message: string; }

// ─── category icon mapping ────────────────────────────────────────────────────
interface CategoryIconMeta { icon: string; color: string; bg: string; border: string; }

const getCategoryIcon = (name = ""): CategoryIconMeta => {
  const n = name.toLowerCase();
  if (n.includes("toner") || n.includes("ink"))        return { icon: "🖨️", color: "#0EA5E9", bg: "#F0F9FF", border: "#BAE6FD" };
  if (n.includes("fuser"))                             return { icon: "🔥", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" };
  if (n.includes("maintenance") || n.includes("kit"))  return { icon: "🧰", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
  if (n.includes("roller"))                            return { icon: "⚙️", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" };
  if (n.includes("drum"))                              return { icon: "🥁", color: "#0F766E", bg: "#F0FDFA", border: "#99F6E4" };
  if (n.includes("formatter") || n.includes("board"))  return { icon: "🖥️", color: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE" };
  return { icon: "📦", color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" };
};

// ─── global styles ────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

  @keyframes cb-up {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes cb-pop {
    0%   { transform:scale(.9);  opacity:0; }
    60%  { transform:scale(1.03);           }
    100% { transform:scale(1);   opacity:1; }
  }
  @keyframes cb-check {
    0%   { stroke-dashoffset:40; }
    100% { stroke-dashoffset:0;  }
  }

  .cb-root * { box-sizing:border-box; font-family:'Sora',sans-serif; }
  .cb-mono   { font-family:'DM Mono',monospace !important; }

  .cb-card { animation:cb-up .35s cubic-bezier(.22,1,.36,1) both; }
  .cb-card:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 18px 40px rgba(234,88,12,.14);
    transform:translateY(-2px);
  }
  .cb-cat-tile {
    animation:cb-up .32s cubic-bezier(.22,1,.36,1) both;
    cursor:default;
  }
  .cb-cat-tile:hover {
    box-shadow:0 4px 8px rgba(0,0,0,.08),0 14px 32px rgba(0,0,0,.1);
    transform:translateY(-3px);
  }
  .cb-success-icon circle { animation:cb-pop .5s cubic-bezier(.22,1,.36,1) both; }
  .cb-success-icon path {
    stroke-dasharray:40; stroke-dashoffset:40;
    animation:cb-check .4s .25s cubic-bezier(.22,1,.36,1) forwards;
  }
  .cb-error-card  { animation:cb-pop .35s cubic-bezier(.22,1,.36,1) both; }
  .cb-empty-state { animation:cb-pop .35s ease both; }

  @media (max-width:480px) {
    .cb-cat-grid    { grid-template-columns:1fr 1fr !important; }
    .cb-detail-grid { grid-template-columns:1fr !important; }
  }
  @media (max-width:340px) {
    .cb-cat-grid { grid-template-columns:1fr !important; }
  }
`;

// ─── Category Tile ────────────────────────────────────────────────────────────
const CategoryTile: React.FC<CategoryTileProps> = ({ cat, index }) => {
  const { id, categoryName, categoryDescription } = cat;
  const { icon, color, bg, border } = getCategoryIcon(categoryName);

  return (
    <div className="cb-cat-tile bg-white rounded-[14px] p-4 flex flex-col gap-2.5 border-t-[3px] transition-all duration-200"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,.07),0 6px 16px rgba(0,0,0,.07)", borderTopColor: color, animationDelay: `${index * 45}ms` }}>
      <div className="flex items-center gap-2.5">
        <div className="w-10.5 h-10.5 rounded-[10px] flex items-center justify-center text-xl shrink-0 border" style={{ background: bg, borderColor: border }}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[13px] font-bold text-gray-900 leading-snug">{categoryName}</div>
          <div className="cb-mono text-[11px] text-gray-400 mt-0.5">ID #{id}</div>
        </div>
      </div>
      {categoryDescription && (
        <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-lg px-2.5 py-1.5">
          {categoryDescription}
        </div>
      )}
    </div>
  );
};

// ─── Category Grid ────────────────────────────────────────────────────────────
const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => (
  <>
    <div className="mb-3.5">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600">
        📦 {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
      </span>
    </div>
    <div className="cb-cat-grid grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
      {categories.map((c, i) => <CategoryTile key={c.id} cat={c} index={i} />)}
    </div>
  </>
);

// ─── Single Category Card ─────────────────────────────────────────────────────
const SingleCategoryCard: React.FC<SingleCategoryCardProps> = ({ cat, isNew = false, isUpdate = false }) => {
  const { id, categoryName, categoryDescription } = cat;
  const { icon, color } = getCategoryIcon(categoryName);

  const headerGrad = isNew
    ? "linear-gradient(135deg,#065F46,#059669)"
    : isUpdate
    ? "linear-gradient(135deg,#1E3A8A,#2563EB)"
    : "linear-gradient(135deg,#9A3412,#EA580C)";

  const headerLabel = isNew ? "CATEGORY CREATED" : isUpdate ? "CATEGORY UPDATED" : "CATEGORY";

  return (
    <div className="cb-card bg-white rounded-2xl overflow-hidden transition-all duration-200" style={{ boxShadow: "0 2px 4px rgba(0,0,0,.06),0 10px 28px rgba(0,0,0,.08)" }}>
      <div className="flex items-center justify-between flex-wrap gap-2.5 px-5 py-4" style={{ background: headerGrad }}>
        <div className="flex items-center gap-3">
          <div className="w-11.5 h-11.5 rounded-xl bg-white/20 flex items-center justify-center text-[22px] shrink-0">{icon}</div>
          <div>
            <div className="text-[11px] text-white/65 font-bold tracking-widest">{headerLabel}</div>
            <div className="text-[19px] font-extrabold text-white leading-tight">{categoryName}</div>
          </div>
        </div>
        <span className="cb-mono text-[13px] text-white/50">ID #{id}</span>
      </div>

      <div className="px-5 py-4">
        <div className="cb-detail-grid grid grid-cols-2 gap-x-5 gap-y-3.5">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🗂️ Category ID</div>
            <div className="cb-mono text-sm font-semibold text-gray-900">#{id}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-0.5">🏷️ Name</div>
            <div className="text-sm font-semibold text-gray-900">{categoryName}</div>
          </div>
        </div>

        {categoryDescription && (
          <>
            <div className="h-px bg-gray-100 my-3.5" />
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">📝 Description</div>
              <div className="text-sm text-gray-700 leading-relaxed bg-gray-50 border-l-[3px] rounded-r-lg px-3 py-2 mt-1"
                style={{ borderLeftColor: color }}>
                {categoryDescription}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ─── Success Toast ────────────────────────────────────────────────────────────
const SuccessCard: React.FC<SuccessCardProps> = ({ message }) => (
  <div className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] bg-emerald-50 border border-emerald-200" style={{ animation: "cb-pop .35s cubic-bezier(.22,1,.36,1) both" }}>
    <svg className="cb-success-icon shrink-0" width="36" height="36" viewBox="0 0 36 36" fill="none">
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
    <div className="cb-error-card rounded-[14px] overflow-hidden border border-red-200">
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
          <pre className="cb-mono m-0 text-[11px] text-red-900 whitespace-pre-wrap wrap-break-word bg-red-100 rounded-lg p-2.5">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

// ─── Root Export ──────────────────────────────────────────────────────────────
const CategoryResultBox: React.FC<CategoryResultBoxProps> = ({ data, isNew = false, isUpdate = false }) => {
  if (data === null || data === undefined) return null;

  if (typeof data === "string") {
    return <div className="cb-root mt-4"><style>{GLOBAL_CSS}</style><SuccessCard message={data} /></div>;
  }

  const isObj   = typeof data === "object" && !Array.isArray(data);
  const isError = isObj && (
    (data as ErrorData).success === false ||
    (data as ErrorData).error !== undefined ||
    ((data as ErrorData).status !== undefined && ((data as ErrorData).status as number) >= 400)
  );
  const isSuccessMsg = isObj && !isError && (data as ErrorData).message !== undefined && (data as Category).id === undefined;
  const isSingle     = isObj && !isError && (data as Category).id !== undefined && (data as Category).categoryName !== undefined;
  const isArray      = Array.isArray(data);

  return (
    <div className="cb-root mt-4">
      <style>{GLOBAL_CSS}</style>
      {isError      && <ErrorCard data={data as ErrorData} />}
      {isSuccessMsg && <SuccessCard message={(data as SuccessMessage).message} />}
      {isSingle     && <SingleCategoryCard cat={data as Category} isNew={isNew} isUpdate={isUpdate} />}
      {isArray && (data as Category[]).length === 0 && (
        <div className="cb-empty-state py-7 px-5 rounded-[14px] border-2 border-dashed border-gray-200 text-center text-gray-400">
          <div className="text-3xl mb-2">📦</div>
          <div className="text-sm font-semibold text-gray-600">No categories found</div>
        </div>
      )}
      {isArray && (data as Category[]).length > 0 && <CategoryGrid categories={data as Category[]} />}
    </div>
  );
};

export default CategoryResultBox;