import express from 'express';
import { iotService } from '../iotService.js';

const router = express.Router();

// Get current telemetry & status
router.get('/status', (req, res) => {
  res.json(iotService.getCurrentState());
});

// Telemetry Ingestion Endpoint for ESP32 / Hardware Nodes
router.post('/telemetry', (req, res) => {
  const { sensorType, value, unit, nodeId, location, humidity } = req.body;
  if (!sensorType || value === undefined) {
    return res.status(400).json({ error: 'sensorType and value are required' });
  }

  const result = iotService.processTelemetry({ sensorType, value, unit, nodeId, location, humidity });
  res.json(result);
});

// Trigger Hazard / Telemetry Simulation for Viva demo
router.post('/simulate-hazard', (req, res) => {
  const { type, customValue } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Simulation type is required (e.g. smoke_spike, water_low, temp_spike, power_surge, reset)' });
  }

  const result = iotService.triggerHazardSimulation(type, customValue);
  res.json(result);
});

// Toggle equipment power state
router.post('/equipment/toggle', (req, res) => {
  const { equipmentId, powerState } = req.body;
  if (!equipmentId || !powerState) {
    return res.status(400).json({ error: 'equipmentId and powerState are required' });
  }

  const updated = iotService.toggleEquipment(equipmentId, powerState);
  res.json({ success: true, equipment: updated });
});

export default router;
