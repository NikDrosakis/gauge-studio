import React, { useRef } from 'react';

const BarElement = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onContextMenu }) => {
    const divRef = useRef(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const dragStartPos = React.useRef({ x: 0, y: 0 });
    const dragStartElementPos = React.useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!isSelected) return;
        e.stopPropagation();
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        dragStartElementPos.current = { x: position.x, y: position.y };
    };

    const handleMouseMove = React.useCallback((e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        onDragEnd({
            x: dragStartElementPos.current.x + dx,
            y: dragStartElementPos.current.y + dy
        });
    }, [isDragging, onDragEnd]);

    const handleMouseUp = React.useCallback(() => {
        setIsDragging(false);
    }, []);

    React.useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const width = size?.width || 40;
    const height = size?.height || 150;
    const fillPercentage = Math.min(100, Math.max(0, p.value || 50));
    const fillHeight = (fillPercentage / 100) * height;

    return (
        <div
            ref={divRef}
            className={`element-container ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: width,
                height: height,
                backgroundColor: p.backgroundColor || '#2d2d3d',
                border: p.border || '1px solid #555',
                borderRadius: p.borderRadius || 4,
                cursor: isSelected ? 'move' : 'pointer',
                position: 'relative',
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        >
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: fillHeight,
                backgroundColor: p.fillColor || '#ff6666',
                transition: 'height 0.2s',
                borderRadius: p.borderRadius || 4,
            }} />
        </div>
    );
};

export default BarElement;