import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Developers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">डेवलपर्स</h1>
        
        <section className="mb-8">
          <p className="text-gray-700 mb-4">
            Ouptel API और डेवलपर संसाधनों में आपका स्वागत है। हम डेवलपर्स को हमारे प्लेटफॉर्म के साथ एकीकृत करने के लिए उपकरण और दस्तावेज़ीकरण प्रदान करते हैं।
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">API दस्तावेज़ीकरण</h2>
          <p className="text-gray-700 mb-4">
            हमारे API दस्तावेज़ीकरण और संसाधनों तक पहुंचने के लिए, कृपया हमसे संपर्क करें।
          </p>
        </section>

        <section className="bg-blue-50 p-6 rounded-lg mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">संपर्क जानकारी</h2>
          <p className="mb-2">यदि आपके कोई प्रश्न या चिंताएं हैं, तो कृपया हमसे संपर्क करें:</p>
          <ul className="space-y-1">
            <li><strong>ईमेल:</strong> <a href="mailto:support@ouptel.com" className="text-blue-600 hover:underline">support@ouptel.com</a></li>
            <li><strong>शिकायत:</strong> <a href="mailto:grievances@ouptel.com" className="text-blue-600 hover:underline">grievances@ouptel.com</a></li>
            <li><strong>वेबसाइट:</strong> <a href="https://ouptel.com" className="text-blue-600 hover:underline">www.ouptel.com</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Developers;
