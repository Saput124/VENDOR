import React from 'react';
import { Download, Trash2 } from 'lucide-react';

export default function TransactionList({ 
  filteredTransactions, 
  handleDeleteTransaction,
  exportTransactions 
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Data Transaksi</h2>
        <button
          onClick={exportTransactions}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada transaksi</p>
          <p className="text-gray-400 text-sm mt-2">Klik tab "Input Transaksi" untuk menambah data</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Blok</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Luasan (Ha)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Pekerja</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama Pekerja</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={transaction.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm">{transaction.tanggal}</td>
                  <td className="px-4 py-3 text-sm font-medium">{transaction.vendor_name}</td>
                  <td className="px-4 py-3 text-sm">{transaction.block_name} ({transaction.zone})</td>
                  <td className="px-4 py-3 text-sm font-semibold text-blue-600">{transaction.luas_hasil}</td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      {transaction.jumlah_pekerja}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {(transaction.workers || []).map((name, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
