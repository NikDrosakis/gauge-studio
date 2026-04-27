import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const PLCDataContext = createContext();

// Simulated PLC data
const plcDataValues = {
    'engine_speed': 0,
    'temperature': 0,
    'pressure': 0,
    'fuel_level': 0,
    'oil_pressure': 0,
    // Boolean values
    'engine_ready': 0,
    'zero_cpp': 0,
    'command_mode': 0,
    'lever_mode': 0,
    'clutch_status': 0,
};

export const PLCDataProvider = ({ children }) => {
    const [data, setData] = useState(plcDataValues);
    const [connected, setConnected] = useState(true);

    // Targets for smooth animation
    const targetsRef = useRef({
        engine_speed: 50,
        temperature: 70,
        pressure: 5,
        fuel_level: 80,
        oil_pressure: 45,

        // Boolean τιμές (για gauges)
        engine_ready: 1,
        zero_cpp: 0,
        command_mode: 0,
        lever_mode: 0,
        clutch_status: 0,

    });

    // Randomly change targets every 3-5 seconds
    useEffect(() => {
        const targetInterval = setInterval(() => {
            targetsRef.current = {
                engine_speed: Math.floor(Math.random() * 100),
                temperature: Math.floor(Math.random() * 100) + 20,
                pressure: Math.floor(Math.random() * 9) + 1,
                fuel_level: Math.floor(Math.random() * 100),
                oil_pressure: Math.floor(Math.random() * 70) + 10,

                engine_ready: Math.random() > 0.5 ? 1 : 0,
                zero_cpp: Math.random() > 0.8 ? 1 : 0,
                command_mode: Math.random() > 0.5 ? 1 : 0,
                lever_mode: Math.random() > 0.5 ? 1 : 0,
                clutch_status: Math.random() > 0.6 ? 1 : 0,
            };
        }, 5000);

        return () => clearInterval(targetInterval);
    }, []);

    // Smooth interpolation towards targets
    useEffect(() => {
        const updateInterval = setInterval(() => {
            setData(prev => {
                const newData = { ...prev };
                for (const key of Object.keys(targetsRef.current)) {
                    const target = targetsRef.current[key];
                    const current = prev[key] || 0;
                    const diff = target - current;
                    // Για boolean, άλλαξε κατευθείαν (όχι interpolation)
                    if (key === 'engine_ready' || key === 'zero_cpp' || key === 'command_mode' || key === 'lever_mode' || key === 'clutch_status') {
                        newData[key] = target;
                    } else {
                        newData[key] = current + diff * 0.1;
                    }
                }
                return newData;
            });
        }, 100);

        return () => clearInterval(updateInterval);
    }, []);

    const subscribeToSensor = (sensorId, callback) => {
        let lastValue = data[sensorId];
        const interval = setInterval(() => {
            const currentValue = data[sensorId];
            if (currentValue !== lastValue) {
                lastValue = currentValue;
                console.log(`📡 ${sensorId}: ${currentValue}`);
                callback(currentValue);
            }
        }, 100);
        return () => clearInterval(interval);
    };

    const writeValue = (tag, value) => {
        console.log(`✍️ Writing to PLC: ${tag} = ${value}`);
        targetsRef.current = { ...targetsRef.current, [tag]: value };
        setData(prev => ({ ...prev, [tag]: value }));
    };

    return (
        <PLCDataContext.Provider value={{ data, connected, subscribeToSensor, writeValue }}>
            {children}
        </PLCDataContext.Provider>
    );
};

export const usePLCData = () => useContext(PLCDataContext);