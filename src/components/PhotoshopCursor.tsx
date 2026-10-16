import React, { useEffect, useState } from 'react';

/**
 * Authentic Adobe Photoshop Pen Tool Cursor
 * Renders the iconic fountain pen nib cursor that follows mouse movement with sub-pixel precision,
 * showing anchor-point interactions on hover and click ripple effects.
 */
export const PhotoshopCursor: React.FC = () => {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    // Only activate on devices that support a fine pointer (mouse/trackpad, not purely touch)
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.closest('[role="button"]') !== null ||
          target.closest('.cursor-pointer') !== null ||
          window.getComputedStyle(target).cursor === 'pointer';
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsDown(true);
    const handleMouseUp = () => setIsDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="pointer-events-none fixed z-[999999] top-0 left-0 will-change-transform"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: 'transform 0.04s ease-out',
      }}
    >
      {/* Photoshop Pen Tool Icon with Tip at (1, 1) */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform duration-100 ${
          isDown ? 'scale-90' : isPointer ? 'scale-105' : 'scale-100'
        }`}
      >
        {/* White outer boundary to ensure 100% visibility on both dark and light backgrounds */}
        <path
          d="M1 1 L2 8.5 C2.5 10.5 3.8 12 5.8 12.8 L10 10 L18 18 L15 21 L7 13 L10 10 L5.8 12.8 C3.8 12 2.5 10.5 2 8.5 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Pen Barrel / Collar (Dark metallic) */}
        <path
          d="M9.5 9.5 L17.5 17.5 L15 20 L7 12 Z"
          fill="#1c1c1f"
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        {/* Barrel Highlight */}
        <path
          d="M10.5 9.5 L17.5 16.5 L16.5 17.5 L9.5 10.5 Z"
          fill="#404045"
        />

        {/* Silver Pen Nib (Left wing - shaded) */}
        <path
          d="M1 1 L1.8 8.5 C2.4 10.2 3.5 11.5 5.5 12.2 L9.5 9.5 L6 6 L1 1 Z"
          fill="#c4c4c8"
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Silver Pen Nib (Right wing - bright reflective highlight) */}
        <path
          d="M1 1 L8.5 1.8 C10.2 2.4 11.5 3.5 12.2 5.5 L9.5 9.5 L6 6 L1 1 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Nib Slit & Center Line */}
        <line
          x1="1"
          y1="1"
          x2="5.5"
          y2="5.5"
          stroke="#09090b"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* Breather Hole */}
        <circle cx="6" cy="6" r="1.1" fill="#09090b" />

        {/* Photoshop Pen Tool Anchor-Point Mode Icon when hovering clickable items */}
        {isPointer && (
          <g transform="translate(13, 13)">
            {/* White outline for high contrast */}
            <circle cx="4" cy="4" r="4.5" fill="#ffffff" stroke="#000000" strokeWidth="1" />
            <circle cx="4" cy="4" r="2.2" fill="#e62b1e" />
          </g>
        )}
      </svg>
    </div>
  );
};
