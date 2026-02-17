import React from 'react';
import { MediaItem } from '../../types/form';

interface MediaRendererProps {
  media: MediaItem;
  className?: string;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({ media, className }) => {
  if (media.placement === 'background') {
    return <BackgroundMedia media={media} />;
  }

  return (
    <div className={`ff-media ff-media--${media.placement || 'inline'} ${className || ''}`}>
      {media.type === 'video' ? (
        <video
          src={media.url}
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: '100%',
            maxWidth: '560px',
            borderRadius: 'var(--ff-border-radius)',
            objectFit: media.fit || 'cover',
          }}
        />
      ) : (
        <img
          src={media.url}
          alt={media.alt || ''}
          style={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: 'var(--ff-border-radius)',
            objectFit: media.fit || 'contain',
          }}
        />
      )}
    </div>
  );
};

const BackgroundMedia: React.FC<{ media: MediaItem }> = ({ media }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: media.fit || 'cover',
    opacity: media.opacity ?? 0.3,
    zIndex: 0,
    pointerEvents: 'none',
  };

  if (media.type === 'video') {
    return (
      <video
        src={media.url}
        autoPlay
        loop
        muted
        playsInline
        style={style}
      />
    );
  }

  return <img src={media.url} alt="" style={style} />;
};
