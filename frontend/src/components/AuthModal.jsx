import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, User, Phone, Key, Loader, 
  X, Crown, CheckSquare, AlertOctagon 
} from 'lucide-react';
import { authAPI } from '../services/api';

const AuthModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    agreeToTerms: false
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      onError('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.login(formData.email, formData.password);
      onSuccess(result.user);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        agreeToTerms: false
      });
    } catch (error) {
      onError(error.response?.data?.message || 'فشل في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      onError('الرجاء إدخال جميع الحقول المطلوبة');
      return;
    }

    if (formData.password.length < 6) {
      onError('يجب أن تكون كلمة المرور على الأقل 6 أحرف');
      return;
    }

    if (!formData.agreeToTerms) {
      onError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    setLoading(true);
    try {
      const result = await authAPI.register(formData);
      onSuccess(result.user);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        agreeToTerms: false
      });
    } catch (error) {
      onError(error.response?.data?.message || 'فشل في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
        className="w-full max-w-md bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/40 overflow-hidden shadow-2xl shadow-purple-900/50"
      >
        <div className="p-6 border-b border-purple-500/30 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2 rounded-xl">
              <Crown className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              {authMode === 'login' ? 'مرحباً بعودتك' : 'أنشئ حسابك'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {authMode === 'login' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">كلمة المرور</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>جاري تسجيل الدخول...</span>
                  </div>
                ) : (
                  'تسجيل الدخول'
                )}
              </motion.button>
              
              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode('register')}
                  className="text-purple-300 hover:text-white font-medium transition-colors"
                >
                  ليس لديك حساب؟ <span className="text-purple-400 font-bold">أنشئ حساب الآن</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">الاسم الكامل</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="اسمك الكامل"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">رقم الهاتف</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="01000000000"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-1">كلمة المرور</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-5 w-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-4 py-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm text-purple-300">
                  أوافق على <a href="#" className="text-purple-400 hover:text-purple-300">الشروط والأحكام</a> و <a href="#" className="text-purple-400 hover:text-purple-300">سياسة الخصوصية</a>
                </label>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>جاري إنشاء الحساب...</span>
                  </div>
                ) : (
                  'إنشاء الحساب'
                )}
              </motion.button>
              
              <div className="text-center pt-2">
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-purple-300 hover:text-white font-medium transition-colors"
                >
                  لديك حساب بالفعل؟ <span className="text-purple-400 font-bold">تسجيل الدخول</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
