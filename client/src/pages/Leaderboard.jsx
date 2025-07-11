import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/leaderboard');
        setLeaderboard(res.data.data || []);
      } catch (err) {
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Branch rankings and points standings
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-8"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No leaderboard data found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Rank</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Branch</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Points</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">🥇</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">🥈</th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">🥉</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row, idx) => (
                  <tr key={row.branch} className={idx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'}>
                    <td className="px-4 py-2 font-bold text-blue-600 dark:text-blue-300">{idx + 1}</td>
                    <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{row.branch}</td>
                    <td className="px-4 py-2 text-lg font-bold text-green-700 dark:text-green-300">{row.points}</td>
                    <td className="px-4 py-2 text-yellow-600 font-bold">{row.firstCount || 0}</td>
                    <td className="px-4 py-2 text-gray-500 font-bold">{row.secondCount || 0}</td>
                    <td className="px-4 py-2 text-orange-700 font-bold">{row.thirdCount || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard; 