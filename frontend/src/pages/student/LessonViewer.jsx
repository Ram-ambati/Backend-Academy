import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import ProgressBar from '../../components/course/ProgressBar/ProgressBar';
import VideoPlayer from '../../components/course/VideoPlayer/VideoPlayer';
import MarkdownViewer from '../../components/course/MarkdownViewer/MarkdownViewer';
import CodeSnippet from '../../components/course/CodeSnippet/CodeSnippet';
import LessonList from '../../components/course/LessonList/LessonList';
import ChatWindow from '../../components/ai/ChatWindow/ChatWindow';
import useAuthStore from '../../stores/useAuthStore';

// We'll reuse the mock data for now
const SAMPLE_LESSONS = [
  { id: 1, title: 'Introduction to Spring Boot',      duration: '12 min', type: 'video',   status: 'completed' },
  { id: 2, title: 'Setting Up Your Environment',      duration: '8 min',  type: 'reading', status: 'completed' },
  { id: 3, title: 'Your First REST Controller',       duration: '15 min', type: 'video',   status: 'active' },
  { id: 4, title: 'Dependency Injection Deep Dive',  duration: '20 min', type: 'video',   status: 'pending' },
  { id: 5, title: 'Working with JPA & Hibernate',    duration: '25 min', type: 'video',   status: 'locked' },
  { id: 6, title: 'Knowledge Check Quiz',            duration: '10 min', type: 'quiz',    status: 'locked' },
];

const SAMPLE_CODE = `@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.findAll();
        return ResponseEntity.ok(courses);
    }
}`;

const SAMPLE_MARKDOWN = `## Spring Boot Overview
**Spring Boot** makes it easy to create stand-alone applications.
### Key Features
- Auto-configuration
- Embedded servers
- Production-ready metrics
`;

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const [activeLesson, setActiveLesson] = useState(parseInt(lessonId) || 3);
  const user = useAuthStore(state => state.user);

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 60px)' }}>
      {/* Center Panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
        {/* Prev / Topic / Next Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem' }}>
          <Button size="sm" variant="outline-gold" icon={<ChevronLeft size={16} />}>Prev</Button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark)' }}>
              Lesson {activeLesson} — Your First REST Controller
            </span>
          </div>
          <Button size="sm" variant="outline-green" iconRight={<ChevronRight size={16} />}>Next</Button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '1.25rem' }}>
          <ProgressBar value={45} label="Course Progress" size="md" color="gold" />
        </div>

        {/* Video */}
        <VideoPlayer videoId="dQw4w9WgXcQ" title="Your First REST Controller" caption="Building a REST API with Spring Boot — 15 min" />

        {/* Markdown Content */}
        <Card title="Lesson Content" subtitle="Spring Boot REST Controller deep-dive" style={{ marginTop: '1.25rem' }}>
          <MarkdownViewer content={SAMPLE_MARKDOWN} />
        </Card>

        {/* Code Snippet */}
        <div style={{ marginTop: '1.25rem' }}>
          <CodeSnippet code={SAMPLE_CODE} language="java" filename="CourseController.java" showLineNumbers={true} />
        </div>

        {/* Lesson List */}
        <Card title="Course Lessons" subtitle="Spring Boot Masterclass" style={{ marginTop: '1.25rem' }}>
          <LessonList lessons={SAMPLE_LESSONS} activeLesson={activeLesson} onLessonClick={(lesson) => setActiveLesson(lesson.id)} />
        </Card>
      </div>

      {/* AI Chat Panel */}
      <div style={{ width: '320px', flexShrink: 0, height: 'calc(100vh - 60px)', position: 'sticky', top: '60px', borderLeft: '1.5px solid var(--border)' }}>
        <ChatWindow user={{ initials: user?.initials || 'ME' }} />
      </div>
    </div>
  );
};

export default LessonViewer;
