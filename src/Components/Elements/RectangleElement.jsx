// src/Components/Elements/RectangleElement.jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';

const RectangleElement = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onResizeEnd, onContextMenu }) => {
    const divRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [loadedImage, setLoadedImage] = useState(null);

    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartElementPos = useRef({ x: 0, y: 0 });
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });
    const resizeCorner = useRef(null);

    const currentWidth = size?.width || 120;
    const currentHeight = size?.height || 80;

    // Load background image
    useEffect(() => {
        if (p.backgroundImage && p.backgroundImage !== '') {
            const img = new Image();
            if (p.backgroundImage.startsWith('http')) {
                img.crossOrigin = "Anonymous";
            }
            img.src = p.backgroundImage;
            img.onload = () => setLoadedImage(img);
            img.onerror = () => setLoadedImage(null);
        } else {
            setLoadedImage(null);
        }
    }, [p.backgroundImage]);

    // Background style
    const bgStyle = loadedImage ? {
        backgroundImage: `url(${p.backgroundImage})`,
        backgroundSize: `${p.backgroundImageSize || 100}%`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: (p.backgroundImageOpacity || 100) / 100,
    } : {};

    // Drag handlers
    const handleMouseDown = (e) => {
        if (!isSelected) return;
        e.stopPropagation();
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        dragStartElementPos.current = { x: position.x, y: position.y };
    };

    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const dx = e.clientX - dragStartPos.current.x;
            const dy = e.clientY - dragStartPos.current.y;
            onDragEnd({
                x: dragStartElementPos.current.x + dx,
                y: dragStartElementPos.current.y + dy
            });
        } else if (isResizing && resizeCorner.current) {
            const dx = e.clientX - resizeStartPos.current.x;
            const dy = e.clientY - resizeStartPos.current.y;
            let newWidth = resizeStartSize.current.width;
            let newHeight = resizeStartSize.current.height;

            if (resizeCorner.current === 'se') {
                newWidth = Math.max(30, resizeStartSize.current.width + dx);
                newHeight = Math.max(30, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'sw') {
                newWidth = Math.max(30, resizeStartSize.current.width - dx);
                newHeight = Math.max(30, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'ne') {
                newWidth = Math.max(30, resizeStartSize.current.width + dx);
                newHeight = Math.max(30, resizeStartSize.current.height - dy);
            } else if (resizeCorner.current === 'nw') {
                newWidth = Math.max(30, resizeStartSize.current.width - dx);
                newHeight = Math.max(30, resizeStartSize.current.height - dy);
            }

            onResizeEnd?.({ width: newWidth, height: newHeight });
        }
    }, [isDragging, isResizing, onDragEnd, onResizeEnd]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsResizing(false);
        resizeCorner.current = null;
    }, []);

    useEffect(() => {
        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    const handleResizeStart = (e, corner) => {
        e.stopPropagation();
        setIsResizing(true);
        resizeCorner.current = corner;
        resizeStartPos.current = { x: e.clientX, y: e.clientY };
        resizeStartSize.current = { width: currentWidth, height: currentHeight };
    };

    return (
        <div
            ref={divRef}
            className={`element-container ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: currentWidth,
                height: currentHeight,
                backgroundColor: p.backgroundColor || '#3498db',
                border: `${p.borderWidth || 1}px solid ${p.borderColor || '#2c3e50'}`,
                borderRadius: `${p.borderRadius || 0}px`,
                cursor: isSelected ? 'move' : 'pointer',
                ...bgStyle
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
                    fontSize: `${p.fontSize || 14}px`,
                }}>
                    {p.text}
                </div>
            )}
            {isSelected && (
                <>
                    <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
                    <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
                    <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
                    <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
                </>
            )}
        </div>
    );
};

export default RectangleElement;