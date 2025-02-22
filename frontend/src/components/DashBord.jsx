// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [userInfo, setUserInfo] = useState(null);
//   const [dashboardContent, setDashboardContent] = useState([]);

//   useEffect(() => {
//     // Fetch user info
//     axios.get('/api/user-info', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     .then(response => {
//       setUserInfo(response.data);
//     })
//     .catch(error => {
//       console.error('Error fetching user info:', error);
//     });

//     // Fetch dashboard content
//     axios.get('/api/dashboard-content', {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}`
//       }
//     })
//     .then(response => {
//       setDashboardContent(response.data);
//     })
//     .catch(error => {
//       console.error('Error fetching dashboard content:', error);
//     });
//   }, []);

//   return (
//     <div className="dashboard">
//       <header className="dashboard-header">
//         <h1>Welcome, {userInfo ? userInfo.name : "User"}!</h1>
//         <div className="flex gap-2">
//           <button onClick={() => navigate('/profile')} className="btn">Profile</button>
//           <button onClick={() => navigate('/logout')} className="btn">Logout</button>
//         </div>
//       </header>
//       <main className="dashboard-content">
//         {dashboardContent.length > 0 ? (
//           <ul>
//             {dashboardContent.map(item => (
//               <li key={item.id}>{item.info}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>Loading content...</p>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Dashboard;


const DashBord = () => {
  return (
    <div>DashBord</div>
  )
}

export default DashBord
