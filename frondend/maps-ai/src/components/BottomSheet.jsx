import React from "react";
import {
  Clock,
  Navigation2,
  List,
  Car,
  Bike,
  Footprints,
  X,
} from "lucide-react";

export default function BottomSheet({
  routeInfo,
  transportMode,
  setTransportMode,
  isNavigating,
  setIsNavigating,
  isDark,
  clearRoute,
  instructions,
}) {
  const [showSteps, setShowSteps] = React.useState(false);

  return (
    <>
      {routeInfo && (
        <div
          className={`absolute bottom-0 left-0 right-0 z-[4000] rounded-t-[2.5rem] shadow-2xl p-6 pb-10 transition-all duration-500 overflow-hidden ${
            isDark ? "glass-dark text-white" : "glass text-gray-900"
          } ${showSteps ? "h-[85vh] md:h-[60vh]" : "h-auto"}`}
        >
          {/* Drag Handle */}
          <div className="w-14 h-1.5 bg-gray-400/20 rounded-full mx-auto mb-6" />

          {/* Main Content Container */}
          <div className="max-w-3xl mx-auto h-full flex flex-col">
            {/* Header & Info */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-4xl font-bold tracking-tight">
                    <span
                      className={isDark ? "text-blue-400" : "text-blue-600"}
                    >
                      {routeInfo.time}
                    </span>
                    <span className="text-lg font-medium text-gray-500/80 ml-1">
                      mnt
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-3 text-sm font-semibold tracking-wide uppercase opacity-60">
                  <span className="flex items-center gap-1">
                    <Footprints size={14} className="mb-0.5" />
                    {routeInfo.distance} km
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span>ETA {routeInfo.eta}</span>
                </div>
              </div>
              <button
                onClick={clearRoute}
                className="p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-90"
              >
                <X size={28} className="text-gray-400 hover:text-red-400" />
              </button>
            </div>

            {/* Expanded Content: Steps */}
            {showSteps && (
              <div className="flex-1 overflow-hidden flex flex-col mb-6 transition-all duration-300">
                <div className="h-[2px] w-full bg-blue-500/10 mb-6" />
                <h3 className="text-xl font-bold mb-4 px-1">Petunjuk Jalan</h3>
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-hide">
                  <div className="space-y-6 pb-8">
                    {instructions && instructions.length > 0 ? (
                      instructions.map((step, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-500 font-bold text-xs">
                            {i + 1}
                          </div>
                          <div className="flex-1 border-b border-gray-500/10 pb-4">
                            <p className="text-base font-medium opacity-90 leading-relaxed group-hover:opacity-100 italic md:not-italic">
                              {step.text}
                            </p>
                            <p className="text-sm font-bold text-blue-500/70 mt-1">
                              {step.distance} km lagi
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        Memuat instruksi rute...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Transport Modes & Actions */}
            <div className="mt-auto">
              {!showSteps && (
                <div className="flex gap-2 mb-8 glass-dark dark:bg-white/5 p-1 rounded-2xl overflow-hidden">
                  {[
                    { id: "car", icon: <Car size={20} />, label: "Mobil" },
                    {
                      id: "motorcycle",
                      icon: <Bike size={20} />,
                      label: "Motor",
                    },
                    {
                      id: "foot",
                      icon: <Footprints size={20} />,
                      label: "Jalan",
                    },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTransportMode(m.id)}
                      className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all relative rounded-xl ${
                        transportMode === m.id
                          ? isDark
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-blue-600 text-white shadow-lg"
                          : "text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                      {m.icon}
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {m.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setIsNavigating(!isNavigating)}
                  className={`flex-[1.5] flex items-center justify-center gap-3 py-4 md:py-5 rounded-3xl font-bold text-lg shadow-2xl transition-all active:scale-95 ${
                    isNavigating
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30"
                  }`}
                >
                  <Navigation2
                    size={24}
                    className={
                      isNavigating
                        ? "rotate-180 transition-transform"
                        : "fill-current animate-pulse"
                    }
                  />
                  {isNavigating ? "Selesai" : "Mulai Navigasi"}
                </button>
                <button
                  onClick={() => setShowSteps(!showSteps)}
                  className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 md:py-5 rounded-3xl font-bold text-base transition-all active:scale-95 ${
                    isDark
                      ? "glass-dark border-white/5 text-white hover:bg-white/10"
                      : "glass border-black/5 text-gray-800 hover:bg-black/5"
                  }`}
                >
                  {showSteps ? <X size={22} /> : <List size={22} />}
                  {showSteps ? "Tutup" : "Langkah"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
