import { X } from 'lucide-react';
import { useState } from 'react';

const ReportPostModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [selectedReason, setSelectedReason] = useState('r_spam');
  const [description, setDescription] = useState('');

  const reportReasons = [
    { value: 'r_spam', label: 'Spam', description: 'Repetitive or misleading content' },
    { value: 'r_violence', label: 'Violence', description: 'Violent or graphic content' },
    { value: 'r_hate', label: 'Hate Speech', description: 'Hateful or discriminatory content' },
    { value: 'r_nudity', label: 'Nudity or Sexual Content', description: 'Inappropriate sexual content' },
    { value: 'r_fake', label: 'False Information', description: 'Misleading or false information' },
    { value: 'r_other', label: 'Other', description: 'Other violations' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedReason, description || 'This post violates community guidelines.');
    // Reset form
    setSelectedReason('r_spam');
    setDescription('');
  };

  const handleClose = () => {
    setSelectedReason('r_spam');
    setDescription('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Report Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-600">
              Please select a reason for reporting this post. Your report will be reviewed by our moderation team.
            </p>

            {/* Reason Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Reason *
              </label>
              {reportReasons.map((reason) => (
                <label
                  key={reason.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedReason === reason.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.value}
                    checked={selectedReason === reason.value}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{reason.label}</div>
                    <div className="text-sm text-gray-500">{reason.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Additional Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more context about why you're reporting this post..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportPostModal;
