'use client';

import React, { useState } from 'react';

type Props = {
    /** The image URL to zoom into */
    src: string;
    /** The content to render inside the container (e.g. Swiper or single Image) */
    children: React.ReactNode;
    /** Container height (default: 'clamp(260px, 33vh, 350px)') */
    height?: string | number;
    /** Zoom multiplier (default: 8) */
    zoom?: number;
    /** Size of the zoom preview box in px (default: 130) */
    boxSize?: number;
    /** Offset from cursor tip in px (default: 15) */
    offset?: number;
    /** Extra styles for the container div */
    containerStyle?: React.CSSProperties;
};

export const ImageZoom: React.FC<Props> = ({
    src,
    children,
    height = 'clamp(260px, 33vh, 350px)',
    zoom = 8,
    boxSize = 130,
    offset = 15,
    containerStyle,
}) => {
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const [rawPos, setRawPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({
            x: Math.min(Math.max(x, 0), 100),
            y: Math.min(Math.max(y, 0), 100),
        });
        setRawPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    // Correct CSS background-position formula:
    // bgX% = (cursorFraction * ZOOM - 0.5) / (ZOOM - 1) * 100
    const cx = zoomPos.x / 100;
    const cy = zoomPos.y / 100;
    const bgX = ((cx * zoom - 0.5) / (zoom - 1)) * 100;
    const bgY = ((cy * zoom - 0.5) / (zoom - 1)) * 100;

    return (
        <div
            style={{
                height,
                position: 'relative',
                backgroundColor: 'var(--white-color)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'crosshair',
                ...containerStyle,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
        >
            {children}

            {/* Zoom Preview Box — follows cursor */}
            {isZooming && src && (
                <div
                    style={{
                        position: 'absolute',
                        left: rawPos.x + offset,
                        top: Math.max(0, rawPos.y - boxSize / 2),
                        width: boxSize,
                        height: boxSize,
                        border: '2px solid var(--main-turquoise)',
                        borderRadius: 8,
                        overflow: 'hidden',
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${zoom * 100}%`,
                        backgroundPosition: `${bgX}% ${bgY}%`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                        zIndex: 10,
                        pointerEvents: 'none',
                        transition: 'left 0.08s ease-out, top 0.08s ease-out, background-position 0.08s ease-out',
                    }}
                />
            )}
        </div>
    );
};
