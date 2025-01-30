import { useState } from "react";

export const usePagination = (data, itemsPerPage) => {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const next = () => {
    if (currentPage < maxPage) setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return { currentData, currentPage, maxPage, next, prev };
};
