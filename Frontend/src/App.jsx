import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import TripDashboard from './components/TripDashboard';
import MyTrips from './components/MyTrips';
import Loader from './components/Loader';
import Auth from './components/Auth';
import { Compass, Map, Home, LogOut, User as UserIcon } from 'lucide-react';
import { logout as apiLogout } from './services/api';

function App() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('auth'); // Default to auth now
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('home'); // Go to home if already logged in
    } else {
      setView('auth'); // Otherwise stay on auth
    }
  }, []);

  const handleTripGenerated = (result, formData) => {
    const newTrip = { tripData: result, userSelection: formData, id: Date.now() };
    setTrip(newTrip);
    setLoading(false);
    setView('dashboard');
  };

  const handleSelectTrip = (savedTrip) => {
    setTrip(savedTrip);
    setView('dashboard');
  };

  const goHome = () => {
    if (!user) {
      setView('auth');
      return;
    }
    setTrip(null);
    setView('home');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setView('home');
  };

  const handleLogout = () => {
    apiLogout();
    setUser(null);
    setView('auth'); // Redirect to auth on logout
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      {loading && <Loader />}

      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={goHome}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg text-white font-bold shadow-md">
              AI
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-800 hidden sm:block">Trip Planner</span>
          </div>

          <div className="flex gap-4 text-sm font-medium text-gray-600">
            {user && (
              <>
                <button
                  onClick={goHome}
                  className={`flex items-center gap-1 hover:text-blue-600 transition ${view === 'home' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Home size={18} /> <span className="hidden sm:inline">Home</span>
                </button>
                <button
                  onClick={() => setView('my-trips')}
                  className={`flex items-center gap-1 hover:text-blue-600 transition ${view === 'my-trips' ? 'text-blue-600 font-bold' : ''}`}
                >
                  <Map size={18} /> <span className="hidden sm:inline">My Trips</span>
                </button>
              </>
            )}

            {user ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <UserIcon size={14} /> {user.name.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="p-1 hover:text-red-600 transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setView('auth')}
                className={`flex items-center gap-1 hover:text-blue-600 transition ${view === 'auth' ? 'text-blue-600 font-bold' : ''}`}
              >
                <UserIcon size={18} /> <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {view === 'home' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fadeIn">
            <div className="text-center mb-10 max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 leading-tight">
                Discover Your Next <br /> Adventure
              </h1>
              <p className="text-lg md:text-xl text-gray-600">
                Let AI curate the perfect itinerary for you based on your interests, budget, and time.
              </p>
            </div>
            <TripForm
              setLoading={setLoading}
              loading={loading}
              onTripGenerated={handleTripGenerated}
            />
          </div>
        )}

        {view === 'auth' && (
          <div className="min-h-[60vh] flex items-center justify-center animate-fadeIn">
            <Auth onAuthSuccess={handleAuthSuccess} />
          </div>
        )}

        {view === 'dashboard' && trip && (
          <div className="animate-slideUp">
            <button
              onClick={() => user ? setView('my-trips') : goHome()}
              className="mb-4 text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1"
            >
              ← {user ? 'Back to My Trips' : 'Back to Home'}
            </button>
            <TripDashboard
              key={trip?.id || JSON.stringify(trip)}
              tripData={trip?.tripData || trip}
              userSelection={trip?.userSelection}
              isLoggedIn={!!user}
            />
          </div>
        )}

        {view === 'my-trips' && user && (
          <div className="animate-fadeIn">
            <MyTrips onSelectTrip={handleSelectTrip} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} AI Trip Planner. Built with Gemini & React.
        </div>
      </footer>
    </div>
  );
}

export default App;
