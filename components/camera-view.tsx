"use client";

import { motion } from "framer-motion";

export const CameraView = () => {
  return (
    <div className="w-full h-full bg-white dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col justify-end shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              objectFit: "cover",
              borderRadius: "0.5rem",
              background: `url('/yard.jpg') no-repeat center center / cover`,
            }}
          >
            <div className="text-sm px-3 py-2 bg-white/90 backdrop-blur-sm text-zinc-900 w-fit rounded-md font-medium shadow-sm">
              Front Yard
            </div>
          </motion.div>

          <motion.div
            className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col justify-end shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              objectFit: "cover",
              borderRadius: "0.5rem",
              background: `url('/patio.jpg') no-repeat center center / cover`,
            }}
          >
            <div className="text-sm px-3 py-2 bg-white/90 backdrop-blur-sm text-zinc-900 w-fit rounded-md font-medium shadow-sm">
              Patio
            </div>
          </motion.div>

          <motion.div
            className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 flex flex-col justify-end shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              objectFit: "cover",
              borderRadius: "0.5rem",
              background: `url('/side.jpg') no-repeat center center / cover`,
            }}
          >
            <div className="text-sm px-3 py-2 bg-white/90 backdrop-blur-sm text-zinc-900 w-fit rounded-md font-medium shadow-sm">
              Side Yard
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
