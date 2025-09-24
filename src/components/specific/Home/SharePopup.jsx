import { memo, useEffect } from 'react';
import { Share, X } from 'lucide-react';
import { FaFacebook, FaWhatsapp, FaLinkedin, FaChartBar, FaFlag, FaUsers, FaPaperPlane } from 'react-icons/fa';

const SharePopup = memo(({
    isOpen,
    onClose,
    postId,
    content,
    onShareToTimeline,
    onShareToPage,
    onShareToGroup,
    onSocialShare,
    setLoading,
}) => {
    // Prevent body scrolling when popup is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;


    // const shareOnPage = async (post_id) => {
    //     setLoading(true);
    //     try {
    //         const accessToken = localStorage.getItem("access_token");
    //         const formData = new URLSearchParams();
    //         formData.append('server_key', '24a16e93e8a365b15ae028eb28a970f5ce0879aa-98e9e5bfb7fcb271a36ed87d022e9eff-37950179');
    //         formData.append('post_id', post_id);
    //         formData.append('id', '4');
    //         formData.append('type', 'share_post_on_page');

    //         const response = await fetch(`https://ouptel.com/api/posts?access_token=${accessToken}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/x-www-form-urlencoded',
    //                 'X-Requested-With': 'XMLHttpRequest',
    //                 "Accept": "application/json"
    //             },
    //             body: formData.toString(),
    //         })
    //         const data = await response.json();
    //         if (data?.api_status === 200) {
    //             console.log('Post shared successfully');
    //         } else {
    //             console.error('Error sharing post:', data);
    //         }
    //     } catch (error) {
    //         console.error('Error sharing post:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-gradient-to-br from-white/10 via-white/5 to-white/15 backdrop-blur-lg flex items-center justify-center z-[9999] overflow-hidden">
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-[95%] md:max-w-md mx-4 animate-in slide-in-from-bottom-4 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#d3d1d1]">
                    <h3 className="text-lg font-semibold text-gray-900">Share Post</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Share Options */}
                <div className="p-4 space-y-3">
                    {/* Share to Timeline */}
                    <button
                        onClick={onShareToTimeline}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Share className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Share to Timeline</p>
                            <p className="text-sm text-gray-500">Share this post on your timeline</p>
                        </div>
                    </button>

                    {/* Share to Page */}
                    <button
                        onClick={() => shareOnPage(postId)}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <FaFlag className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Share to Page</p>
                            <p className="text-sm text-gray-500">Share this post on a page you manage</p>
                        </div>
                    </button>

                    {/* Share to Group */}
                    <button
                        onClick={onShareToGroup}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <FaUsers className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">Share to Group</p>
                            <p className="text-sm text-gray-500">Share this post in a group</p>
                        </div>
                    </button>

                    {/* Social Media Sharing */}
                    <div className="pt-3 border-t border-[#d3d1d1]">
                        <p className="text-sm font-medium text-gray-700 mb-3">Share on social media</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Facebook */}
                            <button
                                onClick={() => onSocialShare('facebook')}
                                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                <FaFacebook className="w-5 h-5" />
                                <span className="text-sm font-medium">Facebook</span>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={() => onSocialShare('whatsapp')}
                                className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                <FaWhatsapp className="w-5 h-5" />
                                <span className="text-sm font-medium">WhatsApp</span>
                            </button>

                            {/* LinkedIn */}
                            <button
                                onClick={() => onSocialShare('linkedin')}
                                className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer"
                            >
                                <FaLinkedin className="w-5 h-5" />
                                <span className="text-sm font-medium">LinkedIn</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-[#d3d1d1]">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
});

SharePopup.displayName = 'SharePopup';

export default SharePopup;
