function Header({ user, onLogout }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="header">
      <div>
        {/* <p className="eyebrow">Smart finance tracking</p>
        <h1>Dashboard</h1> */}
        <span className="header-date">{today}</span>
      </div>

      <div className="header-actions">
        <div className="profile-chip">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <strong>{user?.name || 'User'}</strong>
            <p>{user?.email || 'Logged in'}</p>
          </div>
        </div>

        <button className="secondary-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;