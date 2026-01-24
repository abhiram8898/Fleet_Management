"use client";

import { useState } from "react";
import {
  Bus,
  Search,
  Plus,
  Edit2,
  ListFilter,
  MoreVertical,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import busesData from "@/src/data/buses.json";
import routesData from "@/src/data/routes.json";
import Modal from "@/src/components/Modal";

interface Bus {
  id: string;
  number: string;
  driver: string;
  contactNumber: string;
  status: string;
  lastUpdated?: string;
  route?: string;
}

export default function BusesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cast mock data to Bus[]
  const [buses, setBuses] = useState<Bus[]>(busesData as unknown as Bus[]);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [formData, setFormData] = useState({
    number: "",
    driver: "",
    contactNumber: "",
    status: "Idle",
  });

  const filteredBuses = buses
    .map((bus) => {
      // Find assigned route for this bus
      const assignedRoute = routesData.find((r) => r.busId === bus.id);
      return {
        ...bus,
        route: assignedRoute ? assignedRoute.name : "Unassigned", // Override static route
      };
    })
    .filter((bus) => {
      const matchesSearch =
        bus.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bus.driver.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || bus.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

  // Calculate Stats
  const totalBuses = buses.length;
  const onRoute = buses.filter((b) => b.status === "On Route").length;
  const inMaintenance = buses.filter((b) => b.status === "Maintenance").length;

  const handleSaveBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBus) {
      // Update existing bus
      setBuses((prev) =>
        prev.map((b) =>
          b.id === editingBus.id
            ? { ...b, ...formData, lastUpdated: "Just now" }
            : b,
        ),
      );
      alert("Bus updated successfully! (Mock Action)");
    } else {
      // Add new bus
      const newBus = {
        // eslint-disable-next-line
        id: `BUS-${Date.now()}`,
        ...formData,
        route: "Unassigned",
        lastUpdated: "Just now",
      };

      setBuses([...buses, newBus]);
      alert("Bus added successfully! (Mock Action)");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClick = (bus: Bus) => {
    setEditingBus(bus);
    setFormData({
      number: bus.number,
      driver: bus.driver,
      contactNumber: bus.contactNumber || "",
      status: bus.status,
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingBus(null);
    setFormData({
      number: "",
      driver: "",
      contactNumber: "",
      status: "Idle",
    });
  };

  return (
    <div className="relative min-h-screen safe-area-inset-bottom space-y-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Fleet Management
            </h2>
            <p className="text-gray-500 mt-1">
              Monitor and manage your school bus fleet efficiently.
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-primary text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center shadow-lg shadow-primary-soft active:scale-95 transition-all hover:opacity-90"
          >
            <Plus size={20} className="mr-2" />
            Add New Bus
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by bus number or driver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div className="h-8 w-px bg-gray-200 hidden md:block self-center mx-2"></div>
          <div className="relative min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <ListFilter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100 border-none rounded-xl outline-none cursor-pointer text-sm font-medium text-gray-700 transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="On Route">On Route</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Bus Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredBuses.map((bus) => (
            <div
              key={bus.id}
              className="group bg-white p-3 rounded-xl border border-gray-200 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
                    <Bus size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {bus.number}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        bus.status === "On Route"
                          ? "bg-emerald-100 text-emerald-700"
                          : bus.status === "Idle"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(bus)}
                  className="text-gray-300 hover:text-gray-600 transition-colors"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="p-3 bg-gray-100 rounded-xl space-y-2 mb-4 border border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Driver</span>
                  <span className="text-gray-900 font-bold">{bus.driver}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Route</span>
                  <span className="text-gray-900 font-medium truncate max-w-[150px]">
                    {bus.route}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Contact</span>
                  <span className="text-gray-900 font-mono">
                    {bus.contactNumber}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center text-[10px] text-gray-400 font-medium">
                  <Clock size={12} className="mr-1" />
                  Synced {bus.lastUpdated}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEditClick(bus)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => alert(`Removing ${bus.number}`)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBuses.length === 0 && (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No buses found
            </h3>
            <p className="text-gray-500 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBus ? "Edit Bus Details" : "Add New Bus"}
      >
        <form onSubmit={handleSaveBus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Bus Number
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) =>
                setFormData({ ...formData, number: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
              placeholder="e.g. KL-07-AW-1234"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Driver Name
            </label>
            <input
              type="text"
              value={formData.driver}
              onChange={(e) =>
                setFormData({ ...formData, driver: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
              placeholder="Full Name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Driver Contact Number
            </label>
            <input
              type="tel"
              value={formData.contactNumber}
              onChange={(e) =>
                setFormData({ ...formData, contactNumber: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
              placeholder="+91 99999 88888"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Current Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
            >
              <option value="Idle">Idle</option>
              <option value="On Route">On Route</option>
              <option value="Maintenance">Maintenance</option>
            </select>
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
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary-soft active:scale-95 transition-all hover:opacity-90"
            >
              {editingBus ? "Update Bus" : "Save Bus"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
