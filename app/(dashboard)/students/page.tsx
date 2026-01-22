"use client";

import { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  Plus,
  Edit2,
  GraduationCap,
  ListFilter,
} from "lucide-react";
import studentsData from "@/src/data/students.json";
import busesData from "@/src/data/buses.json";
import Modal from "@/src/components/Modal";

interface Student {
  id: string;
  name: string;
  grade: string;
  busId: string;
  pickup: string;
  drop: string;
  status: string;
  parentName: string;
  parentContact: string;
  email: string;
  address: string;
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
}

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropSameAsPickup, setIsDropSameAsPickup] = useState(false);

  const [students, setStudents] = useState<Student[]>(
    studentsData as unknown as Student[],
  );
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    busId: "",
    pickup: "",
    drop: "",
    parentName: "",
    parentContact: "",
    email: "",
    address: "",
    pickupLat: "",
    pickupLng: "",
    dropLat: "",
    dropLng: "",
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();

    // Logic for "Same as Pickup"
    const pLat = parseFloat(formData.pickupLat) || 0;
    const pLng = parseFloat(formData.pickupLng) || 0;
    const dLat = isDropSameAsPickup ? pLat : parseFloat(formData.dropLat) || 0;
    const dLng = isDropSameAsPickup ? pLng : parseFloat(formData.dropLng) || 0;

    if (editingStudent) {
      // Update existing
      setStudents((prev) =>
        prev.map((s) =>
          s.id === editingStudent.id
            ? {
                ...s,
                ...formData,
                pickupLat: pLat,
                pickupLng: pLng,
                dropLat: dLat,
                dropLng: dLng,
              }
            : s,
        ),
      );
      alert("Student updated successfully! (Mock Action)");
    } else {
      // Add new
      const newStudent = {
        // eslint-disable-next-line
        id: `S${Date.now()}`,
        ...formData,
        pickupLat: pLat,
        pickupLng: pLng,
        dropLat: dLat,
        dropLng: dLng,
        status: "Not Picked",
      };

      setStudents([...students, newStudent]);
      alert("Student registered successfully! (Mock Action)");
    }
    setIsModalOpen(false);
    resetForm();
  };

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    const sameLoc =
      student.pickupLat === student.dropLat &&
      student.pickupLng === student.dropLng;
    setIsDropSameAsPickup(sameLoc);

    setFormData({
      name: student.name,
      grade: student.grade,
      busId: student.busId,
      pickup: student.pickup,
      drop: student.drop,
      parentName: student.parentName || "",
      parentContact: student.parentContact || "",
      email: student.email || "",
      address: student.address || "",
      pickupLat: student.pickupLat?.toString() || "",
      pickupLng: student.pickupLng?.toString() || "",
      dropLat: student.dropLat?.toString() || "",
      dropLng: student.dropLng?.toString() || "",
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingStudent(null);
    setIsDropSameAsPickup(false);
    setFormData({
      name: "",
      grade: "",
      busId: "",
      pickup: "",
      drop: "",
      parentName: "",
      parentContact: "",
      email: "",
      address: "",
      pickupLat: "",
      pickupLng: "",
      dropLat: "",
      dropLng: "",
    });
  };

  const handleContact = (name: string, type: "mail" | "phone") => {
    alert(
      `Simulation: Contacting ${name} via ${
        type === "mail" ? "Email" : "Phone"
      }...`,
    );
  };

  return (
    <div className="relative min-h-screen safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Students
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage student transport assignments and status
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
            Register Student
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
              placeholder="Search by name or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm text-gray-900 dark:text-white placeholder:text-gray-400 shadow-sm"
            />
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <ListFilter size={18} className="text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-10 pr-10 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none cursor-pointer text-sm font-medium text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500/50 transition-all min-w-[160px]"
            >
              <option value="All">All Statuses</option>
              <option value="Picked">Picked</option>
              <option value="Not Picked">Not Picked</option>
              <option value="Dropped">Dropped</option>
            </select>
          </div>
        </div>

        {/* Student List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="group bg-white/80 dark:bg-gray-900/60  p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-lg transition-all duration-300 flex flex-col space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                    {student.name[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {student.name}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium space-x-2 mt-0.5">
                      <span className="flex items-center">
                        <GraduationCap size={12} className="mr-1" />
                        {student.grade}
                      </span>
                      <span>•</span>
                      <span>ID: {student.id}</span>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                    student.status === "Picked"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                      : student.status === "Not Picked"
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                  }`}
                >
                  {student.status}
                </span>
              </div>

              <div className="p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl space-y-2.5 border border-gray-100 dark:border-gray-800/50">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Bus ID
                  </span>
                  <span className="text-gray-900 dark:text-white font-semibold">
                    {student.busId}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Pickup
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium text-right truncate ml-4">
                    {student.pickup}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    Drop
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium text-right truncate ml-4">
                    {student.drop}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleContact(student.name, "mail")}
                    className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <Mail size={16} />
                  </button>
                  <button
                    onClick={() => handleContact(student.name, "phone")}
                    className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <Phone size={16} />
                  </button>
                  <button
                    onClick={() => handleEditClick(student)}
                    className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-600 rounded-lg text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
                <button
                  onClick={() => alert(`Showing details for ${student.name}`)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              No students found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStudent ? "Edit Student Details" : "Register New Student"}
      >
        <form onSubmit={handleSaveStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Student Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Grade
              </label>
              <input
                type="text"
                value={formData.grade}
                onChange={(e) =>
                  setFormData({ ...formData, grade: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. 10th"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Parent Name
              </label>
              <input
                type="text"
                value={formData.parentName}
                onChange={(e) =>
                  setFormData({ ...formData, parentName: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. Robert Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Parent Contact
              </label>
              <input
                type="tel"
                value={formData.parentContact}
                onChange={(e) =>
                  setFormData({ ...formData, parentContact: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="+91..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="parent@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Assigned Bus
              </label>
              <select
                value={formData.busId}
                onChange={(e) =>
                  setFormData({ ...formData, busId: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
              >
                <option value="">Select a Bus</option>
                {busesData.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.number} - {bus.route}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Residential Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
              rows={2}
              placeholder="e.g. 123 Main St, Springfield"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Pickup Point Name
              </label>
              <input
                type="text"
                value={formData.pickup}
                onChange={(e) =>
                  setFormData({ ...formData, pickup: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. Stop A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Drop Point Name
              </label>
              <input
                type="text"
                value={formData.drop}
                onChange={(e) =>
                  setFormData({ ...formData, drop: e.target.value })
                }
                className="w-full p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-gray-900 dark:text-white"
                placeholder="e.g. Stop B"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <input
              type="checkbox"
              id="sameAsPickup"
              checked={isDropSameAsPickup}
              onChange={(e) => setIsDropSameAsPickup(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="sameAsPickup"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Drop location same as Pickup
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm active:scale-95 transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              {editingStudent ? "Update Student" : "Register Student"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
