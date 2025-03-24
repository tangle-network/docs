import React from "react";
import DiscordBanner from "./DiscordBanner";

const Footer = () => {
  return (
    <footer className="w-full pt-2">
      <DiscordBanner />
      <div className="w-full p-4 border-t border-gray-700 shadow bg-tangleLogoTextColor md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
        <span className="text-sm !text-gray-300 sm:text-center">
          © 2024{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Tangle Foundation
          </a>
          . All Rights Reserved.
        </span>
        <ul className="flex flex-wrap items-center gap-5 mt-3 text-sm font-medium !text-gray-300 sm:mt-0">
          <li>
            <a href="mailto:hello@tangle.tools" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
