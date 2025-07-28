
import React, { useState } from "react";
import Layout from "../../components/Layout";
import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Table,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../../components/ReportPDF";



const reportConfig = {
  candidate: {
    label: "Candidate",
    api: "http://localhost:7081/Bio/GetCandidateReportByDate",
    columns: [
      "#", "Name", "Gender", "Address", "Mobile", "DOJ",
      "PackageAmount", "Balance", "From Date", "To Date",
    ],
    rowMapper: (item, index) => [
      index + 1,
      item.name,
      item.gender,
      item.address,
      item.mobileNumber,
      new Date(item.dob).toLocaleDateString(),
      item.packageAmount,
      item.balanceAmount,
      new Date(item.fromDate).toLocaleDateString(),
      new Date(item.toDate).toLocaleDateString(),
      // new Date(item.createdDate).toLocaleDateString(),
    ],
  },

  trainer: {
    label: "Trainer",
    api: "http://localhost:7081/Bio/GetTrainerReportByDate",
    columns: [
      "#", "Name", "Age", "Address", "Mobile",
      "Joining Date", "Created Date",
    ],
    rowMapper: (item, index) => [
      index + 1,
      item.name,
      item.age,
      item.address,
      item.mobileNumber,
      new Date(item.joiningDate).toLocaleDateString(),
      new Date(item.createdDate).toLocaleDateString(),
    ],
  },

  attendance: {
    label: "Attendance",
    api: "http://localhost:7081/Bio/GetAttendanceReportByDate",
    columns: ["#", "Candidate Name", "Date", "In Time"],
    rowMapper: (item, index) => [
      index + 1,
      item.candidateName,
      new Date(item.attendanceDate).toLocaleDateString(),
      item.inTime,
      // item.outTime,
    ],
  },

  payment: {
    label: "Payment",
    api: "http://localhost:7081/Bio/GetPaymentReportByDate",
    columns: [
      "#", "Candidate Name", "Service ID", "Payment Mode", "Amount",
      "Balance", "Collected By", "Created Date",
    ],
    rowMapper: (item, index) => [
      index + 1,
      item.name,
      item.serviceId,
      item.paymentmode,
      item.paymentAmount,
      item.balanceAmount,
      item.collectedby,
      new Date(item.createdDate).toLocaleDateString(),
    ],
  },
};

const Report = () => {
  const [reportType, setReportType] = useState("candidate");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const config = reportConfig[reportType];
  const today = new Date().toISOString().split("T")[0];

  const handleGenerate = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both From and To dates.");
      setData([]);
      return;
    }

    try {
      setError("");
      setLoading(true);
      const response = await axios.get(
        `${config.api}?fromDate=${fromDate}&toDate=${toDate}`
      );
      const result = response.data || [];
      setData(result);
      if (result.length === 0) {
        setError("No data found for the selected date range.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch report data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="mb-4 display-5 fw-bold">{config.label} Report</h2>

        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Form>
              <Row className="g-3 mb-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select
                      value={reportType}
                      onChange={(e) => {
                        setReportType(e.target.value);
                        setData([]);
                        setError("");
                      }}
                    >
                      <option value="candidate">Candidate</option>
                      <option value="trainer">Trainer</option>
                      <option value="attendance">Attendance</option>
                      <option value="payment">Payment</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      max={today}
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      max={today}
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" onClick={handleGenerate}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>

              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
            </Form>
          </Card.Body>
        </Card>

        {data.length > 0 && (
          <Card className="shadow-sm">
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    {config.columns.map((col, i) => (
                      <th key={i}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      {config.rowMapper(item, index).map((cell, i) => (
                        <td key={i}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="mt-3 text-end">
                <PDFDownloadLink
                  document={
                    <ReportPDF
                      config={config}
                      data={data}
                      fromDate={fromDate}
                      toDate={toDate}
                    />
                  }
                  fileName={`${config.label}_Report_${fromDate}_to_${toDate}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <Button variant="outline-secondary" disabled>
                        Preparing PDF...
                      </Button>
                    ) : (
                      <Button variant="outline-danger">Download PDF</Button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Report;
