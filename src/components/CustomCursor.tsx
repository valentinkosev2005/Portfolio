import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    cursor.classList.add('active');

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX - 15 + 'px';
      cursor.style.top = e.clientY - 15 + 'px';
    };

    const handleMouseEnter = () => {
      cursor.classList.add('active');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('active');
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;
