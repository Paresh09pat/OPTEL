import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 sm:p-8">
        <div className="mb-6">
          <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ouptel.com - विस्तृत नियम और शर्तें</h1>
          <p className="text-sm text-gray-600">Terms and Conditions</p>
        </div>

        <div className="prose max-w-none space-y-6 text-gray-700">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 कानूनी कानूनों का अनुपालन</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>आतंकवाद, ड्रग्स, रेप, स्मगलिंग जैसी आपराधिक गतिविधियों पर शून्य सहनशीलता</li>
              <li>सभी देशों के कानूनों के अनुरूप डेटा शेयरिंग</li>
              <li>यूज़र अधिकार और जिम्मेदारियाँ</li>
              <li>सुरक्षा मानक, सर्वर और डेटा एन्क्रिप्शन</li>
              <li>यूज़र जनरेटेड कंटेंट नीति</li>
              <li>बच्चों की सुरक्षा</li>
              <li>जूरीडिक्शन की वैधिक प्रकृति</li>
              <li>अंतरराष्ट्रीय स्तर पर प्रासंगिक कानूनी पैराग्राफ</li>
            </ul>
            <p className="mt-3 text-sm">
              <strong>प्रभावी तिथि:</strong> [तारीख डालें]<br />
              <strong>अंतिम अद्यतन:</strong> [तारीख डालें]
            </p>
          </section>


          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. प्रस्तावना</h2>
            <p>
              यह नियम और शर्तें Ouptel.com ("हम", "हमारा", "प्लेटफ़ॉर्म") और आप ("यूज़र", "उपयोगकर्ता") के बीच एक वैधानिक समझौता है, 
              जो आपको हमारी सेवाओं के उपयोग के नियमों को परिभाषित करता है। हमारी सेवा का उपयोग करके, आप इन सभी शर्तों से सहमत होते हैं।
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 2. सेवा का उद्देश्य और उपयोग</h2>
            <p className="mb-2">Ouptel.com एक सार्वजनिक सोशल मीडिया नेटवर्क है जो उपयोगकर्ताओं को निम्नलिखित सुविधाएं प्रदान करता है:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>व्यक्तिगत प्रोफाइल निर्माण</li>
              <li>मित्रता जोड़ना, चैट करना</li>
              <li>सामग्री (फोटो, वीडियो, टेक्स्ट, अभियान) साझा करना</li>
              <li>जनसंपर्क, प्रचार और जागरूकता अभियान</li>
            </ul>
            <p className="mt-2">यह प्लेटफ़ॉर्म केवल कानूनी और नैतिक उपयोग के लिए है।</p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 3. अंतरराष्ट्रीय कानूनी अनुपालन</h2>
            <p className="mb-2">
              Ouptel.com सभी देशों के कानूनों का पूर्ण सम्मान करता है। यदि कोई उपयोगकर्ता Ouptel.com का उपयोग करते हुए आतंकवाद, 
              ड्रग्स तस्करी, बलात्कार, मानव तस्करी, संगठित अपराध, या किसी भी प्रकार के हिंसक अपराधों को बढ़ावा देता है या योजना बनाता है, 
              तो Ouptel.com संबंधित देश की सरकारी एजेंसी, पुलिस या इंटेलिजेंस अथॉरिटी को पूरी जानकारी प्रदान करेगा।
            </p>
            <p className="mb-2">इसमें निम्नलिखित शामिल हो सकता है:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>उपयोगकर्ता का नाम, ईमेल, फोन नंबर</li>
              <li>लोकेशन (IP Address, GPS)</li>
              <li>चैट/पोस्ट का कंटेंट और समय</li>
              <li>लॉग इन समय और ब्राउज़र डेटा</li>
            </ul>
            <p className="mt-2">
              Ouptel यह डेटा किसी भी देश की आतंकवाद निरोधी एजेंसी, साइबर क्राइम अथॉरिटी, इंटरपोल या अन्य वैधिक एजेंसियों को साझा कर सकता है।
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 4. यूज़र जिम्मेदारी</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>आप किसी भी गैरकानूनी, अपमानजनक, भड़काऊ, पोर्नोग्राफिक, नस्लवादी, या भ्रामक सामग्री पोस्ट नहीं करेंगे।</li>
              <li>आप Ouptel को सार्वजनिक मंच मानते हुए किसी भी अपराध की योजना बनाने या प्रचार के लिए प्रयोग नहीं करेंगे।</li>
              <li>किसी व्यक्ति, धर्म, समूह या समुदाय को बदनाम करने या नफरत फैलाने की अनुमति नहीं है।</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 5. कंटेंट नीति</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>आप जो कुछ भी पोस्ट करते हैं (टेक्स्ट, मीडिया, टिप्पणियाँ), उसके लिए आप स्वयं जिम्मेदार हैं।</li>
              <li>आप हमें वैधिक स्तर पर उसका उपयोग, प्रदर्शन, प्रचार और समीक्षा करने का अधिकार देते हैं।</li>
              <li>आप यह सुनिश्चित करते हैं कि वह सामग्री किसी अन्य की बौद्धिक संपदा का उल्लंघन नहीं करती।</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 6. खाता निलंबन / समाप्ति नीति</h2>
            <p className="mb-2">हम निम्न स्थितियों में आपका खाता स्थायी रूप से बंद कर सकते हैं:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>यदि आपने गंभीर अपराधों को बढ़ावा दिया</li>
              <li>बार-बार रिपोर्ट की गई</li>
              <li>कोई कानूनी एजेंसी अनुरोध करे</li>
              <li>स्पैमिंग या हेट-स्पीच करें</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 7. सीमित उत्तरदायित्व (Limitation of Liability)</h2>
            <p>
              हम आपके द्वारा या किसी तीसरे पक्ष द्वारा की गई गतिविधियों के लिए ज़िम्मेदार नहीं होंगे। 
              हमारी सेवा "जैसी है" (As-Is) के आधार पर प्रदान की जाती है।
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 8. विवाद समाधान और न्याय क्षेत्र</h2>
            <p>
              Ouptel.com से संबंधित किसी भी विवाद का समाधान पहले आंतरिक रूप से किया जाएगा। 
              यदि कानूनी कार्रवाई की आवश्यकता हो, तो मामला भारत में Ouptel के पंजीकृत कार्यालय क्षेत्राधिकार के अधीन होगा। 
              वैधिक उपयोगकर्ता के मामलों में, संबंधित देश के साइबर अथॉरिटी/अदालत के साथ समन्वय किया जा सकता है।
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 9. उपयोग में बदलाव</h2>
            <p>
              हम समय-समय पर इन शर्तों को अपडेट कर सकते हैं। कोई भी बड़ा बदलाव आपको ईमेल/नोटिफिकेशन द्वारा सूचित किया जाएगा।
            </p>
          </section>


          {/* Section 11 - Verification Badge */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 10. सत्यापन बैज नीति (Verification Badge Policy)</h2>
            <p className="mb-3">Ouptel.com अपने प्लेटफ़ॉर्म पर दो प्रकार के सत्यापन बैज (Verified Badge) प्रदान करता है:</p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">🔹 1. ब्लू टिक (Blue Tick)</h3>
              <p className="mb-2"><strong>प्राप्तकर्ता:</strong></p>
              <ul className="list-disc pl-6 space-y-1 mb-2">
                <li>सामान्य नागरिक</li>
                <li>सोशल मीडिया इन्फ्लुएंसर</li>
                <li>पत्रकार / स्वतंत्र पत्रकार</li>
                <li>टीवी कलाकार</li>
                <li>सरकारी अधिकारी</li>
                <li>शैक्षणिक या सामाजिक संस्थान से जुड़े प्रतिष्ठित व्यक्ति</li>
              </ul>
              <p><strong>शुल्क:</strong> ₹399/- प्रति वर्ष</p>
              <p><strong>मान्यता:</strong> यह बैज यह दर्शाता है कि उपयोगकर्ता की पहचान सत्यापित है और वह समाज में सक्रिय है।</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <h3 className="text-xl font-semibold text-yellow-900 mb-2">🔹 2. गोल्डन टिक (Golden Tick)</h3>
              <p className="mb-2"><strong>प्राप्तकर्ता:</strong></p>
              <ul className="list-disc pl-6 space-y-1 mb-2">
                <li>राज्य/राष्ट्रीय/अंतरराष्ट्रीय स्तर के राजनेता</li>
                <li>प्रधानमंत्री, राष्ट्रपति, या किसी देश का राजदूत</li>
                <li>MNC कंपनी के CEO या डायरेक्टर</li>
                <li>विश्व प्रसिद्ध अभिनेता, पत्रकार, या बिजनेसमैन</li>
                <li>पब्लिक फिगर जिनकी पहचान वैश्विक/राष्ट्रीय स्तर पर स्थापित हो</li>
              </ul>
              <p><strong>शुल्क:</strong> ₹999/- प्रति वर्ष</p>
              <p><strong>मान्यता:</strong> यह बैज प्लेटफ़ॉर्म पर एक उच्चतम सम्मान और विश्वसनीयता का प्रतीक होगा।</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">सामान्य नियम:</h4>
              <p>Ouptel यह अधिकार सुरक्षित रखता है कि वह किसी भी समय बिना कारण बताए बैज को अस्वीकार या हटा सकता है यदि:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>जानकारी झूठी हो</li>
                <li>यूज़र कानून का उल्लंघन करे</li>
                <li>समाज विरोधी गतिविधियों में संलिप्त हो</li>
              </ul>
            </div>
          </section>

          {/* Section 12 - Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 11. भुगतान, रिफंड और बिलिंग नीति</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>भुगतान क्रेडिट कार्ड, डेबिट कार्ड, UPI या नेट बैंकिंग से किया जा सकता है।</li>
              <li>भुगतान वार्षिक आधार पर अग्रिम रूप से लिया जाएगा।</li>
              <li>भुगतान की पुष्टि ईमेल और SMS के माध्यम से दी जाएगी।</li>
              <li>एक बार भुगतान होने के बाद कोई रिफंड नहीं दिया जाएगा (No Refund Policy)।</li>
              <li>उपभोक्ता कानूनों के अनुसार, कोई तकनीकी गड़बड़ी पर अपील की जा सकती है।</li>
            </ul>
          </section>

          {/* Section 13 - Advertisement */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 12. विज्ञापन और प्रचार नीति</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>केवल सत्यापित और कानूनी रूप से अनुमोदित विज्ञापन Ouptel पर अनुमति है।</li>
              <li>नशीले पदार्थ, हथियार, आपत्तिजनक कंटेंट या राजनीतिक नफरत फैलाने वाले विज्ञापन प्रतिबंधित हैं।</li>
              <li>किसी विज्ञापन को पोस्ट करने से पहले उसे Ouptel द्वारा स्वीकृति लेनी होगी।</li>
            </ul>
          </section>

          {/* Section 14 - Copyright */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 13. कॉपीराइट और बौद्धिक संपत्ति</h2>
            <p>
              प्लेटफ़ॉर्म की डिज़ाइन, लोगो, इंटरफेस, और कार्यप्रणाली Ouptel की बौद्धिक संपत्ति है। 
              किसी भी प्रकार की नकल, चोरी या प्रतिलिपि बनाना अवैध है और उस पर कानूनी कार्यवाही हो सकती है।
            </p>
          </section>

          {/* Section 15 - Transparency */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 14. ट्रांसपेरेंसी रिपोर्ट</h2>
            <p className="mb-2">Ouptel हर 6 महीने में एक ट्रांसपेरेंसी रिपोर्ट प्रकाशित करेगा जिसमें:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>कितने अकाउंट बैन हुए</li>
              <li>कितनी सरकारी एजेंसी की सूचना माँगी गई</li>
              <li>कितने अपराध रोकने में डेटा साझा किया गया</li>
            </ul>
          </section>

          {/* Section 16 - Developer API */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 15. डेवलपर और API नीति</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ouptel की API तक पहुंच केवल स्वीकृत डेवलपर्स को दी जाती है।</li>
              <li>किसी भी थर्डपार्टी ऐप को यूज़र डेटा तक बिना अनुमति पहुंच नहीं दी जाएगी।</li>
              <li>API की शर्तों का उल्लंघन करने पर डेवलपर को ब्लॉक किया जा सकता है।</li>
            </ul>
          </section>

          {/* Section 17 - Emergency Data Release */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">🔷 16. इमरजेंसी डेटा रिलीज नीति (EDR)</h2>
            <p className="mb-2">
              Ouptel भारत सहित सभी देशों की कानूनी संस्थाओं के साथ मिलकर यह सुनिश्चित करता है कि यदि कोई यूज़र Ouptel का प्रयोग 
              आतंकवाद, बलात्कार, ड्रग तस्करी, या किसी संगठित अपराध के लिए करता है, तो हम:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>संपूर्ण डेटा (IP, चैट लॉग्स, मीडिया) उस देश की एजेंसी को देंगे</li>
              <li>अनुरोध मिलने पर डेटा को सुरक्षित रूप से 90 दिनों तक संग्रहीत रखेंगे</li>
              <li>Ouptel स्वयं भी ऐसी गतिविधियों की रिपोर्ट करेगा (Proactive Monitoring)</li>
            </ul>
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
              इन नियमों और शर्तों को स्वीकार करके, आप Ouptel.com की सेवाओं का जिम्मेदारी से उपयोग करने के लिए सहमत होते हैं।
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

export default TermsAndConditions;
