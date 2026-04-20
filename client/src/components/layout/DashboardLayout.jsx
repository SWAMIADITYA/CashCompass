import Sidebar from './Sidebar';
import Header from './Header';

function DashboardLayout({ children, user, onLogout, currentPage, onNavigate }) {
  return (
    <div className="dashboard-shell">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="dashboard-main">
        <Header user={user} onLogout={onLogout} />
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;