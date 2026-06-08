import React from 'react';
import { Plane, Map } from 'lucide-react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative">
                {/* Outer rotating ring */}
                <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

                {/* Inner icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Plane className="text-blue-600 animate-pulse" size={32} />
                </div>
            </div>

            <div className="mt-8 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Generating Your Itinerary</h3>
                <p className="text-gray-500 animate-pulse">Curating the perfect trip for you...</p>
            </div>
        </div>
    );
};

export default Loader;
