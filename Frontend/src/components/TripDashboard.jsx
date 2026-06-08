import React, { useState, useEffect } from 'react';
import { fetchAttractions, saveTrip } from '../services/api';
import { MapPin, Sun, Moon, Utensils, Hotel, Car, Star, Plane, Train, Bus, Clock, DollarSign, Bookmark, CheckCircle2 } from 'lucide-react';

const StayCard = ({ stay }) => (
    <div className="bg-white p-5 border border-purple-100 rounded-xl hover:shadow-lg transition-all flex flex-col min-h-[160px] group">
        <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start gap-3 mb-2">
                <h4 className="font-bold text-gray-800 leading-tight group-hover:text-purple-600 transition-colors uppercase tracking-tight truncate flex-1" title={stay.name}>
                    {stay.name}
                </h4>
                <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm shrink-0">
                    <Star size={14} fill="currentColor" /> {stay.rating || 'N/A'}
                </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-medium line-clamp-2">
                {stay.type} • {stay.address}
            </p>
        </div>
        <div className="pt-3 border-t border-purple-50 mt-auto flex justify-between items-center gap-4">
            <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-lg text-[9px] font-black whitespace-nowrap">
                ₹{stay.price_range?.toString().replace(/[₹$,]/g, '')}
            </span>
            <button className="text-purple-600 font-black text-[10px] hover:underline uppercase tracking-widest shrink-0">
                Details
            </button>
        </div>
    </div>
);

const TravelCard = ({ option }) => (
    <div className="bg-white p-5 border border-blue-100 rounded-xl hover:shadow-lg transition-all flex flex-col min-h-[160px] group">
        <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start gap-3 mb-2">
                <h4 className="font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate flex-1" title={option.route}>
                    {option.route}
                </h4>
                <span className="bg-blue-600 text-white text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full shrink-0">
                    {option.type}
                </span>
            </div>
            <p className="text-[11px] text-gray-500 mb-4 font-medium leading-relaxed line-clamp-2">
                {option.details}
            </p>
        </div>
        <div className="pt-3 border-t border-blue-50 mt-auto flex justify-between items-end gap-2">
            <div className="flex flex-col">
                <span className="text-green-600 font-black text-[11px] flex items-center leading-none">
                    ₹{(option.price_range || option.average_price)?.toString().replace(/[₹$,]/g, '')}
                </span>
                <span className="text-[9px] text-blue-400 font-bold flex items-center gap-1 mt-1">
                    <Clock size={10} />{option.travel_duration}
                </span>
            </div>
            <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                Book
            </button>
        </div>
    </div>
);

const TripDashboard = ({ tripData, userSelection, isLoggedIn }) => {
    const [attractions, setAttractions] = useState([]);
    const [loadingAttractions, setLoadingAttractions] = useState(false);
    const [showTravelOptions, setShowTravelOptions] = useState(false);
    const [showStayOptions, setShowStayOptions] = useState(false);
    const [activeStayCity, setActiveStayCity] = useState('');
    const [activeTravelRoute, setActiveTravelRoute] = useState('');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // List of unique cities in the itinerary
    const cities = Array.from(new Set(tripData?.itinerary?.map(day => day.city) || []));

    useEffect(() => {
        if (cities.length > 0) {
            loadAttractions(cities[0]); // Load for first city by default
            setActiveStayCity(cities[0]); // Default stay city
        }
        if (tripData?.travel_options?.length > 0) {
            setActiveTravelRoute(tripData.travel_options[0].route); // Default travel route
        }
    }, [tripData]);

    const loadAttractions = async (city) => {
        setLoadingAttractions(true);
        try {
            const data = await fetchAttractions(city);
            setAttractions(data.attractions || []);
        } catch (error) {
            console.error("Failed to load attractions", error);
        } finally {
            setLoadingAttractions(false);
        }
    };

    const handleSaveTrip = async () => {
        if (!isLoggedIn) return;
        setSaving(true);
        try {
            await saveTrip({
                ...userSelection,
                tripData
            });
            setSaved(true);
        } catch (error) {
            console.error("Failed to save trip", error);
            alert("Failed to save trip. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const renderActivity = (activity, title, icon, colorClass, borderClass, bgClass) => {
        if (!activity) return null;

        const isOldFormat = typeof activity === 'string';

        return (
            <div className={`relative pl-6 border-l-2 ${borderClass} pb-6 last:pb-0`}>
                <div className={`absolute -left-[9px] top-0 ${bgClass} ${colorClass} rounded-full p-1`}>
                    {icon}
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{title}</h4>

                {isOldFormat ? (
                    <p className="text-gray-600 font-medium">{activity}</p>
                ) : (
                    <>
                        <div className="flex justify-between items-start">
                            <p className="text-gray-700 font-bold text-md">{activity.place}</p>
                            {activity.ticket_price && activity.ticket_price !== "Free" && (
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full whitespace-nowrap">
                                    ₹{activity.ticket_price.toString().replace(/[₹$,]/g, '')}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{activity.details}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-400 font-medium">
                            <span className="flex items-center gap-1"><Clock size={12} /> {activity.time}</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    if (!tripData || !tripData.itinerary) {
        return <div className="text-center p-10 text-gray-500">No itinerary data available.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <header className="mb-10 text-center relative">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        Your Travel Journey
                    </h1>

                    {isLoggedIn && !saved && (
                        <button
                            onClick={handleSaveTrip}
                            disabled={saving}
                            className="mb-6 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-bold shadow-sm hover:shadow-md hover:border-blue-200 hover:text-blue-600 transition-all active:scale-95"
                        >
                            <Bookmark size={16} /> {saving ? 'Saving...' : 'Save to My Trips'}
                        </button>
                    )}

                    {saved && (
                        <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-full text-sm font-bold border border-green-100 animate-bounce">
                            <CheckCircle2 size={16} /> Saved Successfully
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-600 text-lg font-medium flex-wrap">
                    <span>From {tripData.travel_options?.[0]?.route?.split(' to ')[0] || userSelection?.source || 'Source'}</span>
                    {cities.map((city, idx) => (
                        <React.Fragment key={city}>
                            <span className="text-blue-400">→</span>
                            <span className="text-gray-800 font-bold">{city}</span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Travel & Stay Buttons */}
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    <button
                        onClick={() => setShowTravelOptions(!showTravelOptions)}
                        className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${showTravelOptions ? 'bg-blue-700 text-white scale-105' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        <Plane size={20} /> Travel Route
                    </button>
                    <button
                        onClick={() => setShowStayOptions(!showStayOptions)}
                        className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all transform active:scale-95 flex items-center gap-2 ${showStayOptions ? 'bg-purple-700 text-white scale-105' : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                    >
                        <Hotel size={20} /> Accommodation
                    </button>
                </div>
            </header>

            {/* Travel Options Section */}
            {showTravelOptions && (
                <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-blue-50 animate-slideUp">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Plane size={24} /></div>
                            Travel Connections
                        </h2>

                        {tripData.travel_options?.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(tripData.travel_options.map(o => o.route))).map((route, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveTravelRoute(route)}
                                        className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${activeTravelRoute === route
                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-blue-200'
                                            }`}
                                    >
                                        {route}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {tripData.travel_options ? (
                        <div className="animate-fadeIn">
                            <p className="text-xs text-blue-400 font-black uppercase tracking-widest mb-4">
                                Route Details
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {tripData.travel_options
                                    .filter(option => option.route === activeTravelRoute || tripData.travel_options.length === 1)
                                    .map((option, idx) => (
                                        <TravelCard key={idx} option={option} />
                                    ))
                                }
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-center py-4">No travel route details found.</div>
                    )}
                </div>
            )}

            {/* Stay Options Section */}
            {showStayOptions && (
                <div className="mb-12 bg-white p-8 rounded-2xl shadow-xl border border-purple-50 animate-slideUp">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
                        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Hotel size={24} /></div>
                            Accommodation
                        </h2>

                        {cities.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {cities.map(city => (
                                    <button
                                        key={city}
                                        onClick={() => setActiveStayCity(city)}
                                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeStayCity === city
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                            : 'bg-white text-gray-500 border-gray-100 hover:border-purple-200'
                                            }`}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {tripData.stay_options && tripData.stay_options.length > 0 ? (
                        <div className="animate-fadeIn">
                            {/* Filter based on selected city if multi-city */}
                            {cities.length > 1 ? (
                                <div>
                                    <p className="text-xs text-purple-400 font-black uppercase tracking-widest mb-4">
                                        Found in {activeStayCity}
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tripData.stay_options
                                            .filter(s =>
                                                s.city?.toLowerCase().includes(activeStayCity.toLowerCase()) ||
                                                activeStayCity.toLowerCase().includes(s.city?.toLowerCase())
                                            )
                                            .map((stay, idx) => (
                                                <StayCard key={idx} stay={stay} />
                                            ))
                                        }
                                        {tripData.stay_options.filter(s =>
                                            s.city?.toLowerCase().includes(activeStayCity.toLowerCase()) ||
                                            activeStayCity.toLowerCase().includes(s.city?.toLowerCase())
                                        ).length === 0 && (
                                                <div className="col-span-full py-10 text-center text-gray-400 italic">
                                                    No specific stays found for {activeStayCity} in this trip plan.
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {tripData.stay_options.map((stay, idx) => (
                                        <StayCard key={idx} stay={stay} />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-gray-500 italic text-center py-4">No accommodation recommendations found.</div>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Full Itinerary Flow */}
                <div className="lg:col-span-2 space-y-10">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                        <Clock className="text-blue-500" /> Complete Trip Timeline
                    </h2>
                    {tripData.itinerary.map((day, index) => {
                        const isNewCity = index === 0 || day.city !== tripData.itinerary[index - 1].city;
                        return (
                            <div key={day.day} className="relative">
                                {isNewCity && (
                                    <div className="mb-6 flex items-center gap-4">
                                        <div className="bg-gray-800 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-md uppercase tracking-wider">
                                            <MapPin size={14} /> {day.city}
                                        </div>
                                        <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                                    </div>
                                )}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-50 overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 p-[2px]">
                                        <div className="bg-white p-5 flex flex-wrap justify-between items-center gap-4">
                                            <div className="flex items-center gap-4">
                                                <span className="bg-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                                                    {day.day}
                                                </span>
                                                <div>
                                                    <h3 className="font-bold text-xl text-gray-800">{day.theme}</h3>
                                                    <p className="text-xs text-blue-500 font-bold flex items-center gap-1 uppercase tracking-widest">
                                                        <MapPin size={10} /> {day.city}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 relative">
                                            {/* Morning & Afternoon column */}
                                            <div className="space-y-8 border-r border-gray-100 pr-6">
                                                {renderActivity(day.morning, "Morning", <Sun size={18} />, "text-yellow-600", "border-yellow-200", "bg-yellow-100")}
                                                {renderActivity(day.afternoon, "Afternoon", <Sun size={18} />, "text-orange-600", "border-orange-200", "bg-orange-100")}
                                            </div>
                                            {/* Evening & Night column */}
                                            <div className="space-y-8">
                                                {renderActivity(day.evening, "Evening", <Moon size={18} />, "text-indigo-600", "border-indigo-200", "bg-indigo-100")}
                                                {renderActivity(day.night, "Night", <Star size={18} />, "text-purple-600", "border-purple-200", "bg-purple-100")}
                                            </div>
                                        </div>

                                        {/* Food Recommendations */}
                                        {(day.best_food_locations || day.must_try_food) && (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                                                    <h4 className="font-extrabold text-emerald-800 flex items-center gap-2 mb-3 text-lg">
                                                        <Utensils size={22} className="text-emerald-600" /> Culinary Recommendations
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {day.best_food_locations && (
                                                            <div className="flex gap-3">
                                                                <div className="bg-emerald-200/50 p-2 rounded-lg h-fit self-start"><MapPin size={16} className="text-emerald-700" /></div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-black text-emerald-600 tracking-tighter">Recommended Areas</p>
                                                                    <p className="text-emerald-900 text-sm leading-relaxed">{day.best_food_locations}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {day.must_try_food && (
                                                            <div className="flex gap-3">
                                                                <div className="bg-emerald-200/50 p-2 rounded-lg h-fit self-start"><Utensils size={16} className="text-emerald-700" /></div>
                                                                <div>
                                                                    <p className="text-[10px] uppercase font-black text-emerald-600 tracking-tighter">Must Try Local Food</p>
                                                                    <p className="text-emerald-900 text-sm leading-relaxed font-bold">{day.must_try_food}</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar: Explore Attractions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-24">
                        <h3 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-3">
                            <MapPin className="text-red-500" size={28} />
                            Explore Locally
                        </h3>

                        {/* City switcher for attractions */}
                        {cities.length > 1 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {cities.map(city => (
                                    <button
                                        key={city}
                                        onClick={() => loadAttractions(city)}
                                        className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-gray-100 hover:border-red-200 hover:text-red-500 transition-all font-mono"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        )}

                        {loadingAttractions ? (
                            <div className="space-y-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="animate-pulse flex gap-4">
                                        <div className="bg-gray-100 w-20 h-20 rounded-xl"></div>
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                                {attractions.length > 0 ? attractions.map((place) => (
                                    <div key={place.xid} className="group p-4 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-red-50">
                                        <h4 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors uppercase tracking-tight text-sm">{place.name}</h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg shadow-sm border text-[10px] font-bold text-yellow-600">
                                                ⭐ {place.rate}
                                            </span>
                                            {place.kinds && (
                                                <span className="truncate max-w-[120px] bg-red-50 text-red-500 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-tighter">
                                                    {place.kinds.split(',')[0].replace(/_/g, ' ')}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-400 text-sm italic">No special landmarks found for this area.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="mt-8 pt-6 border-t border-gray-50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">Powered by OpenTripMap</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TripDashboard;
