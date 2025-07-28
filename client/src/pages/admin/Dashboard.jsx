import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import {
  Users,
  UserPlus,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const formatMonth = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleString("default", {
    month: "short",
    year: "numeric",
  });
};

const Dashboard = () => {
  const [trainers, setTrainers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    localStorage.setItem("currentMode", "attendance");
    fetchTrainers();
    fetchCandidates();
    fetchPayments();
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await axios.get("https://localhost:7081/Bio/GetAlltrainer");
      setTrainers(data || []);
    } catch (e) {
      console.error("Trainer fetch error:", e);
    }
  };

  const fetchCandidates = async () => {
    try {
      const { data } = await axios.get("https://localhost:7081/Bio/GetAllcandidate");
      setCandidates(data || []);
    } catch (e) {
      console.error("Candidate fetch error:", e);
    }
  };

  const fetchPayments = async () => {
    try {
      const { data } = await axios.get("https://localhost:7081/Bio/GetAllpayment");
      setPayments(data || []);
    } catch (e) {
      console.error("Payment fetch error:", e);
    }
  };

  useEffect(() => {
    const rev = {};
    payments.forEach((p) => {
      const m = formatMonth(p.createdDate);
      if (!m) return;
      rev[m] = (rev[m] || 0) + (p.paymentAmount || 0);
    });

    const arr = Object.entries(rev).map(([month, revenue]) => {
      const tCount = trainers.filter(
        (t) => formatMonth(t.createdDate) === month
      ).length;
      const cCount = candidates.filter(
        (c) => formatMonth(c.createdDate) === month
      ).length;

      return { name: month, trainers: tCount, candidates: cCount, revenue };
    });

    arr.sort((a, b) => {
      const da = new Date(a.name), db = new Date(b.name);
      return da - db;
    });

    setStatsData(arr);
  }, [payments, trainers, candidates]);

  const currentMonth = formatMonth(new Date());
  const currentStats = statsData.find((item) => item.name === currentMonth);

  return (
    <Layout>
      <div className="container my-4">
        <h1 className="display-5 fw-bold">Admin Dashboard</h1>
        <p className="text-muted">Overview of your training management system</p>

        <div className="row g-4 mb-4">
          <StatCard
            color="primary"
            title="Active Trainers"
            icon={<UserPlus />}
            value={trainers.filter((t) => t.isActive).length}
            change={`+12%`}
          />
          <StatCard
            color="success"
            title="Total Candidates"
            icon={<Users />}
            value={candidates.length}
            change={`+18%`}
          />
          <StatCard
            color="warning"
            title="Monthly Revenue"
            icon={<CreditCard />}
            value={`₹${currentStats ? currentStats.revenue : 0}`}
            change="+25%"
          />
        </div>

        <div className="row g-4 mb-4">
          <ChartCard title="Growth Overview" icon={<TrendingUp />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="trainers" stroke="#0d6efd" />
                <Line type="monotone" dataKey="candidates" stroke="#198754" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Revenue" icon={<Activity />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6f42c1" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </Layout>
  );
};

function StatCard({ color, title, icon, value, change }) {
  return (
    <div className="col-md-4">
      <div className={`card border-start border-${color} border-4 shadow-sm`}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">{title}</h6>
            <div className={`text-${color}`}>{icon}</div>
          </div>
          <h4 className="fw-bold">{value}</h4>
          <small className="text-success">{change} from last month</small>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, icon, children }) {
  return (
    <div className="col-lg-6">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title d-flex align-items-center gap-2">
            {icon}
            {title}
          </h5>
          <p className="text-muted mb-3">
            {title.includes("Revenue")
              ? "Revenue trends over the past months"
              : "Trainers and candidates growth over time"}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;




























// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Layout from "../../components/Layout";
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   CreditCard,
//   TrendingUp,
//   Activity,
// } from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line,
// } from "recharts";

// const Dashboard = () => {
//   const [trainers, setTrainers] = useState([]);
//   const [candidates, setCandidates] = useState([]);
//   const [revenueData, setRevenueData] = useState([]);
//   const [statsData, setStatsData] = useState([]);

//   const today = new Date();
//   const year = today.getFullYear();

//   useEffect(() => {
//     localStorage.setItem("currentMode", "attendance");
//     fetchTrainers();
//     fetchCandidates();
//     fetchMonthlyRevenue();
//   }, []);

//   const fetchTrainers = async () => {
//     try {
//       const res = await axios.get("https://localhost:7081/Bio/GetAlltrainer");
//       setTrainers(res.data.filter(t => t.isActive));
//     } catch (err) {
//       console.error(" =>> error fetching trainers", err);
//     }
//   };

//   const fetchCandidates = async () => {
//     try {
//       const res = await axios.get("https://localhost:7081/Bio/GetAllcandidate");
//       setCandidates(res.data);
//     } catch (err) {
//       console.error(" =>> error fetching candidates", err);
//     }
//   };

//   // fetch revenue per month for current year
//   const fetchMonthlyRevenue = async () => {
//     try {
//       const monthly = [];
//       for (let m = 0; m < 12; m++) {
//         const from = new Date(year, m, 1).toISOString().split("T")[0];
//         const to = new Date(year, m + 1, 0).toISOString().split("T")[0];
//         const res = await axios.get(
//           `https://localhost:7081/Bio/GetPaymentReportByDate?fromDate=${from}&toDate=${to}`
//         );
//         const total = res.data
//           ? res.data.reduce((sum, rec) => sum + (rec.paymentAmount || 0), 0)
//           : 0;
//         monthly.push({
//           month: new Date(year, m).toLocaleString("default", { month: "short" }),
//           revenue: total,
//         });
//       }
//       setRevenueData(monthly);
//       updateStats(monthly);
//     } catch (err) {
//       console.error(" =>> error fetching revenue", err);
//     }
//   };

//   const updateStats = (monthly) => {
//     const limitedCandidates = candidates.length > 0 ? candidates : [];
//     const limitedTrainers = trainers.length > 0 ? trainers : [];
//     const data = monthly.slice(-6).map((m) => ({
//       name: m.month,
//       trainers: limitedTrainers.length, // or you can calculate monthly active additions
//       candidates: limitedCandidates.length, // same note
//       revenue: m.revenue,
//     }));
//     setStatsData(data);
//   };

//   return (
//     <Layout>
//       <div className="container my-4">
//         <div className="mb-4">
//           <h1 className="display-5 fw-bold">Admin Dashboard</h1>
//           <p className="text-muted">Overview of your training management system</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="row g-4 mb-4">
//           <div className="col-md-3">
//             <div className="card border-start border-primary border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Active Trainers</h6>
//                   <UserPlus size={18} className="text-primary" />
//                 </div>
//                 <h4 className="fw-bold">{trainers.length}</h4>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card border-start border-success border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Total Candidates</h6>
//                   <Users size={18} className="text-success" />
//                 </div>
//                 <h4 className="fw-bold">{candidates.length}</h4>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card border-start border-secondary border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Revenue This Month</h6>
//                   <Calendar size={18} className="text-secondary" />
//                 </div>
//                 {revenueData.length > 0 && (
//                   <h4 className="fw-bold">₹{revenueData[revenueData.length - 1].revenue}</h4>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="row g-4 mb-4">
//           <div className="col-lg-6">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title d-flex align-items-center gap-2">
//                   <TrendingUp className="text-primary" size={20} />
//                   Growth Overview
//                 </h5>
//                 <p className="text-muted mb-3">
//                   Cumulative counts for trainers & candidates
//                 </p>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={statsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line
//                       type="monotone"
//                       dataKey="trainers"
//                       stroke="#0d6efd"
//                       strokeWidth={2}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="candidates"
//                       stroke="#198754"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-6">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title d-flex align-items-center gap-2">
//                   <Activity className="text-success" size={20} />
//                   Monthly Revenue
//                 </h5>
//                 <p className="text-muted mb-3">Revenue trends over the past 6 months</p>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={statsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="revenue" fill="#6f42c1" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h5 className="card-title">Recent Activity</h5>
//             <p className="text-muted">Latest updates in your training system</p>
//             <div className="list-group mt-3">
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-primary border-3">
//                 <div className="bg-primary text-white p-2 rounded-circle">
//                   <UserPlus size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">
//                     {trainers.length > 0
//                       ? `Trainer ${trainers[trainers.length - 1].name} is active`
//                       : "No trainers yet"}
//                   </p>
//                   <small className="text-muted">Just now</small>
//                 </div>
//               </div>
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-success border-3">
//                 <div className="bg-success text-white p-2 rounded-circle">
//                   <Users size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">
//                     {candidates.length > 0
//                       ? `${candidates[candidates.length - 1].name} joined`
//                       : "No candidates yet"}
//                   </p>
//                   <small className="text-muted">Just now</small>
//                 </div>
//               </div>
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-warning border-3">
//                 <div className="bg-warning text-white p-2 rounded-circle">
//                   <CreditCard size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">
//                     ₹{revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue : 0} received today
//                   </p>
//                   <small className="text-muted">Just now</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;



































// import React from 'react';
// import { useEffect } from 'react';

// import Layout from '../../components/Layout';
// import {
//   Users,
//   UserPlus,
//   Calendar,
//   CreditCard,
//   TrendingUp,
//   Activity
// } from 'lucide-react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   LineChart,
//   Line
// } from 'recharts';



// const Dashboard = () => {
//   useEffect(() => {
//   localStorage.setItem("currentMode", "attendance");
// }, []);
//   const statsData = [
//     { name: 'Jan', trainers: 12, candidates: 45, revenue: 15000 },
//     { name: 'Feb', trainers: 15, candidates: 52, revenue: 18000 },
//     { name: 'Mar', trainers: 18, candidates: 60, revenue: 22000 },
//     { name: 'Apr', trainers: 22, candidates: 75, revenue: 28000 },
//     { name: 'May', trainers: 25, candidates: 82, revenue: 32000 },
//     { name: 'Jun', trainers: 28, candidates: 95, revenue: 38000 },
//   ];


//   return (
//     <Layout>
//       <div className="container my-4">
//         <div className="mb-4">
//           <h1 className="display-5 fw-bold">Admin Dashboard</h1>
//           <p className="text-muted">Overview of your training management system</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="row g-4 mb-4">
//           <div className="col-md-3">
//             <div className="card border-start border-primary border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Active Trainers</h6>
//                   <UserPlus size={18} className="text-primary" />
//                 </div>
//                 <h4 className="fw-bold">28</h4>
//                 <small className="text-success">+12% from last month</small>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card border-start border-success border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Total Candidates</h6>
//                   <Users size={18} className="text-success" />
//                 </div>
//                 <h4 className="fw-bold">195</h4>
//                 <small className="text-success">+18% from last month</small>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card border-start border-purple border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">This Month's Sessions</h6>
//                   <Calendar size={18} className="text-secondary" />
//                 </div>
//                 <h4 className="fw-bold">342</h4>
//                 <small className="text-success">+8% from last month</small>
//               </div>
//             </div>
//           </div>

//           <div className="col-md-3">
//             <div className="card border-start border-warning border-4 shadow-sm">
//               <div className="card-body">
//                 <div className="d-flex justify-content-between align-items-center mb-2">
//                   <h6 className="mb-0">Monthly Revenue</h6>
//                   <CreditCard size={18} className="text-warning" />
//                 </div>
//                 <h4 className="fw-bold">$38,000</h4>
//                 <small className="text-success">+25% from last month</small>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charts */}
//         <div className="row g-4 mb-4">
//           <div className="col-lg-6">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title d-flex align-items-center gap-2">
//                   <TrendingUp className="text-primary" size={20} />
//                   Growth Overview
//                 </h5>
//                 <p className="text-muted mb-3">Trainers and candidates growth over time</p>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={statsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Line type="monotone" dataKey="trainers" stroke="#0d6efd" strokeWidth={2} />
//                     <Line type="monotone" dataKey="candidates" stroke="#198754" strokeWidth={2} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           <div className="col-lg-6">
//             <div className="card shadow-sm">
//               <div className="card-body">
//                 <h5 className="card-title d-flex align-items-center gap-2">
//                   <Activity className="text-success" size={20} />
//                   Monthly Revenue
//                 </h5>
//                 <p className="text-muted mb-3">Revenue trends over the past 6 months</p>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={statsData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="name" />
//                     <YAxis />
//                     <Tooltip />
//                     <Bar dataKey="revenue" fill="#6f42c1" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="card shadow-sm">
//           <div className="card-body">
//             <h5 className="card-title">Recent Activity</h5>
//             <p className="text-muted">Latest updates in your training system</p>
//             <div className="list-group mt-3">
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-primary border-3">
//                 <div className="bg-primary text-white p-2 rounded-circle">
//                   <UserPlus size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">New trainer Sarah Johnson enrolled</p>
//                   <small className="text-muted">2 hours ago</small>
//                 </div>
//               </div>
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-success border-3">
//                 <div className="bg-success text-white p-2 rounded-circle">
//                   <Users size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">15 new candidates registered today</p>
//                   <small className="text-muted">4 hours ago</small>
//                 </div>
//               </div>
//               <div className="list-group-item d-flex gap-3 align-items-start bg-light border-start border-warning border-3">
//                 <div className="bg-warning text-white p-2 rounded-circle">
//                   <CreditCard size={16} />
//                 </div>
//                 <div>
//                   <p className="mb-1 fw-semibold">Monthly payment batch processed</p>
//                   <small className="text-muted">6 hours ago</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;
