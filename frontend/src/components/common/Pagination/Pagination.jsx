import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  showInfo = true,
  maxVisible = 5,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, currentPage - half);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

      if (start > 1) { pages.push(1); if (start > 2) pages.push('...'); }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) { if (end < totalPages - 1) pages.push('...'); pages.push(totalPages); }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Pagination">
      {/* Prev */}
      <button
        className="pagination-btn pagination-btn--nav"
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={14} /> Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="pagination-ellipsis">&hellip;</span>
        ) : (
          <button
            key={p}
            className={`pagination-btn${currentPage === p ? ' active' : ''}`}
            onClick={() => onPageChange?.(p)}
            aria-label={`Page ${p}`}
            aria-current={currentPage === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        className="pagination-btn pagination-btn--nav"
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next <ChevronRight size={14} />
      </button>

      {showInfo && (
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
      )}
    </nav>
  );
};

export default Pagination;
