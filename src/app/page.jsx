"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JobCardForm() {
  const [activeModal, setActiveModal] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});
  const [taskData, setTaskData] = useState({});
  const [jobDetails, setJobDetails] = useState({
    jobId: "",
    clientId: "",
    clientName: "",
    jobDate: "",
    clientTime: "",
  });

  const [timeResult, setTimeResult] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [actualCompletionDate, setActualCompletionDate] = useState("");


useEffect(() => {
if (!jobDetails.jobDate) {
      setActualCompletionDate("");
      return;
    }
  
    const totalTime = Object.values(taskData).reduce((sum, task) => {
      const time = parseInt(task.timeToComplete || "0", 10);
      return sum + (isNaN(time) ? 0 : time);
    }, 0);
  
const delimiter = jobDetails.jobDate.includes("/") ? "/" : "-";
const [day, month, year] = jobDetails.jobDate.split(delimiter).map(Number);

    const fullYear = year < 100 ? 2000 + year : year;
    const baseDate = new Date(fullYear, month - 1, day);
  
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + totalTime);
  
    const formatted = `${String(newDate.getDate()).padStart(2, "0")}/${String(
      newDate.getMonth() + 1
    ).padStart(2, "0")}/${String(newDate.getFullYear()).slice(-2)}`;
  
    console.log("✅ Setting Actual Completion Date:", formatted);
    setActualCompletionDate(formatted);
}, [JSON.stringify(taskData), jobDetails.jobDate]);
  
  
  useEffect(() => {
    setTimeResult(""); 
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      const id = jobDetails.clientId.trim();
      if (!id) return;

      const { data, error } = await supabase
        .from("clients")
        .select("name")
        .eq("client_id", id)
        .limit(1)
        .single();

      if (!error && data?.name) {
        setJobDetails((prev) => ({ ...prev, clientName: data.name }));
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [jobDetails.clientId]);

function parseCustomDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(2000 + year, month - 1, day);
}

  const handleJobChange = (field, value) => {
    setJobDetails((prev) => ({ ...prev, [field]: value }));
  };

  const openModal = (task) => setActiveModal(task);
  const closeModal = () => setActiveModal(null);

  const handleInputChange = (task, field, value) => {
    const updated = {
      ...taskData,
      [task]: {
        ...taskData[task],
        [field]: value,
      },
    };
    setTaskData(updated);

    if (field === "timeToComplete" && value.trim() === "") {
      setCompletedTasks((prev) => {
        const updated = { ...prev };
        delete updated[task];
        return updated;
      });
    }
  };

  const handleFormSubmit = (task) => {
    if (taskData[task]?.timeToComplete?.trim()) {
      setCompletedTasks((prev) => ({ ...prev, [task]: true }));
    }
    closeModal();
  };

const handleFinalSubmit = async () => {
  const { jobId, clientId, clientName, jobDate } = jobDetails;

  if (!jobId || !clientId || !clientName || !jobDate) {
    setSubmitMessage("❌ Please fill in all required fields.");
    return;
  }

  // Job card payload
  const jobCardPayload = {
    job_id: jobId,
    client_id: clientId,
    name: clientName,
    date: jobDate,
  };

  // Jobs table payload
  const jobPayload = {
    job_id: jobId,
    client_id: clientId,
    job_date: jobDate,
    client_time: parseFloat(jobDetails.clientTime) || null,
    tasks: taskData,
  };

  // Insert into job_card
  const { error: cardError } = await supabase.from("job_card").insert([jobCardPayload]);

  if (cardError) {
    console.error("Insert error in job_card:", cardError);
    setSubmitMessage("❌ Failed to submit data to job_card.");
    return;
  }

  // Insert into jobs
  const { error: jobError } = await supabase.from("jobs").insert([jobPayload]);

  setSubmitMessage("✅ Job card and job entry submitted successfully!");

  // Reset form
  setJobDetails({
    jobId: "",
    clientId: "",
    clientName: "",
    jobDate: "",
    clientTime: "",
  });
  setTaskData({});
  setCompletedTasks({});
  setTimeResult("");
};

  const taskList = [
    "Plating",
    "Card Cutting",
    "Printing",
    "Lamination",
    "UV",
    "Pasting",
    "Joint",
    "Sorting",
  ];

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen max-h-screen overflow-y-auto bg-gray-100 p-4">
      
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6 md:p-10">
<div className="bg-blue-500 text-white py-3 px-6 rounded-t-2xl -mt-6 -ml-6 -mr-6 md:-mt-10 md:-ml-10 md:-mr-10">
  <h1 className="text-xl font-semibold text-center">JOB CARD</h1>
</div>
<br></br>
<br></br>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
              {[
                "jobId",
                "clientId",
                "clientName",
                "jobDate",
                "clientTime",
              ].map((field, index) => {
                const labelMap = {
                  jobId: "Job ID",
                  clientId: "Client ID",
                  clientName: "Client Name",
                  jobDate: "Job Date",
                  clientTime: "Expected Completion Date",
                };
                const type =
  field === "jobDate" || field === "clientTime"
    ? "text"
    : "text";

                return (
                  <div key={index}>
                    <label className="block text-gray-700 font-medium mb-1">
                      {labelMap[field]}
                    </label>
                  <input
  type={type}
  value={jobDetails[field] || ""}
  onChange={(e) => handleJobChange(field, e.target.value)}
  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black"
  placeholder={
    field === "jobDate" || field === "clientTime"
      ? "dd/mm/yy"
      : `Enter ${labelMap[field]}`
  }
/>

{field === "jobDate" && jobDetails.jobDate && (
  <p className="text-xs text-gray-500 mt-1">
  </p>
)}

{field === "clientTime" && jobDetails.clientTime && (
  <p className="text-xs text-gray-500 mt-1">
  </p>
)}

                  </div>
                );
              })
              }
                            {actualCompletionDate && (
                  <div className="text-sm font-medium text-gray-800 bg-gray-100 border border-gray-300 rounded-md p-2 mb-4 mt-6">
                    🗓 Actual Completion Date: {actualCompletionDate}
                  </div>
                )}
            </div>


            <div className="mb-10">
              <h2 className="text-base font-semibold text-gray-800 mb-2">
                Select Tasks:
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                {taskList.map((task) => (
                  <button
                    key={task}
                    onClick={() => openModal(task)}
                    className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition duration-200 shadow-sm border border-gray-300 text-sm font-medium
                      ${
                        completedTasks[task]
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 hover:bg-blue-200 text-blue-700"
                      }`}
                  >
                    <span>{task}</span>
                    {completedTasks[task] && (
                      <span className="text-green-500 font-bold">✔</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 relative">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 mb-4 min-h-[250px]">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Task Summary:
              </h3>
              {Object.entries(taskData).length > 0 ? (
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                  {Object.entries(taskData).map(
                    ([taskName, taskInfo]) =>
                      taskInfo.timeToComplete && (
                        <li key={taskName}>
                          ✅ <strong>{taskName}</strong>: completed in {taskInfo.timeToComplete} day(s)
                        </li>
                      )
                  )}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  No tasks selected yet.
                </p>
              )}
            </div>
            
            <div className="flex justify-end ml-10 mr-10 mt-17 mt-4">
            <button
              onClick={handleFinalSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm text-lg font-medium py-1 px-30 rounded-md"
            >
              Submit
            </button>
            </div>

          </div>
        </div>

        {activeModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-transparent flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-sm relative text-sm">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              >
                &times;
              </button>
              <h2 className="text-lg font-bold text-blue-700 mb-3">
                {activeModal} Form
              </h2>

              <div className="flex flex-wrap gap-4 text-sm mb-4">
          {[
          { label: "Job ID", key: "jobId" },
          { label: "Client ID", key: "clientId" },
          { label: "Client", key: "clientName" },
          { label: "Job Date", key: "jobDate" },
           ].map(({ label, key }) => (
         <div key={key} className="flex flex-col">
         <label className="font-semibold text-gray-800 mb-1">{label}</label>
        <input
        type="text"
        readOnly
        value={jobDetails[key] || ""}
        className="px-3 py-1 border border-gray-300 rounded-md bg-gray-100 text-gray-700 w-40 cursor-not-allowed"
      />
    </div>
  ))}
</div>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 mb-1">
                    Time to Complete (days)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter time"
                    className="w-full px-2 py-1 border border-gray-300 rounded-md bg-white text-black"
                    value={taskData[activeModal]?.timeToComplete || ""}
                    onChange={(e) =>
                      handleInputChange(
                        activeModal,
                        "timeToComplete",
                        e.target.value
                      )
                    }
                  />
                </div>
                <button
                  onClick={() => handleFormSubmit(activeModal)}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
