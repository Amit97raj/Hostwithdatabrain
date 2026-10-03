'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Image as ImageIcon,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Newspaper,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Trash2,
  Upload,
  User,
  X
} from 'lucide-react';
import RichTextEditor from '../../components/RichTextEditor';
import '../../blog.css';

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  authorName: string;
  authorPic: string;
  readingTime: string;
  shortDescription: string;
  longDescription: string;
  category: string;
  coverImage: string;
  status: 'Published' | 'Draft';
  publishedAt: string;
};

const emptyForm = {
  title: '',
  category: 'Hosting',
  authorName: 'Arjun Sharma',
  authorPic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  readingTime: '5 min read',
  coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  status: 'Published' as 'Published' | 'Draft',
  shortDescription: '',
  longDescription: ''
};

const coverPresets = [
  { label: 'NVMe Cloud Server', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Enterprise Data Center', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cyber Security Shield', url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80' },
  { label: 'WordPress & Web Analytics', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80' }
];

const authorPresets = [
  { name: 'Arjun Sharma', pic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  { name: 'Priya Nair', pic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
  { name: 'Rohan Kapoor', pic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
  { name: 'Aditya Singh', pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' }
];

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Modal form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Reader Preview state
  const [readingBlog, setReadingBlog] = useState<BlogPost | null>(null);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const authorFileInputRef = useRef<HTMLInputElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (blog: BlogPost) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      category: blog.category || 'Hosting',
      authorName: blog.authorName || 'Arjun Sharma',
      authorPic: blog.authorPic || '',
      readingTime: blog.readingTime || '5 min read',
      coverImage: blog.coverImage || '',
      status: (blog.status as 'Published' | 'Draft') || 'Published',
      shortDescription: blog.shortDescription || '',
      longDescription: blog.longDescription || ''
    });
    setFormError('');
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Article title is required.');
      return;
    }
    if (!formData.shortDescription.trim()) {
      setFormError('Short description is required.');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const url = editingId ? `${apiUrl}/api/blogs/${editingId}` : `${apiUrl}/api/blogs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        notify(editingId ? 'Blog article updated successfully!' : 'New blog article published!');
        setFormOpen(false);
        fetchBlogs();
      } else {
        const err = await res.json();
        setFormError(err.message || 'Failed to save blog post.');
      }
    } catch {
      setFormError('Network error while saving blog post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`${apiUrl}/api/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        notify('Blog article deleted.');
        setBlogs((prev) => prev.filter((b) => b.id !== id));
      }
    } catch {
      notify('Failed to delete blog article.');
    }
  };

  const handleToggleStatus = async (blog: BlogPost) => {
    const nextStatus = blog.status === 'Published' ? 'Draft' : 'Published';
    try {
      const res = await fetch(`${apiUrl}/api/blogs/${blog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        notify(`Article marked as ${nextStatus}`);
        setBlogs((prev) =>
          prev.map((b) => (b.id === blog.id ? { ...b, status: nextStatus } : b))
        );
      }
    } catch {
      notify('Failed to update status.');
    }
  };

  // Image upload handler
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'coverImage' | 'authorPic'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, [field]: base64 }));

      // Try uploading to server
      try {
        const res = await fetch(`${apiUrl}/api/upload`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl: base64, filename: file.name })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setFormData((prev) => ({ ...prev, [field]: data.url }));
          }
        }
      } catch {
        // Fallback to base64
      }
    };
    reader.readAsDataURL(file);
  };

  const categories = ['All', 'Hosting', 'Security', 'Performance', 'Cloud', 'WordPress', 'Tutorials'];

  const filteredBlogs = blogs.filter((b) => {
    const matchCategory =
      selectedCategory === 'All' ||
      (b.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const matchStatus =
      selectedStatus === 'All' ||
      (b.status || 'Published').toLowerCase() === selectedStatus.toLowerCase();
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      (b.authorName || '').toLowerCase().includes(query) ||
      (b.shortDescription || '').toLowerCase().includes(query) ||
      (b.category || '').toLowerCase().includes(query);

    return matchCategory && matchStatus && matchSearch;
  });

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <img src="https://databrainit.com/images/logo.png" alt="DataBrain logo" />
          <div className="brand-copy">
            <strong>DataBrain</strong>
            <span>Hosting console</span>
          </div>
          <button
            className="icon-button close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <nav className="main-nav">
          <p className="nav-label">Overview</p>
          <a className="nav-item" href="/admin">
            <LayoutDashboard />
            <span>Dashboard</span>
          </a>
          <a className="nav-item active" href="/admin/blog">
            <Newspaper />
            <span>Blog</span>
            <b className="nav-alert">{blogs.length}</b>
          </a>

          <p className="nav-label">Manage</p>
          <a className="nav-item" href="/admin/customers">
            <User />
            <span>Customers</span>
          </a>
          <a className="nav-item" href="/admin/orders">
            <FileText />
            <span>Orders</span>
          </a>
          <a className="nav-item" href="/admin/services">
            <Settings2 />
            <span>Services</span>
          </a>
          <a className="nav-item" href="/admin/knowledge-base">
            <BookOpen />
            <span>Knowledge base</span>
          </a>
          <a className="nav-item" href="/admin/cms">
            <Share2 />
            <span>CMS</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="admin-mini">
            <div className="avatar blue">AS</div>
            <div>
              <strong>Arjun Sharma</strong>
              <span>Super admin</span>
            </div>
          </div>
        </div>
      </aside>

      <div
        className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-toggle icon-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            <a href="/admin" style={{ textDecoration: 'none', color: '#6a8692' }}>Workspace</a>
            <span>/</span>
            <strong>Blog Management</strong>
          </div>

          <div className="top-actions">
            <a
              href="/blog"
              target="_blank"
              rel="noreferrer"
              className="button secondary"
              style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <ExternalLink size={13} /> View Live Blog
            </a>
            <button className="button primary" onClick={handleOpenCreate}>
              <Plus size={14} /> New Article
            </button>
            <div className="top-avatar avatar blue">AS</div>
          </div>
        </header>

        <div className="content-wrap">
          {/* Header Banner */}
          <section className="welcome-row">
            <div>
              <p className="eyebrow">Content Studio & Publishing</p>
              <h1>Blog Articles <span>✍️</span></h1>
              <p className="subheading">
                Manage all insights, technical articles, and tutorials shown on DataBrain's public blog.
              </p>
            </div>
            <div className="welcome-actions">
              <button className="button primary" onClick={handleOpenCreate}>
                <Plus size={14} /> Create Article
              </button>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="stats-grid" style={{ marginBottom: '24px' }}>
            <article className="stat-card">
              <div className="stat-top">
                <span>Total Articles</span>
              </div>
              <strong className="stat-number">{blogs.length}</strong>
              <div className="stat-foot">
                <span>In DataBrain database</span>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Published</span>
              </div>
              <strong className="stat-number">
                {blogs.filter((b) => b.status === 'Published').length}
              </strong>
              <div className="stat-foot">
                <span>Live on website</span>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Active Authors</span>
              </div>
              <strong className="stat-number">
                {new Set(blogs.map((b) => b.authorName).filter(Boolean)).size || 1}
              </strong>
              <div className="stat-foot">
                <span>Contributing writers</span>
              </div>
            </article>

            <article className="stat-card">
              <div className="stat-top">
                <span>Categories</span>
              </div>
              <strong className="stat-number">
                {new Set(blogs.map((b) => b.category).filter(Boolean)).size || 1}
              </strong>
              <div className="stat-foot">
                <span>Hosting, Cloud, Security</span>
              </div>
            </article>
          </section>

          {/* Controls Bar */}
          <div
            style={{
              background: '#fff',
              border: '1px solid #e2edf0',
              borderRadius: '9px',
              padding: '14px 18px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px' }}>
              <div className="search-box" style={{ width: '100%', maxWidth: '360px' }}>
                <Search />
                <input
                  type="text"
                  placeholder="Search by title, author, or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Status Filter */}
              <div style={{ display: 'flex', background: '#f0f6f8', borderRadius: '6px', padding: '3px' }}>
                {['All', 'Published', 'Draft'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSelectedStatus(st)}
                    style={{
                      background: selectedStatus === st ? '#fff' : 'transparent',
                      color: selectedStatus === st ? '#113a4b' : '#698793',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 11px',
                      fontSize: '11px',
                      fontWeight: selectedStatus === st ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: selectedStatus === st ? '0 1px 4px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      background: selectedCategory === cat ? '#1597d4' : '#f5fafc',
                      color: selectedCategory === cat ? '#fff' : '#52727e',
                      border: `1px solid ${selectedCategory === cat ? '#1597d4' : '#d7e8ee'}`,
                      borderRadius: '16px',
                      padding: '4px 10px',
                      fontSize: '10px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blog Cards Grid */}
          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#7a96a1' }}>
              Loading blog articles...
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div
              style={{
                background: '#fff',
                borderRadius: '10px',
                border: '1px dashed #c9dfe7',
                padding: '50px 20px',
                textAlign: 'center',
                marginTop: '20px'
              }}
            >
              <Newspaper size={36} color="#1597d4" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 6px', color: '#173d4e' }}>No blog articles found</h3>
              <p style={{ color: '#7b97a2', fontSize: '12px', margin: '0 0 16px' }}>
                Try adjusting your search criteria or create a new article.
              </p>
              <button className="button primary" onClick={handleOpenCreate}>
                <Plus size={14} /> Create Article
              </button>
            </div>
          ) : (
            <div className="blog-admin-grid">
              {filteredBlogs.map((blog) => (
                <div key={blog.id} className="blog-admin-card">
                  <div className="blog-card-media">
                    <img src={blog.coverImage} alt={blog.title} />
                    <span className="blog-category-badge">{blog.category}</span>
                    <span className="blog-reading-time-badge">
                      <Clock /> {blog.readingTime}
                    </span>
                  </div>

                  <div className="blog-card-body">
                    {/* Author Row */}
                    <div className="blog-card-author-row">
                      {blog.authorPic ? (
                        <img src={blog.authorPic} alt={blog.authorName} className="author-avatar-img" />
                      ) : (
                        <div className="author-avatar-fallback">
                          {blog.authorName.charAt(0)}
                        </div>
                      )}
                      <div className="blog-author-meta">
                        <strong>{blog.authorName}</strong>
                        <small>{blog.publishedAt}</small>
                      </div>
                    </div>

                    <h3 className="blog-card-title">{blog.title}</h3>
                    <p className="blog-card-desc">{blog.shortDescription}</p>

                    <div className="blog-card-footer">
                      <button
                        type="button"
                        className={`status-badge ${blog.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(blog)}
                        title="Click to toggle status"
                        style={{ border: 'none', cursor: 'pointer' }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: blog.status === 'Published' ? '#1aa77d' : '#e59745'
                          }}
                        />
                        {blog.status}
                      </button>

                      <div className="blog-card-actions">
                        <button
                          type="button"
                          className="blog-icon-btn"
                          onClick={() => setReadingBlog(blog)}
                          title="Preview full article"
                        >
                          <Eye />
                        </button>
                        <button
                          type="button"
                          className="blog-icon-btn"
                          onClick={() => handleOpenEdit(blog)}
                          title="Edit article"
                        >
                          <Edit3 />
                        </button>
                        <button
                          type="button"
                          className="blog-icon-btn delete"
                          onClick={() => handleDelete(blog.id, blog.title)}
                          title="Delete article"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          Create / Edit Modal with Rich Text Editor
         ========================================================================= */}
      {formOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(7, 30, 41, 0.72)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            overflowY: 'auto',
            padding: '24px 16px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '100%',
              maxWidth: '860px',
              borderRadius: '12px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
              overflow: 'hidden',
              margin: '20px auto 40px'
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: '1px solid #e6eff2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#fbfdfe'
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#10384a', fontFamily: 'Manrope, sans-serif' }}>
                  {editingId ? 'Edit Blog Article' : 'Create New Blog Article'}
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#8aa1aa' }}>
                  Complete all fields and format your rich article content below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                style={{
                  background: '#f2f7f9',
                  border: '1px solid #d5e4e8',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  color: '#658591'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} style={{ padding: '24px' }}>
              {formError && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <X size={14} /> {formError}
                </div>
              )}

              <div className="blog-modal-grid">
                {/* Title */}
                <div className="blog-modal-full">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Why NVMe Storage Is the Game Changer for Website Speed"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#1a3c4a',
                      outline: 'none',
                      background: '#fcfdfe'
                    }}
                  />
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1a3c4a',
                      outline: 'none',
                      background: '#fcfdfe'
                    }}
                  >
                    <option value="Hosting">Web Hosting</option>
                    <option value="Performance">Performance & Speed</option>
                    <option value="Security">Cyber Security</option>
                    <option value="Cloud">Cloud & VPS</option>
                    <option value="WordPress">WordPress</option>
                    <option value="Tutorials">Tutorials</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Publishing Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Published' | 'Draft' })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1a3c4a',
                      outline: 'none',
                      background: '#fcfdfe'
                    }}
                  >
                    <option value="Published">Published (Visible on site)</option>
                    <option value="Draft">Draft (Hidden)</option>
                  </select>
                </div>

                {/* Author Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Author Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arjun Sharma"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1a3c4a',
                      outline: 'none',
                      background: '#fcfdfe'
                    }}
                  />
                  {/* Quick Author Presets */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: '5px', flexWrap: 'wrap' }}>
                    {authorPresets.map((a) => (
                      <button
                        type="button"
                        key={a.name}
                        onClick={() => setFormData({ ...formData, authorName: a.name, authorPic: a.pic })}
                        style={{
                          background: '#f0f7f9',
                          border: '1px solid #cde4ec',
                          borderRadius: '12px',
                          fontSize: '9px',
                          padding: '2px 7px',
                          cursor: 'pointer',
                          color: '#416674'
                        }}
                      >
                        {a.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reading Time */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Reading Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 5 min read"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1a3c4a',
                      outline: 'none',
                      background: '#fcfdfe'
                    }}
                  />
                  <small style={{ color: '#8ba2ac', fontSize: '9px', marginTop: '4px', display: 'block' }}>
                    Use the auto-calculate button in the editor below to compute this automatically.
                  </small>
                </div>

                {/* Author Pic */}
                <div className="blog-modal-full">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Author Profile Picture
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {formData.authorPic ? (
                      <img
                        src={formData.authorPic}
                        alt="Author Preview"
                        className="blog-author-thumb"
                      />
                    ) : (
                      <div className="author-avatar-fallback">
                        <User size={14} />
                      </div>
                    )}
                    <input
                      type="text"
                      placeholder="Paste author image URL or click Upload"
                      value={formData.authorPic}
                      onChange={(e) => setFormData({ ...formData, authorPic: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: '1px solid #d0e1e7',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#1a3c4a',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="file"
                      ref={authorFileInputRef}
                      onChange={(e) => handleFileUpload(e, 'authorPic')}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => authorFileInputRef.current?.click()}
                      className="button secondary"
                      style={{ padding: '8px 12px', fontSize: '11px' }}
                    >
                      <Upload size={13} /> Upload Pic
                    </button>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="blog-modal-full">
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#395b6a', marginBottom: '6px' }}>
                    Cover Image URL / Upload
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="https://example.com/banner.jpg"
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        border: '1px solid #d0e1e7',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#1a3c4a',
                        outline: 'none'
                      }}
                    />
                    <input
                      type="file"
                      ref={coverFileInputRef}
                      onChange={(e) => handleFileUpload(e, 'coverImage')}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => coverFileInputRef.current?.click()}
                      className="button secondary"
                      style={{ padding: '8px 12px', fontSize: '11px' }}
                    >
                      <Upload size={13} /> Upload Image
                    </button>
                  </div>

                  {/* Cover Presets */}
                  <div style={{ display: 'flex', gap: '5px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <small style={{ color: '#8ba2ac', fontSize: '9px', alignSelf: 'center', marginRight: '4px' }}>
                      Sample Presets:
                    </small>
                    {coverPresets.map((p) => (
                      <button
                        type="button"
                        key={p.label}
                        onClick={() => setFormData({ ...formData, coverImage: p.url })}
                        style={{
                          background: '#f0f7f9',
                          border: '1px solid #cde4ec',
                          borderRadius: '12px',
                          fontSize: '9px',
                          padding: '2px 8px',
                          cursor: 'pointer',
                          color: '#416674'
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Short Description */}
                <div className="blog-modal-full">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#395b6a' }}>
                      Short Description (Summary Card Excerpt) *
                    </label>
                    <span style={{ fontSize: '10px', color: '#91a5ad' }}>
                      {formData.shortDescription.length}/300 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    required
                    maxLength={300}
                    placeholder="Brief 1-2 sentence teaser shown on the blog cards and Google snippets..."
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d0e1e7',
                      borderRadius: '6px',
                      fontSize: '12px',
                      color: '#1a3c4a',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Long Description: Rich Text Editor */}
                <div className="blog-modal-full">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#0f384a' }}>
                        Long Description & Full Article (Rich Text Editor)
                      </label>
                      <p style={{ margin: '2px 0 0', fontSize: '10px', color: '#7e9aa6' }}>
                        Use headings, bold, lists, quotes, code blocks, and images to craft your story.
                      </p>
                    </div>
                  </div>

                  <RichTextEditor
                    value={formData.longDescription}
                    onChange={(html) => setFormData((prev) => ({ ...prev, longDescription: html }))}
                    placeholder="Write your in-depth guide, technical breakdown, or hosting tutorial..."
                    onApplyReadingTime={(time) => setFormData((prev) => ({ ...prev, readingTime: time }))}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #edf4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}
              >
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="button secondary"
                  style={{ padding: '9px 18px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="button primary"
                  style={{ padding: '9px 24px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  {saving ? <Sparkles size={14} className="spin" /> : <Check size={14} />}
                  {saving ? 'Saving...' : editingId ? 'Update Article' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          Article Reader Preview Modal
         ========================================================================= */}
      {readingBlog && (
        <div className="article-reader-overlay">
          <div className="article-reader-container">
            <div className="article-reader-header">
              <div className="reader-header-left">
                <button
                  type="button"
                  className="reader-back-btn"
                  onClick={() => setReadingBlog(null)}
                >
                  <ArrowLeft size={14} /> Exit Preview
                </button>
                <div className="reader-header-sep" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#1597d4', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  Live Article Preview
                </span>
                <span className="reader-header-title-snippet">
                  {readingBlog.title}
                </span>
              </div>
              <div className="reader-header-right">
                <span className="reader-pill-badge">
                  <Clock size={12} /> {readingBlog.readingTime}
                </span>
                <button
                  type="button"
                  className="reader-close-btn"
                  onClick={() => setReadingBlog(null)}
                  title="Close Preview (Esc)"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <main className="article-fullscreen-content">
              <div className="article-meta-pills">
                <span className="featured-badge">{readingBlog.category}</span>
                <span className="featured-time">
                  <Clock size={12} /> {readingBlog.readingTime}
                </span>
                <span className="featured-time" style={{ marginLeft: 'auto' }}>
                  <Calendar size={12} /> {readingBlog.publishedAt}
                </span>
              </div>

              <h1 className="article-title-heading">{readingBlog.title}</h1>

              {/* Author Row */}
              <div className="article-author-card">
                {readingBlog.authorPic ? (
                  <img
                    src={readingBlog.authorPic}
                    alt={readingBlog.authorName}
                    className="author-big-pic"
                  />
                ) : (
                  <div className="author-avatar-fallback" style={{ width: '48px', height: '48px', fontSize: '16px' }}>
                    {readingBlog.authorName.charAt(0)}
                  </div>
                )}
                <div className="author-card-text">
                  <strong>{readingBlog.authorName}</strong>
                  <span>Cloud Systems & Hosting Specialist · DataBrain</span>
                </div>
              </div>

              {/* Cover Banner */}
              {readingBlog.coverImage && (
                <div className="article-cover-wrap">
                  <img src={readingBlog.coverImage} alt={readingBlog.title} />
                </div>
              )}

              {/* Short Description Lead */}
              {readingBlog.shortDescription && (
                <div className="article-lead-callout">
                  <p className="article-short-lead" style={{ margin: 0, padding: 0, border: 'none' }}>
                    {readingBlog.shortDescription}
                  </p>
                </div>
              )}

              {/* Long Description Rich Content */}
              <div
                className="article-rich-content"
                dangerouslySetInnerHTML={{
                  __html: readingBlog.longDescription || '<p>No content provided for this article.</p>'
                }}
              />

              <div className="article-bottom-actions" style={{ marginTop: '40px' }}>
                <button
                  type="button"
                  className="article-bottom-back-btn"
                  onClick={() => setReadingBlog(null)}
                >
                  <ArrowLeft size={14} /> Exit Preview & Return to Admin
                </button>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
