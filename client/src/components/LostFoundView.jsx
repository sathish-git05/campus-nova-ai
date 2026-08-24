import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Search,
  Plus,
  MapPin,
  Phone,
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';

export const LostFoundView = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // all, lost, found
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'found',
    title: '',
    description: '',
    location: '',
    contactPerson: user?.name || '',
    contactPhone: '+91 98765 43210',
    imageUrl: ''
  });

  const loadItems = async () => {
    try {
      const data = await api.getLostFound(activeTab !== 'all' ? activeTab : undefined);
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadItems();
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.reportLostFound(formData);
      setShowModal(false);
      setFormData({
        type: 'found',
        title: '',
        description: '',
        location: '',
        contactPerson: user?.name || '',
        contactPhone: '+91 98765 43210',
        imageUrl: ''
      });
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async (id) => {
    try {
      await api.updateLostFoundStatus(id, 'Claimed');
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Campus Lost & Found Registry</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Report missing belongings, find lost items, and connect with finders safely
          </span>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Report Item
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', gap: '8px' }}>
        {[
          { id: 'all', label: '🔍 All Items' },
          { id: 'lost', label: '🔴 Lost Items' },
          { id: 'found', label: '🟢 Found Items' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {items.map(item => (
          <div key={item.id} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
              <img
                src={item.imageUrl}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                <span className={`badge ${item.type === 'found' ? 'badge-success' : 'badge-danger'}`} style={{ textTransform: 'uppercase' }}>
                  {item.type}
                </span>
                <span className={`badge ${item.status === 'Available' ? 'badge-cyan' : 'badge-secondary'}`}>
                  {item.status}
                </span>
              </div>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {item.description}
              </p>

              <div style={{ marginTop: 'auto', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <MapPin size={13} color="var(--accent-primary)" />
                  <span>{item.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                  <Phone size={13} color="#10b981" />
                  <span>Contact: {item.contactPerson} ({item.contactPhone})</span>
                </div>
              </div>
            </div>

            <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Reported on {item.date}
              </span>

              {item.status === 'Available' && (
                <button
                  onClick={() => handleClaim(item.id)}
                  className="btn btn-secondary btn-sm"
                >
                  <CheckCircle size={14} /> Mark Claimed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Item Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '480px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Report a Lost or Found Item</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Report Type</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'lost' })}
                    className={`btn btn-sm ${formData.type === 'lost' ? 'btn-danger' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                  >
                    🔴 I Lost an Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'found' })}
                    className={`btn btn-sm ${formData.type === 'found' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                  >
                    🟢 I Found an Item
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input
                  type="text"
                  placeholder="e.g. TI-84 Scientific Calculator or Blue Fastrack Water Bottle"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location Found / Last Seen</label>
                <input
                  type="text"
                  placeholder="e.g. Computer Systems Lab 2, Tech Block 3rd floor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description & Identifying Marks</label>
                <textarea
                  rows="3"
                  placeholder="Describe color, scratches, stickers, cover..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
