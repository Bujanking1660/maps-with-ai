import React from "react";
import { LocateFixed, Layers, Compass } from "lucide-react";

export default function SideButtons({
  isDark,
  setIsDark,
  routeInfo,
  myLoc,
  mapRef,
}) {
  // Common button classes imitating Google maps floating actions
  const btnClass = `w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all active:scale-90 group ${
    isDark
      ? "glass-dark text-white hover:bg-white/10"
      : "glass text-gray-700 hover:bg-blue-50"
  }`;

  return (
    <div
      className="absolute right-4 md:right-6 bottom-24 md:bottom-8 z-[3000] flex flex-col gap-4 transition-all duration-500 ease-in-out"
      style={{ transform: `translateY(${routeInfo ? -320 : -20}px)` }}
    >
      {/* Map Control Group */}
      <div className="flex flex-col gap-2 p-1.5 glass-dark dark:bg-black/20 rounded-[2rem]">
        <button
          onClick={() => setIsDark(!isDark)}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-90"
          title="Ubah Tema"
        >
          <Layers
            size={22}
            className={isDark ? "text-blue-400" : "text-blue-600"}
          />
        </button>

        <div className="w-8 h-[1px] bg-white/10 mx-auto" />

        <button className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/10 active:scale-90">
          <Compass
            size={22}
            className="text-gray-400 group-hover:text-blue-400 transition-colors"
          />
        </button>
      </div>

      {/* Locate Me Button - Independent */}
      <button
        onClick={() =>
          myLoc && mapRef.current?.flyTo([myLoc.lat, myLoc.lng], 18)
        }
        className={`${btnClass} !rounded-full border-blue-500/20`}
      >
        <LocateFixed
          size={24}
          className={isDark ? "text-blue-400" : "text-blue-600"}
        />
      </button>
    </div>
  );
}
