import React, { useState, useEffect } from 'react';
import { CiCamera } from "react-icons/ci";
import { ImNotification } from "react-icons/im";
import { TbActivityHeartbeat } from "react-icons/tb";
import { FaUserGroup } from "react-icons/fa6";
import { FaExclamationTriangle, FaEye, FaExpand, FaHistory } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const stats = [
  { icon: <CiCamera />, title: "Total Cameras", value: "5", description: "4 offline, 8 online", trend: "neutral" },
  { icon: <FaUserGroup />, title: "Active Detections", value: "25", description: "+15% from last hour", trend: "up" },
  { icon: <ImNotification />, title: "Current Alerts", value: "7", description: "+2 new alerts", trend: "up" },
  { icon: <TbActivityHeartbeat />, title: "System Status", value: "Optimal", description: "All systems operational", trend: "neutral" },
];

const incidents = [
  { title: "Unauthorized Access", location: "Front Entrance", time: "14:35", severity: "high", isNew: true },
  { title: "Vehicle Stopped", location: "Parking Lot", time: "10:35", severity: "low", isNew: false },
  { title: "Person Detected", location: "Restricted Area", time: "14:35", severity: "medium", isNew: true },
  { title: "Motion Detected", location: "Storage Room", time: "14:35", severity: "low", isNew: false },
];

const systemStatus = [
  { title: "Video Processing", status: "Operational", statusClass: "bg-green-100 text-green-500" },
  { title: "Object Detection", status: "Operational", statusClass: "bg-green-100 text-green-500" },
  { title: "Facial Recognition", status: "Degraded", statusClass: "bg-yellow-100 text-yellow-600" },
  { title: "License Plate Reader", status: "Offline", statusClass: "bg-red-100 text-red-500" },
];

// Data for the Weekly Incident Report Bar Graph
const incidentData = {
  labels: ['March 1', 'March 2', 'March 3', 'March 4', 'March 5', 'March 6', 'March 7'],
  datasets: [
    {
      label: 'Incidents Reported',
      data: [3, 5, 2, 6, 8, 4, 7],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 1,
    },
  ],
};

// Options for the chart
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Weekly Incident Report',
    },
  },
};

// Camera data with video URLs
const cameras = [
  {
    id: 1,
    name: "Front Entrance",
    videoUrl: "https://developer-blogs.nvidia.com/wp-content/uploads/2022/12/Figure8-output_blurred-compressed.gif",
    details: { people: 4, vehicles: 1, alerts: 4, objects: 5 },
    status: "online"
  },
  {
    id: 2,
    name: "Parking Lot",
    videoUrl: "https://user-images.githubusercontent.com/11428131/139924111-58637f2e-f2f6-42d8-8812-ab42fece92b4.gif",
    details: { people: 2, vehicles: 3, alerts: 1, objects: 2 },
    status: "online"
  },
  {
    id: 3,
    name: "Restricted Area",
    videoUrl: "https://developer-blogs.nvidia.com/wp-content/uploads/2024/05/gif-people-in-store-bounding-boxes.gif",
    details: { people: 0, vehicles: 0, alerts: 0, objects: 1 },
    status: "online"
  },
  {
    id: 4,
    name: "Storage Room",
    videoUrl: "https://user-images.githubusercontent.com/11428131/137016574-0d180d9b-fb9a-42a9-94b7-fbc0dbc18560.gif",
    details: { people: 1, vehicles: 0, alerts: 2, objects: 3 },
    status: "offline"
  },
];

// Sample detection trend data
const detectionTrendData = {
  labels: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
  datasets: [
    {
      label: 'People',
      data: [4, 3, 7, 12, 9, 8, 17, 25],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      fill: false,
    }
  ],
};

function Home() {
  const [selectedCamera, setSelectedCamera] = useState(cameras[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');
  const navigate = useNavigate();

  // Handle camera selection
  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera);
  };

  // Navigate to the "View All Cameras" page
  const handleViewAll = () => {
    navigate("/Live-Feed");
  };

  // Toggle fullscreen for the selected camera
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Filter incidents based on time
  const filteredIncidents = incidents.filter(incident => {
    // This is a placeholder. In a real app, you would filter based on actual timestamps
    return true;
  });

  return (
    <div className='bg-gray-50 p-4 md:p-6 min-h-screen'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>Security Dashboard</h1>
          <p className='text-gray-500'>Monitor your security system status and activities</p>
        </div>
        <div className='flex gap-3 self-end md:self-auto'>
          <div className='flex rounded-lg overflow-hidden border border-gray-200 shadow-sm'>
            <button 
              className={`px-4 py-2 ${timeFilter === 'today' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setTimeFilter('today')}
            >
              Today
            </button>
            <button 
              className={`px-4 py-2 ${timeFilter === 'week' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setTimeFilter('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 ${timeFilter === 'month' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setTimeFilter('month')}
            >
              Month
            </button>
          </div>
          <button className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2'>
            <FaHistory className="text-sm" />
            View Report
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
        {stats.map(({ icon, title, value, description, trend }) => (
          <div
            className='bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 flex flex-col'
            key={title}
          >
            <div className='flex justify-between items-start mb-2'>
              <div className='text-2xl text-blue-500 p-2 bg-blue-50 rounded-lg'>{icon}</div>
              {trend === 'up' && <span className='text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full'>↑ Increasing</span>}
              {trend === 'down' && <span className='text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full'>↓ Decreasing</span>}
            </div>
            <h2 className='text-sm font-medium text-gray-500 mt-1'>{title}</h2>
            <p className='text-2xl font-bold text-gray-900 mt-1'>{value}</p>
            <p className='text-xs text-gray-500 mt-1'>{description}</p>
          </div>
        ))}
      </div>

      {/* Main Content Section */}
      <div className='lg:flex gap-6'>
        {/* Live Security Feed */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4' : 'lg:w-[70%]'} bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 lg:mb-0`}>
          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-xl font-bold text-gray-800'>Live Security Feed</h1>
            <div className='flex gap-2'>
              <button 
                className={`px-3 py-1.5 ${selectedCamera.status === 'online' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} rounded-lg text-sm font-medium`}
              >
                {selectedCamera.status === 'online' ? 'Live' : 'Offline'}
              </button>
              <button 
                className='p-2 text-gray-600 hover:text-blue-500 transition-all duration-200'
                onClick={toggleFullscreen}
              >
                <FaExpand />
              </button>
            </div>
          </div>
          <div className='relative rounded-xl overflow-hidden bg-gray-900'>
            <div className='aspect-video relative overflow-hidden'>
              <img
                src={selectedCamera.videoUrl}
                alt="Live Security Feed"
                className='w-full h-full object-cover'
              />
              {selectedCamera.status === 'offline' && (
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-70'>
                  <div className='text-center'>
                    <FaExclamationTriangle className='text-4xl text-yellow-500 mx-auto mb-2' />
                    <p className='text-white font-bold'>Camera Offline</p>
                    <p className='text-gray-300 text-sm'>Connection lost</p>
                  </div>
                </div>
              )}
              <div className='absolute top-4 left-4 bg-black bg-opacity-50 text-white p-2 rounded-lg text-sm'>
                {new Date().toLocaleTimeString()}
              </div>
              <div className='absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg max-w-[70%]'>
                <h2 className='text-lg font-semibold flex items-center'>
                  {selectedCamera.name}
                  {selectedCamera.status === 'online' && (
                    <span className='ml-2 flex items-center text-xs bg-green-500 text-white px-2 py-0.5 rounded-full'>
                      <span className='w-2 h-2 bg-white rounded-full mr-1 animate-pulse'></span> LIVE
                    </span>
                  )}
                </h2>
                <div className='grid grid-cols-2 gap-x-6 gap-y-1 mt-2'>
                  <p className='flex items-center text-sm'><FaUserGroup className='mr-2 text-blue-400' /> People: {selectedCamera.details.people}</p>
                  <p className='flex items-center text-sm'><ImNotification className='mr-2 text-orange-400' /> Alerts: {selectedCamera.details.alerts}</p>
                  <p className='flex items-center text-sm'><CiCamera className='mr-2 text-green-400' /> Vehicles: {selectedCamera.details.vehicles}</p>
                  <p className='flex items-center text-sm'><TbActivityHeartbeat className='mr-2 text-purple-400' /> Objects: {selectedCamera.details.objects}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Cameras */}
          <div className='mt-6'>
            <div className='flex justify-between items-center mb-4'>
              <h1 className='text-lg font-semibold text-gray-800'>Available Cameras</h1>
              <button
                className='text-blue-500 hover:text-blue-600 transition-all duration-200 flex items-center gap-1 text-sm'
                onClick={handleViewAll}
              >
                <FaEye className='text-xs' /> View All
              </button>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {cameras.map((camera) => (
                <div
                  key={camera.id}
                  className={`relative group bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-400 transition-all duration-200 cursor-pointer ${
                    selectedCamera.id === camera.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleCameraSelect(camera)}
                >
                  <div className='aspect-video'>
                    <img 
                      src={camera.videoUrl} 
                      alt={camera.name}
                      className='w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity'
                    />
                    {camera.status === 'offline' && (
                      <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center'>
                        <span className='text-xs font-medium text-white bg-red-500 px-2 py-1 rounded-full'>Offline</span>
                      </div>
                    )}
                  </div>
                  <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2'>
                    <p className='text-white text-sm font-medium'>{camera.name}</p>
                    <div className='flex justify-between text-xs text-gray-300'>
                      <span>{camera.details.people} people</span>
                      <span>{camera.details.alerts > 0 && (
                        <span className='text-red-400'>{camera.details.alerts} alerts</span>
                      )}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className='lg:w-[30%] space-y-6'>
          {/* Detection Trends */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
            <h1 className='text-lg font-bold text-gray-800'>Detection Trends</h1>
            <p className='text-gray-500 text-sm mb-4'>Today's activity</p>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <Bar 
                data={detectionTrendData} 
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Count'
                      }
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Time'
                      }
                    }
                  }
                }} 
                height={180}
              />
            </div>
          </div>

          {/* Recent Incidents */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
            <h1 className='text-lg font-bold text-gray-800 mb-1'>Recent Incidents</h1>
            <p className='text-gray-500 text-sm mb-4'>Last 24 hours</p>
            <div className='space-y-3 max-h-[300px] overflow-y-auto pr-1'>
              {filteredIncidents.map(({ title, location, time, severity, isNew }, index) => (
                <div 
                  className='flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100' 
                  key={index}
                >
                  <div className='flex gap-3 items-start'>
                    <div className={`p-2 rounded-lg ${
                      severity === 'high' 
                        ? 'bg-red-100 text-red-500' 
                        : severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-500'
                        : 'bg-green-100 text-green-500'
                    }`}>
                      <FaExclamationTriangle />
                    </div>
                    <div>
                      <div className='flex items-center'>
                        <h2 className='font-medium text-gray-800'>{title}</h2>
                        {isNew && <span className='ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full'>New</span>}
                      </div>
                      <p className='text-sm text-gray-500'>{location} • {time}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium ${
                      severity === 'high'
                        ? 'bg-red-100 text-red-600'
                        : severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}
                  >
                    {severity}
                  </span>
                </div>
              ))}
            </div>
            <button className='w-full text-center text-blue-500 hover:text-blue-600 mt-4 transition-all duration-200 text-sm font-medium'>
              View All Incidents
            </button>
          </div>

          {/* System Status */}
          <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
            <h1 className='text-lg font-bold text-gray-800 mb-1'>System Status</h1>
            <p className='text-gray-500 text-sm mb-4'>All systems operational</p>
            <div className='space-y-3'>
              {systemStatus.map(({ title, status, statusClass }, index) => (
                <div className='flex justify-between items-center p-2' key={index}>
                  <p className='text-sm text-gray-700 font-medium'>{title}</p>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusClass}`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Incident Report */}
      <div className='mt-6'>
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 p-4'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <h1 className='text-lg font-bold text-gray-800'>Weekly Incident Report</h1>
              <p className='text-gray-500 text-sm'>March 1 - March 7, 2025</p>
            </div>
            <button className='text-blue-500 hover:text-blue-600 transition-all duration-200 text-sm'>
              Export Data
            </button>
          </div>
          <div className='h-64'>
            <Bar data={incidentData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;