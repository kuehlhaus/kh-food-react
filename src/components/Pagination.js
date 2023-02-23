import { useEffect, useState } from 'react';

function Pagination({
  currentPage,
  setCurrentPage,
  isFilterActive,
  recordsPerPage,
  filteredArray,
  dataArray,
  nPages,
  setNPages,
  filter,
}) {
  useEffect(() => {
    if (isFilterActive) {
      setNPages(Math.ceil(filteredArray.length / recordsPerPage));
    } else {
      setNPages(Math.ceil(dataArray.length / recordsPerPage));
    }
  }, [filter, currentPage, isFilterActive, recordsPerPage, nPages]);

  let pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  let nextPage = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  let prevPage = (event) => {
    if (currentPage !== (0 || 1)) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pagination-section">
      <button
        onClick={(event) => prevPage(event)}
        disabled={currentPage === (0 || 1) ? true : false}
      >
        Prev
      </button>

      <div>
        {pageNumbers.map((page, index) => {
          return (
            <i
              key={index}
              className={page === currentPage ? 'currentPage' : ''}
            >
              {page}
            </i>
          );
        })}
      </div>

      <button
        onClick={nextPage}
        disabled={currentPage === nPages ? true : false}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
