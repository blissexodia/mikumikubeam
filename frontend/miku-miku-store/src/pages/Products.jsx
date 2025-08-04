import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sortBy') || 'featured';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNext: false,
    hasPrev: false
  });
  const { addToCart } = useCart();

  // Fetch categories from backend (mock for now, replace with API if needed)
  const categories = [
    { id: 'all', name: 'All Products', count: 0 },
    { id: 'subscriptions', name: 'Subscriptions', count: 0 },
    { id: 'giftcards', name: 'Gift Cards', count: 0 }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productsAPI.getAll({
          page,
          category: selectedCategory !== 'all' ? selectedCategory : '',
          search: searchQuery,
          sortBy: sortBy === 'featured' ? 'createdAt' : sortBy
        });

        // Map backend response to frontend format
        const mappedProducts = response.products.map(product => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          category: product.category.name,
          type: product.category.type,
          image: product.image,
          description: product.description,
          rating: null,
          features: product.features,
          slug: product.slug,
          stock: product.stock,
          maxQuantity: product.stock,
          originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null
        }));

        // Update category counts (approximate, replace with API if available)
        const updatedCategories = categories.map(cat => ({
          ...cat,
          count: cat.id === 'all'
            ? response.pagination.totalItems
            : response.products.filter(p => p.category.name.toLowerCase() === cat.id).length
        }));

        setProducts(mappedProducts);
        setPagination(response.pagination);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, searchQuery, sortBy]);

  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (selectedCategory === 'subscriptions') return 'Subscription Services';
    if (selectedCategory === 'giftcards') return 'Gift Cards';
    return 'All Products';
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newSearch = formData.get('search');
    setSearchParams({ search: newSearch, category: selectedCategory, sortBy, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ category: selectedCategory, search: searchQuery, sortBy, page: newPage });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2 text-indigo-600" />
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setSearchParams({ category: cat.id, search: searchQuery, sortBy, page: '1' });
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md transform scale-[1.02]'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-gray-200'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        {cat.name}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === cat.id 
                            ? 'bg-white/20 text-white' 
                            : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {cat.count}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSortBy('featured');
                  setSearchParams({ category: 'all', search: '', sortBy: 'featured', page: '1' });
                }}
                className="w-full text-sm text-white font-medium bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
              >
                Clear All Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* View Toggle & Filters */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </button>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-white shadow-md text-indigo-600 transform scale-[1.05]' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-white shadow-md text-indigo-600 transform scale-[1.05]' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Search and Sort Dropdown */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <form onSubmit={handleSearch} className="flex-1 sm:flex-none">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="search"
                        defaultValue={searchQuery}
                        placeholder="Search products..."
                        className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </form>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        const newSortBy = e.target.value;
                        setSortBy(newSortBy);
                        setSearchParams({ category: selectedCategory, search: searchQuery, sortBy: newSortBy, page: '1' });
                      }}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white hover:border-gray-400 transition-colors duration-200"
                    >
                      <option value="featured">Featured</option>
                      <option value="name">Name A-Z</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg h-80 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    className={viewMode === 'list' ? 'flex-row' : ''}
                    onAddToCart={() => addToCart(product, 1)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!pagination.hasPrev}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${
                        pagination.currentPage === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!pagination.hasNext}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for slider styling (preserved but unused) */}
      <style jsx>{`
        .slider-thumb-min::-webkit-slider-thumb,
        .slider-thumb-max::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb-min::-webkit-slider-thumb:hover,
        .slider-thumb-max::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .slider-thumb-min::-moz-range-thumb,
        .slider-thumb-max::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          transition: all 0.2s ease;
        }

        .slider-thumb-max::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
      `}</style>
    </div>
  );
};

export default Products;