// src/Components/Elements/DiktisGauge.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePLCData } from '../PLCDataProvider';
const DiktisGauge = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onResizeEnd, onContextMenu }) => {
    const canvasRef = useRef(null);
    const [loadedImage, setLoadedImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);

    const { data, subscribeToSensor } = usePLCData();// ← data αλλάζει κάθε 1 sec
    const [currentValue, setCurrentValue] = useState(p.value || 0);

    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartElementPos = useRef({ x: 0, y: 0 });
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });
    const resizeCorner = useRef(null);


    useEffect(() => {
        if (p.sensorTag && p.sensorTag !== '') {
            const unsubscribe = subscribeToSensor(p.sensorTag, (newValue) => {
                setCurrentValue(newValue);
            });
            return unsubscribe;
        }
    }, [p.sensorTag]);


    // Live update from PLC
    useEffect(() => {
        if (p.sensorTag && data[p.sensorTag] !== undefined) {
            console.log(`📊 ${p.sensorTag} = ${data[p.sensorTag]}`);
            setCurrentValue(data[p.sensorTag]);
        }
    }, [data, p.sensorTag]);

    // Also update when manual value changes (when no sensor)
    useEffect(() => {
        if (!p.sensorTag) {
            setCurrentValue(p.value);
        }
    }, [p.value, p.sensorTag]);

// Load background image - Υποστηρίζει local και external
    useEffect(() => {
        if (p.backgroundImage && p.backgroundImage !== '') {
            const img = new Image();

            // Μόνο για external URLs βάζουμε crossOrigin
            if (p.backgroundImage.startsWith('http')) {
                img.crossOrigin = "Anonymous";
            }

            img.src = p.backgroundImage;
            img.onload = () => {
                console.log("✅ Image loaded:", p.backgroundImage);
                setLoadedImage(img);
            };
            img.onerror = (err) => {
                console.error("❌ Failed to load:", p.backgroundImage);
                setLoadedImage(null);
            };
        } else {
            setLoadedImage(null);
        }
    }, [p.backgroundImage]);

    // Draw gauge
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = size?.width || 200;
        const height = size?.height || 200;
        canvas.width = width;
        canvas.height = height;

        const centerX = width / 2;
        const centerY = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Background color
        if (p.backgroundColor && p.backgroundColor !== 'transparent') {
            ctx.fillStyle = p.backgroundColor;
            ctx.fillRect(0, 0, width, height);
        }

        // Background image
        if (loadedImage) {
            const imgSize = Math.min(width, height) * (p.backgroundImageSize / 100);
            const imgX = (width - imgSize) / 2;
            const imgY = (height - imgSize) / 2;
            ctx.save();
            ctx.globalAlpha = p.backgroundImageOpacity / 100;
            ctx.drawImage(loadedImage, imgX, imgY, imgSize, imgSize);
            ctx.restore();
        }

        const radius = Math.min(width, height) * 0.7;
        const startAngleRad = (p.startAngle * Math.PI) / 180;
        const endAngleRad = (p.endAngle * Math.PI) / 180;

        // Arc
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngleRad, endAngleRad);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Tick marks
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const angle = p.startAngle + (t * (p.endAngle - p.startAngle));
            const rad = (angle * Math.PI) / 180;
            const x1 = centerX + (radius - 8) * Math.cos(rad);
            const y1 = centerY + (radius - 8) * Math.sin(rad);
            const x2 = centerX + (radius + 2) * Math.cos(rad);
            const y2 = centerY + (radius + 2) * Math.sin(rad);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = "#888";
            ctx.lineWidth = i % 2 === 0 ? 2 : 1;
            ctx.stroke();
        }

        // Needle
        const normalized = Math.min(1, Math.max(0, (currentValue - p.min) / (p.max - p.min)));
        const angleRange = p.endAngle - p.startAngle;
        const needleAngle = p.startAngle + (normalized * angleRange);
        const needleRad = (needleAngle * Math.PI) / 180;
        const needleLength = radius - 10;
        const needleX = centerX + needleLength * Math.cos(needleRad);
        const needleY = centerY + needleLength * Math.sin(needleRad);

        ctx.shadowBlur = 4;
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(needleX, needleY);
        ctx.strokeStyle = p.pointerColor;
        ctx.lineWidth = p.pointerWidth;
        ctx.stroke();

        // Center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = p.pointerColor;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.shadowBlur = 0;

        // Value text
        if (p.showValue !== false) {
            const fontSize = Math.max(10, Math.min(20, width / 10));
            ctx.font = `bold ${fontSize}px 'Verdana'`;
            ctx.fillStyle = p.pointerColor;
            ctx.textAlign = "center";
            ctx.fillText(`${Math.round(currentValue)}${p.unit}`, centerX, centerY - radius - 10);
        }

        // Title
        if (p.title) {
            const fontSize = Math.max(9, Math.min(14, width / 15));
            ctx.font = `${fontSize}px 'Verdana'`;
            ctx.fillStyle = "#aaa";
            ctx.textAlign = "center";
            ctx.fillText(p.title, centerX, centerY + radius + 15);
        }
    }, [p, loadedImage, size, currentValue]);

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
                newWidth = Math.max(50, resizeStartSize.current.width + dx);
                newHeight = Math.max(50, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'sw') {
                newWidth = Math.max(50, resizeStartSize.current.width - dx);
                newHeight = Math.max(50, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'ne') {
                newWidth = Math.max(50, resizeStartSize.current.width + dx);
                newHeight = Math.max(50, resizeStartSize.current.height - dy);
            } else if (resizeCorner.current === 'nw') {
                newWidth = Math.max(50, resizeStartSize.current.width - dx);
                newHeight = Math.max(50, resizeStartSize.current.height - dy);
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
        resizeStartSize.current = { width: size?.width || 200, height: size?.height || 200 };
    };

    const currentWidth = size?.width || 200;
    const currentHeight = size?.height || 200;

    return (
        <div
            className={`gauge-container ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: currentWidth,
                height: currentHeight,
                cursor: isSelected ? 'move' : 'pointer',
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        >
            <canvas ref={canvasRef} className="gauge-canvas" style={{ width: '100%', height: '100%' }} />
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

export default DiktisGauge;