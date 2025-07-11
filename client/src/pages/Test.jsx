import { motion } from 'framer-motion';
import Button from '../components/UI/Button';

const Test = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <span className="text-2xl text-white">🏆</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Urjaa Sports Fest
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            Frontend is working perfectly! 🎉
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <Button variant="primary" size="lg" className="w-full">
              Primary Button
            </Button>
            
            <Button variant="secondary" size="lg" className="w-full">
              Secondary Button
            </Button>
            
            <Button variant="outline" size="lg" className="w-full">
              Outline Button
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
          >
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ React + Vite + Tailwind CSS + Framer Motion
            </p>
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Modern UI Components
            </p>
            <p className="text-green-800 dark:text-green-200 text-sm">
              ✅ Responsive Design
            </p>
          </motion.div>
          
          {/* Test Tailwind classes */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-red-500 text-white p-3 rounded-lg text-center">
              Red Box
            </div>
            <div className="bg-green-500 text-white p-3 rounded-lg text-center">
              Green Box
            </div>
            <div className="bg-blue-500 text-white p-3 rounded-lg text-center">
              Blue Box
            </div>
            <div className="bg-yellow-500 text-white p-3 rounded-lg text-center">
              Yellow Box
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Test; 