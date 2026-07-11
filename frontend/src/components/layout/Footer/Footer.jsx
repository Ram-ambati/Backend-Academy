import React from 'react';

const Footer = () => {
  const links = {
    Platform: ['Courses', 'Lessons', 'Progress', 'AI Tutor'],
    Learn: ['Spring Boot', 'Database Design', 'REST APIs', 'Security'],
    Company: ['About', 'Blog', 'Careers', 'Contact'],
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-brand-name">
            Backend<span>Academy</span>
          </div>
          <p className="footer-desc">
            Master backend development with hands-on lessons, AI tutoring, and real-world projects.
          </p>
        </div>

        {/* Link Columns */}
        {Object.entries(links).map(([title, items]) => (
          <div key={title}>
            <div className="footer-col-title">{title}</div>
            <ul className="footer-links">
              {items.map((item) => (
                <li key={item}><a href="#">{item}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <span className="footer-copy">
          © {new Date().getFullYear()} BackendAcademy. All rights reserved.
        </span>
        <div className="footer-socials">
          {['𝕏', 'in', '⌥', '▶'].map((icon, i) => (
            <a key={i} className="footer-social-btn" href="#" aria-label="Social">
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
