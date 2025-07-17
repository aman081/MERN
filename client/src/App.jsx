import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Leaderboard from './pages/Leaderboard';
import PointsSystem from './pages/PointsSystem';
import Gallery from './pages/Gallery';
import Announcements from './pages/Announcements';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Test from './pages/Test';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminAnnouncementDetail from './pages/AdminAnnouncementDetail';
import AdminAnnouncementComments from './pages/AdminAnnouncementComments';
import AdminEventConclude from './pages/AdminEventConclude';

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/test" element={<Test />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/points-system" element={<PointsSystem />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/announcements" element={<Announcements />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Admin Routes */}
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/announcements/:id" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminAnnouncementDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/announcements/:id/comments" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminAnnouncementComments />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/events/:id/conclude" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminEventConclude />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </Layout>
            
            {/* Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
