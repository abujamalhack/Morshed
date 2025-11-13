import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, CreditCard, Wallet, Shield, Zap, Loader,
  AlertOctagon, CheckCircle
} from 'lucide-react';
import { ordersAPI, paymentAPI } from '../services/api';

const PurchaseModal = ({ product, user, isOpen, onClose, onSuccess, onError }) => {
  const [step, setStep] = useState(1); // 1: بيانات اللاعب, 2: الدفع
  const [loading, setLoading] = useState(false);
  const [playerData, setPlayerData] = useState({
    playerId: '',
    username: '',
    server: '',
    additionalInfo: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [customAmount, setCustomAmount] = useState('');

  if (!isOpen || !product) return null;

  const getPlayerFormFields = () => {
    const forms = {
      pubg: [
        { name: 'playerId', label: 'معرف اللاعب (Player ID)', required: true, placeholder: 'مثال: 5123456789' },
        { name: 'server', label: 'السيرفر', type: 'select', options: ['آسيا', 'أوروبا', 'أمريكا الشمالية', 'أمريكا الجنوبية'] }
      ],
      freefire: [
        { name: 'playerId', label: 'معرف الحساب (Account ID)', required: true, placeholder: 'مثال: 1234567890' }
      ],
      tiktok: [
        { name: 'username', label: 'اسم المستخدم (@username)', required: true, placeholder: 'مثال: @username' }
      ],
      netflix: [
        { name: 'playerId', label: 'البريد الإلكتروني', required: true, placeholder: 'example@email.com' }
      ],
      appstore: [
        { name: 'playerId', label: 'البريد الإلكتروني', required: true, placeholder: 'example@email.com' }
      ],
      default: [
        { name: 'playerId', label: 'المعرف أو البريد الإلكتروني', required: true, placeholder: 'أدخل المعرف المطلوب' }
      ]
    };

    return forms[product.gameId] || forms.default;
  };

  const handlePlayerInfoSubmit = () => {
    const fields = getPlayerFormFields();
    const requiredFields = fields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!playerData[field.name]?.trim()) {
        onError(`الرجاء إدخال ${field.label}`);
        return;
      }
    }
    
    setStep(2);
  };

  const calculateTotalPrice = () => {
    if (customAmount && !isNaN(customAmount)) {
      const unitPrice = product.price / (parseInt(product.coins) || 1);
      return (unitPrice * parseInt(customAmount)).toFixed(2);
    }
    return product.price;
  };

  const handlePurchase = async () => {
    if (paymentMethod === 'wallet' && user.wallet < calculateTotalPrice()) {
      onError('رصيد غير كافٍ في المحفظة! يرجى شحن المحفظة أولاً');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        productId: product.id,
        playerData: playerData,
        amount: customAmount || product.coins.split(' ')[0],
        totalPrice: calculateTotalPrice(),
        paymentMethod: paymentMethod
      };

      const result = await ordersAPI.createOrder(orderData);
      onSuccess(result);
      onClose();
    } catch (error) {
      onError(error.response?.data?.message || 'فشل في معالجة الطلب');
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = calculateTotalPrice();
  const hasEnoughBalance = user.wallet >= totalPrice;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl shadow-purple-900/50"
      >
        {/* الهيدر */}
        <div className="p-6 border-b border-purple-500/30 flex justify-between items-center bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className={`p-2 rounded-xl ${product.gradient}`}>
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              شراء {product.name}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="p-6">
          {step === 1 ? (
            // خطوة 1: بيانات اللاعب
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-purple-300 mb-2">أدخل بيانات {product.name}</h3>
                <p className="text-purple-400 text-sm">تأكد من صحة البيانات للحصول على طلب ناجح</p>
              </div>

              {getPlayerFormFields().map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-purple-300 mb-1">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={playerData[field.name]}
                      onChange={(e) => setPlayerData(prev => ({
                        ...prev,
                        [field.name]: e.target.value
                      }))}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">اختر {field.label}</option>
                      {field.options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={playerData[field.name]}
                      onChange={(e) => setPlayerData(prev => ({
                        ...prev,
                        [field.name]: e.target.value
                      }))}
                      className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}

              {/* كمية مخصصة */}
              {product.minAmount && (
                <div>
                  <label className="block text-sm font-medium text-purple-300 mb-1">
                    الكمية (اختياري)
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    min={product.minAmount}
                    max={product.maxAmount}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`الحد الأدنى: ${product.minAmount}`}
                  />
                  <p className="text-purple-400 text-xs mt-1">
                    اتركه فارغاً للكمية الافتراضية: {product.coins}
                  </p>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlayerInfoSubmit}
                className="w-full btn-primary py-4 text-lg"
              >
                المتابعة للدفع
              </motion.button>
            </div>
          ) : (
            // خطوة 2: الدفع
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-black/50 to-black/70 p-4 rounded-2xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-12 h-12 rounded-xl ${product.gradient} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{product.name}</h3>
                      <p className="text-purple-300 text-sm">
                        {customAmount ? `${customAmount} ${product.coins.split(' ')[1]}` : product.coins}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">
                      {totalPrice} جنيه
                    </div>
                  </div>
                </div>
              </div>

              {/* طرق الدفع */}
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">طريقة الدفع</label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'wallet' 
                        ? 'border-purple-500 bg-gradient-to-br from-purple-900/50 to-black/70' 
                        : 'border-purple-500/30 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <Wallet className={`h-6 w-6 mb-2 ${paymentMethod === 'wallet' ? 'text-purple-400' : 'text-purple-300'}`} />
                      <span className={`font-medium ${
                        paymentMethod === 'wallet' ? 'text-white' : 'text-purple-300'
                      }`}>
                        المحفظة
                      </span>
                      <span className="text-xs text-purple-400 mt-1">{user.wallet.toLocaleString('ar-EG')} جنيه</span>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod('online')}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-amber-500 bg-gradient-to-br from-amber-900/50 to-black/70' 
                        : 'border-purple-500/30 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <CreditCard className={`h-6 w-6 mb-2 ${paymentMethod === 'online' ? 'text-amber-400' : 'text-purple-300'}`} />
                      <span className={`font-medium ${
                        paymentMethod === 'online' ? 'text-white' : 'text-purple-300'
                      }`}>
                        دفع أونلاين
                      </span>
                      <span className="text-xs text-purple-400 mt-1">فيزا/ماستركارد</span>
                    </div>
                  </motion.button>
                </div>
              </div>

              {/* تحذير الرصيد */}
              {paymentMethod === 'wallet' && !hasEnoughBalance && (
                <div className="bg-red-900/30 border border-red-500/50 rounded-2xl p-4 flex items-center space-x-3 space-x-reverse">
                  <AlertOctagon className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-300 font-medium">رصيد غير كافٍ</p>
                    <p className="text-red-400 text-sm">رصيدك: {user.wallet.toLocaleString('ar-EG')} جنيه | المطلوب: {totalPrice} جنيه</p>
                  </div>
                </div>
              )}

              {/* ضمان التوصيل */}
              <div className="bg-gradient-to-br from-indigo-950 to-purple-950 p-4 rounded-2xl border border-purple-500/30">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <Shield className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-purple-300">ضمان التوصيل</h4>
                    <p className="text-sm text-purple-300 mt-1">
                      نضمن توصيل الكوينز خلال 60 ثانية، وفي حال حدوث أي تأخير سيتم استرداد المبلغ فوراً
                    </p>
                  </div>
                </div>
              </div>

              {/* أزرار */}
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-4 rounded-2xl font-bold text-white transition-all"
                >
                  رجوع
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePurchase}
                  disabled={loading || (paymentMethod === 'wallet' && !hasEnoughBalance)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>جاري المعالجة...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <Zap className="h-5 w-5" />
                      <span>تأكيد الشراء</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseModal;
