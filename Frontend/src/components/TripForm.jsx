import React, { useState } from 'react';
import { generateTrip } from '../services/api';
import { MapPin, Calendar, Wallet, Compass } from 'lucide-react';

const TripForm = ({ setLoading, onTripGenerated, loading }) => {
    const [formData, setFormData] = useState({
        source: '',
        destinations: '',
        days: 3,
        budget: 'Medium',
        styles: []
    });
    // Remove local loading state since it's now a prop
    const [error, setError] = useState('');

    const travelStyles = ["Foodie", "Culture", "Relaxing", "Adventure", "Nature", "Business"];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStyleToggle = (style) => {
        setFormData(prev => {
            const styles = prev.styles.includes(style)
                ? prev.styles.filter(s => s !== style)
                : [...prev.styles, style];
            return { ...prev, styles };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.source || !formData.destinations) {
            setError("Please fill in source and destination cities.");
            setLoading(false);
            return;
        }

        try {
            const destinationsArray = formData.destinations.split(',').map(d => d.trim());
            const data = {
                ...formData,
                destinations: destinationsArray
            };

            const result = await generateTrip(data);
            onTripGenerated(result, data); // consistent with App.jsx expectation
        } catch (err) {
            let msg = "Failed to plan trip. Please try again.";
            if (err.code === 'ECONNABORTED') msg = "Request timed out. The AI is taking a bit longer, please try again.";
            if (!err.response && !err.code) msg = "Network error. Please check your connection.";
            setError(err.response?.data?.error || msg);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Plan Your Dream Trip</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Source & Destination */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <MapPin size={18} /> From (City)
                        </label>
                        <input
                            type="text"
                            name="source"
                            value={formData.source}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="e.g., Mumbai"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <MapPin size={18} /> To (City/Cities)
                        </label>
                        <input
                            type="text"
                            name="destinations"
                            value={formData.destinations}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            placeholder="e.g., Delhi, Agra (comma separated)"
                        />
                    </div>
                </div>

                {/* Days & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <Calendar size={18} /> Duration (Days): {formData.days}
                        </label>
                        <input
                            type="range"
                            name="days"
                            min="1"
                            max="15"
                            value={formData.days}
                            onChange={handleInputChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                            <Wallet size={18} /> Budget
                        </label>
                        <select
                            name="budget"
                            value={formData.budget}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </select>
                    </div>
                </div>

                {/* Travel Styles */}
                <div>
                    <label className="block text-gray-700 font-medium mb-3 flex items-center gap-2">
                        <Compass size={18} /> Travel Styles
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {travelStyles.map(style => (
                            <button
                                key={style}
                                type="button"
                                onClick={() => handleStyleToggle(style)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.styles.includes(style)
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-transform transform active:scale-95 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        }`}
                >
                    {loading ? 'Planning your Trip...' : 'Generate Itinerary ✈️'}
                </button>
            </form>
        </div>
    );
};

export default TripForm;
