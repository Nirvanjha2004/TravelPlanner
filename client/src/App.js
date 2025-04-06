import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import PublicRoute from './components/routing/PublicRoute';
import TestRegister from './pages/TestRegister';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const ExperienceDetails = lazy(() => import('./pages/ExperienceDetails'));
const AddExperience = lazy(() => import('./pages/AddExperience'));
const EditExperience = lazy(() => import('./pages/EditExperience'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Explore = lazy(() => import('./pages/Explore'));
const Categories = lazy(() => import('./pages/Categories'));
const Destinations = lazy(() => import('./pages/Destinations'));
const MapExplore = lazy(() => import('./pages/MapExplore'));

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/experience/:id" element={<ExperienceDetails />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/add-experience" element={<PrivateRoute><AddExperience /></PrivateRoute>} />
            <Route path="/edit-experience/:id" element={<PrivateRoute><EditExperience /></PrivateRoute>} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/map" element={<MapExplore />} />
            {process.env.NODE_ENV === 'development' && (
              <Route path="/test-register" element={
                <PublicRoute>
                  <TestRegister />
                </PublicRoute>
              } />
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
