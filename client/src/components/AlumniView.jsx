import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Briefcase,
  ThumbsUp,
  Search,
  Plus,
  Building,
  Award,
  Sparkles,
  Share2,
  BookOpen
} from 'lucide-react';

export const AlumniView = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [activeCompany, setActiveCompany] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [newPost, setNewPost] = useState({
    company: 'Microsoft',
    title: '',
    content: '',
    tags: 'Interview, SDE, Coding Rounds, System Design'
  });

  const loadPosts = async () => {
    try {
      const data = await api.getAlumniPosts(activeCompany !== 'All' ? activeCompany : undefined, searchQuery);
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [activeCompany, searchQuery]);

  const handleUpvote = async (id) => {
    try {
      await api.upvoteAlumniPost(id);
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.postAlumniStory({
        ...newPost,
        authorId: user?.id,
        authorName: user?.name,
        authorRole: user?.designation || 'Software Development Engineer',
        batch: user?.batch || 'Class of 2024 (CSE)'
      });
      setShowModal(false);
      setNewPost({
        company: 'Microsoft',
        title: '',
        content: '',
        tags: 'Interview, SDE'
      });
      loadPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Alumni Mentorship & Placement Network</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Real interview experiences, company question banks, coding round tips & career roadmaps
          </span>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={16} /> Share Interview Experience
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Microsoft', 'Google', 'Amazon', 'TCS', 'Zoho'].map(comp => (
            <button
              key={comp}
              onClick={() => setActiveCompany(comp)}
              className={`btn btn-sm ${activeCompany === comp ? 'btn-primary' : 'btn-secondary'}`}
            >
              {comp}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search company, topics, DSA..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Posts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {posts.map(post => (
          <div key={post.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Top Author Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: '#fff'
                }}>
                  {post.authorName?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                    {post.authorName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    {post.authorRole} at <strong style={{ color: 'var(--accent-secondary)' }}>{post.company}</strong> • {post.batch}
                  </div>
                </div>
              </div>

              <span className="badge badge-primary">{post.company}</span>
            </div>

            {/* Title & Content */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', lineHeight: '1.3' }}>
              {post.title}
            </h3>

            <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
              {post.content}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {post.tags?.map((t, idx) => (
                <span key={idx} style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  #{t}
                </span>
              ))}
            </div>

            {/* Footer / Upvote */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Posted on {post.postedAt}
              </span>

              <button
                onClick={() => handleUpvote(post.id)}
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ThumbsUp size={14} color="var(--accent-primary)" />
                <span>Helpful ({post.upvotes || 0})</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '560px', padding: '28px', background: 'var(--bg-secondary)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Share Your Placement & Interview Experience</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Microsoft, Google, Zoho"
                    value={newPost.company}
                    onChange={(e) => setNewPost({ ...newPost, company: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. SDE, DP, System Design"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Article / Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. How I Cracked the On-Campus Drive: 4 Rounds Breakdown"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Experience & Questions Asked</label>
                <textarea
                  rows="6"
                  placeholder="Describe online assessment topics, DSA problems, system design questions, and tips for juniors..."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="form-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
