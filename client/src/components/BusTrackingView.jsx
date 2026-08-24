import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Bus,
  MapPin,
  Clock,
  Phone,
  Navigation,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const BusTrackingView = () => {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  const loadBuses = async () => {
    try {
      const data = await api.getBuses();
      setBuses(data);
      if (!selectedBus && data.length > 0) {
        setSelectedBus(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campus Transit & Bus Tracking</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real-time college bus routes, stop arrival schedules, and transit location tracking
          </span>
        </div>
      </div>

      {/* Bus Grid & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {buses.map(bus => {
          const isArrived = bus.etaMinutes === 0;

          return (
            <div key={bus.id} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '6px' }}>{bus.routeNumber}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>{bus.routeName}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Bus No: {bus.busNumber}</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className={`badge ${isArrived ? 'badge-success' : 'badge-cyan'}`}>
                    {bus.status}
                  </span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: isArrived ? '#10b981' : 'var(--accent-secondary)', marginTop: '4px' }}>
                    {isArrived ? 'At Campus' : `ETA: ~${bus.etaMinutes}m`}
                  </div>
                </div>
              </div>

              {/* Current Location Pill */}
              <div style={{ padding: '10px 14px', background: 'rgba(6, 182, 212, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(6, 182, 212, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <Navigation size={16} color="var(--accent-secondary)" />
                <span><strong>Live Position:</strong> {bus.currentLocation}</span>
              </div>

              {/* Stops Timeline */}
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Boarding Stops & Scheduled Timings:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {bus.stops?.map((stop, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />
                        <span style={{ color: 'var(--text-primary)' }}>{stop.stop}</span>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{stop.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Driver Contact */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span>Driver: {bus.driverName}</span>
                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={12} /> {bus.driverPhone}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
