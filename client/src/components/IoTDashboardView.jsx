import React, { useState } from 'react';
import { useIoT } from '../context/IoTContext';
import {
  Activity,
  Flame,
  Droplet,
  Zap,
  Thermometer,
  Cpu,
  Power,
  AlertTriangle,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Wifi
} from 'lucide-react';

export const IoTDashboardView = () => {
  const { sensors, alerts, isConnected, simulateHazard, toggleEquipment } = useIoT();
  const [activeTab, setActiveTab] = useState('live'); // live or hardwareGuide
  const [simMessage, setSimMessage] = useState(null);

  const handleSimulate = async (type, customVal) => {
    const res = await simulateHazard(type, customVal);
    setSimMessage(`Triggered simulation: ${type}`);
    setTimeout(() => setSimMessage(null), 4000);
  };

  const isSmokeCritical = sensors?.smoke?.value > 300;
  const isTempCritical = sensors?.temperature?.value > 35;
  const isWaterLow = sensors?.waterLevel?.value <= 20;

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>IoT Campus Telemetry & Hazard Hub</h1>
            <span className={`badge ${isConnected ? 'badge-success' : 'badge-danger'}`}>
              <Wifi size={12} /> {isConnected ? 'ESP32 WS Connected' : 'Simulated Feed'}
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time multi-sensor telemetry stream from ESP32 nodes & campus infrastructure
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('live')}
            className={`btn btn-sm ${activeTab === 'live' ? 'btn-primary' : 'btn-secondary'}`}
          >
            📊 Live Sensor Feeds
          </button>
          <button
            onClick={() => setActiveTab('hardwareGuide')}
            className={`btn btn-sm ${activeTab === 'hardwareGuide' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🔌 ESP32 Circuit & Pinouts
          </button>
        </div>
      </div>

      {/* Interactive Viva Emergency Simulator Toolbar */}
      <div className="glass-panel" style={{ padding: '18px 24px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-primary)" />
            <strong style={{ fontSize: '0.95rem' }}>Viva Demonstration Hazard & Telemetry Simulator</strong>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Trigger real-time campus hazard alerts on demand for viva evaluation
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleSimulate('smoke_spike', 460)}
            className="btn btn-sm"
            style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171' }}
          >
            <Flame size={14} /> Simulate Smoke Spike (460 PPM)
          </button>

          <button
            onClick={() => handleSimulate('water_low', 14)}
            className="btn btn-sm"
            style={{ background: 'rgba(6, 182, 212, 0.2)', border: '1px solid #06b6d4', color: '#67e8f9' }}
          >
            <Droplet size={14} /> Simulate Low Water Level (14%)
          </button>

          <button
            onClick={() => handleSimulate('temp_spike', 41.5)}
            className="btn btn-sm"
            style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fbbf24' }}
          >
            <Thermometer size={14} /> Simulate Server Room Heat (41.5°C)
          </button>

          <button
            onClick={() => handleSimulate('power_surge', 32.8)}
            className="btn btn-sm"
            style={{ background: 'rgba(168, 85, 247, 0.2)', border: '1px solid #a855f7', color: '#c084fc' }}
          >
            <Zap size={14} /> Simulate Power Surge (32.8 kW)
          </button>

          <button
            onClick={() => handleSimulate('reset')}
            className="btn btn-sm btn-secondary"
            style={{ marginLeft: 'auto' }}
          >
            <RotateCcw size={14} /> Reset Baseline
          </button>
        </div>

        {simMessage && (
          <div style={{ marginTop: '10px', fontSize: '0.78rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={14} /> {simMessage}
          </div>
        )}
      </div>

      {activeTab === 'live' ? (
        <>
          {/* Main 4 Sensor Live Gauge Cards */}
          <div className="grid-responsive-2">
            {/* 1. Temperature & Humidity Card */}
            <div className={`glass-panel ${isTempCritical ? 'pulse-danger' : ''}`} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-primary">DHT22 Sensor • Node 01</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    Server Room & AI Lab Climate
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Tech Block 3 Basement</div>
                </div>

                <span className={`badge ${isTempCritical ? 'badge-danger' : 'badge-success'}`}>
                  {sensors?.temperature?.status || 'Optimal'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isTempCritical ? '#ef4444' : '#ffffff' }}>
                  {sensors?.temperature?.value || 24.8}
                </span>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>°C</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Humidity</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {sensors?.temperature?.humidity || 52}%
                  </div>
                </div>
              </div>

              {/* Sparkline Graph Simulation */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Telemetry Stream Trend</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '50px', gap: '8px', padding: '6px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)' }}>
                  {sensors?.temperature?.history?.slice(-10).map((pt, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.min(100, Math.max(15, (pt.value / 45) * 100))}%`,
                          background: isTempCritical ? '#ef4444' : 'var(--accent-primary)',
                          borderRadius: '2px',
                          transition: 'height 0.3s ease'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. MQ-2 Smoke & Fire Safety Card */}
            <div className={`glass-panel ${isSmokeCritical ? 'pulse-danger' : ''}`} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-danger">MQ-2 Gas Sensor • Node 02</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    Smoke & Fire Hazard Safety
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chemistry Lab & Central Server Block</div>
                </div>

                <span className={`badge ${isSmokeCritical ? 'badge-danger' : 'badge-success'}`}>
                  {sensors?.smoke?.status || 'Safe'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isSmokeCritical ? '#ef4444' : '#ffffff' }}>
                  {sensors?.smoke?.value || 48}
                </span>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>PPM</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Safety Threshold</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                    &lt; 300 PPM
                  </div>
                </div>
              </div>

              {/* Sparkline Graph */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>PPM Gas Concentration Trend</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '50px', gap: '8px', padding: '6px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)' }}>
                  {sensors?.smoke?.history?.slice(-10).map((pt, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.min(100, Math.max(10, (pt.value / 500) * 100))}%`,
                          background: pt.value > 300 ? '#ef4444' : '#10b981',
                          borderRadius: '2px',
                          transition: 'height 0.3s ease'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Water Level Reservoir Card */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-cyan">HC-SR04 Ultrasonic • Node 03</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    Overhead Water Tank Reservoir
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Block A & B Rooftop Tanks</div>
                </div>

                <span className={`badge ${isWaterLow ? 'badge-danger' : 'badge-cyan'}`}>
                  {sensors?.waterLevel?.status || 'Sufficient'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isWaterLow ? '#ef4444' : '#06b6d4' }}>
                  {sensors?.waterLevel?.value || 78}%
                </span>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Estimated Volume</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    {(sensors?.waterLevel?.liters || 15600).toLocaleString()} / 20,000 L
                  </div>
                </div>
              </div>

              {/* Tank Fill Bar */}
              <div>
                <div style={{ width: '100%', height: '14px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${sensors?.waterLevel?.value || 78}%`,
                      height: '100%',
                      background: isWaterLow ? '#ef4444' : 'linear-gradient(90deg, #06b6d4, #3b82f6)',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 4. Electricity & Energy Draw Card */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-warning">ACS712 Current • Node 04</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                    Campus Academic Power Load
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Main Power Grid & Transformer B</div>
                </div>

                <span className="badge badge-warning">
                  {sensors?.electricity?.status || 'Normal'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
                  {sensors?.electricity?.value || 18.4}
                </span>
                <span style={{ fontSize: '1.4rem', color: 'var(--text-secondary)' }}>kW</span>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Line Voltage</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
                    231 V (50 Hz)
                  </div>
                </div>
              </div>

              {/* Sparkline */}
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Hourly Energy Consumption (kW)</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', height: '50px', gap: '8px', padding: '6px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-sm)' }}>
                  {sensors?.electricity?.history?.slice(-10).map((pt, idx) => (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.min(100, Math.max(15, (pt.value / 35) * 100))}%`,
                          background: pt.value > 28 ? '#ef4444' : '#f59e0b',
                          borderRadius: '2px',
                          transition: 'height 0.3s ease'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Classroom Equipment Relay States */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Classroom & Lab Equipment Relay Controllers</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {sensors?.equipment?.map(eq => (
                <div key={eq.id} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{eq.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.location} • {eq.activeHours}h active</div>
                    <span className={`badge ${eq.powerState === 'ON' ? 'badge-success' : eq.powerState === 'FAULT' ? 'badge-danger' : 'badge-secondary'}`} style={{ marginTop: '6px' }}>
                      {eq.status}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleEquipment(eq.id, eq.powerState === 'ON' ? 'OFF' : 'ON')}
                    className={`btn btn-sm ${eq.powerState === 'ON' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    <Power size={14} /> {eq.powerState === 'ON' ? 'Power ON' : 'Power OFF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ESP32 Hardware Guide & Circuit Details */
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--accent-secondary)' }}>ESP32 Hardware Pinouts & Circuit Blueprint</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            The physical microcontroller sketch is located in <code>iot-firmware/CampusNova_ESP32_Firmware.ino</code>.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left', marginTop: '10px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '10px' }}>Sensor / Actuator</th>
                <th style={{ padding: '10px' }}>Model</th>
                <th style={{ padding: '10px' }}>ESP32 GPIO Pin</th>
                <th style={{ padding: '10px' }}>Signal Protocol</th>
                <th style={{ padding: '10px' }}>Monitored Parameter</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Temperature & Humidity</td>
                <td style={{ padding: '10px' }}>DHT22</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>GPIO 4</td>
                <td style={{ padding: '10px' }}>Digital 1-Wire</td>
                <td style={{ padding: '10px' }}>Ambient Temperature & RH%</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Smoke & Gas Sensor</td>
                <td style={{ padding: '10px' }}>MQ-2 Gas Sensor</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-danger)' }}>GPIO 34 (ADC1_CH6)</td>
                <td style={{ padding: '10px' }}>Analog 12-bit ADC</td>
                <td style={{ padding: '10px' }}>Combustible Gas / Smoke PPM</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Water Tank Level</td>
                <td style={{ padding: '10px' }}>HC-SR04 Ultrasonic</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>Trig: GPIO 5, Echo: GPIO 18</td>
                <td style={{ padding: '10px' }}>Pulse Timing</td>
                <td style={{ padding: '10px' }}>Tank Depth & Percentage %</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px', fontWeight: 600 }}>Power / Current Draw</td>
                <td style={{ padding: '10px' }}>ACS712 (20A Module)</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>GPIO 35 (ADC1_CH7)</td>
                <td style={{ padding: '10px' }}>Analog ADC</td>
                <td style={{ padding: '10px' }}>Current (Amps) & Power (kW)</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 600 }}>Emergency Alarm Buzzer</td>
                <td style={{ padding: '10px' }}>Active Piezo Buzzer</td>
                <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>GPIO 2</td>
                <td style={{ padding: '10px' }}>Digital Output</td>
                <td style={{ padding: '10px' }}>Audible Hazard Alarm</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
