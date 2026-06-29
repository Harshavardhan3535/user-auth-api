// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: [true, 'Name is required'],
//       trim: true,
//       minlength: [2, 'Name must be at least 2 characters']
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [6, 'Password must be at least 6 characters']
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user'
//     },
//     refreshToken: {
//       type: String,
//       default: null
//     }
//   },
//   {
//     timestamps: true
//   }
// );

// // ─── Pre-save hook ────────────────────────────────────────────
// // Pre-save hook: A function that runs automatically at a specific point in the lifecycle of a document, in this case before saving a user to the database. It hashes the password if it has been modified.
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// // ─── Instance method ──────────────────────────────────────────
// //Instance method: A function attached to every individual User document. So after you fetch a user from DB, you can call user.comparePassword('typed123') directly on it.
// userSchema.methods.comparePassword = async function (plainPassword) {
//   return await bcrypt.compare(plainPassword, this.password);
// };

// const User = mongoose.model('User', userSchema);

// module.exports = User;

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    refreshToken: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// // ─── Pre-save hook ────────────────────────────────────────────
// // Pre-save hook: A function that runs automatically at a specific point in the lifecycle of a document, in this case before saving a user to the database. It hashes the password if it has been modified.
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});


// // ─── Instance method ──────────────────────────────────────────
// //Instance method: A function attached to every individual User document. So after you fetch a user from DB, you can call user.comparePassword('typed123') directly on it.
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;