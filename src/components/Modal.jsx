import React from 'react';

export default function Modal({ show, type, editData, vendors, onClose, onSubmit }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {editData ? 'Edit' : 'Tambah'} {type === 'vendor' ? 'Vendor' : type === 'block' ? 'Blok' : 'Pekerja'}
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          {type === 'vendor' && (
            <div>
              <label className="block text-sm font-medium mb-2">Nama Vendor</label>
              <input name="name" defaultValue={editData?.name || ''} required className="w-full px-4 py-2 border rounded-lg" />
            </div>
          )}

          {type === 'block' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Blok</label>
                <input name="name" defaultValue={editData?.name || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zone</label>
                <input name="zone" defaultValue={editData?.zone || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <input name="kategori" defaultValue={editData?.kategori || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Varietas</label>
                <input name="varietas" defaultValue={editData?.varietas || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Luas (Ha)</label>
                <input name="luas_asli" type="number" step="0.01" defaultValue={editData?.luas_asli || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </>
          )}

          {type === 'worker' && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">Kode Pekerja</label>
                <input name="worker_code" defaultValue={editData?.worker_code || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nama Pekerja</label>
                <input name="name" defaultValue={editData?.name || ''} required className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Vendor</label>
                <select name="vendor_id" defaultValue={editData?.vendor_id || ''} required className="w-full px-4 py-2 border rounded-lg">
                  <option value="">-- Pilih Vendor --</option>
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Simpan
            </button>
            <button type="button" onClick={onClose} className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
