"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import routesData from "@/src/data/routes.json";
import studentsData from "@/src/data/students.json";
import teachersData from "@/src/data/teachers.json";
import { useTheme } from "next-themes";

// Define Type for routing data
type RouteCoords = [number, number][];

type Student = {
  id: string;
  name: string;
  busId: string;
  pickup: string;
  drop: string;
};

// Fix for Leaflet icon issues in Next.js
// const busIcon = new L.Icon({ ... }) // Removed in favor of divIcon

const studentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  iconSize: [20, 20],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

const schoolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2602/2602414.png",
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -40],
});

const createBusDivIcon = (number: string, color: string) => {
  return L.divIcon({
    className: "custom-bus-icon",
    html: `
      <div style="position: relative; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png" style="width: 100%; height: 100%;" />
        <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: ${color}; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; border: 2px solid white; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
          ${number}
        </div>
      </div>
    `,
    iconSize: [45, 45],
    iconAnchor: [22, 22],
  });
};

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function TrackingMap({
  activeBusId,
}: {
  activeBusId: string | null;
}) {
  const { theme } = useTheme();
  const [positions, setPositions] = useState<Record<string, number>>({
    "BUS-001": 0,
    "BUS-002": 10, // Offset start
  });
  const [roadPaths, setRoadPaths] = useState<Record<string, RouteCoords>>({
    "BUS-001": [],
    "BUS-002": [],
  });

  useEffect(() => {
    async function fetchRoutes() {
      const buses = ["BUS-001", "BUS-002"];
      const newPaths: Record<string, RouteCoords> = {};

      for (const busId of buses) {
        const route = routesData.find((r) => r.busId === busId);
        if (route) {
          try {
            // OSRM expects coordinates in [lng,lat] format
            const coordsString = route.stops
              .map((stop) => `${stop.lng},${stop.lat}`)
              .join(";");

            const response = await fetch(
              `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`,
            );
            const data = await response.json();

            if (data.routes && data.routes[0]) {
              // Map back to [lat, lng] for Leaflet
              const points = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]],
              );
              newPaths[busId] = points;
            }
          } catch (error) {
            console.error(`Error fetching route for ${busId}:`, error);
          }
        }
      }
      setRoadPaths(newPaths);
    }

    fetchRoutes();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const next: Record<string, number> = {};
        Object.keys(prev).forEach((id) => {
          const path = roadPaths[id];
          if (path && path.length > 0) {
            next[id] = (prev[id] + 1) % path.length;
          } else {
            next[id] = prev[id] || 0;
          }
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [roadPaths]);

  const bus1Pos = roadPaths["BUS-001"]?.[positions["BUS-001"]] || [
    9.987, 76.245,
  ];
  const bus2Pos = roadPaths["BUS-002"]?.[positions["BUS-002"]] || [
    10.015, 76.34,
  ];

  const activePos = activeBusId === "BUS-002" ? bus2Pos : bus1Pos;

  // Dynamic Tile URL based on theme
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <MapContainer
      center={[9.9796, 76.2755]}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      zoomControl={false}
    >
      <TileLayer
        url={tileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />

      <MapRecenter center={activePos} />

      {/* School Marker */}
      <Marker position={[9.9625, 76.2995]} icon={schoolIcon}>
        <Popup>
          <div className="p-2">
            <p className="font-bold text-foreground text-sm">
              Kochi International Academy
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Shared Destination
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Bus 001 Route & Markers */}
      <Polyline
        positions={roadPaths["BUS-001"]}
        color="#6366f1"
        weight={4}
        opacity={0.4}
        dashArray="10, 10"
      />
      {routesData
        .find((r) => r.busId === "BUS-001")
        ?.stops.map((stop, i) => {
          const stopStudents = (studentsData as Student[]).filter(
            (s) =>
              s.busId === "BUS-001" &&
              (s.pickup === stop.name || s.drop === stop.name),
          );
          const stopTeachers = teachersData.filter(
            (t) => t.busId === "BUS-001" && t.stop === stop.name,
          );
          return (
            <div key={i}>
              <Marker position={[stop.lat, stop.lng]} icon={studentIcon}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <p className="font-bold text-foreground text-sm border-b border-border pb-1 mb-4">
                      {stop.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mb-4">
                      Scheduled: {stop.time}
                    </p>

                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                          Students:
                        </p>
                        {stopStudents.length > 0 ? (
                          stopStudents.map((s) => (
                            <p
                              key={s.id}
                              className="text-xs text-foreground flex items-center"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                              {s.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-[10px] italic text-muted-foreground">
                            None
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">
                          Teachers:
                        </p>
                        {stopTeachers.length > 0 ? (
                          stopTeachers.map((t) => (
                            <p
                              key={t.id}
                              className="text-xs text-foreground flex items-center"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                              {t.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-[10px] italic text-muted-foreground">
                            None
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      <Marker position={bus1Pos} icon={createBusDivIcon("B001", "#6366f1")}>
        <Popup className="custom-popup">
          <div className="p-2">
            <p className="font-bold text-foreground text-sm">Bus B001</p>
            <p className="text-xs text-muted-foreground font-medium">
              North Route
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Status: Moving
            </p>
          </div>
        </Popup>
      </Marker>

      {/* Bus 002 Route & Markers */}
      <Polyline
        positions={roadPaths["BUS-002"]}
        color="#a855f7"
        weight={4}
        opacity={0.4}
        dashArray="10, 10"
      />
      {routesData
        .find((r) => r.busId === "BUS-002")
        ?.stops.map((stop, i) => {
          const stopStudents = (studentsData as Student[]).filter(
            (s) =>
              s.busId === "BUS-002" &&
              (s.pickup === stop.name || s.drop === stop.name),
          );
          const stopTeachers = teachersData.filter(
            (t) => t.busId === "BUS-002" && t.stop === stop.name,
          );
          return (
            <div key={i}>
              <Marker position={[stop.lat, stop.lng]} icon={studentIcon}>
                <Popup>
                  <div className="p-2 min-w-[150px]">
                    <p className="font-bold text-foreground text-sm border-b border-border pb-1 mb-4">
                      {stop.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-medium mb-4">
                      Scheduled: {stop.time}
                    </p>

                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
                          Students:
                        </p>
                        {stopStudents.length > 0 ? (
                          stopStudents.map((s) => (
                            <p
                              key={s.id}
                              className="text-xs text-foreground flex items-center"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                              {s.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-[10px] italic text-muted-foreground">
                            None
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">
                          Teachers:
                        </p>
                        {stopTeachers.length > 0 ? (
                          stopTeachers.map((t) => (
                            <p
                              key={t.id}
                              className="text-xs text-foreground flex items-center"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                              {t.name}
                            </p>
                          ))
                        ) : (
                          <p className="text-[10px] italic text-muted-foreground">
                            None
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      <Marker position={bus2Pos} icon={createBusDivIcon("B002", "#a855f7")}>
        <Popup>
          <div className="p-2">
            <p className="font-bold text-foreground text-sm">Bus B002</p>
            <p className="text-xs text-muted-foreground font-medium">
              South Route
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Status: Moving
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
