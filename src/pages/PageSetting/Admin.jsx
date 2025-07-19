import React from 'react';

const Admin = () => {
  const admins = [
    { name: 'Siddharth Verma', username: '@musicloverSid', avatar: '👨‍🎤' },
    { name: 'Bhuvan Rana', username: '@beatsbyBhuvan', avatar: '🎵' },
    { name: 'Sana Qadri', username: '@sanskarSana', avatar: '🎤' },
    { name: 'Aniket Naik', username: '@athleteAniket', avatar: '🏃‍♂️' },
    { name: 'Laya Krishnan', username: '@lensByLaya', avatar: '📸' },
    { name: 'Sana Rizvi', username: '@cosmicSapphire', avatar: '💎' }
  ];

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Admin</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          className="w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {admins.map((admin, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">
              {admin.avatar}
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{admin.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{admin.username}</p>
            <button className="px-4 py-1 border border-orange-500 text-orange-500 rounded hover:bg-orange-50 transition-colors">
              Add Admin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;