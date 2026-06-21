import LoadingSpinner from './LoadingSpinner';

const Table = ({ columns, data, loading, emptyMessage = 'Nenhum registro encontrado', keyField = 'id', onRowClick }) => {
  const getRowKey = (row, index) => {
    if (row[keyField] !== undefined) return row[keyField];
    if (row._id !== undefined) return row._id;
    return index;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <table className="w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sm:table-header-group hidden">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-2 sm:px-3 py-12 text-center">
                <LoadingSpinner />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-2 sm:px-3 py-12 text-center text-gray-500 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr 
                key={getRowKey(row, index)} 
                className={`hover:bg-gray-50 transition-colors cursor-pointer ${onRowClick ? 'hover:bg-blue-50' : ''} sm:table-row block border-b border-gray-200 last:border-0`}
                onClick={() => onRowClick && onRowClick(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-2 sm:px-3 py-3 text-sm text-gray-700 align-top sm:table-cell block w-full sm:w-auto border-b sm:border-0 border-gray-100 last:border-0">
                    <div className="font-semibold text-gray-900 mb-1 sm:hidden">{col.label}</div>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
