// import React, { useState, useEffect } from "react";
// import Layout from "../../components/Layout";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar, PlusCircle } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Attendance = () => {
//   const [candidateId, setCandidateId] = useState("");
//   const [attendanceList, setAttendanceList] = useState([]);
//   const [lastBase64, setLastBase64] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [filterToday, setFilterToday] = useState(true);

//   const FINGERPRINT_API = "https://localhost:8000/SGIFPCapture";

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`http://localhost:7081/Bio/GetAllAttendance`);
//       setAttendanceList(res.data);
//     } catch (err) {
//       console.error("Error fetching attendance:", err.message);
//       setAttendanceList([]);
//     }
//   };

//   const addAttendance = async () => {
//     if (!candidateId) return toast.warn("Candidate ID is required");

//     try {
//       setLoading(true);
//       const verifyRes = await axios.post(
//         "http://localhost:7081/Bio/VerifyAttendanceByCandidateId",
//         { candidateId: parseInt(candidateId) }
//       );

//       const message = verifyRes.data;

//       if (verifyRes.status === 200) {
//         if (typeof message === "string") {
//           if (message.includes("Attendance marked")) {
//             toast.success("✅ " + message);
//             fetchAttendance();
//             setCandidateId("");
//           } else if (message.includes("already marked")) {
//             toast.info("ℹ️ " + message);
//           } else {
//             toast.error("❌ " + message);
//           }
//         } else {
//           toast.error("❌ Unexpected response.");
//         }
//       } else {
//         toast.error("❌ Candidate verification failed.");
//       }
//     } catch (err) {
//       toast.error("❌ Error verifying candidate.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAttendanceByFingerprint = async (liveTemplate) => {
//     try {
//       setLoading(true);

//       // 1. Get all stored fingerprints
//       const storedRes = await axios.get(
//         "http://localhost:7081/Bio/GetAllFingerprints"
//       );
//       const storedTemplates = storedRes.data; // Array of {fingerPrintID, role, fingerPrint1, fingerPrint2, fingerPrint3}

//       // 2. Loop through and match
//       for (const record of storedTemplates) {
//         const fingerprints = [
//           record.fingerPrint1,
//           record.fingerPrint2,
//           record.fingerPrint3,
//         ];

//         for (const storedTemplate of fingerprints) {
//           if (!storedTemplate) continue;

//           const params = `template1=${encodeURIComponent(
//             liveTemplate
//           )}&template2=${encodeURIComponent(
//             storedTemplate
//           )}&licstr=&templateFormat=ISO`;

//           const matchRes = await fetch("https://localhost:8000/SGIMatchScore", {
//             method: "POST",
//             body: params,
//           });

//           const matchResult = await matchRes.json();

//           if (matchResult.ErrorCode === 0 && matchResult.MatchingScore >= 140) {
//             // Matched successfully — mark attendance
//             const verifyRes = await axios.post("http://localhost:7081/Bio/VerifyAttendanceByFingerprintId",
//               {
//                 fingerPrintID: record.fingerPrintID,
//               }
//             );

//             const msg = verifyRes.data;

//             if (msg.includes("Attendance marked")) {
//               toast.success(
//                 "✅ Attendance marked via fingerprint for ID: " +
//                   record.fingerPrintID
//               ); // ✅ FIXED
//               setCandidateId(record.fingerPrintID.toString()); // ✅ FIXED

//               setCandidateId(record.candidateId.toString());
//               fetchAttendance();
//             } else {
//               toast.info("ℹ️ " + msg);
//             }

//             return; // stop after first successful match
//           }
//         }
//       }

//       toast.error("❌ No fingerprint match found.");
//     } catch (err) {
//       console.error(err);
//       toast.error("❌ Error during fingerprint matching.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();

//     const fingerprintInterval = setInterval(async () => {
//       const currentMode = localStorage.getItem("currentMode");
//       if (currentMode !== "attendance") return;

//       try {
//         const res = await fetch(FINGERPRINT_API);
//         const data = await res.json();

//         if (data?.ErrorCode === 0 && data?.TemplateBase64) {
//           const base64 = data.TemplateBase64;

//           if (base64 === lastBase64) return;
//           setLastBase64(base64);

//           await markAttendanceByFingerprint(base64);
//         }
//       } catch (err) {
//         console.log("❌ Fingerprint capture failed:", err.message);
//       }
//     }, 5000);

//     const autoRefreshInterval = setInterval(() => {
//       fetchAttendance();
//     }, 50000);

//     return () => {
//       clearInterval(fingerprintInterval);
//       clearInterval(autoRefreshInterval);
//     };
//   }, [lastBase64]);

//   const today = new Date();
//   const formattedToday = `${String(today.getDate()).padStart(2, "0")}-${String(
//     today.getMonth() + 1
//   ).padStart(2, "0")}-${today.getFullYear()}`;

//   const filteredList = filterToday
//     ? attendanceList.filter((a) => {
//         const attDate = new Date(a.attendanceDate);
//         const formattedAttDate = `${String(attDate.getDate()).padStart(
//           2,
//           "0"
//         )}-${String(attDate.getMonth() + 1).padStart(
//           2,
//           "0"
//         )}-${attDate.getFullYear()}`;
//         return formattedAttDate === formattedToday;
//       })
//     : attendanceList;

//   return (
//     <Layout>
//       <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
//             <p className="text-gray-600 mt-2">
//               Mark attendance by Fingerprint or Candidate ID
//             </p>
//           </div>

//           <Dialog>
//             <DialogTrigger asChild>
//               <Button className="flex items-center gap-2">
//                 <PlusCircle className="h-4 w-4" />
//                 Add Attendance
//               </Button>
//             </DialogTrigger>
//             <DialogContent>
//               <DialogHeader>
//                 <DialogTitle>Add Attendance by Candidate ID</DialogTitle>
//               </DialogHeader>
//               <div className="space-y-4">
//                 <Input
//                   placeholder="Enter Candidate ID"
//                   value={candidateId}
//                   onChange={(e) => setCandidateId(e.target.value)}
//                 />
//                 <Button disabled={loading} onClick={addAttendance}>
//                   {loading ? "Marking..." : "Submit"}
//                 </Button>
//               </div>
//             </DialogContent>
//           </Dialog>
//         </div>

//         <div className="text-right">
//           <label className="text-sm text-gray-600">
//             <input
//               type="checkbox"
//               checked={filterToday}
//               onChange={() => setFilterToday(!filterToday)}
//               className="mr-2"
//             />
//             Show only today’s records
//           </label>
//         </div>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5 text-green-500" />
//               Attendance Records
//             </CardTitle>
//             <CardDescription>Auto-refreshed every 10s</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-sm">
//                 <thead>
//                   <tr className="border-b bg-gray-100">
//                     <th className="p-2 text-left">Candidate Name</th>
//                     <th className="p-2 text-left">Date</th>
//                     <th className="p-2 text-left">In Time</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredList.length > 0 ? (
//                     filteredList.map((att, index) => (
//                       <tr key={index} className="border-b">
//                         <td className="p-2">{att.candidateName}</td>
//                         <td className="p-2">
//                           {(() => {
//                             const d = new Date(att.attendanceDate);
//                             return `${String(d.getDate()).padStart(
//                               2,
//                               "0"
//                             )}-${String(d.getMonth() + 1).padStart(
//                               2,
//                               "0"
//                             )}-${d.getFullYear()}`;
//                           })()}
//                         </td>
//                         <td className="p-2">{att.inTime}</td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="p-4 text-center text-gray-500">
//                         No attendance records found.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default Attendance;

//=========================================           Working Code

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastBase64, setLastBase64] = useState(null);
  const [filterToday, setFilterToday] = useState(true);
  const [capturing, setCapturing] = useState(true);

  const FINGERPRINT_API = "https://localhost:8000/SGIFPCapture";

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:7081/Bio/GetAllAttendance");
      setAttendanceData(res.data);
    } catch (err) {
      console.error("❌ Error fetching attendance:", err);
      toast.error("Failed to fetch attendance data.");
    }
  };

  const verifyFingerprintTemplate = async (base64Template) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:7081/Bio/VerifyAttendanceByFingerprintTemplate",
        { template: base64Template }
      );

      const resData = response.data;

      if (resData?.message?.includes("Attendance marked")) {
        toast.success("✅ " + resData.message);
        fetchAttendance();
      } else if (resData?.message?.includes("already marked")) {
        toast.info("ℹ️ " + resData.message);
      } else {
        toast.warning("⚠️ " + resData.message || "Unrecognized response.");
      }
    } catch (err) {
      console.error("❌ Error verifying fingerprint:", err);
      toast.error("❌ Failed to verify fingerprint.");
    } finally {
      setLoading(false);
    }
  };
  const isToday = (dateString) => {
    const inputDate = new Date(dateString);
    const today = new Date();
    return (
      inputDate.getDate() === today.getDate() &&
      inputDate.getMonth() === today.getMonth() &&
      inputDate.getFullYear() === today.getFullYear()
    );
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };


// Capture every 2 seconds
useEffect(() => {
  
    fetchAttendance();
    const refreshInterval = setInterval(() => {
    window.location.reload();
  }, 15000); // 15 sec
  const fingerprintInterval = setInterval(async () => {
    const currentMode = localStorage.getItem("currentMode");
    if (currentMode !== "attendance") return;

    if (!capturing) return; // Don't capture if we're waiting for backend

    try {
      const res = await fetch(FINGERPRINT_API);
      const data = await res.json();

      if (data?.ErrorCode === 0 && data?.TemplateBase64) {
        const base64 = data.TemplateBase64;

        if (base64 === lastBase64) return; // Same as last, skip

        setLastBase64(base64);
        setCapturing(false); // Stop capturing temporarily

        // 🚀 Send to backend and wait for response
        const result = await verifyFingerprintTemplate(base64);

        // If backend confirms attendance marked (adjust this check as needed)
        if (result?.status === "success" || result?.message === "Attendance marked") {
          console.log("✅ Attendance done, will capture again shortly");
        }

        // Resume after delay or based on some logic
        setTimeout(() => {
          setCapturing(true); // Resume capturing
        }, 1000); // Or longer delay if needed
      }
    } catch (err) {
      console.log("❌ Fingerprint capture failed:", err.message);
    }
  }, 2000);
  const autoRefreshInterval = setInterval(() => {
      fetchAttendance();
    }, 5000);

  return () => clearInterval(fingerprintInterval); // Clean up on unmount
}, [capturing, lastBase64]);

  // useEffect(() => {
  //   fetchAttendance();
  //   const refreshInterval = setInterval(() => {
  //   window.location.reload();
  // }, 15000); // 15 sec

  //   const fingerprintInterval = setInterval(async () => {
  //     const currentMode = localStorage.getItem("currentMode");
  //     if (currentMode !== "attendance") return;

  //     // ➤ Don't capture again if already processing
  //     if (!capturing) return;

  //     try {
  //       const res = await fetch(FINGERPRINT_API);
  //       const data = await res.json();

  //       if (data?.ErrorCode === 0 && data?.TemplateBase64) {
  //         const base64 = data.TemplateBase64;

  //         if (base64 === lastBase64) return; // Avoid duplicate
  //         setLastBase64(base64);

  //         setCapturing(false); // 🚫 Pause capturing until response handled
  //         await verifyFingerprintTemplate(base64); // ➤ Wait for backend to respond
  //         setCapturing(true); // ✅ Resume after done
  //       }
  //     } catch (err) {
  //       console.log("❌ Fingerprint capture failed:", err.message);
  //     }
  //   }, 2000);

  //   const autoRefreshInterval = setInterval(() => {
  //     fetchAttendance();
  //   }, 5000);

  //   return () => {
  //     clearInterval(fingerprintInterval);
  //     clearInterval(autoRefreshInterval);
  //   };
  // }, [lastBase64, capturing]);

  return (
    <Layout>
      <div className="container mt-4">
        <h3>📋 Attendance List</h3>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p>Verifying fingerprint...</p>
          </div>
        )}
        <div className="text-right mt-3">
          <label className="text-sm text-gray-600">
            <input
              type="checkbox"
              checked={filterToday}
              onChange={() => setFilterToday(!filterToday)}
              className="mr-2"
            />
            Show only today’s records
          </label>
        </div>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Candidate Name</th>
              <th>Service</th>
              <th>Package</th>
              <th>Branch</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData?.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center">
                  No records found.
                </td>
              </tr>
            ) : (
              attendanceData
                .filter((item) => !filterToday || isToday(item.attendanceDate))
                .map((item, index) => (
                  <tr key={item.attendanceId || index}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.serviceName}</td>
                    <td>{item.packageName}</td>
                    <td>{item.branchName}</td>
                    <td>{formatDate(item.attendanceDate)}</td>
                    <td>{item.inTime}</td>
                  </tr>
                ))
            )}
          </tbody>
        </Table>
      </div>
    </Layout>
  );
};

export default Attendance;

// import React, { useEffect, useState } from "react";
// import Layout from "@/components/Layout";
// import axios from "axios";

// const ATTENDANCE_API = "http://localhost:7081/Bio/GetAllAttendance";
// const FINGERPRINT_API = "https://localhost:8000/SGIFPCapture";

// const VERIFY_API = "http://localhost:7081/Bio/VerifyAttendanceByFingerprintTemplate";

// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const AttendancePage = () => {
//   const [attendanceList, setAttendanceList] = useState([]);
//   const [filterToday, setFilterToday] = useState(false);
//   const [lastBase64, setLastBase64] = useState("");
//   const [capturing, setCapturing] = useState(true);

//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${ATTENDANCE_API}/GetAllAttendance`);
//       setAttendanceList(res.data);
//     } catch (err) {
//       console.error("❌ Fetch Attendance Error:", err);
//     }
//   };

//   const verifyFingerprintTemplate = async (base64) => {
//     try {
//       const res = await axios.post(VERIFY_API, { template1: base64 });
//       console.log("✅ Verified:", res.data.message);
//     } catch (err) {
//       console.error("❌ Verification Error:", err.message);
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();

//     const fingerprintInterval = setInterval(async () => {
//       const currentMode = localStorage.getItem("currentMode");
//       if (currentMode !== "attendance" || !capturing) return;

//       try {
//         const res = await fetch(FINGERPRINT_API);
//         const data = await res.json();

//         if (data?.ErrorCode === 0 && data?.TemplateBase64) {
//           const base64 = data.TemplateBase64;
//           if (base64 === lastBase64) return;

//           setLastBase64(base64);
//           setCapturing(false); // Stop further polling

//           await verifyFingerprintTemplate(base64);

//           setTimeout(() => {
//             setCapturing(true); // Resume polling
//           }, 500); // Small delay
//         }
//       } catch (err) {
//         console.error("❌ Fingerprint Error:", err.message);
//       }
//     }, 5000);

//     const autoRefreshInterval = setInterval(() => {
//       fetchAttendance();
//     }, 50000);

//     return () => {
//       clearInterval(fingerprintInterval);
//       clearInterval(autoRefreshInterval);
//     };
//   }, [lastBase64, capturing]);

//   const filteredList = filterToday
//     ? attendanceList.filter((item) => {
//         const today = new Date();
//         const attendanceDate = new Date(item.attendanceDate);
//         return (
//           attendanceDate.getDate() === today.getDate() &&
//           attendanceDate.getMonth() === today.getMonth() &&
//           attendanceDate.getFullYear() === today.getFullYear()
//         );
//       })
//     : attendanceList;

//   return (
//     <Layout>
//       <div className="p-6">
//         <div className="text-right mb-4">
//           <label className="text-sm text-gray-600">
//             <input
//               type="checkbox"
//               checked={filterToday}
//               onChange={() => setFilterToday(!filterToday)}
//               className="mr-2"
//             />
//             Show only today’s records
//           </label>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full table-auto border border-gray-300 text-sm">
//             <thead className="bg-gray-200">
//               <tr>
//                 <th className="border px-2 py-1">#</th>
//                 <th className="border px-2 py-1">Candidate Name</th>
//                 <th className="border px-2 py-1">Service</th>
//                 <th className="border px-2 py-1">Branch</th>
//                 <th className="border px-2 py-1">Attendance Date</th>
//                 <th className="border px-2 py-1">Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredList.length > 0 ? (
//                 filteredList.map((item, index) => {
//                   const time = new Date(item.attendanceDate).toLocaleTimeString("en-IN", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                     second: "2-digit",
//                     hour12: true,
//                   });

//                   return (
//                     <tr key={item.attendanceId} className="text-center">
//                       <td className="border px-2 py-1">{index + 1}</td>
//                       <td className="border px-2 py-1">{item.candidateName}</td>
//                       <td className="border px-2 py-1">{item.serviceName}</td>
//                       <td className="border px-2 py-1">{item.branchName}</td>
//                       <td className="border px-2 py-1">{formatDate(item.attendanceDate)}</td>
//                       <td className="border px-2 py-1">{time}</td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td className="border px-2 py-1 text-center" colSpan={6}>
//                     No records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default AttendancePage;
