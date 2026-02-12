import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    favorites: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);