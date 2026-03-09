import React, { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function RoutingMachine({
  start,
  end,
  mode,
  setRouteInfo,
  setInstructions,
}) {
  const map = useMap();
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!map || !start || !end) return;

    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch {
        // Ignored to handle case where control isn't fully initialized
      }
    }

    routingControlRef.current = L.Routing.control({
      waypoints: [L.latLng(start.lat, start.lng), L.latLng(end.lat, end.lng)],
      router: L.Routing.osrmv1({
        serviceUrl: `https://router.project-osrm.org/route/v1`,
        profile: mode === "foot" ? "foot" : "driving",
      }),
      lineOptions: {
        styles: [
          {
            color:
              mode === "motorcycle"
                ? "#f59e0b"
                : mode === "foot"
                  ? "#10b981"
                  : "#3b82f6",
            weight: 6,
            opacity: 0.8,
          },
        ],
        extendToWaypoints: true,
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      show: false,
    })
      .on("routesfound", (e) => {
        const routes = e.routes[0];
        if (routes) {
          const distanceKm = routes.summary.totalDistance / 1000;
          let finalMinutes;

          // Extract Turn-by-turn instructions
          if (routes.instructions) {
            setInstructions(
              routes.instructions.map((instr) => ({
                text: instr.text,
                distance: (instr.distance / 1000).toFixed(1),
              })),
            );
          }

          // --- ESTIMASI WAKTU LOGIS (INDONESIA URBAN) ---
          if (mode === "foot") {
            finalMinutes = Math.round((distanceKm / 4) * 60);
          } else if (mode === "motorcycle") {
            finalMinutes = Math.round((distanceKm / 20) * 60);
            if (finalMinutes < distanceKm * 2.5)
              finalMinutes = Math.round(distanceKm * 2.5);
          } else {
            finalMinutes = Math.round((distanceKm / 10) * 60);
            if (finalMinutes < distanceKm * 4)
              finalMinutes = Math.round(distanceKm * 4);
          }

          setRouteInfo({
            distance: distanceKm.toFixed(1),
            time: finalMinutes,
            eta: new Date(Date.now() + finalMinutes * 60000).toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" },
            ),
          });

          const bounds = L.latLngBounds(routes.coordinates);
          map.flyToBounds(bounds, { padding: [60, 60], duration: 1.5 });
        }
      })
      .addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
      }
    };
  }, [map, start, end, mode, setRouteInfo, setInstructions]);

  return null;
}
