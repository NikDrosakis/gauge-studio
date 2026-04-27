// src/PLCDataProvider.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const PLCDataContext = createContext();

// Simulated PLC data
const plcDataValues = {
    'engine_speed': 0,
    'temperature': 0,
    'pressure': 0,
    'fuel_level': 0,
    'oil_pressure': 0,
};

export const PLCDataProvider = ({ children }) => {
    const [data, setData] = useState(plcDataValues);
    const [connected, setConnected] = useState(true);

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setData({
                engine_speed: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 120) + 20,
                pressure: Math.floor(Math.random() * 10) + 1,
                fuel_level: Math.floor(Math.random() * 100),
                oil_pressure: Math.floor(Math.random() * 80) + 10,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const subscribeToSensor = (sensorId, callback) => {
        // Simulate subscription
        const interval = setInterval(() => {
            callback(data[sensorId] || 0);
        }, 500);
        return () => clearInterval(interval);
    };

    const writeValue = (tag, value) => {
        console.log(`✍️ Writing to PLC: ${tag} = ${value}`);
        // Simulate write response
        setData(prev => ({ ...prev, [tag]: value }));
    };

    return (
        <PLCDataContext.Provider value={{ data, connected, subscribeToSensor, writeValue }}>
            {children}
        </PLCDataContext.Provider>
    );
};

export const usePLCData = () => useContext(PLCDataContext);