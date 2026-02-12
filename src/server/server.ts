import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import { User } from './user.model';
import { Note } from './note.model';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://moko:nazarIX1@moko.hdn8ymr.mongodb.net/?appName=moko')
    .then(() => console.log('🟢 MongoDB Atlas connected!'))
    .catch(err => console.error('🔴 MongoDB Error:', err));

// --- HELPER: GET AUTH ---
const getAuth = (req: express.Request) => {
    const token = req.headers.authorization;
    if (!token) return null;
    try {
        const decoded = Buffer.from(token.replace('Bearer ', ''), 'base64').toString('utf-8');
        const username = decoded.split(':')[0];
        return { username };
    } catch (e) {
        return null;
    }
};


// --- FAVORITES ---
app.get('/api/favorites', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Auth failed' });
    const dbUser = await User.findOne({ username: user.username });
    res.json(dbUser?.favorites || []);
});

app.post('/api/favorites/:id', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Auth failed' });
    await User.findOneAndUpdate(
        { username: user.username },
        { $addToSet: { favorites: req.params.id } }
    );
    res.json({ success: true });
});

app.delete('/api/favorites/:id', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Auth failed' });
    await User.findOneAndUpdate(
        { username: user.username },
        { $pull: { favorites: req.params.id } }
    );
    res.json({ success: true });
});

app.get('/api/all-notes', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const notes = await Note.find({ userId: user.username }).sort({ createdAt: -1 });
    res.json(notes);
});

app.get('/api/notes/:charId', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    let notes;
    if (user.username === 'Rick Number One') {
        notes = await Note.find({ characterId: req.params.charId }).sort({ createdAt: -1 });
        return res.json({ isAdmin: true, notes });
    }
    notes = await Note.find({ userId: user.username, characterId: req.params.charId }).sort({ createdAt: -1 });
    return res.json({ isAdmin: false, notes });
});

app.post('/api/notes', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { characterId, characterName, text } = req.body;
    const newNote = new Note({
        userId: user.username,
        characterId,
        characterName,
        text,
        createdAt: new Date()
    });
    await newNote.save();
    res.json({ success: true });
});

app.delete('/api/notes/:noteId', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    await Note.findByIdAndDelete(req.params.noteId);
    res.json({ success: true });
});

app.get('/api/users', async (req, res) => {
    const user = getAuth(req);
    if (!user || user.username !== 'Rick Number One') return res.status(403).json({ error: 'ACCESS DENIED' });
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (e) { res.status(500).json({ error: 'DB Error' }); }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (e) { res.status(400).json({ error: 'User exists' }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        res.json({ token, username });
    } catch (e) { res.status(500).json({ error: 'Error' }); }
});

app.get('/api/me', async (req, res) => {
    const auth = getAuth(req);
    if (!auth) return res.status(401).json({ error: 'Auth failed' });
    const dbUser = await User.findOne({ username: auth.username });
    res.json({ username: dbUser?.username, avatar: dbUser?.avatar || '' });
});

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const username = req.headers['x-username'] as string || 'unknown';
        const ext = path.extname(file.originalname);
        cb(null, `avatar-${username}${ext}`);
    }
});
const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));
app.post('/api/upload', upload.single('avatar'), async (req, res) => {
    try {
        const username = req.headers['x-username'];
        if (!req.file || !username) return res.status(400).json({ error: 'Upload failed' });
        const fileUrl = `/uploads/${req.file.filename}`;
        await User.findOneAndUpdate({ username }, { avatar: fileUrl });
        res.json({ url: fileUrl });
    } catch (e) { res.status(500).json({ error: 'Server error' }); }
});

const distPath = path.join(__dirname, '../../dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});