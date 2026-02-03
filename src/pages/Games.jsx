import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/loading/Loader';

const Games = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGames, setFilteredGames] = useState([]);

    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredGames(games);
        } else {
            const filtered = games.filter(game =>
                game.game_name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredGames(filtered);
        }
    }, [searchTerm, games]);

    const fetchGames = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = localStorage.getItem('access_token');
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/v1/games`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken || ''}`,
                    }
                }
            );

            if (response.data?.api_status === 200 && response.data?.data) {
                setGames(response.data.data);
                setFilteredGames(response.data.data);
            } else {
                throw new Error('Failed to fetch games');
            }
        } catch (err) {
            console.error('Error fetching games:', err);
            setError(err.message || 'Failed to load games');
            toast.error('Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    const handleGameClick = (gameLink) => {
        if (gameLink) {
            window.open(gameLink, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="w-full h-auto pt-8 bg-[#EDF6F9] min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Games</h1>
                    <p className="text-gray-600">Discover and play amazing games</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Games Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium">{error}</p>
                        </div>
                        <button
                            onClick={fetchGames}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredGames.length === 0 ? (
                    <div className="text-center py-20">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 text-lg">
                            {searchTerm ? `No games found for "${searchTerm}"` : 'No games available'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results count */}
                        <div className="mb-4 text-gray-600">
                            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
                        </div>

                        {/* Games Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8">
                            {filteredGames.map((game) => (
                                <div
                                    key={game.id}
                                    onClick={() => handleGameClick(game.game_link)}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                                >
                                    {/* Game Image */}
                                    <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                                        {game.game_avatar_url ? (
                                            <img
                                                src={game.game_avatar_url}
                                                alt={game.game_name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                onError={(e) => {
                                                    // Prevent infinite loop by removing the src and hiding the image
                                                    e.target.onerror = null;
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-20 h-20 text-white opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                                </svg>
                                            </div>
                                        )}
                                        {/* Play overlay */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                            <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Game Info */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                                            {game.game_name}
                                        </h3>
                                        
                                        {game.game_description && (
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {game.game_description}
                                            </p>
                                        )}

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>{game.players || 0} players</span>
                                            </div>
                                            {game.active_players > 0 && (
                                                <div className="flex items-center gap-1 text-green-600">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                                    <span>{game.active_players} online</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Play Button */}
                                        <button className="w-full mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                            Play Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Games;
