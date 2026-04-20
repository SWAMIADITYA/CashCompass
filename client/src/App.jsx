import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import { getCurrentUser } from './api/authApi';


function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setCurrentPage('login');
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.data);
        setCurrentPage('dashboard');
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentPage('login');
      } finally {
        setCheckingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (checkingAuth) {
    return <div className="loading-screen">Checking authentication...</div>;
  }

  if (!user) {
    if (currentPage === 'register') {
      return <Register onGoToLogin={() => setCurrentPage('login')} />;
    }

    return (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onGoToRegister={() => setCurrentPage('register')}
      />
    );
  }

  if (currentPage === 'transactions') {
    return (
      <Transactions
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  if (currentPage === 'budgets') {
    return (
      <Budgets
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  if (currentPage === 'insights') {
    return (
      <Insights
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
      />
    );
  }

  return (
    <Dashboard
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      user={user}
    />
  );
}

export default App;