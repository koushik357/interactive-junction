
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';

interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
    cell?: (value: any, item: T) => React.ReactNode;
    sortable?: boolean;
  }[];
  onRowClick?: (item: T) => void;
  searchable?: boolean;
  pagination?: boolean;
  itemsPerPage?: number;
}

export function DataTable<T>({
  data,
  columns,
  onRowClick,
  searchable = true,
  pagination = true,
  itemsPerPage = 10,
}: DataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchTerm
    ? data.filter((item) => 
        Object.values(item).some((value) => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Sort data based on sort field and direction
  const sortedData = sortField
    ? [...filteredData].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === bValue) return 0;
        
        // Handle different data types for sorting
        const result = 
          typeof aValue === 'string' && typeof bValue === 'string'
            ? aValue.localeCompare(bValue)
            : aValue < bValue ? -1 : 1;
            
        return sortDirection === 'asc' ? result : -result;
      })
    : filteredData;

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const displayData = pagination
    ? sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : sortedData;

  const handleSort = (accessor: keyof T) => {
    if (sortField === accessor) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(accessor);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="w-full bg-card rounded-xl border border-border overflow-hidden">
      {/* Search bar */}
      {searchable && (
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full h-9 pl-10 pr-4 rounded-md bg-background border-border text-sm focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase bg-secondary text-muted-foreground">
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={index} 
                  className={`px-4 py-3 text-left ${column.sortable ? 'cursor-pointer' : ''}`}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortField === column.accessor && (
                      sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((item, rowIndex) => (
                <tr 
                  key={rowIndex}
                  className={`border-b border-border hover:bg-secondary/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(item)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-4 py-3 whitespace-nowrap">
                      {column.cell ? column.cell(item[column.accessor], item) : String(item[column.accessor] || '')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </div>
          <nav className="flex space-x-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none text-muted-foreground"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show 5 pages at most, centered around the current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[32px] h-8 flex items-center justify-center rounded text-sm ${
                    currentPage === pageNum ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-foreground'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-secondary disabled:opacity-50 disabled:pointer-events-none text-muted-foreground"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
