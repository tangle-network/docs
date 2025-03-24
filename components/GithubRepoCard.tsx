import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCodeBranch, FaStar } from "react-icons/fa";
import { z } from "zod";

const GithubRepoResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  owner: z.object({
    avatar_url: z.string(),
    login: z.string(),
  }),
  language: z.string().nullable().optional(),
  license: z
    .object({
      name: z.string(),
    })
    .nullable()
    .optional(),
  open_issues_count: z.number(),
});

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

  const [repoData, setRepoData] = useState<{
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

  useEffect(() => {
    let isMounted = true;

    const fetchRepoData = async () => {
      try {
        const apiUrl = url.replace("github.com", "api.github.com/repos");
        const response = await fetch(apiUrl, {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch repo data: ${response.status} ${response.statusText}`,
          );
        }

        const data = await response.json();
        const parsedData = GithubRepoResponseSchema.parse(data);

        // Avoid updating state on an unmounted component
        if (!isMounted) {
          return;
        }

        setRepoData({
          stars: parsedData.stargazers_count,
          forks: parsedData.forks_count,
          description: parsedData.description || description,
          name: parsedData.name || name,
          organization: parsedData.owner,
          language: parsedData.language || undefined,
          license: parsedData.license || undefined,
          open_issues: parsedData.open_issues_count,
        });
      } catch (error) {
        console.error("Error fetching repo data:", error);
      }
    };

    fetchRepoData();

    return () => {
      isMounted = false;
    };
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
            <Image
              src={repoData.organization.avatar_url}
              alt={`${repoData.organization.login} avatar`}
              width={isRow ? 40 : 64}
              height={isRow ? 40 : 64}
              className="rounded-full"
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
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
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
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
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
