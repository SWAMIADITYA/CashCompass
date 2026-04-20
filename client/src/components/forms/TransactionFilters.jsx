function TransactionFilters({ filters, onChange, onReset, categories = [] }) {
  return (
    <div className="filters-bar">
      <input
        type="text"
        name="search"
        placeholder="Search title or notes"
        value={filters.search}
        onChange={onChange}
      />

      <select name="type" value={filters.type} onChange={onChange}>
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <select name="category" value={filters.category} onChange={onChange}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={onChange}
      />

      <input
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={onChange}
      />

      <button type="button" className="secondary-btn" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default TransactionFilters;