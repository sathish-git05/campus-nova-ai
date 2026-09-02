import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, BookOpen, Hash, Camera, Save, X } from 'lucide-react';

export const ProfileView = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="view-container slide-in">
      <div className="view-header">
        <div>
          <h1 className="view-title">My Profile</h1>
          <p className="view-subtitle">Manage your personal information and preferences.</p>
        </div>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" onClick={handleCancel}>
              <X size={16} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '24px' }}>
          <div style={{ position: 'relative' }}>
            <img 
              src={formData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar" 
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--accent-primary)' }} 
            />
          </div>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '4px' }}>{user.name}</h2>
            <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{user.role}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <User size={16} /> Full Name
            </label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <Building size={16} /> Department
            </label>
            <input 
              type="text" 
              name="department" 
              value={formData.department} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {(user.role === 'student' || user.role === 'alumni') && (
            <>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <BookOpen size={16} /> Year / Batch
                </label>
                <input 
                  type="text" 
                  name="year" 
                  value={formData.year || ''} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <Hash size={16} /> Roll Number / ID
                </label>
                <input 
                  type="text" 
                  name="rollNo" 
                  value={formData.rollNo || ''} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                />
              </div>
            </>
          )}

          {isEditing && (
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
               <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                <Camera size={16} /> Avatar URL
              </label>
              <input 
                type="text" 
                name="avatar" 
                value={formData.avatar} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                placeholder="Enter image URL for avatar"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
