import { useState, useEffect } from "react";

export function useGeolocation() {
  const [myLoc, setMyLoc] = useState(null);
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) =>
        setMyLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true },
    );

    const handleOrientation = (e) => {
      const compass = e.webkitCompassHeading || 360 - e.alpha;
      if (compass) setHeading(compass);
    };

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return { myLoc, heading, setMyLoc };
}
