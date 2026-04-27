import React, { useState, useEffect } from 'react';

const PropertiesPanel = ({ selectedElement, onUpdate, onSizeChange }) => {
    console.log("PropertiesPanel rendering with:", selectedElement);

    const [localImages, setLocalImages] = useState([]);
    useEffect(() => {
        // Δεν μπορείς να διαβάσεις directory από client-side χωρίς API
        // Αλλά μπορείς να έχεις μια λίστα με paths
        const imagesList = [
            '/assets/gauges/gauge_left.jpg',
            '/assets/gauges/gauge_right.jpg',
            '/assets/gauges/poliorgano_poseidonia.png',
            '/assets/gauges/poliorgano_xoris_labels.png',
            '/assets/gauges/other_image.png',
        ];
        setLocalImages(imagesList);
    }, []);

    const [showCustomUrl, setShowCustomUrl] = useState(false);
    const [customUrl, setCustomUrl] = useState('');

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
            {type === 'numeric' && (
                <>
                    <div className="prop-group">
                        <label>PLC Sensor Tag</label>
                        <select value={p.sensorTag || ''} onChange={e => handleChange('sensorTag', e.target.value)}>
                            <option value="">None (Manual)</option>
                            <option value="engine_speed">Engine Speed (RPM)</option>
                            <option value="temperature">Temperature (°C)</option>
                            <option value="pressure">Pressure (bar)</option>
                            <option value="fuel_level">Fuel Level (%)</option>
                            <option value="oil_pressure">Oil Pressure (bar)</option>
                        </select>
                    </div>

                    <div className="prop-group">
                        <label>Label</label>
                        <input type="text" value={p.label || ''} onChange={e => handleChange('label', e.target.value)} />
                    </div>

                    <div className="prop-group">
                        <label>
                            <input type="checkbox" checked={p.showLabel || false} onChange={e => handleChange('showLabel', e.target.checked)} />
                            Show Label
                        </label>
                    </div>

                    <div className="prop-row">
                        <div className="prop-group">
                            <label>Unit</label>
                            <input type="text" value={p.unit || ''} onChange={e => handleChange('unit', e.target.value)} placeholder="RPM, °C, %" />
                        </div>
                        <div className="prop-group">
                            <label>Decimals: {p.decimals || 1}</label>
                            <input type="range" min="0" max="3" step="1" value={p.decimals || 1} onChange={e => handleChange('decimals', parseInt(e.target.value))} />
                        </div>
                    </div>

                    <div className="prop-group">
                        <label>Text Color</label>
                        <input type="color" value={p.textColor || '#ffffff'} onChange={e => handleChange('textColor', e.target.value)} />
                    </div>

                    <div className="prop-group">
                        <label>Background Color</label>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <input type="color" value={p.backgroundColor || 'transparent'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                            <button onClick={() => handleChange('backgroundColor', 'transparent')}>Transparent</button>
                        </div>
                    </div>

                    <div className="prop-group">
                        <label>Font Size: {p.fontSize || 24}px</label>
                        <input type="range" min="10" max="72" step="2" value={p.fontSize || 24} onChange={e => handleChange('fontSize', parseInt(e.target.value))} />
                    </div>

                    <div className="prop-group">
                        <label>Text Align</label>
                        <select value={p.textAlign || 'center'} onChange={e => handleChange('textAlign', e.target.value)}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>

                    <div className="prop-group">
                        <label>Border Radius: {p.borderRadius || 4}px</label>
                        <input type="range" min="0" max="20" step="1" value={p.borderRadius || 4} onChange={e => handleChange('borderRadius', parseInt(e.target.value))} />
                    </div>
                </>
            )}
            {/* Diktis specific properties */}
            {type === 'diktis' && (
                <>
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
                        <select
                            className="unit-select"
                            value={p.backgroundImage || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '__custom__') {
                                    setShowCustomUrl(true);
                                    setCustomUrl('');
                                    handleChange('backgroundImage', '');
                                } else {
                                    setShowCustomUrl(false);
                                    handleChange('backgroundImage', value);
                                }
                            }}
                        >
                            <option value="">None</option>

                            {/* Local images from public/assets/gauges/ */}
                            <optgroup label="📁 Local Images">
                                {localImages.map(img => (
                                    <option key={img} value={img}>
                                        {img.split('/').pop()}
                                    </option>
                                ))}
                            </optgroup>

                            <option value="__custom__">🔗 Custom URL...</option>
                        </select>

                        {/* Show custom URL input when selected */}
                        {showCustomUrl && (
                            <input
                                type="text"
                                value={customUrl}
                                onChange={(e) => {
                                    setCustomUrl(e.target.value);
                                    handleChange('backgroundImage', e.target.value);
                                }}
                                placeholder="Enter image URL (e.g., https://example.com/image.png)"
                                style={{ marginTop: 8, width: '100%', padding: 8, background: '#2d2d3d', border: '1px solid #555', borderRadius: 4, color: '#fff' }}
                            />
                        )}

                        <small style={{ color: '#666', fontSize: 10, display: 'block', marginTop: 4 }}>
                            Supported: local files (/assets/gauges/...) or external URLs (https://...)
                        </small>
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
                        <button
                            onClick={() => handleChange('backgroundColor', 'transparent')}
                            style={{ padding: '4px 8px', background: '#2d2d3d', border: '1px solid #555', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                        >Transparent</button>
                    </div>
                </>
            )}

            {/* Circle specific properties */}
            {type === 'circle' && (
                <div className="prop-group">
                    <label>Background Color</label>
                    <input type="color" value={p.backgroundColor || '#e74c3c'} onChange={e => handleChange('backgroundColor', e.target.value)} />
                    <button
                        onClick={() => handleChange('backgroundColor', 'transparent')}
                        style={{ padding: '4px 8px', background: '#2d2d3d', border: '1px solid #555', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}
                    >Transparent</button>
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
            {type === 'boolean' && (
                <>
                    <div className="prop-group">
                        <label>PLC Sensor Tag</label>
                        <select value={p.sensorTag || ''} onChange={e => handleChange('sensorTag', e.target.value)}>
                            <option value="">None</option>
                            <option value="engine_ready">Engine Ready</option>
                            <option value="zero_cpp">Zero CPP</option>
                            <option value="command_mode">Command Mode (LOCAL/REMOTE)</option>
                            <option value="lever_mode">Lever Mode (SEPARATED/NOT)</option>
                            <option value="clutch_status">Clutch (OFF/ON)</option>
                        </select>
                    </div>

                    <div className="prop-group">
                        <label>Label</label>
                        <input type="text" value={p.label || ''} onChange={e => handleChange('label', e.target.value)} />
                    </div>

                    <div className="prop-group">
                        <label>
                            <input type="checkbox" checked={p.showLabel !== false} onChange={e => handleChange('showLabel', e.target.checked)} />
                            Show Label
                        </label>
                    </div>

                    <div className="prop-row">
                        <div className="prop-group">
                            <label>OFF Color</label>
                            <input type="color" value={p.offColor || '#555'} onChange={e => handleChange('offColor', e.target.value)} />
                        </div>
                        <div className="prop-group">
                            <label>ON Color</label>
                            <input type="color" value={p.onColor || '#4CAF50'} onChange={e => handleChange('onColor', e.target.value)} />
                        </div>
                    </div>

                    <div className="prop-group">
                        <label>Background Image (OFF)</label>
                        <input type="text" value={p.offImage || ''} onChange={e => handleChange('offImage', e.target.value)} placeholder="/assets/indicator_off.png" />
                    </div>

                    <div className="prop-group">
                        <label>Background Image (ON)</label>
                        <input type="text" value={p.onImage || ''} onChange={e => handleChange('onImage', e.target.value)} placeholder="/assets/indicator_on.png" />
                    </div>

                    <div className="prop-group">
                        <label>Border Radius: {p.borderRadius || 8}px</label>
                        <input type="range" min="0" max="50" step="2" value={p.borderRadius || 8} onChange={e => handleChange('borderRadius', parseInt(e.target.value))} />
                    </div>
                </>
            )}
            <div className="prop-group">
                <label>Background Image URL</label>
                <input type="text" value={p.backgroundImage || ''} onChange={e => handleChange('backgroundImage', e.target.value)} placeholder="/assets/image.png" />
            </div>

            <div className="prop-row">
                <div className="prop-group">
                    <label>Image Size: {p.backgroundImageSize || 100}%</label>
                    <input type="range" min="20" max="150" step="5" value={p.backgroundImageSize || 100} onChange={e => handleChange('backgroundImageSize', parseInt(e.target.value))} />
                </div>
                <div className="prop-group">
                    <label>Image Opacity: {p.backgroundImageOpacity || 100}%</label>
                    <input type="range" min="0" max="100" step="5" value={p.backgroundImageOpacity || 100} onChange={e => handleChange('backgroundImageOpacity', parseInt(e.target.value))} />
                </div>
            </div>
        </div>
    );
};

export default PropertiesPanel;