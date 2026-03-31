import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Student Registration is disabled as per institutional policy.
 * All student accounts must be created by an administrator.
 */
export default function PolishedStudentSignup() {
  return <Navigate to="/login" replace />;
}