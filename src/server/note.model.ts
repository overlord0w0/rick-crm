import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    characterId: { type: Number, required: true },
    characterName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Note = mongoose.model('AgentNoteV3', NoteSchema);