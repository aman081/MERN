import { useEvents } from '../contexts/EventContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const statusOrder = ['Active', 'Upcoming', 'Concluded'];
const statusColors = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Concluded: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const genderBg = {
  Boys: 'bg-blue-50',
  Girls: 'bg-pink-50',
};

const Events = () => {
  const { events, loading } = useEvents();

  // Group events by status
  const grouped = statusOrder.map(status => ({
    status,
    events: events.filter(e => e.status === status)
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Browse all sports events and competitions
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
        ) : events.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            No events found.
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(group => (
              <div key={group.status}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${statusColors[group.status]}`}
                  style={{ padding: '0.25rem 0.75rem', borderRadius: '0.5rem', display: group.events.length ? 'inline-flex' : 'none' }}>
                  {group.status} Events
                </h2>
                {group.events.length === 0 ? null : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.events.map(event => (
                      <Link
                        to={`/events/${event._id}`}
                        key={event._id}
                        className={`block rounded-lg shadow hover:shadow-lg transition p-5 border border-gray-200 dark:border-gray-600 ${genderBg[event.category] || 'bg-gray-50 dark:bg-gray-700'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white truncate">{event.name}</span>
                          <span className={`text-xs px-2 py-1 rounded font-bold ${statusColors[event.status]}`}>{event.status}</span>
                        </div>
                        <div className="text-xs text-gray-400 mb-1">{new Date(event.day).toLocaleDateString()} | {event.time}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">{event.venue}</div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="badge badge-primary">{event.eventType}</span>
                          <span className="badge badge-success">{event.category}</span>
                          <span className="badge badge-outline">{event.gameType}</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{event.description}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Events; 