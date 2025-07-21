import React from 'react';
import { Image } from 'lucide-react';

const Design = () => {
  return (
    <div className="bg-white rounded-xl p-3.5 px-9 border border-[#808080]">
      <h2 className="text-xl font-semibold text-[#808080] text-center border-b border-[#808080] pb-2 mb-2">Design</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Picture :</label>
        <div className=" border border-[#212121] rounded-3xl p-12 text-center">
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24"><path fill="#808080" d="M18 15v3h-3v2h3v3h2v-3h3v-2h-3v-3zm-4.7 6H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v8.3c-.6-.2-1.3-.3-2-.3c-1.1 0-2.2.3-3.1.9L14.5 12L11 16.5l-2.5-3L5 18h8.1c-.1.3-.1.7-.1 1c0 .7.1 1.4.3 2"></path></svg>
            {/* <Image className="w-16 h-16 text-gray-400 mb-2" /> */}
            <span className="text-[#808080] text-sm">Select photo</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[#808080] pt-4 mt-3.5 grid place-items-center ">
        <button className="w-32 mx-auto border border-orange-[#F69F58] text-[#F69F58] bg-white py-2 px-4 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-semibold">
          Save
        </button>
      </div>
    </div>
  );
};

export default Design;