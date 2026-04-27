// src/Components/ElementsSidebar.jsx
import React from 'react';

// SVG Icons αντί για imports (για να είναι ανεξάρτητο)
const Icons = {
    mouse: () => (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="20" width="20">
            <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103zM2.25 8.184l3.897 1.67a.5.5 0 0 1 .262.263l1.67 3.897L12.743 3.52 2.25 8.184z"/>
        </svg>
    ),
    diktis: () => (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20">
            <path d="M128,40a96,96,0,1,0,96,96A96.11,96.11,0,0,0,128,40Zm45.66,61.66-40,40a8,8,0,0,1-11.32-11.32l40-40a8,8,0,0,1,11.32,11.32ZM96,16a8,8,0,0,1,8-8h48a8,8,0,0,1,0,16H104A8,8,0,0,1,96,16Z"/>
        </svg>
    ),
    rectangle: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M1 1H13.5H14V1.5V13.5V14H13.5H1.5H1V13.5V1.5V1ZM2 2V13H13V2H2Z" fill="currentColor"/>
        </svg>
    ),
    text: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3.94993 2.95002L3.94993 4.49998C3.94993 4.74851 3.74845 4.94998 3.49993 4.94998C3.2514 4.94998 3.04993 4.74851 3.04993 4.49998V2.50004C3.04993 2.45246 3.05731 2.40661 3.07099 2.36357C3.12878 2.18175 3.29897 2.05002 3.49993 2.05002H11.4999C11.6553 2.05002 11.7922 2.12872 11.8731 2.24842C11.9216 2.32024 11.9499 2.40682 11.9499 2.50002V4.49998C11.9499 4.74851 11.7485 4.94998 11.4999 4.94998C11.2514 4.94998 11.0499 4.74851 11.0499 4.49998V2.95002H8.04993V12.05H9.25428C9.50281 12.05 9.70428 12.2515 9.70428 12.5C9.70428 12.7486 9.50281 12.95 9.25428 12.95H5.75428C5.50575 12.95 5.30428 12.7486 5.30428 12.5C5.30428 12.2515 5.50575 12.05 5.75428 12.05H6.94993V2.95002H3.94993Z" fill="currentColor"/>
        </svg>
    ),
    circle: () => (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M0.877075 7.49991C0.877075 3.84222 3.84222 0.877075 7.49991 0.877075C11.1576 0.877075 14.1227 3.84222 14.1227 7.49991C14.1227 11.1576 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1576 0.877075 7.49991ZM7.49991 1.82708C4.36689 1.82708 1.82708 4.36689 1.82708 7.49991C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49991C13.1727 4.36689 10.6329 1.82708 7.49991 1.82708Z" fill="currentColor"/>
        </svg>
    ),
    bar: () => (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="20" width="20">
            <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"/>
        </svg>
    ),
    button: () => (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256" height="20" width="20">
            <path d="M208,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28Zm-4,176H52V52H204ZM76,128a12,12,0,0,1,12-12h51l-11.52-11.51a12,12,0,1,1,17-17l32,32a12,12,0,0,1,0,17l-32,32a12,12,0,1,1-17-17L139,140H88A12,12,0,0,1,76,128Z"/>
        </svg>
    ),
    line: () => (
        <svg stroke="currentColor" fill="none" strokeWidth="1.5" viewBox="0 0 24 24" height="20" width="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"/>
        </svg>
    ),
    input: () => (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="20" width="20">
            <path d="M5 4h1a3 3 0 0 1 3 3 3 3 0 0 1 3-3h1M13 20h-1a3 3 0 0 1-3-3 3 3 0 0 1-3 3H5M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7M9 7v10"/>
        </svg>
    ),
    icon: () => (
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20">
            <path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/>
        </svg>
    ),
};

// Tools definition
const tools = [
    { id: 'select', name: 'Select/Move Tool', icon: 'mouse', type: 'mouse' },
    { id: 'diktis', name: 'Diktis / Gauge', icon: 'diktis', type: 'diktis' },
    { id: 'rectangle', name: 'Rectangle', icon: 'rectangle', type: 'rectangle' },
    { id: 'circle', name: 'Circle', icon: 'circle', type: 'circle' },
    { id: 'text', name: 'Display text', icon: 'text', type: 'text' },
    { id: 'bar', name: 'Bar', icon: 'bar', type: 'bar' },
    { id: 'button', name: 'Button', icon: 'button', type: 'button' },
    { id: 'line', name: 'Line', icon: 'line', type: 'line' },
    { id: 'input', name: 'Input Field', icon: 'input', type: 'input' },
    { id: 'icon', name: 'Icon/Asset', icon: 'icon', type: 'icon' },
];

const ElementsSidebar = ({ activeType, onStartDrag, onUnlockAll }) => {
    const getIcon = (iconName) => {
        const IconComponent = Icons[iconName];
        return IconComponent ? <IconComponent /> : null;
    };

    return (
        <div style={{
            width: 72,
            backgroundColor: '#1a1a2e',
            borderRight: '1px solid #2d2d3d',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 8px',
            gap: '8px',
            height: '100%',
            overflowY: 'auto'
        }}>
            {tools.map(tool => {
                const isSelected = activeType === tool.type;
                return (
                    <button
                        key={tool.id}
                        onClick={() => onStartDrag(tool.type === 'select' ? null : { style: { type: tool.type, width: 200, height: 200 } })}
                        title={tool.name}
                        style={{
                            width: 48,
                            height: 48,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isSelected ? '#4a4a6a' : '#2d2d3d',
                            border: isSelected ? '1px solid #ff6666' : '1px solid #3d3d4d',
                            borderRadius: 8,
                            cursor: 'pointer',
                            color: '#fff',
                            transition: 'all 0.2s',
                            margin: '0 auto'
                        }}
                    >
                        {getIcon(tool.icon)}
                    </button>
                );
            })}
        </div>
    );
};

export default ElementsSidebar;