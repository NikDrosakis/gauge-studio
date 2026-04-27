// src/Components/Elements/BooleanIndicator.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePLCData } from '../PLCDataProvider';

const BooleanIndicator = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onResizeEnd, onContextMenu }) => {
    const divRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [currentValue, setCurrentValue] = useState(false);
    const [loadedImage, setLoadedImage] = useState(null);

    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartElementPos = useRef({ x: 0, y: 0 });
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });
    const resizeCorner = useRef(null);

    // Get PLC data
    const { data } = usePLCData();

    // Live update from PLC data
    useEffect(() => {
        console.log("🔍 BooleanIndicator - my sensor:", p.sensorTag);
        if (p.sensorTag && data && data[p.sensorTag] !== undefined) {
            console.log(`🔍 Value for ${p.sensorTag}: ${data[p.sensorTag]}`);
            const boolValue = data[p.sensorTag] === 1 || data[p.sensorTag] === true;
            setCurrentValue(boolValue);
        }
    }, [data, p.sensorTag]);

    // Load background images...
    useEffect(() => {
        if (p.offImage && p.offImage !== '') {
            const img = new Image();
            if (p.offImage.startsWith('http')) img.crossOrigin = "Anonymous";
            img.src = p.offImage;
            img.onload = () => setLoadedImage(prev => ({ ...prev, off: img }));
        }
    }, [p.offImage]);

    useEffect(() => {
        if (p.onImage && p.onImage !== '') {
            const img = new Image();
            if (p.onImage.startsWith('http')) img.crossOrigin = "Anonymous";
            img.src = p.onImage;
            img.onload = () => setLoadedImage(prev => ({ ...prev, on: img }));
        }
    }, [p.onImage]);

    const currentWidth = size?.width || 80;
    const currentHeight = size?.height || 80;
    const currentImage = currentValue ? loadedImage?.on : loadedImage?.off;
    const currentBgColor = currentValue ? (p.onColor || '#4CAF50') : (p.offColor || '#555');
    const currentBorderColor = currentValue ? (p.onBorderColor || '#4CAF50') : (p.offBorderColor || '#888');

    // Drag handlers...
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
            className={`indicator-container ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: currentWidth,
                height: currentHeight,
                cursor: isSelected ? 'move' : 'pointer',
                backgroundColor: currentBgColor,
                border: `2px solid ${currentBorderColor}`,
                borderRadius: p.borderRadius || '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: currentValue ? `0 0 10px ${currentBgColor}` : 'none'
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        >
            {currentImage && (
                <img
                    src={currentImage.src}
                    alt={p.label || 'indicator'}
                    style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                />
            )}
            {p.showLabel && p.label && (
                <span style={{
                    color: p.labelColor || '#fff',
                    fontSize: p.fontSize || 12,
                    fontWeight: 'bold',
                    position: 'absolute',
                    bottom: 4,
                    left: 0,
                    right: 0,
                    textAlign: 'center'
                }}>
                    {p.label}
                </span>
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

export default BooleanIndicator;