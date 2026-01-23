import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const Wallet = () => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [recipientSearch, setRecipientSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/wallet/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data?.api_status === 200) {
        setWalletData(data.data);
      } else {
        throw new Error(data?.message || 'Failed to fetch wallet balance');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      const accessToken = localStorage.getItem('access_token');
      const userId = localStorage.getItem('user_id');

      if (!accessToken || !userId) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/wallet/top-up`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          amount: parseFloat(topUpAmount),
          payment_method: paymentMethod,
        }),
      });

      const data = await response.json();

      if (data?.api_status === 200) {
        toast.success(data.message || 'Money successfully added to your wallet!');
        setWalletData(data.data);
        setShowTopUpModal(false);
        setTopUpAmount('');
        fetchWalletBalance(); // Refresh balance
      } else {
        throw new Error(data?.message || 'Failed to add money');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const quickAmounts = [10, 25, 50, 100, 500];

  // Search for users to send money
  const searchUsers = async (query) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/search/users?query=${encodeURIComponent(query)}&limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data?.ok && data?.data) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle send money
  const handleSendMoney = async () => {
    if (!selectedRecipient) {
      toast.error('Please select a recipient');
      return;
    }

    if (!sendAmount || parseFloat(sendAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(sendAmount) > (walletData?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setIsSending(true);
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/wallet/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: selectedRecipient.user_id,
          amount: parseFloat(sendAmount),
        }),
      });

      const data = await response.json();

      if (data?.api_status === 200) {
        toast.success(data.message || 'Money sent successfully!');
        // Update wallet balance with new balance from response
        if (data.data?.new_balance !== undefined) {
          setWalletData(prev => ({
            ...prev,
            balance: data.data.new_balance,
            wallet: data.data.new_balance
          }));
        }
        // Close modal and reset form
        setShowSendMoneyModal(false);
        setSendAmount('');
        setSelectedRecipient(null);
        setRecipientSearch('');
        setSearchResults([]);
        // Refresh balance to be sure
        fetchWalletBalance();
      } else {
        throw new Error(data?.message || 'Failed to send money');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to send money');
    } finally {
      setIsSending(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (recipientSearch) {
        searchUsers(recipientSearch);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [recipientSearch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 mt-2">Manage your wallet balance and transactions</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error loading wallet</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-8 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm opacity-90">Total Balance</p>
                <h2 className="text-4xl font-bold mt-1">
                  ${walletData?.balance?.toFixed(2) || '0.00'}
                </h2>
              </div>
            </div>
            <button
              onClick={fetchWalletBalance}
              className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
              <p className="text-sm opacity-90">Wallet Amount</p>
              <p className="text-2xl font-semibold mt-1">
                ${walletData?.wallet?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Available Balance</p>
              <p className="text-2xl font-semibold mt-1">
                ${walletData?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button 
            onClick={() => setShowTopUpModal(true)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Add Money</p>
                <p className="text-sm text-gray-600">Top up wallet</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setShowSendMoneyModal(true)}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Transfer</p>
                <p className="text-sm text-gray-600">Send money</p>
              </div>
            </div>
          </button>

          <button className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">History</p>
                <p className="text-sm text-gray-600">View transactions</p>
              </div>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">No transactions yet</p>
            <p className="text-sm mt-1">Your transaction history will appear here</p>
          </div>
        </div>
      </div>

      {/* Send Money Modal */}
      {showSendMoneyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Send Money</h3>
              <button
                onClick={() => {
                  setShowSendMoneyModal(false);
                  setSendAmount('');
                  setSelectedRecipient(null);
                  setRecipientSearch('');
                  setSearchResults([]);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Current Balance Display */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-600 mb-1">Available Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                ${walletData?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Recipient Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Recipient
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={recipientSearch}
                  onChange={(e) => {
                    setRecipientSearch(e.target.value);
                    setSelectedRecipient(null);
                  }}
                  placeholder="Search by name or username..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && !selectedRecipient && (
                <div className="mt-2 border-2 border-gray-200 rounded-lg max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.user_id}
                      onClick={() => {
                        setSelectedRecipient(user);
                        setRecipientSearch(user.name || user.username);
                        setSearchResults([]);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={user.avatar_url || user.avatar || '/perimg.png'}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = '/perimg.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          @{user.username}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Recipient */}
              {selectedRecipient && (
                <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg flex items-center gap-3">
                  <img
                    src={selectedRecipient.avatar_url || selectedRecipient.avatar || '/perimg.png'}
                    alt={selectedRecipient.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/perimg.png';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {selectedRecipient.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      @{selectedRecipient.username}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRecipient(null);
                      setRecipientSearch('');
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Send
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  max={walletData?.balance || 0}
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold"
                />
              </div>
              {sendAmount && parseFloat(sendAmount) > (walletData?.balance || 0) && (
                <p className="text-red-500 text-sm mt-1">Insufficient balance</p>
              )}
            </div>

            {/* Quick Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[5, 10, 25, 50, 100].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSendAmount(amount.toString())}
                    disabled={amount > (walletData?.balance || 0)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      sendAmount === amount.toString()
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSendMoneyModal(false);
                  setSendAmount('');
                  setSelectedRecipient(null);
                  setRecipientSearch('');
                  setSearchResults([]);
                }}
                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMoney}
                disabled={
                  isSending || 
                  !selectedRecipient || 
                  !sendAmount || 
                  parseFloat(sendAmount) <= 0 ||
                  parseFloat(sendAmount) > (walletData?.balance || 0)
                }
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  'Send Money'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Add Money</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopUpAmount(amount.toString())}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                      topUpAmount === amount.toString()
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                  $
                </span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-semibold"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium text-gray-900">PayPal</span>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={paymentMethod === 'credit_card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium text-gray-900">Credit Card</span>
                </label>
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 font-medium text-gray-900">Bank Transfer</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={isProcessing || !topUpAmount || parseFloat(topUpAmount) <= 0}
                className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  'Add Money'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
