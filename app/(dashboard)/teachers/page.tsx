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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Teachers
            </h2>
            <p className="text-gray-500 mt-1">
              Manage faculty transportation assignments
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-lg shadow-primary-soft active:scale-95 transition-all hover:opacity-90"
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
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm text-gray-900 placeholder:text-gray-400 shadow-sm"
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
              className="appearance-none pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl outline-none cursor-pointer text-sm font-medium text-gray-900 shadow-sm focus:ring-2 focus:ring-primary/50 transition-all min-w-[170px]"
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
              className="group bg-white p-3 rounded-xl border border-gray-200 border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all duration-300 flex flex-col space-y-3"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-soft">
                    {teacher.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                      {teacher.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 font-medium space-x-2 mt-0.5">
                      <span className="flex items-center">
                        <Briefcase size={12} className="mr-1" />
                        {teacher.department}
                      </span>
                      <span>•</span>
                      <span>{teacher.subject}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              <div className="p-2.5 bg-gray-100 rounded-lg space-y-2 border border-gray-100">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Bus ID</span>
                  <span className="text-gray-900 font-semibold">
                    {teacher.busId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Stop</span>
                  <span className="text-gray-900 font-medium text-right truncate ml-4">
                    {teacher.stop}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 font-medium">Contact</span>
                  <span className="text-gray-900 font-medium text-right font-mono ml-4">
                    {teacher.contact}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => alert(`Emailing ${teacher.email}`)}
                    className="p-2 bg-gray-100 hover:bg-primary hover:text-white rounded-lg text-gray-500 transition-colors"
                  >
                    <User size={16} />
                  </button>
                  <button
                    onClick={() => alert(`Calling ${teacher.contact}`)}
                    className="p-2 bg-gray-100 hover:bg-emerald-500 hover:text-white rounded-lg text-gray-500 transition-colors"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => handleEditClick(teacher)}
                    className="p-2 bg-gray-100 hover:bg-amber-500 hover:text-white rounded-lg text-gray-500 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <button className="text-gray-400 hover:text-red-600 transition-colors p-1">
                  <Trash2 size={20} />
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                  placeholder="e.g. Prof. Aruna"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                  placeholder="e.g. Science"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                  placeholder="e.g. Physics"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                  placeholder="prof@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Bus Assignment
                </label>
                <select
                  value={formData.busId}
                  onChange={(e) =>
                    setFormData({ ...formData, busId: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                  Pickup Stop
                </label>
                <input
                  type="text"
                  value={formData.stop}
                  onChange={(e) =>
                    setFormData({ ...formData, stop: e.target.value })
                  }
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                  placeholder="e.g. High Court Jn"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">
                Contact
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-gray-900"
                placeholder="+91..."
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <input
                type="checkbox"
                id="sameAsPickupTeacher"
                checked={isDropSameAsPickup}
                onChange={(e) => setIsDropSameAsPickup(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label
                htmlFor="sameAsPickupTeacher"
                className="text-xs font-bold text-gray-600 uppercase tracking-wide"
              >
                Drop location same as Pickup
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm active:scale-95 transition-all hover:bg-gray-200"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 bg-gradient-primary text-white font-bold rounded-xl text-sm shadow-lg shadow-primary-soft active:scale-95 transition-all hover:opacity-90"
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
