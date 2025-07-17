import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://dealdish-backend-2025-af7ad0b6a9ae.herokuapp.com";

// Context for user authentication
const AuthContext = React.createContext();

// Auth Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Header Component
const Header = ({ currentView, setCurrentView }) => {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <header className="bg-deal-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold cursor-pointer" onClick={() => setCurrentView('home')}>
              🍽️ DealDish
            </h1>
            <span className="text-green-200 text-sm">Reducing Food Waste</span>
          </div>
          <nav className="flex items-center space-x-6">
            <button
              onClick={() => setCurrentView('home')}
              className={`hover:text-green-200 transition-colors ${currentView === 'home' ? 'text-green-200' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('browse')}
              className={`hover:text-green-200 transition-colors ${currentView === 'browse' ? 'text-green-200' : ''}`}
            >
              Browse Food
            </button>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_type === 'restaurant' && (
                  <button
                    onClick={() => setCurrentView('restaurant-dashboard')}
                    className={`hover:text-green-200 transition-colors ${currentView === 'restaurant-dashboard' ? 'text-green-200' : ''}`}
                  >
                    Dashboard
                  </button>
                )}
                <span className="text-green-200">Hi, {user.name}!</span>
                <button
                  onClick={logout}
                  className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('auth')}
                className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded-lg transition-colors"
              >
                Login / Register
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

// Home Component
const Home = ({ setCurrentView }) => {
  const [analytics, setAnalytics] = useState({ total_waste_saved_kg: 0, total_orders: 0 });
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsResponse, restaurantsResponse] = await Promise.all([
          axios.get(`${BACKEND_URL}/api/analytics/food-waste-saved`),
          axios.get(`${BACKEND_URL}/api/restaurants`)
        ]);
        setAnalytics(analyticsResponse.data);
        setRestaurants(restaurantsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-deal-green to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Save Food, Save Money, Save the Planet
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing deals on delicious restaurant food while helping reduce food waste in Melbourne
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentView('browse')}
              className="bg-white text-deal-green hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Food Deals
            </button>
            <button
              onClick={() => setCurrentView('auth')}
              className="bg-green-700 hover:bg-green-800 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Join as Restaurant
            </button>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-gray-600">Making a difference, one meal at a time</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-green-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-deal-green mb-2">
                {analytics.total_waste_saved_kg}kg
              </div>
              <div className="text-gray-600">Food Waste Saved</div>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {analytics.total_orders}
              </div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-orange-50 p-8 rounded-lg">
              <div className="text-4xl font-bold text-deal-orange mb-2">{restaurants.length}</div>
              <div className="text-gray-600">Partner Restaurants</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How DealDish Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">Find nearby restaurants with discounted food deals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Order</h3>
              <p className="text-gray-600">Quick and easy ordering with secure payment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pickup</h3>
              <p className="text-gray-600">Show your QR code and enjoy your meal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      {restaurants.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Restaurants</h2>
              <p className="text-gray-600">Our partner restaurants reducing food waste</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {restaurants.slice(0, 3).map((restaurant) => (
                <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-deal-green to-green-600 flex items-center justify-center">
                    <span className="text-white text-6xl">🍽️</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{restaurant.cuisine_type} Cuisine</p>
                    <p className="text-gray-700 mb-4">{restaurant.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">{restaurant.rating}</span>
                      </div>
                      <span className="text-sm text-deal-green font-semibold">
                        {restaurant.commission_rate * 100}% Commission
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
