function SummaryCard({ title, value, icon, type }) {
  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-icon">{icon}</div>
      <div>
        <p className="summary-title">{title}</p>
        <h3 className="summary-value">{value}</h3>
      </div>
    </div>
  );
}

export default SummaryCard;