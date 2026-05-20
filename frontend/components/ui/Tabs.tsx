import { FC } from "react";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Tabs: FC<TabsProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200  dark:border-neutral-700 justify-evenly">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition relative cursor-pointer
            ${
              activeTab === tab.id
                ? "text-indigo-600 dark:text-indigo-300"
                : "text-gray-600 dark:text-gray-300 hover:text-indigo-500"
            }
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-indigo-600" />
          )}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
