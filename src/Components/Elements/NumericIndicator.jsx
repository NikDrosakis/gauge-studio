// src/Components/Elements/NumericIndicator.jsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { usePLCData } from '../PLCDataProvider';

const NumericIndicator = ({ props: p, isSelected, onSelect, onDragEnd, position, size, onResizeEnd, onContextMenu }) => {
    const divRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [currentValue, setCurrentValue] = useState(p.value || 0);

    const { data } = usePLCData();

    const dragStartPos = useRef({ x: 0, y: 0 });
    const dragStartElementPos = useRef({ x: 0, y: 0 });
    const resizeStartPos = useRef({ x: 0, y: 0 });
    const resizeStartSize = useRef({ width: 0, height: 0 });
    const resizeCorner = useRef(null);

    // Live update from PLC
    useEffect(() => {
        if (p.sensorTag && data[p.sensorTag] !== undefined) {
            setCurrentValue(data[p.sensorTag]);
        }
    }, [data, p.sensorTag]);

    // Manual value update (when no sensor)
    useEffect(() => {
        if (!p.sensorTag) {
            setCurrentValue(p.value);
        }
    }, [p.value, p.sensorTag]);

    const currentWidth = size?.width || 100;
    const currentHeight = size?.height || 50;

    // Get color based on value and thresholds
    const getValueColor = () => {
        if (p.thresholds && p.thresholds.length > 0) {
            for (let i = p.thresholds.length - 1; i >= 0; i--) {
                if (currentValue >= p.thresholds[i].value) {
                    return p.thresholds[i].color;
                }
            }
        }
        return p.textColor || '#ffffff';
    };

    // Format value with decimals
    const formattedValue = () => {
        const decimals = p.decimals !== undefined ? p.decimals : 1;
        const valueStr = currentValue.toFixed(decimals);

        // Unit position: 'right' (default) or 'left'
        if (p.unitPosition === 'left') {
            return `${p.unit || ''}${valueStr}`;
        }
        return `${valueStr}${p.unit || ''}`;
    };
    // Format label
    const displayLabel = p.showLabel && p.label ? `${p.label}: ` : '';
    const displayUnit = p.unit && p.showUnit !== false ? p.unit : '';

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
                newWidth = Math.max(40, resizeStartSize.current.width + dx);
                newHeight = Math.max(25, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'sw') {
                newWidth = Math.max(40, resizeStartSize.current.width - dx);
                newHeight = Math.max(25, resizeStartSize.current.height + dy);
            } else if (resizeCorner.current === 'ne') {
                newWidth = Math.max(40, resizeStartSize.current.width + dx);
                newHeight = Math.max(25, resizeStartSize.current.height - dy);
            } else if (resizeCorner.current === 'nw') {
                newWidth = Math.max(40, resizeStartSize.current.width - dx);
                newHeight = Math.max(25, resizeStartSize.current.height - dy);
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
            className={`numeric-container ${isSelected ? 'selected' : ''}`}
            style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                width: currentWidth,
                height: currentHeight,
                backgroundColor: p.backgroundColor || 'transparent',
                borderRadius: `${p.borderRadius || 4}px`,
                border: `${p.borderWidth || 1}px solid ${p.borderColor || '#444'}`,
                cursor: isSelected ? 'move' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: p.textAlign || 'center',
                padding: '0 8px',
            }}
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            onMouseDown={handleMouseDown}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); onContextMenu?.(e); }}
        >
<span style={{
    color: p.textColor || '#ffffff',  // ← αντί για getValueColor()
    fontSize: `${p.fontSize || 24}px`,
    fontWeight: p.fontWeight || 'bold',
    fontFamily: p.fontFamily || 'monospace',
}}>
    {displayLabel}{formattedValue()}
</span>
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

export default NumericIndicator;