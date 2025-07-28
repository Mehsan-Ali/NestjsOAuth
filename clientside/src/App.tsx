import axios from 'axios';
import './App.css'
import { Routernav } from './components/routernav'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const getCurrentUser = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) throw new Error('Not authenticated');
  
      const res = await axios.get('http://localhost:3000/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      return res.data;
    };
    getCurrentUser();
  })

  return (
    <>
      <Routernav />
    </>
  )
}

export default App
