'use client';  // add this if you're using Next.js 13+ app directory

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/');
        const data = await response.json();
        console.log('Backend response:', data);
      } catch (error) {
        console.error('Error fetching backend:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: '20px' }}>
      <h1>Volunteer Unite Frontend</h1>
      <p>Open your browser console to see backend response 👀</p>
    </main>
  );
}
