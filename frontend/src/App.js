import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Smartphone, Shield, Wallet, Zap, Clock, 
  ChevronDown, Menu, X, Star, CheckCircle, AlertCircle, 
  User, BarChart2, Package, History, Settings, LogOut, 
  Crown, Diamond, Gem, Gamepad2, Music, Film, 
  ArrowLeft, Eye, EyeOff, Copy, Check, AlertTriangle,
  Lock, Mail, Phone, Key, Loader, CheckSquare, AlertOctagon,
  ArrowRight, ShoppingCart, ChevronUp, ChevronLeft,
  Home, CreditCard as Card, Truck, MessageCircle,
  RefreshCw, Users, TrendingUp, Gift
} from 'lucide-react';

// خدمات API
import { authAPI, ordersAPI, productsAPI, paymentAPI } from './services/api';

// المكونات
import AuthModal from './components/AuthModal';
import PurchaseModal from './components/PurchaseModal';
import DeliveryStatusModal from './components/DeliveryStatusModal';
import UserDashboard from './components/UserDashboard';
import ProductCard from './components/ProductCard';
import CategoryFilter from './components/CategoryFilter';

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);

  // تحميل البيانات الأولية
  useEffect(() => {
    loadInitialData();
    checkAuthStatus();
  }, []);

  const loadInitialData = async () => {
    try {
      const productsData = await productsAPI.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const userData = await authAPI.getProfile();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('auth_token');
      }
    }
  };

  const handleProductClick = (product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedProduct(product);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setSuccessMessage('تم تسجيل الخروج بنجاح');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', damping: 15, stiffness: 150 }
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white font-cairo overflow-x-hidden">
      {/* التنقل */}
      <nav className="sticky top-0 z-40 bg-black/70 backdrop-blur-2xl border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2 rounded-2xl mr-3">
                  <Crown className="h-8 w-8 text-black" />
                </div>
                <span className="text-2xl font-extrabold gradient-text">
                  كوينز أكاديمي
                </span>
              </div>
              
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-4 space-x-reverse">
                  {[
                    { id: 'home', name: 'الرئيسية', icon: Home },
                    { id: 'products', name: 'المنتجات', icon: Package },
                    { id: 'dashboard', name: 'لوحة التحكم', icon: BarChart2 },
                    { id: 'orders', name: 'الطلبات', icon: History },
                    { id: 'support', name: 'الدعم', icon: MessageCircle }
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        activeSection === item.id 
                          ? 'btn-primary' 
                          : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="flex items-center space-x-6 space-x-reverse">
                {user ? (
                  <>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-right">
                        <p className="text-sm font-bold text-white">{user.name}</p>
                        <p className="text-xs text-purple-300">المستوى: {user.level}</p>
                      </div>
                      <div className="relative">
                        <Wallet className="h-6 w-6 text-yellow-400" />
                        <span className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-yellow-900">
                          {user.wallet?.toLocaleString('ar-EG')}
                        </span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center space-x-2 space-x-reverse bg-red-900/30 hover:bg-red-900/50 px-4 py-2 rounded-xl font-bold text-sm border border-red-500/30"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>تسجيل الخروج</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="btn-primary"
                  >
                    <User className="h-4 w-4 ml-2" />
                    <span>تسجيل الدخول</span>
                  </motion.button>
                )}
              </div>
            </div>

            {/* زر القائمة للموبايل */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-purple-300 hover:text-white"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* القائمة المتنقلة */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-black/90 backdrop-blur-xl border-b border-purple-500/30"
            >
              <div className="px-4 py-4 space-y-3">
                {['الرئيسية', 'المنتجات', 'لوحة التحكم', 'الطلبات', 'الدعم'].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setActiveSection(item.toLowerCase().replace(' ', '-'));
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-right px-4 py-3 rounded-xl text-base font-bold transition-all ${
                      activeSection === item.toLowerCase().replace(' ', '-') 
                        ? 'btn-primary' 
                        : 'text-purple-200 hover:bg-purple-900/50 hover:text-white'
                    }`}
                  >
                    {item}
                  </button>
                ))}
                
                {user ? (
                  <div className="pt-4 border-t border-purple-500/30 space-y-3">
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-purple-300">رصيدك:</span>
                      <span className="font-bold text-yellow-400">{user.wallet?.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-900/30 hover:bg-red-900/50 px-4 py-3 rounded-xl font-bold text-base border border-red-500/30 text-red-300"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full btn-primary py-3"
                  >
                    تسجيل الدخول
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* الرسائل */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-2xl flex items-center space-x-3 space-x-reverse text-red-300"
            >
              <AlertOctagon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-2xl flex items-center space-x-3 space-x-reverse text-green-300"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
              <button onClick={() => setSuccessMessage(null)} className="text-green-400 hover:text-green-300">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* عرض المحتوى حسب القسم النشط */}
        {activeSection === 'home' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            {/* الهيرو */}
            <motion.section variants={itemVariants} className="text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold gradient-text leading-tight">
                شحن عملات الألعاب
                <br />
                <span className="text-white">بسرعة البرق! ⚡</span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
                استمتع بتوصيل فوري آلي لألعابك المفضلة. 
                <span className="text-yellow-400 font-bold"> دفع آمن </span>
                و 
                <span className="text-green-400 font-bold"> ضمان استرجاع </span>
                خلال 60 ثانية!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection('products')}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Zap className="h-5 w-5 ml-2" />
                  ابدأ الشراء الآن
                </motion.button>
                
                {!user && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAuthModal(true)}
                    className="btn-secondary text-lg px-8 py-4"
                  >
                    <Gift className="h-5 w-5 ml-2" />
                    احصل على 100 جنيه هدية
                  </motion.button>
                )}
              </div>
            </motion.section>

            {/* الإحصائيات */}
            <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '50,000+', label: 'عميل سعيد', icon: Users, color: 'from-green-500 to-emerald-600' },
                { number: '150,000+', label: 'طلب ناجح', icon: TrendingUp, color: 'from-blue-500 to-cyan-600' },
                { number: '98%', label: 'معدل النجاح', icon: CheckCircle, color: 'from-purple-500 to-pink-600' },
                { number: '60s', label: 'متوسط التوصيل', icon: Zap, color: 'from-yellow-500 to-amber-600' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  className={`bg-gradient-to-br ${stat.color} p-6 rounded-3xl text-center shadow-2xl`}
                >
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-white" />
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/90 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.section>

            {/* المنتجات المميزة */}
            <motion.section variants={itemVariants} className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold gradient-text">المنتجات المميزة</h2>
                <button 
                  onClick={() => setActiveSection('products')}
                  className="flex items-center space-x-2 space-x-reverse text-purple-300 hover:text-white font-medium"
                >
                  <span>عرض الكل</span>
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.filter(p => p.featured).slice(0, 6).map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onPurchase={handleProductClick}
                    user={user}
                  />
                ))}
              </div>
            </motion.section>
          </motion.div>
        )}

        {/* قسم المنتجات */}
        {activeSection === 'products' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">منتجاتنا</h1>
              <p className="text-xl text-purple-200">اختر من بين أفضل عملات الألعاب والاشتراكات</p>
            </motion.div>

            <CategoryFilter onCategoryChange={() => {}} />
            
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onPurchase={handleProductClick}
                  user={user}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* لوحة التحكم */}
        {activeSection === 'dashboard' && user && (
          <UserDashboard user={user} orders={userOrders} />
        )}

        {/* الطلبات */}
        {activeSection === 'orders' && user && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div variants={itemVariants} className="flex items-center justify-between">
              <h1 className="text-3xl font-bold gradient-text">طلباتي</h1>
              <span className="text-purple-300">إجمالي الطلبات: {userOrders.length}</span>
            </motion.div>

            <div className="glass-effect rounded-3xl p-6">
              {userOrders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-purple-500/20">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className={`p-3 rounded-xl ${
                          order.status === 'مكتمل' ? 'bg-green-500/20' : 
                          order.status === 'قيد المعالجة' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                        }`}>
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{order.game}</h3>
                          <p className="text-purple-300 text-sm">{order.amount} • {order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-bold ${
                          order.status === 'مكتمل' ? 'text-green-400' : 
                          order.status === 'قيد المعالجة' ? 'text-yellow-400' : 'text-blue-400'
                        }`}>
                          {order.status}
                        </span>
                        <p className="text-purple-300 text-sm">{order.price} جنيه</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-bold text-purple-300 mb-2">لا توجد طلبات حالياً</h3>
                  <p className="text-purple-400 mb-6">ابدأ شراء أول منتج لك!</p>
                  <button 
                    onClick={() => setActiveSection('products')}
                    className="btn-primary"
                  >
                    تصفح المنتجات
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* الدعم */}
        {activeSection === 'support' && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">الدعم الفني</h1>
              <p className="text-xl text-purple-200">نحن هنا لمساعدتك على مدار الساعة</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div variants={itemVariants} className="glass-effect rounded-3xl p-8 space-y-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <MessageCircle className="h-8 w-8 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">الدعم المباشر</h2>
                </div>
                <p className="text-purple-200 leading-relaxed">
                  فريق الدعم لدينا متاح 24/7 لمساعدتك في أي استفسار أو مشكلة تواجهك.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 space-x-reverse text-purple-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>رد فوري خلال دقائق</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse text-purple-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>حلول فنية متخصصة</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse text-purple-300">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>دعم باللغة العربية</span>
                  </div>
                </div>
                <button className="btn-primary w-full">
                  <MessageCircle className="h-4 w-4 ml-2" />
                  بدء محادثة مباشرة
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-effect rounded-3xl p-8 space-y-6">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <HelpCircle className="h-8 w-8 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">الأسئلة الشائعة</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { q: "كم تستغرق عملية التوصيل؟", a: "عادةً من 30-60 ثانية" },
                    { q: "هل الدفع آمن؟", a: "نعم، جميع عمليات الدفع مشفرة" },
                    { q: "ماذا لو فشل التوصيل؟", a: "استرداد فوري خلال 5 دقائق" }
                  ].map((faq, index) => (
                    <div key={index} className="border-b border-purple-500/20 pb-4">
                      <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                      <p className="text-purple-300 text-sm">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="bg-black/50 backdrop-blur-xl border-t border-purple-500/30 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2 rounded-xl mr-3">
                  <Crown className="h-6 w-6 text-black" />
                </div>
                <span className="text-xl font-extrabold gradient-text">كوينز أكاديمي</span>
              </div>
              <p className="text-purple-300 text-sm leading-relaxed">
                أسرع موقع لشحن العملات الرقمية للألعاب والاشتراكات. توصيل فوري آلي وخدمة عملاء على مدار الساعة.
              </p>
            </div>

            {[
              {
                title: "الخدمات",
                links: ["شحن الألعاب", "الاشتراكات", "رصيد المتاجر", "الباقات الخاصة"]
              },
              {
                title: "الدعم",
                links: ["الأسئلة الشائعة", "الشروط والأحكام", "سياسة الخصوصية", "اتصل بنا"]
              },
              {
                title: "الحساب",
                links: ["تسجيل الدخول", "إنشاء حساب", "طلباتي", "المحفظة"]
              }
            ].map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-bold text-white text-lg">{section.title}</h3>
                <div className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <a key={linkIndex} href="#" className="block text-purple-300 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-purple-400 text-sm">
              © 2024 كوينز أكاديمي. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center space-x-6 space-x-reverse">
              {['الشروط', 'الخصوصية', 'الاتصال'].map((item) => (
                <a key={item} href="#" className="text-purple-400 hover:text-white text-sm transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* المودالات */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(userData) => {
          setUser(userData);
          setShowAuthModal(false);
          setSuccessMessage('مرحباً بك في كوينز أكاديمي!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }}
        onError={setError}
      />

      <PurchaseModal 
        product={selectedProduct}
        user={user}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSuccess={(orderData) => {
          setDeliveryStatus(orderData);
          setSuccessMessage(`تم تقديم طلبك بنجاح! #${orderData.orderId}`);
          setTimeout(() => setSuccessMessage(null), 5000);
        }}
        onError={setError}
      />

      <DeliveryStatusModal 
        status={deliveryStatus}
        isOpen={!!deliveryStatus}
        onClose={() => setDeliveryStatus(null)}
        onError={setError}
      />
    </div>
  );
}

// أيقونة مساعدة للأسئلة الشائعة
function HelpCircle(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
