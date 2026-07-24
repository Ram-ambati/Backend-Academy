import React from 'react';
import { Play, Video } from 'lucide-react';

/**
 * VideoPlayer — embeds a YouTube video by URL or video ID.
 * Accepts:
 *   - videoId: "dQw4w9WgXcQ"
 *   - src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
 */
const extractYouTubeId = (src) => {
  if (!src) return null;
  const match = src.match(
    /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : src; // fallback: assume it's already an ID
};

const VideoPlayer = ({
  videoId = null,
  src = null,
  title = 'Lesson Video',
  caption = '',
  autoplay = false,
}) => {
  const id = videoId || extractYouTubeId(src);

  if (!id) {
    return (
      <div className="video-player">
        <div
          className="video-player-wrap"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a2e' }}
        >
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}><Play size={40} strokeWidth={1.5} /></div>
            <p style={{ fontSize: '0.875rem' }}>No video source provided</p>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;

  return (
    <div className="video-player">
      <div className="video-player-wrap">
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {caption && (
        <div className="video-player-caption">
          <Video size={14} /> {caption}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
