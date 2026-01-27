import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AboutUs = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">हमारे बारे में</h1>
        
        <section className="mb-8">
          <p className="text-gray-700 mb-4">
            Ouptel एक सोशल नेटवर्किंग प्लेटफॉर्म है जो लोगों को जोड़ता है और उन्हें अपने विचार, अनुभव और रुचियों को साझा करने का अवसर प्रदान करता है।
          </p>
          <p className="text-gray-700 mb-4">
            हमारा मिशन एक सुरक्षित, समावेशी और उपयोगकर्ता-अनुकूल वातावरण बनाना है जहां हर कोई अपनी आवाज़ सुन सके।
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

export default AboutUs;
