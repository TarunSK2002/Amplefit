import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { UserPlus, Search } from "lucide-react";

const TrainerEnrollment = () => {
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [fingerprintId, setFingerprintId] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [branches, setBranches] = useState([]);
  const [capturedTemplates, setCapturedTemplates] = useState([
    null,
    null,
    null,
  ]);
  const [formData, setFormData] = useState({
    password: "",
    name: "",
    phone: "",
    age: "",
    address: "",
    joiningDate: "",
    branchId: "",
  });

  const captureAPI = "https://localhost:8000/SGIFPCapture";
  const baseURL = "http://localhost:7081/Bio";

  useEffect(() => {
    fetchTrainers();
    fetchBranches();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await axios.get(`${baseURL}/GetAlltrainer`);
      setTrainers(res.data || []);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${baseURL}/GetAllBranches`);
      setBranches(res.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  const handleOpen = () => {
    const newPassword = `TRN${Date.now().toString().slice(-5)}`;
    setFormData({
      password: newPassword,
      name: "",
      phone: "",
      age: "",
      address: "",
      joiningDate: "",
    });
    setCapturedImages([null, null, null]);
    setFingerprintId(0);
    setStep(0);
    setShowModal(true);
  };

  const handleClose = async () => {
    localStorage.setItem("currentMode", "attendance");

    if (step === 1 && fingerprintId > 0) {
      try {
        await axios.delete(`${baseURL}/DeleteFingerprint/${fingerprintId}`);
        console.log("❌ Unused fingerprint deleted");
      } catch (err) {
        console.error("Failed to delete unused fingerprint:", err);
      }
    }

    setShowModal(false);
    setStep(0);
    setFingerprintId(0);
    setCapturedImages([null, null, null]);
    setCapturedTemplates([null, null, null]);
  };

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
      role: "Trainer",
      fingerPrint1: capturedTemplates[0],
      fingerPrint2: capturedTemplates[1],
      fingerPrint3: capturedTemplates[2],
      createdDate: new Date().toISOString().slice(0, 10),
    };

    try {
      await axios.post(`${baseURL}/AddFingerPrint`, payload); // 👈 using new endpoint that accepts templates
      const res = await axios.get(`${baseURL}/GetAllFingerprints`);
      const fingerprints = res.data;
      if (Array.isArray(fingerprints) && fingerprints.length > 0) {
        fingerprints.sort((a, b) => b.fingerPrintID - a.fingerPrintID);
        setFingerprintId(fingerprints[0].fingerPrintID); // ✅ fix
      }
      setStep(1);
    } catch {
      alert("❌ Failed to save fingerprint to database");
    }
  };

  const handleAddTrainer = async () => {
    const { name, phone, age, address, joiningDate, password } = formData;
    if (!name || !phone || !age || !address || !joiningDate || !password) {
      alert("Please fill all required fields.");
      return;
    }

    const branches = [
      { branchId: 1, branchName: "Chennai" },
      { branchId: 2, branchName: "Bangalore" },
    ];

    const trainerPayload = {
      password,
      name,
      mobileNumber: phone,
      age: parseInt(age),
      address,
      joiningDate: new Date().toISOString().slice(0, 10),
      isActive: true,
      fingerPrintID: fingerprintId,
      branchId: formData.branchId,
      createdDate: new Date().toISOString().slice(0, 10),

    };

    try {
      await axios.post(`${baseURL}/AddOrUpdateTrainer`, trainerPayload);
      alert("Trainer added successfully!");
      fetchTrainers();
      handleClose();
    } catch (err) {
      console.error("Error saving trainer:", err);
      alert("Failed to save trainer.");
    }
  };

  const handleToggleActive = async (trainer) => {
    const updatedTrainer = {
      ...trainer,
      isActive: !trainer.isActive,
    };

    try {
      await axios.post(`${baseURL}/AddOrUpdateTrainer`, updatedTrainer, {
        headers: { "Content-Type": "application/json" },
      });
      alert(
        `Trainer ${updatedTrainer.name} is now ${
          updatedTrainer.isActive ? "Active" : "Inactive"
        }`
      );
      fetchTrainers();
    } catch (err) {
      console.error("Failed to update active status:", err);
      alert("Failed to update trainer status.");
    }
  };

  const allFingersCaptured = capturedImages.every((img) => img !== null);

  const filteredTrainers = trainers.filter((t) =>
    t.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="display-5 fw-bold">Trainer Management</h2>
            <p className="text-muted">View and manage enrolled trainers</p>
          </div>
          <Button variant="primary" onClick={handleOpen} className="d-flex">
            <UserPlus size={18} className="me-2 mt-1" />
            Add Trainer
          </Button>
        </div>

        <Row className="g-3 mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
        </Row>

        {filteredTrainers.length === 0 ? (
          <div className="text-center text-muted py-5">
            No trainers enrolled yet. Click "Add Trainer" to get started.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Branch</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrainers.map((t, index) => (
                  <tr key={t.trainerId}>
                    <td>{index + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.mobileNumber}</td>
                    <td>{branches.find((b) => b.branchId === t.branchId)?.branchName || "N/A"}</td>
                    <td className="text-center">
                      <Form.Check
                        type="switch"
                        id={`active-switch-${t.trainerId}`}
                        checked={t.isActive}
                        onChange={() => handleToggleActive(t)}
                        label={t.isActive ? "Active" : "Inactive"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal show={showModal} onHide={handleClose} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {step === 0 ? "Capture Fingerprints" : "Trainer Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {step === 0 && (
              <>
                <p className="text-muted">
                  Please capture 3 fingerprints before proceeding.
                </p>
                <Row>
                  {["Left Thumb", "Right Thumb", "Index Finger"].map(
                    (label, i) => (
                      <Col md={4} key={i} className="text-center">
                        <div className="border p-3 bg-light rounded d-flex flex-column align-items-center">
                          <p className="mb-2">{label}</p>
                          {capturedImages[i] ? (
                            <img
                              src={`data:image/bmp;base64,${capturedImages[i]}`}
                              width="100"
                              height="130"
                              alt="Fingerprint"
                              className="mt-2 border mb-2 rounded"
                            />
                          ) : (
                            <div className="bg-white border p-4 mb-2 text-center w-100">
                              Not Captured
                            </div>
                          )}
                          <Button
                            variant="outline-primary"
                            onClick={() => captureFingerprint(i)}
                            disabled={loading}
                          >
                            {loading ? <Spinner size="sm" /> : "Capture"}
                          </Button>
                        </div>
                      </Col>
                    )
                  )}
                </Row>

                {allFingersCaptured && (
                  <div className="text-end mt-4">
                    <Button variant="primary" onClick={handleSaveFingerprints}>
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}

            {step === 1 && (
              <Form>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        placeholder="Enter password"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Age</Form.Label>
                      <Form.Control
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        placeholder="Enter age"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Joining</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.joiningDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            joiningDate: e.target.value,
                          })
                        }
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter address"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fingerprint ID</Form.Label>
                      <Form.Control
                        value={fingerprintId || "Loading..."}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Branch</Form.Label>
                      <Form.Select
                        value={formData.branchId?.toString() || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, branchId: e.target.value })
                        }
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.branchId} value={branch.branchId}>
                            {branch.branchName}
                          </option>
                        ))}
                      </Form.Select>
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
              <Button variant="success" onClick={handleAddTrainer}>
                Save Trainer
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </Layout>
  );
};

export default TrainerEnrollment;
