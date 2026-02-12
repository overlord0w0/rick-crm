import { useEffect, useState } from 'react';
import { getCurrentUser, fetchAllNotes, logoutUser, uploadAvatar, getMyProfile } from '../api';
import type { Note } from '../types'; // Перевір, щоб Note тут мав поля createdAt, characterName, text
import { Camera, Search, ArrowUp, ArrowDown } from 'lucide-react';

export const Profile = () => {
    const [user, setUser] = useState(getCurrentUser());
    const [notes, setNotes] = useState<any[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
    const [avatar, setAvatar] = useState('');

    const [search, setSearch] = useState('');
    const [sortNewest, setSortNewest] = useState(true);

    useEffect(() => {
        const load = async () => {
            const data = await fetchAllNotes();
            setNotes(data);
            setFilteredNotes(data);

            const profile = await getMyProfile();
            if (profile?.avatar) setAvatar(profile.avatar);
        };
        load();
    }, []);

    useEffect(() => {
        let result = [...notes];

        if (search) {
            const lower = search.toLowerCase();
            result = result.filter(n =>
                n.characterName.toLowerCase().includes(lower) ||
                n.text.toLowerCase().includes(lower)
            );
        }

        result.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortNewest ? dateB - dateA : dateA - dateB;
        });

        setFilteredNotes(result);
    }, [search, sortNewest, notes]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            await uploadAvatar(e.target.files[0]);
            window.location.reload();
        }
    };

    return (
        <div className="view-section">
            <h1 className="glitch-text">AGENT PROFILE</h1>

            <div style={{ border: '2px solid var(--rick-green)', padding: '20px', background: 'black', marginBottom: '30px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                    {avatar ? <img src={avatar} style={{width:'100%', height:'100%', objectFit:'cover', border:'2px solid var(--rick-green)'}}/> : <div style={{width:'100%', height:'100%', background:'#051a05', display:'flex', alignItems:'center', justifyContent:'center', border:'1px dashed var(--rick-green)'}}>NO PHOTO</div>}
                    <label style={{position:'absolute', bottom:'-5px', right:'-5px', background:'var(--rick-green)', borderRadius:'50%', padding:'5px', cursor:'pointer'}}><Camera size={16}/><input type="file" hidden onChange={handleFileChange}/></label>
                </div>
                <div>
                    <h2>ID: {user}</h2>
                    <button className="action-btn" onClick={logoutUser} style={{marginTop:'5px', fontSize:'0.8rem'}}>LOGOUT</button>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ margin: 0 }}>MY LOGS ({filteredNotes.length})</h2>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <div className="search-container" style={{ margin: 0 }}>
                        <input
                            type="text"
                            placeholder="Search logs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ padding: '5px 10px', width: '200px' }}
                        />
                    </div>
                    <button
                        className="icon-btn"
                        onClick={() => setSortNewest(!sortNewest)}
                        title="Sort Date"
                        style={{ border: '1px solid var(--rick-green)', color: 'var(--rick-green)', width: '35px' }}
                    >
                        {sortNewest ? <ArrowDown size={16}/> : <ArrowUp size={16}/>}
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gap: '10px' }}>
                {filteredNotes.length === 0 ? <p>No logs found.</p> : filteredNotes.map((note) => (
                    <div key={note._id} style={{ background: '#051a05', padding: '15px', borderLeft: '3px solid var(--rick-green)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                            <h3 style={{ margin: 0, color: 'white' }}>Subject: {note.characterName}</h3>
                            <small style={{ color: '#666' }}>{new Date(note.createdAt).toLocaleString()}</small>
                        </div>
                        <p style={{ color: '#aaa', margin: 0 }}>{note.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};