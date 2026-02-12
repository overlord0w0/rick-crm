import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchCharacters } from '../api';
import type { Character } from '../types';
import { CharacterModal } from '../components/CharacterModal';
import L from 'leaflet';

const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl,
    iconRetinaUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const getCoordinates = (locationName: string): [number, number] => {
    let hash = 0;
    for (let i = 0; i < locationName.length; i++) {
        hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = (hash % 6000) / 100;
    const lng = (hash % 15000) / 100;
    return [lat, lng];
};

export const GalaxyMap = () => {
    const [locations, setLocations] = useState<Record<string, Character[]>>({});
    const [selectedChar, setSelectedChar] = useState<Character | null>(null);

    useEffect(() => {
        const load = async () => {
            const p1 = await fetchCharacters('', 1);
            const p2 = await fetchCharacters('', 2);
            const p3 = await fetchCharacters('', 3);
            const p4 = await fetchCharacters('', 4);
            const allChars = [
                ...(p1.results || []),
                ...(p2.results || []),
                ...(p3.results || []),
                ...(p4.results || [])
            ];

            const locMap: Record<string, Character[]> = {};
            allChars.forEach(char => {
                if (char.location.name !== 'unknown') {
                    if (!locMap[char.location.name]) locMap[char.location.name] = [];
                    locMap[char.location.name].push(char);
                }
            });
            setLocations(locMap);
        };
        load();
    }, []);

    return (
        <div className="view-section" style={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
            <h1 className="glitch-text">GALAXY MAP (LIVE FEED)</h1>

            <div style={{ flex: 1, border: '2px solid var(--rick-green)', borderRadius: '10px', overflow: 'hidden' }}>
                <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%', background: '#050505' }}>

                    <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {Object.entries(locations).map(([locName, residents]) => {
                        const position = getCoordinates(locName);

                        return (
                            <Marker key={locName} position={position} icon={customIcon}>
                                <Popup className="custom-popup">
                                    <div style={{ color: 'black', minWidth: '150px' }}>
                                        <strong>🪐 {locName}</strong>
                                        <br />
                                        <small>Detected Lifeforms: {residents.length}</small>

                                        <div style={{
                                            marginTop: '5px',
                                            maxHeight: '120px',
                                            overflowY: 'auto',
                                            borderTop: '1px solid #ccc',
                                            paddingTop: '5px'
                                        }}>
                                            <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                                {residents.map(c => (
                                                    <li
                                                        key={c.id}
                                                        style={{ cursor: 'pointer', color: '#006400', textDecoration: 'underline' }}
                                                        onClick={() => setSelectedChar(c)}
                                                    >
                                                        {c.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>

            {selectedChar && (
                <CharacterModal character={selectedChar} onClose={() => setSelectedChar(null)} />
            )}
        </div>
    );
};