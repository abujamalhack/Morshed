import { motion } from 'framer-motion';
import { 
  Wallet, Clock, Star, Crown, TrendingUp, 
  Package, History, CreditCard, Users,
  Zap, Gift, Shield
} from 'lucide-react';

const UserDashboard = ({ user, orders }) => {
  const stats = [
    {
      title: "رصيد المحفظة",
      value: `${user?.wallet?.toLocaleString('ar-EG')} جنيه`,
      icon: Wallet,
      gradient: "from-green-500 to-emerald-600",
      change: "+12%"
    },
    {
      title: "طلبات نشطة",
      value: orders?.filter(o => o.status === 'قيد المعالجة').length || 0,
      icon: Clock,
      gradient: "from-blue-500 to-cyan-600",
      change: "+5%"
    },
    {
      title: "النقاط",
      value: user?.points?.toLocaleString('ar-EG') || '0',
      icon: Star,
      gradient: "from-yellow-500 to-amber-600",
      change: "+8%"
    },
    {
      title: "المستوى",
      value: user?.level || 'جديد',
      icon: Crown,
      gradient: "from-purple-500 to-pink-600",
      change: "VIP"
    }
  ];

  const recentOrders = orders?.slice(0, 5) || [];
  const quickActions = [
    {
      title: "شحن سريع",
      description: "شحن فوري للعبتك المفضلة",
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      action: "start"
    },
    {
      title: "شحن المحفظة",
      description: "إضافة رصيد للمحفظة",
      icon: CreditCard,
      gradient: "from-green-500 to-emerald-600",
      action: "deposit"
    },
    {
      title: "عروض خاصة",
      description: "خصومات حصرية للأعضاء",
      icon: Gift,
      gradient: "from-yellow-500 to-amber-600",
      action: "offers"
    },
    {
      title: "الدعم الفني",
      description: "مساعدة فورية على مدار الساعة",
      icon: Shield,
      gradient: "from-blue-500 to-cyan-600",
      action: "support"
    }
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-8"
    >
      {/* ترحيب */}
      <motion.div 
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }}
        className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-8 border border-purple-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              مرحباً بعودتك، {user?.name}! 👋
            </h1>
            <p className="text-purple-200 mt-2">
              لديك {recentOrders.length} طلب نشط. استمتع بتجربة شراء سريعة وآمنة.
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-3 space-x-reverse bg-black/30 p-4 rounded-2xl">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-3 rounded-xl">
              <Crown className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="text-white font-bold">{user?.level}</div>
              <div className="text-yellow-400 text-sm">مستوى عضويتك</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 }
            }}
            className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-6 text-white shadow-2xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="h-8 w-8 text-white/90" />
              <span className="text-white/70 text-sm bg-white/20 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-white/80 text-sm">{stat.title}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* الإجراءات السريعة */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          className="lg:col-span-2"
        >
          <h2 className="text-2xl font-bold gradient-text mb-6">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`bg-gradient-to-br ${action.gradient} rounded-2xl p-6 text-white text-right shadow-lg hover:shadow-xl transition-all`}
              >
                <div className="flex items-center justify-between mb-3">
                  <action.icon className="h-8 w-8 text-white/90" />
                  <div className="text-left">
                    <div className="text-lg font-bold">{action.title}</div>
                    <div className="text-white/80 text-sm">{action.description}</div>
                  </div>
                </div>
                <div className="text-white/70 text-xs">انقر للبدء →</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* الطلبات الأخيرة */}
        <motion.div
          variants={{
            hidden: { y: 20, opacity: 0 },
            visible: { y: 0, opacity: 1 }
          }}
          className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">الطلبات الأخيرة</h2>
            <Package className="h-6 w-6 text-purple-400" />
          </div>

          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-black/30 rounded-2xl border border-purple-500/20">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`p-2 rounded-xl ${
                      order.status === 'مكتمل' ? 'bg-green-500/20' : 
                      order.status === 'قيد المعالجة' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{order.game}</h3>
                      <p className="text-purple-300 text-xs">{order.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold text-sm ${
                      order.status === 'مكتمل' ? 'text-green-400' : 
                      order.status === 'قيد المعالجة' ? 'text-yellow-400' : 'text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-purple-300 text-xs">{order.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-purple-400 mb-3" />
                <p className="text-purple-300">لا توجد طلبات حالياً</p>
                <p className="text-purple-400 text-sm mt-1">ابدأ شراء أول منتج لك!</p>
              </div>
            )}
          </div>

          {recentOrders.length > 0 && (
            <button className="w-full mt-6 bg-purple-900/30 hover:bg-purple-900/50 py-3 rounded-2xl border border-purple-500/30 text-purple-300 font-medium transition-all">
              عرض جميع الطلبات
            </button>
          )}
        </motion.div>
      </div>

      {/* التقدم والإنجازات */}
      <motion.div
        variants={{
          hidden: { y: 20, opacity: 0 },
          visible: { y: 0, opacity: 1 }
        }}
        className="bg-gradient-to-r from-slate-900 to-purple-900 rounded-3xl p-8 border border-purple-500/30"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">تقدمك الشخصي</h2>
          <TrendingUp className="h-6 w-6 text-green-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{user?.orders || 0}</div>
            <div className="text-purple-300">طلب مكتمل</div>
            <div className="text-green-400 text-sm mt-1">+12% عن الشهر الماضي</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{user?.points?.toLocaleString('ar-EG') || 0}</div>
            <div className="text-purple-300">نقطة مكتسبة</div>
            <div className="text-green-400 text-sm mt-1">+845 هذا الشهر</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {user?.joined ? new Date(user.joined).getFullYear() : '2024'}
            </div>
            <div className="text-purple-300">سنة الانضمام</div>
            <div className="text-green-400 text-sm mt-1">عضو {user?.level}</div>
          </div>
        </div>

        {/* شريط التقدم */}
        <div className="mt-8">
          <div className="flex justify-between text-purple-300 text-sm mb-2">
            <span>تقدمك نحو المستوى التالي</span>
            <span>65%</span>
          </div>
          <div className="w-full bg-purple-900/30 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: '65%' }}
            ></div>
          </div>
          <div className="text-purple-400 text-xs mt-2 text-center">
            تحتاج 1550 نقطة للترقية إلى المستوى VIP
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
