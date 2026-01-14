import React from 'react';
import { Download } from 'lucide-react';

export default function BlockStatus({ blocksWithBalance, exportBlocks }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🗺️ Status Blok</h2>
        <button
          onClick={exportBlocks}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blocksWithBalance.map(block => (
          <div key={block.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{block.name}</h3>
                <p className="text-sm text-gray-600">{block.zone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                block.persen_selesai >= 100 ? 'bg-green-100 text-green-800' :
                block.persen_selesai >= 50 ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {block.kategori}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Varietas:</span>
                <span className="font-semibold">{block.varietas}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Luas Asli:</span>
                <span className="font-semibold">{block.luas_asli} Ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dikerjakan:</span>
                <span className="font-semibold text-blue-600">{block.luas_dikerjakan} Ha</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Sisa:</span>
                <span className="font-semibold text-green-600">{block.luas_sisa} Ha</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Progress</span>
                <span className="font-bold">{block.persen_selesai}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full transition-all ${
                    block.persen_selesai >= 100 ? 'bg-green-500' :
                    block.persen_selesai >= 50 ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{width: `${Math.min(block.persen_selesai, 100)}%`}}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
