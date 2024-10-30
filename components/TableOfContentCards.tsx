import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface TOCItem {
  title: string;
  href: string;
  subItems?: {
    title: string;
    description?: string;
    href?: string; // Optional href for subitems
  }[];
}

interface TableOfContentCardsProps {
  items: TOCItem[];
}

const TableOfContentCards: React.FC<TableOfContentCardsProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="relative p-5 border border-gray-200 dark:border-gray-800 rounded-lg 
                   hover:border-purple-500 dark:hover:border-purple-400
                   transition-all duration-200 hover:shadow-lg
                   bg-gradient-to-br from-white to-gray-50
                   dark:from-gray-900 dark:to-gray-800"
        >
          <Link href={item.href} className="group block">
            <div className="flex justify-between items-start mb-3">
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 
                           group-hover:text-purple-600 dark:group-hover:text-purple-400
                           transition-colors duration-200"
              >
                {item.title}
              </h3>
              <FaChevronRight
                className="text-gray-400 group-hover:text-purple-500 
                                       transform group-hover:translate-x-1 transition-all"
              />
            </div>
          </Link>

          {item.subItems && (
            <ul className="space-y-2">
              {item.subItems.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <Link
                    href={subItem.href || item.href}
                    className="group flex items-start"
                  >
                    <div
                      className="inline-flex items-start space-x-2 px-2 py-1 rounded-md
                                  hover:bg-purple-50 dark:hover:bg-purple-900/20
                                  transition-colors duration-200"
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 
                                     group-hover:bg-purple-500 flex-shrink-0"
                      />
                      <div
                        className="text-sm text-gray-600 dark:text-gray-400 
                                    group-hover:text-gray-900 dark:group-hover:text-gray-200"
                      >
                        <span className="font-medium">{subItem.title}</span>
                        {subItem.description && (
                          <span className="block text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                            {subItem.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div
            className="absolute inset-0 rounded-lg bg-purple-500/[0.03] 
                         opacity-0 group-hover:opacity-100 transition-opacity 
                         pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
};

export default TableOfContentCards;

// Example usage:
/*
const tocItems = [
  {
    title: "Distributed Validator Infrastructure",
    href: "#distributed-validator-infrastructure",
    subItems: [
      { 
        title: "Obol DVT and validator clusters",
        href: "#obol-dvt" // Optional specific anchor
      },
      { 
        title: "Secure multi-party validation",
        href: "#secure-validation"
      }
    ]
  },
  // ... more items
];

<TableOfContentCards items={tocItems} />
*/
