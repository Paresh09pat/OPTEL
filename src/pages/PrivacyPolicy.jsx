import React from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ouptel.com विस्तृत गोपनीयता नीति</h1>
          <p className="text-xl text-gray-700 mb-4">Privacy Policy</p>
          <p className="text-sm text-gray-600">
            <strong>प्रभावी तिथि:</strong> [तारीख डालें]<br />
            <strong>अंतिम अद्यतन:</strong> [तारीख डालें]
          </p>
        </div>

        <div className="prose max-w-none space-y-6 text-gray-700">
          {/* Privacy Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 1. प्रस्तावना</h2>
            <p>
              Ouptel.com आपकी गोपनीयता का सम्मान करता है और आपकी व्यक्तिगत जानकारी को सुरक्षित रखना हमारा कर्तव्य है।
              यह नीति बताती है कि हम क्या जानकारी एकत्र करते हैं, उसका उपयोग कैसे होता है और आपकी सुरक्षा कैसे की जाती है।
            </p>
          </section>

          {/* Privacy Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 2. जानकारी जो हम एकत्र करते हैं</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-lg mb-2">🔹 व्यक्तिगत डेटा:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>नाम, ईमेल, मोबाइल नंबर, जन्मतिथि, जेंडर</li>
                  <li>यूजरनेम, प्रोफाइल फोटो</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🔹 संवेदनशील डेटा:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>स्थान (GPS/IP), डिवाइस ID, भाषा</li>
                  <li>चैट, पोस्ट, मीडिया फाइलें</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">🔹 तकनीकी जानकारी:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>ब्राउज़र प्रकार, ऑपरेटिंग सिस्टम</li>
                  <li>लॉग डेटा, कुकीज़, एक्सेस टाइम</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Privacy Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 3. जानकारी का उपयोग</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>सेवा प्रदान करने हेतु</li>
              <li>सुरक्षा और धोखाधड़ी से बचाव हेतु</li>
              <li>अनुभव को वैयक्तिक और प्रासंगिक बनाने हेतु</li>
              <li>कानूनी अनुरोध के उत्तर में</li>
            </ul>
          </section>

          {/* Privacy Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 4. वैधिक डेटा शेयरिंग नीति</h2>
            <p className="mb-2">यदि किसी उपयोगकर्ता की गतिविधियाँ निम्न अपराधों में संलिप्त पाई जाती हैं:</p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>आतंकवाद, बम विस्फोट की योजना</li>
              <li>ड्रग तस्करी, मानव तस्करी</li>
              <li>यौन उत्पीड़न, बलात्कार</li>
              <li>राष्ट्रीय या वैश्विक सुरक्षा को खतरे में डालना</li>
            </ul>
            <p>तो हम उपयोगकर्ता की पूरी जानकारी संबंधित देश की कानूनी अथॉरिटी के साथ बिना पूर्व अनुमति के साझा करेंगे।</p>
          </section>

          {/* Privacy Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 5. डेटा की सुरक्षा</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>SSL एन्क्रिप्शन</li>
              <li>फायरवॉल और मल्टी-लेयर प्रोटेक्शन</li>
              <li>दो-चरणीय प्रमाणीकरण (2FA)</li>
            </ul>
          </section>

          {/* Privacy Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 6. उपयोगकर्ता के अधिकार</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>जानकारी को एक्सेस, संशोधित या हटाने का अधिकार</li>
              <li>डेटा पोर्टेबिलिटी का अधिकार</li>
              <li>प्रमोशनल ईमेल बंद करने का विकल्प</li>
            </ul>
          </section>

          {/* Privacy Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 7. बच्चों की सुरक्षा</h2>
            <p>
              12 वर्ष से कम आयु के बच्चों से जानबूझकर डेटा नहीं लिया जाता।
              यदि कोई खाता इस आयु सीमा के अंतर्गत आता है, तो उसे हटाया जा सकता है।
            </p>
          </section>

          {/* Privacy Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 8. नीति में बदलाव</h2>
            <p>गोपनीयता नीति में कोई भी बदलाव वेबसाइट पर प्रकाशित किया जाएगा।</p>
          </section>

          {/* Privacy Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 9. सत्यापन बैज के लिए डेटा संग्रह</h2>
            <p className="mb-2">जब कोई यूज़र ब्लू या गोल्डन टिक के लिए आवेदन करता है, हम उनसे निम्नलिखित अतिरिक्त जानकारी एकत्र कर सकते हैं:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>राष्ट्रीय पहचान पत्र (Aadhaar, Passport, आदि)</li>
              <li>कार्यस्थल / कंपनी का प्रमाण</li>
              <li>लिंक किए गए सोशल मीडिया अकाउंट्स</li>
              <li>बैंकिंग विवरण (केवल भुगतान हेतु)</li>
              <li>लोकप्रियता का प्रमाण (प्रेस, सोशल मीडिया आंकड़े आदि)</li>
            </ul>
          </section>

          {/* Privacy Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 10. भुगतान सुरक्षा</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>सभी भुगतान भारतीय RBI-अनुमोदित गेटवे से होते हैं।</li>
              <li>Ouptel क्रेडिट/डेबिट कार्ड जानकारी अपने सर्वर पर स्टोर नहीं करता।</li>
              <li>भुगतान डेटा पूरी तरह से एन्क्रिप्टेड होता है।</li>
            </ul>
          </section>

          {/* Privacy Section 11 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 11. ब्लॉक और रिपोर्टिंग सिस्टम</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>उपयोगकर्ता किसी भी आपत्तिजनक प्रोफाइल, पोस्ट या संदेश को रिपोर्ट कर सकते हैं।</li>
              <li>रिपोर्ट प्राप्त होते ही हमारी मॉडरेशन टीम 24 घंटे के अंदर कार्रवाई करेगी।</li>
              <li>लगातार रिपोर्ट की गई प्रोफाइल स्वतः जांच सूची में जाती है।</li>
            </ul>
          </section>

          {/* Privacy Section 12 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 12. डाटा होस्टिंग और लोकेशन</h2>
            <p>
              Ouptel के सर्वर भारत, सिंगापुर और जर्मनी में स्थित हैं।
              डेटा क्षेत्रीय कानूनों (जैसे GDPR, IT Act 2000) के अनुसार स्टोर और प्रोसेस किया जाता है।
            </p>
          </section>

          {/* Privacy Section 13 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 13. प्राइवेसी का उल्लंघन होने पर प्रक्रिया</h2>
            <p>
              यदि किसी उपयोगकर्ता को लगता है कि उनका डेटा गलत तरीके से उपयोग हुआ है, तो वह{' '}
              <a href="mailto:grievances@ouptel.com" className="text-blue-600 hover:underline">
                grievances@ouptel.com
              </a>{' '}
              पर शिकायत कर सकता है। सभी शिकायतों को 15 कार्यदिवस में निपटाया जाएगा।
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-blue-50 p-6 rounded-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">संपर्क जानकारी</h2>
            <p className="mb-2">यदि आपके कोई प्रश्न या चिंताएं हैं, तो कृपया हमसे संपर्क करें:</p>
            <ul className="space-y-1">
              <li><strong>ईमेल:</strong> <a href="mailto:support@ouptel.com" className="text-blue-600 hover:underline">support@ouptel.com</a></li>
              <li><strong>शिकायत:</strong> <a href="mailto:grievances@ouptel.com" className="text-blue-600 hover:underline">grievances@ouptel.com</a></li>
              <li><strong>वेबसाइट:</strong> <a href="https://ouptel.com" className="text-blue-600 hover:underline">www.ouptel.com</a></li>
            </ul>
          </section>

          {/* Footer Note */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-center">
            <p className="text-sm text-gray-600">
              इस गोपनीयता नीति को स्वीकार करके, आप Ouptel.com की सेवाओं का जिम्मेदारी से उपयोग करने के लिए सहमत होते हैं।
            </p>
            <p className="text-sm text-gray-600 mt-2">
              © 2024 Ouptel.com. सर्वाधिकार सुरक्षित।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

