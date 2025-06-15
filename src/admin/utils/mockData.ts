// Mock data for admin panel

export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  image: string
  status: 'upcoming' | 'ongoing' | 'completed'
  capacity: number
  registered: number
  price?: string
  category?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  featured: boolean
  ingredients?: string[]
  prepTime?: string
  calories?: number
  rating?: number
}

export interface InstagramPost {
  id: string
  image: string
  caption: string
  hashtags: string[]
  scheduledDate?: string
  status: 'published' | 'scheduled' | 'draft'
  likes: number
  comments: number
}

export interface GalleryImage {
  id: string
  url: string
  title: string
  category: string
  tags: string[]
  uploadDate: string
}

export interface SpecialOffer {
  id: string
  title: string
  description: string
  discount: string
  validFrom: string
  validUntil: string
  active: boolean
  terms: string[]
}

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  guests: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests?: string
  createdAt: string
}

// Mock Events Data
export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Coffee Tasting Workshop',
    description: 'Learn about different coffee beans and brewing techniques',
    date: '2024-02-15',
    time: '14:00',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    status: 'upcoming',
    capacity: 20,
    registered: 15,
    price: '₹500',
    category: 'Workshop'
  },
  {
    id: '2',
    title: 'Live Jazz Night',
    description: 'Enjoy smooth jazz with your favorite coffee',
    date: '2024-02-20',
    time: '19:00',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    status: 'upcoming',
    capacity: 50,
    registered: 32,
    price: '₹300',
    category: 'Live Music'
  },
  {
    id: '3',
    title: 'Latte Art Competition',
    description: 'Watch baristas compete in creating beautiful latte art',
    date: '2024-01-30',
    time: '16:00',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    status: 'completed',
    capacity: 30,
    registered: 30,
    price: 'Free',
    category: 'Competition'
  }
]

// Mock Menu Items Data
export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Espresso',
    description: 'Rich and bold espresso shot',
    price: 3.50,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    available: true,
    featured: true,
    ingredients: ['Premium Arabica Beans', 'Filtered Water'],
    prepTime: '2-3 mins',
    calories: 5,
    rating: 4.8
  },
  {
    id: '2',
    name: 'Cappuccino',
    description: 'Espresso with steamed milk and foam',
    price: 4.25,
    category: 'Coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    available: true,
    featured: false,
    ingredients: ['Espresso', 'Steamed Milk', 'Milk Foam'],
    prepTime: '3-4 mins',
    calories: 120,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Croissant',
    description: 'Buttery, flaky French pastry',
    price: 3.75,
    category: 'Pastries',
    image: 'https://images.unsplash.com/photo-1555507036-ab794f4ade0a?w=400',
    available: true,
    featured: false,
    ingredients: ['Butter', 'Flour', 'Yeast', 'Salt'],
    prepTime: '1-2 mins',
    calories: 280,
    rating: 4.4
  },
  {
    id: '4',
    name: 'Avocado Toast',
    description: 'Fresh avocado on artisan bread',
    price: 8.50,
    category: 'Food',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
    available: false,
    featured: true,
    ingredients: ['Avocado', 'Artisan Bread', 'Sea Salt', 'Lime'],
    prepTime: '5-7 mins',
    calories: 320,
    rating: 4.7
  }
]

// Mock Gallery Images Data
export const mockGalleryImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    title: 'Cozy Interior',
    category: 'Interior',
    tags: ['cozy', 'atmosphere', 'seating'],
    uploadDate: '2024-01-15'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    title: 'Latte Art',
    category: 'Coffee',
    tags: ['latte', 'art', 'barista'],
    uploadDate: '2024-01-20'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    title: 'Fresh Pastries',
    category: 'Food',
    tags: ['pastries', 'fresh', 'bakery'],
    uploadDate: '2024-01-25'
  }
]

// Mock Special Offers Data
export const mockSpecialOffers: SpecialOffer[] = [
  {
    id: '1',
    title: 'Happy Hour',
    description: '25% off all beverages from 2-4 PM',
    discount: '25%',
    validFrom: '2024-02-01',
    validUntil: '2024-02-29',
    active: true,
    terms: ['Valid Monday to Friday only', 'Cannot be combined with other offers']
  },
  {
    id: '2',
    title: 'Student Discount',
    description: '10% off with valid student ID',
    discount: '10%',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    active: true,
    terms: ['Valid student ID required', 'Available all day']
  },
  {
    id: '3',
    title: 'Weekend Special',
    description: 'Buy 2 get 1 free on pastries',
    discount: 'BOGO',
    validFrom: '2024-02-01',
    validUntil: '2024-02-15',
    active: false,
    terms: ['Weekends only', 'Lowest priced item free']
  }
]

// Mock Bookings Data
export const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Smith',
    customerEmail: 'john.smith@email.com',
    customerPhone: '+1-555-0123',
    date: '2024-02-15',
    time: '18:00',
    guests: 4,
    status: 'confirmed',
    specialRequests: 'Window table preferred',
    createdAt: '2024-02-10T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1-555-0456',
    date: '2024-02-16',
    time: '12:30',
    guests: 2,
    status: 'pending',
    createdAt: '2024-02-11T14:15:00Z'
  },
  {
    id: '3',
    customerName: 'Mike Davis',
    customerEmail: 'mike.davis@email.com',
    customerPhone: '+1-555-0789',
    date: '2024-02-14',
    time: '19:30',
    guests: 6,
    status: 'completed',
    specialRequests: 'Birthday celebration - need high chair',
    createdAt: '2024-02-08T16:45:00Z'
  }
]

// Mock Instagram Posts Data
export const mockInstagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
    caption: 'Perfect morning vibes 🌮 #TacoTangoMoments',
    hashtags: ['#tacos', '#morning', '#tacotango', '#mexican'],
    status: 'published',
    likes: 245,
    comments: 18
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    caption: 'Taco perfection 🎨 Who can guess the filling?',
    hashtags: ['#tacoart', '#mexican', '#authentic', '#tacotango'],
    status: 'published',
    likes: 189,
    comments: 23
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    caption: 'New seasonal blend coming soon! 🍂',
    hashtags: ['#newblend', '#seasonal', '#coffee', '#comingsoon'],
    scheduledDate: '2024-02-20T10:00:00Z',
    status: 'scheduled',
    likes: 0,
    comments: 0
  }
]
