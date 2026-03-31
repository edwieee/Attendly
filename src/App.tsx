import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Layout from './components/Layout';
import VisuallyEnhancedEmailLogin from './pages/VisuallyEnhancedEmailLogin';
import PolishedStudentSignup from './pages/PolishedStudentSignup';
import EnhancedStudentDashboardOverview from './pages/EnhancedStudentDashboardOverview';
import RefinedMarkAttendanceWithSubject from './pages/RefinedMarkAttendanceWithSubject';
import RefinedStudentAdditionModalWithId from './pages/RefinedStudentAdditionModalWithId';
import ModernizedClassAnalyticsVariation3 from './pages/ModernizedClassAnalyticsVariation3';
import RefinedAttendanceReportWithSubjectMetrics from './pages/RefinedAttendanceReportWithSubjectMetrics';

// Bypassed Gateway - No longer requires a session or role check
const PublicGateway = () => {
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
          
          {/* Admin Routes (Bypassed) */}
          <Route path="/admin" element={<Layout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<EnhancedStudentDashboardOverview />} />
            <Route path="add-student" element={<RefinedStudentAdditionModalWithId />} />
            <Route path="mark-attendance" element={<RefinedMarkAttendanceWithSubject />} />
            <Route path="analytics" element={<ModernizedClassAnalyticsVariation3 />} />
            <Route path="reports" element={<RefinedAttendanceReportWithSubjectMetrics />} />
          </Route>

          {/* Student Routes (Bypassed) */}
          <Route path="/student" element={<Layout isStudentView />}>
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<EnhancedStudentDashboardOverview isStudentView />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
