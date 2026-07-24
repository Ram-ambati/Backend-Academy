import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/common/Loader/Loader';
import { getCourseById, createCourse, updateCourse } from '../../api/course.api';

const CourseBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficultyLevel: 'BEGINNER',
    thumbnailUrl: ''
  });
  
  const [errorMsg, setErrorMsg] = useState(null);

  // Fetch course data if in edit mode
  const { data: existingCourse, isLoading: isFetching } = useQuery({
    queryKey: ['course', id],
    queryFn: () => getCourseById(id),
    enabled: isEditMode
  });

  // Populate form when data arrives
  useEffect(() => {
    if (existingCourse) {
      setFormData({
        title: existingCourse.title || '',
        description: existingCourse.description || '',
        category: existingCourse.category || '',
        // Map UI level back to backend difficultyLevel format if needed, though adaptCourse maps difficultyLevel -> level
        // Wait, adaptCourse outputs `level` as "Beginner". We need to map it back to uppercase for the backend.
        difficultyLevel: existingCourse.level ? existingCourse.level.toUpperCase() : 'BEGINNER',
        // adaptCourse outputs `thumbnail`, we need to map to `thumbnailUrl` for the backend DTO
        thumbnailUrl: existingCourse.thumbnail || ''
      });
    }
  }, [existingCourse]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        return updateCourse(id, data);
      }
      return createCourse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorCourses'] });
      navigate('/instructor');
    },
    onError: (err) => {
      console.error('Failed to save course', err);
      setErrorMsg(err.response?.data?.message || 'Failed to save course. Please try again.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    saveMutation.mutate(formData);
  };

  if (isEditMode && isFetching) {
    return (
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <Loader rows={2} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/instructor')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Dashboard
      </Button>

      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        {isEditMode ? 'Edit Course' : 'Create New Course'}
      </h1>

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {errorMsg && (
            <div style={{ padding: '1rem', background: 'var(--error-light, #fee2e2)', color: 'var(--error, #ef4444)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          )}

          <Input 
            label="Course Title" 
            id="title" 
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            placeholder="e.g. Advanced Spring Security" 
            required 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Description</label>
            <textarea 
              rows={5}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="What will students learn in this course?"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <Input 
              label="Category" 
              id="cat" 
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="e.g. Backend" 
              required
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Level</label>
              <select 
                value={formData.difficultyLevel}
                onChange={(e) => handleChange('difficultyLevel', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none' }}
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          <Input 
            label="Thumbnail URL (Optional)" 
            id="thumbnailUrl" 
            value={formData.thumbnailUrl}
            onChange={(e) => handleChange('thumbnailUrl', e.target.value)}
            placeholder="https://images.unsplash.com/photo-..." 
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" type="button" onClick={() => navigate('/instructor')} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saveMutation.isPending} icon={saveMutation.isPending ? undefined : <Save size={16} />}>
              {saveMutation.isPending ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Course')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CourseBuilder;
