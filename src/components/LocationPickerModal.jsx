import React, { useState, useEffect, useRef } from "react";
 
export default function LocationPickerModal({
  isOpen,
  onClose,
  initialAddress,
  initialCoords,
  onSave
}) {
  const [address, setAddress] = useState(initialAddress || "Cairo, Maadi");
  const [coords, setCoords] = useState(
    initialCoords || { lat: 30.0444, lng: 31.2357 }
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(!!window.L);
  
  const mapContainerId = "leaflet-location-picker-map";
  const mapObjRef = useRef(null);
  const markerObjRef = useRef(null);
 
  // Load Leaflet Assets dynamically
  useEffect(() => {
    if (!isOpen) return;
    if (window.L) {
      setAssetsLoaded(true);
      return;
    }
 
    // Inject Leaflet CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
 
    // Inject Leaflet JS
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => setAssetsLoaded(true);
    document.body.appendChild(script);
 
    return () => {
      // Retain scripts in memory to prevent refetching
    };
  }, [isOpen]);
 
  // Initialize Map
  useEffect(() => {
    if (!isOpen || !assetsLoaded || !document.getElementById(mapContainerId)) return;
 
    // If map already exists, update its view and marker
    if (mapObjRef.current) {
      mapObjRef.current.setView([coords.lat, coords.lng], 14);
      if (markerObjRef.current) {
        markerObjRef.current.setLatLng([coords.lat, coords.lng]);
      }
      return;
    }
 
    // Initialize map
    const map = window.L.map(mapContainerId, {
      zoomControl: false // We will render zoom controls or rely on gestures
    }).setView([coords.lat, coords.lng], 14);
    mapObjRef.current = map;
 
    // Add default zoom control at custom position
    window.L.control.zoom({ position: "bottomright" }).addTo(map);
 
    // Add OpenStreetMap tiles
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
 
    // Custom premium pin icon
    const customIcon = window.L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-primary/25 rounded-full animate-ping"></div>
          <div class="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow-lg relative z-10">
            <span class="material-symbols-outlined text-lg">location_on</span>
          </div>
          <div class="absolute -bottom-1 w-2 h-2 bg-primary rotate-45 border-r border-b border-white z-0"></div>
        </div>
      `,
      className: "custom-leaflet-marker-wrapper",
      iconSize: [40, 40],
      iconAnchor: [20, 36]
    });
 
    // Create marker
    const marker = window.L.marker([coords.lat, coords.lng], {
      icon: customIcon,
      draggable: true
    }).addTo(map);
    markerObjRef.current = marker;
 
    // Handle map click to place marker
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      setCoords({ lat, lng });
      await reverseGeocode(lat, lng);
    });
 
    // Handle marker dragging
    marker.on("dragend", async () => {
      const { lat, lng } = marker.getLatLng();
      setCoords({ lat, lng });
      await reverseGeocode(lat, lng);
    });
 
    return () => {
      if (mapObjRef.current) {
        mapObjRef.current.remove();
        mapObjRef.current = null;
        markerObjRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, assetsLoaded]);
 
  // Sync address if initial values change when opening
  useEffect(() => {
    if (isOpen) {
      if (initialAddress) setAddress(initialAddress);
      if (initialCoords) setCoords(initialCoords);
    }
  }, [isOpen, initialAddress, initialCoords]);
 
  // Reverse Geocoding via OSM Nominatim API
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
      );
      if (res.ok) {
        const data = await res.json();
        const fullAddr = data.display_name || "Cairo, Maadi";
        
        // Clean and shorten address for a concise navbar view (first 3 parts)
        const parts = fullAddr.split(",");
        let shortAddr = parts.slice(0, 3).join(",").trim();
        if (shortAddr.length > 50) {
          shortAddr = shortAddr.substring(0, 47) + "...";
        }
        setAddress(shortAddr);
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };
 
  // Search Address via OSM Nominatim API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&accept-language=en`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const newLat = parseFloat(lat);
          const newLng = parseFloat(lon);
          
          setCoords({ lat: newLat, lng: newLng });
          
          const parts = display_name.split(",");
          const shortAddr = parts.slice(0, 3).join(",").trim();
          setAddress(shortAddr);
 
          if (mapObjRef.current) {
            mapObjRef.current.setView([newLat, newLng], 15);
          }
          if (markerObjRef.current) {
            markerObjRef.current.setLatLng([newLat, newLng]);
          }
        } else {
          alert("Could not find this address. Try refining your search query.");
        }
      }
    } catch (err) {
      console.error("Geocoding search error:", err);
    } finally {
      setSearching(false);
    }
  };
 
  // Detect current location via browser Geolocation API
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lng: longitude });
        
        if (mapObjRef.current) {
          mapObjRef.current.setView([latitude, longitude], 15);
        }
        if (markerObjRef.current) {
          markerObjRef.current.setLatLng([latitude, longitude]);
        }
        await reverseGeocode(latitude, longitude);
        setSearching(false);
      },
      (error) => {
        setSearching(false);
        alert("Unable to fetch location: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  };
 
  const handleSave = () => {
    onSave(address, coords);
    onClose();
  };
 
  if (!isOpen) return null;
 
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
      <div className="bg-surface-container-low max-w-xl w-full rounded-[2.5rem] p-6 md:p-8 border border-outline-variant/10 shadow-2xl flex flex-col relative text-left animate-scale-up">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
 
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-xl text-on-background">Select Location</h3>
            <p className="text-xs text-on-surface-variant">Find deals and customize your delivery area</p>
          </div>
        </div>
 
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search address (e.g. Maadi, Zamalek, New Cairo...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl text-xs font-semibold text-on-surface focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-primary hover:bg-primary-container text-white px-5 rounded-2xl text-xs font-bold transition-all disabled:opacity-60 flex items-center gap-1 active:scale-95 shadow-sm"
          >
            {searching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </form>
 
        {/* Action buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-high rounded-xl text-on-surface hover:bg-surface-container-highest font-bold text-xs transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">my_location</span>
            <span>Use Current Location</span>
          </button>
        </div>
 
        {/* Map Container */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-outline-variant/10 shadow-inner bg-surface-container-highest mb-6">
          {!assetsLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-container-low z-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-bold text-on-surface-variant">Loading Map Assets...</span>
            </div>
          )}
          <div id={mapContainerId} style={{ height: "300px", width: "100%", zIndex: 1 }} />
        </div>
 
        {/* Selected Address Display */}
        <div className="bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/25 mb-6">
          <div className="text-[10px] uppercase font-bold text-secondary tracking-widest mb-1">
            Selected Address
          </div>
          <div className="text-sm font-bold text-on-background line-clamp-2">
            {address}
          </div>
          <div className="text-[10px] text-stone-400 mt-1 font-semibold">
            Coordinates: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        </div>
 
        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-2xl font-headline font-bold text-sm shadow-warm hover:opacity-95 transition-opacity active:scale-[0.98] transition-transform duration-200"
        >
          Confirm and Save Location
        </button>
 
      </div>
    </div>
  );
}
