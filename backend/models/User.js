import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true,
    maxlength: [50, 'الاسم لا يمكن أن يزيد عن 50 حرف']
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'بريد إلكتروني غير صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'رقم الهاتف مطلوب'],
    validate: {
      validator: function(v) {
        return /^01[0-2,5]{1}[0-9]{8}$/.test(v);
      },
      message: 'رقم هاتف غير صحيح'
    }
  },
  wallet: {
    type: Number,
    default: 100, // هدية ترحيبية
    min: [0, 'لا يمكن أن يكون الرصيد سالباً']
  },
  level: {
    type: String,
    enum: ['جديد', 'مبتدئ', 'متوسط', 'محترف', 'VIP'],
    default: 'جديد'
  },
  points: {
    type: Number,
    default: 0
  },
  orders: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'suspended', 'banned'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// مقارنة كلمة المرور
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// تحديث آخر دخول
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

// ترقية المستوى بناءً على النقاط
userSchema.methods.updateLevel = function() {
  const points = this.points;
  
  if (points >= 10000 && this.level !== 'VIP') {
    this.level = 'VIP';
  } else if (points >= 5000 && this.level !== 'محترف') {
    this.level = 'محترف';
  } else if (points >= 2000 && this.level !== 'متوسط') {
    this.level = 'متوسط';
  } else if (points >= 500 && this.level !== 'مبتدئ') {
    this.level = 'مبتدئ';
  }
  
  return this.save();
};

const User = mongoose.model('User', userSchema);

export default User;
