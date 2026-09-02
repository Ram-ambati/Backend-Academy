import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Loader from '../../components/common/Loader/Loader';
import { createLesson, updateLesson, deleteLesson, getCourseLessons } from '../../api/lesson.api';
import { useToast } from '../../components/common/Toast/Toast';

const LessonBuilder = () => {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams();
  const isEditMode = Boolean(lessonId);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    content: ''
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['courseLessons', courseId],
    queryFn: () => getCourseLessons(courseId),
    enabled: isEditMode
  });

  useEffect(() => {
    if (isEditMode && lessons) {
      const lesson = lessons.find(l => l.id === parseInt(lessonId));
      if (lesson) {
        setFormData({
          title: lesson.title || '',
          videoUrl: lesson.videoUrl || '',
          content: lesson.content || ''
        });
      }
    }
  }, [lessons, isEditMode, lessonId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (isEditMode) {
        return updateLesson(lessonId, data);
      }
      return createLesson(courseId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseLessons', courseId] });
      showToast(isEditMode ? 'Lesson updated!' : 'Lesson created!', 'success');
      navigate(`/instructor/courses/${courseId}/edit`);
    },
    onError: (err) => {
      showToast(err.message || 'Failed to save lesson', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteLesson(lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courseLessons', courseId] });
      showToast('Lesson deleted', 'success');
      navigate(`/instructor/courses/${courseId}/edit`);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isEditMode && isLoading) {
    return <div style={{ padding: '2rem' }}><Loader rows={2} /></div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate(`/instructor/courses/${courseId}/edit`)} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Course
      </Button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)' }}>
          {isEditMode ? 'Edit Lesson' : 'Create New Lesson'}
        </h1>
        {isEditMode && (
          <Button variant="ghost" onClick={() => {
            if (window.confirm('Are you sure you want to delete this lesson?')) deleteMutation.mutate();
          }} style={{ color: 'var(--error)' }}>
            <Trash2 size={16} style={{ marginRight: '6px' }} /> Delete Lesson
          </Button>
        )}
      </div>

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <Input 
            label="Lesson Title" 
            id="title" 
            value={formData.title} 
            onChange={(e) => handleChange('title', e.target.value)} 
            placeholder="e.g. Introduction to React Hooks" 
            maxLength={100}
            required 
          />

          <Input 
            label="Video URL (Optional)" 
            id="videoUrl" 
            value={formData.videoUrl} 
            onChange={(e) => handleChange('videoUrl', e.target.value)} 
            placeholder="https://youtube.com/..." 
          />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Lesson Content (Markdown)</label>
            <textarea 
              rows={15}
              value={formData.content}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="# Introduction\n\nWrite your lesson content here using markdown..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'monospace', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="ghost" type="button" onClick={() => navigate(`/instructor/courses/${courseId}/edit`)} disabled={saveMutation.isPending}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saveMutation.isPending} icon={saveMutation.isPending ? undefined : <Save size={16} />}>
              {saveMutation.isPending ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Lesson')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LessonBuilder;
