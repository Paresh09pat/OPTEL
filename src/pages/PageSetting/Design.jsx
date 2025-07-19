import React from 'react';
import { Image } from 'lucide-react';

const Design = () => {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Design</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Background Picture :</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="flex flex-col items-center">
            <Image className="w-16 h-16 text-gray-400 mb-2" />
            <span className="text-gray-500">Select photo</span>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <button className="w-32 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
          Save
        </button>
      </div>
    </div>
  );
};

export default Design;