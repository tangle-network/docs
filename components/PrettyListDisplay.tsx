import React, { useState } from "react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

interface ListItem {
  title: string;
  description?: string;
  subItems?: {
    title: string;
    description?: string;
    href?: string;
  }[];
}

interface PrettyListDisplayProps {
  items: ListItem[];
  singleColumn?: boolean;
}

const PrettyListDisplay: React.FC<PrettyListDisplayProps> = ({
  items,
  singleColumn = false,
}) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  // Split items into columns if not single column
  const columnItems = singleColumn
    ? [items]
    : [
        items.filter((_, i) => i % 2 === 0),
        items.filter((_, i) => i % 2 === 1),
      ];

  const renderColumn = (items: ListItem[], columnIndex: number) => (
    <div className="flex flex-col gap-6">
      {items.map((item, itemIndex) => {
        const actualIndex = singleColumn
          ? itemIndex
          : itemIndex * 2 + columnIndex;
        const isExpanded = expandedItems.includes(actualIndex);

        return (
          <div
            key={actualIndex}
            className={`
              group relative overflow-hidden
              bg-white dark:bg-gray-900 
              border border-gray-100 dark:border-gray-800
              rounded-2xl transition-all duration-300
              hover:border-purple-300 dark:hover:border-purple-700
              ${isExpanded ? "shadow-lg shadow-purple-100/50 dark:shadow-purple-900/30" : ""}
            `}
          >
            <button
              onClick={() => toggleItem(actualIndex)}
              className="w-full text-left"
            >
              <div className="p-6 flex flex-col">
                <div className="flex items-start justify-between group cursor-pointer">
                  <h3
                    className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                               bg-clip-text text-transparent"
                  >
                    {item.title}
                  </h3>
                  <div
                    className={`
                    transform transition-transform duration-300
                    ${isExpanded ? "rotate-180" : ""}
                  `}
                  >
                    <svg
                      className="w-6 h-6 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {item.description && (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
              </div>
            </button>

            {item.subItems && item.subItems.length > 0 && (
              <div
                className={`
                overflow-hidden transition-all duration-500 ease-in-out
                ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
              `}
              >
                <div className="p-6 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-800">
                  {item.subItems.map((subItem, subIndex) => {
                    const isGithubLink = subItem.href?.includes("github");

                    const SubItemContent = () => (
                      <>
                        <div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 
                                      rounded-full bg-purple-400 dark:bg-purple-500"
                        />
                        <div className="flex items-center gap-2">
                          {isGithubLink && (
                            <FaGithub className="text-gray-600 dark:text-gray-400" />
                          )}
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {subItem.title}
                          </h4>
                        </div>
                        {subItem.description && (
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {subItem.description}
                          </p>
                        )}
                      </>
                    );

                    return subItem.href ? (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        className="block relative pl-6 py-3 rounded-lg
                                 hover:bg-purple-50 dark:hover:bg-purple-900/10
                                 transition-colors duration-200"
                      >
                        <SubItemContent />
                      </Link>
                    ) : (
                      <div
                        key={subIndex}
                        className="relative pl-6 py-3 rounded-lg
                                 hover:bg-purple-50 dark:hover:bg-purple-900/10
                                 transition-colors duration-200"
                      >
                        <SubItemContent />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 
                            transition-opacity duration-300
                            bg-gradient-to-br from-purple-50/30 via-transparent to-blue-50/30
                            dark:from-purple-900/10 dark:via-transparent dark:to-blue-900/10"
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      className={`grid grid-cols-1 ${singleColumn ? "" : "lg:grid-cols-2"} gap-6 my-8`}
    >
      {columnItems.map((items, i) => renderColumn(items, i))}
    </div>
  );
};

export default PrettyListDisplay;

/*
Usage:

<PrettyListDisplay 
  items={[
    {
      title: "Section Title",
      description: "Optional section description text", 
      subItems: [
        {
          title: "Sub-item Title",
          description: "Optional sub-item description",
          href: "/optional/link/path"
        },
        {
          title: "Another Sub-item"
        }
      ]
    },
    {
      title: "Another Section",
      description: "Another optional description",
      subItems: [
        { title: "Sub-item 1", href: "/path1" },
        { title: "Sub-item 2" }
      ]
    }
  ]}
  singleColumn={false} // Optional, defaults to false for two columns
/>
*/
