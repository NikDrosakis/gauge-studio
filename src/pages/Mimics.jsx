import React, { useState, useEffect, useRef, useCallback } from 'react';
import ElementsSidebar from '../Components/ElementsSidebar';
import DiktisGauge from '../Components/Elements/DiktisGauge';
import RectangleElement from '../Components/Elements/RectangleElement';
import CircleElement from '../Components/Elements/CircleElement';
import TextElement from '../Components/Elements/TextElement';
import BooleanIndicator from '../Components/Elements/BooleanIndicator';
import NumericIndicator from '../Components/Elements/NumericIndicator';
import BarElement from '../Components/Elements/BarElement';
import PropertiesPanel from '../Components/PropertiesPanel';
import ContextMenu from '../Components/ContextMenu';

const Mimics = () => {
    const [selectedTool, setSelectedTool] = useState('select');
    const [elements, setElements] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, elementId: null });

    // Default ship serial for standalone mode (NO useSelector)
    const shipSerial = 'SV-T-ERGO-ATALANTI';

    const canvasRef = useRef(null);
    const nextId = useRef(1);

    const selectedElement = elements.find(el => el.id === selectedId);

    const getDefaultProps = (type, id) => {
        const defaults = {
            diktis: {
                min: 0, max: 100, value: 50, title: `Diktis ${id}`, unit: "",
                pointerColor: "#ff3333", pointerWidth: 4, startAngle: -135, endAngle: 135,
                showValue: true, backgroundColor: "#1a1a2e", backgroundImage: "",
                backgroundImageSize: 100, backgroundImageOpacity: 100,
            },
            boolean: {
                sensorTag: "",
                label: `Indicator ${id}`,
                showLabel: true,
                offColor: "#555",
                onColor: "#4CAF50",
                offBorderColor: "#888",
                onBorderColor: "#4CAF50",
                offImage: "",
                onImage: "",
                borderRadius: 8,
                fontSize: 10,
                labelColor: "#fff"
            },
            numeric: {
                sensorTag: "",
                label: "",
                showLabel: false,
                value: 0,
                unit: "",
                decimals: 1,
                textColor: "#ffffff",
                backgroundColor: "transparent",
                fontSize: 24,
                fontWeight: "bold",
                fontFamily: "monospace",
                textAlign: "center",
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#444",
                thresholds: [
                    { value: 80, color: "#ff4444" },
                    { value: 60, color: "#ffaa00" },
                    { value: 0, color: "#4CAF50" }
                ]
            },
            rectangle: { backgroundColor: "#3498db", border: "1px solid #2c3e50", borderRadius: 0 },
            circle: { backgroundColor: "#e74c3c", border: "1px solid #c0392b" },
            text: { text: `Text ${id}`, textColor: "#333333", fontSize: 16, fontFamily: "Arial" },
            bar: { value: 50, fillColor: "#ff6666", backgroundColor: "#2d2d3d", border: "1px solid #555", borderRadius: 4 },
        };
        return defaults[type] || {};
    };

    const getDefaultSize = (type) => {
        const sizes = {
            diktis: { width: 200, height: 200 },
            boolean: { width: 80, height: 80 },
            rectangle: { width: 120, height: 80 },
            circle: { width: 100, height: 100 },
            text: { width: 100, height: 40 },
            bar: { width: 50, height: 150 },
            numeric: { width: 120, height: 50 },
        };
        return sizes[type] || { width: 100, height: 100 };
    };

    const addElement = (type, x, y) => {
        const newId = nextId.current++;
        const defaultSize = getDefaultSize(type);
        const newElement = {
            id: newId,
            type: type,
            position: { x: x - defaultSize.width / 2, y: y - defaultSize.height / 2 },
            size: defaultSize,
            props: getDefaultProps(type, newId),
        };
        setElements(prev => [...prev, newElement]);
        setSelectedId(newId);
        setSelectedTool('select');
    };

    const updateElement = (id, newProps) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, props: newProps } : el));
    };

    const updatePosition = (id, newPosition) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, position: newPosition } : el));
    };

    const updateSize = (id, newSize) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, size: newSize } : el));
    };

    const handleCanvasClick = (e) => {
        if (selectedTool === 'select') return;
        if (e.target.closest('.gauge-container, .element-container')) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        addElement(selectedTool, x, y);
    };

    const handleSelect = (id) => {
        setSelectedId(id);
        setSelectedTool('select');
    };

    const handleCanvasClickDeselect = (e) => {
        if (e.target === canvasRef.current || e.target.classList?.contains('canvas-container')) {
            setSelectedId(null);
        }
    };

    const handleStartDrag = useCallback((choice) => {
        console.log("handleStartDrag called with:", choice);
        if (!choice) {
            setSelectedTool('select');
        } else {
            console.log("Setting selectedTool to:", choice.style.type);
            setSelectedTool(choice.style.type);
        }
    }, []);

    const renderElement = (element) => {
        const commonProps = {
            key: element.id,
            props: element.props,
            position: element.position,
            size: element.size,
            shipSerial: shipSerial,
            isSelected: selectedId === element.id,
            onSelect: () => handleSelect(element.id),
            onDragEnd: (newPos) => updatePosition(element.id, newPos),
            onResizeEnd: (newSize) => updateSize(element.id, newSize),
            onContextMenu: (e) => handleContextMenu(e, element.id),  // ← Πρόσθεσε αυτό
        };

        switch (element.type) {
            case 'diktis':
                return <DiktisGauge {...commonProps} />;
            case 'rectangle':
                return <RectangleElement {...commonProps} />;
            case 'circle':
                return <CircleElement {...commonProps} />;
            case 'text':
                return <TextElement {...commonProps} />;
            case 'bar':
                return <BarElement {...commonProps} />;
            case 'boolean':
                return <BooleanIndicator {...commonProps} />;
            case 'numeric':
                return <NumericIndicator {...commonProps} />;
            default:
                return null;
        }
    };

    useEffect(() => {
        const handleDeleteKey = (e) => {
            if ((e.key === 'Delete' || e.key === 'Del') && selectedId) {
                setElements(prev => prev.filter(el => el.id !== selectedId));
                setSelectedId(null);
            }
        };

        window.addEventListener('keydown', handleDeleteKey);
        return () => window.removeEventListener('keydown', handleDeleteKey);
    }, [selectedId]);


    //ContextMenu handlers
    // Layer operations
    const bringToFront = (id) => {
        setElements(prev => {
            const element = prev.find(el => el.id === id);
            if (!element) return prev;
            const others = prev.filter(el => el.id !== id);
            return [...others, element];
        });
    };

    const sendToBack = (id) => {
        setElements(prev => {
            const element = prev.find(el => el.id === id);
            if (!element) return prev;
            const others = prev.filter(el => el.id !== id);
            return [element, ...others];
        });
    };

    const bringForward = (id) => {
        setElements(prev => {
            const index = prev.findIndex(el => el.id === id);
            if (index === -1 || index === prev.length - 1) return prev;
            const newArray = [...prev];
            [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
            return newArray;
        });
    };

    const sendBackward = (id) => {
        setElements(prev => {
            const index = prev.findIndex(el => el.id === id);
            if (index === -1 || index === 0) return prev;
            const newArray = [...prev];
            [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
            return newArray;
        });
    };

    const duplicateElement = (id) => {
        const element = elements.find(el => el.id === id);
        if (!element) return;

        const newId = nextId.current++;
        const newElement = {
            ...element,
            id: newId,
            position: { x: element.position.x + 30, y: element.position.y + 30 },
            props: { ...element.props, title: element.type === 'diktis' ? `${element.props.title} (copy)` : element.props.text ? `${element.props.text} (copy)` : `${element.type} copy` }
        };

        if (newElement.type === 'diktis') {
            newElement.props.title = `${element.props.title || 'Diktis'} (copy)`;
        }
        if (newElement.type === 'text') {
            newElement.props.text = `${element.props.text || 'Text'} (copy)`;
        }

        setElements(prev => [...prev, newElement]);
        setSelectedId(newId);
    };

    const handleContextMenuAction = (action, elementId) => {
        switch (action) {
            case 'delete':
                setElements(prev => prev.filter(el => el.id !== elementId));
                if (selectedId === elementId) setSelectedId(null);
                break;
            case 'duplicate':
                duplicateElement(elementId);
                break;
            case 'bringToFront':
                bringToFront(elementId);
                break;
            case 'sendToBack':
                sendToBack(elementId);
                break;
            case 'bringForward':
                bringForward(elementId);
                break;
            case 'sendBackward':
                sendBackward(elementId);
                break;
            default:
                break;
        }
        setContextMenu({ visible: false, x: 0, y: 0, elementId: null });
    };

    const handleContextMenu = (e, elementId) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            elementId: elementId
        });
    };



    // Save to JSON file
    const saveToJSON = () => {
        const data = {
            version: "1.0",
            createdAt: new Date().toISOString(),
            elements: elements,
            nextId: nextId.current
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diktis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

// Load from JSON file
    const loadFromJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                setElements(data.elements || []);
                nextId.current = data.nextId || Math.max(0, ...(data.elements?.map(el => el.id) || [])) + 1;
                setSelectedId(null);
            } catch (error) {
                console.error("Error loading file:", error);
                alert("Invalid file format");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="editor-container">
            <ElementsSidebar
                activeType={selectedTool}
                onStartDrag={handleStartDrag}
                onUnlockAll={() => {}}
            />
            <button onClick={saveToJSON} style={{ position: 'fixed', bottom: 20, left: 80, padding: '8px 16px', background: '#4a4a6a', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', zIndex: 100 }}>
                💾 Save
            </button>
            <button onClick={() => document.getElementById('load-file-input').click()} style={{ position: 'fixed', bottom: 20, left: 180, padding: '8px 16px', background: '#4a4a6a', border: 'none', borderRadius: 4, color: '#fff', cursor: 'pointer', zIndex: 100 }}>
                📂 Load
            </button>
            <input type="file" id="load-file-input" accept=".json" style={{ display: 'none' }} onChange={loadFromJSON} />

            <div
                className="canvas-container"
                ref={canvasRef}
                onClick={(e) => {
                    handleCanvasClick(e);
                    handleCanvasClickDeselect(e);
                }}
            >
                {elements.map(renderElement)}
                {elements.length === 0 && selectedTool !== 'select' && (
                    <div className="canvas-placeholder">
                        Click anywhere to add a {selectedTool} element
                    </div>
                )}
            </div>

            <PropertiesPanel
                selectedElement={selectedElement}
                onUpdate={(props) => updateElement(selectedId, props)}
                onSizeChange={(newSize) => selectedId && updateSize(selectedId, newSize)}
            />
            <ContextMenu
                isVisible={contextMenu.visible}
                x={contextMenu.x}
                y={contextMenu.y}
                elementId={contextMenu.elementId}
                onAction={handleContextMenuAction}
            />
        </div>
    );
};

export default Mimics;