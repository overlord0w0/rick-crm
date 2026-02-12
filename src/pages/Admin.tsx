import { useEffect, useState } from 'react';
import { fetchAllUsers, deleteUser, getCurrentUser } from '../api';
import type { User } from '../types';
import { Trash2, ShieldAlert } from 'lucide-react';

export const Admin = () => {
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = getCurrentUser();

    if (currentUser !== 'Rick Number One') {
        return (
            <div className="view-section" style={{ textAlign: 'center', color: 'red', marginTop: '50px' }}>
                <ShieldAlert size={64} />
                <h1>ACCESS DENIED</h1>
                <p>YOU ARE NOT RICK C-137.</p>
            </div>
        );
    }

    const load = async () => {
        const data = await fetchAllUsers();
        setUsers(data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (name === 'Rick Number One') {
            alert("YOU CANNOT DELETE YOURSELF, GENIUS.");
            return;
        }
        if (confirm(`TERMINATE AGENT ${name}?`)) {
            await deleteUser(id);
            load();
        }
    };

    return (
        <div className="view-section">
            <h1 className="glitch-text" style={{ color: 'red' }}>ADMIN PANEL [TOP SECRET]</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                <tr style={{ borderBottom: '2px solid var(--rick-green)', color: 'var(--rick-green)' }}>
                    <th style={{ textAlign: 'left', padding: '10px' }}>AVATAR</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>AGENT ID</th>
                    <th style={{ textAlign: 'left', padding: '10px' }}>JOINED</th>
                    <th style={{ textAlign: 'right', padding: '10px' }}>ACTION</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid #333' }}>
                        <td style={{ padding: '10px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: '#222' }}>
                                {u.avatar ? (
                                    <img src={u.avatar} alt="user" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ width: '100%', height: '100%', background: 'var(--rick-green)' }}></div>
                                )}
                            </div>
                        </td>
                        <td style={{ color: 'white' }}>
                            {u.username}
                            {u.username === 'Rick Number One' && <span style={{ color: 'gold', marginLeft: '5px' }}> (ADMIN)</span>}
                        </td>
                        <td style={{ color: '#888' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={{ textAlign: 'right' }}>
                            <button
                                onClick={() => handleDelete(u._id, u.username)}
                                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                title="TERMINATE"
                            >
                                <Trash2 />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};