// src/Components/ContextMenu.jsx
import React from 'react';

const ContextMenu = ({ isVisible, x, y, elementId, onAction }) => {
    if (!isVisible) return null;

    const menuItems = [
        { id: 'delete', label: 'Delete', icon: '🗑️', action: 'delete' },
        { id: 'duplicate', label: 'Duplicate', icon: '📋', action: 'duplicate' },
        { id: 'bringToFront', label: 'Bring to Front', icon: '⬆️', action: 'bringToFront' },
        { id: 'sendToBack', label: 'Send to Back', icon: '⬇️', action: 'sendToBack' },
        { id: 'bringForward', label: 'Bring Forward', icon: '🔼', action: 'bringForward' },
        { id: 'sendBackward', label: 'Send Backward', icon: '🔽', action: 'sendBackward' },
    ];

    return (
        <div
            className="context-menu"
            style={{
                position: 'fixed',
                top: y,
                left: x,
                backgroundColor: '#2d2d3d',
                border: '1px solid #555',
                borderRadius: '6px',
                padding: '4px 0',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                minWidth: '160px'
            }}
        >
            {menuItems.map(item => (
                <div
                    key={item.id}
                    className="context-menu-item"
                    onClick={() => onAction(item.action, elementId)}
                    style={{
                        padding: '8px 16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#fff',
                        fontSize: '13px',
                        transition: 'background 0.2s',
                        borderRadius: '4px',
                        margin: '2px 4px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a4a6a'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <span style={{ fontSize: '14px' }}>{item.icon}</span>
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default ContextMenu;