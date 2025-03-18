import { DiscordIcon, GitHubIcon } from "nextra/icons";
import { TelegramIcon, TwitterIcon } from "./Icons";

function Github() {
  return (
    <a
      href="https://github.com/tangle-network/tangle"
      className="hidden p-2 text-current sm:flex hover:opacity-75"
      title="Tangle GitHub repo"
      target="_blank"
      rel="noreferrer"
    >
      {/* Nextra icons have a <title> attribute providing alt text */}
      <GitHubIcon />
    </a>
  );
}

function Telegram() {
  return (
    <a
      href="https://t.me/tanglenet"
      className="hidden p-2 text-current sm:flex hover:opacity-75"
      title="The Core Dev Tangle's Telegram"
      target="_blank"
      rel="noreferrer"
    >
      {/* Nextra icons have a <title> attribute providing alt text */}
      <TelegramIcon />
    </a>
  );
}

function Twitter() {
  return (
    <a
      href="https://twitter.com/tangle_network"
      className="hidden p-2 text-current sm:flex hover:opacity-75"
      title="Tangle Network Twitter"
      target="_blank"
      rel="noreferrer"
    >
      {/* Nextra icons have a <title> attribute providing alt text */}
      <TwitterIcon />
    </a>
  );
}

function Discord() {
  return (
    <a
      href="https://discord.com/invite/cv8EfJu3Tn"
      className="hidden p-2 text-current sm:flex hover:opacity-75"
      title="Discord"
      target="_blank"
      rel="noreferrer"
    >
      <DiscordIcon />
    </a>
  );
}

export { Github, Discord, Telegram, Twitter };
