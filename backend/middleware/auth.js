import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    let token;

    // التحقق من وجود التوكن في الهيدر
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح بالوصول. يرجى تسجيل الدخول.'
      });
    }

    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // جلب المستخدم من التوكن
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم المرتبط بهذا التوكن غير موجود.'
      });
    }

    // التحقق من حالة المستخدم
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'الحساب موقوف. يرجى التواصل مع الدعم.'
      });
    }

    // إضافة المستخدم للطلب
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'توكن غير صحيح. يرجى تسجيل الدخول مرة أخرى.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية التوكن. يرجى تسجيل الدخول مرة أخرى.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في المصادقة'
    });
  }
};

export default auth;
