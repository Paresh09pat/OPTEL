import axios from 'axios';
import { MapPin, Search, ShoppingCart, Star, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';
import Loader from '../components/loading/Loader';

const Market = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (term = '', page = 1) => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      const params = new URLSearchParams();
      if (term) params.append('term', term);
      params.append('page', page.toString());
      params.append('per_page', '12');

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/products?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;
      if (data?.data) {
        if (page === 1) {
          setProducts(data.data);
        } else {
          setProducts(prev => [...prev, ...data.data]);
        }
        setPagination(data.meta);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setCurrentPage(1);
    fetchProducts(searchInput, 1);
  };

  const handleLoadMore = () => {
    if (pagination && currentPage < pagination.last_page) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProducts(searchTerm, nextPage);
    }
  };

  const ProductCard = ({ product }) => {
    return (
      <div 
        className="bg-white rounded-2xl overflow-hidden border border-[#d3d1d1] hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group h-full flex flex-col"
        onClick={() => navigate(`/market/${product.id}`)}
      >
        {/* Product Image Section */}
        <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 p-4">
          {/* Wishlist Button */}
         

          {/* Product Badge */}
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg z-10">
            PRODUCT
          </div>

          {/* Product Image Container */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Inner Product Card */}
            <div className="bg-white rounded-lg shadow-md p-4 w-full max-w-[200px] flex flex-col items-center">
              {/* Small Product Badge */}
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-bold mb-2">
                PRODUCT
              </div>
              
              {/* Product Image */}
              <div className="w-24 h-24 flex items-center justify-center">
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://admin.ouptel.in/images/placeholders/product-image.svg';
                  }}
                />
              </div>
            </div>

            {/* Product Image Label */}
            <div className="text-gray-500 text-xs mt-2">
              Product Image
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="p-5 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">
                {product.price_formatted.split(' ')[0]}
              </span>
              <span className="text-base text-gray-500 font-medium">
                {product.price_formatted.split(' ')[1] || 'USD'}
              </span>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Reviews */}
          <div className="mb-4">
            {product.rating > 0 && product.reviews > 0 ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-sm">{product.rating.toFixed(2)}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {product.reviews}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-500">No reviews yet</span>
            )}
          </div>

          {/* Location */}
          {product.location && (
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm truncate">{product.location}</span>
            </div>
          )}

          {/* Seller Info */}
          <div className="flex items-center mb-4 mt-auto">
            <div
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity flex-1 min-w-0"
              onClick={(e) => {
                e.stopPropagation();
                if (product.user?.user_id) {
                  navigate(`/profile/${product.user.user_id}`);
                }
              }}
            >
              <Avatar
                src={product.user?.avatar_url}
                name={product.user?.username || 'Seller'}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 truncate">
                  {product.user?.username || 'Unknown Seller'}
                </p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart functionality
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#EDF6F9] pb-20">
      {loading && currentPage === 1 && <Loader />}

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Marketplace
          </h1>
          <p className="text-gray-600">
            Discover amazing products from our community
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-[#d3d1d1] p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
              
            </div>
          </form>

          {/* Active Search Term */}
          {searchTerm && (
            <div className="mt-3 flex items-center space-x-2">
              <span className="text-sm text-gray-600">Searching for:</span>
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{searchTerm}</span>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearchInput('');
                    setCurrentPage(1);
                    fetchProducts('', 1);
                  }}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        {pagination && (
          <div className="mb-4 text-gray-600">
            Showing {products.length} of {pagination.total} products
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More Button */}
            {pagination && currentPage < pagination.last_page && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Loading more products...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Products</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl border border-[#d3d1d1] p-12 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? `No products match "${searchTerm}". Try a different search term.`
                    : 'No products available at the moment.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSearchInput('');
                      setCurrentPage(1);
                      fetchProducts('', 1);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Market;
