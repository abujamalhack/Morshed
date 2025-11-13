import { motion } from 'framer-motion';
import { 
  Package, Gamepad2, User, Film, Wallet, Gem 
} from 'lucide-react';

const categories = [
  { id: 'all', name: 'الكل', icon: Package, count: 15 },
  { id: 'battle-royale', name: 'معركة ملكية', icon: Gamepad2, count: 5 },
  { id: 'social', name: 'تطبيقات اجتماعية', icon: User, count: 3 },
  { id: 'entertainment', name: 'ترفيه', icon: Film, count: 3 },
  { id: 'store', name: 'رصيد متاجر', icon: Wallet, count: 3 },
  { id: 'bundle', name: 'باقات خاصة', icon: Gem, count: 2 }
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const getIconComponent = (iconName) => {
    const icons = {
      Package, Gamepad2, User, Film, Wallet, Gem
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : <Package className="h-5 w-5" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      {categories.map((category) => (
        <motion.button
          key={category.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center space-x-2 space-x-reverse px-4 py-3 rounded-2xl font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-black/40 text-purple-300 hover:bg-purple-900/30 hover:text-white border border-purple-500/20'
          }`}
        >
          {getIconComponent(category.icon)}
          <span>{category.name}</span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            selectedCategory === category.id 
              ? 'bg-white/20 text-white' 
              : 'bg-purple-500/20 text-purple-300'
          }`}>
            {category.count}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default CategoryFilter;
