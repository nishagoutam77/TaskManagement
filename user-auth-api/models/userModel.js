const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    salt: { type: String },
    otp: { type: String },
    otpExpired: { type: Date }
}, { timestamps: true });

// Hash password with salt using MD5
userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.password = crypto.createHash('md5').update(password + this.salt).digest('hex');
};

// Verify password
userSchema.methods.verifyPassword = function (password) {
    const hash = crypto.createHash('md5').update(password + this.salt).digest('hex');
    return this.password === hash;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
