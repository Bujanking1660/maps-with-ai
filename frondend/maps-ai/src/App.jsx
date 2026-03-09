import React, { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

// Hooks & Services
import { useGeolocation } from "./hooks/useGeolocation";
import { analyzeRoute } from "./services/api";

// Components
import FloatingSearchBar from "./components/FloatingSearchBar";
import SideButtons from "./components/SideButtons";
import BottomSheet from "./components/BottomSheet";
import RoutingMachine from "./components/RoutingMachine";

// Perbaikan Icon Default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function App() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [transportMode, setTransportMode] = useState("car");
  const [routeInfo, setRouteInfo] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [instructions, setInstructions] = useState([]);

  const mapRef = useRef();
  const { myLoc, heading } = useGeolocation();

  const clearRoute = useCallback(() => {
    setTarget(null);
    setRouteInfo(null);
    setInstructions([]);
    setUserInput("");
    setIsNavigating(false);
  }, []);

  const handleSearch = useCallback(
    async (queryParam) => {
      const query = typeof queryParam === "string" ? queryParam : userInput;
      if (!query || !myLoc) return;
      setLoading(true);
      setRouteInfo(null); // Reset rute sebelumnya

      try {
        const data = await analyzeRoute(query, myLoc, transportMode);
        if (data && data.coordinates) {
          setTarget(data.coordinates);
        }
      } catch {
        alert(
          "AI Route Engine Sedang Mengalami Kendala. Mohon coba beberapa saat lagi.",
        );
      } finally {
        setLoading(false);
      }
    },
    [userInput, myLoc, transportMode],
  );

  return (
    <div
      className={`h-[100dvh] w-screen relative flex flex-col overflow-hidden transition-colors duration-700 ease-in-out ${
        isDark
          ? "ai-gradient-bg text-white"
          : "ai-gradient-bg-light text-slate-900"
      }`}
    >
      {/* Premium Loading Progress Bar */}
      {loading && (
        <div className="absolute top-0 left-0 right-0 h-1 z-[6000] overflow-hidden bg-blue-100 dark:bg-blue-900/30">
          <div className="h-full w-full bg-blue-600 loading-bar" />
        </div>
      )}

      <FloatingSearchBar
        userInput={userInput}
        setUserInput={setUserInput}
        handleSearch={handleSearch}
        loading={loading}
        isDark={isDark}
        clearRoute={clearRoute}
      />

      <main className="flex-1 w-full h-full relative z-0">
        <MapContainer
          center={[-6.2, 106.8]}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            url={
              isDark
                ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            }
          />

          {myLoc && target && (
            <RoutingMachine
              start={myLoc}
              end={target}
              mode={transportMode}
              isDark={isDark}
              setRouteInfo={setRouteInfo}
              setInstructions={setInstructions}
            />
          )}

          {myLoc && (
            <Marker
              position={[myLoc.lat, myLoc.lng]}
              icon={L.divIcon({
                className: "custom-marker",
                html: `<div style="transform: rotate(${heading}deg); transition: transform 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);">
                        <svg width="48" height="48" viewBox="0 0 100 100" style="filter: drop-shadow(0px 8px 12px rgba(37,99,235,0.4));">
                          <circle cx="50" cy="50" r="30" fill="rgba(37,99,235,0.2)" />
                          <path d="M50 15 L80 85 L50 70 L20 85 Z" fill="#2563eb" stroke="white" stroke-width="5" stroke-linejoin="round"/>
                        </svg>
                      </div>`,
                iconSize: [64, 64],
                iconAnchor: [32, 32],
              })}
            />
          )}
          {target && <Marker position={[target.lat, target.lng]} />}
        </MapContainer>
      </main>

      <SideButtons
        isDark={isDark}
        setIsDark={setIsDark}
        routeInfo={routeInfo}
        myLoc={myLoc}
        mapRef={mapRef}
      />

      <BottomSheet
        routeInfo={routeInfo}
        setRouteInfo={setRouteInfo}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        isNavigating={isNavigating}
        setIsNavigating={setIsNavigating}
        isDark={isDark}
        clearRoute={clearRoute}
        instructions={instructions}
      />
    </div>
  );
}
