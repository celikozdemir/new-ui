"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className={`flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
        <BotIcon />
      </div>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  // Check if content is a React component (tool response) vs string (text message)
  const isToolResponse = typeof content !== "string";

  return (
    <motion.div
      className={`flex flex-row gap-4 w-full ${
        isToolResponse
          ? "px-0"
          : "px-4 md:w-[500px] md:px-0 first-of-type:pt-20"
      }`}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {!isToolResponse && (
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          {role === "assistant" ? <BotIcon /> : <UserIcon />}
        </div>
      )}

      <div
        className={`flex flex-col gap-1 w-full ${
          isToolResponse ? "h-full" : ""
        }`}
      >
        <div
          className={`text-zinc-800 dark:text-zinc-300 flex flex-col gap-4 ${
            isToolResponse ? "h-full" : ""
          }`}
        >
          {content}
        </div>
      </div>
    </motion.div>
  );
};
