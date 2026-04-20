import { FaWallet, FaChartPie, FaMoneyBillTrendUp, FaTableList } from 'react-icons/fa6';

function Sidebar({ currentPage, onNavigate }) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: <FaChartPie /> },
    { id: 'transactions', label: 'Transactions', icon: <FaTableList /> },
    { id: 'budgets', label: 'Budgets', icon: <FaWallet /> },
    { id: 'insights', label: 'Insights', icon: <FaMoneyBillTrendUp /> },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">₹</div>
        <div>
          <h2>CashCompass</h2>
          <p>Personal Finance Hub</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;