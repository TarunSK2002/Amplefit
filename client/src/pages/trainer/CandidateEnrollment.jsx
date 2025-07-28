import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { Users } from "lucide-react";
import axios from "axios";
import dayjs from "dayjs";

const CandidateEnrollment = () => {
  const [candidates, setCandidates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [newCandidateId, setNewCandidateId] = useState("");
  const [latestFingerprintId, setLatestFingerprintId] = useState(null);
  const [capturedImages, setCapturedImages] = useState([null, null, null]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [branches, setBranches] = useState([]);
  const [fingerprintId, setFingerprintId] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    mobileNumber: "",
    doj: dayjs().format("YYYY-MM-DD"),
    address: "",
    serviceId: "",
    packageId: "",
    branchId: "", // 👈 Added branchId
    packageAmount: "",
    fromDate: dayjs().format("YYYY-MM-DD"),
    toDate: "",
    paymentStatus: "Pending",
    createdDate: new Date().toISOString().slice(0, 10),
    isActive: true,
  });

  const baseURL = "http://localhost:7081/Bio";

  const generateCandidateId = () => {
    const prefix = "CAND";
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${timestamp}`;
  };

  useEffect(() => {
    // Set default mode on load
    localStorage.setItem("currentMode", "attendance");

    fetchServices();
    fetchPackages();
    fetchCandidates();
    fetchBranches();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${baseURL}/GetallServicetable`);
      setServices(res.data);
    } catch {
      alert("❌ Failed to fetch services");
    }
  };
  const fetchBranches = async () => {
    const res = await fetch(`${baseURL}/GetAllBranches`); // or axios.get(...)
    const data = await res.json();
    setBranches(data);
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${baseURL}/GetAllPackagetable`);
      setPackages(res.data);
    } catch {
      alert("❌ Failed to fetch packages");
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${baseURL}/GetAllcandidate`);
      setCandidates(res.data);
    } catch {
      alert("❌ Failed to fetch candidate list");
    }
  };

  useEffect(() => {
    if (formData.packageId) {
      const selectedPackage = packages.find(
        (p) => p.packageId === parseInt(formData.packageId)
      );
      if (selectedPackage) {
        let months = 0;
        switch (selectedPackage.packageName) {
          case "Monthly":
            months = 1;
            break;
          case "Quraterly":
            months = 3;
            break;
          case "Halfyearly":
            months = 6;
            break;
          case "Annual":
            months = 12;
            break;
          default:
            months = 0;
        }

        const fromDate = formData.dob;
        const toDate = dayjs(fromDate)
          .add(months, "month")
          .format("YYYY-MM-DD");

        setFormData((prev) => ({
          ...prev,
          packageAmount: selectedPackage.packageAmount,
          packageMonths: months,
          fromDate,
          toDate,
        }));
      }
    }
  }, [formData.packageId, formData.dob]);

  const [capturedTemplates, setCapturedTemplates] = useState([
    null,
    null,
    null,
  ]);

  const captureFingerprint = async (index) => {
    const params = `Timeout=10000&Quality=50&licstr=&templateFormat=ISO`; // update `licstr` if needed

    try {
      const res = await fetch("https://localhost:8000/SGIFPCapture", {
        method: "POST",
        body: params,
      });

      const data = await res.json();
      if (data.ErrorCode === 0) {
        const updatedImages = [...capturedImages];
        const updatedTemplates = [...capturedTemplates];

        updatedImages[index] = data.BMPBase64;
        updatedTemplates[index] = data.TemplateBase64;

        setCapturedImages(updatedImages);
        setCapturedTemplates(updatedTemplates);
      } else {
        alert("Capture Error: " + data.ErrorCode);
      }
    } catch (err) {
      alert("Error capturing fingerprint: " + err.message);
    }
  };

  const handleSaveFingerprints = async () => {
    const payload = {
      fingerPrintID: 0,
      role: "Candidate",
      fingerPrint1: capturedTemplates[0],
      fingerPrint2: capturedTemplates[1],
      fingerPrint3: capturedTemplates[2],
      createdDate: new Date().toISOString().slice(0, 10),
    };

    try {
      await axios.post(`${baseURL}/AddFingerPrint`, payload);
      const res = await axios.get(`${baseURL}/GetAllFingerprints`);
      const fingerprints = res.data;
      if (Array.isArray(fingerprints) && fingerprints.length > 0) {
        fingerprints.sort((a, b) => b.fingerPrintID - a.fingerPrintID);
        setFingerprintId(fingerprints[0].fingerPrintID); // ✅ Save to state
      }
      setStep(1); // If you're using steps
    } catch (err) {
      alert("❌ Failed to save fingerprint to database");
    }
  };

  const handleAddCandidate = async () => {
    const payload = {
      candidateId: 0,
      name: formData.name,
      gender: formData.gender,
      address: formData.address,
      mobileNumber: formData.mobileNumber,
      doj: formData.dob,
      serviceId: parseInt(formData.serviceId),
      packageId: parseInt(formData.packageId),
      branchId: parseInt(formData.branchId), // 👈 Added
      packageMonths: formData.packageMonths,
      packageAmount: formData.packageAmount,
      balanceAmount: formData.packageAmount,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      paymentStatus: formData.paymentStatus,
      fingerPrintID: fingerprintId,
      isActive: formData.isActive,
      createdDate: new Date().toISOString().slice(0, 10),
    };

    try {
      await axios.post(`${baseURL}/AddOrUpdateCandidate`, payload);
      setCandidates([...candidates, payload]);
      handleClose();
    } catch {
      alert("Failed to save candidate to database");
    }
  };

  const handleOpen = () => {
    localStorage.setItem("currentMode", "enrollment");

    setShowModal(true);
    setStep(0);
    setNewCandidateId(generateCandidateId());
    setFormData({
      name: "",
      gender: "",
      mobileNumber: "",
      dob: dayjs().format("YYYY-MM-DD"),
      address: "",
      serviceId: "",
      packageId: "",
      packageMonths: "",
      packageAmount: "",
      fromDate: dayjs().format("YYYY-MM-DD"),
      toDate: "",
      paymentStatus: "Pending",
      createdDate: new Date().toISOString().slice(0, 10),
      isActive: true,
    });
    setCapturedImages([null, null, null]);
    setLatestFingerprintId(null);
  };

  const handleClose = async () => {
    localStorage.setItem("currentMode", "attendance");

    // 🧹 Delete fingerprint if user closes modal before saving candidate
    if (step === 1 && latestFingerprintId) {
      try {
        await axios.delete(
          `${baseURL}/DeleteFingerprint/${latestFingerprintId}`
        );
        console.log("🗑️ Deleted unused fingerprint ID:", latestFingerprintId);
      } catch (err) {
        console.error("Failed to delete unused fingerprint:", err);
      }
    }

    setShowModal(false);
    setStep(0);
    setCapturedImages([null, null, null]);
    setCapturedTemplates([null, null, null]);
    setLatestFingerprintId(null);
  };

  return (
    <Layout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="display-5 fw-bold">Candidate Enrollment</h2>
          <Button variant="primary" onClick={handleOpen}>
            <Users size={18} className="me-2" /> Add Candidate
          </Button>
        </div>

        {/* Modal for Fingerprint and Candidate Form */}
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {step === 0 ? "Capture Fingerprints" : "Candidate Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {step === 0 ? (
              <>
                <p className="text-muted mb-4">
                  Capture all 3 fingerprints before proceeding.
                </p>
                <Row className="mb-3">
                  {["Left Thumb", "Right Thumb", "Index Finger"].map(
                    (label, i) => (
                      <Col md={4} key={i} className="text-center">
                        <div className="border rounded p-3 bg-light">
                          <strong>{label}</strong>
                          <br />
                          {capturedImages[i] ? (
                            <>
                              <small className="text-success">Captured</small>
                              <br />
                              <img
                                src={`data:image/bmp;base64,${capturedImages[i]}`}
                                width="100"
                                height="130"
                                alt="Fingerprint"
                                className="mt-2 border"
                              />
                            </>
                          ) : (
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="mt-2"
                              onClick={() => captureFingerprint(i)}
                            >
                              Capture
                            </Button>
                          )}
                        </div>
                      </Col>
                    )
                  )}
                </Row>
                <div className="text-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveFingerprints}
                    disabled={capturedImages.some((img) => !img)}
                  >
                    Next
                  </Button>
                </div>
              </>
            ) : (
              <Form>
                <Row className="mb-3">
                  {/* <Col md={6}>
                    <Form.Group>
                      <Form.Label>Candidate ID</Form.Label>
                      <Form.Control value={newCandidateId} readOnly />
                    </Form.Group>
                  </Col> */}
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Gender</Form.Label>
                      <Form.Select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        value={formData.mobileNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mobileNumber: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Service</Form.Label>
                      <Form.Select
                        value={formData.serviceId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            serviceId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select service</option>
                        {services.map((s) => (
                          <option key={s.serviceId} value={s.serviceId}>
                            {s.serviceName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Package</Form.Label>
                      <Form.Select
                        value={formData.packageId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            packageId: e.target.value,
                          })
                        }
                      >
                        <option value="">Select package</option>
                        {packages.map((p) => (
                          <option key={p.packageId} value={p.packageId}>
                            {p.packageName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Package Amount</Form.Label>
                      <Form.Control value={formData.packageAmount} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>From Date</Form.Label>
                      <Form.Control value={formData.fromDate} disabled />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>To Date</Form.Label>
                      <Form.Control value={formData.toDate} disabled />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Branch</Form.Label>
                      <Form.Select
                        value={formData.branchId}
                        onChange={(e) =>
                          setFormData({ ...formData, branchId: e.target.value })
                        }
                      >
                        <option value="">Select branch</option>
                        {branches.map((b) => (
                          <option key={b.branchId} value={b.branchId}>
                            {b.branchName}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Fingerprint ID</Form.Label>
                      <Form.Control
                        value={fingerprintId || "Loading..."}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            {step > 0 && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            )}
            {step === 1 && (
              <Button variant="success" onClick={handleAddCandidate}>
                Save Candidate
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <h5 className="mt-5 mb-3">All Enrolled Candidates</h5>
        <div className="table-responsive">
          <table className="table table-bordered table-hover text-center">
            <thead className="table-light">
              <tr>
                <th>#</th> {/* Replaced "Candidate ID" with serial number */}
                <th>Name</th>
                <th>Mobile</th>
                <th>Branch</th>
                <th>Amount</th>
                <th>From</th>
                <th>To</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {candidates.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted">
                    No candidates enrolled.
                  </td>
                </tr>
              ) : (
                candidates.map(
                  (
                    cand,
                    index // ✅ Added index here
                  ) => (
                    <tr key={cand.candidateId}>
                      <td>{index + 1}</td> {/* ✅ Now index is defined */}
                      <td>{cand.name}</td>
                      <td>{cand.mobileNumber}</td>
                      <td>
                        {branches.find((b) => b.branchId === cand.branchId)
                          ?.branchName || "N/A"}
                      </td>
                      <td>₹{cand.balanceAmount}</td>
                      <td>{dayjs(cand.fromDate).format("DD-MM-YYYY")}</td>
                      <td>{dayjs(cand.toDate).format("DD-MM-YYYY")}</td>
                      <td>
                        <span
                          className={`badge ${
                            cand.paymentStatus === "Paid"
                              ? "bg-success"
                              : cand.paymentStatus === "Pending"
                              ? "bg-warning text-dark"
                              : "bg-danger"
                          }`}
                        >
                          {cand.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default CandidateEnrollment;
