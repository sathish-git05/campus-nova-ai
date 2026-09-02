import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle,
  Tag,
  BookOpen,
  FileUp,
  X
} from 'lucide-react';

export const MaterialsView = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Upload Form State
  const [newResource, setNewResource] = useState({
    title: '',
    subjectCode: 'CS3501',
    subjectName: 'Artificial Intelligence & ML',
    type: 'Lecture Notes',
    fileSize: '3.5 MB',
    fileName: '',
    description: '',
    tags: 'AI, Semester 5, Notes'
  });

  const loadMaterials = async () => {
    try {
      const data = await api.getMaterials(activeFilter, searchQuery);
      setMaterials(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [activeFilter, searchQuery]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const formattedSize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${Math.round(file.size / 1024)} KB`;
      setNewResource(prev => ({
        ...prev,
        fileName: file.name,
        fileSize: formattedSize,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));
    }
  };

  const handleDownload = async (item) => {
    try {
      await api.downloadMaterial(item.id);
      setDownloadSuccess(item.fileName || item.title);
      
      // Trigger browser file download if fileUrl is available
      if (item.fileUrl && item.fileUrl !== '#') {
        const link = document.createElement('a');
        link.href = item.fileUrl;
        link.download = item.fileName || 'study_material.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      loadMaterials();
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = '#';
      if (selectedFile) {
        fileUrl = URL.createObjectURL(selectedFile);
      }

      const res = await api.uploadMaterial({
        ...newResource,
        fileUrl,
        uploadedBy: `${user?.name || 'User'} (${user?.role || 'student'})`
      });

      setShowUploadModal(false);
      setUploadSuccessAlert(`"${res.title || newResource.title}" published successfully!`);
      setSelectedFile(null);
      setNewResource({
        title: '',
        subjectCode: 'CS3501',
        subjectName: 'Artificial Intelligence & ML',
        type: 'Lecture Notes',
        fileSize: '3.5 MB',
        fileName: '',
        description: '',
        tags: 'AI, Notes'
      });
      loadMaterials();
      setTimeout(() => setUploadSuccessAlert(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Study Resources & Exam PYQ Repository</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Upload, share, and access official lecture notes, previous year question papers & question banks.
          </span>
        </div>

        <button onClick={() => setShowUploadModal(true)} className="btn btn-primary">
          <Upload size={16} /> Upload Notes / File
        </button>
      </div>

      {/* Upload Success Alert */}
      {uploadSuccessAlert && (
        <div style={{ padding: '14px 20px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#34d399', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle size={20} /> {uploadSuccessAlert}
        </div>
      )}

      {/* Download Alert Banner */}
      {downloadSuccess && (
        <div style={{ padding: '12px 18px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid #3b82f6', color: '#60a5fa', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} /> Downloading <strong>{downloadSuccess}</strong>. Download counter updated.
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        {/* Type Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Lecture Notes', 'PYQ', 'Important Questions', 'Lab Manual'].map(type => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`btn btn-sm ${activeFilter === type ? 'btn-primary' : 'btn-secondary'}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search notes, topics, codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
        {materials.map(item => (
          <div key={item.id} className="glass-panel card-interactive" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span className="badge badge-primary">{item.subjectCode}</span>
                <span className="badge badge-cyan">{item.type}</span>
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: '1.35' }}>
                {item.title}
              </h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {item.subjectName}
              </div>

              {item.description && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  {item.description}
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', margin: '8px 0' }}>
                {item.tags?.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                <div>By: {item.uploadedBy}</div>
                <div>{item.fileSize || '3.2 MB'} • {item.downloads || 0} downloads</div>
              </div>

              <button
                onClick={() => handleDownload(item)}
                className="btn btn-primary btn-sm"
              >
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '560px', padding: '28px', background: 'var(--bg-secondary)', borderRadius: '12px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Upload Study Notes or PYQ File</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* File Attachment Input */}
              <div className="form-group" style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '8px', border: '2px dashed var(--border-subtle)', textAlign: 'center' }}>
                <FileUp size={28} style={{ color: 'var(--accent-primary)', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>Select File (PDF, DOCX, PPTX)</div>
                <input
                  type="file"
                  accept=".pdf,.docx,.pptx,.jpg,.png,.txt"
                  onChange={handleFileChange}
                  style={{ fontSize: '0.8rem', width: '100%', cursor: 'pointer' }}
                />
                {selectedFile && (
                  <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '6px', fontWeight: 600 }}>
                    Selected: {selectedFile.name} ({newResource.fileSize})
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Resource Title</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 3 Comprehensive Notes with Solved Derivations"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Subject Code</label>
                  <input
                    type="text"
                    value={newResource.subjectCode}
                    onChange={(e) => setNewResource({ ...newResource, subjectCode: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Resource Type</label>
                  <select
                    value={newResource.type}
                    onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                    className="form-select"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PYQ">PYQ (Previous Year Question)</option>
                    <option value="Important Questions">Important Questions</option>
                    <option value="Lab Manual">Lab Manual</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject Name</label>
                <input
                  type="text"
                  value={newResource.subjectName}
                  onChange={(e) => setNewResource({ ...newResource, subjectName: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description / Summary</label>
                <textarea
                  placeholder="Provide a brief summary of the notes or topic coverage..."
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  className="form-input"
                  rows={2}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Unit 1, Heuristics, Solved Examples"
                  value={newResource.tags}
                  onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Resource & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
