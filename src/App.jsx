import React, { useState, useMemo } from 'react';
import { RefreshCw, TrendingUp, Plus, CheckCircle, MapPin, Database } from 'lucide-react';
import * as XLSX from 'xlsx';

import { supabase } from './utils/supabase';
import { downloadTemplate, exportTransactions, exportBlocks } from './utils/exportUtils';
import { useSupabaseData } from './hooks/useSupabaseData';

import Modal from './components/Modal';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import BlockStatus from './components/BlockStatus';
import MasterData from './components/MasterData';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editData, setEditData] = useState(null);

  const {
    loading,
    error,
    vendors,
    blocks,
    workers,
    transactions,
    blocksWithBalance,
    uniqueZones,
    uniqueKategori,
    uniqueVarietas,
    fetchAllData
  } = useSupabaseData();

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    zone: '',
    varietas: '',
    vendor: ''
  });

  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    vendor_id: '',
    block_id: '',
    luas_hasil: '',
    selectedWorkers: [],
    catatan: '',
    blockZone: '',
    blockKategori: '',
    blockSearch: '',
    workerSearch: ''
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const block = blocks.find(b => b.id === t.block_id);
      if (filters.startDate && t.tanggal < filters.startDate) return false;
      if (filters.endDate && t.tanggal > filters.endDate) return false;
      if (filters.zone && block?.zone !== filters.zone) return false;
      if (filters.varietas && block?.varietas !== filters.varietas) return false;
      if (filters.vendor && t.vendor_id !== filters.vendor) return false;
      return true;
    });
  }, [transactions, blocks, filters]);

  const vendorStats = useMemo(() => {
    return vendors.map(vendor => {
      const vendorTrans = filteredTransactions.filter(t => t.vendor_id === vendor.id);
      const totalLuas = vendorTrans.reduce((sum, t) => sum + parseFloat(t.luas_hasil || 0), 0);
      return {
        name: vendor.name,
        totalLuas: parseFloat(totalLuas.toFixed(2)),
        jumlahTransaksi: vendorTrans.length
      };
    }).filter(v => v.totalLuas > 0).sort((a, b) => b.totalLuas - a.totalLuas);
  }, [vendors, filteredTransactions]);

  const zoneStats = useMemo(() => {
    const zones = {};
    filteredTransactions.forEach(t => {
      const block = blocks.find(b => b.id === t.block_id);
      if (block) {
        zones[block.zone] = (zones[block.zone] || 0) + parseFloat(t.luas_hasil || 0);
      }
    });
    return Object.entries(zones).map(([zone, luas]) => ({
      name: zone,
      value: parseFloat(luas.toFixed(2))
    }));
  }, [filteredTransactions, blocks]);

  const filteredBlocksForForm = useMemo(() => {
    return blocksWithBalance.filter(block => {
      if (block.persen_selesai >= 100) return false;
      if (formData.blockZone && block.zone !== formData.blockZone) return false;
      if (formData.blockKategori && block.kategori !== formData.blockKategori) return false;
      if (formData.blockSearch) {
        const search = formData.blockSearch.toLowerCase();
        return block.name.toLowerCase().includes(search) || block.zone.toLowerCase().includes(search);
      }
      return true;
    });
  }, [blocksWithBalance, formData.blockZone, formData.blockKategori, formData.blockSearch]);

  const availableWorkers = useMemo(() => {
    if (!formData.vendor_id) return [];
    let filtered = workers.filter(w => w.vendor_id === formData.vendor_id);
    if (formData.workerSearch) {
      const search = formData.workerSearch.toLowerCase();
      filtered = filtered.filter(w => 
        w.name.toLowerCase().includes(search) || 
        w.worker_code?.toLowerCase().includes(search)
      );
    }
    return filtered;
  }, [workers, formData.vendor_id, formData.workerSearch]);

  const handleSubmit = async () => {
    if (!formData.vendor_id || !formData.block_id || !formData.luas_hasil || formData.selectedWorkers.length === 0) {
      alert('❌ Mohon lengkapi semua field!');
      return;
    }

    const selectedBlock = blocksWithBalance.find(b => b.id === formData.block_id);
    if (parseFloat(formData.luas_hasil) > selectedBlock.luas_sisa) {
      alert(`❌ Luasan melebihi balance! Sisa: ${selectedBlock.luas_sisa} Ha`);
      return;
    }

    setSubmitting(true);
    try {
      const transCode = `TRX${Date.now()}`;
      const { data: transData, error: transError } = await supabase
        .from('transactions')
        .insert([{
          transaction_code: transCode,
          tanggal: formData.tanggal,
          vendor_id: formData.vendor_id,
          block_id: formData.block_id,
          luas_hasil: parseFloat(formData.luas_hasil),
          catatan: formData.catatan
        }])
        .select()
        .single();

      if (transError) throw transError;

      const workerInserts = formData.selectedWorkers.map(worker_id => ({
        transaction_id: transData.id,
        worker_id: worker_id
      }));

      const { error: workersError } = await supabase
        .from('transaction_workers')
        .insert(workerInserts);

      if (workersError) throw workersError;

      setFormData({
        tanggal: new Date().toISOString().split('T')[0],
        vendor_id: '',
        block_id: '',
        luas_hasil: '',
        selectedWorkers: [],
        catatan: '',
        blockZone: '',
        blockKategori: '',
        blockSearch: '',
        workerSearch: ''
      });

      await fetchAllData();
      alert('✅ Transaksi berhasil disimpan!');
      setActiveTab('dashboard');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('❓ Yakin ingin menghapus transaksi ini?')) return;
    try {
      await supabase.from('transaction_workers').delete().eq('transaction_id', id);
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      await fetchAllData();
      alert('✅ Transaksi berhasil dihapus!');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const openModal = (type, data = null) => {
    setModalType(type);
    setEditData(data);
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      if (modalType === 'vendor') {
        if (editData) {
          await supabase.from('vendors').update({ name: data.name }).eq('id', editData.id);
        } else {
          await supabase.from('vendors').insert([{ name: data.name }]);
        }
      } else if (modalType === 'block') {
        const blockData = {
          name: data.name,
          zone: data.zone,
          kategori: data.kategori,
          varietas: data.varietas,
          luas_asli: parseFloat(data.luas_asli)
        };
        if (editData) {
          await supabase.from('blocks').update(blockData).eq('id', editData.id);
        } else {
          await supabase.from('blocks').insert([blockData]);
        }
      } else if (modalType === 'worker') {
        const workerData = {
          name: data.name,
          worker_code: data.worker_code,
          vendor_id: data.vendor_id
        };
        if (editData) {
          await supabase.from('workers').update(workerData).eq('id', editData.id);
        } else {
          await supabase.from('workers').insert([workerData]);
        }
      }

      await fetchAllData();
      setShowModal(false);
      setEditData(null);
      alert('✅ Data berhasil disimpan!');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleDelete = async (type, id) => {
    if (!confirm('❓ Yakin ingin menghapus data ini?')) return;
    try {
      await supabase.from(type === 'vendor' ? 'vendors' : type === 'block' ? 'blocks' : 'workers').delete().eq('id', id);
      await fetchAllData();
      alert('✅ Data berhasil dihapus!');
    } catch (err) {
      alert('❌ Error: ' + err.message);
    }
  };

  const handleImportExcel = async (type, file) => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (type === 'vendor') {
          const inserts = jsonData.map(d => ({ name: d.name || d.Nama }));
          const { error } = await supabase.from('vendors').insert(inserts);
          if (error) throw error;
        } else if (type === 'block') {
          const inserts = jsonData.map(d => ({
            name: d.name || d.Nama,
            zone: d.zone || d.Zone,
            kategori: d.kategori || d.Kategori,
            varietas: d.varietas || d.Varietas,
            luas_asli: parseFloat(d.luas_asli || d['Luas (Ha)'] || d.luas || 0)
          }));
          const { error } = await supabase.from('blocks').insert(inserts);
          if (error) throw error;
        } else if (type === 'worker') {
          const inserts = await Promise.all(jsonData.map(async d => {
            const vendorName = d.vendor || d.Vendor;
            const vendor = vendors.find(v => v.name === vendorName);
            return {
              name: d.name || d.Nama,
              worker_code: d.worker_code || d.Kode || d.kode,
              vendor_id: vendor?.id
            };
          }));
          const validInserts = inserts.filter(i => i.vendor_id);
          if (validInserts.length === 0) {
            alert('⚠️ Tidak ada data valid. Pastikan nama vendor sudah ada di database!');
            return;
          }
          const { error } = await supabase.from('workers').insert(validInserts);
          if (error) throw error;
        }

        await fetchAllData();
        alert(`✅ Berhasil import ${jsonData.length} data!`);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      alert('❌ Error import: ' + err.message);
    }
  };

  const toggleWorker = (workerId) => {
    setFormData(prev => ({
      ...prev,
      selectedWorkers: prev.selectedWorkers.includes(workerId)
        ? prev.selectedWorkers.filter(id => id !== workerId)
        : [...prev.selectedWorkers, workerId]
    }));
  };

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '', zone: '', varietas: '', vendor: '' });
  };

  const selectedBlock = blocksWithBalance.find(b => b.id === formData.block_id);

  if (loading && vendors.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">📊 Monitoring Kelentek Daun Tebu</h1>
          <p className="text-green-100 mt-1">Sistem Manajemen Vendor & Tracking Progress</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-4 mt-4 rounded">
          Error: {error}
        </div>
      )}

      <div className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'form', label: 'Input Transaksi', icon: Plus },
              { id: 'data', label: 'Data Transaksi', icon: CheckCircle },
              { id: 'blok', label: 'Status Blok', icon: MapPin },
              { id: 'master', label: 'Master Data', icon: Database }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            fetchAllData={fetchAllData}
            loading={loading}
            vendors={vendors}
            filteredTransactions={filteredTransactions}
            blocksWithBalance={blocksWithBalance}
            vendorStats={vendorStats}
            zoneStats={zoneStats}
            uniqueZones={uniqueZones}
            uniqueVarietas={uniqueVarietas}
          />
        )}

        {activeTab === 'form' && (
          <TransactionForm
            formData={formData}
            setFormData={setFormData}
            vendors={vendors}
            filteredBlocksForForm={filteredBlocksForForm}
            selectedBlock={selectedBlock}
            availableWorkers={availableWorkers}
            toggleWorker={toggleWorker}
            handleSubmit={handleSubmit}
            submitting={submitting}
            loading={loading}
            uniqueZones={uniqueZones}
            uniqueKategori={uniqueKategori}
          />
        )}

        {activeTab === 'data' && (
          <TransactionList
            filteredTransactions={filteredTransactions}
            handleDeleteTransaction={handleDeleteTransaction}
            exportTransactions={() => exportTransactions(filteredTransactions)}
          />
        )}

        {activeTab === 'blok' && (
          <BlockStatus
            blocksWithBalance={blocksWithBalance}
            exportBlocks={() => exportBlocks(blocksWithBalance)}
          />
        )}

        {activeTab === 'master' && (
          <MasterData
            vendors={vendors}
            blocks={blocks}
            workers={workers}
            openModal={openModal}
            handleDelete={handleDelete}
            downloadTemplate={downloadTemplate}
            handleImportExcel={handleImportExcel}
          />
        )}
      </div>

      <Modal 
        show={showModal}
        type={modalType}
        editData={editData}
        vendors={vendors}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
