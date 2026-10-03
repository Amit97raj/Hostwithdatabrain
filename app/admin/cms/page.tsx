'use client';

import { useEffect, useState, useRef } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  ExternalLink,
  Globe2,
  Image,
  LayoutTemplate,
  Link2,
  Menu,
  Save,
  Search,
  Settings2,
  Share2,
  Sparkles,
  X,
  Upload,
  Trash2,
  RefreshCw,
  AlertCircle,
  Link as LinkIcon,
  CheckCircle2
} from 'lucide-react';

type CmsState = {
  banner: {
    enabled: boolean;
    eyebrow: string;
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    imageUrl?: string;
    offerBadge?: string;
    offerText?: string;
    offerLink?: string;
    offerTag?: string;
  };
  why?: {
    overline?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    metricValue?: string;
    metricLabel?: string;
    feature1Title?: string;
    feature1Description?: string;
    feature2Title?: string;
    feature2Description?: string;
  };
  social: Record<string, string>;
  seo: { title: string; description: string };
  navigation: { showOffers: boolean; showBlog: boolean; showKnowledgeBase: boolean };
};

const initialCms: CmsState = {
  banner: {
    enabled: true,
    eyebrow: 'Hosting that helps you grow',
    title: 'Your ideas deserve a faster home.',
    description:
      'Reliable hosting, domains, servers, and digital services for people and businesses building what comes next.',
    buttonText: 'Claim Offer & Get Started',
    buttonLink: '#plans',
    imageUrl: '',
    offerBadge: '',
    offerText: '',
    offerLink: '#plans',
    offerTag: ''
  },
  why: {
    overline: 'Built for the long run',
    title: 'More than hosting.',
    subtitle: 'A partner in your progress.',
    description:
      'From your first domain search to your busiest season, DataBrain gives you the infrastructure and human support to keep moving confidently.',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80',
    metricValue: '+38%',
    metricLabel: 'faster growth after switching',
    feature1Title: 'Speed without shortcuts',
    feature1Description: 'NVMe storage and next-gen infrastructure keep every click feeling instant.',
    feature2Title: 'People who pick up',
    feature2Description: 'Get thoughtful, expert support whenever you need a second pair of eyes.'
  },
  social: {
    instagram: 'https://instagram.com/databrainit',
    facebook: 'https://facebook.com/databrainit',
    linkedin: 'https://linkedin.com/company/databrainit',
    youtube: 'https://youtube.com/@databrainit'
  },
  seo: {
    title: 'DataBrain IT Solutions | Fast, reliable web hosting',
    description: 'Web hosting, domains, SSL, business email and digital services from DataBrain.'
  },
  navigation: { showOffers: false, showBlog: true, showKnowledgeBase: true }
};

const bannerPresets = [
  { label: 'Cloud Server', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Data Center', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Cyber Infrastructure', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Neon Rack', url: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&w=1200&q=80' }
];

export default function CmsPage() {
  const [cms, setCms] = useState<CmsState>(initialCms);
  const [activeTab, setActiveTab] = useState('Homepage');
  const [saved, setSaved] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/cms`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setCms)
      .catch(() => undefined);
  }, []);

  function updateBanner(field: string, value: string | boolean) {
    setCms((current) => ({
      ...current,
      banner: { ...current.banner, [field]: value }
    }));
    setSaved(false);
  }

  function updateWhy(field: string, value: string) {
    setCms((current) => ({
      ...current,
      why: {
        ...(current.why || initialCms.why!),
        [field]: value
      }
    }));
    setSaved(false);
  }

  function updateSocial(field: string, value: string) {
    setCms((current) => ({
      ...current,
      social: { ...current.social, [field]: value }
    }));
    setSaved(false);
  }

  async function saveCms() {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/cms`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cms)
      }
    );
    if (response.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="cms-shell">
      <header className="cms-topbar">
        <button
          className="cms-mobile-menu"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle CMS menu"
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        <a href="/admin" className="cms-brand">
          <img src="https://databrainit.com/images/logo.png" alt="DataBrain" />
          <span>
            <strong>DataBrain</strong>
            <small>Content studio</small>
          </span>
        </a>
        <div className="cms-top-actions">
          <a href="/" target="_blank" rel="noreferrer">
            <ExternalLink /> View website
          </a>
          <button className="cms-save-top" onClick={saveCms}>
            {saved ? <Check /> : <Save />} {saved ? 'Saved' : 'Save changes'}
          </button>
          <div className="avatar blue">AS</div>
        </div>
      </header>

      <div className="cms-layout">
        <aside className={`cms-sidebar ${mobileMenu ? 'open' : ''}`}>
          <a href="/admin" className="back-admin">
            <ArrowLeft /> Back to admin
          </a>
          <p>Website manager</p>
          {[
            { label: 'Homepage', icon: LayoutTemplate },
            { label: 'Banners & sections', icon: Image },
            { label: 'Menus & links', icon: Link2 },
            { label: 'Social media', icon: Share2 },
            { label: 'SEO settings', icon: Search }
          ].map((item) => (
            <button
              className={activeTab === item.label ? 'active' : ''}
              key={item.label}
              onClick={() => {
                setActiveTab(item.label);
                setMobileMenu(false);
              }}
            >
              <item.icon />
              {item.label}
            </button>
          ))}
          <div className="cms-sidebar-bottom">
            <Globe2 />
            <span>
              <strong>Live website</strong>
              <small>Last published just now</small>
            </span>
            <i />
          </div>
        </aside>

        <main className="cms-main">
          <div className="cms-heading">
            <div>
              <div className="cms-kicker">Website content</div>
              <h1>{activeTab}</h1>
              <p>Make changes to your website content without developer support.</p>
            </div>
            <button className="cms-save-button" onClick={saveCms}>
              {saved ? <Check /> : <Save />} {saved ? 'Changes saved' : 'Save changes'}
            </button>
          </div>

          {activeTab === 'Homepage' || activeTab === 'Banners & sections' ? (
            <HomepageEditor cms={cms} updateBanner={updateBanner} updateWhy={updateWhy} />
          ) : activeTab === 'Social media' ? (
            <SocialEditor cms={cms} updateSocial={updateSocial} />
          ) : activeTab === 'SEO settings' ? (
            <SeoEditor cms={cms} setCms={setCms} />
          ) : (
            <MenuEditor cms={cms} setCms={setCms} />
          )}
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  hint
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

const whyPresets = [
  { label: 'Cloud Team', url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Data Infrastructure', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Tech Workspace', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Server Racks', url: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80' }
];

function HomepageEditor({
  cms,
  updateBanner,
  updateWhy
}: {
  cms: CmsState;
  updateBanner: (field: string, value: string | boolean) => void;
  updateWhy: (field: string, value: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const whyFileInputRef = useRef<HTMLInputElement>(null);
  const [isWhyUploading, setIsWhyUploading] = useState(false);
  const [whyUploadError, setWhyUploadError] = useState('');
  const [showWhyUrlInput, setShowWhyUrlInput] = useState(false);
  const [customWhyUrl, setCustomWhyUrl] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        // Immediate local preview so user sees instant reaction
        updateBanner('imageUrl', base64Data);

        // Upload to server static folder
        try {
          const res = await fetch(`${apiUrl}/api/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: base64Data, filename: file.name })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              updateBanner('imageUrl', data.url);
            }
          }
        } catch {
          // If server upload fails, base64 is already set as fallback
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        setUploadError('Failed to read selected image.');
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploadError('Failed to process image file.');
      setIsUploading(false);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    const trimmed = customUrl.trim();
    if (!trimmed) return;
    updateBanner('imageUrl', trimmed);
    setCustomUrl('');
    setShowUrlInput(false);
  };

  const handleWhyFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setWhyUploadError('Image size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    setWhyUploadError('');
    setIsWhyUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        updateWhy('imageUrl', base64Data);

        try {
          const res = await fetch(`${apiUrl}/api/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl: base64Data, filename: file.name })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              updateWhy('imageUrl', data.url);
            }
          }
        } catch {
          // fallback active
        } finally {
          setIsWhyUploading(false);
        }
      };
      reader.onerror = () => {
        setWhyUploadError('Failed to read selected image.');
        setIsWhyUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setWhyUploadError('Failed to process image file.');
      setIsWhyUploading(false);
    } finally {
      if (whyFileInputRef.current) whyFileInputRef.current.value = '';
    }
  };

  const handleApplyWhyUrl = () => {
    const trimmed = customWhyUrl.trim();
    if (!trimmed) return;
    updateWhy('imageUrl', trimmed);
    setCustomWhyUrl('');
    setShowWhyUrlInput(false);
  };

  return (
    <div className="cms-content-grid">
      <section className="cms-editor-card">
        <div className="cms-card-header">
          <div>
            <h2>Hero banner</h2>
            <p>Control the first message visitors see on your website.</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={cms.banner.enabled}
              onChange={(event) => updateBanner('enabled', event.target.checked)}
            />
            <span />
          </label>
        </div>

        <div className="cms-form-grid">
          <Field label="Eyebrow">
            <input
              value={cms.banner.eyebrow}
              onChange={(event) => updateBanner('eyebrow', event.target.value)}
            />
          </Field>
          <Field label="Primary button label">
            <input
              value={cms.banner.buttonText}
              onChange={(event) => updateBanner('buttonText', event.target.value)}
            />
          </Field>
        </div>

        <Field label="Headline">
          <input
            value={cms.banner.title}
            onChange={(event) => updateBanner('title', event.target.value)}
          />
        </Field>

        <div className="cms-form-grid">
          <Field label="Banner offer badge / tag" hint="e.g. LIMITED TIME OFFER • UP TO 70% OFF">
            <input
              value={cms.banner.offerBadge || ''}
              placeholder="e.g. LIMITED TIME OFFER • UP TO 70% OFF"
              onChange={(event) => updateBanner('offerBadge', event.target.value)}
            />
          </Field>
          <Field label="Offer link" hint="Target section anchor, e.g. #plans">
            <input
              value={cms.banner.offerLink || ''}
              placeholder="#plans"
              onChange={(event) => updateBanner('offerLink', event.target.value)}
            />
          </Field>
        </div>

        <Field label="Banner offer message" hint="Text shown on the hero banner offer ribbon">
          <input
            value={cms.banner.offerText || ''}
            placeholder="e.g. Get High-Speed NVMe Web Hosting + Free Domain & Free SSL Starting @ ₹149/mo!"
            onChange={(event) => updateBanner('offerText', event.target.value)}
          />
        </Field>

        <Field label="Description">
          <textarea
            rows={4}
            value={cms.banner.description}
            onChange={(event) => updateBanner('description', event.target.value)}
          />
        </Field>

        <div className="cms-form-grid">
          <Field label="Button link">
            <input
              value={cms.banner.buttonLink}
              onChange={(event) => updateBanner('buttonLink', event.target.value)}
            />
          </Field>

          <Field label="Banner image" hint="Upload custom image or choose preset to replace default animation.">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              style={{ display: 'none' }}
            />

            {cms.banner.imageUrl ? (
              <div className="banner-preview-box">
                <div className="banner-preview-thumb-wrap">
                  <img
                    src={cms.banner.imageUrl}
                    alt="Current Banner"
                    className="banner-preview-thumb"
                  />
                  <span className="banner-active-pill">
                    <CheckCircle2 /> Active image
                  </span>
                </div>
                <div className="banner-preview-actions">
                  <button
                    type="button"
                    className="banner-action-btn change"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload /> {isUploading ? 'Uploading...' : 'Change image'}
                  </button>
                  <button
                    type="button"
                    className="banner-action-btn remove"
                    onClick={() => updateBanner('imageUrl', '')}
                    title="Remove custom image and reset to default server illustration"
                  >
                    <Trash2 /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="banner-upload-wrapper">
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Image />
                  <span>{isUploading ? 'Uploading image...' : 'Choose image'}</span>
                  <small>PNG, JPG up to 5MB</small>
                </button>
              </div>
            )}

            {uploadError && (
              <div className="banner-upload-error">
                <AlertCircle /> {uploadError}
              </div>
            )}

            <div className="banner-extra-options">
              <button
                type="button"
                className="banner-toggle-link"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                <LinkIcon /> {showUrlInput ? 'Hide URL input' : 'Or paste image URL / pick preset'}
              </button>

              {showUrlInput && (
                <div className="banner-url-container">
                  <div className="banner-url-row">
                    <input
                      type="url"
                      placeholder="https://example.com/banner.png"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
                    />
                    <button type="button" onClick={handleApplyUrl}>
                      Apply
                    </button>
                  </div>
                  <div className="banner-presets-list">
                    <small>Sample Presets:</small>
                    {bannerPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        className="preset-chip"
                        onClick={() => {
                          updateBanner('imageUrl', preset.url);
                          setShowUrlInput(false);
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Field>
        </div>
      </section>

      <section className="cms-preview-card">
        <div className="preview-top">
          <span>Live preview</span>
          <span className="preview-live">
            <i /> Desktop
          </span>
        </div>
        <div className="preview-browser">
          <div className="preview-bar">
            <i />
            <i />
            <i />
          </div>
          <div className="preview-hero">
            <div className="preview-brand">DataBrain</div>
            {cms.banner.offerBadge && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px', marginBottom: '8px' }}>
                🔥 {cms.banner.offerBadge}
              </div>
            )}
            <small>{cms.banner.eyebrow}</small>
            <strong>{cms.banner.title}</strong>
            <p>{cms.banner.description}</p>
            <b>
              {cms.banner.buttonText} <ArrowLeft />
            </b>
            <div className="preview-art">
              {cms.banner.imageUrl ? (
                <img
                  src={cms.banner.imageUrl}
                  alt="Hero Banner Preview"
                  className="preview-art-img"
                />
              ) : (
                <Sparkles />
              )}
            </div>
          </div>

          {/* Mini preview for Why DataBrain */}
          <div style={{ padding: '14px 17px', background: '#ffffff', borderTop: '1px solid #e3edef' }}>
            <small style={{ color: '#1597d4', textTransform: 'uppercase', fontSize: '7px', fontWeight: 800, letterSpacing: '1px', display: 'block' }}>
              {cms.why?.overline || 'BUILT FOR THE LONG RUN'}
            </small>
            <strong style={{ display: 'block', fontSize: '13px', color: '#123c4d', margin: '3px 0' }}>
              {cms.why?.title || 'More than hosting.'}{' '}
              <span style={{ color: '#1597d4' }}>{cms.why?.subtitle || 'A partner in your progress.'}</span>
            </strong>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
              {cms.why?.imageUrl && (
                <img
                  src={cms.why.imageUrl}
                  alt="Why preview"
                  style={{ width: '70px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2edf0' }}
                />
              )}
              <div style={{ fontSize: '9px', color: '#64748b' }}>
                <span style={{ color: '#10b981', fontWeight: 800, fontSize: '11px', display: 'block' }}>{cms.why?.metricValue || '+38%'}</span>
                {cms.why?.metricLabel || 'faster growth after switching'}
              </div>
            </div>
          </div>
        </div>
        <a href="/" target="_blank" rel="noreferrer" className="preview-link">
          Open full website <ExternalLink />
        </a>
      </section>

      {/* Why DataBrain Section Editor */}
      <section className="cms-editor-card" style={{ gridColumn: '1 / -1' }}>
        <div className="cms-card-header">
          <div>
            <h2>Why DataBrain section</h2>
            <p>Manage the left-side showcase image, headline, highlights, and growth metrics for the &quot;Why DataBrain&quot; section.</p>
          </div>
          <Sparkles className="header-card-icon" />
        </div>

        <div className="cms-form-grid">
          <Field label="Section Overline" hint="e.g. BUILT FOR THE LONG RUN">
            <input
              value={cms.why?.overline || ''}
              placeholder="BUILT FOR THE LONG RUN"
              onChange={(e) => updateWhy('overline', e.target.value)}
            />
          </Field>
          <Field label="Growth metric value" hint="e.g. +38%">
            <input
              value={cms.why?.metricValue || ''}
              placeholder="+38%"
              onChange={(e) => updateWhy('metricValue', e.target.value)}
            />
          </Field>
        </div>

        <div className="cms-form-grid">
          <Field label="Headline title" hint="e.g. More than hosting.">
            <input
              value={cms.why?.title || ''}
              placeholder="More than hosting."
              onChange={(e) => updateWhy('title', e.target.value)}
            />
          </Field>
          <Field label="Headline subtitle" hint="e.g. A partner in your progress.">
            <input
              value={cms.why?.subtitle || ''}
              placeholder="A partner in your progress."
              onChange={(e) => updateWhy('subtitle', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Section description paragraph">
          <textarea
            rows={3}
            value={cms.why?.description || ''}
            placeholder="From your first domain search to your busiest season..."
            onChange={(e) => updateWhy('description', e.target.value)}
          />
        </Field>

        <div className="cms-form-grid">
          <Field label="Growth metric badge text" hint="Text displayed under the metric, e.g. faster growth after switching">
            <input
              value={cms.why?.metricLabel || ''}
              placeholder="faster growth after switching"
              onChange={(e) => updateWhy('metricLabel', e.target.value)}
            />
          </Field>

          <Field label="Section image" hint="Upload image or choose preset to replace the illustration in Why DataBrain.">
            <input
              type="file"
              ref={whyFileInputRef}
              onChange={handleWhyFileChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
              style={{ display: 'none' }}
            />

            {cms.why?.imageUrl ? (
              <div className="banner-preview-box">
                <div className="banner-preview-thumb-wrap" style={{ height: '140px' }}>
                  <img
                    src={cms.why.imageUrl}
                    alt="Why DataBrain Showcase"
                    className="banner-preview-thumb"
                  />
                  <span className="banner-active-pill">
                    <CheckCircle2 /> Active image
                  </span>
                </div>
                <div className="banner-preview-actions">
                  <button
                    type="button"
                    className="banner-action-btn change"
                    onClick={() => whyFileInputRef.current?.click()}
                    disabled={isWhyUploading}
                  >
                    <Upload /> {isWhyUploading ? 'Uploading...' : 'Change image'}
                  </button>
                  <button
                    type="button"
                    className="banner-action-btn remove"
                    onClick={() => updateWhy('imageUrl', '')}
                    title="Remove custom image and reset to default"
                  >
                    <Trash2 /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="banner-upload-wrapper">
                <button
                  type="button"
                  className="upload-button"
                  onClick={() => whyFileInputRef.current?.click()}
                  disabled={isWhyUploading}
                >
                  <Image />
                  <span>{isWhyUploading ? 'Uploading image...' : 'Choose showcase image'}</span>
                  <small>PNG, JPG up to 5MB</small>
                </button>
              </div>
            )}

            {whyUploadError && (
              <div className="banner-upload-error">
                <AlertCircle /> {whyUploadError}
              </div>
            )}

            <div className="banner-extra-options">
              <button
                type="button"
                className="banner-toggle-link"
                onClick={() => setShowWhyUrlInput(!showWhyUrlInput)}
              >
                <LinkIcon /> {showWhyUrlInput ? 'Hide URL input' : 'Or paste image URL / pick preset'}
              </button>

              {showWhyUrlInput && (
                <div className="banner-url-container">
                  <div className="banner-url-row">
                    <input
                      type="url"
                      placeholder="https://example.com/why-databrain.png"
                      value={customWhyUrl}
                      onChange={(e) => setCustomWhyUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyWhyUrl()}
                    />
                    <button type="button" onClick={handleApplyWhyUrl}>
                      Apply
                    </button>
                  </div>
                  <div className="banner-presets-list">
                    <small>Sample Presets:</small>
                    {whyPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset.label}
                        className="preset-chip"
                        onClick={() => {
                          updateWhy('imageUrl', preset.url);
                          setShowWhyUrlInput(false);
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Field>
        </div>

        <div className="cms-form-grid" style={{ marginTop: '10px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'block', fontSize: '11px', color: '#1e293b', marginBottom: '8px' }}>Feature highlight 1</strong>
            <Field label="Feature 1 title">
              <input
                value={cms.why?.feature1Title || ''}
                placeholder="Speed without shortcuts"
                onChange={(e) => updateWhy('feature1Title', e.target.value)}
              />
            </Field>
            <Field label="Feature 1 description">
              <textarea
                rows={2}
                value={cms.why?.feature1Description || ''}
                placeholder="NVMe storage and next-gen infrastructure keep every click feeling instant."
                onChange={(e) => updateWhy('feature1Description', e.target.value)}
              />
            </Field>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'block', fontSize: '11px', color: '#1e293b', marginBottom: '8px' }}>Feature highlight 2</strong>
            <Field label="Feature 2 title">
              <input
                value={cms.why?.feature2Title || ''}
                placeholder="People who pick up"
                onChange={(e) => updateWhy('feature2Title', e.target.value)}
              />
            </Field>
            <Field label="Feature 2 description">
              <textarea
                rows={2}
                value={cms.why?.feature2Description || ''}
                placeholder="Get thoughtful, expert support whenever you need a second pair of eyes."
                onChange={(e) => updateWhy('feature2Description', e.target.value)}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="cms-editor-card content-sections">
        <div className="cms-card-header">
          <div>
            <h2>Homepage sections</h2>
            <p>Choose which content blocks appear on the public homepage.</p>
          </div>
        </div>
        {[
          'Domain search',
          'Hosting plans',
          'Why DataBrain',
          'Customer testimonial',
          'Frequently asked questions'
        ].map((section) => (
          <div className="section-toggle" key={section}>
            <span>
              <LayoutTemplate />
              {section}
            </span>
            <label className="switch">
              <input type="checkbox" defaultChecked />
              <span />
            </label>
          </div>
        ))}
      </section>
    </div>
  );
}

function SocialEditor({
  cms,
  updateSocial
}: {
  cms: CmsState;
  updateSocial: (field: string, value: string) => void;
}) {
  return (
    <section className="cms-editor-card narrow-card">
      <div className="cms-card-header">
        <div>
          <h2>Social media profiles</h2>
          <p>These links appear in your website footer and contact areas.</p>
        </div>
        <Share2 className="header-card-icon" />
      </div>
      {Object.entries(cms.social).map(([network, url]) => (
        <Field
          key={network}
          label={network.charAt(0).toUpperCase() + network.slice(1)}
        >
          <div className="input-with-icon">
            <Link2 />
            <input
              value={url}
              onChange={(event) => updateSocial(network, event.target.value)}
            />
          </div>
        </Field>
      ))}
    </section>
  );
}

function SeoEditor({
  cms,
  setCms
}: {
  cms: CmsState;
  setCms: React.Dispatch<React.SetStateAction<CmsState>>;
}) {
  return (
    <section className="cms-editor-card narrow-card">
      <div className="cms-card-header">
        <div>
          <h2>Search engine settings</h2>
          <p>Improve how DataBrain appears in search results.</p>
        </div>
        <Search className="header-card-icon" />
      </div>
      <Field label="Homepage SEO title">
        <input
          value={cms.seo.title}
          onChange={(event) =>
            setCms((current) => ({
              ...current,
              seo: { ...current.seo, title: event.target.value }
            }))
          }
        />
      </Field>
      <Field label="Meta description">
        <textarea
          rows={5}
          value={cms.seo.description}
          onChange={(event) =>
            setCms((current) => ({
              ...current,
              seo: { ...current.seo, description: event.target.value }
            }))
          }
        />
      </Field>
      <div className="seo-result">
        <small>Google preview</small>
        <strong>{cms.seo.title}</strong>
        <span>https://databrainit.com</span>
        <p>{cms.seo.description}</p>
      </div>
    </section>
  );
}

function MenuEditor({
  cms,
  setCms
}: {
  cms: CmsState;
  setCms: React.Dispatch<React.SetStateAction<CmsState>>;
}) {
  return (
    <section className="cms-editor-card narrow-card">
      <div className="cms-card-header">
        <div>
          <h2>Navigation visibility</h2>
          <p>Control which links are visible in the public website menu.</p>
        </div>
        <Settings2 className="header-card-icon" />
      </div>
      {[
        ['showOffers', 'Offers'],
        ['showBlog', 'Blog'],
        ['showKnowledgeBase', 'Knowledge base']
      ].map(([key, label]) => (
        <div className="section-toggle" key={key}>
          <span>
            <Menu />
            {label}
          </span>
          <label className="switch">
            <input
              type="checkbox"
              checked={cms.navigation[key as keyof CmsState['navigation']]}
              onChange={(event) =>
                setCms((current) => ({
                  ...current,
                  navigation: {
                    ...current.navigation,
                    [key]: event.target.checked
                  }
                }))
              }
            />
            <span />
          </label>
        </div>
      ))}
    </section>
  );
}
