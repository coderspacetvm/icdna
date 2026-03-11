import React from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface NotificationToastProps {
  title: string;
  body: string;
  t: any;
  image?: string;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ title, body, t, image }) => {
  const handleDismiss = () => {
    toast.dismiss(t.id);
  };

  // Don't render anything if toast is not visible to prevent flickering
  if (!t.visible) {
    return null;
  }

  return (
    <div
      className="notification-toast"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '18px 20px',
        borderRadius: '18px',
        background: `
          linear-gradient(135deg, 
            rgba(255, 255, 255, 0.98) 0%, 
            rgba(246, 249, 249, 0.95) 100%
          )
        `,
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: `
          0 25px 50px -12px rgba(12, 29, 46, 0.15),
          0 8px 16px -4px rgba(6, 64, 43, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.8),
          inset 0 -1px 0 rgba(255, 255, 255, 0.4)
        `,
        color: 'var(--main-dark)',
        fontFamily: 'var(--font-dm-sans)',
        animation: 'slideInFromTop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        maxWidth: '420px',
        minWidth: '320px',
        wordBreak: 'break-word',
        overflow: 'hidden',
        transform: 'translateY(0)',
        opacity: 1,
      }}
    >
      {/* Close button - positioned at top right */}
      <button
        onClick={handleDismiss}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '24px',
          height: '24px',
          borderRadius: '6px',
          background: 'rgba(116, 139, 160, 0.1)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          color: 'var(--text-color)',
          fontSize: '14px',
          fontWeight: 'var(--fw-medium)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(116, 139, 160, 0.2)';
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.color = 'var(--main-dark)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(116, 139, 160, 0.1)';
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.color = 'var(--text-color)';
        }}
      >
        ×
      </button>

      {/* Subtle top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '20px',
          right: '20px',
          height: '2px',
          background: 'linear-gradient(90deg, var(--main-turquoise) 0%, var(--main-color) 100%)',
          borderRadius: '2px',
          opacity: 0.6,
        }}
      />
      
      {/* Icon/Image container - simplified without glossy effect */}
      <div
        style={{
          flexShrink: 0,
          width: '48px',
          height: '48px',
          borderRadius: '14px',
          background: image ? 'transparent' : 'linear-gradient(135deg, var(--main-turquoise) 0%, #0a5a3d 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: image ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(6, 64, 43, 0.2)',
        }}
      >
        {image ? (
          <Image
            src={image}
            alt="notification"
            width={48}
            height={48}
            style={{ 
              borderRadius: '14px',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '22px',
              animation: 'gentleBounce 2s ease-in-out infinite',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15))',
            }}
          >
            🍴
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px',
        minWidth: 0,
        paddingRight: '30px', // Add space for close button
      }}>
        <h4 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: 'var(--fw-semibold)',
          color: 'var(--main-dark)',
          lineHeight: '1.3',
          letterSpacing: '-0.1px',
        }}>
          {title}
        </h4>
        
        <p style={{ 
          margin: 0, 
          fontSize: '14px', 
          fontWeight: 'var(--fw-regular)',
          color: 'var(--text-color)',
          lineHeight: '1.4',
          opacity: 0.85,
        }}>
          {body}
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          background: 'linear-gradient(90deg, var(--main-turquoise) 0%, var(--main-color) 100%)',
          borderRadius: '0 0 18px 18px',
          animation: 'progressBar 5s linear forwards',
          transformOrigin: 'left',
          opacity: 0.8,
        }}
      />

      {/* Enhanced glossy overlay for entire toast */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          borderRadius: '18px 18px 0 0',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default NotificationToast;
