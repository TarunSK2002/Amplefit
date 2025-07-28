import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
  const [candidateId, setCandidateId] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [lastBase64, setLastBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterToday, setFilterToday] = useState(true);

  const FINGERPRINT_API = "https://localhost:8000/SGIFPCapture";

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`http://localhost:7081/Bio/GetAllAttendance`);
      setAttendanceList(res.data);
    } catch (err) {
      console.error("Error fetching attendance:", err.message);
      setAttendanceList([]);
    }
  };

  const addAttendance = async () => {
    if (!candidateId) return toast.warn("Candidate ID is required");

    try {
      setLoading(true);
      const verifyRes = await axios.post(
        "http://localhost:7081/Bio/VerifyAttendanceByCandidateId",
        { candidateId: parseInt(candidateId) }
      );

      const message = verifyRes.data;

      if (verifyRes.status === 200) {
        if (typeof message === "string") {
          if (message.includes("Attendance marked")) {
            toast.success("✅ " + message);
            fetchAttendance();
            setCandidateId("");
          } else if (message.includes("already marked")) {
            toast.info("ℹ️ " + message);
          } else {
            toast.error("❌ " + message);
          }
        } else {
          toast.error("❌ Unexpected response.");
        }
      } else {
        toast.error("❌ Candidate verification failed.");
      }
    } catch (err) {
      toast.error("❌ Error verifying candidate.");
    } finally {
      setLoading(false);
    }
  };

  const markAttendanceByFingerprint = async (liveTemplate) => {
    try {
      setLoading(true);

      // 1. Get all stored fingerprints
      const storedRes = await axios.get(
        "http://localhost:7081/Bio/GetAllFingerprints"
      );
      const storedTemplates = storedRes.data; // Array of {fingerPrintID, role, fingerPrint1, fingerPrint2, fingerPrint3}

      // 2. Loop through and match
      for (const record of storedTemplates) {
        const fingerprints = [
          record.fingerPrint1,
          record.fingerPrint2,
          record.fingerPrint3,
        ];

        for (const storedTemplate of fingerprints) {
          if (!storedTemplate) continue;

          const params = `template1=${encodeURIComponent(
            liveTemplate
          )}&template2=${encodeURIComponent(
            storedTemplate
          )}&licstr=&templateFormat=ISO`;

          const matchRes = await fetch("https://localhost:8000/SGIMatchScore", {
            method: "POST",
            body: params,
          });

          const matchResult = await matchRes.json();

          if (matchResult.ErrorCode === 0 && matchResult.MatchingScore >= 140) {
            // Matched successfully — mark attendance
            const verifyRes = await axios.post("http://localhost:7081/Bio/VerifyAttendanceByFingerprintId",
              {
                fingerPrintID: record.fingerPrintID,
              }
            );

            const msg = verifyRes.data;

            if (msg.includes("Attendance marked")) {
              toast.success(
                "✅ Attendance marked via fingerprint for ID: " +
                  record.fingerPrintID
              ); // ✅ FIXED
              setCandidateId(record.fingerPrintID.toString()); // ✅ FIXED

              setCandidateId(record.candidateId.toString());
              fetchAttendance();
            } else {
              toast.info("ℹ️ " + msg);
            }

            return; // stop after first successful match
          }
        }
      }

      toast.error("❌ No fingerprint match found.");
    } catch (err) {
      console.error(err);
      toast.error("❌ Error during fingerprint matching.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();

    const fingerprintInterval = setInterval(async () => {
      const currentMode = localStorage.getItem("currentMode");
      if (currentMode !== "attendance") return;

      try {
        const res = await fetch(FINGERPRINT_API);
        const data = await res.json();

        if (data?.ErrorCode === 0 && data?.TemplateBase64) {
          const base64 = data.TemplateBase64;

          if (base64 === lastBase64) return;
          setLastBase64(base64);

          await markAttendanceByFingerprint(base64);
        }
      } catch (err) {
        console.log("❌ Fingerprint capture failed:", err.message);
      }
    }, 5000);

    const autoRefreshInterval = setInterval(() => {
      fetchAttendance();
    }, 50000);

    return () => {
      clearInterval(fingerprintInterval);
      clearInterval(autoRefreshInterval);
    };
  }, [lastBase64]);

  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  const filteredList = filterToday
    ? attendanceList.filter((a) => {
        const attDate = new Date(a.attendanceDate);
        const formattedAttDate = `${String(attDate.getDate()).padStart(
          2,
          "0"
        )}-${String(attDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${attDate.getFullYear()}`;
        return formattedAttDate === formattedToday;
      })
    : attendanceList;

  return (
    <Layout>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600 mt-2">
              Mark attendance by Fingerprint or Candidate ID
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Attendance by Candidate ID</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter Candidate ID"
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                />
                <Button disabled={loading} onClick={addAttendance}>
                  {loading ? "Marking..." : "Submit"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-right">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-500" />
              Attendance Records
            </CardTitle>
            <CardDescription>Auto-refreshed every 10s</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 text-left">Candidate Name</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">In Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length > 0 ? (
                    filteredList.map((att, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2">{att.candidateName}</td>
                        <td className="p-2">
                          {(() => {
                            const d = new Date(att.attendanceDate);
                            return `${String(d.getDate()).padStart(
                              2,
                              "0"
                            )}-${String(d.getMonth() + 1).padStart(
                              2,
                              "0"
                            )}-${d.getFullYear()}`;
                          })()}
                        </td>
                        <td className="p-2">{att.inTime}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-4 text-center text-gray-500">
                        No attendance records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Attendance;
