import React from "react";
import Link from "next/link";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";

interface GithubRepoCardProps {
  name: string;
  description: string;
  url: string;
  stars?: number;
  forks?: number;
  displayStyle?: "row" | "column";
}

const GithubRepoCard: React.FC<GithubRepoCardProps> = ({
  name,
  description,
  url,
  stars = 0,
  forks = 0,
  displayStyle = "row",
}) => {
  const isRow = displayStyle === "row";

  const [repoData, setRepoData] = React.useState<{
    stars: number;
    forks: number;
    description: string;
    name: string;
    organization?: {
      avatar_url: string;
      login: string;
    };
    language?: string;
    license?: {
      name: string;
    };
    open_issues: number;
  }>({
    stars: stars,
    forks: forks,
    description: description,
    name: name,
    open_issues: 0,
  });

  React.useEffect(() => {
    const fetchRepoData = async () => {
      try {
        const apiUrl = url.replace("github.com", "api.github.com/repos");
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_PAT}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        const data = await response.json();
        setRepoData({
          stars: data.stargazers_count,
          forks: data.forks_count,
          description: data.description || description,
          name: data.name || name,
          organization: data.organization,
          language: data.language,
          license: data.license,
          open_issues: data.open_issues_count,
        });
      } catch (error) {
        console.error("Error fetching repo data:", error);
      }
    };

    fetchRepoData();
  }, [url, name, description]);

  return (
    <Link
      href={url}
      target="_blank"
      className={`
        block w-full 
        border border-gray-200 dark:border-gray-800 
        rounded-lg
        transition-all duration-200
        hover:border-purple-500 dark:hover:border-purple-400
        hover:shadow-md
        ${isRow ? "p-4" : "p-6"}
      `}
    >
      <div
        className={`flex ${isRow ? "flex-row items-center" : "flex-col"} gap-4`}
      >
        {repoData.organization?.avatar_url && (
          <div className="flex-shrink-0">
            <img
              src={repoData.organization.avatar_url}
              alt={`${repoData.organization.login} avatar`}
              className={`
                rounded-full
                ${isRow ? "w-10 h-10" : "w-16 h-16"}
              `}
            />
          </div>
        )}

        <div
          className={`flex-grow ${isRow ? "flex flex-row items-center justify-between" : ""}`}
        >
          <div>
            <h3
              className={`
              font-semibold text-gray-900 dark:text-gray-100
              ${isRow ? "text-lg" : "text-xl mb-2"}
            `}
            >
              {repoData.name}
            </h3>
            <p
              className={`
              text-gray-600 dark:text-gray-400
              ${isRow ? "text-sm hidden md:block" : "text-base mt-2"}
            `}
            >
              {repoData.description}
            </p>

            <div
              className={`
              flex flex-wrap gap-2 items-center
              ${isRow ? "mt-1" : "mt-3"}
              text-sm text-gray-500 dark:text-gray-400
            `}
            >
              {repoData.language && (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  {repoData.language}
                </span>
              )}
              {repoData.license && <span>{repoData.license.name}</span>}
            </div>
          </div>

          <div
            className={`
            flex gap-4 text-gray-600 dark:text-gray-400
            ${isRow ? "ml-4" : "mt-4"}
          `}
          >
            <div className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              <span className="text-sm">{repoData.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaCodeBranch className="text-gray-500 dark:text-gray-400" />
              <span className="text-sm">{repoData.forks}</span>
            </div>
            {repoData.open_issues > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm">{repoData.open_issues} issues</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GithubRepoCard;

interface GithubRepoListProps {
  repos: {
    name: string;
    description: string;
    url: string;
    stars?: number;
    forks?: number;
  }[];
  displayStyle?: "row" | "column";
  className?: string;
}

export const GithubRepoList: React.FC<GithubRepoListProps> = ({
  repos,
  displayStyle = "column",
  className = "",
}) => {
  return (
    <div
      className={`
        grid gap-4
        ${
          displayStyle === "column"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }
        ${className}
      `}
    >
      {repos.map((repo, index) => (
        <GithubRepoCard
          key={index}
          name={repo.name}
          description={repo.description}
          url={repo.url}
          stars={repo.stars}
          forks={repo.forks}
          displayStyle={displayStyle === "column" ? "column" : "row"}
        />
      ))}
    </div>
  );
};
