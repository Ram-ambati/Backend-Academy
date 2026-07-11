import React, { useState, useEffect } from 'react';
import { getCourses } from '../../api/course.api';
import CourseGrid from '../../components/course/CourseGrid/CourseGrid';
import SearchBar from '../../components/common/SearchBar/SearchBar';
import Loader from '../../components/common/Loader/Loader';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar placeholder="Search courses…" size="lg" onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatisticsCard label="Total Courses" value={courses.length.toString()} icon="📚" iconColor="gold" trend={{ direction: 'up', label: 'New courses added' }} />
        <StatisticsCard label="Lessons Done" value="48" icon="✅" iconColor="green" trend={{ direction: 'up', label: '+8 this week' }} progress={{ value: 68, color: 'green' }} />
        <StatisticsCard label="Hours Spent" value="32h" icon="⏱" iconColor="pink" trend={{ direction: 'up', label: '+4h this week' }} />
        <StatisticsCard label="Current Streak" value="12 days" icon="🔥" iconColor="gold" trend={{ direction: 'flat', label: 'Keep it up!' }} />
      </div>

      {isLoading ? (
        <Loader rows={2} />
      ) : (
        <CourseGrid courses={filteredCourses} columns={3} />
      )}
    </div>
  );
};

export default Courses;
