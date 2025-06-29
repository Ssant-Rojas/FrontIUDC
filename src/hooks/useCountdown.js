import { useState, useEffect } from "react";

export const useCountdown = (expiration) => {
  const calculateTimeLeft = () => {
    if (!expiration) return { days: 0, hours: 0, minutes: 0 };

    const expirationDate = new Date(expiration);
    const now = new Date();
    const difference = expirationDate - now;

    if (isNaN(expirationDate.getTime()) || difference <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);

    return () => clearInterval(timer);
  }, [expiration]);

  return timeLeft;
};
