import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseUrl } from '../../utils/constant';

const JobApplicationModal = ({ isOpen, onClose, jobId, jobTitle, companyName }) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCoverLetter('');
      setResumeUrl('');
    }
  }, [isOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverLetter.trim()) {
      toast.error('Please enter a cover letter');
      return;
    }

    if (!resumeUrl.trim()) {
      toast.error('Please enter a resume URL');
      return;
    }

    // Validate URL format
    try {
      new URL(resumeUrl);
    } catch (error) {
      toast.error('Please enter a valid URL for your resume');
      return;
    }

    const accessToken = localStorage.getItem('access_token');
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/jobs/${jobId}/apply`,
        {
          cover_letter: coverLetter.trim(),
          resume_url: resumeUrl.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;
      console.log('Job application response:', data);

      if (data?.ok === true || response.status === 200 || response.status === 201) {
        toast.success(data?.message || 'Application submitted successfully!');
        onClose();
        // Reset form
        setCoverLetter('');
        setResumeUrl('');
      } else {
        toast.error(data?.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting job application:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Failed to submit application';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#d3d1d1] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#d3d1d1]">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">Apply for Job</h2>
            {jobTitle && companyName && (
              <p className="text-sm text-gray-600 mt-1">
                {jobTitle} at {companyName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors ml-4"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Cover Letter */}
          <div>
            <label
              htmlFor="cover-letter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              id="cover-letter"
              rows="6"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="I am very interested in this position and believe my skills match your requirements perfectly..."
              className="w-full px-4 py-3 border border-[#d3d1d1] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tell us why you're interested in this position
            </p>
          </div>

          {/* Resume URL */}
          <div>
            <label
              htmlFor="resume-url"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Resume URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="resume-url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              placeholder="https://example.com/resume.pdf"
              className="w-full px-4 py-3 border border-[#d3d1d1] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL where your resume is hosted (e.g., Google Drive, Dropbox, personal website)
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d3d1d1]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModal;

