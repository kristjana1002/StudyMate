import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/api";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

export default RequireAuth;
