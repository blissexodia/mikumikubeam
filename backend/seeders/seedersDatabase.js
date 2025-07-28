// seeders/seedDatabase.js
const bcrypt = require('bcryptjs');
const { User, Category, Product } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const adminExists = await User.findOne({ where: { email: 'admin@mikumiku.store' } });
    if (!adminExists) {
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@mikumiku.store',
        password: 'Admin123!',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    }

    // Create test user
    const userExists = await User.findOne({ where: { email: 'user@test.com' } });
    if (!userExists) {
      await User.create({
        firstName: 'Test',
        lastName: 'User',
        email: 'user@test.com',
        password: 'Test123!',
        role: 'user'
      });
      console.log('✅ Test user created');
    }

    // Create categories
    const categories = [
      {
        name: 'Streaming Services',
        slug: 'streaming-services',
        description: 'Premium streaming subscriptions for movies, TV shows, and entertainment',
        type: 'subscription',
        icon: '🎬',
        color: '#14B8A6',
        sortOrder: 1
      },
      {
        name: 'Music Platforms',
        slug: 'music-platforms',
        description: 'Music streaming and audio entertainment subscriptions',
        type: 'subscription',
        icon: '🎵',
        color: '#8B5CF6',
        sortOrder: 2
      },
      {
        name: 'Gaming Subscriptions',
        slug: 'gaming-subscriptions',
        description: 'Gaming platform subscriptions and premium features',
        type: 'subscription',
        icon: '🎮',
        color: '#F59E0B',
        sortOrder: 3
      },
      {
        name: 'Communication',
        slug: 'communication',
        description: 'Premium communication and productivity tools',
        type: 'subscription',
        icon: '💬',
        color: '#EF4444',
        sortOrder: 4
      },
      {
        name: 'Gaming Gift Cards',
        slug: 'gaming-gift-cards',
        description: 'Digital gift cards for gaming platforms and stores',
        type: 'giftcard',
        icon: '🎲',
        color: '#10B981',
        sortOrder: 5
      },
      {
        name: 'Digital Store Cards',
        slug: 'digital-store-cards',
        description: 'Gift cards for digital stores and platforms',
        type: 'giftcard',
        icon: '🛒',
        color: '#06B6D4',
        sortOrder: 6
      }
    ];

    for (const categoryData of categories) {
      const [category] = await Category.findOrCreate({
        where: { slug: categoryData.slug },
        defaults: categoryData
      });
      console.log(`✅ Category: ${category.name}`);
    }

    // Get categories for products
    const streamingCategory = await Category.findOne({ where: { slug: 'streaming-services' } });
    const musicCategory = await Category.findOne({ where: { slug: 'music-platforms' } });
    const gamingSubCategory = await Category.findOne({ where: { slug: 'gaming-subscriptions' } });
    const commCategory = await Category.findOne({ where: { slug: 'communication' } });
    const gamingGiftCategory = await Category.findOne({ where: { slug: 'gaming-gift-cards' } });
    const digitalStoreCategory = await Category.findOne({ where: { slug: 'digital-store-cards' } });

    // Create products
    const products = [
      // Streaming Services
      {
        name: 'Netflix Premium',
        slug: 'netflix-premium',
        description: 'Stream unlimited movies and TV shows in 4K Ultra HD quality with Netflix Premium subscription.',
        shortDescription: 'Premium Netflix subscription with 4K streaming and multiple device access',
        price: 15.99,
        originalPrice: 19.99,
        type: 'subscription',
        duration: '1 month',
        categoryId: streamingCategory.id,
        features: ['4K Ultra HD', 'Watch on 4 devices', 'Download to 6 devices', 'No ads'],
        image: '/images/netflix-premium.jpg',
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Disney+ Annual',
        slug: 'disney-plus-annual',
        description: 'Get a full year of Disney+ with access to Disney, Pixar, Marvel, Star Wars, and National Geographic content.',
        shortDescription: 'Annual Disney+ subscription with all premium content',
        price: 79.99,
        originalPrice: 95.99,
        type: 'subscription',
        duration: '12 months',
        categoryId: streamingCategory.id,
        features: ['Disney classics', 'Marvel movies', 'Star Wars series', 'Pixar collection', '4K streaming'],
        image: '/images/disney-plus.jpg',
        isFeatured: true,
        sortOrder: 2
      },
      // Music Platforms
      {
        name: 'Spotify Premium',
        slug: 'spotify-premium',
        description: 'Enjoy ad-free music streaming with offline downloads and unlimited skips.',
        shortDescription: 'Premium Spotify with no ads and offline listening',
        price: 9.99,
        type: 'subscription',
        duration: '1 month',
        categoryId: musicCategory.id,
        features: ['No ads', 'Offline download', 'Unlimited skips', 'High quality audio'],
        image: '/images/spotify-premium.jpg',
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Apple Music Family',
        slug: 'apple-music-family',
        description: 'Apple Music family plan for up to 6 people with access to over 100 million songs.',
        shortDescription: 'Apple Music family subscription for up to 6 members',
        price: 14.99,
        type: 'subscription',
        duration: '1 month',
        categoryId: musicCategory.id,
        features: ['Up to 6 accounts', '100M+ songs', 'Lossless audio', 'Offline listening'],
        image: '/images/apple-music.jpg',
        sortOrder: 4
      },
      // Gaming Subscriptions
      {
        name: 'Discord Nitro',
        slug: 'discord-nitro',
        description: 'Upgrade your Discord experience with Nitro benefits including better video quality and custom emojis.',
        shortDescription: 'Discord Nitro with premium features and perks',
        price: 9.99,
        type: 'subscription',
        duration: '1 month',
        categoryId: commCategory.id,
        features: ['HD video streaming', 'Custom emojis', 'Larger file uploads', 'Server boosts'],
        image: '/images/discord-nitro.jpg',
        isFeatured: true,
        sortOrder: 5
      },
      // Gift Cards
      {
        name: 'Google Play Gift Card $25',
        slug: 'google-play-25',
        description: '$25 Google Play gift card for apps, games, movies, books, and more on Google Play Store.',
        shortDescription: '$25 credit for Google Play Store purchases',
        price: 25.00,
        type: 'giftcard',
        categoryId: digitalStoreCategory.id,
        features: ['Apps & Games', 'Movies & TV', 'Books & Magazines', 'No expiry date'],
        image: '/images/google-play-card.jpg',
        isFeatured: true,
        sortOrder: 6
      },
      {
        name: 'Roblox Gift Card $10',
        slug: 'roblox-gift-card-10',
        description: '$10 Roblox gift card to purchase Robux and premium items in Roblox games.',
        shortDescription: '$10 credit for Roblox Robux and premium items',
        price: 10.00,
        type: 'giftcard',
        categoryId: gamingGiftCategory.id,
        features: ['Buy Robux', 'Premium items', 'Avatar accessories', 'Game passes'],
        image: '/images/roblox-card.jpg',
        sortOrder: 7
      },
      {
        name: 'Steam Wallet $50',
        slug: 'steam-wallet-50',
        description: '$50 Steam Wallet code to purchase games, DLC, and other content on Steam.',
        shortDescription: '$50 credit for Steam games and content',
        price: 50.00,
        type: 'giftcard',
        categoryId: gamingGiftCategory.id,
        features: ['Buy games', 'Download DLC', 'In-game purchases', 'Community features'],
        image: '/images/steam-card.jpg',
        isFeatured: true,
        sortOrder: 8
      }
    ];

    for (const productData of products) {
      const [product] = await Product.findOrCreate({
        where: { slug: productData.slug },
        defaults: productData
      });
      console.log(`✅ Product: ${product.name}`);
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
    throw error;
  }
};

module.exports = seedDatabase;