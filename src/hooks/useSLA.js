import { useState, useEffect } from "react";

export const useSLA = (startDate, endDate) => {
  const [sla, setSLA] = useState(null);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffInHours = Math.abs(end - start) / 36e5;
      setSLA(diffInHours);
    }
  }, [startDate, endDate]);

  return sla;
};
