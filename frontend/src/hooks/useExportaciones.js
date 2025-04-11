import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const useExportaciones = () => {
  const exportToExcel = (data, columns, fileName = 'datos.xlsx') => {
    const exportData = data.map(row =>
      Object.fromEntries(columns.map(col => [col, row[col]]))
    );
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
    XLSX.writeFile(workbook, fileName);
  };

  const exportToCSV = (data, columns, fileName = 'datos.csv') => {
    const exportData = data.map(row =>
      columns.map(col => `"${row[col] ?? ''}"`).join(',')
    );
    const csv = [columns.join(','), ...exportData].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  const exportToPDF = (data, columns, fileName = 'datos.pdf') => {
    const doc = new jsPDF();
    const tableData = data.map(row => columns.map(col => row[col] ?? ''));
    doc.autoTable({ head: [columns], body: tableData });
    doc.save(fileName);
  };

  const exportToTXT = (data, columns, fileName = 'datos.txt') => {
    const exportData = data.map(row =>
      columns.map(col => `${col}: ${row[col] ?? ''}`).join(', ')
    );
    const txt = exportData.join('\n');
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
  };

  return { exportToExcel, exportToCSV, exportToPDF, exportToTXT };
};

export default useExportaciones;