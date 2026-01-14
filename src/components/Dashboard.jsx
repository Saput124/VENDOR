import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Filter, RefreshCw, Users, CheckCircle, MapPin, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import { COLORS } from '../utils/supabase';

export default function Dashboard({ 
  filters, 
  setFilters, 
  resetFilters, 
  fetchAllData, 
  loading,
  vendors,
  filteredTransactions,
  blocksWithBalance,
  vendorStats,
  zoneStats,
  uniqueZones,
  uniqueVarietas
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-blue-600" />
          <h3 className="font-semibold text-gray-800">Filter Data</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <select
            value={filters.zone}
            onChange={(e) => setFilters({...filters, zone: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Semua Zone</option>
            {uniqueZones.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
          <select
            value={filters.varietas}
            onChange={(e) => setFilters({...filters, varietas: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Semua Varietas</option>
            {uniqueVarietas.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <select
            value={filters.vendor}
            onChange={(e) => setFilters({...filters, vendor: e.target.value})}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="">Semua Vendor</option>
            {vendors.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium"
          >
            Reset Filter
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Vendor Aktif" value={vendors.length} icon={Users} color="yellow" />
        <StatsCard title="Total Transaksi" value={filteredTransactions.length} icon={CheckCircle} color="blue" />
        <StatsCard 
          title="Total Luasan" 
          value={`${filteredTransactions.reduce((sum, t) => sum + parseFloat(t.luas_hasil || 0), 0).toFixed(2)} Ha`} 
          icon={MapPin} 
          color="green" 
        />
        <StatsCard 
          title="Blok Selesai" 
          value={blocksWithBalance.filter(b => b.persen_selesai >= 100).length} 
          icon={TrendingUp} 
          color="purple" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Produktivitas Vendor</h3>
          {vendorStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vendorStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLuas" fill="#3b82f6" name="Total Luasan (Ha)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Belum ada data transaksi
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Distribusi per Zone</h3>
          {zoneStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={zoneStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value} Ha`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {zoneStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              Belum ada data zone
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Ranking Vendor</h3>
        <div className="space-y-3">
          {vendorStats.length > 0 ? (
            vendorStats.map((vendor, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${
                  index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-600'
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{vendor.name}</p>
                  <p className="text-sm text-gray-600">{vendor.jumlahTransaksi} transaksi</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{vendor.totalLuas} Ha</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Belum ada data transaksi</p>
          )}
        </div>
      </div>
    </div>
  );
}
