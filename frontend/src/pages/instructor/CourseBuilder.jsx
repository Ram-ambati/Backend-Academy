import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';

const CourseBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/instructor')} style={{ marginBottom: '1rem' }}>
        ← Back to Dashboard
      </Button>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        Create New Course
      </h1>

      <Card style={{ padding: '2rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Input label="Course Title" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Advanced Spring Security" required />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Description</label>
            <textarea 
              rows={5}
              placeholder="What will students learn in this course?"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input label="Category" id="cat" placeholder="e.g. Backend" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Level</label>
              <select style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none' }}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/instructor')}>Cancel</Button>
            <Button variant="primary" type="button" onClick={() => navigate('/instructor')}>Save Course</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CourseBuilder;
