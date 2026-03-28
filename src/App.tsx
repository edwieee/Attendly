import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';

import Layout from './components/Layout';
import VisuallyEnhancedEmailLogin from './pages/VisuallyEnhancedEmailLogin';
import PolishedStudentSignup from './pages/PolishedStudentSignup';
import EnhancedStudentDashboardOverview from './pages/EnhancedStudentDashboardOverview';
import RefinedMarkAttendanceWithSubject from './pages/RefinedMarkAttendanceWithSubject';
import RefinedStudentAdditionModalWithId from './pages/RefinedStudentAdditionModalWithId';
import ModernizedClassAnalyticsVariation3 from './pages/ModernizedClassAnalyticsVariation3';
import RefinedAttendanceReportWithSubjectMetrics from './pages/RefinedAttendanceReportWithSubjectMetrics';

// Guard component to protect routes
const RequireAuth = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<VisuallyEnhancedEmailLogin />} />
          <Route path="/signup" element={<PolishedStudentSignup />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<EnhancedStudentDashboardOverview />} />
              <Route path="add-student" element={<RefinedStudentAdditionModalWithId />} />
              <Route path="mark-attendance" element={<RefinedMarkAttendanceWithSubject />} />
              <Route path="analytics" element={<ModernizedClassAnalyticsVariation3 />} />
              <Route path="reports" element={<RefinedAttendanceReportWithSubjectMetrics />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
