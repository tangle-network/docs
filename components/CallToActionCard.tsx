import { cloneElement } from "react";

type CallToActionCardProps = {
  icon: React.ReactElement;
  title: React.ReactNode;
  description: string;
  link: string;
};

const CallToActionCard = ({
  icon,
  title,
  description,
  link,
}: CallToActionCardProps) => {
  return (
    <a
      href={link}
      className="flex items-start max-w-sm p-2 rounded-lg min-h-44 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <div className="flex items-start">
        <div className="mr-4">
          {cloneElement(icon, { className: "size-7 mt-1.5" })}
        </div>
        <div>
          <div className="flex items-center mb-2">
            <h3 className="font-bold tracking-tight underline md:text-lg lg:text-lg text-decoration-line: underline-offset-4 text-linkBlue dark:text-white">
              {title}
            </h3>
          </div>
          <p className="font-normal text-gray-900 text-md dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default CallToActionCard;
