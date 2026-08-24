import { db } from './db.js';

class IoTService {
  constructor() {
    this.wsClients = new Set();
    this.simulationInterval = null;
    this.alertLog = [];
    this.isSimulationActive = true;
    this.startBackgroundSimulation();
  }

  registerClient(ws) {
    this.wsClients.add(ws);
    // Send current state immediately on connect
    const currentState = db.getIoTSensors();
    ws.send(JSON.stringify({ type: 'IOT_STATE', data: currentState, alerts: this.alertLog.slice(-5) }));

    ws.on('close', () => {
      this.wsClients.delete(ws);
    });
  }

  broadcast(message) {
    const payload = typeof message === 'string' ? message : JSON.stringify(message);
    for (const client of this.wsClients) {
      if (client.readyState === 1) { // OPEN
        client.send(payload);
      }
    }
  }

  getCurrentState() {
    return {
      sensors: db.getIoTSensors(),
      recentAlerts: this.alertLog.slice(-10)
    };
  }

  processTelemetry(payload) {
    const { sensorType, value, unit, nodeId, location, humidity } = payload;
    const sensors = db.getIoTSensors();
    let alertGenerated = null;

    if (sensorType === 'temperature') {
      const numVal = parseFloat(value);
      let status = 'Optimal';
      if (numVal >= 38.0) {
        status = 'Critical';
        alertGenerated = { id: `alt_${Date.now()}`, type: 'CRITICAL', title: 'High Heat Warning', message: `Server Room temp spiked to ${numVal}°C!`, timestamp: new Date().toISOString() };
      } else if (numVal >= 32.0) {
        status = 'Warning';
      }

      const history = [...(sensors.temperature?.history || [])];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      history.push({ time: timeStr, value: numVal });
      if (history.length > 15) history.shift();

      db.updateIoTSensor('temperature', { value: numVal, status, humidity: humidity || sensors.temperature?.humidity || 50, history });
    } else if (sensorType === 'smoke') {
      const numVal = parseInt(value, 10);
      let status = 'Safe';
      if (numVal >= 300) {
        status = 'Hazard';
        alertGenerated = { id: `alt_${Date.now()}`, type: 'CRITICAL', title: 'Smoke / Fire Hazard Detected!', message: `MQ-2 reading ${numVal} PPM exceeds safety threshold!`, timestamp: new Date().toISOString() };
      } else if (numVal >= 150) {
        status = 'Warning';
      }

      const history = [...(sensors.smoke?.history || [])];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      history.push({ time: timeStr, value: numVal });
      if (history.length > 15) history.shift();

      db.updateIoTSensor('smoke', { value: numVal, status, history });
    } else if (sensorType === 'waterLevel') {
      const numVal = parseInt(value, 10);
      let status = 'Sufficient';
      if (numVal <= 20) {
        status = 'Low';
        alertGenerated = { id: `alt_${Date.now()}`, type: 'WARNING', title: 'Low Water Level Alert', message: `Overhead tank level dropped to ${numVal}%. Refill required.`, timestamp: new Date().toISOString() };
      } else if (numVal >= 95) {
        status = 'Overflow Risk';
      }

      const history = [...(sensors.waterLevel?.history || [])];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      history.push({ time: timeStr, value: numVal });
      if (history.length > 15) history.shift();

      db.updateIoTSensor('waterLevel', { value: numVal, liters: Math.round(numVal * 200), status, history });
    } else if (sensorType === 'electricity') {
      const numVal = parseFloat(value);
      let status = numVal > 28 ? 'Overload' : (numVal > 22 ? 'Peak' : 'Normal');

      const history = [...(sensors.electricity?.history || [])];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      history.push({ time: timeStr, value: numVal });
      if (history.length > 15) history.shift();

      db.updateIoTSensor('electricity', { value: numVal, status, history });
    }

    if (alertGenerated) {
      this.alertLog.push(alertGenerated);
      this.broadcast({ type: 'IOT_ALERT', alert: alertGenerated });
    }

    this.broadcast({ type: 'IOT_UPDATE', data: db.getIoTSensors() });
    return { success: true, updated: db.getIoTSensors(), alert: alertGenerated };
  }

  triggerHazardSimulation(type, customValue) {
    if (type === 'smoke_spike') {
      return this.processTelemetry({ sensorType: 'smoke', value: customValue || 460 });
    } else if (type === 'water_low') {
      return this.processTelemetry({ sensorType: 'waterLevel', value: customValue || 14 });
    } else if (type === 'temp_spike') {
      return this.processTelemetry({ sensorType: 'temperature', value: customValue || 41.5 });
    } else if (type === 'power_surge') {
      return this.processTelemetry({ sensorType: 'electricity', value: customValue || 32.8 });
    } else if (type === 'reset') {
      this.processTelemetry({ sensorType: 'temperature', value: 24.5 });
      this.processTelemetry({ sensorType: 'smoke', value: 45 });
      this.processTelemetry({ sensorType: 'waterLevel', value: 80 });
      this.processTelemetry({ sensorType: 'electricity', value: 18.2 });
      this.alertLog = [];
      return { success: true, message: 'IoT telemetry reset to optimal baseline.' };
    }
    return { success: false, error: 'Unknown simulation type' };
  }

  toggleEquipment(eqId, newState) {
    const updated = db.updateIoTEquipment(eqId, newState, newState === 'ON' ? 'Active' : 'Standby');
    this.broadcast({ type: 'IOT_UPDATE', data: db.getIoTSensors() });
    return updated;
  }

  startBackgroundSimulation() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(() => {
      if (!this.isSimulationActive) return;
      const sensors = db.getIoTSensors();
      if (!sensors || !sensors.temperature) return;

      // Gentle realistic variations
      const currentTemp = sensors.temperature.value;
      const tempDelta = (Math.random() * 0.4 - 0.2);
      const newTemp = Math.max(22, Math.min(30, parseFloat((currentTemp + tempDelta).toFixed(1))));

      const currentPower = sensors.electricity.value;
      const powerDelta = (Math.random() * 0.6 - 0.3);
      const newPower = Math.max(14, Math.min(24, parseFloat((currentPower + powerDelta).toFixed(1))));

      // Update temperature history
      const tempHist = [...(sensors.temperature.history || [])];
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      tempHist.push({ time: timeStr, value: newTemp });
      if (tempHist.length > 12) tempHist.shift();

      // Update power history
      const pwrHist = [...(sensors.electricity.history || [])];
      pwrHist.push({ time: timeStr, value: newPower });
      if (pwrHist.length > 12) pwrHist.shift();

      db.updateIoTSensor('temperature', { value: newTemp, history: tempHist });
      db.updateIoTSensor('electricity', { value: newPower, history: pwrHist });

      this.broadcast({ type: 'IOT_UPDATE', data: db.getIoTSensors() });
    }, 4000);
  }
}

export const iotService = new IoTService();
