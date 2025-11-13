import { motion } from 'framer-motion';
import { Star, Zap, Crown } from 'lucide-react';

const ProductCard = ({ product, onPurchase, user }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'لعبة': return '🎮';
      case 'تطبيق': return '📱';
      case 'اشتراك': return '🔄';
      case 'رصيد': return '💳';
      case 'عرض خاص': return '🎁';
      default: return '📦';
    }
  };

  const handlePurchase = () => {
    onPurchase(product);
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${product.gradient} rounded-3xl overflow-hidden shadow-2xl border border-white/10 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20`}
    >
      {/* الهيدر */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-black/30 p-2 rounded-xl backdrop-blur-sm">
              <span className="text-xl">{getIcon(product.type)}</span>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{product.name}</h3>
              <span className="text-white/80 text-sm bg-black/30 px-2 py-1 rounded-full">
                {product.type}
              </span>
            </div>
          </div>
          
          {product.featured && (
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Crown className="h-3 w-3 ml-1" />
              مميز
            </div>
          )}
        </div>

        {/* الكوينز والسعر */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-bold text-2xl">
            {product.coins}
          </div>
          <div className="text-right">
            <div className="text-white/80 text-sm">السعر</div>
            <div className="text-yellow-400 font-bold text-xl">
              {product.price} جنيه
            </div>
          </div>
        </div>

        {/* الشعبية */}
        {product.popularity && (
          <div className="flex items-center space-x-2 space-x-reverse text-white/70 text-sm mb-4">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span>شعبية {product.popularity}%</span>
          </div>
        )}
      </div>

      {/* الزر */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePurchase}
        disabled={!user}
        className="w-full bg-black/40 backdrop-blur-sm py-4 px-6 border-t border-white/10 flex items-center justify-center space-x-2 space-x-reverse text-white font-bold text-lg hover:bg-black/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Zap className="h-5 w-5" />
        <span>{user ? 'شراء الآن' : 'سجل الدخول للشراء'}</span>
      </motion.button>
    </motion.div>
  );
};

export default ProductCard;
