import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "./protected-route";
import { LocalStorageKey } from "./utils/local-storage";
import Backdrop from '@mui/material/Backdrop';
import { useUserController, setUser, setLoadingOverlay } from "@/context/user";
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  useEffect(() => {
    // get the user from the local storage
    const token = localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
    setIsLoggedIn(!!token);
  }, [localStorage.getItem(LocalStorageKey.ACCESS_TOKEN)])

  const [useController, dispatchController] = useUserController();
  const { loadingOverlay } = useController;
  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingOverlay}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        theme="dark"
      />
      <Routes>
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Route>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
      </Routes>
    </>
  );
}

export default App;
