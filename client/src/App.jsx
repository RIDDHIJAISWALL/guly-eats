import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import queryClient from '@/lib/queryClient';

import useAuthStore from '@/stores/authStore';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/layout/PageTransition';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import SkeletonLoader from '@/components/common/SkeletonLoader';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('@/pages/Home'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AboutUs = lazy(() => import('@/pages/AboutUs'));

const Cities = lazy(() => import('@/pages/Cities'));
const CityExplore = lazy(() => import('@/pages/CityExplore'));
const FoodDetail = lazy(() => import('@/pages/FoodDetail'));
const DayTripPlanner = lazy(() => import('@/pages/DayTripPlanner'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword'));

// Dashboard Components
const DashboardLayout = lazy(() => import('@/pages/dashboard/DashboardLayout'));
const Profile = lazy(() => import('@/pages/dashboard/Profile'));
const Wishlist = lazy(() => import('@/pages/dashboard/Wishlist'));
const MyItineraries = lazy(() => import('@/pages/dashboard/MyItineraries'));
const MyReviews = lazy(() => import('@/pages/dashboard/MyReviews'));

// Admin Components
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const Dashboard = lazy(() => import('@/pages/admin/Dashboard'));
const ManageUsers = lazy(() => import('@/pages/admin/ManageUsers'));
const ManageContent = lazy(() => import('@/pages/admin/ManageContent'));

// Page loading fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl mb-4 animate-spin-slow">🍛</div>
      <SkeletonLoader variant="text" className="w-32 mx-auto" />
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Pages that should hide the footer (full-screen layouts)
const FULL_SCREEN_ROUTES = ['/cities/', '/trips/plan', '/admin'];

const AppLayout = () => {
  const location = useLocation();
  
  // Hide footer on full-screen pages like CityExplore
  const isFullScreen = FULL_SCREEN_ROUTES.some(route => 
    location.pathname.startsWith(route) && !location.pathname.includes('/places/')
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* We use a fixed padding top for all pages to prevent overlap with the navbar */}
      <main className="flex-1 main-content" style={{ paddingTop: '80px' }}>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <PageTransition>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />

                {/* City & Place routes (Phase 4) */}
                <Route path="/cities" element={<Cities />} />
                <Route path="/cities/:citySlug" element={<CityExplore />} />
                <Route path="/food/:foodSlug" element={<FoodDetail />} />

                {/* Food route (Phase 5) */}
                <Route path="/foods/:slug" element={<FoodDetail />} />

                {/* Trip & Explore routes (Phase 6) */}
                <Route path="/trips/plan" element={<DayTripPlanner />} />

                {/* Auth routes (Phase 2) */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Dashboard routes (Phase 7) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Profile />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="itineraries" element={<MyItineraries />} />
                  <Route path="reviews" element={<MyReviews />} />
                </Route>

                {/* Admin routes (Phase 8) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="content" element={<ManageContent />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </Suspense>
        </ErrorBoundary>
      </main>
      {!isFullScreen && <Footer />}
      {!isFullScreen && <MobileNav />}
    </div>
  );
};

const App = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <AppLayout />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
