import type { ApiResponse, Character, Note } from './types';


export async function fetchCharacters(
    name: string = '',
    page: number = 1,
    status: string = '',
    gender: string = ''
): Promise<ApiResponse> {
    let url = `https://rickandmortyapi.com/api/character/?page=${page}&name=${name}`;
    if (status) url += `&status=${status}`;
    if (gender) url += `&gender=${gender}`;

    try {
        const res = await fetch(url);
        if (!res.ok) return { results: [], info: undefined };
        return await res.json();
    } catch (e) {
        return { results: [], info: undefined };
    }
}


export async function loginUser(username: string, password: string): Promise<{ token: string, username: string } | null> {
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) throw new Error('Login failed');

        const data = await res.json();
        localStorage.setItem('rick-token', data.token);
        localStorage.setItem('rick-username', data.username);
        return data;
    } catch (e) {
        console.error(e);
        return null;
    }
}

export async function registerUser(username: string, password: string): Promise<boolean> {
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return res.ok;
    } catch (e) {
        return false;
    }
}

export function logoutUser() {
    localStorage.removeItem('rick-token');
    localStorage.removeItem('rick-username');
    window.location.href = '/login';
}

export function getCurrentUser() {
    return localStorage.getItem('rick-username');
}


export async function fetchNote(charId: number) {
    const token = localStorage.getItem('rick-token');
    try {
        const res = await fetch(`/api/notes/${charId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        return data;
    } catch (e) {
        return { notes: [] };
    }
}

export async function deleteNote(noteId: string) {
    const token = localStorage.getItem('rick-token');
    await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export async function saveNote(charId: number, charName: string, text: string) {
    const token = localStorage.getItem('rick-token');
    if (!token) return;

    await fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ characterId: charId, characterName: charName, text })
    });
}

export async function fetchAllNotes() {
    try {
        const token = localStorage.getItem('rick-token');
        if (!token) return [];

        const res = await fetch('/api/all-notes', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}


export async function uploadAvatar(file: File): Promise<string | null> {
    const username = localStorage.getItem('rick-username');
    if (!username) return null;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'x-username': username
            },
            body: formData
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data.url;
    } catch (e) {
        return null;
    }
}

export async function getMyProfile() {
    const token = localStorage.getItem('rick-token');
    try {
        const res = await fetch('/api/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    } catch (e) {
        return null;
    }
}


export async function fetchAllUsers() {
    const token = localStorage.getItem('rick-token');
    try {
        const res = await fetch('/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

export async function deleteUser(userId: string) {
    const token = localStorage.getItem('rick-token');
    await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export async function getFavorites(): Promise<number[]> {
    const token = localStorage.getItem('rick-token');
    try {
        const res = await fetch('/api/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return await res.json();
    } catch (e) {
        return [];
    }
}

export async function toggleFavoriteApi(charId: number, isAdding: boolean) {
    const token = localStorage.getItem('rick-token');
    await fetch(`/api/favorites/${charId}`, {
        method: isAdding ? 'POST' : 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
}

export async function fetchMultipleCharacters(ids: number[]) {
    if (ids.length === 0) return [];
    try {
        const res = await fetch(`https://rickandmortyapi.com/api/character/${ids.join(',')}`);
        const data = await res.json();
        return Array.isArray(data) ? data : [data];
    } catch (e) {
        return [];
    }
}