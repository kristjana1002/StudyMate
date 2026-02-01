import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '40px' }}>
        Welcome back, scholars
      </h1>
      <div>
        <p>Your Al-powered learning companion is ready to help you excel</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#eee', borderRadius: '10px' }}>
          Stats 1
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#eee', borderRadius: '10px' }}>
          Stats 2
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#eee', borderRadius: '10px' }}>
          Stats 3
        </div>
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#eee', borderRadius: '10px' }}>
          Stats 4
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
