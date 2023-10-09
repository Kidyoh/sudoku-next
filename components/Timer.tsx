// Timer.tsx
"use client";
import { useState, useEffect } from 'react';

function Timer() {
  const [time, setTime] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return <div className='text-black'>Time: {formatTime(time)}</div>;
}

export default Timer;
