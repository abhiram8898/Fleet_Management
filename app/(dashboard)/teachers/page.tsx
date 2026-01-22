"use client";

import { useState } from "react";
import {
  User,
  Bus,
  MapPin,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Phone,
  Briefcase,
  ListFilter,
} from "lucide-react";
import teachersData from "@/src/data/teachers.json";
import busesData from "@/src/data/buses.json";
import Modal from "@/src/components/Modal";

// Define Teacher Interface
interface Teacher {
  id: string;
  name: string;
  department: string;
  subject: string;
  email: string;
  busId: string;
  stop: string;
  contact: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>(
    teachersData as unknown as Teacher[],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropSameAsPickup, setIsDropSameAsPickup] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    subject: "",
    email: "",
    busId: "BUS-001",
    stop: "",
    contact: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: "",
  });

  const handleSaveTeacher = () => {
    // Logic for "Same as Pickup"
    const pLat = parseFloat(formData.pickupLat) || 0;
    const pLng = parseFloat(formData.pickupLng) || 0;
    const dLat = isDropSameAsPickup ? pLat : parseFloat(formData.dropLat) || 0;
    const dLng = isDropSameAsPickup ? pLng : parseFloat(formData.dropLng) || 0;

    if (editingTeacher) {
      setTeachers((prev) =>
        prev.map((t) =>
          t.id === editingTeacher.id
            ? {
                ...t,
                ...formData,
                pickupLat: pLat,
                pickupLng: pLng,
                dropLat: dLat,
                dropLng: dLng,
              }
            : t,
        ),
      );
      alert("Teacher updated successfully! (Mock Action)");
    } else {
      const newTeacher = {
        // eslint-disable-next-line
        id: `T${Date.now()}`,
        ...formData,
        pickupLat: pLat,
        pickupLng: pLng,
        dropLat: dLat,
        dropLng: dLng,
      };
      setTeachers([...teachers, newTeacher]);
      alert("Teacher added successfully! (Mock Action)");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    const sameLoc =
      teacher.pickupLat === teacher.dropLat &&
      teacher.pickupLng === teacher.dropLng;
    setIsDropSameAsPickup(sameLoc);

    setFormData({
      name: teacher.name,
      department: teacher.department,
      subject: teacher.subject || "",
      email: teacher.email || "",
      busId: teacher.busId,
      stop: teacher.stop,
      contact: teacher.contact || "",
      pickupLat: teacher.pickupLat?.toString() || "",
      pickupLng: teacher.pickupLng?.toString() || "",
      dropLat: teacher.dropLat?.toString() || "",
      dropLng: teacher.dropLng?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingTeacher(null);
    setIsDropSameAsPickup(false);
    setFormData({
      name: "",
      department: "",
      subject: "",
      email: "",
      busId: "BUS-001",
      stop: "",
      contact: "",
      pickupLat: "",
      pickupLng: "",
      dropLat: "",
      dropLng: "",
    });
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      statusFilter === "All" || t.department === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="relative min-h-screen safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Teachers
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage faculty transportation assignments
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
            Add Teacher
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
              size={18}
            />
            <input
              type="text"
              placeholder="Search teachers or departments..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <ListFilter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none cursor-pointer text-sm font-medium text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500/50 transition-all min-w-[170px]"
            >
              <option value="All">All Departments</option>
              <option value="Science">Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Computer Science">Computer Science</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              className="group bg-white/80 dark:bg-gray-900/60  p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500/50 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center mt-0.5">
                      <Briefcase size={12} className="mr-1" />
                      {teacher.department}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Bus size={14} className="mr-2.5 text-indigo-600" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">
                    Bus:
                  </span>
                  <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-900 dark:text-white">
                    {teacher.busId}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <MapPin size={14} className="mr-2.5 text-rose-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">
                    Stop:
                  </span>
                  <span className="truncate">{teacher.stop}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <Phone size={14} className="mr-2.5 text-emerald-500" />
                  <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">
                    Contact:
                  </span>
                  <span className="font-mono">{teacher.contact}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-600 hover:text-white transition-all text-xs font-bold shadow-sm"
                >
                  <Edit2 size={14} className="mr-1.5" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center p-2 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-600 hover:text-white transition-all text-xs font-bold shadow-sm">
                  <Trash2 size={14} className="mr-1.5" /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                  placeholder="e.g. Prof. Aruna"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                  placeholder="e.g. Science"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                  placeholder="e.g. Physics"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                  placeholder="prof@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Bus Assignment
                </label>
                <select
                  value={formData.busId}
                  onChange={(e) =>
                    setFormData({ ...formData, busId: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                >
                  <option value="">Select Bus</option>
                  {busesData.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.number}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                  Pickup Stop
                </label>
                <input
                  type="text"
                  value={formData.stop}
                  onChange={(e) =>
                    setFormData({ ...formData, stop: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                  placeholder="e.g. High Court Jn"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-1">
                Contact
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="+91..."
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="sameAsPickupTeacher"
                checked={isDropSameAsPickup}
                onChange={(e) => setIsDropSameAsPickup(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label
                htmlFor="sameAsPickupTeacher"
                className="text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide"
              >
                Drop location same as Pickup
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm active:scale-95 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                onClick={handleSaveTeacher}
              >
                {editingTeacher ? "Update Teacher" : "Save Teacher"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
