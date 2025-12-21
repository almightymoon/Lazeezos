import { PrismaClient, UserRole, UserStatus, RestaurantStatus, RestaurantType, MenuItemStatus, OrderStatus, PaymentMethod, PaymentStatus, RiderStatus } from '@prisma/client';
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.review.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.address.deleteMany();
  await prisma.rider.deleteMany();
  await prisma.user.deleteMany();
  await prisma.deliveryZone.deleteMany();

  // Hash password for all users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin User
  console.log('👤 Creating admin user...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lazeezos.com',
      phone: '+923001234567',
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      passwordHash: hashedPassword,
      emailVerified: true,
      phoneVerified: true,
    },
  });

  // Create Customer Users
  console.log('👥 Creating customer users...');
  const customers = await prisma.user.createMany({
    data: [
      {
        email: 'ahmed@example.com',
        phone: '+923001111111',
        firstName: 'Ahmed',
        lastName: 'Ali',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'sara@example.com',
        phone: '+923002222222',
        firstName: 'Sara',
        lastName: 'Khan',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'hassan@example.com',
        phone: '+923003333333',
        firstName: 'Hassan',
        lastName: 'Raza',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'fatima@example.com',
        phone: '+923004444444',
        firstName: 'Fatima',
        lastName: 'Malik',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'ali@example.com',
        phone: '+923005555555',
        firstName: 'Ali',
        lastName: 'Hassan',
        role: UserRole.CUSTOMER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
    ],
  });

  const customerUsers = await prisma.user.findMany({
    where: { role: UserRole.CUSTOMER },
  });

  // Create Restaurant Owner Users
  console.log('🍽️ Creating restaurant owners...');
  const restaurantOwners = await prisma.user.createMany({
    data: [
      {
        email: 'burgerpalace@example.com',
        phone: '+923006666666',
        firstName: 'Burger',
        lastName: 'Palace Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'pizzaitalia@example.com',
        phone: '+923007777777',
        firstName: 'Pizza',
        lastName: 'Italia Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'sushiworld@example.com',
        phone: '+923008888888',
        firstName: 'Sushi',
        lastName: 'World Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'sweettreats@example.com',
        phone: '+923009999999',
        firstName: 'Sweet',
        lastName: 'Treats Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'greenbowl@example.com',
        phone: '+923001010101',
        firstName: 'Green',
        lastName: 'Bowl Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'tacofiesta@example.com',
        phone: '+923001111111',
        firstName: 'Taco',
        lastName: 'Fiesta Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'thaiexpress@example.com',
        phone: '+923001212121',
        firstName: 'Thai',
        lastName: 'Express Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'mediterraneangrill@example.com',
        phone: '+923001313131',
        firstName: 'Mediterranean',
        lastName: 'Grill Owner',
        role: UserRole.RESTAURANT_OWNER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
    ],
  });

  const ownerUsers = await prisma.user.findMany({
    where: { role: UserRole.RESTAURANT_OWNER },
  });

  // Create Rider Users
  console.log('🚴 Creating riders...');
  const riders = await prisma.user.createMany({
    data: [
      {
        email: 'rider1@example.com',
        phone: '+923001414141',
        firstName: 'Rider',
        lastName: 'One',
        role: UserRole.RIDER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
      {
        email: 'rider2@example.com',
        phone: '+923001515151',
        firstName: 'Rider',
        lastName: 'Two',
        role: UserRole.RIDER,
        status: UserStatus.ACTIVE,
        passwordHash: hashedPassword,
        emailVerified: true,
        phoneVerified: true,
      },
    ],
  });

  const riderUsers = await prisma.user.findMany({
    where: { role: UserRole.RIDER },
  });

  // Create Riders
  for (let i = 0; i < riderUsers.length; i++) {
    await prisma.rider.create({
      data: {
        userId: riderUsers[i].id,
        status: i === 0 ? RiderStatus.ONLINE : RiderStatus.OFFLINE,
        vehicleType: 'motorcycle',
        vehicleNumber: `ABC-${1000 + i}`,
        licenseNumber: `LIC-${1000 + i}`,
        currentLatitude: 24.8607 + (Math.random() - 0.5) * 0.1,
        currentLongitude: 67.0011 + (Math.random() - 0.5) * 0.1,
        totalDeliveries: Math.floor(Math.random() * 100),
        rating: 4.5 + Math.random() * 0.5,
        totalReviews: Math.floor(Math.random() * 50),
      },
    });
  }

  // Create Restaurants
  console.log('🏪 Creating restaurants...');
  const restaurantsData = [
    {
      name: 'Burger Palace',
      slug: 'burger-palace',
      description: 'The best burgers in town!',
      cuisineTypes: ['American', 'Burgers', 'Fast Food'],
      restaurantType: RestaurantType.FAST_FOOD,
      email: 'info@burgerpalace.com',
      phone: '+923001234567',
      address: '123 Main Street',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75500',
      latitude: 24.8607,
      longitude: 67.0011,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: true,
      rating: 4.5,
      totalReviews: 234,
      totalOrders: 1250,
      deliveryFee: 2.99,
      minOrder: 15.00,
      priceRange: '$$',
      coverImage: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '09:00', close: '22:00' },
        tuesday: { open: '09:00', close: '22:00' },
        wednesday: { open: '09:00', close: '22:00' },
        thursday: { open: '09:00', close: '22:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '09:00', close: '23:00' },
        sunday: { open: '10:00', close: '22:00' },
      },
      menuItems: [
        {
          name: 'Classic Beef Burger',
          description: 'Juicy beef patty with lettuce, tomato, and special sauce',
          price: 850,
          discountedPrice: 680,
          category: 'Burgers',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Cheese Burger',
          description: 'Double cheese with beef patty',
          price: 950,
          category: 'Burgers',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Veggie Burger',
          description: 'Plant-based patty with fresh vegetables',
          price: 750,
          category: 'Burgers',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'French Fries',
          description: 'Crispy golden fries',
          price: 350,
          category: 'Sides',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1656439659132-24c68e36b553?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXJnZXIlMjBmYXN0JTIwZm9vZHxlbnwxfHx8fDE3NjYxMzEwODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Pizza Italia',
      slug: 'pizza-italia',
      description: 'Authentic Italian pizzas and pastas',
      cuisineTypes: ['Italian', 'Pizza', 'Pasta'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@pizzaitalia.com',
      phone: '+923001234568',
      address: '456 Park Avenue',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75501',
      latitude: 24.8707,
      longitude: 67.0111,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.7,
      totalReviews: 189,
      totalOrders: 980,
      deliveryFee: 3.99,
      minOrder: 20.00,
      priceRange: '$$$',
      coverImage: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '11:00', close: '23:00' },
        tuesday: { open: '11:00', close: '23:00' },
        wednesday: { open: '11:00', close: '23:00' },
        thursday: { open: '11:00', close: '23:00' },
        friday: { open: '11:00', close: '00:00' },
        saturday: { open: '11:00', close: '00:00' },
        sunday: { open: '12:00', close: '23:00' },
      },
      menuItems: [
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza with tomato sauce, mozzarella, and basil',
          price: 1200,
          discountedPrice: 1020,
          category: 'Pizza',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Pepperoni Pizza',
          description: 'Loaded with pepperoni and cheese',
          price: 1400,
          category: 'Pizza',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Carbonara Pasta',
          description: 'Creamy pasta with bacon and parmesan',
          price: 1100,
          category: 'Pasta',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1749169395459-9eb9835bd718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGl0YWxpYW4lMjBmb29kfGVufDF8fHx8MTc2NjA0MzIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Sushi World',
      slug: 'sushi-world',
      description: 'Fresh sushi and Japanese cuisine',
      cuisineTypes: ['Japanese', 'Sushi', 'Asian'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@sushiworld.com',
      phone: '+923001234569',
      address: '789 Market Road',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75502',
      latitude: 24.8807,
      longitude: 67.0211,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: true,
      rating: 4.8,
      totalReviews: 312,
      totalOrders: 1450,
      deliveryFee: 4.99,
      minOrder: 25.00,
      priceRange: '$$$',
      coverImage: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '22:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '13:00', close: '22:00' },
      },
      menuItems: [
        {
          name: 'California Roll',
          description: 'Crab, avocado, and cucumber',
          price: 900,
          category: 'Sushi Rolls',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Spicy Tuna Roll',
          description: 'Tuna with spicy mayo',
          price: 1100,
          category: 'Sushi Rolls',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: true,
          image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Salmon Nigiri',
          description: 'Fresh salmon over rice',
          price: 650,
          category: 'Nigiri',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1697580511707-476438ba9614?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMGFzaWFuJTIwZm9vZHxlbnwxfHx8fDE3NjYxMTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Sweet Treats',
      slug: 'sweet-treats',
      description: 'Delicious desserts and baked goods',
      cuisineTypes: ['Desserts', 'Bakery', 'Sweets'],
      restaurantType: RestaurantType.BAKERY,
      email: 'info@sweettreats.com',
      phone: '+923001234570',
      address: '321 Garden Street',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75503',
      latitude: 24.8907,
      longitude: 67.0311,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.6,
      totalReviews: 156,
      totalOrders: 720,
      deliveryFee: 1.99,
      minOrder: 10.00,
      priceRange: '$$',
      coverImage: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '08:00', close: '20:00' },
        tuesday: { open: '08:00', close: '20:00' },
        wednesday: { open: '08:00', close: '20:00' },
        thursday: { open: '08:00', close: '20:00' },
        friday: { open: '08:00', close: '21:00' },
        saturday: { open: '08:00', close: '21:00' },
        sunday: { open: '09:00', close: '20:00' },
      },
      menuItems: [
        {
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with ganache',
          price: 600,
          category: 'Cakes',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Cheesecake',
          description: 'New York style cheesecake',
          price: 700,
          category: 'Cakes',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1679942262057-d5732f732841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNzZXJ0JTIwY2FrZXxlbnwxfHx8fDE3NjYxMTEzMTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Green Bowl',
      slug: 'green-bowl',
      description: 'Healthy salads and bowls',
      cuisineTypes: ['Healthy', 'Salads', 'Vegan'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@greenbowl.com',
      phone: '+923001234571',
      address: '654 Ocean Boulevard',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75504',
      latitude: 24.9007,
      longitude: 67.0411,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.4,
      totalReviews: 98,
      totalOrders: 450,
      deliveryFee: 2.49,
      minOrder: 12.00,
      priceRange: '$$',
      coverImage: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '10:00', close: '21:00' },
        tuesday: { open: '10:00', close: '21:00' },
        wednesday: { open: '10:00', close: '21:00' },
        thursday: { open: '10:00', close: '21:00' },
        friday: { open: '10:00', close: '22:00' },
        saturday: { open: '10:00', close: '22:00' },
        sunday: { open: '11:00', close: '21:00' },
      },
      menuItems: [
        {
          name: 'Buddha Bowl',
          description: 'Quinoa, vegetables, and tahini dressing',
          price: 950,
          discountedPrice: 855,
          category: 'Bowls',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Greek Salad',
          description: 'Fresh vegetables with feta cheese',
          price: 800,
          category: 'Salads',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1624340209404-4f479dd59708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NjEyNjM4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Taco Fiesta',
      slug: 'taco-fiesta',
      description: 'Authentic Mexican tacos and burritos',
      cuisineTypes: ['Mexican', 'Tacos', 'Burritos'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@tacofiesta.com',
      phone: '+923001234572',
      address: '789 Market Road',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75505',
      latitude: 24.9107,
      longitude: 67.0511,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.3,
      totalReviews: 87,
      totalOrders: 380,
      deliveryFee: 2.99,
      minOrder: 15.00,
      priceRange: '$$',
      coverImage: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
      menuItems: [
        {
          name: 'Chicken Tacos',
          description: 'Grilled chicken with salsa and guacamole',
          price: 750,
          category: 'Tacos',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: false,
          isSpicy: true,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Burrito Bowl',
          description: 'Rice, beans, meat, and toppings',
          price: 950,
          category: 'Bowls',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Thai Express',
      slug: 'thai-express',
      description: 'Authentic Thai cuisine',
      cuisineTypes: ['Thai', 'Asian'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@thaiexpress.com',
      phone: '+923001234573',
      address: '456 Park Avenue',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75506',
      latitude: 24.9207,
      longitude: 67.0611,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.5,
      totalReviews: 145,
      totalOrders: 620,
      deliveryFee: 3.49,
      minOrder: 18.00,
      priceRange: '$$',
      coverImage: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '12:00', close: '22:00' },
        tuesday: { open: '12:00', close: '22:00' },
        wednesday: { open: '12:00', close: '22:00' },
        thursday: { open: '12:00', close: '22:00' },
        friday: { open: '12:00', close: '23:00' },
        saturday: { open: '12:00', close: '23:00' },
        sunday: { open: '13:00', close: '22:00' },
      },
      menuItems: [
        {
          name: 'Pad Thai',
          description: 'Stir-fried rice noodles with shrimp',
          price: 1100,
          category: 'Noodles',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: false,
          isSpicy: true,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Green Curry',
          description: 'Coconut curry with vegetables',
          price: 1000,
          category: 'Curries',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: true,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
    {
      name: 'Mediterranean Grill',
      slug: 'mediterranean-grill',
      description: 'Fresh Mediterranean cuisine',
      cuisineTypes: ['Mediterranean', 'Healthy'],
      restaurantType: RestaurantType.RESTAURANT,
      email: 'info@mediterraneangrill.com',
      phone: '+923001234574',
      address: '123 Main Street',
      city: 'Karachi',
      state: 'Sindh',
      zipCode: '75507',
      latitude: 24.9307,
      longitude: 67.0711,
      status: RestaurantStatus.ACTIVE,
      isOpen: true,
      isPromoted: false,
      rating: 4.7,
      totalReviews: 201,
      totalOrders: 890,
      deliveryFee: 3.99,
      minOrder: 22.00,
      priceRange: '$$$',
      coverImage: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      operatingHours: {
        monday: { open: '11:00', close: '22:00' },
        tuesday: { open: '11:00', close: '22:00' },
        wednesday: { open: '11:00', close: '22:00' },
        thursday: { open: '11:00', close: '22:00' },
        friday: { open: '11:00', close: '23:00' },
        saturday: { open: '11:00', close: '23:00' },
        sunday: { open: '12:00', close: '22:00' },
      },
      menuItems: [
        {
          name: 'Chicken Shawarma',
          description: 'Marinated chicken with tahini sauce',
          price: 850,
          discountedPrice: 638,
          category: 'Shawarma',
          status: MenuItemStatus.AVAILABLE,
          isPopular: true,
          isVeg: false,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
        {
          name: 'Hummus & Pita',
          description: 'Fresh hummus with warm pita bread',
          price: 600,
          category: 'Appetizers',
          status: MenuItemStatus.AVAILABLE,
          isPopular: false,
          isVeg: true,
          isSpicy: false,
          image: 'https://images.unsplash.com/photo-1640082380928-2f7079392823?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN0YXVyYW50JTIwZm9vZCUyMGRlbGl2ZXJ5fGVufDF8fHx8MTc2NjE0OTM5NHww&ixlib=rb-4.1.0&q=80&w=1080',
        },
      ],
    },
  ];

  for (let i = 0; i < restaurantsData.length; i++) {
    const restaurantData = restaurantsData[i];
    const owner = ownerUsers[i];

    const restaurant = await prisma.restaurant.create({
      data: {
        ownerId: owner.id,
        name: restaurantData.name,
        slug: restaurantData.slug,
        description: restaurantData.description,
        cuisineTypes: restaurantData.cuisineTypes,
        restaurantType: restaurantData.restaurantType,
        email: restaurantData.email,
        phone: restaurantData.phone,
        address: restaurantData.address,
        city: restaurantData.city,
        state: restaurantData.state,
        zipCode: restaurantData.zipCode,
        latitude: restaurantData.latitude,
        longitude: restaurantData.longitude,
        status: restaurantData.status,
        isOpen: restaurantData.isOpen,
        isPromoted: restaurantData.isPromoted,
        rating: restaurantData.rating,
        totalReviews: restaurantData.totalReviews,
        totalOrders: restaurantData.totalOrders,
        deliveryFee: restaurantData.deliveryFee,
        minOrder: restaurantData.minOrder,
        priceRange: restaurantData.priceRange,
        coverImage: restaurantData.coverImage,
        operatingHours: restaurantData.operatingHours,
        menu: {
          create: restaurantData.menuItems.map((item) => {
            const menuItem: any = {
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              status: item.status,
              isPopular: item.isPopular,
              isVeg: item.isVeg,
              isSpicy: item.isSpicy,
              image: item.image,
            };
            if ('discountedPrice' in item && item.discountedPrice !== undefined) {
              menuItem.discountedPrice = item.discountedPrice;
            }
            return menuItem;
          }),
        },
      },
    });

    console.log(`✅ Created restaurant: ${restaurant.name}`);
  }

  // Create Addresses for customers
  console.log('📍 Creating customer addresses...');
  for (const customer of customerUsers) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        label: 'Home',
        address: `${Math.floor(Math.random() * 1000)} Main Street`,
        city: 'Karachi',
        state: 'Sindh',
        zipCode: '75500',
        country: 'Pakistan',
        latitude: 24.8607 + (Math.random() - 0.5) * 0.1,
        longitude: 67.0011 + (Math.random() - 0.5) * 0.1,
        contactName: `${customer.firstName} ${customer.lastName}`,
        contactPhone: customer.phone,
        isDefault: true,
      },
    });
  }

  // Create some sample orders
  console.log('📦 Creating sample orders...');
  const allRestaurants = await prisma.restaurant.findMany({
    include: { menu: true },
  });

  for (let i = 0; i < customerUsers.length && i < allRestaurants.length; i++) {
    const customer = customerUsers[i];
    const restaurant = allRestaurants[i];
    const menuItems = restaurant.menu;
    if (menuItems.length === 0) continue;

    const selectedItems = menuItems.slice(0, Math.min(3, menuItems.length));
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.discountedPrice || item.price), 0);
    const deliveryFee = restaurant.deliveryFee;
    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        customerId: customer.id,
        restaurantId: restaurant.id,
        status: i === 0 ? OrderStatus.ON_THE_WAY : i === 1 ? OrderStatus.PREPARING : OrderStatus.DELIVERED,
        subtotal,
        deliveryFee,
        tax: 0,
        discount: 0,
        total,
        deliveryAddress: `${Math.floor(Math.random() * 1000)} Main St, Karachi`,
        deliveryCity: 'Karachi',
        deliveryState: 'Sindh',
        deliveryZipCode: '75500',
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: i === 2 ? PaymentStatus.COMPLETED : PaymentStatus.PENDING,
        items: {
          create: selectedItems.map((item) => ({
            menuItemId: item.id,
            quantity: Math.floor(Math.random() * 3) + 1,
            price: item.discountedPrice || item.price,
            subtotal: (item.discountedPrice || item.price) * (Math.floor(Math.random() * 3) + 1),
          })),
        },
        placedAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)),
        ...(i === 2 ? { deliveredAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000) + 30 * 60 * 1000) } : {}),
      },
    });

    if (i === 2) {
      // Create a review for delivered order
      await prisma.review.create({
        data: {
          orderId: order.id,
          customerId: customer.id,
          restaurantId: restaurant.id,
          foodRating: 5,
          serviceRating: 4,
          deliveryRating: 5,
          overallRating: 4.67,
          comment: 'Great food and fast delivery!',
        },
      });
    }
  }

  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

