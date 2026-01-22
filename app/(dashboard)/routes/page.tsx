"use client";

import {
  Route as RouteIcon,
  MapPin,
  Users,
  Bus as BusIcon,
  Plus,
  Trash2,
  Search,
  Edit2,
  Clock,
} from "lucide-react";
import { useState } from "react";
import studentsData from "@/src/data/students.json";
import routesData from "@/src/data/routes.json";
import busesData from "@/src/data/buses.json";
import { useRouter } from "next/navigation";
import Modal from "@/src/components/Modal";

interface Stop {
  name: string;
  time: string;
  lat: number | string;
  lng: number | string;
}

interface Route {
  id: string;
  name: string;
  studentCount: number;
  busId: string;
  stops: Stop[];
}

export default function RoutesPage() {
  const router = useRouter();

  // Calculate dynamic student counts
  const routesWithCounts = (routesData as unknown as Route[]).map((route) => ({
    ...route,
    studentCount: studentsData.filter((s) => s.busId === route.busId).length,
  }));

  const [routes, setRoutes] = useState<Route[]>(routesWithCounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);
  const [routeName, setRouteName] = useState("");
  const [selectedBusId, setSelectedBusId] = useState("");
  const [stops, setStops] = useState<Stop[]>([]);

  // Filter routes based on search
  const filteredRoutes = routes.filter((route) =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const [newStop, setNewStop] = useState({
    name: "",
    time: "",
    lat: "",
    lng: "",
  });

  const handleAddStop = () => {
    if (newStop.name && newStop.time && newStop.lat && newStop.lng) {
      setStops([
        ...stops,
        {
          ...newStop,
          lat: parseFloat(newStop.lat),
          lng: parseFloat(newStop.lng),
        },
      ]);
      setNewStop({ name: "", time: "", lat: "", lng: "" });
    }
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleSaveRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStudentCount = studentsData.filter(
      (s) => s.busId === selectedBusId,
    ).length;

    if (editingRouteId) {
      // Update existing route
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === editingRouteId
            ? {
                ...r,
                name: routeName,
                busId: selectedBusId,
                stops: stops.map((s) => ({
                  ...s,
                  lat: Number(s.lat),
                  lng: Number(s.lng),
                })),
                studentCount:
                  r.busId === selectedBusId
                    ? r.studentCount
                    : currentStudentCount, // Update count if bus changes
              }
            : r,
        ),
      );
      alert(`Route "${routeName}" updated successfully! (Mock Action)`);
    } else {
      // Create new route
      const newRoute = {
        // eslint-disable-next-line
        id: `R${Date.now()}`,
        name: routeName,
        busId: selectedBusId,
        studentCount: currentStudentCount,
        stops: stops.map((s) => ({
          ...s,
          lat: Number(s.lat),
          lng: Number(s.lng),
        })),
      };

      setRoutes([...routes, newRoute]);
      alert(`Route "${routeName}" created successfully! (Mock Action)`);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClick = (route: Route) => {
    setEditingRouteId(route.id);
    setRouteName(route.name);
    setSelectedBusId(route.busId);
    setStops(route.stops);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingRouteId(null);
    setRouteName("");
    setSelectedBusId("");
    setStops([]);
  };

  return (
    <div className="relative min-h-screen safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Routes
            </h2>
            <p className="text-gray-500 mt-1">
              Total {routes.length} active routes
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} className="mr-2" />
            Create New Route
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />
            <input
              type="text"
              placeholder="Search routes..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-gray-900 placeholder:text-gray-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {filteredRoutes.map((route) => (
            <div
              key={route.id}
              className="group bg-white/80 p-3 rounded-2xl border border-gray-200 hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 flex flex-col space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                    <RouteIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {route.name}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1.5">
                      <span className="flex items-center text-xs text-gray-500 font-medium">
                        <Users size={14} className="mr-1.5" />
                        {route.studentCount} Students
                      </span>
                      <span className="flex items-center text-xs text-gray-500 font-medium">
                        <BusIcon size={14} className="mr-1.5" />
                        {busesData.find((b) => b.id === route.busId)?.number ||
                          route.busId}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(route)}
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                >
                  <Edit2 size={18} />
                </button>
              </div>

              <div className="space-y-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex-1">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-1">
                  Stops Sequence
                </h4>
                <div className="relative pl-3 space-y-0">
                  <div className="absolute left-[5.5px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
                  {route.stops.map((stop, index) => (
                    <div
                      key={index}
                      className="relative flex items-center justify-between group/stop pl-6 py-2"
                    >
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border-2 border-indigo-500 shadow-sm z-10 group-hover/stop:scale-125 transition-transform"></div>
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {stop.name}
                        </p>
                      </div>
                      <div className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                        <Clock size={12} className="mr-1" />
                        {stop.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => router.push(`/tracking?busId=${route.busId}`)}
                  className="w-full py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl text-xs hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                >
                  <MapPin size={14} className="mr-1.5" /> View Live Map
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingRouteId ? "Edit Route Details" : "Create New Route"}
        >
          <form onSubmit={handleSaveRoute} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Route Name
              </label>
              <input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900"
                placeholder="e.g. Kakkanad Express"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Assigned Bus
              </label>
              <select
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900"
                required
              >
                <option value="">Select a Bus</option>
                {busesData.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.number} - {bus.driver} ({bus.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Route Stops
                </label>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                  {stops.length} Stops
                </span>
              </div>

              <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                {stops.map((stop, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-100"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {stop.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {stop.time} • ({stop.lat}, {stop.lng})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveStop(idx)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {stops.length === 0 && (
                  <div className="py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 italic">
                      No stops added yet. Add stops below.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Stop Name"
                  value={newStop.name}
                  onChange={(e) =>
                    setNewStop({ ...newStop, name: e.target.value })
                  }
                  className="col-span-2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-indigo-500/50"
                />
                <input
                  type="time"
                  value={newStop.time}
                  onChange={(e) =>
                    setNewStop({ ...newStop, time: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-indigo-500/50"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Lat"
                    value={newStop.lat}
                    onChange={(e) =>
                      setNewStop({ ...newStop, lat: e.target.value })
                    }
                    className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-indigo-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Lng"
                    value={newStop.lng}
                    onChange={(e) =>
                      setNewStop({ ...newStop, lng: e.target.value })
                    }
                    className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddStop}
                disabled={
                  !newStop.name || !newStop.time || !newStop.lat || !newStop.lng
                }
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
              >
                + Add Stop to Sequence
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm active:scale-95 transition-all hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                {editingRouteId ? "Update Route" : "Create Route"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
