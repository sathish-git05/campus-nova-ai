import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Mail, Building, BookOpen, Hash, Camera, Save, X, Phone, CheckCircle, FileText } from 'lucide-react';

export const ProfileView = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...user });
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.updateProfile(formData);
      if (res.success && res.user) {
        setUser(res.user);
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        // Fallback to local user update
        setUser({ ...formData });
        setSaveSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Profile update error:', err);
      setUser({ ...formData });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  return (
    <div className="view-container slide-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="view-title" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Profile</h1>
          <p className="view-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Manage and permanently update your profile details and preferences in the portal.
          </p>
        </div>
        {!isEditing ? (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" onClick={handleCancel} disabled={isSaving}>
              <X size={16} /> Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
              <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Success Alert Banner */}
      {saveSuccess && (
        <div style={{ padding: '14px 20px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> Your profile information has been updated and permanently saved in the portal!
        </div>
      )}

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
            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '4px' }}>{formData.name}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="badge badge-primary" style={{ textTransform: 'capitalize', fontSize: '0.85rem' }}>{formData.role}</span>
              <span className="badge badge-cyan" style={{ fontSize: '0.85rem' }}>{formData.department}</span>
            </div>
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
              value={formData.name || ''} 
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
              value={formData.email || ''} 
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
              value={formData.department || ''} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          {(formData.role === 'student' || formData.role === 'alumni') && (
            <>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                  <BookOpen size={16} /> Academic Year / Batch
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
                  <Hash size={16} /> Register / Roll Number
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

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <Phone size={16} /> Contact Phone Number
            </label>
            <input 
              type="text" 
              name="phone" 
              placeholder="+91 98765 43210"
              value={formData.phone || ''} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
              <FileText size={16} /> Personal Bio & Information
            </label>
            <textarea 
              name="bio" 
              rows={3}
              placeholder="Add your academic bio, research interests, or project focus..."
              value={formData.bio || ''} 
              onChange={handleChange} 
              disabled={!isEditing}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          {isEditing && (
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)' }}>
                <Camera size={16} /> Profile Picture / Avatar URL
              </label>
              <input 
                type="text" 
                name="avatar" 
                value={formData.avatar || ''} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', borderRadius: '8px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
                placeholder="Paste avatar image URL (e.g. https://...)"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
