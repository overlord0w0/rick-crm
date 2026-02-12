import { useState, useEffect } from 'react';
import type { Character } from '../types';
import { fetchNote, saveNote, deleteNote } from '../api';
import { X, Save, FileText, Volume2, Trash2, Clock } from 'lucide-react';

interface Props {
    character: Character;
    onClose: () => void;
}

interface NoteItem {
    _id: string;
    userId: string;
    text: string;
    createdAt: string;
}

export const CharacterModal = ({ character, onClose }: Props) => {
    const [newNote, setNewNote] = useState('');
    const [history, setHistory] = useState<NoteItem[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        const data = await fetchNote(character.id);
        setHistory(data.notes || []);
        setIsAdmin(!!data.isAdmin);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [character.id]);

    const handleSave = async () => {
        if (!newNote.trim()) return;
        setIsSaving(true);
        await saveNote(character.id, character.name, newNote);
        setNewNote('');
        setIsSaving(false);
        loadData();
    };

    const handleDelete = async (noteId: string) => {
        if (confirm('DELETE ENTRY?')) {
            await deleteNote(noteId);
            setHistory(prev => prev.filter(n => n._id !== noteId));
        }
    };

    const handleSpeak = () => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(`${character.name}. Status: ${character.status}.`);
        utterance.pitch = 0.8; utterance.rate = 1.1;
        synth.cancel(); synth.speak(utterance);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>

                <div className="modal-header">
                    <h2>CASE FILE: #{character.id} {isAdmin && <span style={{color:'gold', fontSize:'0.7em'}}> [ADMIN]</span>}</h2>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>

                <div className="modal-body">
                    <div className="char-info-panel">
                        <div style={{ position: 'relative' }}>
                            <img src={character.image} alt={character.name} className="modal-img"/>
                            <button onClick={handleSpeak} className="modal-voice-btn"><Volume2 size={20}/></button>
                        </div>
                        <h3>{character.name}</h3>
                        <div className="info-row"><span>Origin:</span> <strong>{character.origin.name}</strong></div>
                        <div className={`status-badge ${character.status.toLowerCase()}`}>{character.status}</div>
                    </div>

                    <div className="char-notes-panel">

                        <div style={{ marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '15px' }}>
                            <div style={{ color: 'var(--rick-green)', marginBottom: '5px', fontWeight: 'bold', display:'flex', alignItems:'center' }}>
                                <FileText size={16} style={{ marginRight: '5px' }} /> NEW ENTRY
                            </div>
                            <textarea
                                className="notes-area"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Add new observation..."
                                style={{ minHeight: '80px', height: '80px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
                                <button className="action-btn" onClick={handleSave} disabled={isSaving || !newNote.trim()}>
                                    <Save size={14} style={{marginRight: '5px'}}/> {isSaving ? 'SAVING...' : 'ADD TO LOG'}
                                </button>
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ color: '#888', marginBottom: '10px', fontSize: '0.9rem', display:'flex', alignItems:'center' }}>
                                <Clock size={14} style={{ marginRight: '5px' }} /> HISTORY LOG ({history.length})
                            </div>

                            {history.length === 0 ? (
                                <p style={{ color: '#444', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>No records found.</p>
                            ) : (
                                history.map(note => (
                                    <div key={note._id} style={{
                                        background: '#051a05',
                                        borderLeft: '3px solid var(--rick-green)',
                                        padding: '10px',
                                        marginBottom: '8px',
                                        position: 'relative'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginBottom: '4px', display:'flex', justifyContent:'space-between' }}>
                                            <span>{new Date(note.createdAt).toLocaleString()}</span>
                                            {isAdmin && <span style={{color: 'gold'}}>AGENT: {note.userId}</span>}
                                        </div>
                                        <div style={{ color: '#ddd', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>{note.text}</div>

                                        {(isAdmin || true) && (
                                            <button
                                                onClick={() => handleDelete(note._id)}
                                                style={{ position: 'absolute', top: '5px', right: '5px', background: 'none', border: 'none', color: '#522', cursor: 'pointer' }}
                                                title="Delete"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};