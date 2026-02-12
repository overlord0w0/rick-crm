import { useState, useEffect } from 'react';
import { fetchCharacters, getFavorites, toggleFavoriteApi, fetchMultipleCharacters } from '../api';
import type { Character } from '../types';
import { CharacterCard } from '../components/CharacterCard';
import { CharacterModal } from '../components/CharacterModal';
import { Search, Star } from 'lucide-react';

export const Agents = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [favorites, setFavorites] = useState<number[]>([]); // Список ID улюблених
    const [showWatchlist, setShowWatchlist] = useState(false); // Режим фільтру

    const [loading, setLoading] = useState(false);
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('');
    const [gender, setGender] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        getFavorites().then(setFavorites);
    }, []);

    const loadData = async (isNewSearch: boolean = false) => {
        setLoading(true);

        if (showWatchlist) {
            const data = await fetchMultipleCharacters(favorites);
            setCharacters(data);
        } else {
            const currentPage = isNewSearch ? 1 : page;
            const data = await fetchCharacters(search, currentPage, status, gender);

            if (isNewSearch) {
                setCharacters(data.results || []);
                setPage(1);
            } else {
                setCharacters(prev => [...prev, ...(data.results || [])]);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData(true);
    }, [status, gender, showWatchlist]);

    useEffect(() => {
        if (page > 1 && !showWatchlist) {
            loadData(false);
        }
    }, [page]);

    const handleToggleFavorite = async (id: number) => {
        const isFav = favorites.includes(id);

        let newFavs;
        if (isFav) {
            newFavs = favorites.filter(fid => fid !== id);
        } else {
            newFavs = [...favorites, id];
        }
        setFavorites(newFavs);

        await toggleFavoriteApi(id, !isFav);

        if (showWatchlist && isFav) {
            setCharacters(prev => prev.filter(c => c.id !== id));
        }
    };

    return (
        <div className="view-section">
            <div id="top-bar" style={{ marginBottom: '20px' }}>
                <div className="search-container">
                    <input
                        type="text" placeholder="SEARCH ENTITY..."
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        disabled={showWatchlist}
                    />

                    <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)} disabled={showWatchlist}>
                        <option value="">[ ANY STATUS ]</option>
                        <option value="alive">ALIVE</option>
                        <option value="dead">DEAD</option>
                        <option value="unknown">UNKNOWN</option>
                    </select>

                    <select className="filter-select" value={gender} onChange={(e) => setGender(e.target.value)} disabled={showWatchlist}>
                        <option value="">[ ANY GENDER ]</option>
                        <option value="female">FEMALE</option>
                        <option value="male">MALE</option>
                    </select>

                    <button className="nav-btn" onClick={() => loadData(true)} disabled={showWatchlist}>
                        <Search size={16} /> GO
                    </button>

                    <button
                        className="nav-btn"
                        onClick={() => setShowWatchlist(!showWatchlist)}
                        style={{
                            background: showWatchlist ? 'gold' : 'black',
                            color: showWatchlist ? 'black' : 'gold',
                            border: '1px solid gold',
                            marginLeft: '10px',
                            width: 'auto',
                            padding: '0 15px'
                        }}
                    >
                        <Star size={16} fill={showWatchlist ? "black" : "none"} />
                        {showWatchlist ? ' WATCHLIST ACTIVE' : ' WATCHLIST'}
                    </button>
                </div>
            </div>

            <div style={{ color: 'var(--rick-green)', marginBottom: '10px', fontSize: '0.8rem' }}>
                SYSTEM REPORT: {characters.length} RECORDS DISPLAYED {showWatchlist && '(FILTERED BY USER)'}
            </div>

            <div id="content-area" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px', paddingBottom: '20px'
            }}>
                {characters.map((char) => (
                    <CharacterCard
                        key={char.id}
                        character={char}
                        isFavorite={favorites.includes(char.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onClick={(c) => setSelectedChar(c)}
                    />
                ))}
            </div>

            {!showWatchlist && characters.length > 0 && (
                <button
                    onClick={() => setPage(p => p + 1)}
                    className="action-btn"
                    style={{ width: '100%', marginBottom: '50px' }}
                    disabled={loading}
                >
                    {loading ? 'DOWNLOADING...' : 'vv LOAD MORE vv'}
                </button>
            )}

            {selectedChar && (
                <CharacterModal character={selectedChar} onClose={() => setSelectedChar(null)} />
            )}
        </div>
    );
};