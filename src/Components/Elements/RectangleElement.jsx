import React, { useRef, useEffect } from 'react';

const RectangleElement = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onContextMenu }) => {
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

    const width = size?.width || 100;
    const height = size?.height || 100;

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
                backgroundColor: p.backgroundColor || '#3498db',
                border: p.border || '1px solid #ccc',
                borderRadius: p.borderRadius || 0,
                cursor: isSelected ? 'move' : 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        >
            {p.text && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    color: p.textColor || '#fff',
                    fontSize: p.fontSize || 14,
                }}>
                    {p.text}
                </div>
            )}
        </div>
    );
};

export default RectangleElement;