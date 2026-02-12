import type { Character } from '../types';
import { useSounds } from '../hooks/useSounds';
import { Volume2, Star } from 'lucide-react';

interface Props {
    character: Character;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    onClick: (character: Character) => void;
}

export const CharacterCard = ({ character, isFavorite, onToggleFavorite, onClick }: Props) => {
    const { playHover, playClick } = useSounds();

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(`${character.name}. Status: ${character.status}.`);
        utterance.pitch = 0.8; utterance.rate = 1.2;
        synth.cancel(); synth.speak(utterance);
    };

    const handleStarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleFavorite(character.id);
    };

    return (
        <div
            className="char-card"
            onClick={() => { playClick(); onClick(character); }}
            onMouseEnter={playHover}
            style={{ border: isFavorite ? '2px solid gold' : '' }}
        >
            <img src={character.image} alt={character.name} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '10px' }}>
                <h3 style={{color: isFavorite ? 'gold' : 'white'}}>{character.name}</h3>

                <div style={{display:'flex', gap:'5px'}}>
                    <button
                        className="icon-btn"
                        onClick={handleStarClick}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: isFavorite ? 'gold' : '#444',
                            cursor: 'pointer',
                            padding: 0
                        }}
                    >
                        <Star fill={isFavorite ? "gold" : "none"} size={20} />
                    </button>

                    <button
                        className="icon-btn"
                        onClick={handleSpeak}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--rick-green)',
                            color: 'var(--rick-green)',
                            borderRadius: '50%',
                            width: '24px', height: '24px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Volume2 size={14} />
                    </button>
                </div>
            </div>

            <div className="char-info">
                <span className={`status-dot ${character.status.toLowerCase()}`}></span>
                <span>{character.status} - {character.species}</span>
            </div>
        </div>
    );
};