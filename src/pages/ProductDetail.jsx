import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  DollarSign, 
  ShoppingCart, 
  Heart,
  Share2,
  MessageCircle,
  Package,
  TrendingUp
} from 'lucide-react';
import Loader from '../components/loading/Loader';
import Avatar from '../components/Avatar';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/products/${productId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data?.data) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#EDF6F9] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button
            onClick={() => navigate('/market')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Market
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDF6F9] pb-20">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/market')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Market</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl overflow-hidden border border-[#d3d1d1] aspect-square">
              <img
                src={product.main_image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://admin.ouptel.in/images/placeholders/product-image.svg';
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#d3d1d1] p-6">
              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating & Reviews */}
              {(product.rating > 0 || product.reviews > 0) && (
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-lg">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-600">
                    ({product.reviews} {product.reviews === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-2 mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
                <span className="text-4xl font-bold text-gray-900">
                  {product.price_formatted}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Location */}
              {product.location && (
                <div className="flex items-center space-x-2 text-gray-700 mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{product.location}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Package className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">{product.orders}</div>
                  <div className="text-xs text-gray-600">Orders</div>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">{product.total_sales}</div>
                  <div className="text-xs text-gray-600">Sales</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-2xl font-bold text-gray-900">{product.rating.toFixed(1)}</div>
                  <div className="text-xs text-gray-600">Rating</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button className="flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-white rounded-xl border border-[#d3d1d1] p-6">
              <h3 className="font-semibold text-lg text-gray-900 mb-4">Seller Information</h3>
              <div
                className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                onClick={() => {
                  if (product.user?.user_id) {
                    navigate(`/profile/${product.user.user_id}`);
                  }
                }}
              >
                <Avatar
                  src={product.user?.avatar_url}
                  name={product.user?.username || 'Seller'}
                  size="lg"
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {product.user?.username || 'Unknown Seller'}
                  </p>
                  <p className="text-sm text-gray-600">View Profile</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
