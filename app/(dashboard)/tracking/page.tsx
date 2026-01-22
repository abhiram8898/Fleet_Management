"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Bus, Navigation, MapPin, Gauge, Clock, Search } from "lucide-react";
import busesData from "@/src/data/buses.json";
import routesData from "@/src/data/routes.json";
import { useSearchParams, useRouter } from "next/navigation";

const TrackingMap = dynamic(() => import("@/src/components/TrackingMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center rounded-2xl animate-pulse">
      <div className="text-gray-400 flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Loading Live Map...</p>
      </div>
    </div>
  ),
});

interface Route {
  id: string;
  name: string;
  busId: string;
  stops: { name: string; lat: number; lng: number; time: string }[];
}

const typedRoutesData = routesData as unknown as Route[];

export default function TrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeBusId, setActiveBusId] = useState<string>("BUS-001");
  const onRouteBuses = busesData.filter((b) => b.status === "On Route");

  useEffect(() => {
    const busId = searchParams.get("busId");
    if (
      busId &&
      busesData.find((b) => b.id === busId) &&
      busId !== activeBusId
    ) {
      // eslint-disable-next-line
      setActiveBusId(busId);
    }
  }, [searchParams, activeBusId]);

  const selectedBus = busesData.find((b) => b.id === activeBusId);

  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* Background for page */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-gray-50 dark:bg-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Sidebar List */}
      <div className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80  z-20">
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            Live Tracking
          </h3>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={14}
            />
            <input
              type="text"
              placeholder="Find bus..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {onRouteBuses.map((bus) => (
              <button
                key={bus.id}
                onClick={() => router.push(`/tracking?busId=${bus.id}`)}
                className={`w-full p-3 rounded-xl text-left transition-all border ${
                  activeBusId === bus.id
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={`font-bold text-sm ${
                      activeBusId === bus.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {bus.number}
                  </span>
                  {activeBusId === bus.id && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {bus.driver}
                  </p>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    {bus.route}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bus Info Card */}
        {selectedBus && (
          <div className="p-3 space-y-4 flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-800/20">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1">
              Vehicle Status
            </h4>
            <div className="space-y-3">
              <div className="flex items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3 text-blue-600 dark:text-blue-400">
                  <Gauge size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">
                    Current Speed
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    42 km/h
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg mr-3 text-amber-600 dark:text-amber-400">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">
                    Next Stop
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[140px]">
                    {typedRoutesData.find((r) => r.busId === activeBusId)
                      ?.stops[1].name || "En Route"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3 text-purple-600 dark:text-purple-400">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">
                    ETA
                  </p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    4 mins
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-auto">
              <button
                onClick={() => alert(`Connecting to ${selectedBus.driver}...`)}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:opacity-90 text-xs font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                Contact Driver
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map View */}
      <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 transition-colors">
        <TrackingMap activeBusId={activeBusId} />

        {/* Floating Controls */}
        <div className="absolute top-3 right-4 z-10 flex flex-col space-y-2">
          <button
            onClick={() => alert("Recitering map...")}
            className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <Navigation size={20} />
          </button>
          <button className="p-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg border border-gray-200 dark:border-gray-700">
            <Bus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
