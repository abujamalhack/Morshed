import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// إنشاء توكن
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // التحقق من البيانات
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    // جلب المستخدم مع كلمة المرور
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    // التحقق من حالة الحساب
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'الحساب موقوف. يرجى التواصل مع الدعم'
      });
    }

    // تحديث آخر دخول
    await user.updateLastLogin();

    // إنشاء التوكن
    const token = signToken(user._id);

    // إرجاع البيانات بدون كلمة المرور
    const userWithoutPassword = await User.findById(user._id);

    res.status(200).json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'تم تسجيل الدخول بنجاح'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// إنشاء حساب
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // التحقق من البيانات
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'الرجاء إدخال جميع الحقول المطلوبة'
      });
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'بريد إلكتروني غير صحيح'
      });
    }

    // التحقق من طول كلمة المرور
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل'
      });
    }

    // إنشاء المستخدم
    const newUser = await User.create({
      name,
      email,
      password,
      phone,
      wallet: 100, // هدية ترحيبية
      level: 'جديد'
    });

    // إنشاء التوكن
    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: newUser,
      message: 'تم إنشاء الحساب بنجاح! تم إضافة 100 جنيه كهدية ترحيب'
    });

  } catch (error) {
    console.error('Register error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'بيانات غير صحيحة'
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// جلب بيانات الملف الشخصي
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// تحديث الملف الشخصي
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
      message: 'تم تحديث الملف الشخصي بنجاح'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'بيانات غير صحيحة'
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

export default router;
