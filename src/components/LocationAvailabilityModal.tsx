import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Building2,
  AlertCircle,
  HelpCircle,
  Check,
  Compass
} from 'lucide-react';
import { CityOption, PlatformId } from '../types';
import { CITIES } from '../data/mockGroceryData';

interface LocationAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption, area?: string) => void;
  onOpenHelp?: () => void;
  onOpenGeoMap?: () => void;
}

export const LocationAvailabilityModal: React.FC<LocationAvailabilityModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  onOpenHelp,
  onOpenGeoMap,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>(() => {
    return localStorage.getItem('nestbasket_selected_area') || selectedCity.popularAreas[0] || 'Ameerpet (Founder Hub)';
  });

  if (!isOpen) return null;

  // Haversine distance formula to match live GPS lat/lon to nearest Indian city
  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDetectLiveLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser. Please select your city below.');
      return;
    }

    setIsDetectingGps(true);
    setGpsMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = position.coords;

        // Find closest city in our network
        let closestCity = CITIES[0];
        let minDistance = Infinity;

        CITIES.forEach((city) => {
          if (city.lat && city.lon) {
            const dist = calculateDistanceKm(latitude, longitude, city.lat, city.lon);
            if (dist < minDistance) {
              minDistance = dist;
              closestCity = city;
            }
          }
        });

        // Default area based on detected city
        const detectedArea = closestCity.popularAreas[0];
        setSelectedArea(detectedArea);
        onSelectCity(closestCity, detectedArea);

        localStorage.setItem('nestbasket_selected_city', closestCity.id);
        localStorage.setItem('nestbasket_selected_area', detectedArea);

        setGpsMessage(
          `✓ Live GPS Detected: ${closestCity.name}, ${closestCity.state} (~${Math.round(minDistance)} km away). Nearest Hub: ${detectedArea}`
        );
      },
      (error) => {
        setIsDetectingGps(false);
        console.warn('Geolocation error:', error);
        // Fallback default: If in Hyderabad or error, suggest Hyderabad
        setGpsMessage('Location access was denied or unavailable. You can click any city below to set your location.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handlePickCity = (city: CityOption, area?: string) => {
    const chosenArea = area || city.popularAreas[0];
    setSelectedArea(chosenArea);
    onSelectCity(city, chosenArea);
    localStorage.setItem('nestbasket_selected_city', city.id);
    localStorage.setItem('nestbasket_selected_area', chosenArea);
    setGpsMessage(`✓ Location switched to ${city.name} (${chosenArea})!`);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Filter cities / areas by search query
  const filteredCities = CITIES.filter((city) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      city.name.toLowerCase().includes(query) ||
      city.state.toLowerCase().includes(query) ||
      city.pincode.includes(query) ||
      city.popularAreas.some((a) => a.toLowerCase().includes(query))
    );
  });

  // Service availability specs for darkstores based on city
  const getStoreAvailability = (cityId: string) => {
    if (cityId === 'sur') {
      return [
        { store: 'Blinkit', status: 'Active', time: '15-20 min', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
        { store: 'Swiggy Instamart', status: 'Active', time: '18-25 min', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
        { store: 'BigBasket Now', status: 'Available Next-Day', time: 'Morning Slot', color: 'text-amber-400', badge: 'bg-amber-500/20 border-amber-500/30' },
        { store: 'Zepto', status: 'Launching Soon', time: 'Expansion Hub', color: 'text-slate-400', badge: 'bg-slate-800 border-slate-700' },
      ];
    }

    return [
      { store: 'Zepto', status: 'Live (10-min Darkstore)', time: '8-11 mins', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
      { store: 'Blinkit', status: 'Live (Zomato Darkstore)', time: '9-12 mins', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
      { store: 'Swiggy Instamart', status: 'Live (Express Hub)', time: '11-15 mins', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
      { store: 'BigBasket Now', status: 'Live (Tata Neu Hub)', time: '15-20 mins', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
      { store: 'Flipkart Minutes', status: 'Live (Select Pincodes)', time: '10-15 mins', color: 'text-emerald-400', badge: 'bg-emerald-500/20 border-emerald-500/30' },
    ];
  };

  const storeServices = getStoreAvailability(selectedCity.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-3xl p-6 text-white shadow-2xl space-y-5">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-md">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-lg sm:text-xl text-white flex items-center gap-2">
                  <span>Change Location & Service Radar</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-black">
                    Live GPS
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detect your current city or select where you want to compare quick-commerce prices.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Live GPS Detection Button */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-800 to-teal-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs">
              <Navigation className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-extrabold text-white text-sm">Auto-Detect My Live Location</div>
                <div className="text-slate-300 text-[11px]">
                  Uses your device GPS to detect Hyderabad, Bengaluru, or nearest darkstore hub.
                </div>
              </div>
            </div>
            <button
              type="button"
              disabled={isDetectingGps}
              onClick={handleDetectLiveLocation}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
            >
              {isDetectingGps ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Detecting GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>📍 Use Live GPS Location</span>
                </>
              )}
            </button>
          </div>

          {/* GPS Feedback Message */}
          {gpsMessage && (
            <div className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
              gpsMessage.startsWith('✓')
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/70 border-amber-500/50 text-amber-300'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{gpsMessage}</span>
            </div>
          )}

          {/* Quick Trigger: Hyperlocal Geospatial Darkstore Map */}
          {onOpenGeoMap && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGeoMap();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white border border-blue-500/40 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>🗺️ View Hyperlocal Darkstore Radar Map ({selectedCity.name})</span>
            </button>
          )}

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by City, Area (Ameerpet, Hitec City, Bandra) or Pincode (500081)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Active Location & Service Availability Status Card */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-2.5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Selected Location</span>
                <div className="text-white font-extrabold text-base flex items-center gap-2">
                  <span>{selectedCity.name}, {selectedCity.state}</span>
                  <span className="text-emerald-400 font-mono text-xs">({selectedCity.pincode})</span>
                </div>
                <div className="text-xs text-emerald-300 font-medium mt-0.5">
                  Hub: <strong>{selectedArea}</strong>
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1.5 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Active Delivery Darkstores</span>
              </div>
            </div>

            {/* Store Delivery Matrix */}
            <div>
              <div className="text-[11px] font-bold text-slate-300 mb-2">Available Delivery Services in this Area:</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {storeServices.map((srv) => (
                  <div key={srv.store} className={`p-2.5 rounded-xl border ${srv.badge} space-y-1`}>
                    <div className="text-xs font-black text-white">{srv.store}</div>
                    <div className="text-[10px] font-semibold text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{srv.time}</span>
                    </div>
                    <div className={`text-[9.5px] font-bold ${srv.color}`}>{srv.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Select Cities & Popular Areas */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-300">
              Select City & Delivery Hub ({filteredCities.length} Locations Available):
            </div>
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {filteredCities.map((city) => {
                const isCityActive = selectedCity.id === city.id;
                return (
                  <div
                    key={city.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isCityActive
                        ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-4 h-4 ${isCityActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <span className="font-extrabold text-sm text-white">{city.name}</span>
                        <span className="text-xs text-slate-400 font-medium">({city.state} • {city.pincode})</span>
                        {city.id === 'hyd' && (
                          <span className="text-[9.5px] font-black bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            FOUNDER HUB
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePickCity(city)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isCityActive
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {isCityActive ? 'Active ✓' : 'Select City'}
                      </button>
                    </div>

                    {/* Sub-areas / Delivery Hubs */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {city.popularAreas.map((area) => {
                        const isAreaActive = isCityActive && selectedArea === area;
                        return (
                          <button
                            key={area}
                            type="button"
                            onClick={() => handlePickCity(city, area)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                              isAreaActive
                                ? 'bg-emerald-500/30 border-emerald-400 text-emerald-300 font-bold'
                                : 'bg-slate-900/60 border-slate-750 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {isAreaActive ? '✓ ' : ''}{area}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outside Area Notice & Store Request Link */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Don't see your specific locality or darkstore?</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHelp?.();
              }}
              className="text-amber-400 hover:underline font-bold text-xs cursor-pointer"
            >
              Request Service on Founder Help Desk →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};