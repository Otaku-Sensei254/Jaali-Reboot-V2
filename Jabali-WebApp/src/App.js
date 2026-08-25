// src/App.js
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import './index.css';
import './App.css';
import Home from './pages/Home';
import Learning from './pages/Learning';
import Music from './pages/Music';
import Profiles from './pages/Profiles';
import Dashboard from './pages/Dashboard';
import Games from './pages/Games';
import AuthPage from './Components/Auth/AuthPage';
import Sidebar from './Components/Sidebar/Sidebar';
import Topbar from './Components/Topbar/Topbar';
import { AuthProvider, useAuth } from './Components/Context/AuthContext';
import { ThemeProvider, useTheme } from './Components/Context/ThemeContext';
import { LanguageProvider } from './Components/Context/LanguageContext';
import { ChildProvider } from './Components/Context/ChildContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  if (loading) {
    return <div className="auth-loading-screen">Restoring your session…</div>;
  }
  return isLoggedIn ? children : <Navigate to="/auth" replace />;
};

const AppShell = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main">
        <Topbar onMenuOpen={() => setSidebarOpen(true)} />
        <main className="app-content" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/',
    element: <Navigate to="/app" replace />,
  },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'learning', element: <Learning /> },
      { path: 'music', element: <Music /> },
      { path: 'profiles', element: <Profiles /> },
      { path: 'games', element: <Games /> },
    ],
  },
  { path: '*', element: <Navigate to="/auth" replace /> },
]);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <ChildProvider>
            <RouterProvider router={router} />
          </ChildProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
