import { motion } from 'framer-motion';

const PointsSystem = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Points System</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Understanding how points are awarded
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center"
      >
        <div className="text-6xl mb-4">⭐</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Points System Coming Soon
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This page will explain the scoring system for different sports events.
        </p>
      </motion.div>
    </div>
  );
};

export default PointsSystem; 