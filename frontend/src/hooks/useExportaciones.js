import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useExportaciones = () => {
  const parseColumns = (columns) =>
    (columns || []).map((col) => {
      if (typeof col === 'string') {
        return { header: col, accessor: col };
      }

      const header = col?.Header ?? col?.accessor ?? '';
      const accessor = col?.accessor ?? col?.Header ?? '';

      return { header, accessor };
    }).filter(col => col.header && col.accessor); 

  const exportToExcel = (data, columns, fileName = 'datos.xlsx') => {
    const parsedColumns = parseColumns(columns);
    if (!parsedColumns.length) {
      console.warn('No hay columnas válidas para exportar a Excel');
      return;
    }

    const exportData = (data || []).map((row) =>
      Object.fromEntries(
        parsedColumns.map((col) => [col.header, row?.[col.accessor] ?? ''])
      )
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, fileName);
  };

  const exportToCSV = (data, columns, fileName = 'datos.csv') => {
    const parsedColumns = parseColumns(columns);
    if (!parsedColumns.length) {
      console.warn('No hay columnas válidas para exportar a CSV');
      return;
    }

    const headers = parsedColumns.map((col) => `"${col.header}"`);
    const exportData = (data || []).map((row) =>
      parsedColumns
        .map((col) =>
          `"${String(row?.[col.accessor] ?? '').replace(/"/g, '""')}"`
        )
        .join(',')
    );

    const csv = [headers.join(','), ...exportData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const exportToPDF = (data, columns, fileName = 'datos.pdf') => {
    const parsedColumns = parseColumns(columns);
    if (!parsedColumns.length) {
      console.warn('No hay columnas válidas para exportar a PDF');
      return;
    }

    const headers = parsedColumns.map((col) => col.header);
    const body = (data || []).map((row) =>
      parsedColumns.map((col) => row?.[col.accessor] ?? '')
    );

    const doc = new jsPDF();
    doc.autoTable({ head: [headers], body });
    doc.save(fileName);
  };

  const exportToTXT = (data, columns, fileName = 'datos.txt') => {
    const parsedColumns = parseColumns(columns);
    if (!parsedColumns.length) {
      console.warn('No hay columnas válidas para exportar a TXT');
      return;
    }

    const headers = parsedColumns.map((col) => col.header).join('\t');
    const rows = (data || [])
      .map((row) =>
        parsedColumns.map((col) => row?.[col.accessor] ?? '').join('\t')
      )
      .join('\n');

    const txtContent = `${headers}\n${rows}`;
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return {
    exportToExcel,
    exportToCSV,
    exportToPDF,
    exportToTXT,
  };
};

export default useExportaciones;