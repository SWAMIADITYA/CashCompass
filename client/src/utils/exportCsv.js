const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value).replace(/"/g, '""');

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n')
  ) {
    return `"${stringValue}"`;
  }

  return stringValue;
};

export const exportTransactionsToCsv = (transactions = []) => {
  const headers = [
    'ID',
    'Title',
    'Amount',
    'Category',
    'Type',
    'Transaction Date',
    'Notes',
    'Status',
  ];

  const rows = transactions.map((item) => [
    item.id,
    item.title,
    item.amount,
    item.category,
    item.type,
    item.transaction_date
      ? new Date(item.transaction_date).toISOString().split('T')[0]
      : '',
    item.notes || '',
    item.status || '',
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(','),
    ...rows.map((row) => row.map(escapeCsvValue).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `transactions-${new Date().toISOString().split('T')[0]}.csv`;

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};