import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Users, 
  Image, 
  Megaphone, 
  ArrowRight,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import { useEvents } from '../contexts/EventContext';
import { api } from '../services/api';

const ALL_BRANCHES = ['CSE', 'ECE', 'CE', 'ME', 'EE', 'MME', 'PIE+ECM'];

const Home = () => {
  const { getUpcomingEvents, getActiveEvents } = useEvents();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportsCount, setSportsCount] = useState(13); // fallback

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data.data); // all branches
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    // Fetch sports count from points system
    const fetchSports = async () => {
      try {
        const res = await api.get('/leaderboard/points-system');
        // Count unique games across both Boys and Girls
        const games = new Set();
        Object.values(res.data.data).forEach(category => {
          Object.keys(category).forEach(game => games.add(game));
        });
        setSportsCount(games.size);
      } catch {}
    };
    fetchSports();
  }, []);

  const upcomingEvents = getUpcomingEvents();
  const activeEvents = getActiveEvents();

  const features = [
    {
      name: 'Events',
      description: 'Browse upcoming, active, and concluded sports events',
      icon: Calendar,
      href: '/events',
      color: 'bg-blue-500',
    },
    {
      name: 'Leaderboard',
      description: 'Check branch rankings and points standings',
      icon: Trophy,
      href: '/leaderboard',
      color: 'bg-yellow-500',
    },
    {
      name: 'Points System',
      description: 'View scoring system for different sports',
      icon: Star,
      href: '/points-system',
      color: 'bg-green-500',
    },
    {
      name: 'Gallery',
      description: 'Browse photos from past events',
      icon: Image,
      href: '/gallery',
      color: 'bg-purple-500',
    },
    {
      name: 'Announcements',
      description: 'Stay updated with latest news and updates',
      icon: Megaphone,
      href: '/announcements',
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white"
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-16 sm:px-12 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight sm:text-6xl"
            >
              Urjaa Sports Fest 2025
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-6 text-xl text-blue-100"
            >
              Experience the thrill of competition, the joy of victory, and the spirit of sportsmanship
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Link
                to="/events"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-blue-50 transition-colors"
              >
                View Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/leaderboard"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Check Leaderboard
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Events</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeEvents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Branches</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{ALL_BRANCHES.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sportsCount}+</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Urjaa</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Discover all the features and stay connected with the sports fest
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
            >
              <Link
                to={feature.href}
                className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${feature.color} text-white`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {feature.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Events & Leaderboard */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h3>
              <Link
                to="/events"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event._id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {event.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                        <MapPin className="h-3 w-3" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming events</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Branches</h3>
              <Link
                to="/leaderboard"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((branch, index) => (
                  <div key={branch.branch} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{branch.branch}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {branch.points} pts
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">No leaderboard data</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 