// import React, { useEffect, useState } from "react";
// import Layout from "../../components/Layout";
// import {
//   Button,
//   Modal,
//   Input,
//   Form,
//   Table,
//   Typography,
//   Space,
//   notification,
// } from "antd";
// import axios from "axios";

// const { Title } = Typography;

// const Services = () => {
//   const [showServiceModal, setShowServiceModal] = useState(false);
//   const [showPackageModal, setShowPackageModal] = useState(false);

//   const [services, setServices] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [serviceForm] = Form.useForm();
//   const [packageForm] = Form.useForm();

//   const API = "http://localhost:7081/Bio";

//   // Fetch Services
//   const fetchServices = async () => {
//     try {
//       const res = await axios.get(`${API}/GetallServicetable`);
//       setServices(res.data || []);
//     } catch (err) {
//       console.error("Error fetching services:", err);
//     }
//   };

//   // Fetch Packages
//   const fetchPackages = async () => {
//     try {
//       const res = await axios.get(`${API}/GetAllPackagetable`);
//       setPackages(res.data || []);
//     } catch (err) {
//       console.error("Error fetching packages:", err);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//     fetchPackages();
//   }, []);

//   // Add Service
//   const handleAddService = async (values) => {
//     try {
//       await axios.post(`${API}/AddServicetable`, {
//         serviceName: values.serviceName,
//       });
//       notification.success({ message: "Service added successfully" });
//       serviceForm.resetFields();
//       fetchServices();
//     } catch (err) {
//       console.error(err);
//       notification.error({ message: "Failed to add service" });
//     }
//   };

//   // Add Package
//   const handleAddPackage = async (values) => {
//     try {
//       await axios.post(`${API}/AddPackagetable`, {
//         packageName: values.packageName,
//         packageAmount: parseFloat(values.packageAmount),
//       });
//       notification.success({ message: "Package added successfully" });
//       packageForm.resetFields();
//       fetchPackages();
//     } catch (err) {
//       console.error(err);
//       notification.error({ message: "Failed to add package" });
//     }
//   };

//   // Table Columns
//   const serviceColumns = [
//     {
//       title: "#",
//       key: "index",
//       width: "10%",
//       render: (text, record, index) => index + 1,
//     },
//     {
//       title: "Service Name",
//       dataIndex: "serviceName",
//       key: "serviceName",
//     },
//   ];

//   const packageColumns = [
//     {
//       title: "ID",
//       // dataIndex: "packageId",
//       render: (text, record, index) => index + 1,
//       key: "packageId",
//       width: "10%",
//     },
//     {
//       title: "Package Name",
//       dataIndex: "packageName",
//       key: "packageName",
//     },
//     {
//       title: "Amount (₹)",
//       dataIndex: "packageAmount",
//       key: "packageAmount",
//     },
//   ];

//   return (
//     <Layout>
//       <div className="p-6 max-w-5xl mx-auto">
//         <Title level={2} className="display-5 fw-bold">Services Management</Title>
//         <p className="text-gray-500 mb-6">
//           Manage your services and training packages
//         </p>

//         <Space className="mb-6">
//           <Button type="primary" onClick={() => setShowServiceModal(true)}>
//             Service Master
//           </Button>
//           <Button type="primary" onClick={() => setShowPackageModal(true)}>
//             Package Master
//           </Button>
//         </Space>

//         {/* ---------- SERVICE MODAL ---------- */}
//         <Modal
//           title="Add New Service"
//           open={showServiceModal}
//           onCancel={() => setShowServiceModal(false)}
//           footer={null}
//         >
//           <Form
//             form={serviceForm}
//             layout="vertical"
//             onFinish={handleAddService}
//           >
//             <Form.Item
//               name="serviceName"
//               label="Service Name"
//               rules={[{ required: true, message: "Please enter service name" }]}
//             >
//               <Input placeholder="e.g. Yoga, Zumba" />
//             </Form.Item>
//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Add Service
//               </Button>
//             </Form.Item>
//           </Form>

//           <Table
//             columns={serviceColumns}
//             dataSource={services}
//             rowKey="serviceId"
//             size="small"
//             pagination={false}
//             className="mt-4"
//           />
//         </Modal>

//         {/* ---------- PACKAGE MODAL ---------- */}
//         <Modal
//           title="Add New Package"
//           open={showPackageModal}
//           onCancel={() => setShowPackageModal(false)}
//           footer={null}
//         >
//           <Form
//             form={packageForm}
//             layout="vertical"
//             onFinish={handleAddPackage}
//           >
//             <Form.Item
//               name="packageName"
//               label="Package Name (Months)"
//               rules={[{ required: true, message: "Please enter package name" }]}
//             >
//               <Input placeholder="e.g. 3 Months" />
//             </Form.Item>

//             <Form.Item
//               name="packageAmount"
//               label="Amount (₹)"
//               rules={[
//                 { required: true, message: "Please enter package amount" },
//               ]}
//             >
//               <Input type="number" placeholder="e.g. 1500" />
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit" block>
//                 Add Package
//               </Button>
//             </Form.Item>
//           </Form>

//           <Table
//             columns={packageColumns}
//             dataSource={packages}
//             rowKey="packageId"
//             size="small"
//             pagination={false}
//             className="mt-4"
//           />
//         </Modal>
//       </div>
//     </Layout>
//   );
// };

// export default Services;





































import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import {
  Button,
  Modal,
  Input,
  Form,
  Table,
  Typography,
  Space,
  notification,
} from "antd";
import axios from "axios";

const { Title } = Typography;

const Services = () => {
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showBranchModal, setShowBranchModal] = useState(false);

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [branches, setBranches] = useState([]);

  const [serviceForm] = Form.useForm();
  const [packageForm] = Form.useForm();
  const [branchForm] = Form.useForm();

  const API = "http://localhost:7081/Bio";

  useEffect(() => {
    fetchServices();
    fetchPackages();
    fetchBranches();
  }, []);

  // Fetch Methods
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/GetallServicetable`);
      setServices(res.data || []);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const fetchPackages = async () => {
    try {
      const res = await axios.get(`${API}/GetAllPackagetable`);
      setPackages(res.data || []);
    } catch (err) {
      console.error("Error fetching packages:", err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${API}/GetAllBranches`);
      setBranches(res.data || []);
    } catch (err) {
      console.error("Error fetching branches:", err);
    }
  };

  // Add Methods
  const handleAddService = async (values) => {
    try {
      await axios.post(`${API}/AddServicetable`, {
        serviceName: values.serviceName,
      });
      notification.success({ message: "Service added successfully" });
      serviceForm.resetFields();
      fetchServices();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to add service" });
    }
  };

  const handleAddPackage = async (values) => {
    try {
      await axios.post(`${API}/AddPackagetable`, {
        packageName: values.packageName,
        packageAmount: parseFloat(values.packageAmount),
      });
      notification.success({ message: "Package added successfully" });
      packageForm.resetFields();
      fetchPackages();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to add package" });
    }
  };

  const handleAddBranch = async (values) => {
    try {
      await axios.post(`${API}/AddBranch`, {
        branchName: values.branchName,
        location: values.location,
      });
      notification.success({ message: "Branch added successfully" });
      branchForm.resetFields();
      fetchBranches();
    } catch (err) {
      console.error(err);
      notification.error({ message: "Failed to add branch" });
    }
  };

  // Table Columns
  const serviceColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
  ];

  const packageColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Package Name",
      dataIndex: "packageName",
      key: "packageName",
    },
    {
      title: "Amount (₹)",
      dataIndex: "packageAmount",
      key: "packageAmount",
    },
  ];

  const branchColumns = [
    {
      title: "#",
      key: "index",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Branch Name",
      dataIndex: "branchName",
      key: "branchName",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
  ];

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <Title level={2}>Services Management</Title>
        <p className="text-gray-500 mb-6">
          Manage your services, training packages, and branches.
        </p>

        <Space className="mb-6">
          <Button type="primary" onClick={() => setShowServiceModal(true)}>
            Service Master
          </Button>
          <Button type="primary" onClick={() => setShowPackageModal(true)}>
            Package Master
          </Button>
          <Button type="primary" onClick={() => setShowBranchModal(true)}>
            Branch Master
          </Button>
        </Space>

        {/* ---------- SERVICE MODAL ---------- */}
        <Modal
          title="Add New Service"
          open={showServiceModal}
          onCancel={() => setShowServiceModal(false)}
          footer={null}
        >
          <Form form={serviceForm} layout="vertical" onFinish={handleAddService}>
            <Form.Item
              name="serviceName"
              label="Service Name"
              rules={[{ required: true, message: "Please enter service name" }]}
            >
              <Input placeholder="e.g. Yoga, Zumba" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add Service
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={serviceColumns}
            dataSource={services}
            rowKey="serviceId"
            size="small"
            pagination={false}
            className="mt-4"
          />
        </Modal>

        {/* ---------- PACKAGE MODAL ---------- */}
        <Modal
          title="Add New Package"
          open={showPackageModal}
          onCancel={() => setShowPackageModal(false)}
          footer={null}
        >
          <Form form={packageForm} layout="vertical" onFinish={handleAddPackage}>
            <Form.Item
              name="packageName"
              label="Package Name (Months)"
              rules={[{ required: true, message: "Please enter package name" }]}
            >
              <Input placeholder="e.g. 3 Months" />
            </Form.Item>

            <Form.Item
              name="packageAmount"
              label="Amount (₹)"
              rules={[{ required: true, message: "Please enter package amount" }]}
            >
              <Input type="number" placeholder="e.g. 1500" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add Package
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={packageColumns}
            dataSource={packages}
            rowKey="packageId"
            size="small"
            pagination={false}
            className="mt-4"
          />
        </Modal>

        {/* ---------- BRANCH MODAL ---------- */}
        <Modal
          title="Add New Branch"
          open={showBranchModal}
          onCancel={() => setShowBranchModal(false)}
          footer={null}
        >
          <Form form={branchForm} layout="vertical" onFinish={handleAddBranch}>
            <Form.Item
              name="branchName"
              label="Branch Name"
              rules={[{ required: true, message: "Please enter branch name" }]}
            >
              <Input placeholder="e.g. Koramangala Branch" />
            </Form.Item>

            <Form.Item
              name="location"
              label="Location"
              rules={[{ required: true, message: "Please enter branch location" }]}
            >
              <Input placeholder="e.g. Bangalore" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Add Branch
              </Button>
            </Form.Item>
          </Form>

          <Table
            columns={branchColumns}
            dataSource={branches}
            rowKey="branchId"
            size="small"
            pagination={false}
            className="mt-4"
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Services;
