"use client";

import { useState } from "react";
import { Bus, Search, Eye, Plus, Edit2, ListFilter } from "lucide-react";
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
    <div className="relative min-h-screen safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Bus Management
            </h2>
            <p className="text-gray-500 mt-1">
              Total {buses.length} buses registered in the system
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={18} className="mr-2" />
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-gray-900 placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <ListFilter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl outline-none cursor-pointer text-sm font-medium text-gray-900 shadow-sm focus:ring-2 focus:ring-blue-500/50 transition-all min-w-[160px]"
            >
              <option value="All">All Statuses</option>
              <option value="On Route">On Route</option>
              <option value="Idle">Idle</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* Bus Table */}
        <div className="bg-white/80 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Bus Info
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Sync
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBuses.map((bus) => (
                  <tr
                    key={bus.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <Bus size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {bus.number}
                          </p>
                          <p className="text-xs text-gray-500">ID: {bus.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 font-medium">
                        {bus.driver}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {bus.contactNumber || "N/A"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {bus.route}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                          bus.status === "On Route"
                            ? "bg-emerald-100 text-emerald-700"
                            : bus.status === "Idle"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {bus.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500 font-mono">
                        {bus.lastUpdated}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(bus)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            alert(`Viewing details for ${bus.number}`)
                          }
                          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900"
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900"
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900"
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
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900"
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
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {editingBus ? "Update Bus" : "Save Bus"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
