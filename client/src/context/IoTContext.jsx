import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const IoTContext = createContext();

export const IoTProvider = ({ children }) => {
  const [sensors, setSensors] = useState({
    temperature: { value: 24.8, unit: '°C', status: 'Optimal', humidity: 52, history: [] },
    smoke: { value: 48, unit: 'PPM', status: 'Safe', history: [] },
    waterLevel: { value: 78, unit: '%', liters: 15600, status: 'Sufficient', history: [] },
    electricity: { value: 18.4, unit: 'kW', status: 'Normal', history: [] },
    equipment: []
  });
  const [alerts, setAlerts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeToast, setActiveToast] = useState(null);

  // Fetch initial telemetry
  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getIoTStatus();
      if (data.sensors) {
        setSensors(data.sensors);
      }
      if (data.recentAlerts) {
        setAlerts(data.recentAlerts);
      }
    } catch (err) {
      console.warn('[IoTContext] Polling fallback error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    // WebSocket connection
    let ws = null;
    let reconnectTimeout = null;

    const connectWS = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:5000/ws`;
      
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          console.log('[IoT WS] Connected to live hardware telemetry stream');
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'IOT_STATE' || msg.type === 'IOT_UPDATE') {
              if (msg.data) setSensors(msg.data);
            }
            if (msg.type === 'IOT_ALERT' && msg.alert) {
              setAlerts(prev => [msg.alert, ...prev.slice(0, 9)]);
              setActiveToast(msg.alert);
              setTimeout(() => {
                setActiveToast(null);
              }, 6000);
            }
          } catch (e) {
            console.error('Error parsing WS message:', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connectWS, 3000);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch (err) {
        console.warn('WS Connect error:', err);
      }
    };

    connectWS();

    // Fallback polling interval
    const pollInterval = setInterval(fetchStatus, 4000);

    return () => {
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      clearInterval(pollInterval);
    };
  }, [fetchStatus]);

  const simulateHazard = async (type, customValue) => {
    try {
      const res = await api.simulateHazard(type, customValue);
      if (res.updated) setSensors(res.updated);
      return res;
    } catch (err) {
      console.error('Hazard simulation error:', err);
    }
  };

  const toggleEquipment = async (eqId, newState) => {
    try {
      const res = await api.toggleEquipment(eqId, newState);
      if (res.equipment) {
        setSensors(prev => ({ ...prev, equipment: res.equipment }));
      }
    } catch (err) {
      console.error('Equipment toggle error:', err);
    }
  };

  return (
    <IoTContext.Provider value={{ sensors, alerts, isConnected, activeToast, setActiveToast, simulateHazard, toggleEquipment, fetchStatus }}>
      {children}
    </IoTContext.Provider>
  );
};

export const useIoT = () => useContext(IoTContext);
