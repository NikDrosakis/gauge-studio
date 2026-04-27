// src/Components/PropertiesPanel.jsx
import React from 'react';

const PropertiesPanel = ({ selectedElement, onUpdate, onSizeChange }) => {
    console.log("PropertiesPanel rendering with:", selectedElement);

    if (!selectedElement) {
        return (
            <div className="properties-panel">
                <h3>Properties</h3>
                <p style={{ color: '#888', marginTop: 20 }}>Select an element to edit</p>
            </div>
        );
    }

    const p = selectedElement.props;
    const type = selectedElement.type;

    const handleChange = (key, value) => {
        onUpdate({ ...p, [key]: value });
    };

    // Width/Height controls for all elements
    const handleSizeChange = (dimension, value) => {
        onSizeChange?.({
            ...selectedElement.size,
            [dimension]: parseInt(value)
        });
    };

    // Default unit options for diktis
    const unitOptions = [
        { value: '', label: 'None' },
        { value: 'RPM', label: 'RPM' }, { value: '°C', label: '°C' },
        { value: '°F', label: '°F' }, { value: 'bar', label: 'bar' },
        { value: 'psi', label: 'psi' }, { value: '%', label: '%' },
        { value: 'kW', label: 'kW' }, { value: 'HP', label: 'HP' },
        { value: 'm/s', label: 'm/s' }, { value: 'km/h', label: 'km/h' },
        { value: 'L/min', label: 'L/min' }, { value: 'm³/h', label: 'm³/h' },
    ];

    return (
        <div className="properties-panel">
            <h3>{type === 'diktis' ? 'Diktis Properties' : `${type.charAt(0).toUpperCase() + type.slice(1)} Properties`}</h3>

            {/* Width/Height controls */}
            <div className="prop-row">
                <div className="prop-group">
                    <label>Width: {selectedElement.size?.width || 100}px</label>
                    <input
                        type="range"
                        min="20"
                        max="500"
                        value={selectedElement.size?.width || 100}
                        onChange={e => handleSizeChange('width', e.target.value)}
                    />
                </div>
                <div className="prop-group">
                    <label>PLC Sensor Tag</label>
                    <select value={p.sensorTag || ''} onChange={e => handleChange('sensorTag', e.target.value)}>
                        <option value="">None</option>
                        <option value="engine_speed">Engine Speed (RPM)</option>
                        <option value="temperature">Temperature (°C)</option>
                        <option value="pressure">Pressure (bar)</option>
                        <option value="fuel_level">Fuel Level (%)</option>
                        <option value="oil_pressure">Oil Pressure (bar)</option>
                    </select>
                </div>
                <div className="prop-group">
                    <label>Height: {selectedElement.size?.height || 100}px</label>
                    <input
                        type="range"
                        min="20"
                        max="500"
                        value={selectedElement.size?.height || 100}
                        onChange={e => handleSizeChange('height', e.target.value)}
                    />
                </div>
            </div>

            {/* Diktis specific properties */}
            {type === 'diktis' && (
                <>
                    <div className="prop-group">
                        <label>Title</label>
                        <input type="text" value={p.title || ''} onChange={e => handleChange('title', e.target.value)} />
                    </div>

                    <div className="prop-row">
                        <div className="prop-group">
                            <label>Min</label>
                            <input type="number" value={p.min} onChange={e => handleChange('min', parseFloat(e.target.value))} />
                        </div>
                        <div className="prop-group">
                            <label>Max</label>
                            <input type="number" value={p.max} onChange={e => handleChange('max', parseFloat(e.target.value))} />
                        </div>
                    </div>

                    <div className="prop-group">
                        <label>Value: {p.value}</label>
                        <input type="range" min={p.min} max={p.max} step="1" value={p.value} onChange={e => handleChange('value', parseFloat(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>Unit</label>
                        <select className="unit-select" value={p.unit || ''} onChange={e => handleChange('unit', e.target.value)}>
                            {unitOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>

                    <div className="prop-group">
                        <label>Pointer Color</label>
                        <input type="color" value={p.pointerColor} onChange={e => handleChange('pointerColor', e.target.value)} />
                    </div>

                    <div className="prop-group">
                        <label>Pointer Width: {p.pointerWidth}px</label>
                        <input type="range" min="1" max="20" step="1" value={p.pointerWidth} onChange={e => handleChange('pointerWidth', parseInt(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>Start Angle: {p.startAngle}°</label>
                        <input type="range" min="-180" max="180" step="5" value={p.startAngle} onChange={e => handleChange('startAngle', parseFloat(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>End Angle: {p.endAngle}°</label>
                        <input type="range" min="-180" max="180" step="5" value={p.endAngle} onChange={e => handleChange('endAngle', parseFloat(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>Background Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="color" value={p.backgroundColor || '#3498db'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                            <button
                                onClick={() => handleChange('backgroundColor', 'transparent')}
                                style={{ padding: '4px 8px', background: '#2d2d3d', border: '1px solid #555', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                            >Transparent</button>
                        </div>
                    </div>

                    <div className="prop-group">
                        <label>Background Image URL</label>
                        <input type="text" value={p.backgroundImage || ''} onChange={e => handleChange('backgroundImage', e.target.value)} placeholder="https://example.com/image.png" />
                    </div>

                    <div className="prop-group">
                        <label>Image Size: {p.backgroundImageSize}%</label>
                        <input type="range" min="20" max="150" step="5" value={p.backgroundImageSize} onChange={e => handleChange('backgroundImageSize', parseInt(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>Image Opacity: {p.backgroundImageOpacity}%</label>
                        <input type="range" min="0" max="100" step="5" value={p.backgroundImageOpacity} onChange={e => handleChange('backgroundImageOpacity', parseInt(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>
                            <input type="checkbox" checked={p.showValue !== false} onChange={e => handleChange('showValue', e.target.checked)} />
                            Show Value
                        </label>
                    </div>
                </>
            )}

            {/* Rectangle specific properties */}
            {type === 'rectangle' && (
                <>
                    <div className="prop-group">
                        <label>Background Color</label>
                        <input type="color" value={p.backgroundColor || '#3498db'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                    </div>
                    <div className="prop-group">
                        <label>Border Radius: {p.borderRadius || 0}px</label>
                        <input type="range" min="0" max="50" step="2" value={p.borderRadius || 0} onChange={e => handleChange('borderRadius', parseInt(e.target.value))} />
                    </div>
                </>
            )}

            {/* Circle specific properties */}
            {type === 'circle' && (
                <div className="prop-group">
                    <label>Background Color</label>
                    <input type="color" value={p.backgroundColor || '#e74c3c'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                </div>
            )}

            {/* Text specific properties */}
            {type === 'text' && (
                <>
                    <div className="prop-group">
                        <label>Text</label>
                        <input type="text" value={p.text || ''} onChange={e => handleChange('text', e.target.value)} />
                    </div>
                    <div className="prop-group">
                        <label>Text Color</label>
                        <input type="color" value={p.textColor || '#333'} onChange={e => handleChange('textColor', e.target.value)} />
                    </div>
                    <div className="prop-group">
                        <label>Font Size: {p.fontSize || 16}px</label>
                        <input type="range" min="8" max="48" step="2" value={p.fontSize || 16} onChange={e => handleChange('fontSize', parseInt(e.target.value))} />
                    </div>
                </>
            )}

            {/* Bar specific properties */}
            {type === 'bar' && (
                <>
                    <div className="prop-group">
                        <label>Value: {p.value || 50}%</label>
                        <input type="range" min="0" max="100" step="1" value={p.value || 50} onChange={e => handleChange('value', parseFloat(e.target.value))} />
                    </div>
                    <div className="prop-group">
                        <label>Fill Color</label>
                        <input type="color" value={p.fillColor || '#ff6666'} onChange={e => handleChange('fillColor', e.target.value)} />
                    </div>
                    <div className="prop-group">
                        <label>Background Color</label>
                        <input type="color" value={p.backgroundColor || '#2d2d3d'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                    </div>
                </>
            )}
        </div>
    );
};

export default PropertiesPanel;