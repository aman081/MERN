import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';

const statusColors = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Concluded: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const genderBg = {
  Boys: 'bg-blue-50',
  Girls: 'bg-pink-50',
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [showWinners, setShowWinners] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data.data);
      } catch (err) {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        Event not found.
        <div className="mt-4">
          <Link to="/events" className="text-blue-600 hover:underline">Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`card p-0 overflow-hidden shadow-xl rounded-3xl border-0 ${genderBg[event.category] || ''}`}
      >
        {event.coverImage && (
          <div className="w-full h-64 md:h-80 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            <img
              src={event.coverImage}
              alt={event.name}
              className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
              style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}
            />
          </div>
        )}
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`badge font-bold ${statusColors[event.status]}`}>{event.status}</span>
            <span className="badge badge-primary">{event.eventType}</span>
            <span className="badge badge-success">{event.category}</span>
            <span className="badge badge-outline">{event.gameType}</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight leading-tight drop-shadow-lg">{event.name}</h1>
          <div className="flex flex-wrap gap-4 text-base text-gray-600 dark:text-gray-300 mb-3">
            <div><strong>Venue:</strong> {event.venue}</div>
            <div><strong>Date:</strong> {new Date(event.day).toLocaleDateString()}</div>
            <div><strong>Time:</strong> {event.time}</div>
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-200 mb-4 font-medium italic">{event.description}</div>
          {/* Event Result for Concluded Events */}
          {event.status === 'Concluded' && event.result && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 flex items-center gap-2">
              <span className="text-lg font-bold text-green-700 dark:text-green-300">Result:</span>
              <span className="text-base text-gray-900 dark:text-white">{event.result}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="badge badge-outline">Branches: {event.branchTags && event.branchTags.join(', ')}</span>
          </div>
          {/* Collapsible Points Section */}
          <div className="mt-4">
            <button
              className="text-blue-600 dark:text-blue-300 font-semibold focus:outline-none hover:underline"
              onClick={() => setShowPoints((v) => !v)}
            >
              {showPoints ? 'Hide Points Breakdown' : 'Show Points Breakdown'}
            </button>
            <AnimatePresence>
              {showPoints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 flex gap-4"
                >
                  <span className="badge badge-primary">1st: {event.points?.first}</span>
                  <span className="badge badge-success">2nd: {event.points?.second}</span>
                  <span className="badge badge-warning">3rd: {event.points?.third}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Collapsible Winners Section */}
          {event.winners && event.winners.length > 0 && (
            <div className="mt-4">
              <button
                className="text-green-700 dark:text-green-300 font-semibold focus:outline-none hover:underline"
                onClick={() => setShowWinners((v) => !v)}
              >
                {showWinners ? 'Hide Winners' : 'Show Winners'}
              </button>
              <AnimatePresence>
                {showWinners && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="list-disc ml-6 text-gray-700 dark:text-gray-200 mt-2"
                  >
                    {event.winners.map((winner, idx) => (
                      <li key={idx} className="mb-1">
                        <span className="font-semibold">{winner.position}:</span> {winner.branch} ({winner.points} pts)
                        {winner.playerOfTheMatch && (
                          <span className="ml-2 text-xs text-green-600 dark:text-green-300">Player of the Match: {winner.playerOfTheMatch}</span>
                        )}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
      <div className="text-center mt-6">
        <Link to="/events" className="text-blue-600 hover:underline">← Back to Events</Link>
      </div>
    </div>
  );
};

export default EventDetail; 