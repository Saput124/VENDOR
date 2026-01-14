import React from 'react';
import { Plus, Edit, Trash2, Upload, FileSpreadsheet } from 'lucide-react';

export default function MasterData({
  vendors,
  blocks,
  workers,
  openModal,
  handleDelete,
  downloadTemplate,
  handleImportExcel
}) {
  return (
    <div className="space-y-6">
      {/* Vendor Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">👥 Vendor</h3>
          <div className="flex gap-2">
            <button
              onClick={() => downloadTemplate('vendor')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FileSpreadsheet size={16} />
              Download Template
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload size={16} />
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files[0] && handleImportExcel('vendor', e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => openModal('vendor')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Tambah Vendor
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, i) => (
                <tr key={vendor.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{vendor.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('vendor', vendor)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('vendor', vendor.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">🗺️ Blok</h3>
          <div className="flex gap-2">
            <button
              onClick={() => downloadTemplate('block')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FileSpreadsheet size={16} />
              Download Template
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload size={16} />
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files[0] && handleImportExcel('block', e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => openModal('block')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Tambah Blok
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama Blok</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Zone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Varietas</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Luas (Ha)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block, i) => (
                <tr key={block.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 text-sm font-medium">{block.name}</td>
                  <td className="px-4 py-3 text-sm">{block.zone}</td>
                  <td className="px-4 py-3 text-sm">{block.kategori}</td>
                  <td className="px-4 py-3 text-sm">{block.varietas}</td>
                  <td className="px-4 py-3 text-sm">{block.luas_asli}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('block', block)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('block', block.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">👷 Pekerja</h3>
          <div className="flex gap-2">
            <button
              onClick={() => downloadTemplate('worker')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <FileSpreadsheet size={16} />
              Download Template
            </button>
            <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
              <Upload size={16} />
              Import Excel
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => e.target.files[0] && handleImportExcel('worker', e.target.files[0])}
                className="hidden"
              />
            </label>
            <button
              onClick={() => openModal('worker')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Tambah Pekerja
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold">No</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Kode</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker, i) => (
                <tr key={worker.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{i + 1}</td>
                  <td className="px-4 py-3 text-sm">{worker.worker_code}</td>
                  <td className="px-4 py-3 text-sm font-medium">{worker.name}</td>
                  <td className="px-4 py-3 text-sm">{vendors.find(v => v.id === worker.vendor_id)?.name}</td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('worker', worker)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('worker', worker.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
