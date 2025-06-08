"use client";

import { Hub } from "@/app/actions";
import { GuageIcon, LightningIcon, LockIcon } from "./icons";
import { motion } from "framer-motion";
import { scaleLinear } from "d3-scale";

export const HubView = ({ hub }: { hub: Hub }) => {
  const countToHeight = scaleLinear()
    .domain([0, hub.lights.length])
    .range([0, 32]);

  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full max-h-full">
        <motion.div
          className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg flex flex-col gap-3 justify-center items-center h-full min-h-[120px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-3 bg-blue-500 text-blue-50 dark:bg-blue-300 dark:text-blue-800 rounded-lg">
            <GuageIcon />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Climate</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {`${hub.climate.low}-${hub.climate.high}°C`}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg flex flex-col gap-3 justify-center items-center h-full min-h-[120px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className={`relative p-3 text-zinc-50 size-12 dark:bg-zinc-200 dark:text-amber-900 rounded-lg bg-zinc-300`}
          >
            <div className="size-12 absolute z-20 flex items-center justify-center">
              <LightningIcon />
            </div>
            <motion.div
              className={`absolute bottom-0 left-0 h-3 w-12 bg-amber-500 ${
                hub.lights.filter((hub) => hub.status).length ===
                hub.lights.length
                  ? "rounded-lg"
                  : "rounded-b-lg"
              }`}
              initial={{ height: 0 }}
              animate={{
                height:
                  countToHeight(hub.lights.filter((hub) => hub.status).length) *
                  1.5,
              }}
            />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Lights</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {`${hub.lights.filter((hub) => hub.status).length}/${
                hub.lights.length
              } On`}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg flex flex-col gap-3 justify-center items-center h-full min-h-[120px]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="p-3 bg-green-600 text-green-100 dark:bg-green-200 dark:text-green-900 rounded-lg">
            <LockIcon />
          </div>
          <div className="text-center">
            <div className="text-sm font-medium">Security</div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400">
              {`${hub.locks.filter((hub) => hub.isLocked).length}/${
                hub.locks.length
              } Locked`}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
