import React from 'react';
import { BiSearchAlt } from "react-icons/bi";

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
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Admin</h2>

      <div className="mb-4 relative">
        <BiSearchAlt className="w-5 h-5 text-[#808080] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-64 px-3 py-2 pl-10 border border-[#212121] rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
        {admins.map((admin, index) => (
          <div
            key={index}
            className="border border-[#808080] rounded-3xl pt-5 px-2 pb-5 text-center"
          >
            <div className="w-16 h-16 bg-[#212121] rounded-full mx-auto mb-3 flex items-center justify-center text-2xl text-white">
              {admin.avatar}
            </div>
            <h3 className="font-semibold text-[#212121] mb-1">{admin.name}</h3>
            <p className="text-sm text-[#212121] mb-3.5">{admin.username}</p>
            <button className="px-4 py-1 border border-[#808080] text-[#212121] bg-white rounded cursor-pointer transition-colors text-sm font-semibold hover:bg-[#f5f5f5]">
              Add Admin
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
