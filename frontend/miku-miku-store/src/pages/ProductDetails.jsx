import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Shield, Zap, Check, ArrowLeft, Share2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const { addToCart, isInCart, getItemCount } = useCart();

  // Mock product data - replace with API call
  useEffect(() => {
    const mockProducts = {
      1: {
        id: 1,
        name: 'Netflix Premium',
        price: 15.99,
        originalPrice: 19.99,
        category: 'subscriptions',
        type: 'Monthly Subscription',
        images: [
          'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=400&fit=crop'
        ],
        description: 'Stream unlimited movies and TV shows in stunning 4K Ultra HD quality. Watch on any device, anywhere, anytime with Netflix Premium subscription.',
        longDescription: 'Netflix Premium offers the ultimate streaming experience with access to Netflix\'s entire catalog in stunning 4K Ultra HD quality. Stream on up to 4 screens simultaneously, perfect for families or shared accounts. Download content for offline viewing and enjoy ad-free entertainment on any device.',
        rating: 4.8,
        reviewCount: 12547,
        features: [
          '4K Ultra HD streaming quality',
          'Stream on 4 screens simultaneously',
          'Download content for offline viewing',
          'Ad-free entertainment',
          'Access to Netflix Originals',
          'Compatible with all devices',
          'Cancel anytime'
        ],
        benefits: [
          'Unlimited access to thousands of movies and TV shows',
          'New content added regularly',
          'Works on smart TVs, phones, tablets, and computers',
          'Create up to 5 individual profiles',
          'Parental controls available'
        ],
        specs: {
          'Subscription Type': 'Monthly recurring',
          'Video Quality': '4K Ultra HD',
          'Audio Quality': 'Dolby Atmos',
          'Simultaneous Streams': '4 screens',
          'Download Limit': 'Unlimited',
          'Supported Devices': 'All devices',
          'Geographic Availability': 'Worldwide'
        }
      },
      4: {
        id: 4,
        name: 'Google Play Gift Card',
        price: 25.00,
        category: 'giftcards',
        type: '$25 Gift Card',
        images: [
          'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
        ],
        description: 'Perfect for purchasing apps, games, movies, books, and more from the Google Play Store. Digital delivery within minutes.',
        longDescription: 'Google Play Gift Cards give you access to millions of apps, games, movies, TV shows, books, and more on Google Play. These digital gift cards are delivered instantly and never expire, making them the perfect gift for Android users or anyone with a Google account.',
        rating: 4.9,
        reviewCount: 8934,
        features: [
          'Instant digital delivery',
          'No expiration date',
          'Works worldwide',
          'Perfect for gifting',
          'Secure redemption process',
          'Multiple denomination options',
          'Compatible with all Google services'
        ],
        benefits: [
          'Access to millions of apps and games',
          'Rent or buy movies and TV shows',
          'Purchase books and audiobooks',
          'In-app purchases and subscriptions',
          'Google Play Music and YouTube Premium'
        ],
        specs: {
          'Card Value': '$25.00 USD',
          'Delivery Method': 'Digital code via email',
          'Redemption': 'Google Play Store',
          'Expiration': 'Never expires',
          'Region': 'Global (some restrictions apply)',
          'Currency': 'USD',
          'Refundable': 'No'
        }
      }
    };

    // Simulate API call
    setTimeout(() => {
      const productData = mockProducts[id];
      if (productData) {
        setProduct(productData);
        // Mock related products
        setRelatedProducts([
          {
            id: 2,
            name: 'Spotify Premium',
            price: 9.99,
            category: 'subscriptions',
            type: 'Monthly Subscription',
            image: 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=300&h=200&fit=crop',
            description: 'Ad-free music streaming',
            rating: 4.7
          },
          {
            id: 5,
            name: 'Roblox Gift Card',
            price: 20.00,
            category: 'giftcards',
            type: '$20 Gift Card',
            image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300&h=200&fit=crop',
            description: 'Robux and premium features',
            rating: 4.8
          }
        ]);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700">
            Browse all products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-indigo-600">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-indigo-600">Products</Link>
            <span>/</span>
            <Link to={`/products/${product.category}`} className="hover:text-indigo-600">
              {product.category === 'subscriptions' ? 'Subscriptions' : 'Gift Cards'}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-10">
              <img
                src={product.images[selectedImageIndex]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? 'border-indigo-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                product.category === 'subscriptions'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {product.type}
              </span>
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-medium rounded">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-600 leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
                <button className="flex items-center justify-center border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition duration-200">
                  <Heart className="h-5 w-5 mr-2" />
                  Add to Wishlist
                </button>
              </div>

              {isInCart(product.id) && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <Check className="h-4 w-4 inline mr-1" />
                    {getItemCount(product.id)} item(s) in cart
                  </p>
                </div>
              )}
            </div>

            {/* Security Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-gray-600">Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-gray-600">Instant Delivery</span>
                </div>
              </div>
            </div>

            {/* Share Button */}
            <div className="border-t pt-6">
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share this product
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Benefits */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You Get</h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <dt className="text-gray-600">{key}:</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;