import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <Icon className={`text-${color}-500`} size={40} />
      </div>
    </div>
  );
}
