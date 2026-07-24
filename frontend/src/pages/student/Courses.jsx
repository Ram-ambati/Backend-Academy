import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../../api/course.api';
import { Search, Filter, BookOpen, Layers, X } from 'lucide-react';

/* ── Components ── */
import CourseGrid from '../../components/course/CourseGrid/CourseGrid';
import Loader from '../../components/common/Loader/Loader';
import Pagination from '../../components/common/Pagination/Pagination';
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: 'ALL' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Database', value: 'DATABASE' },
  { label: 'DevOps', value: 'DEVOPS' },
  { label: 'System Design', value: 'SYSTEM DESIGN' },
];

const LEVEL_OPTIONS = [
  { label: 'All Levels', value: 'ALL' },
  { label: 'Beginner', value: 'BEGINNER' },
  { label: 'Intermediate', value: 'INTERMEDIATE' },
  { label: 'Advanced', value: 'ADVANCED' },
];

const Courses = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  /* ── 1. URL search params as single source of truth ── */
  const page = parseInt(searchParams.get('page') || '0', 10);
  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || 'ALL';
  const levelParam = searchParams.get('level') || 'ALL';

  /* Local state for immediate input feedback before debounce */
  const [searchInput, setSearchInput] = useState(searchParam);

  /* Sync searchInput when searchParam changes externally (e.g. browser back) */
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  /* ── 2. Debounced search param updater ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchParam) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) {
            next.set('search', searchInput.trim());
          } else {
            next.delete('search');
          }
          next.set('page', '0'); // reset to page 0 on search
          return next;
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, setSearchParams]);

  /* ── Filter Handler ── */
  const updateFilter = useCallback((key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value && value !== 'ALL') {
        next.set(key, value);
      } else {
        next.delete(key);
      }
      next.set('page', '0'); // reset page on filter change
      return next;
    });
  }, [setSearchParams]);

  /* ── Page Handler ── */
  const handlePageChange = useCallback((newPage) => {
    // Convert 1-indexed pagination component output to 0-indexed API page
    const pageIndex = Math.max(0, newPage - 1);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', pageIndex.toString());
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setSearchParams]);

  /* Clear all filters helper */
  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams({});
  }, [setSearchParams]);

  /* ── 3. React Query for paged data ── */
  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['courses', { page, search: searchParam, category: categoryParam, level: levelParam }],
    queryFn: () => getCourses({
      page,
      size: 6,
      search: searchParam,
      category: categoryParam,
      level: levelParam,
    }),
    placeholderData: (previousData) => previousData, // keepPreviousData replacement in v5
    staleTime: 1000 * 60 * 5,
  });

  const coursesList = data?.content || [];
  const totalPages = data?.totalPages || 1;
  const currentPage1Indexed = (data?.page ?? page) + 1;
  const hasActiveFilters = Boolean(searchParam || categoryParam !== 'ALL' || levelParam !== 'ALL');

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Band 1: Page Header & Global Search */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          Course Catalog
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.0625rem', maxWidth: '540px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
          Master backend engineering with production-grade courses designed by senior engineers.
        </p>

        {/* Search Bar with 500ms Debounce */}
        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          <div className="searchbar searchbar--lg">
            <span className="searchbar-icon"><Search size={18} /></span>
            <input
              type="search"
              className="searchbar-input"
              placeholder="Search by course title or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search courses"
            />
            {searchInput && (
              <button
                className="searchbar-clear"
                onClick={() => { setSearchInput(''); updateFilter('search', ''); }}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Band 2: Category Pills & Difficulty Filter Section */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem', background: 'var(--white)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Layers size={14} /> Category:
          </span>
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = categoryParam.toUpperCase() === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => updateFilter('category', cat.value)}
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 700 : 500,
                  border: isActive ? '1.5px solid var(--gold)' : '1.5px solid var(--border)',
                  background: isActive ? 'var(--gold-light)' : 'var(--white)',
                  color: isActive ? 'var(--gold-hover)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty Dropdown & Clear Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Filter size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              value={levelParam.toUpperCase()}
              onChange={(e) => updateFilter('level', e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border)',
                background: 'var(--white)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--text-dark)',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {LEVEL_OPTIONS.map((lvl) => (
                <option key={lvl.value} value={lvl.value}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="xs" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Band 3: Data Section (Grid or Loading/Empty) */}
      <div style={{ minHeight: '400px', opacity: isFetching ? 0.75 : 1, transition: 'opacity 0.2s' }}>
        {isLoading ? (
          <Loader rows={2} />
        ) : coursesList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)' }}>
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--text-light)' }}>
              <BookOpen size={48} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              No matching courses found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Try adjusting your search query or clear active category filters.
            </p>
            {hasActiveFilters && (
              <Button variant="outline-gold" size="sm" onClick={clearFilters}>
                Reset Search & Filters
              </Button>
            )}
          </div>
        ) : (
          <CourseGrid
            courses={coursesList}
            columns={3}
            onCourseClick={(course) => navigate(`/courses/${course.id}`)}
          />
        )}
      </div>

      {/* Band 4: Pagination Footer */}
      {!isLoading && totalPages > 1 && (
        <div style={{ marginTop: '2.5rem' }}>
          <Pagination
            currentPage={currentPage1Indexed}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showInfo={true}
          />
        </div>
      )}
    </div>
  );
};

export default Courses;
