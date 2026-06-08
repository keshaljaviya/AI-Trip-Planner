import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { fetchSavedTrips, deleteTrip } from '../services/api';

const MyTrips = ({ onSelectTrip }) => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrips();
    }, []);

    const loadTrips = async () => {
        setLoading(true);
        try {
            const data = await fetchSavedTrips();
            // Data in DB has slightly different structure: { source, destinations, days, styles, budget, tripData }
            // App expect: { tripData, userSelection, id }
            const formattedTrips = data.map(t => ({
                id: t._id,
                tripData: t.tripData,
                userSelection: {
                    source: t.source,
                    destinations: t.destinations,
                    days: t.days,
                    styles: t.styles,
                    budget: t.budget
                }
            }));
            setTrips(formattedTrips);
        } catch (error) {
            console.error("Failed to fetch trips", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this trip?')) return;

        try {
            await deleteTrip(id);
            setTrips(trips.filter(t => t.id !== id));
        } catch (error) {
            console.error("Failed to delete trip", error);
            alert("Failed to delete trip");
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 p-6 rounded-full mb-6">
                    <MapPin size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Trips Yet</h2>
                <p className="text-gray-500 max-w-md">
                    Your generated itineraries will appear here. Start planning your next adventure!
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 px-4">My Saved Trips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        onClick={() => onSelectTrip(trip)}
                        className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 overflow-hidden group"
                    >
                        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10 scale-150 rotate-12"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>

                            <button
                                onClick={(e) => handleDelete(e, trip.id)}
                                className="absolute top-3 right-3 p-2 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-colors z-10"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-bold text-xl truncate max-w-[250px]">
                                    {trip?.userSelection?.destinations?.join(', ') || 'Unknown Destination'}
                                </h3>
                                <p className="text-blue-100 text-sm flex items-center gap-1">
                                    <MapPin size={12} /> From {trip?.userSelection?.source || 'Start'}
                                </p>
                            </div>
                        </div>

                        <div className="p-5 space-y-4">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                    <Calendar size={14} className="text-blue-500" />
                                    <span>{trip?.userSelection?.days} Days</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                                    <DollarSign size={14} className="text-green-500" />
                                    <span>{trip?.userSelection?.budget} Budget</span>
                                </div>
                            </div>

                            {trip?.userSelection?.styles?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                                    {trip.userSelection.styles.slice(0, 3).map((style, idx) => (
                                        <span key={idx} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-md font-medium">
                                            {style}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="pt-2 text-right">
                                <span className="inline-flex items-center gap-1 text-blue-600 font-semibold group-hover:gap-2 transition-all text-sm">
                                    View Itinerary <ArrowRight size={16} />
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyTrips;
