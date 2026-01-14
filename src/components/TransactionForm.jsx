import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function TransactionForm({
  formData,
  setFormData,
  vendors,
  filteredBlocksForForm,
  selectedBlock,
  availableWorkers,
  toggleWorker,
  handleSubmit,
  submitting,
  loading,
  uniqueZones,
  uniqueKategori
}) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Plus className="text-blue-600" />
          Input Transaksi Baru
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
              <select
                value={formData.vendor_id}
                onChange={(e) => setFormData({...formData, vendor_id: e.target.value, selectedWorkers: [], workerSearch: ''})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Pilih Vendor --</option>
                {vendors.map(vendor => (
                  <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4">🔍 Filter Blok</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Zone</label>
                <select
                  value={formData.blockZone}
                  onChange={(e) => setFormData({...formData, blockZone: e.target.value, block_id: ''})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Semua Zone</option>
                  {uniqueZones.map(zone => (
                    <option key={zone} value={zone}>{zone}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filter Kategori</label>
                <select
                  value={formData.blockKategori}
                  onChange={(e) => setFormData({...formData, blockKategori: e.target.value, block_id: ''})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Semua Kategori</option>
                  {uniqueKategori.map(kat => (
                    <option key={kat} value={kat}>{kat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="inline mr-1" size={14} />
                  Cari Blok
                </label>
                <input
                  type="text"
                  value={formData.blockSearch}
                  onChange={(e) => setFormData({...formData, blockSearch: e.target.value})}
                  placeholder="Nama blok..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Blok 
                <span className="text-xs text-gray-500 ml-2">
                  ({filteredBlocksForForm.length} blok tersedia)
                </span>
              </label>
              <select
                value={formData.block_id}
                onChange={(e) => setFormData({...formData, block_id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Pilih Blok --</option>
                {filteredBlocksForForm.map(block => (
                  <option key={block.id} value={block.id}>
                    {block.name} | {block.zone} | {block.kategori} | Sisa: {block.luas_sisa} Ha
                  </option>
                ))}
              </select>

              {selectedBlock && (
                <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Zone:</p>
                      <p className="font-semibold">{selectedBlock.zone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Kategori:</p>
                      <p className="font-semibold">{selectedBlock.kategori}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Luas Asli:</p>
                      <p className="font-semibold">{selectedBlock.luas_asli} Ha</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Luas Sisa:</p>
                      <p className="font-semibold text-green-600">{selectedBlock.luas_sisa} Ha</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{selectedBlock.persen_selesai}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full transition-all"
                        style={{width: `${Math.min(selectedBlock.persen_selesai, 100)}%`}}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Luasan Dikerjakan (Ha)</label>
            <input
              type="number"
              step="0.01"
              value={formData.luas_hasil}
              onChange={(e) => setFormData({...formData, luas_hasil: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: 2.5"
            />
          </div>

          <div className="border-t pt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pilih Pekerja 
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 text-xs font-semibold">
                {formData.selectedWorkers.length} dipilih
              </span>
            </label>
            
            {formData.vendor_id ? (
              <>
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.workerSearch}
                      onChange={(e) => setFormData({...formData, workerSearch: e.target.value})}
                      placeholder="Cari nama atau kode pekerja..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {availableWorkers.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {availableWorkers.map(worker => (
                      <label
                        key={worker.id}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          formData.selectedWorkers.includes(worker.id)
                            ? 'bg-blue-100 border-2 border-blue-500'
                            : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.selectedWorkers.includes(worker.id)}
                          onChange={() => toggleWorker(worker.id)}
                          className="w-5 h-5 text-blue-600"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{worker.name}</p>
                          <p className="text-xs text-gray-500">{worker.worker_code}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-orange-600 text-sm italic p-4 bg-orange-50 rounded-lg border border-orange-200">
                    {formData.workerSearch ? 'Tidak ada pekerja yang sesuai pencarian.' : 'Vendor ini belum memiliki pekerja. Tambahkan pekerja di tab Master Data.'}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm italic p-4 bg-gray-50 rounded-lg">
                Pilih vendor terlebih dahulu untuk melihat daftar pekerja
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
            <textarea
              value={formData.catatan}
              onChange={(e) => setFormData({...formData, catatan: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Catatan tambahan..."
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting || loading}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '⏳ Menyimpan...' : '💾 Simpan Transaksi'}
          </button>
        </div>
      </div>
    </div>
  );
}
