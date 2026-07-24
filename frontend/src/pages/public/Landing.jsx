import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedCourses } from '../../api/course.api';
import { GraduationCap, Rocket, ArrowRight, ArrowDown, Brain, Server, Bot, AlertTriangle } from 'lucide-react';
import useAuthStore from '../../stores/useAuthStore';

/* ── Components from the design system ── */
import Badge from '../../components/common/Badge/Badge';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import CourseGrid from '../../components/course/CourseGrid/CourseGrid';
import Footer from '../../components/layout/Footer/Footer';

/* =====================================================
   VALUE PROPOSITION DATA
   ===================================================== */
const VALUE_PROPS = [
  {
    icon: Brain,
    title: 'First Principles Thinking',
    description: 'We don\'t teach you to copy code. We teach you why the code exists. Understand the reasoning behind every design pattern, every architectural decision.',
  },
  {
    icon: Server,
    title: 'Production-Grade Code',
    description: 'Every lesson is built around real-world patterns — error handling, pagination, RBAC, and deployment. Ship code that survives its first on-call.',
  },
  {
    icon: Bot,
    title: 'AI RAG Tutor',
    description: 'Stuck on a concept? Our AI tutor is trained on every lesson. Ask it anything — it gives contextual, curriculum-aware answers in real-time.',
  },
];

/* =====================================================
   STAT COUNTERS (Social proof)
   ===================================================== */
const STATS = [
  { value: '2,400+', label: 'Students' },
  { value: '50+', label: 'Lessons' },
  { value: '4.8', label: 'Avg Rating' },
  { value: '12', label: 'Courses' },
];

/* =====================================================
   LANDING PAGE
   ===================================================== */
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const coursesRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  /* ── Scroll-aware navbar ── */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ── Featured courses via React Query ── */
  const {
    data: courses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['featuredCourses'],
    queryFn: getFeaturedCourses,
    staleTime: 1000 * 60 * 5, // 5 min cache — instant on back-nav
  });

  const scrollToCourses = () => {
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="landing-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`landing-navbar${scrolled ? ' landing-navbar--solid' : ''}`}>
        <a className="navbar-brand" href="/">
          <div className="navbar-logo"><GraduationCap size={20} /></div>
          <span className="navbar-brand-name">
            Backend<span>Academy</span>
          </span>
        </a>

        <div className="landing-navbar-right">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(user?.role === 'INSTRUCTOR' ? '/instructor' : '/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/auth/login')}
              >
                Sign In
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/auth/register')}
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      <main>
        {/* ═══ BAND 1 — HERO ═══ */}
        <section className="landing-hero">
          <div className="landing-hero-bg" aria-hidden="true">
            <div className="landing-hero-orb landing-hero-orb--gold" />
            <div className="landing-hero-orb landing-hero-orb--green" />
            <div className="landing-hero-orb landing-hero-orb--blue" />
          </div>

          <div className="landing-hero-content">
            <Badge variant="solid-gold" size="lg">
              <Rocket size={14} style={{ marginRight: '4px' }} /> Now in Public Beta
            </Badge>

            <h1 className="landing-hero-title">
              Master <span className="text-gold">Backend</span> Engineering
              <br />
              <span className="landing-hero-subtitle-text">From First Principles</span>
            </h1>

            <p className="landing-hero-desc">
              Learn Spring Boot, database design, and DevOps with production-grade
              projects, expert instructors, and an AI tutor that actually understands
              your curriculum.
            </p>

            <div className="landing-hero-actions">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate(isAuthenticated ? (user?.role === 'INSTRUCTOR' ? '/instructor' : '/dashboard') : '/auth/register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : "Start Learning — It's Free"} <ArrowRight size={18} />
              </Button>
              <Button
                variant="outline-gold"
                size="xl"
                onClick={scrollToCourses}
              >
                View Curriculum <ArrowDown size={18} />
              </Button>
            </div>

            {/* ── Social proof stats ── */}
            <div className="landing-hero-stats">
              {STATS.map((stat) => (
                <div key={stat.label} className="landing-hero-stat">
                  <span className="landing-hero-stat-value">{stat.value}</span>
                  <span className="landing-hero-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BAND 2 — VALUE PROPOSITION ═══ */}
        <section className="landing-features">
          <div className="landing-section-header">
            <Badge variant="green" size="lg">Why Us</Badge>
            <h2 className="landing-section-title">
              Not Another Tutorial Graveyard
            </h2>
            <p className="landing-section-subtitle">
              YouTube teaches you syntax. We teach you architecture. Here's what makes Backend Academy different.
            </p>
          </div>

          <div className="landing-features-grid">
            {VALUE_PROPS.map((prop) => {
              const IconComp = prop.icon;
              return (
                <Card key={prop.title} hoverable={true}>
                  <div className="landing-feature-card-inner">
                    <div className="landing-feature-icon">
                      <IconComp size={24} />
                    </div>
                    <h3 className="landing-feature-title">{prop.title}</h3>
                    <p className="landing-feature-desc">{prop.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ═══ BAND 3 — FEATURED COURSES ═══ */}
        <section className="landing-courses" ref={coursesRef}>
          <div className="landing-section-header">
            <Badge variant="gold" size="lg">Curriculum</Badge>
            <h2 className="landing-section-title">
              Featured Courses
            </h2>
            <p className="landing-section-subtitle">
              Hands-on, production-grade courses designed by senior engineers.
              Start from zero and ship real systems.
            </p>
          </div>

          {isLoading ? (
            <Loader rows={1} />
          ) : isError ? (
            <div className="landing-courses-empty">
              <div className="landing-courses-empty-icon"><AlertTriangle size={36} /></div>
              <p>Couldn't load courses. Please try again later.</p>
            </div>
          ) : (
            <CourseGrid
              courses={courses || []}
              columns={3}
              emptyMessage="New courses dropping soon."
              onCourseClick={() => navigate('/auth/register')}
            />
          )}

          <div className="landing-courses-cta">
            <Button
              variant="outline-gold"
              size="lg"
              onClick={() => navigate('/auth/register')}
            >
              Explore All Courses <ArrowRight size={16} />
            </Button>
          </div>
        </section>

        {/* ═══ BAND 4 — FINAL CTA ═══ */}
        <section className="landing-cta">
          <div className="landing-cta-inner">
            <h2 className="landing-cta-title">
              Ready to Think Like a <span className="text-gold">Senior Engineer</span>?
            </h2>
            <p className="landing-cta-desc">
              Join thousands of developers who are building production-grade backend systems — not just following tutorials.
            </p>
            <div className="landing-cta-actions">
              <Button
                variant="primary"
                size="xl"
                onClick={() => navigate('/auth/register')}
              >
                Create Free Account
              </Button>
              <span className="landing-cta-signin">
                Already have an account?{' '}
                <button
                  className="landing-cta-link"
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In
                </button>
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
