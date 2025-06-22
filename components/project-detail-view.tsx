"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ProjectDetail {
  id: string;
  title: string;
  client: string;
  description: string;
  image: string;
  // Add any other fields that might come from the API
  [key: string]: any;
}

interface ProjectDetailViewProps {
  projectId: string;
  onBack?: () => void;
}

export const ProjectDetailView = ({
  projectId,
  onBack,
}: ProjectDetailViewProps) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        console.log("Fetching project detail for ID:", projectId);
        const response = await fetch(`/api/projects/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Project detail API response:", data);
        setProject(data.project || data);
      } catch (err) {
        console.error("Error fetching project detail:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch project details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProjectDetail();
    }
  }, [projectId]);

  if (loading) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Loading project details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">
            Error loading project
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Project not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-white dark:bg-zinc-900 flex flex-col"
    >
      {/* Back Button */}
      {onBack && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={onBack}
          className="absolute top-4 left-4 z-20 flex items-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm p-2 rounded-lg"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="hidden sm:inline">Back to Projects</span>
        </motion.button>
      )}

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 overflow-hidden">
        {/* Left Column: Image */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling;
                if (fallback) {
                  fallback.classList.remove("hidden");
                }
              }}
            />
          ) : null}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
              project.image ? "hidden" : ""
            }`}
          >
            <span className="text-white text-8xl font-bold opacity-80">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        </motion.div>

        {/* Right Column: Details */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="overflow-y-auto h-full px-6 pt-6 pb-16 lg:px-8 lg:pt-8"
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow">
              <h1 className="text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
                {project.title}
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8">
                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    Client
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                    {project.client}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                    Project ID
                  </h3>
                  <p className="text-zinc-700 dark:text-zinc-300 text-lg">
                    {project.id}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                  Description
                </h3>
                <div
                  className="project-description prose prose-lg prose-zinc dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
              </div>

              {/* Additional project details */}
              {Object.entries(project).map(([key, value]) => {
                if (
                  ["id", "title", "client", "description", "image"].includes(
                    key
                  )
                ) {
                  return null;
                }
                if (typeof value === "string" || typeof value === "number") {
                  return (
                    <div key={key} className="mt-8">
                      <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2 capitalize">
                        {key.replace(/_/g, " ")}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                        {value}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
