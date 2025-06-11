import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero, MenuCategories, MenuSection } from './components';

interface MenuItemType {
  title: string;
  description: string;
  image: string;
  price: string;
  ingredients: string[];
  prepTime: string;
  calories: number;
  rating: number;
}

export const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Breakfast');

  const menuData: { [key: string]: MenuItemType[] } = {
    Breakfast: [
      {
        title: "Sunrise Sandwich",
        description: "Egg, cheese, and your choice of bacon or sausage on a toasted English muffin.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹420",
        ingredients: ["Farm Fresh Eggs", "Artisan Cheese", "Choice of Bacon", "English Muffin"],
        prepTime: "8-10 mins",
        calories: 380,
        rating: 4.7
      },
      {
        title: "Fluffy Stack",
        description: "A stack of three pancakes served with butter and maple syrup.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹350",
        ingredients: ["Organic Flour", "Fresh Butter", "Pure Maple Syrup", "Farm Eggs"],
        prepTime: "12-15 mins",
        calories: 520,
        rating: 4.8
      },
      {
        title: "Garden Omelette",
        description: "A three-egg omelette filled with fresh vegetables and cheese.",
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹480",
        ingredients: ["Farm Fresh Eggs", "Seasonal Vegetables", "Artisan Cheese", "Fresh Herbs"],
        prepTime: "10-12 mins",
        calories: 320,
        rating: 4.6
      },
      {
        title: "Avocado Toast",
        description: "Fresh avocado spread on artisan bread with cherry tomatoes and feta cheese.",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹380",
        ingredients: ["Fresh Avocado", "Artisan Bread", "Cherry Tomatoes", "Feta Cheese"],
        prepTime: "5-7 mins",
        calories: 290,
        rating: 4.5
      },
      {
        title: "French Toast",
        description: "Golden brioche slices with cinnamon, vanilla, and fresh berries.",
        image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹450",
        ingredients: ["Brioche Bread", "Farm Eggs", "Cinnamon", "Fresh Berries"],
        prepTime: "10-12 mins",
        calories: 480,
        rating: 4.9
      },
      {
        title: "Breakfast Burrito",
        description: "Scrambled eggs, cheese, potatoes, and salsa wrapped in a warm tortilla.",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹520",
        ingredients: ["Scrambled Eggs", "Cheese", "Roasted Potatoes", "Fresh Salsa"],
        prepTime: "12-15 mins",
        calories: 580,
        rating: 4.6
      },
      {
        title: "Granola Bowl",
        description: "House-made granola with Greek yogurt, honey, and seasonal fruits.",
        image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹320",
        ingredients: ["House Granola", "Greek Yogurt", "Natural Honey", "Seasonal Fruits"],
        prepTime: "3-5 mins",
        calories: 350,
        rating: 4.4
      },
      {
        title: "Eggs Benedict",
        description: "Poached eggs on English muffins with Canadian bacon and hollandaise sauce.",
        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹680",
        ingredients: ["Poached Eggs", "English Muffins", "Canadian Bacon", "Hollandaise"],
        prepTime: "15-18 mins",
        calories: 620,
        rating: 4.8
      },
      {
        title: "Breakfast Smoothie",
        description: "Blend of banana, berries, spinach, and protein powder with almond milk.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹280",
        ingredients: ["Fresh Banana", "Mixed Berries", "Spinach", "Protein Powder"],
        prepTime: "3-5 mins",
        calories: 220,
        rating: 4.3
      }
    ],
    Lunch: [
      {
        title: "Classic Burger",
        description: "A juicy beef patty with lettuce, tomato, and onion on a sesame seed bun.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹680",
        ingredients: ["Premium Beef Patty", "Fresh Lettuce", "Ripe Tomatoes", "Sesame Bun"],
        prepTime: "15-18 mins",
        calories: 650,
        rating: 4.7
      },
      {
        title: "Caesar Salad",
        description: "Crisp romaine lettuce, croutons, and parmesan cheese tossed in Caesar dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹450",
        ingredients: ["Romaine Lettuce", "Homemade Croutons", "Parmesan Cheese", "Caesar Dressing"],
        prepTime: "8-10 mins",
        calories: 280,
        rating: 4.5
      },
      {
        title: "Soup of the Day",
        description: "Ask your server for today's selection.",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹320",
        ingredients: ["Seasonal Vegetables", "Fresh Herbs", "Homemade Broth", "Spices"],
        prepTime: "5-7 mins",
        calories: 180,
        rating: 4.4
      },
      {
        title: "Chicken Wrap",
        description: "Grilled chicken with fresh vegetables and ranch dressing in a flour tortilla.",
        image: "https://images.unsplash.com/photo-1565299585323-38174c4a6471?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹520",
        ingredients: ["Grilled Chicken", "Fresh Vegetables", "Ranch Dressing", "Flour Tortilla"],
        prepTime: "10-12 mins",
        calories: 420,
        rating: 4.6
      },
      {
        title: "Fish Tacos",
        description: "Grilled fish with cabbage slaw and chipotle mayo in soft corn tortillas.",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹580",
        ingredients: ["Grilled Fish", "Cabbage Slaw", "Chipotle Mayo", "Corn Tortillas"],
        prepTime: "12-15 mins",
        calories: 380,
        rating: 4.5
      },
      {
        title: "Quinoa Bowl",
        description: "Quinoa with roasted vegetables, chickpeas, and tahini dressing.",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹480",
        ingredients: ["Organic Quinoa", "Roasted Vegetables", "Chickpeas", "Tahini Dressing"],
        prepTime: "8-10 mins",
        calories: 350,
        rating: 4.4
      },
      {
        title: "Club Sandwich",
        description: "Triple-decker sandwich with turkey, bacon, lettuce, and tomato.",
        image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹620",
        ingredients: ["Sliced Turkey", "Crispy Bacon", "Fresh Lettuce", "Ripe Tomatoes"],
        prepTime: "10-12 mins",
        calories: 580,
        rating: 4.7
      },
      {
        title: "Pasta Salad",
        description: "Penne pasta with cherry tomatoes, mozzarella, and basil pesto.",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹420",
        ingredients: ["Penne Pasta", "Cherry Tomatoes", "Fresh Mozzarella", "Basil Pesto"],
        prepTime: "6-8 mins",
        calories: 320,
        rating: 4.3
      },
      {
        title: "BBQ Pulled Pork",
        description: "Slow-cooked pulled pork with BBQ sauce on a brioche bun with coleslaw.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹720",
        ingredients: ["Pulled Pork", "BBQ Sauce", "Brioche Bun", "Coleslaw"],
        prepTime: "8-10 mins",
        calories: 680,
        rating: 4.8
      }
    ],
    Dinner: [
      {
        title: "Grilled Steak",
        description: "A perfectly grilled steak served with mashed potatoes and seasonal vegetables.",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹1200",
        ingredients: ["Premium Steak", "Mashed Potatoes", "Seasonal Vegetables", "House Sauce"],
        prepTime: "20-25 mins",
        calories: 720,
        rating: 4.9
      },
      {
        title: "Pasta Primavera",
        description: "Pasta tossed with fresh vegetables in a light cream sauce.",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹580",
        ingredients: ["Fresh Pasta", "Seasonal Vegetables", "Light Cream Sauce", "Herbs"],
        prepTime: "15-18 mins",
        calories: 480,
        rating: 4.6
      },
      {
        title: "Catch of the Day",
        description: "Fresh fish prepared to perfection, ask your server for details.",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹850",
        ingredients: ["Fresh Fish", "Seasonal Vegetables", "Lemon Butter", "Fresh Herbs"],
        prepTime: "18-22 mins",
        calories: 420,
        rating: 4.8
      },
      {
        title: "Lamb Chops",
        description: "Herb-crusted lamb chops with rosemary potatoes and mint sauce.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹1350",
        ingredients: ["Lamb Chops", "Fresh Herbs", "Rosemary Potatoes", "Mint Sauce"],
        prepTime: "25-30 mins",
        calories: 680,
        rating: 4.7
      },
      {
        title: "Chicken Parmesan",
        description: "Breaded chicken breast with marinara sauce and melted mozzarella.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹780",
        ingredients: ["Chicken Breast", "Marinara Sauce", "Mozzarella", "Italian Herbs"],
        prepTime: "20-25 mins",
        calories: 620,
        rating: 4.6
      },
      {
        title: "Seafood Risotto",
        description: "Creamy arborio rice with mixed seafood and saffron.",
        image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹920",
        ingredients: ["Arborio Rice", "Mixed Seafood", "Saffron", "Parmesan"],
        prepTime: "25-30 mins",
        calories: 580,
        rating: 4.8
      },
      {
        title: "Beef Tenderloin",
        description: "Pan-seared beef tenderloin with red wine reduction and garlic mash.",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹1450",
        ingredients: ["Beef Tenderloin", "Red Wine", "Garlic Mash", "Seasonal Greens"],
        prepTime: "22-28 mins",
        calories: 750,
        rating: 4.9
      },
      {
        title: "Vegetarian Lasagna",
        description: "Layers of pasta with ricotta, spinach, and roasted vegetables.",
        image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹650",
        ingredients: ["Pasta Sheets", "Ricotta Cheese", "Fresh Spinach", "Roasted Vegetables"],
        prepTime: "18-22 mins",
        calories: 520,
        rating: 4.5
      },
      {
        title: "Duck Confit",
        description: "Slow-cooked duck leg with orange glaze and wild rice pilaf.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹1180",
        ingredients: ["Duck Leg", "Orange Glaze", "Wild Rice", "Seasonal Vegetables"],
        prepTime: "30-35 mins",
        calories: 640,
        rating: 4.7
      }
    ],
    Drinks: [
      {
        title: "House Blend Coffee",
        description: "Our signature blend, roasted in-house daily.",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹180",
        ingredients: ["Premium Coffee Beans", "Steamed Milk", "Natural Sweetener", "Foam Art"],
        prepTime: "3-5 mins",
        calories: 120,
        rating: 4.8
      },
      {
        title: "Assorted Teas",
        description: "A selection of black, green, and herbal teas.",
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹150",
        ingredients: ["Premium Tea Leaves", "Fresh Herbs", "Natural Honey", "Lemon"],
        prepTime: "4-6 mins",
        calories: 25,
        rating: 4.5
      },
      {
        title: "Freshly Squeezed Juice",
        description: "Orange, apple, or grapefruit juice made fresh daily.",
        image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹220",
        ingredients: ["Fresh Fruits", "Natural Pulp", "No Added Sugar", "Ice"],
        prepTime: "2-3 mins",
        calories: 110,
        rating: 4.7
      },
      {
        title: "Cappuccino",
        description: "Rich espresso with steamed milk and a thick layer of foam.",
        image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹200",
        ingredients: ["Espresso", "Steamed Milk", "Milk Foam", "Cocoa Powder"],
        prepTime: "4-6 mins",
        calories: 140,
        rating: 4.6
      },
      {
        title: "Green Smoothie",
        description: "Spinach, apple, banana, and ginger blended with coconut water.",
        image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹280",
        ingredients: ["Fresh Spinach", "Apple", "Banana", "Coconut Water"],
        prepTime: "3-5 mins",
        calories: 180,
        rating: 4.4
      },
      {
        title: "Iced Latte",
        description: "Cold espresso with chilled milk served over ice.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹220",
        ingredients: ["Cold Espresso", "Chilled Milk", "Ice Cubes", "Vanilla Syrup"],
        prepTime: "3-5 mins",
        calories: 160,
        rating: 4.5
      },
      {
        title: "Hot Chocolate",
        description: "Rich Belgian chocolate with steamed milk and whipped cream.",
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹250",
        ingredients: ["Belgian Chocolate", "Steamed Milk", "Whipped Cream", "Marshmallows"],
        prepTime: "5-7 mins",
        calories: 320,
        rating: 4.7
      },
      {
        title: "Matcha Latte",
        description: "Premium matcha powder with steamed milk and honey.",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹280",
        ingredients: ["Premium Matcha", "Steamed Milk", "Natural Honey", "Foam Art"],
        prepTime: "4-6 mins",
        calories: 190,
        rating: 4.3
      },
      {
        title: "Sparkling Water",
        description: "Refreshing sparkling water with fresh lime and mint.",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        price: "₹120",
        ingredients: ["Sparkling Water", "Fresh Lime", "Mint Leaves", "Ice"],
        prepTime: "2-3 mins",
        calories: 5,
        rating: 4.2
      }
    ]
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFAF7' }}>
      <Hero />

      <section className="relative px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40">
        <div className="mt-6 mb-8">
          <MenuCategories
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MenuSection
              title={activeCategory}
              items={menuData[activeCategory]}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};
