"use client";
import { useState, useEffect } from "react";

// Helper: map each page -> roles
function getAllowedRoles(page) {
  switch (page) {
    case "Job Card":
      return ["ADMIN", "MANAGER", "USER"];
    case "Pre-Press":
    case "Plates":
      return ["ADMIN", "EDITOR"];
    case "Printing":
      return ["ADMIN", "MANAGER"];
    case "Reports":
      return ["ADMIN"];
    default:
      return ["ADMIN", "USER"];
  }
}

export default function JobCardForm() {
  const [formData, setFormData] = useState({
    jobId: "",
    customer: "",
    startDate: "",
    requiredDate: "",    
    subJobId: "1",
    color: "",
    cardSize: "",
    cardQty: "",
    itemQty: "",
    description: "",
    Printing: false,
  });

  const [subJobs, setSubJobs] = useState([]);
  const [selectedMachines, setSelectedMachines] = useState([]);
  const [showPrintingModal, setShowPrintingModal] = useState(false);
  const [showMachineForm, setShowMachineForm] = useState(false);
  const [activePage, setActivePage] = useState("Job Card");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editingSubJob, setEditingSubJob] = useState(null);

  const pages = [
    "Job Card",
    "Pre-Press",
    "Plates",
    "Card Cutting",
    "Printing",
    "Pasting",
    "Sorting",
    "Reports",
  ];
  const additionalMenuItems = [
    "Varnish",
    "Lamination",
    "Joint",
    "Die Cutting",
    "Foil",
    "Pasting",
    "Screen Printing",
    "Embose",
    "Double Tape",
  ];

  // Use useEffect to load the initial machines only once
  const [allMachines, setAllMachines] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState({});

  const handleTaskChange = (taskName) => {
    setSelectedTasks(prev => ({
      ...prev,
      [taskName]: !prev[taskName]
    }));
  };

  // Machine Form State (for new machine info)
  const [machineFormData, setMachineFormData] = useState({
    name: "",
    size: "",
    capacity: "",
    description: "",
    availableDays: "",
  });

  const toggleMachine = (machineId) => {
    setSelectedMachines((prev) =>
      prev.includes(machineId)
        ? prev.filter((id) => id !== machineId)
        : [...prev, machineId]
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "Printing" && type === "checkbox") {
      setShowPrintingModal(checked);
    }
  };

  const handleMachineFormChange = (e) => {
    const { name, value } = e.target;
    setMachineFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMachineFormSubmit = (e) => {
    e.preventDefault();
    const newMachine = {
      id: machineFormData.name,
      description: machineFormData.description,
      size: machineFormData.size,
      capacity: machineFormData.capacity,
      days: machineFormData.availableDays,
    };
    setAllMachines((prev) => [...prev, newMachine]);
    setShowMachineForm(false);
    setMachineFormData({
      name: "",
      size: "",
      capacity: "",
      description: "",
      availableDays: "",
    });
    console.log("New Machine Added:", newMachine);
  };

  const handleAddSubJob = (e) => {
    e.preventDefault();
    const subJobDetails = {
      subJobId: formData.subJobId,
      color: formData.color,
      cardSize: formData.cardSize,
      cardQty: formData.cardQty ? parseInt(formData.cardQty, 10) : 0,
      itemQty: formData.itemQty ? parseInt(formData.itemQty, 10) : 0,
      description: formData.description,
      selectedTasks: {...selectedTasks}
    };

    if (editingSubJob !== null) {
      const updatedSubJobs = [...subJobs];
      updatedSubJobs[editingSubJob] = subJobDetails;
      setSubJobs(updatedSubJobs);
      setEditingSubJob(null);
    } else {
      setSubJobs((prev) => [...prev, subJobDetails]);
    }

    const currentSubJobId = parseInt(formData.subJobId) || 0;
    setFormData((prev) => ({
      ...prev,
      subJobId: String(
        editingSubJob !== null ? currentSubJobId : currentSubJobId + 1
      ),
      color: "",
      cardSize: "",
      cardQty: "",
      itemQty: "",
      description: "",
    }));
    
    setSelectedTasks({});
  };

  const handleDeleteSubJob = (index) => {
    const updatedSubJobs = subJobs.filter((_, i) => i !== index);
    setSubJobs(updatedSubJobs);
    if (updatedSubJobs.length === 0) {
      setFormData((prev) => ({ ...prev, subJobId: "1" }));
    }
  };

  const handleEditSubJob = (index) => {
    const subJobToEdit = subJobs[index];
    setFormData((prev) => ({
      ...prev,
      subJobId: subJobToEdit.subJobId,
      color: subJobToEdit.color,
      cardSize: subJobToEdit.cardSize,
      cardQty: subJobToEdit.cardQty.toString(),
      itemQty: subJobToEdit.itemQty.toString(),
      description: subJobToEdit.description,
    }));
    setSelectedTasks(subJobToEdit.selectedTasks || {});
    setEditingSubJob(index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      mainJob: {
        jobId: formData.jobId,
        customer: formData.customer,
        startDate: formData.startDate,
        requiredDate: formData.requiredDate,
      },
      subJobs,
      selectedMachines,
    });

    setFormData({
      jobId: "",
      customer: "",
      startDate: "",
      requiredDate: "",
      subJobId: "1",
      color: "",
      cardSize: "",
      cardQty: "",
      itemQty: "",
      description: "",
      Printing: false,
    });

    setSubJobs([]);
    setSelectedMachines([]);
    alert("Form Submitted!");
  };

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsMenuOpen(false);
    
    if (page === "Printing") {
      setShowMachineForm(true);
      setShowPrintingModal(false);
    } else {
      setShowMachineForm(false);
      setShowPrintingModal(false);
    }
  };

  const checks = [
    "Pre-Press",
    "Plates Quantity/Proof Read",
    "Card Cutting",
    "Varnish: Matte",
    "Varnish: Shine",
    "Lamination: Matte",
    "Lamination: Shine",
    "Joint",
    "Die Cutting",
    "Foil",
    "Pasting",
    "Screen Printing",
    "Embose",
    "Double Tape",
    "Sorting Report",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col p-1">
      <div className="flex flex-1 items-start justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-lg p-3 w-full max-w-7xl text-black relative text-sm"
        >
          {/* Navbar inside form */}
          <div className="bg-blue-500 text-white py-1 px-3 rounded-t-lg -mt-3 -mx-3 mb-3">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded hover:bg-blue-600"
                aria-label="Menu"
              >
                <div className="space-y-1 w-5">
                  <span className="block h-0.5 w-full bg-white"></span>
                  <span className="block h-0.5 w-full bg-white"></span>
                  <span className="block h-0.5 w-full bg-white"></span>
                </div>
              </button>

              <div className="hidden md:flex gap-2">
                {pages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`px-2 py-0.5 rounded text-xs ${
                      activePage === page ? "bg-blue-300 text-black" : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute left-0 top-0 h-full w-56 bg-white shadow-xl z-50 border-r border-gray-200 overflow-y-auto">
              <div className="p-2">
                {pages.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    className={`block w-full text-left px-3 py-1.5 my-0.5 hover:bg-blue-100 rounded ${
                      activePage === page
                        ? "bg-blue-200 text-black font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <div className="border-t border-gray-300 my-1"></div>

                {additionalMenuItems.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      console.log(item + " clicked");
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-1.5 my-0.5 hover:bg-blue-100 rounded text-gray-800"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form Content */}
          <div
            className={`transition-all ${
              isMenuOpen ? "md:ml-56" : ""
            } flex flex-col`}
          >
            {/* Left Section - Form Fields */}
            <div className="flex-1">
              <br></br>
              {/* Top Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="jobId" className="w-20 text-xs font-medium text-black">
                    Job ID
                  </label>
                  <input
                    id="jobId"
                    name="jobId"
                    type="text"
                    autoComplete="off"
                    value={formData.jobId}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="customer" className="w-20 text-xs font-medium text-black">
                    Customer
                  </label>
                  <input
                    id="customer"
                    name="customer"
                    type="text"
                    autoComplete="off"
                    value={formData.customer}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="startDate" className="w-20 text-xs font-medium text-black">
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="requiredDate" className="w-20 text-xs font-medium text-black">
                    Required Date
                  </label>
                  <input
                    id="requiredDate"
                    name="requiredDate"
                    type="date"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>
              </div>
<br></br>
              {/* Divider */}
              <div className="border-t my-2"></div>
              <br></br>

              {/* Sub Job Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="subJobId" className="w-20 text-xs font-medium text-black">
                    Sub Job ID
                  </label>
                  <input
                    id="subJobId"
                    name="subJobId"
                    type="text"
                    autoComplete="off"
                    value={formData.subJobId}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="color" className="w-20 text-xs font-medium text-black">
                    Color
                  </label>
                  <input
                    id="color"
                    name="color"
                    type="text"
                    autoComplete="off"
                    value={formData.color}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="cardSize" className="w-20 text-xs font-medium text-black">
                    Card Size
                  </label>
                  <input
                    id="cardSize"
                    name="cardSize"
                    type="text"
                    autoComplete="off"
                    value={formData.cardSize}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="cardQty" className="w-20 text-xs font-medium text-black">
                    Card Qty
                  </label>
                  <input
                    id="cardQty"
                    name="cardQty"
                    type="number"
                    value={formData.cardQty}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-center gap-2 mb-1 text-black">
                  <label htmlFor="itemQty" className="w-20 text-xs font-medium text-black">
                    Item Qty
                  </label>
                  <input
                    id="itemQty"
                    name="itemQty"
                    type="number"
                    value={formData.itemQty}
                    onChange={handleChange}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs h-7"
                  />
                </div>

                <div className="flex items-start gap-2 mb-1 text-black">
                  <label htmlFor="description" className="w-20 text-xs font-medium text-black pt-1.5">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={2}
                    className="border border-black rounded px-2 py-0.5 flex-1 text-black text-xs"
                  />
                </div>
              </div>

              {/* Checkboxes Section */}
              <div className="pt-2 mt-2">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-1 text-black text-xs">
                  {checks.map((label) => (
                    <label key={label} className="flex items-center gap-1 text-black text-xs">
                      <input
                        type="checkbox"
                        checked={selectedTasks[label] || false}
                        onChange={() => handleTaskChange(label)}
                        className="w-3 h-3"
                      />
                      <span className="truncate">{label}</span>
                    </label>
                  ))}
                  {/* Printing Checkbox */}
                  <label className="flex items-center gap-1 text-black text-xs">
                    <input
                      type="checkbox"
                      name="Printing"
                      checked={formData.Printing || false}
                      onChange={handleChange}
                      className="w-3 h-3"
                    />
                    <span>Printing</span>
                  </label>
                </div>
              </div>

              {/* Add Sub Job Button */}
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddSubJob}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                >
                  {editingSubJob !== null ? "UPDATE SUB JOB" : "ADD SUB JOB"}
                </button>
              </div>

              {/* Sub Jobs Table - Moved below checkboxes */}
              {subJobs.length > 0 && (
                <div className="mt-3 bg-gray-50 p-2 rounded border border-gray-200">
                  <h3 className="text-xs font-semibold mb-2 text-center">
                    Sub Jobs Details
                  </h3>
                  
<div className={`overflow-x-auto ${subJobs.length > 3 ? 'max-h-32 overflow-y-auto' : ''}`}>
                    <table className="min-w-full bg-white text-xs">
                      <thead className="sticky top-0 bg-gray-200">
                        <tr className="text-gray-700 text-xs">
                          <th className="py-1 px-2 text-left">Sub Job ID</th>
                          <th className="py-1 px-2 text-left">Item Qty</th>
                          <th className="py-1 px-2 text-left">Description</th>
                          <th className="py-1 px-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subJobs.map((job, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100 text-xs">
                            <td className="py-1 px-2">{job.subJobId}</td>
                            <td className="py-1 px-2">{job.itemQty}</td>
                            <td className="py-1 px-2">{job.description}</td>
                            <td className="py-1 px-2">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleEditSubJob(index)}
                                  className="bg-blue-400 text-white px-1.5 py-0.5 rounded text-xs hover:bg-yellow-500"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubJob(index)}
                                  className="bg-blue-400 text-white px-1.5 py-0.5 rounded text-xs hover:bg-red-500"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {/* Main Submit Button */}
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-1 rounded text-xs hover:bg-blue-600"
                >
                  SUBMIT JOB CARD
                </button>
              </div>
                            <br></br>

            </div>
          </div>
        </form>
      </div>

      {/* Printing Modal (for checkbox) */}
      {showPrintingModal && (
        <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50 p-2">
          <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-3xl relative text-sm">
            <div className="bg-blue-500 text-white py-1 px-3 rounded-t-lg -mt-3 -mx-3 mb-3">
              <div className="flex justify-between items-center">
                <h1 className="text-base font-semibold">Printing Details</h1>
                <button
                  type="button"
                  onClick={() => {
                    setShowPrintingModal(false);
                    setFormData((prev) => ({ ...prev, Printing: false }));
                  }}
                  className="text-white hover:text-gray-200 text-lg"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {allMachines.map((machine) => (
                <div
                  key={machine.id}
                  className={`border rounded p-2 shadow transition duration-200 ${
                    selectedMachines.includes(machine.id)
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="text-sm font-semibold text-black">
                      {machine.id}
                    </h2>
                    <input
                      type="checkbox"
                      checked={selectedMachines.includes(machine.id)}
                      onChange={() => toggleMachine(machine.id)}
                      className="h-3 w-3 text-blue-500"
                    />
                  </div>
                  <div className="space-y-0.5 text-xs text-black">
                    <p>
                      <strong>Desc:</strong> {machine.description}
                    </p>
                    <p>
                      <strong>Size:</strong> {machine.size}
                    </p>
                    <p>
                      <strong>Capacity:</strong> {machine.capacity}
                    </p>
                    <p>
                      <strong>Days:</strong> {machine.days}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPrintingModal(false);
                  setFormData((prev) => ({ ...prev, Printing: false }));
                }}
                className="bg-gray-500 text-white px-4 py-1 rounded text-xs hover:bg-gray-600"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPrintingModal(false);
                  setFormData((prev) => ({ ...prev, Printing: true }));
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded text-xs hover:bg-blue-600"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Machine Info Modal (for navbar Printing button) */}
      {showMachineForm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-2">
          <div className="relative w-full max-w-xs mx-auto bg-white rounded-lg shadow-lg border border-blue-100 overflow-hidden text-sm">
            {/* Header */}
            <div className="bg-blue-500 p-3 text-center">
              <h2 className="text-base font-semibold text-white tracking-wide">
                Machine Info
              </h2>
            </div>
            {/* Form */}
            <form onSubmit={handleMachineFormSubmit} className="p-4 space-y-3 text-gray-900">
              <div>
                <label className="block text-xs font-medium mb-1">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={machineFormData.name}
                  onChange={handleMachineFormChange}
                  className="w-full px-2 py-1 text-xs text-gray-900 border border-black rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="e.g., HB-01"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Size:</label>
                  <input
                    type="text"
                    name="size"
                    value={machineFormData.size}
                    onChange={handleMachineFormChange}
                    className="w-full px-2 py-1 text-xs text-gray-900 border border-black rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="e.g., 20x30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Capacity:</label>
                  <input
                    type="text"
                    name="capacity"
                    value={machineFormData.capacity}
                    onChange={handleMachineFormChange}
                    className="w-full px-2 py-1 text-xs text-gray-900 border border-black rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                    placeholder="e.g., 1200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Description:</label>
                <textarea
                  className="w-full px-2 py-1 text-xs text-gray-900 border border-black rounded focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                  placeholder="Short description"
                  rows="2"
                  name="description"
                  value={machineFormData.description}
                  onChange={handleMachineFormChange}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Available Days:</label>
                <input
                  type="text"
                  name="availableDays"
                  value={machineFormData.availableDays}
                  onChange={handleMachineFormChange}
                  className="w-full px-2 py-1 text-xs text-gray-900 border border-black rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                  placeholder="e.g., 5"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMachineForm(false)}
                  className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 transition duration-200 text-xs font-medium shadow"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-200 text-xs font-medium shadow"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}