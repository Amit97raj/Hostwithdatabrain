'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  Globe2,
  Menu,
  Newspaper,
  Search,
  Share2,
  Sparkles,
  User,
  X,
  Zap
} from 'lucide-react';
import '../site.css';
import '../blog.css';

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

export default function BlogPublicPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${apiUrl}/api/blogs`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: BlogPost[]) => {
        // Show only published blogs on public page
        const published = data.filter((b) => (b.status || 'Published') === 'Published');
        setBlogs(published);

        // Check URL params for direct article link
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const articleId = params.get('id') || params.get('slug');
          if (articleId) {
            const found = published.find((b) => b.id === articleId || b.slug === articleId);
            if (found) setActiveArticle(found);
          }
        }
      })
      .catch((err) => console.error('Failed to load public blogs:', err))
      .finally(() => setLoading(false));
  }, []);

  // Listen for browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const articleId = params.get('id') || params.get('slug');
      if (articleId) {
        const found = blogs.find((b) => b.id === articleId || b.slug === articleId);
        if (found) setActiveArticle(found);
      } else {
        setActiveArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [blogs]);

  // Lock body scroll and listen for Escape key when full-screen reader is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeArticle();
      }
    };

    if (activeArticle) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeArticle]);

  const openArticle = (blog: BlogPost) => {
    setActiveArticle(blog);
    setReadingProgress(0);
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?id=${blog.id}`;
      window.history.pushState({ articleId: blog.id }, '', newUrl);
    }
  };

  const closeArticle = () => {
    setActiveArticle(null);
    setReadingProgress(0);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      setReadingProgress(progress);
    }
  };

  const categories = [
    'All',
    ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))
  ];

  const filteredBlogs = blogs.filter((b) => {
    const matchCat =
      selectedCategory === 'All' ||
      (b.category || '').toLowerCase() === selectedCategory.toLowerCase();
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      b.title.toLowerCase().includes(query) ||
      (b.shortDescription || '').toLowerCase().includes(query) ||
      (b.authorName || '').toLowerCase().includes(query) ||
      (b.category || '').toLowerCase().includes(query);

    return matchCat && matchSearch;
  });

  const featuredPost = filteredBlogs[0];
  const remainingPosts = filteredBlogs.slice(1);

  // Article navigation (Prev / Next)
  const currentIdx = activeArticle ? blogs.findIndex((b) => b.id === activeArticle.id) : -1;
  const prevArticle = currentIdx > 0 ? blogs[currentIdx - 1] : null;
  const nextArticle = currentIdx >= 0 && currentIdx < blogs.length - 1 ? blogs[currentIdx + 1] : null;

  const handleShare = (article: BlogPost) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/blog?id=${article.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  return (
    <div className="blog-public-shell">
      {/* Top Banner */}
      <div className="announcement">
        <Sparkles size={13} /> High-Performance NVMe Cloud & Web Hosting Solutions
        <a href="/#plans">
          Explore plans <ArrowRight size={12} />
        </a>
      </div>

      {/* Header Navigation */}
      <header className="site-header">
        <a className="site-logo" href="/">
          <img src="https://databrainit.com/images/logo.png" alt="DataBrain logo" />
          <span>
            <strong>DataBrain</strong>
            <small>IT SOLUTIONS</small>
          </span>
        </a>

        <nav className={`site-nav ${mobileMenu ? 'open' : ''}`}>
          <a href="/#plans" onClick={() => setMobileMenu(false)}>
            Hosting
          </a>
          <a href="/#domains" onClick={() => setMobileMenu(false)}>
            Domains
          </a>
          <a href="/#services" onClick={() => setMobileMenu(false)}>
            Services
          </a>
          <a href="/#why-us" onClick={() => setMobileMenu(false)}>
            Why DataBrain
          </a>
          <a href="/#contact" onClick={() => setMobileMenu(false)}>
            Contact Us
          </a>
        </nav>

        <div className="header-actions">
          <a className="header-cta" href="/#plans">
            <span>Get started</span>
            <ArrowRight size={15} />
          </a>
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Blog Hero Section */}
      <section className="blog-hero-section">
        <div className="blog-hero-kicker">
          <span /> Knowledge & Engineering Insights <span />
        </div>
        <h1>
          The DataBrain <em>Blog</em>
        </h1>
        <p>
          Deep dives into high-performance NVMe cloud infrastructure, web hosting security,
          database scaling, and developer guides.
        </p>

        {/* Search Bar */}
        <div className="blog-search-bar">
          <Search />
          <input
            type="text"
            placeholder="Search tutorials, server guides, optimization tips..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Pills */}
        <div className="blog-category-filter">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`blog-filter-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <main className="blog-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#6d8892' }}>
            Loading blog insights...
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div
            style={{
              background: '#fff',
              border: '1px dashed #cfe0e6',
              borderRadius: '12px',
              padding: '60px 20px',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '30px auto'
            }}
          >
            <Newspaper size={40} color="#1597d4" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ margin: '0 0 6px', color: '#13394a' }}>No articles match your search</h3>
            <p style={{ color: '#76929d', fontSize: '13px', margin: '0 0 18px' }}>
              Try searching with different keywords or switch back to "All" categories.
            </p>
            <button
              type="button"
              className="featured-read-btn"
              style={{ margin: '0 auto' }}
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            {/* Featured Post Spotlight (shown when first post exists) */}
            {featuredPost && !search && selectedCategory === 'All' && (
              <article
                className="blog-featured-card"
                onClick={() => openArticle(featuredPost)}
              >
                <div className="featured-media">
                  <img src={featuredPost.coverImage} alt={featuredPost.title} />
                  <span className="blog-category-badge">{featuredPost.category}</span>
                </div>

                <div className="featured-content">
                  <div className="featured-tag-row">
                    <span className="featured-badge">Featured Story</span>
                    <span className="featured-time">
                      <Clock size={12} /> {featuredPost.readingTime}
                    </span>
                  </div>

                  <h2>{featuredPost.title}</h2>
                  <p>{featuredPost.shortDescription}</p>

                  <div className="featured-author-row">
                    {featuredPost.authorPic ? (
                      <img
                        src={featuredPost.authorPic}
                        alt={featuredPost.authorName}
                        className="featured-author-img"
                      />
                    ) : (
                      <div className="author-avatar-fallback">
                        {featuredPost.authorName.charAt(0)}
                      </div>
                    )}
                    <div className="featured-author-info">
                      <strong>{featuredPost.authorName}</strong>
                      <small>{featuredPost.publishedAt}</small>
                    </div>

                    <button
                      type="button"
                      className="featured-read-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openArticle(featuredPost);
                      }}
                    >
                      Read full story <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Grid of Other Articles */}
            <div className="blog-admin-grid">
              {(search || selectedCategory !== 'All' ? filteredBlogs : remainingPosts).map(
                (blog) => (
                  <article
                    key={blog.id}
                    className="blog-admin-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openArticle(blog)}
                  >
                    <div className="blog-card-media">
                      <img src={blog.coverImage} alt={blog.title} />
                      <span className="blog-category-badge">{blog.category}</span>
                      <span className="blog-reading-time-badge">
                        <Clock size={11} /> {blog.readingTime}
                      </span>
                    </div>

                    <div className="blog-card-body">
                      <div className="blog-card-author-row">
                        {blog.authorPic ? (
                          <img
                            src={blog.authorPic}
                            alt={blog.authorName}
                            className="author-avatar-img"
                          />
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
                        <span style={{ fontSize: '11px', color: '#1597d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          Read article <ArrowRight size={12} />
                        </span>
                        <span style={{ fontSize: '10px', color: '#8fa5ad' }}>
                          {blog.publishedAt}
                        </span>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          </>
        )}
      </main>

      {/* =========================================================================
          True Full-Screen Article Reader Experience
         ========================================================================= */}
      {activeArticle && (
        <div
          className="article-reader-overlay"
          onScroll={handleScroll}
        >
          {/* Top Reading Progress Bar */}
          <div
            className="article-reader-progress-bar"
            style={{ width: `${readingProgress}%` }}
          />

          <div className="article-reader-container">
            {/* Full-width sticky top navigation bar */}
            <header className="article-reader-header">
              <div className="reader-header-left">
                <button
                  type="button"
                  className="reader-back-btn"
                  onClick={closeArticle}
                >
                  <ArrowLeft size={14} /> Back to all articles
                </button>
                <div className="reader-header-sep" />
                <div className="reader-brand-tag">
                  <img src="https://databrainit.com/images/logo.png" alt="DataBrain" />
                  <span>Insights</span>
                </div>
                <span className="reader-header-title-snippet">
                  {activeArticle.title}
                </span>
              </div>

              <div className="reader-header-right">
                <span className="reader-pill-badge">
                  <Clock size={12} /> {activeArticle.readingTime}
                </span>
                <button
                  type="button"
                  className="reader-share-btn"
                  onClick={() => handleShare(activeArticle)}
                  title="Copy share link"
                >
                  {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
                <button
                  type="button"
                  className="reader-close-btn"
                  onClick={closeArticle}
                  title="Close full screen (Esc)"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </header>

            {/* Centered Ergonomic Reading Column */}
            <main className="article-fullscreen-content">
              {/* Category, Read Time, Date */}
              <div className="article-meta-pills">
                <span className="featured-badge">{activeArticle.category}</span>
                <span className="featured-time">
                  <Clock size={12} /> {activeArticle.readingTime}
                </span>
                <span className="featured-time" style={{ marginLeft: 'auto' }}>
                  <Calendar size={12} /> {activeArticle.publishedAt}
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="article-title-heading">{activeArticle.title}</h1>

              {/* Author & Share Bar */}
              <div className="article-author-card">
                {activeArticle.authorPic ? (
                  <img
                    src={activeArticle.authorPic}
                    alt={activeArticle.authorName}
                    className="author-big-pic"
                  />
                ) : (
                  <div
                    className="author-avatar-fallback"
                    style={{ width: '48px', height: '48px', fontSize: '16px' }}
                  >
                    {activeArticle.authorName.charAt(0)}
                  </div>
                )}
                <div className="author-card-text">
                  <strong>{activeArticle.authorName}</strong>
                  <span>Cloud Specialist & Author · DataBrain IT Solutions</span>
                </div>

                <div className="article-share-buttons">
                  <button
                    type="button"
                    className="article-share-btn"
                    onClick={() => handleShare(activeArticle)}
                    title="Copy link to clipboard"
                  >
                    {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                    {copied ? 'Link Copied!' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Cover Banner */}
              {activeArticle.coverImage && (
                <div className="article-cover-wrap">
                  <img src={activeArticle.coverImage} alt={activeArticle.title} />
                </div>
              )}

              {/* Short Lead Description Callout */}
              {activeArticle.shortDescription && (
                <div className="article-lead-callout">
                  <p className="article-short-lead" style={{ margin: 0, padding: 0, border: 'none' }}>
                    {activeArticle.shortDescription}
                  </p>
                </div>
              )}

              {/* Formatted Long Description */}
              <div
                className="article-rich-content"
                dangerouslySetInnerHTML={{
                  __html: activeArticle.longDescription || '<p>Content in progress...</p>'
                }}
              />

              {/* Full-Screen Article Footer */}
              <div className="article-fullscreen-footer">
                {/* Author Extended Bio */}
                <div className="article-bottom-author-bio">
                  {activeArticle.authorPic ? (
                    <img
                      src={activeArticle.authorPic}
                      alt={activeArticle.authorName}
                      className="article-bio-avatar"
                    />
                  ) : (
                    <div
                      className="author-avatar-fallback"
                      style={{ width: '64px', height: '64px', fontSize: '20px' }}
                    >
                      {activeArticle.authorName.charAt(0)}
                    </div>
                  )}
                  <div className="article-bio-text">
                    <strong>Written by {activeArticle.authorName}</strong>
                    <small>Cloud Infrastructure & Solutions Specialist</small>
                    <p>
                      Sharing actionable engineering guides, DevOps tutorials, and hosting architecture
                      insights for developers and businesses building on DataBrain IT Solutions.
                    </p>
                  </div>
                </div>

                {/* Next / Previous Article Navigation */}
                <div className="article-nav-container">
                  {prevArticle ? (
                    <div
                      className="article-nav-card"
                      onClick={() => openArticle(prevArticle)}
                    >
                      <span className="article-nav-label">
                        <ArrowLeft size={12} /> Previous Article
                      </span>
                      <span className="article-nav-title">{prevArticle.title}</span>
                    </div>
                  ) : (
                    <div style={{ visibility: 'hidden' }} />
                  )}

                  {nextArticle && (
                    <div
                      className="article-nav-card next"
                      onClick={() => openArticle(nextArticle)}
                    >
                      <span className="article-nav-label">
                        Next Article <ArrowRight size={12} />
                      </span>
                      <span className="article-nav-title">{nextArticle.title}</span>
                    </div>
                  )}
                </div>

                {/* DataBrain Cloud CTA Box */}
                <div className="article-hosting-cta">
                  <div className="article-cta-content">
                    <h3>Supercharge Your Web Infrastructure</h3>
                    <p>
                      Experience ultra-fast NVMe storage, unmetered bandwidth, and 99.9% guaranteed uptime
                      with DataBrain cloud servers starting at just ₹199/month.
                    </p>
                  </div>
                  <a href="/#plans" className="article-cta-btn">
                    Explore Hosting Plans <ArrowRight size={13} />
                  </a>
                </div>

                {/* Bottom Actions */}
                <div className="article-bottom-actions">
                  <button
                    type="button"
                    className="article-bottom-back-btn"
                    onClick={closeArticle}
                  >
                    <ArrowLeft size={15} /> Back to all articles
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Website Footer */}
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="footer-brand">
            <div>
              <strong style={{ fontSize: '19px', color: '#ffffff', display: 'block', marginBottom: '4px' }}>
                DataBrain IT Solutions
              </strong>
              <p style={{ color: '#8faec0', fontSize: '14px', margin: 0 }}>
                High-performance web hosting, cloud servers, and domains across India & worldwide.
              </p>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <strong>Products</strong>
              <a href="/#plans">Web hosting</a>
              <a href="/#domains">Domains</a>
              <a href="/#services">Business email</a>
              <a href="/#plans">Cloud servers</a>
            </div>
            <div>
              <strong>Resources</strong>
              <a href="/blog">Blog</a>
              <a href="/#faq">FAQ</a>
              <a href="/#why-us">Why DataBrain</a>
            </div>
            <div>
              <strong>Client & Admin</strong>
              <a href="/portal">Client Portal</a>
              <a href="/admin">Admin Console</a>
            </div>
            <div>
              <strong>Connect</strong>
              <a href="/#contact">Contact Us</a>
              <a href="mailto:hello@databrainit.com">hello@databrainit.com</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 DataBrain IT Solutions. All rights reserved.</span>
            <span>Bengaluru · Karnataka · India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
