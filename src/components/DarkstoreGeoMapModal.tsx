import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Layers,
  Radio,
  Sliders
} from 'lucide-react';
import { CityOption, PlatformId } from '../types';
import { DarkstoreHub, getDarkstoresForCity, ALL_DARKSTORE_HUBS } from '../data/darkstoreLocations';
import { CITIES, PLATFORMS } from '../data/mockGroceryData';
import { getDirectStoreBuyUrl } from '../utils/storeLinks';

interface DarkstoreGeoMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: CityOption;
  onSelectCity: (city: CityOption) => void;
}

export const DarkstoreGeoMapModal: React.FC<DarkstoreGeoMapModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  const [maxRadiusKm, setMaxRadiusKm] = useState<number>(3.0);
  const [selectedHub, setSelectedHub] = useState<DarkstoreHub | null>(null);

  if (!isOpen) return null;

  const currentHubs = getDarkstoresForCity(selectedCity.id);
  const filteredHubs = currentHubs.filter((h) => h.distanceKm <= maxRadiusKm);
  const activeSelected = selectedHub || filteredHubs[0] || currentHubs[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <Compass className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Hyperlocal Geospatial Darkstore Radar
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  <Radio className="w-3 h-3 animate-ping" /> Live Dispatch Network
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Visualizing physical fulfillment hubs powering 8-minute grocery deliveries in your sector
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* City Switcher & Radius Bar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          {/* City selector pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mr-1 hidden sm:inline">
              Metros:
            </span>
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelectCity(c);
                  setSelectedHub(null);
                }}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer text-xs whitespace-nowrap ${
                  selectedCity.id === c.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
            <span className="font-bold text-slate-600 text-[11px]">Radius:</span>
            <button
              onClick={() => setMaxRadiusKm(1.2)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${maxRadiusKm === 1.2 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              1.2 km
            </button>
            <button
              onClick={() => setMaxRadiusKm(2.0)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${maxRadiusKm === 2.0 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              2.0 km
            </button>
            <button
              onClick={() => setMaxRadiusKm(3.5)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold ${maxRadiusKm === 3.5 ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All Hubs
            </button>
          </div>
        </div>

        {/* Interactive Map Canvas & Details Split View */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
          
          {/* Left / Center: Interactive SVG Geospatial Map Canvas */}
          <div className="lg:col-span-8 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden select-none">
            {/* Map Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40" />

            {/* SVG Radar Compass */}
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] flex items-center justify-center">
              
              {/* Concentric Range Rings */}
              <div className="absolute w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] rounded-full border border-emerald-500/30" />
              <div className="absolute w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-full border border-emerald-500/20 border-dashed" />
              <div className="absolute w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full border border-emerald-500/15" />
              <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-emerald-500/10" />

              {/* Sonar sweep animation */}
              <div className="absolute w-full h-full rounded-full border border-emerald-400/30 animate-ping opacity-20 pointer-events-none" />

              {/* Range labels */}
              <span className="absolute top-[18%] left-[51%] text-[9px] font-mono text-emerald-500/60 font-bold">1.0 km</span>
              <span className="absolute top-[6%] left-[51%] text-[9px] font-mono text-emerald-500/40 font-bold">2.0 km</span>

              {/* Center User Location Pin */}
              <div className="z-20 relative flex flex-col items-center">
                <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-lg shadow-emerald-500/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                </div>
                <div className="mt-1 px-2 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-black tracking-wide shadow-md whitespace-nowrap">
                  📍 YOUR LOCATION ({selectedCity.pincode})
                </div>
              </div>

              {/* Surrounding Darkstore Pins positioned dynamically */}
              {filteredHubs.map((hub, idx) => {
                // Calculate radial positions relative to center
                const angle = (idx / filteredHubs.length) * 2 * Math.PI - Math.PI / 2;
                const radiusPx = 60 + (hub.distanceKm / 3.0) * 110;
                const x = Math.cos(angle) * radiusPx;
                const y = Math.sin(angle) * radiusPx;
                const isSelected = activeSelected?.id === hub.id;

                const platformBadgeColors: Record<PlatformId, string> = {
                  zepto: 'bg-pink-600 border-pink-400',
                  blinkit: 'bg-amber-500 border-amber-300',
                  instamart: 'bg-orange-500 border-orange-300',
                  bigbasket: 'bg-emerald-600 border-emerald-400',
                  flipkart: 'bg-blue-600 border-blue-400',
                  amazon: 'bg-sky-700 border-sky-400',
                };

                return (
                  <button
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    className={`absolute z-20 flex flex-col items-center transition-all cursor-pointer group hover:scale-110 ${
                      isSelected ? 'scale-115' : 'opacity-90'
                    }`}
                  >
                    {/* Pulse ring if selected */}
                    {isSelected && (
                      <span className="absolute -inset-1.5 rounded-full bg-white/30 animate-ping" />
                    )}

                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shadow-xl border-2 transition-all ${
                        platformBadgeColors[hub.platform] || 'bg-slate-800'
                      } ${isSelected ? 'ring-4 ring-white shadow-emerald-400/50 scale-110' : ''}`}
                    >
                      <span>{PLATFORMS[hub.platform]?.logo || '⚡'}</span>
                    </div>

                    <div className={`mt-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold whitespace-nowrap transition-all shadow-md ${
                      isSelected
                        ? 'bg-white text-slate-950 font-black scale-105'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-700 group-hover:bg-slate-800'
                    }`}>
                      {hub.name.split(' ')[0]} ({hub.distanceKm}km)
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Radar status footer */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {filteredHubs.length} Darkstores in Range ({maxRadiusKm} km)
              </span>
              <span className="hidden sm:inline">Coverage: {selectedCity.name} Urban Sector</span>
            </div>
          </div>

          {/* Right: Selected Darkstore Hub Diagnostic Card */}
          <div className="lg:col-span-4 bg-white p-5 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto">
            {activeSelected ? (
              <div className="space-y-4">
                {/* Hub Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      Fulfillment Hub Diagnostic
                    </span>
                    <span className="text-[10px] font-mono font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {activeSelected.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{PLATFORMS[activeSelected.platform]?.logo}</span>
                    <div>
                      <h3 className="text-base font-black text-slate-900 leading-tight">
                        {activeSelected.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {activeSelected.area}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                    ⚡ {activeSelected.etaMins} Mins Delivery
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                    📍 {activeSelected.distanceKm} km Away
                  </span>
                  {activeSelected.surgeFee > 0 ? (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-amber-200 text-amber-950 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> +₹{activeSelected.surgeFee} Surge
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                      ₹0 Surge Free
                    </span>
                  )}
                </div>

                {/* Hub Metrics Matrix */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Physical Address:</span>
                    <span className="font-bold text-slate-900 text-right max-w-[160px] truncate" title={activeSelected.address}>
                      {activeSelected.address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Dispatch Velocity:</span>
                    <span className="font-bold text-slate-900">{activeSelected.dispatchTimeSec} seconds avg</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Active Delivery Fleet:</span>
                    <span className="font-bold text-emerald-700">{activeSelected.activeRiders} riders on road</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Catalog In-Stock Level:</span>
                    <span className="font-bold text-emerald-700">{activeSelected.inStockPercent}% available</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Handling Fee:</span>
                    <span className="font-bold text-slate-900">₹{activeSelected.handlingFee}</span>
                  </div>
                </div>

                {/* Store Links CTA */}
                <a
                  href={getDirectStoreBuyUrl(activeSelected.platform, 'Fresh Milk')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Open {PLATFORMS[activeSelected.platform]?.name} Store</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p>Select a darkstore hub on the radar map to inspect its telemetry.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center">
              Autonomous Darkstore Geospatial Mapping • Verified Pincode Boundaries
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">NestBasket Geospatial Engine • Founder: Gopagani Arun</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Radar Map
          </button>
        </div>

      </div>
    </div>
  );
};
