import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [candidateId, setCandidateId] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [amount, setAmount] = useState("");
  const [balanceAmount, setBalanceAmount] = useState("");
  const [mode, setMode] = useState("cash");
  const [collectedBy, setCollectedBy] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [role, setRole] = useState("");

  const API = "http://localhost:7081/Bio";

  useEffect(() => {
    fetchPayments();
    fetchSessionUser();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API}/GetAllpayment`);
      setPayments(res.data || []);
    } catch (err) {
      console.error("Error fetching payments:", err);
    }
  };

  // const fetchSessionUser = () => {
  //   const user = JSON.parse(localStorage.getItem("user"));
  //   if (user?.userName) {
  //     setCollectedBy(user.userName,user.role); // ✅ send this in collectedby
  //   }
  //   if (user?.sessionId) {
  //     setSessionId(user.sessionId); // ✅ send this in headers only
  //   }
  // };
  const fetchSessionUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.userName) {
      setCollectedBy(user.userName);
    }
    if (user?.role) {
      setRole(user.role);
    }
    if (user?.sessionId) {
      setSessionId(user.sessionId);
    }
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`${API}/GetAllCandidate`);
        setCandidates(res.data); // adjust if response structure is different
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, []);

  const fetchCandidate = async (id) => {
    try {
      const res = await axios.get(`${API}/GetAllcandidatebyID?id=${id}`);
      const data = res.data;

      if (data) {
        const candidateBalance = data.balanceAmount || 0;

        if (candidateBalance <= 0) {
          alert("Payment already completed for this candidate.");
          resetForm();
          setShowModal(false);
          return;
        }

        setCandidateName(data.name || "");
        setServiceId(data.serviceId || "");
        setBalanceAmount(candidateBalance);
        setAmount(candidateBalance.toString());

        if (data.serviceId) {
          fetchServiceName(data.serviceId);
        }
      }
    } catch (err) {
      alert("Candidate not found");
      console.error(err);
    }
  };

  const fetchServiceName = async (id) => {
    try {
      const res = await axios.get(`${API}/GetbyidServicetable?id=${id}`);
      setServiceName(res.data?.serviceName || "N/A");
    } catch (err) {
      console.error("Error fetching service:", err);
    }
  };

  // const handleAddPayment = async () => {
  //   if (!candidateId || !serviceId || !amount) {
  //     return alert("Please fill all required fields");
  //   }

  //   try {
  //     const today = new Date().toISOString().split("T")[0];

  //     const payload = {
  //       CandidateId: parseInt(candidateId),
  //       Name: candidateName,
  //       ServiceId: parseInt(serviceId),
  //       BalanceAmount: parseFloat(balanceAmount || 0),
  //       PaymentAmount: parseFloat(amount),
  //       Paymentmode: mode,
  //       collectedby: collectedBy, // ✅ sending user name
  //       CreatedDate: today,
  //       UpdatedDate: today,
  //     };

  //     console.log("Sending Payload:", payload);

  //     await axios.post(`${API}/Addpayment`, payload, {
  //       headers: {
  //         "X-Session-ID": sessionId, // ✅ sent only in headers
  //       },
  //     });

  //     fetchPayments();
  //     resetForm();
  //     setShowModal(false);
  //   } catch (err) {
  //     alert("Failed to add payment");
  //     console.error("Error:", err.response?.data || err.message);
  //   }
  // };

  const handleAddPayment = async () => {
    if (!candidateId || !serviceId || !amount) {
      return alert("Please fill all required fields");
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      const payload = {
        CandidateId: parseInt(candidateId),
        Name: candidateName,
        ServiceId: parseInt(serviceId),
        BalanceAmount: parseFloat(balanceAmount || 0),
        PaymentAmount: parseFloat(amount),
        Paymentmode: mode,
        collectedby: collectedBy,
        role: role, // ✅ Now included
        CreatedDate: today,
        UpdatedDate: today,
      };

      await axios.post(`${API}/Addpayment`, payload, {
        headers: {
          "X-Session-ID": sessionId,
        },
      });

      fetchPayments();
      resetForm();
      setShowModal(false);
      alert("Payment submitted successfully!");
    } catch (err) {
      alert("Failed to add payment");
      console.error("Error:", err.response?.data || err.message);
    }
  };
  
  const resetForm = () => {
    setCandidateId("");
    setCandidateName("");
    setServiceId("");
    setServiceName("");
    setAmount("");
    setBalanceAmount("");
    setMode("cash");
  };

  return (
    <Layout>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Payment Management</h4>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Payment
          </Button>
        </div>

        {/* Modal */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          centered
          size="md"
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Candidate ID</Form.Label>
                  <Form.Control
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    onBlur={() => fetchCandidate(candidateId)}
                    placeholder="Enter ID"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control value={candidateName} disabled />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Service</Form.Label>
                  <Form.Control value={serviceName} disabled />
                </Col>
                <Col md={6}>
                  <Form.Label>Balance Amount</Form.Label>
                  <Form.Control value={balanceAmount} disabled />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Payment Amount</Form.Label>
                  <Form.Control
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </Col>
                <Col md={6}>
                  <Form.Label>Payment Mode</Form.Label>
                  <Form.Select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddPayment}>
              Submit Payment
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Payments Table */}
        <div className="bg-white p-4 rounded shadow">
          <h5 className="mb-3">All Payments</h5>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Receipt No</th>
                  <th>Candidate</th>
                  <th>Service ID</th>
                  <th>Amount</th>
                  <th>Balance</th>
                  <th>Mode</th>
                  <th>Collected By</th>
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-muted">
                      No payments found
                    </td>
                  </tr>
                ) : (
                  payments.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.paymentReceiptNo || "N/A"}</td>
                      <td>{p.name}</td>
                      <td>{p.serviceId}</td>
                      <td>₹{p.paymentAmount}</td>
                      {/* <td className="text-danger fw-semibold">
                        ₹{candidates.find((c) => c.candidateId === p.candidateId)?.balanceAmount ?? 0}
                      </td> */}
                      <td className="text-danger fw-semibold">
                        ₹{p.balanceAmount ?? 0}
                      </td>
                      <td className="text-capitalize">{p.paymentmode}</td>
                      <td>{p.collectedby}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Payment;
