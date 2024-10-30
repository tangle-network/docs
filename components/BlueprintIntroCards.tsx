import React from "react";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

const BlueprintIntroCards = () => {
  const cards = [
    {
      title: "Tangle's Blueprint Gadget SDK",
      description:
        "Learn about the Gadget SDK and how to get started building your own gadgets.",
      link: "/developers/gadget-sdk",
    },
    {
      title: "Hello World Blueprint",
      description:
        "Get started with a simple Hello World example using Tangle Blueprints.",
      link: "/developers/tangle-avs",
    },
    {
      title: "Build an Eigenlayer AVS",
      description:
        "Build an Eigenlayer AVS with the Tangle Blueprint SDK and hook into a variety of EVM compatible utilities for task automation, slashing, and more.",
      link: "/developers/eigenlayer-avs",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className="relative p-5 border border-gray-200 dark:border-gray-800 rounded-lg 
                   hover:border-purple-500 dark:hover:border-purple-400
                   transition-all duration-200 hover:shadow-lg
                   bg-gradient-to-br from-white to-gray-50
                   dark:from-gray-900 dark:to-gray-800"
        >
          <Link href={card.link} className="group block">
            <div className="flex justify-between items-start mb-3">
              <h3
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 
                           group-hover:text-purple-600 dark:group-hover:text-purple-400
                           transition-colors duration-200"
              >
                {card.title}
              </h3>
              <FaChevronRight
                className="text-gray-400 group-hover:text-purple-500 
                                       transform group-hover:translate-x-1 transition-all"
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
          </Link>

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

export default BlueprintIntroCards;
