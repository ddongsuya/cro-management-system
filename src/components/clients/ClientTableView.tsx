import React, { useState, useMemo, useRef } from 'react';
import { Company, Contact, Quotation, Contract, Study } from '../../types';

// 테이블 컬럼 정의 (확장 가능)
export interface TableColumn {
  id: string;
  label: string;
  accessor: (company: Company) => any;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  width?: number;
  minWidth?: number;
  visible?: boolean;
  format?: (value: any) => string;
  type?: 'text' | 'number' | 'date' | 'email' | 'phone' | 'array';
}

interface ClientTableViewProps {
  companies: Company[];
  onEditCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onSelectCompany: (companyId: string) => void;
  onUpdateCompany?: (companyId: string, updates: Partial<Company>) => void;
}

// 기본 컬럼 설정 (확장 가능)
const DEFAULT_COLUMNS: TableColumn[] = [
  {
    id: 'name',
    label: '고객사명',
    accessor: (c) => c.name,
    sortable: true,
    filterable: true,
    editable: true,
    minWidth: 150,
    visible: true,
    type: 'text',
  },
  {
    id: 'primaryContact',
    label: '담당자',
    accessor: (c) => c.contacts?.find(ct => ct.isPrimary)?.name || '',
    sortable: true,
    filterable: true,
    minWidth: 120,
    visible: true,
    type: 'text',
  },
  {
    id: 'email',
    label: '이메일',
    accessor: (c) => c.contacts?.find(ct => ct.isPrimary)?.email || '',
    sortable: true,
    filterable: true,
    minWidth: 180,
    visible: true,
    type: 'email',
  },
  {
    id: 'phone',
    label: '전화번호',
    accessor: (c) => c.contacts?.find(ct => ct.isPrimary)?.phone || '',
    sortable: true,
    filterable: true,
    minWidth: 130,
    visible: true,
    type: 'phone',
  },
  {
    id: 'address',
    label: '주소',
    accessor: (c) => c.address,
    sortable: true,
    filterable: true,
    editable: true,
    minWidth: 200,
    visible: false,
    type: 'text',
  },
  {
    id: 'website',
    label: '웹사이트',
    accessor: (c) => c.website,
    sortable: true,
    filterable: true,
    editable: true,
    minWidth: 150,
    visible: false,
    type: 'text',
  },
  {
    id: 'quotationCount',
    label: '견적서 수',
    accessor: (c) => c.quotations?.length || 0,
    sortable: true,
    minWidth: 100,
    visible: true,
    type: 'number',
    format: (v) => v.toString(),
  },
  {
    id: 'contractCount',
    label: '계약서 수',
    accessor: (c) => c.contracts?.length || 0,
    sortable: true,
    minWidth: 100,
    visible: true,
    type: 'number',
    format: (v) => v.toString(),
  },
  {
    id: 'studyCount',
    label: '시험 수',
    accessor: (c) => c.studies?.length || 0,
    sortable: true,
    minWidth: 100,
    visible: false,
    type: 'number',
    format: (v) => v.toString(),
  },
  {
    id: 'contactCount',
    label: '연락처 수',
    accessor: (c) => c.contacts?.length || 0,
    sortable: true,
    minWidth: 100,
    visible: false,
    type: 'number',
    format: (v) => v.toString(),
  },
  {
    id: 'createdAt',
    label: '등록일',
    accessor: (c) => c.createdAt,
    sortable: true,
    minWidth: 120,
    visible: false,
    type: 'date',
    format: (v) => v ? new Date(v).toLocaleDateString('ko-KR') : '',
  },
];

export const ClientTableView: React.FC<ClientTableViewProps> = ({
  companies,
  onEditCompany,
  onDeleteCompany,
  onSelectCompany,
  onUpdateCompany,
}) => {
  const [columns, setColumns] = useState<TableColumn[]>(() => {
    // localStorage에서 컬럼 설정 불러오기
    const saved = localStorage.getItem('clientTableColumns');
    if (saved) {
      try {
        const savedColumns = JSON.parse(saved);
        return DEFAULT_COLUMNS.map(col => ({
          ...col,
          visible: savedColumns[col.id]?.visible ?? col.visible,
          width: savedColumns[col.id]?.width ?? col.width,
        }));
      } catch (e) {
        return DEFAULT_COLUMNS;
      }
    }
    return DEFAULT_COLUMNS;
  });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // 컬럼 설정 저장
  const saveColumnSettings = (newColumns: TableColumn[]) => {
    const settings = newColumns.reduce((acc, col) => {
      acc[col.id] = { visible: col.visible, width: col.width };
      return acc;
    }, {} as Record<string, any>);
    localStorage.setItem('clientTableColumns', JSON.stringify(settings));
    setColumns(newColumns);
  };

  // 컬럼 표시/숨김 토글
  const toggleColumnVisibility = (columnId: string) => {
    const newColumns = columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    );
    saveColumnSettings(newColumns);
  };

  // 정렬
  const handleSort = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === columnId) {
        return current.direction === 'asc'
          ? { key: columnId, direction: 'desc' }
          : null;
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  // 필터링 및 정렬된 데이터
  const processedData = useMemo(() => {
    let filtered = [...companies];

    // 컬럼 필터 적용
    Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
      if (!filterValue) return;
      const column = columns.find(c => c.id === columnId);
      if (!column) return;

      filtered = filtered.filter(company => {
        const value = column.accessor(company);
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(filterValue.toLowerCase());
      });
    });

    // 정렬 적용
    if (sortConfig) {
      const column = columns.find(c => c.id === sortConfig.key);
      if (column) {
        filtered.sort((a, b) => {
          const aValue = column.accessor(a);
          const bValue = column.accessor(b);
          
          if (aValue === bValue) return 0;
          
          const comparison = aValue < bValue ? -1 : 1;
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
      }
    }

    return filtered;
  }, [companies, columnFilters, sortConfig, columns]);

  // 페이지네이션
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return processedData.slice(startIndex, startIndex + pageSize);
  }, [processedData, currentPage, pageSize]);

  const totalPages = Math.ceil(processedData.length / pageSize);

  // 인쇄
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>고객사 목록</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background-color: #f3f4f6; font-weight: bold; }
            tr:nth-child(even) { background-color: #f9fafb; }
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>고객사 목록</h1>
          <p>총 ${processedData.length}개 고객사 | 출력일: ${new Date().toLocaleDateString('ko-KR')}</p>
          ${printContent.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // CSV 내보내기
  const handleExportCSV = () => {
    const visibleColumns = columns.filter(c => c.visible);
    const headers = visibleColumns.map(c => c.label).join(',');
    const rows = processedData.map(company => 
      visibleColumns.map(col => {
        const value = col.accessor(company);
        const formatted = col.format ? col.format(value) : String(value);
        return `"${formatted.replace(/"/g, '""')}"`;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clients_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="space-y-4">
      {/* 툴바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            총 {processedData.length}개 고객사
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowColumnSettings(!showColumnSettings)}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            ⚙️ 컬럼 설정
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition"
          >
            📥 CSV 내보내기
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition"
          >
            🖨️ 인쇄
          </button>
        </div>
      </div>

      {/* 컬럼 설정 패널 */}
      {showColumnSettings && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">표시할 컬럼 선택</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {columns.map(col => (
              <label key={col.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.id)}
                  className="rounded"
                />
                <span className="text-sm">{col.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 테이블 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <div ref={printRef}>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {visibleColumns.map(column => (
                    <th
                      key={column.id}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      style={{ minWidth: column.minWidth }}
                      onClick={() => column.sortable && handleSort(column.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <span className="ml-2">
                            {sortConfig?.key === column.id
                              ? sortConfig.direction === 'asc' ? '↑' : '↓'
                              : '↕'}
                          </span>
                        )}
                      </div>
                      {column.filterable && (
                        <input
                          type="text"
                          placeholder="필터..."
                          className="mt-1 w-full px-2 py-1 text-xs border rounded"
                          value={columnFilters[column.id] || ''}
                          onChange={(e) => {
                            setColumnFilters(prev => ({
                              ...prev,
                              [column.id]: e.target.value,
                            }));
                            setCurrentPage(1);
                          }}
                          onClick={(e) => e.stopPropagation()}
                        />
                      )}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map(company => (
                  <tr
                    key={company.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onSelectCompany(company.id)}
                  >
                    {visibleColumns.map(column => {
                      const value = column.accessor(company);
                      const displayValue = column.format ? column.format(value) : String(value || '');
                      
                      return (
                        <td key={column.id} className="px-4 py-3 text-sm text-gray-900">
                          {column.type === 'email' && value ? (
                            <a
                              href={`mailto:${value}`}
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {displayValue}
                            </a>
                          ) : column.type === 'phone' && value ? (
                            <a
                              href={`tel:${value}`}
                              className="text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {displayValue}
                            </a>
                          ) : (
                            displayValue
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-sm" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditCompany(company)}
                          className="text-blue-600 hover:text-blue-800"
                          title="수정"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteCompany(company.id)}
                          className="text-red-600 hover:text-red-800"
                          title="삭제"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">페이지당 표시:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                이전
              </button>
              <span className="text-sm text-gray-700">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
