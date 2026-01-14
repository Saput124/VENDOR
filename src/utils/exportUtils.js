import * as XLSX from 'xlsx';

export const downloadTemplate = (type) => {
  let data = [];
  let filename = '';

  if (type === 'vendor') {
    data = [['name'], ['PT Vendor A'], ['PT Vendor B']];
    filename = 'template_vendor.xlsx';
  } else if (type === 'block') {
    data = [
      ['name', 'zone', 'kategori', 'varietas', 'luas_asli'],
      ['Blok A1', 'Zone Utara', 'PC', 'PS881', '10.5'],
      ['Blok B2', 'Zone Selatan', 'RC', 'PS862', '8.3']
    ];
    filename = 'template_block.xlsx';
  } else if (type === 'worker') {
    data = [
      ['worker_code', 'name', 'vendor'],
      ['P001', 'Budi Santoso', 'PT Vendor A'],
      ['P002', 'Siti Aminah', 'PT Vendor A']
    ];
    filename = 'template_worker.xlsx';
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template');
  XLSX.writeFile(wb, filename);
};

export const exportCSV = (headers, rows, filename) => {
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};

export const exportTransactions = (transactions) => {
  const headers = ['Tanggal', 'Vendor', 'Blok', 'Zone', 'Luasan (Ha)', 'Jumlah Pekerja', 'Pekerja'];
  const rows = transactions.map(t => [
    t.tanggal,
    t.vendor_name,
    t.block_name,
    t.zone,
    t.luas_hasil,
    t.jumlah_pekerja,
    (t.workers || []).join('; ')
  ]);
  exportCSV(headers, rows, `transaksi-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportBlocks = (blocks) => {
  const headers = ['Nama Blok', 'Zone', 'Kategori', 'Varietas', 'Luas Asli', 'Dikerjakan', 'Sisa', 'Progress (%)'];
  const rows = blocks.map(b => [
    b.name,
    b.zone,
    b.kategori,
    b.varietas,
    b.luas_asli,
    b.luas_dikerjakan,
    b.luas_sisa,
    b.persen_selesai
  ]);
  exportCSV(headers, rows, `status-blok-${new Date().toISOString().split('T')[0]}.csv`);
};
