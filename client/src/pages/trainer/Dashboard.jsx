// import React, { useEffect, useState } from 'react';
// import Layout from '../../components/Layout';
// import {
//   Card, CardContent, CardDescription, CardHeader, CardTitle
// } from "@/components/ui/card";
// import { LayoutDashboard, Users, Calendar, Heart } from 'lucide-react';

// const Dashboard = () => {
//   const [data, setData] = useState({
//     candidates: 0,
//     sessionsToday: 0,
//     activePrograms: 0,
//     completionRate: 0
//   });

//   useEffect(() => {
//     // Simulate fetching data from backend
//     setTimeout(() => {
//       setData({
//         candidates: 12,
//         sessionsToday: 3,
//         activePrograms: 5,
//         completionRate: 86
//       });
//     }, 1000);
//   }, []);

//   return (
//     <Layout>
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
//           <p className="text-gray-600 mt-2">Welcome to your trainer dashboard</p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">My Candidates</CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{data.candidates}</div>
//               <p className="text-xs text-muted-foreground">Total candidates assigned</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{data.sessionsToday}</div>
//               <p className="text-xs text-muted-foreground">Scheduled for today</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
//               <Heart className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{data.activePrograms}</div>
//               <p className="text-xs text-muted-foreground">Running programs</p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
//               <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{data.completionRate}%</div>
//               <p className="text-xs text-muted-foreground">Average completion</p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;

import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [data, setData] = useState({
    candidates: 0,
    sessionsToday: 0,
    activePrograms: 0,
    completionRate: 0
  });

  useEffect(() => {
    setTimeout(() => {
      setData({
        candidates: 12,
        sessionsToday: 3,
        activePrograms: 5,
        completionRate: 86
      });
    }, 1000);
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        <h1 className="h3 mb-2">Trainer Dashboard</h1>
        <p className="text-muted mb-4">Welcome to your trainer dashboard</p>

        <div className="row">
          {/* Candidates */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-title mb-0">My Candidates</h6>
                  <i className="bi bi-people text-secondary"></i>
                </div>
                <h3>{data.candidates}</h3>
                <p className="text-muted small mb-0">Total candidates assigned</p>
              </div>
            </div>
          </div>

          {/* Sessions Today */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-title mb-0">Today's Sessions</h6>
                  <i className="bi bi-calendar-event text-secondary"></i>
                </div>
                <h3>{data.sessionsToday}</h3>
                <p className="text-muted small mb-0">Scheduled for today</p>
              </div>
            </div>
          </div>

          {/* Active Programs */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-title mb-0">Active Programs</h6>
                  <i className="bi bi-heart-pulse text-secondary"></i>
                </div>
                <h3>{data.activePrograms}</h3>
                <p className="text-muted small mb-0">Running programs</p>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="col-md-6 col-lg-3 mb-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="card-title mb-0">Completion Rate</h6>
                  <i className="bi bi-bar-chart-line text-secondary"></i>
                </div>
                <h3>{data.completionRate}%</h3>
                <p className="text-muted small mb-0">Average completion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
