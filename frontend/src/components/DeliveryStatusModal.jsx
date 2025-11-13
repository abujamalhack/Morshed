import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Zap, CheckCircle, AlertTriangle, Clock,
  RefreshCw, Loader, Package, Copy, Check
} from 'lucide-react';
import { ordersAPI } from '../services/api';

const DeliveryStatusModal = ({ status, isOpen, onClose, onError }) => {
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  if (!isOpen || !status) return null;

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleRefreshStatus = async () => {
    if (!status.deliveryId) return;
    
    setLoading(true);
    try {
      const result = await ordersAPI.getDeliveryStatus(status.deliveryId);
      // Update status logic here
    } catch (error) {
      onError(error.response?.data?.message || 'فشل في تحديث الحالة');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'مكتمل': return 'text-green-400';
      case 'قيد المعالجة': return 'text-yellow-400';
      case 'فشل': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'مكتمل': return CheckCircle;
      case 'قيد المعالجة': return Clock;
      case 'فشل': return AlertTriangle;
      default: return Package;
    }
  };

  const StatusIcon = getStatusIcon(status.status);

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
        <div className="p-6 border-b border-purple-500/30 flex justify-between items-center bg-gradient-to-r from-purple-900 to-indigo-900">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2 rounded-xl">
              <Zap className="h-6 w-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              حالة التوصيل
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-purple-300 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {status.success ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-green-500/50">
                  <StatusIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-400">
                  {status.status === 'مكتمل' ? 'تم التوصيل بنجاح!' : 'تم استلام طلبك!'}
                </h3>
                <p className="text-purple-300 mt-2">
                  رقم الطلب: <span className="font-mono font-bold text-purple-400">{status.orderId}</span>
                </p>
                <p className="text-purple-300 mt-1">
                  رقم التوصيل: <span className="font-mono font-bold text-purple-400">{status.deliveryId}</span>
                </p>
              </div>
              
              <div className="bg-black/50 rounded-xl p-4 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-300">اللعبة:</span>
                  <span className="font-bold text-purple-400">{status.game}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-300">الكمية:</span>
                  <span className="font-bold text-yellow-400">{status.amount}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-purple-300">الحالة:</span>
                  <span className={`font-bold ${getStatusColor(status.status)}`}>
                    {status.status}
                  </span>
                </div>
                {status.estimatedTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300">الوقت المقدر:</span>
                    <span className="font-bold text-amber-400">{status.estimatedTime}</span>
                  </div>
                )}
              </div>

              {/* أزرار النسخ */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => copyToClipboard(status.orderId, 'order')}
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-purple-900/30 hover:bg-purple-900/50 p-3 rounded-xl border border-purple-500/30 transition-all"
                >
                  {copiedField === 'order' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="text-purple-300 text-sm">نسخ رقم الطلب</span>
                </button>

                <button
                  onClick={() => copyToClipboard(status.deliveryId, 'delivery')}
                  className="flex items-center justify-center space-x-2 space-x-reverse bg-purple-900/30 hover:bg-purple-900/50 p-3 rounded-xl border border-purple-500/30 transition-all"
                >
                  {copiedField === 'delivery' ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4 text-purple-400" />
                  )}
                  <span className="text-purple-300 text-sm">نسخ رقم التوصيل</span>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-800 to-pink-800 rounded-xl p-4">
                  <div className="flex items-center space-x-3 space-x-reverse text-white">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p className="text-sm font-medium">
                      {status.status === 'قيد المعالجة' 
                        ? 'جاري معالجة طلبك، قد تستغرق العملية من 30-60 ثانية'
                        : 'تأكد من أن حساب اللعبة مفتوح وأنك قمت بإدخال الـ ID الصحيح'
                      }
                    </p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRefreshStatus}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-purple-500/30 transition-all disabled:opacity-70"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <Loader className="h-5 w-5 animate-spin" />
                      <span>جاري التحقق...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2 space-x-reverse">
                      <RefreshCw className="h-5 w-5" />
                      <span>تحديث الحالة</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-500/50">
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-red-400">فشل التوصيل</h3>
              <p className="text-purple-300 mt-2">{status.error}</p>
              {status.errorCode && (
                <p className="text-purple-400 mt-1 font-mono">كود الخطأ: {status.errorCode}</p>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-xl font-bold text-lg"
              >
                حاول مرة أخرى
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeliveryStatusModal;
