import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';

const PointsSystem = () => {
  const [points, setPoints] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await api.get('/leaderboard/points-system');
        setPoints(res.data.data);
      } catch (err) {
        setPoints(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  const genderBg = {
    Boys: 'bg-blue-50',
    Girls: 'bg-pink-50',
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Points System</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          How points are awarded for each sport and position
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
        ) : !points ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Points system data not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(points).map(([category, games]) => (
              <div
                key={category}
                className={`rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 ${genderBg[category] || 'bg-gray-50 dark:bg-gray-700'}`}
              >
                <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">{category}</h2>
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">Game</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-yellow-600 uppercase">🥇 1st</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase">🥈 2nd</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-orange-700 uppercase">🥉 3rd</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(games).map(([game, pts]) => (
                      <tr key={game} className="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                        <td className="px-4 py-2 font-semibold text-gray-900 dark:text-white">{game}</td>
                        <td className="px-4 py-2 text-yellow-600 font-bold">{pts.first}</td>
                        <td className="px-4 py-2 text-gray-500 font-bold">{pts.second}</td>
                        <td className="px-4 py-2 text-orange-700 font-bold">{pts.third}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PointsSystem; 