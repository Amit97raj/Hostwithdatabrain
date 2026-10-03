'use client';

import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  Crown,
  Flame,
  Globe2,
  Headphones,
  HelpCircle,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  Phone,
  Rocket,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  User,
  X,
  XCircle,
  Zap
} from 'lucide-react';
import RazorpayModal, { PaymentDetails } from './components/RazorpayModal';
import './blog.css';
import './pricing-section.css';

type Service = {
  id: string;
  name: string;
  description: string;
  price: string;
  popular?: boolean;
  status: string;
  features: string[];
};

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
    feature1?: string;
    feature2?: string;
    feature3?: string;
    guarantee?: string;
    trustBadge?: string;
    trustLabel?: string;
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
  navigation: { showOffers?: boolean; showBlog: boolean; showKnowledgeBase: boolean };
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

const fallbackServices: Service[] = [
  {
    id: 'fallback-1',
    name: 'Starter',
    description: 'A simple start for personal websites and portfolios.',
    price: '₹149',
    status: 'Active',
    features: ['1 website', '20 GB NVMe storage', 'Free SSL certificate', 'Weekly backups']
  },
  {
    id: 'fallback-2',
    name: 'Business',
    description: 'Everything growing businesses need to move faster.',
    price: '₹149',
    popular: true,
    status: 'Active',
    features: ['Unlimited websites', '50 GB NVMe storage', 'Free domain for 1 year', 'Daily backups', 'Business email included']
  },
  {
    id: 'fallback-3',
    name: 'Cloud Pro',
    description: 'More power, control, and room for ambitious projects.',
    price: '₹299',
    status: 'Active',
    features: ['Unlimited websites', '100 GB NVMe storage', 'Dedicated resources', 'Priority support', 'Free migration']
  }
];

const defaultCms: CmsState = {
  banner: {
    enabled: true,
    eyebrow: 'Get 80% Off Hosting with Free Domain',
    title: 'Launch your website in minutes',
    description: 'Fast, secure & reliable hosting built for Indian websites.',
    buttonText: 'Start Now',
    buttonLink: '#plans',
    imageUrl: 'http://localhost:4000/uploads/hero-builder.jpg',
    feature1: 'Up to 20x faster website performance',
    feature2: 'Free SSL, email & daily backups',
    feature3: 'Create your website faster with AI',
    guarantee: '30-day money-back guarantee • Cancel anytime',
    trustBadge: '1 million +',
    trustLabel: 'Websites Trust Us'
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
  social: {},
  seo: { title: 'DataBrain IT Solutions | Fast, reliable web hosting', description: '' },
  navigation: { showOffers: false, showBlog: true, showKnowledgeBase: true }
};

type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category?: string;
  status?: string;
};

const fallbackFaqs: FaqItem[] = [
  {
    id: 'KB-001',
    question: 'What is included with every hosting plan?',
    answer: "Every DataBrain hosting plan includes ultra-fast NVMe SSD storage, free Let's Encrypt SSL certificates, automated daily backups, unmetered bandwidth, cPanel control panel, 99.99% uptime SLA, and 24/7 technical support by our experts.",
    category: 'Hosting'
  },
  {
    id: 'KB-002',
    question: 'Can I migrate my existing website to DataBrain?',
    answer: 'Yes, absolutely! We offer 100% free website and email migration for all cPanel and WordPress websites. Our migration team handles everything with zero downtime so your visitors never experience any interruption.',
    category: 'Migration'
  },
  {
    id: 'KB-003',
    question: 'Do you offer monthly and yearly billing?',
    answer: 'Yes, we support both flexible monthly and discounted annual billing cycles. Choosing an annual plan unlocks special savings (up to 20% off) plus a free .in or .com domain registration for your first year.',
    category: 'Billing'
  },
  {
    id: 'KB-004',
    question: 'How quickly will my service be activated?',
    answer: 'Instant activation! As soon as your Razorpay or online payment is verified, your hosting account, cPanel login credentials, and server environment are provisioned automatically within 60 seconds.',
    category: 'General'
  },
  {
    id: 'KB-005',
    question: 'How do I configure custom DNS records?',
    answer: "You can manage A, CNAME, MX, and TXT records directly through our Client Portal under the 'Domains & DNS' tab. Any changes you make propagate across global nameservers in real-time.",
    category: 'Domains'
  }
];

export default function PublicWebsite() {
  const [cms, setCms] = useState(defaultCms);
  const [services, setServices] = useState(fallbackServices);
  const [starterPrice, setStarterPrice] = useState('149');
  const [menuOpen, setMenuOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [tld, setTld] = useState('.com');
  const [domainLoading, setDomainLoading] = useState(false);
  const [domainResult, setDomainResult] = useState<{
    domain: string;
    available: boolean;
    price_usd: number | null;
    since_year: number | null;
    buy_url: string | null;
    price_inr?: number;
    formatted_price?: string;
    price_period?: string;
    tld?: string;
    is_premium?: boolean;
  } | null>(null);
  const [domainPrices, setDomainPrices] = useState<Record<string, { price: number; currency: string; period: string }>>({
    '.com': { price: 799, currency: '₹', period: '/yr' },
    '.in': { price: 499, currency: '₹', period: '/yr' },
    '.net': { price: 899, currency: '₹', period: '/yr' },
    '.co': { price: 1299, currency: '₹', period: '/yr' },
    '.org': { price: 999, currency: '₹', period: '/yr' },
    '.io': { price: 2799, currency: '₹', period: '/yr' },
    '.dev': { price: 1099, currency: '₹', period: '/yr' },
    '.app': { price: 1199, currency: '₹', period: '/yr' },
    '.xyz': { price: 299, currency: '₹', period: '/yr' },
    '.online': { price: 199, currency: '₹', period: '/yr' },
    '.ai': { price: 5499, currency: '₹', period: '/yr' },
    '.tech': { price: 499, currency: '₹', period: '/yr' },
    '.store': { price: 299, currency: '₹', period: '/yr' },
    '.info': { price: 449, currency: '₹', period: '/yr' }
  });
  const [domainError, setDomainError] = useState('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('KB-001');
  const [faqList, setFaqList] = useState<FaqItem[]>(fallbackFaqs);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState('All');
  const [faqSearch, setFaqSearch] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<'1 Month' | '3 Months' | '12 Months' | '24 Months'>('12 Months');
  const [buyer, setBuyer] = useState({ name: '', email: '', cycle: 'Annual' });
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [contact, setContact] = useState({ name: '', email: '', service: 'Cloud Hosting', phone: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [contactMessage, setContactMessage] = useState('');
  const [homeBlogs, setHomeBlogs] = useState<any[]>([]);

  // Client Auth & Modal states
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState('');
  const [loginForm, setLoginForm] = useState({ identifier: 'amit@gmail.com', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  const distinctCategories = Array.from(
    new Set(faqList.map((f) => f.category || 'General').filter(Boolean))
  );
  const faqCategories = ['All', ...distinctCategories];

  const displayedFaqs = faqList.filter((faq) => {
    const matchesCategory =
      selectedFaqCategory === 'All' ||
      (faq.category || 'General').toLowerCase() === selectedFaqCategory.toLowerCase();
    const query = faqSearch.trim().toLowerCase();
    const matchesSearch =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      (faq.category || '').toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    fetch(`${apiUrl}/api/cms`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((content: CmsState) => {
        setCms(content);
        document.title = content.seo.title;
      })
      .catch(() => {
        document.title = defaultCms.seo.title;
      });

    fetch(`${apiUrl}/api/starter-price`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data && data.amount) setStarterPrice(String(data.amount));
      })
      .catch(() => undefined);

    fetch(`${apiUrl}/api/services`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((content: Service[]) => {
        if (content.length) {
          setServices(content);
          const starter = content.find((s) => s.name.toLowerCase().includes('starter')) || content[0];
          if (starter && starter.price) {
            const cleaned = starter.price.replace(/[^\d]/g, '');
            if (cleaned) setStarterPrice(cleaned);
          }
        }
      })
      .catch(() => undefined);

    fetch(`${apiUrl}/api/faqs`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: FaqItem[]) => {
        if (Array.isArray(data) && data.length) setFaqList(data);
      })
      .catch(() => undefined);

    fetch(`${apiUrl}/api/blogs`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data) => {
        if (Array.isArray(data)) {
          setHomeBlogs(data.filter((b) => (b.status || 'Published') === 'Published').slice(0, 3));
        }
      })
      .catch(() => undefined);

    fetch(`${apiUrl}/api/domain-prices`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (data && typeof data === 'object') {
          setDomainPrices((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => undefined);

    // Check user session
    const token = localStorage.getItem('databrain_auth_token');
    if (token) {
      fetch(`${apiUrl}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then((data) => {
          if (data.user) {
            setCurrentUser(data.user);
            setBuyer((b) => ({ ...b, name: data.user.name, email: data.user.email }));
          }
        })
        .catch(() => {
          localStorage.removeItem('databrain_auth_token');
        });
    }
  }, [apiUrl]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('databrain_auth_token', data.token);
        setCurrentUser(data.user);
        setBuyer((b) => ({ ...b, name: data.user.name, email: data.user.email }));
        setAuthSuccess(`Welcome, ${data.user.name}! You are now logged in.`);
        setTimeout(() => {
          setAuthModalOpen(false);
          setAuthSuccess('');
        }, 1200);
      } else {
        setAuthError(data.message || 'Invalid email/phone or password.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
    setAuthLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('databrain_auth_token', data.token);
        setCurrentUser(data.user);
        setBuyer((b) => ({ ...b, name: data.user.name, email: data.user.email }));
        setAuthSuccess(`Registration complete! Welcome, ${data.user.name}`);
        setTimeout(() => {
          setAuthModalOpen(false);
          setAuthSuccess('');
        }, 1200);
      } else {
        setAuthError(data.message || 'Could not complete registration.');
      }
    } catch {
      setAuthError('Connection error. Please try again.');
    }
    setAuthLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem('databrain_auth_token');
    setCurrentUser(null);
  }

  function getDomainDisplayPrice(targetDomain?: string, result?: any) {
    if (result?.formatted_price) {
      return result.formatted_price;
    }
    const name = (targetDomain || `${domain}${tld}`).toLowerCase().trim();
    const sortedTlds = Object.keys(domainPrices).sort((a, b) => b.length - a.length);
    const matched = sortedTlds.find((ext) => name.endsWith(ext)) || tld || '.com';
    const cfg = domainPrices[matched] || { price: 799 };
    return `₹${cfg.price.toLocaleString('en-IN')}`;
  }

  function getPlanPricing(service: Service | null, duration: '1 Month' | '3 Months' | '12 Months' | '24 Months') {
    if (!service) {
      return {
        priceAmount: '₹149',
        period: '/month',
        billedText: 'Billed annually',
        billedTotalFormatted: '₹1,788',
        savingsTag: 'Save 25%'
      };
    }
    const isStarter = service.name.toLowerCase().includes('starter') || service.id === 'SRV-001';
    const isBusiness = service.name.toLowerCase().includes('business') || service.id === 'SRV-002';

    let monthlyRate = 149;
    let billedTotal = 1788;
    let billedText = 'Billed ₹1,788 annually';
    let savingsTag = 'Save 25%';

    if (isStarter) {
      if (duration === '1 Month') {
        monthlyRate = 199;
        billedTotal = 199;
        billedText = 'Billed ₹199 monthly';
        savingsTag = '';
      } else if (duration === '3 Months') {
        monthlyRate = 169;
        billedTotal = 507;
        billedText = 'Billed ₹507 quarterly';
        savingsTag = 'Save 15%';
      } else if (duration === '12 Months') {
        monthlyRate = 149;
        billedTotal = 1788;
        billedText = 'Billed ₹1,788 annually';
        savingsTag = 'Save 25%';
      } else if (duration === '24 Months') {
        monthlyRate = 119;
        billedTotal = 2856;
        billedText = 'Billed ₹2,856 for 24 months';
        savingsTag = 'Save 40%';
      }
    } else if (isBusiness) {
      if (duration === '1 Month') {
        monthlyRate = 399;
        billedTotal = 399;
        billedText = 'Billed ₹399 monthly';
        savingsTag = '';
      } else if (duration === '3 Months') {
        monthlyRate = 349;
        billedTotal = 1047;
        billedText = 'Billed ₹1,047 quarterly';
        savingsTag = 'Save 15%';
      } else if (duration === '12 Months') {
        monthlyRate = 299;
        billedTotal = 3588;
        billedText = 'Billed ₹3,588 annually';
        savingsTag = 'Save 25%';
      } else if (duration === '24 Months') {
        monthlyRate = 249;
        billedTotal = 5976;
        billedText = 'Billed ₹5,976 for 24 months';
        savingsTag = 'Save 40%';
      }
    } else {
      if (duration === '1 Month') {
        monthlyRate = 899;
        billedTotal = 899;
        billedText = 'Billed ₹899 monthly';
        savingsTag = '';
      } else if (duration === '3 Months') {
        monthlyRate = 799;
        billedTotal = 2397;
        billedText = 'Billed ₹2,397 quarterly';
        savingsTag = 'Save 12%';
      } else if (duration === '12 Months') {
        monthlyRate = 699;
        billedTotal = 8388;
        billedText = 'Billed ₹8,388 annually';
        savingsTag = 'Save 22%';
      } else if (duration === '24 Months') {
        monthlyRate = 599;
        billedTotal = 14376;
        billedText = 'Billed ₹14,376 for 24 months';
        savingsTag = 'Save 33%';
      }
    }

    return {
      priceAmount: `₹${monthlyRate}`,
      period: '/month',
      billedText,
      billedTotalFormatted: `₹${billedTotal.toLocaleString('en-IN')}`,
      savingsTag
    };
  }

  async function searchDomain(event: React.FormEvent) {
    event.preventDefault();
    const rawInput = domain.trim().replace(/\s/g, '');
    if (!rawInput) return;
    setDomainLoading(true);
    setDomainResult(null);
    setDomainError('');
    try {
      const fullDomain = rawInput.includes('.') ? rawInput : `${rawInput}${tld}`;
      const response = await fetch(`${apiUrl}/api/domain-check?domain=${encodeURIComponent(fullDomain)}`);
      if (!response.ok) throw new Error();
      const data = await response.json();
      setDomainResult(data.result);
      if (data.result?.tld) {
        setTld(data.result.tld);
      }
    } catch {
      setDomainError('Unable to check domain. Please try again.');
    }
    setDomainLoading(false);
  }

  async function purchaseService(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedService) return;
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { name: buyer.name, email: buyer.email },
        serviceId: selectedService.id,
        cycle: buyer.cycle
      })
    });
    if (response.ok) {
      const result = await response.json();
      const invoiceId = result.invoice?.id || 'N/A';
      setPurchaseMessage(
        `Order ${result.order.id} confirmed for ${result.customer.name}! Tax Invoice ${invoiceId} has been generated and linked to your account.`
      );
    } else {
      const error = await response.json().catch(() => ({ message: 'Unable to create order' }));
      setPurchaseMessage(error.message);
    }
  }

  async function submitContact(event: React.FormEvent) {
    event.preventDefault();
    setContactStatus('sending');
    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (response.ok) {
        const result = await response.json();
        setContactStatus('sent');
        setContactMessage(
          `Thank you, ${contact.name}! Your support ticket #${result.ticket.id} has been created. Our technical team will reach out shortly.`
        );
        setContact({ name: '', email: '', service: 'Cloud Hosting', phone: '', message: '' });
      } else {
        const error = await response.json().catch(() => ({ message: 'Unable to submit your request. Please try again.' }));
        setContactStatus('error');
        setContactMessage(error.message);
      }
    } catch {
      setContactStatus('error');
      setContactMessage('Network error. Please check your connection and try again.');
    }
  }

  const starterService = services.find((s) => s.name.toLowerCase().includes('starter')) || services[0] || null;
  const starterPlanPricing = getPlanPricing(starterService, selectedDuration);
  const activeStarterPrice = starterPlanPricing?.priceAmount ? starterPlanPricing.priceAmount.replace(/[^\d]/g, '') : starterPrice;

  return (
    <main className="site-shell">
      {/* Announcement Bar */}
      <div className="announcement">
        <Sparkles /> High-Performance NVMe Cloud & Web Hosting Solutions
        <a href="#plans">
          Explore plans <ArrowRight />
        </a>
      </div>

      {/* Main Header */}
      <header className="site-header">
        <a className="site-logo" href="#top">
          <img src="https://databrainit.com/images/logo.png" alt="DataBrain IT Solutions" />
          <span>
            <strong>DataBrain</strong>
            <small>IT SOLUTIONS</small>
          </span>
        </a>

        <nav className={menuOpen ? 'site-nav open' : 'site-nav'}>
          <a href="#hosting" onClick={() => setMenuOpen(false)}>
            Hosting <ChevronDown size={14} />
          </a>
          <a href="#domains" onClick={() => setMenuOpen(false)}>
            Domains
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services <ChevronDown size={14} />
          </a>
          <a href="#why-us" onClick={() => setMenuOpen(false)}>
            Why DataBrain
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact Us
          </a>
        </nav>

        <div className="header-actions">
          {currentUser ? (
            <div className="header-user-badge">
              <span className="user-avatar-initials">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span className="user-display-name">
                {currentUser.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="user-exit-btn"
                title="Log out"
              >
                <LogOut size={13} /> Exit
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="header-signin-btn"
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
            >
              <User size={15} />
              <span>Client Sign In</span>
            </button>
          )}

          <a className="header-cta" href="#plans">
            <span>Get started</span>
            <ArrowRight size={15} />
          </a>

          <button
            className="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      {cms.banner.enabled && (
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="hero-kicker-deal">
              {cms.banner.eyebrow?.includes('80% Off') ? (
                <>
                  Get <span className="highlight-deal">80% Off</span> Hosting with Free Domain
                </>
              ) : (
                cms.banner.eyebrow || 'Get 80% Off Hosting with Free Domain'
              )}
            </div>
            <h1>{cms.banner.title || 'Launch your website in minutes'}</h1>
            <p className="hero-desc">
              {cms.banner.description || 'Fast, secure & reliable hosting built for Indian websites.'}
            </p>

            <ul className="hero-check-list">
              <li>
                <span className="check-badge">✓</span>
                <span>{cms.banner.feature1 || 'Up to 20x faster website performance'}</span>
              </li>
              <li>
                <span className="check-badge">✓</span>
                <span>{cms.banner.feature2 || 'Free SSL, email & daily backups'}</span>
              </li>
              <li>
                <span className="check-badge">✓</span>
                <span>{cms.banner.feature3 || 'Create your website faster with AI'}</span>
              </li>
            </ul>

            <div className="hero-starter-price-block">
              <span className="hero-rupee">₹</span>
              <strong className="hero-amount">{activeStarterPrice}</strong>
              <span className="hero-mo">/mo</span>
            </div>

            <div className="hero-start-action">
              <a className="hero-start-now-btn" href={cms.banner.buttonLink || '#plans'}>
                {cms.banner.buttonText || 'Start Now'}
              </a>
            </div>

            <div className="hero-guarantee-row">
              <ShieldCheck size={16} className="guarantee-shield-icon" />
              <span>{cms.banner.guarantee || '30-day money-back guarantee • Cancel anytime'}</span>
            </div>
          </div>

          <div className="hero-art hero-art-builder">
            <div className="hero-builder-img-wrap">
              <img
                src={cms.banner.imageUrl || 'http://localhost:4000/uploads/hero-builder.jpg'}
                alt={cms.banner.title || 'Launch your website'}
                className="hero-builder-img"
              />
              <div className="hero-builder-overlay-glow" />
            </div>

            {/* Trust Badge at bottom-left */}
            <div className="hero-trust-box">
              <div className="trust-trophy-icon">
                <Crown size={18} />
              </div>
              <div>
                <strong>{cms.banner.trustBadge || '1 million +'}</strong>
                <small>{cms.banner.trustLabel || 'Websites Trust Us'}</small>
              </div>
            </div>

            {/* Global data center at bottom-right */}
            <div className="hero-datacenter-box">
              <div className="dc-label">Global data center</div>
              <div className="dc-bar">
                <div className="dc-fill" />
              </div>
              <div className="dc-flags">
                <span>🇮🇳 IN</span>
                <span>🇺🇸 US</span>
                <span>🇸🇬 SG</span>
                <span>🇨🇦 CA</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Domain Search Section */}
      <section className="domain-section" id="domains">
        <div className="section-overline">Find your corner of the internet</div>
        <h2>Start with the right domain.</h2>
        <p>Search millions of names and launch something memorable today.</p>
        <form className="domain-search" onSubmit={searchDomain}>
          <Globe2 />
          <input
            value={domain}
            onChange={(event) => {
              setDomain(event.target.value);
              setDomainResult(null);
              setDomainError('');
            }}
            placeholder="yourbrand"
            aria-label="Search for a domain"
          />
          <select
            className="tld-select"
            value={tld}
            onChange={(e) => {
              setTld(e.target.value);
              setDomainResult(null);
              setDomainError('');
            }}
            aria-label="Select Top Level Domain"
          >
            {Object.entries(domainPrices).map(([ext, info]) => (
              <option key={ext} value={ext}>
                {ext} (₹{info.price.toLocaleString('en-IN')})
              </option>
            ))}
          </select>
          <button type="submit" disabled={domainLoading}>
            {domainLoading ? (
              <>
                <Loader2 className="spin" /> Checking...
              </>
            ) : (
              <>
                Search domain <Search />
              </>
            )}
          </button>
        </form>

        {domainResult &&
          (domainResult.available ? (
            <div className="domain-result available">
              <Check /> <strong>{domainResult.domain}</strong> is available!
              <span className="domain-price">
                {getDomainDisplayPrice(domainResult.domain, domainResult)}
                {domainResult.price_period || '/yr'}
              </span>
              {domainResult.is_premium && (
                <span
                  style={{
                    background: '#fef3c7',
                    color: '#b45309',
                    border: '1px solid #fde68a',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    marginLeft: '4px'
                  }}
                >
                  PREMIUM
                </span>
              )}
              <button
                type="button"
                style={{
                  background: '#1197d4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '5px 12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginLeft: '8px'
                }}
                onClick={() => {
                  const finalPrice = getDomainDisplayPrice(domainResult.domain, domainResult);
                  setPaymentDetails({
                    title: 'Domain Registration',
                    subtitle: `Register ${domainResult.domain} (1 Year)`,
                    amount: finalPrice,
                    type: 'domain',
                    customerName: currentUser?.name || 'Customer',
                    customerEmail: currentUser?.email || 'customer@databrainit.com'
                  });
                }}
              >
                Register with Razorpay <ArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="domain-result taken">
              <XCircle /> <strong>{domainResult.domain}</strong> is already taken
              {domainResult.since_year && <span> (since {domainResult.since_year})</span>}.{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setDomain('');
                  setDomainResult(null);
                }}
              >
                Try another name <ArrowRight />
              </a>
            </div>
          ))}
        {domainError && (
          <div className="domain-result taken">
            <XCircle /> {domainError}
          </div>
        )}
        <div className="domain-tlds">
          <button
            type="button"
            className={`domain-tld-card ${tld === '.com' ? 'active' : ''}`}
            onClick={() => {
              setTld('.com');
              setDomainResult(null);
              setDomainError('');
            }}
          >
            <strong className="tld-ext">.com</strong>
            <span className="tld-from">from</span>
            <span className="tld-price price-blue">₹{(domainPrices['.com']?.price || 799).toLocaleString('en-IN')}</span>
          </button>
          <button
            type="button"
            className={`domain-tld-card ${tld === '.in' ? 'active' : ''}`}
            onClick={() => {
              setTld('.in');
              setDomainResult(null);
              setDomainError('');
            }}
          >
            <strong className="tld-ext">.in</strong>
            <span className="tld-from">from</span>
            <span className="tld-price price-green">₹{(domainPrices['.in']?.price || 499).toLocaleString('en-IN')}</span>
          </button>
          <button
            type="button"
            className={`domain-tld-card ${tld === '.net' ? 'active' : ''}`}
            onClick={() => {
              setTld('.net');
              setDomainResult(null);
              setDomainError('');
            }}
          >
            <strong className="tld-ext">.net</strong>
            <span className="tld-from">from</span>
            <span className="tld-price price-blue">₹{(domainPrices['.net']?.price || 899).toLocaleString('en-IN')}</span>
          </button>
          <button
            type="button"
            className={`domain-tld-card ${tld === '.co' ? 'active' : ''}`}
            onClick={() => {
              setTld('.co');
              setDomainResult(null);
              setDomainError('');
            }}
          >
            <strong className="tld-ext">.co</strong>
            <span className="tld-from">from</span>
            <span className="tld-price price-amber">₹{(domainPrices['.co']?.price || 1299).toLocaleString('en-IN')}</span>
          </button>
        </div>
      </section>

      {/* Category Strip - Elevated Modern Service Cards */}
      <section className="category-strip" id="services">
        <a href="#domains" className="category-card">
          <span className="category-icon sky">
            <Globe2 size={24} strokeWidth={2.2} />
          </span>
          <div className="category-card-text">
            <strong>Domains</strong>
            <small>Find your name</small>
          </div>
        </a>
        <a href="#hosting" className="category-card">
          <span className="category-icon mint">
            <Zap size={24} strokeWidth={2.2} />
          </span>
          <div className="category-card-text">
            <strong>Web hosting</strong>
            <small>Fast and reliable</small>
          </div>
        </a>
        <a href="#plans" className="category-card">
          <span className="category-icon peach">
            <ShieldCheck size={24} strokeWidth={2.2} />
          </span>
          <div className="category-card-text">
            <strong>SSL certificates</strong>
            <small>Keep it secure</small>
          </div>
        </a>
        <a href="#contact" className="category-card">
          <span className="category-icon lavender">
            <Mail size={24} strokeWidth={2.2} />
          </span>
          <div className="category-card-text">
            <strong>Business email</strong>
            <small>Look professional</small>
          </div>
        </a>
      </section>

      {/* Plans Section - Screenshot-Accurate Modern Pricing Design */}
      <section className="pricing-section-container" id="hosting">
        {/* Ambient background side glows */}
        <div className="pricing-ambient-glow pricing-ambient-left" />
        <div className="pricing-ambient-glow pricing-ambient-right" />

        {/* Given UI Header Box matching Screenshot 1 */}
        <div className="hosting-plans-header-box">
          <h2 className="hosting-plans-title">Choose your web hosting plan</h2>

          <div className="hosting-plans-checklist">
            <div className="hosting-checklist-item">
              <span className="checklist-circle-check">
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span>Choose monthly or long-term</span>
            </div>
            <div className="hosting-checklist-item">
              <span className="checklist-circle-check">
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span>24/7 expert support</span>
            </div>
            <div className="hosting-checklist-item">
              <span className="checklist-circle-check">
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span>99.9% uptime guarantee</span>
            </div>
            <div className="hosting-checklist-item">
              <span className="checklist-circle-check">
                <Check size={11} strokeWidth={3.5} />
              </span>
              <span>Free migration included</span>
            </div>
          </div>

          <div className="plan-duration-section">
            <span className="plan-duration-overline">PLAN DURATION</span>
            <div className="plan-duration-toggle-bar">
              <button
                type="button"
                className={`duration-pill-btn ${selectedDuration === '1 Month' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDuration('1 Month');
                  setBuyer((b) => ({ ...b, cycle: 'Monthly' }));
                }}
              >
                1 Month
              </button>
              <button
                type="button"
                className={`duration-pill-btn ${selectedDuration === '3 Months' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDuration('3 Months');
                  setBuyer((b) => ({ ...b, cycle: 'Quarterly' }));
                }}
              >
                3 Months
              </button>
              <button
                type="button"
                className={`duration-pill-btn ${selectedDuration === '12 Months' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDuration('12 Months');
                  setBuyer((b) => ({ ...b, cycle: 'Annual' }));
                }}
              >
                12 Months
              </button>
              <button
                type="button"
                className={`duration-pill-btn ${selectedDuration === '24 Months' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDuration('24 Months');
                  setBuyer((b) => ({ ...b, cycle: '2 Years' }));
                }}
              >
                24 Months
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="pricing-cards-grid" id="plans">
          {services.map((service, index) => {
            const isFeatured = service.popular || service.name.toLowerCase().includes('business');
            const isStarter = service.name.toLowerCase().includes('starter') || index === 0;
            const planPricing = getPlanPricing(service, selectedDuration);

            if (isFeatured) {
              return (
                <article className="pricing-card-box pricing-card-featured" key={service.id}>
                  {/* Floating Most Popular Badge */}
                  <div className="pricing-popular-badge">
                    <Crown size={12} strokeWidth={2.5} />
                    <span>Most popular</span>
                  </div>

                  {/* Gradient Blue Header */}
                  <div className="pricing-featured-header">
                    <div className="pricing-card-iconbox iconbox-white">
                      <Building2 size={24} />
                    </div>
                    <div className="pricing-card-titles">
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="pricing-featured-body">
                    <div className="pricing-price-wrap">
                      <strong className="pricing-price-amount">{planPricing.priceAmount}</strong>
                      <span className="pricing-price-period">{planPricing.period}</span>
                    </div>
                    <div className="pricing-billed-note">
                      <span>{planPricing.billedText}</span>
                      {planPricing.savingsTag && (
                        <span className="pricing-savings-pill">{planPricing.savingsTag}</span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="pricing-btn-solid"
                      onClick={() => {
                        setSelectedService(service);
                        setPurchaseMessage('');
                        const cycleName = selectedDuration === '1 Month' ? 'Monthly' : selectedDuration === '3 Months' ? 'Quarterly' : selectedDuration === '12 Months' ? 'Annual' : '2 Years';
                        setBuyer((b) => ({
                          ...b,
                          name: currentUser ? currentUser.name : b.name,
                          email: currentUser ? currentUser.email : b.email,
                          cycle: cycleName
                        }));
                      }}
                    >
                      <span>{selectedService?.id === service.id ? 'Selected' : 'Choose plan'}</span>
                      <ArrowRight size={15} />
                    </button>

                    <ul className="pricing-features-list">
                      {service.features.map((feature) => (
                        <li key={feature} className="pricing-feature-item">
                          <span className="pricing-check-icon">
                            <Check size={11} strokeWidth={3} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            }

            // Standard Card (Starter or Cloud Pro)
            const cornerClass = isStarter ? 'corner-sky' : 'corner-purple';
            const iconClass = isStarter ? 'iconbox-sky' : 'iconbox-purple';
            const CardIcon = isStarter ? Rocket : Cloud;

            return (
              <article className="pricing-card-box pricing-card-standard" key={service.id}>
                {/* Decorative Top-Right Corner Accent */}
                <div className={`pricing-card-corner-shape ${cornerClass}`} />

                {/* Card Header */}
                <div className="pricing-card-header">
                  <div className={`pricing-card-iconbox ${iconClass}`}>
                    <CardIcon size={24} />
                  </div>
                  <div className="pricing-card-titles">
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="pricing-price-wrap">
                  <strong className="pricing-price-amount">{planPricing.priceAmount}</strong>
                  <span className="pricing-price-period">{planPricing.period}</span>
                </div>
                <div className="pricing-billed-note">
                  <span>{planPricing.billedText}</span>
                  {planPricing.savingsTag && (
                    <span className="pricing-savings-pill">{planPricing.savingsTag}</span>
                  )}
                </div>

                {/* Outline CTA Button */}
                <button
                  type="button"
                  className="pricing-btn-outline"
                  onClick={() => {
                    setSelectedService(service);
                    setPurchaseMessage('');
                    const cycleName = selectedDuration === '1 Month' ? 'Monthly' : selectedDuration === '3 Months' ? 'Quarterly' : selectedDuration === '12 Months' ? 'Annual' : '2 Years';
                    setBuyer((b) => ({
                      ...b,
                      name: currentUser ? currentUser.name : b.name,
                      email: currentUser ? currentUser.email : b.email,
                      cycle: cycleName
                    }));
                  }}
                >
                  <span>{selectedService?.id === service.id ? 'Selected' : 'Choose plan'}</span>
                  <ArrowRight size={15} />
                </button>

                {/* Features List */}
                <ul className="pricing-features-list">
                  {service.features.map((feature) => (
                    <li key={feature} className="pricing-feature-item">
                      <span className="pricing-check-icon">
                        <Check size={11} strokeWidth={3} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* Why DataBrain */}
      <section className="why-section" id="why-us">
        <div className="why-visual">
          <div className="why-image-wrapper">
            <img
              src={cms.why?.imageUrl || defaultCms.why?.imageUrl || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80'}
              alt={cms.why?.title || 'Why DataBrain'}
              className="why-visual-img"
            />
            <div className="why-image-glow" />
          </div>
          {(cms.why?.metricValue || cms.why?.metricLabel) && (
            <div className="metric-card">
              <strong>{cms.why?.metricValue || '+38%'}</strong>
              <span>{cms.why?.metricLabel || 'faster growth after switching'}</span>
              <ArrowRight size={14} />
            </div>
          )}
        </div>
        <div className="why-copy">
          <div className="section-overline">{cms.why?.overline || 'Built for the long run'}</div>
          <h2>
            {cms.why?.title || 'More than hosting.'}<br />
            <span>{cms.why?.subtitle || 'A partner in your progress.'}</span>
          </h2>
          <p>
            {cms.why?.description ||
              'From your first domain search to your busiest season, DataBrain gives you the infrastructure and human support to keep moving confidently.'}
          </p>
          <div className="why-list">
            <div>
              <span>
                <Zap />
              </span>
              <strong>{cms.why?.feature1Title || 'Speed without shortcuts'}</strong>
              <small>{cms.why?.feature1Description || 'NVMe storage and next-gen infrastructure keep every click feeling instant.'}</small>
            </div>
            <div>
              <span>
                <Headphones />
              </span>
              <strong>{cms.why?.feature2Title || 'People who pick up'}</strong>
              <small>{cms.why?.feature2Description || 'Get thoughtful, expert support whenever you need a second pair of eyes.'}</small>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="contact-info">
            <div className="section-overline">GET IN TOUCH</div>
            <h2>Contact us.</h2>
            <p>
              Have a question, need help, or want to talk about a project? Fill out the form and our team will create a
              support ticket for you right away.
            </p>
            <div className="contact-cards">
              <div className="contact-card">
                <span className="contact-card-icon sky">
                  <User size={18} />
                </span>
                <div>
                  <strong>Technical Support</strong>
                  <small className="val-sky">hello@databrainit.com</small>
                </div>
              </div>
              <div className="contact-card">
                <span className="contact-card-icon mint">
                  <Smartphone size={18} />
                </span>
                <div>
                  <strong>Global Call Center</strong>
                  <small className="val-mint">+91 98765 43210</small>
                </div>
              </div>
              <div className="contact-card">
                <span className="contact-card-icon peach">
                  <MessageSquare size={18} />
                </span>
                <div>
                  <strong>Instant Live Chat</strong>
                  <small className="val-peach">Available Mon–Sat, 9am–6pm IST</small>
                </div>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={submitContact}>
            <h3 className="contact-form-title">Send us a message</h3>
            <div className="contact-form-grid">
              <label>
                Full Name
                <input
                  required
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  placeholder="Your full name"
                />
              </label>
              <label>
                Email Address
                <input
                  required
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  placeholder="yourname@example.com"
                />
              </label>
              <label>
                Service Interested In
                <div className="contact-select-wrap">
                  <select
                    value={contact.service || 'Cloud Hosting'}
                    onChange={(e) => setContact({ ...contact, service: e.target.value })}
                  >
                    <option value="Cloud Hosting">Cloud Hosting</option>
                    <option value="Web Hosting">Web Hosting</option>
                    <option value="Domain Registration">Domain Registration</option>
                    <option value="SSL Certificate">SSL Certificate</option>
                    <option value="Business Email">Business Email</option>
                    <option value="VPS / Dedicated Server">VPS / Dedicated Server</option>
                    <option value="Website Migration">Website Migration</option>
                    <option value="Other">Other Query</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="select-arrow" size={16} />
                </div>
              </label>
              <label>
                Contact Number
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>
            <label className="contact-message-label">
              Your message
              <textarea
                required
                rows={4}
                value={contact.message}
                onChange={(e) => setContact({ ...contact, message: e.target.value })}
                placeholder="Tell us about your project or query..."
              />
            </label>
            {contactMessage && (
              <div className={`contact-feedback ${contactStatus}`}>
                {contactStatus === 'sent' ? <Check /> : <X />} {contactMessage}
              </div>
            )}
            <button className="contact-submit-btn" type="submit" disabled={contactStatus === 'sending'}>
              <span>{contactStatus === 'sending' ? 'Sending...' : 'Send message'}</span>
              <ChevronRight size={18} />
            </button>
          </form>
        </div>
      </section>

      {/* Latest Blog Section */}
      {homeBlogs.length > 0 && (
        <section className="plans-section" id="blog" style={{ background: '#f8fcfe', borderTop: '1px solid #e1eff4', borderBottom: '1px solid #e1eff4', padding: '64px 20px' }}>
          <div className="section-heading" style={{ marginBottom: '32px' }}>
            <div>
              <div className="section-overline">Insights & Articles</div>
              <h2>Latest from the <span>DataBrain Blog</span></h2>
              <p style={{ color: '#77929d', fontSize: '13px', margin: '6px 0 0' }}>
                Practical cloud hosting guides, speed optimizations, and security best practices.
              </p>
            </div>
            <a href="/blog" className="hero-secondary" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              View all articles <ArrowRight size={14} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '22px' }}>
            {homeBlogs.map((post) => (
              <a
                key={post.id}
                href={`/blog?id=${post.id}`}
                className="blog-admin-card"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="blog-card-media" style={{ height: '175px' }}>
                  <img src={post.coverImage} alt={post.title} />
                  <span className="blog-category-badge">{post.category}</span>
                  <span className="blog-reading-time-badge">
                    <Clock size={11} /> {post.readingTime}
                  </span>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-author-row">
                    {post.authorPic ? (
                      <img src={post.authorPic} alt={post.authorName} className="author-avatar-img" />
                    ) : (
                      <div className="author-avatar-fallback">{post.authorName.charAt(0)}</div>
                    )}
                    <div className="blog-author-meta">
                      <strong>{post.authorName}</strong>
                      <small>{post.publishedAt}</small>
                    </div>
                  </div>
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-desc">{post.shortDescription}</p>
                  <div className="blog-card-footer">
                    <span style={{ fontSize: '11px', color: '#1597d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read article <ArrowRight size={12} />
                    </span>
                    <span style={{ fontSize: '10px', color: '#8fa5ad' }}>{post.readingTime}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Category-Wise FAQ Section (Placed in footer area) */}
      <section className="faq-section" id="faq">
        <div className="faq-container">
          <div className="faq-header">
            <div className="section-overline">Questions, answered</div>
            <h2>Frequently asked questions.</h2>
            <p>Everything you need to know about our hosting platform, domain registrations, billing, and technical setup.</p>
          </div>

          <div className="faq-toolbar">
            {/* Search Input */}
            <div className="faq-search-box">
              <Search />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search questions or keywords (e.g. SSL, migration, DNS, cPanel)..."
                aria-label="Search FAQs"
              />
              {faqSearch && (
                <button
                  type="button"
                  onClick={() => setFaqSearch('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '13px', padding: 0 }}
                  aria-label="Clear search"
                >
                  <X style={{ width: 16, height: 16 }} />
                </button>
              )}
            </div>

            {/* Category Pills Bar */}
            <div className="faq-category-pills" role="tablist" aria-label="FAQ Categories">
              {faqCategories.map((category) => {
                const count = category === 'All'
                  ? faqList.length
                  : faqList.filter((f) => (f.category || 'General').toLowerCase() === category.toLowerCase()).length;
                const isActive = selectedFaqCategory.toLowerCase() === category.toLowerCase();
                return (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`faq-category-pill ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFaqCategory(category);
                      const firstMatch = category === 'All'
                        ? faqList[0]
                        : faqList.find((f) => (f.category || 'General').toLowerCase() === category.toLowerCase());
                      if (firstMatch) setOpenFaqId(firstMatch.id || firstMatch.question);
                    }}
                  >
                    <span>{category}</span>
                    <span className="faq-category-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ Items Grid */}
          <div className="faq-list-grid">
            {displayedFaqs.length > 0 ? (
              displayedFaqs.map((faq, index) => {
                const isOpen = openFaqId === (faq.id || faq.question);
                return (
                  <div
                    key={faq.id || faq.question}
                    className={`faq-item-card ${isOpen ? 'open' : ''}`}
                  >
                    <button
                      type="button"
                      className="faq-question-btn"
                      onClick={() => setOpenFaqId(isOpen ? null : (faq.id || faq.question))}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-question-left">
                        <span className="faq-q-number">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="faq-q-title">{faq.question}</span>
                        {faq.category && (
                          <span className="faq-q-category">{faq.category}</span>
                        )}
                      </div>
                      <ChevronDown className="faq-arrow-icon" />
                    </button>
                    {isOpen && (
                      <div className="faq-answer-panel">
                        <p className="faq-answer-text">{faq.answer}</p>
                        <div className="faq-answer-footer">
                          <span>Was this answer helpful? Have more questions?</span>
                          <a href="#contact" onClick={() => setContact((c) => ({ ...c, service: faq.category || 'General' }))}>
                            Contact Support Team →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="faq-empty-state">
                <HelpCircle style={{ width: 36, height: 36, color: '#94a3b8', margin: '0 auto' }} />
                <h3>No questions found</h3>
                <p>
                  {faqSearch
                    ? `No questions matched "${faqSearch}". Try searching for another term.`
                    : `No questions published in ${selectedFaqCategory} yet.`}
                </p>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => { setSelectedFaqCategory('All'); setFaqSearch(''); }}
                >
                  View All Questions
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta">
        <div>
          <div className="section-overline">Ready when you are</div>
          <h2>Bring your next idea online.</h2>
          <p>Start with a domain, a plan, or just a conversation. We will meet you there.</p>
        </div>
        <a className="hero-primary" href="#plans">
          Explore hosting plans <ArrowRight />
        </a>
      </section>

      {/* Site Footer */}
      <footer className="site-footer">
        {/* Hexagon Honeycomb Background Decors */}
        <div className="footer-hex-decor hex-top-right" aria-hidden="true">
          <svg viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.35" stroke="#0ea5e9" strokeWidth="1.2">
              <polygon points="200,20 225,5 250,20 250,50 225,65 200,50" />
              <polygon points="245,50 270,35 295,50 295,80 270,95 245,80" />
              <polygon points="155,50 180,35 205,50 205,80 180,95 155,80" />
              <polygon points="200,80 225,65 250,80 250,110 225,125 200,110" />
              <polygon points="245,110 270,95 295,110 295,140 270,155 245,140" />
              <polygon points="155,110 180,95 205,110 205,140 180,155 155,140" />
              <polygon points="200,140 225,125 250,140 250,170 225,185 200,170" />
              <polygon points="245,170 270,155 295,170 295,200 270,215 245,200" />
            </g>
          </svg>
        </div>

        <div className="footer-hex-decor hex-bottom-left" aria-hidden="true">
          <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.32" stroke="#0ea5e9" strokeWidth="1.2">
              <polygon points="20,110 45,95 70,110 70,140 45,155 20,140" />
              <polygon points="65,80 90,65 115,80 115,110 90,125 65,110" />
              <polygon points="65,140 90,125 115,140 115,170 90,185 65,170" />
              <polygon points="110,110 135,95 160,110 160,140 135,155 110,140" />
              <polygon points="110,170 135,155 160,170 160,200 135,215 110,200" />
              <polygon points="155,140 180,125 205,140 205,170 180,185 155,170" />
            </g>
          </svg>
        </div>

        <div className="site-footer-inner">
          <div className="footer-brand">
            <a className="site-logo" href="#top">
              <img src="https://databrainit.com/images/logo.png" alt="DataBrain IT Solutions" />
              <span>
                <strong>DataBrain</strong>
                <small>IT SOLUTIONS</small>
              </span>
            </a>
            <p className="footer-tagline">Infrastructure for ambitious ideas across India &amp; worldwide.</p>
          </div>

          <div className="footer-links">
            <div>
              <strong>PRODUCTS</strong>
              <a href="#hosting">Web hosting</a>
              <a href="#domains">Domains</a>
              <a href="#services">Business email</a>
              <a href="#plans">Cloud servers</a>
            </div>
            <div>
              <strong>RESOURCES</strong>
              <a href="/blog">Blog</a>
              <a href="#faq">FAQ</a>
              <a href="#why-us">Why DataBrain</a>
            </div>
            <div>
              <strong>CLIENT &amp; ADMIN</strong>
              <a href="/portal">Client Portal</a>
              <a href="/admin">Admin Console</a>
              <button
                type="button"
                className="footer-link-btn"
                onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
              >
                Client Login
              </button>
            </div>
            <div>
              <strong>CONNECT</strong>
              <a href="#contact">Contact Us</a>
              <a href="mailto:hello@databrainit.com">hello@databrainit.com</a>
              <a href={cms.social?.instagram || 'https://instagram.com/databrainit'} target="_blank" rel="noreferrer">Instagram</a>
              <a href={cms.social?.facebook || 'https://facebook.com/databrainit'} target="_blank" rel="noreferrer">Facebook</a>
              <a href={cms.social?.linkedin || 'https://linkedin.com/company/databrainit'} target="_blank" rel="noreferrer">Linkedin</a>
              <a href={cms.social?.youtube || 'https://youtube.com/@databrainit'} target="_blank" rel="noreferrer">Youtube</a>
            </div>
          </div>

          {/* Decorative Sparkle Star above bottom divider on right */}
          <div className="footer-star-sparkle" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0 C16 8.8 23.2 16 32 16 C23.2 16 16 23.2 16 32 C16 23.2 8.8 16 0 16 C8.8 16 16 8.8 16 0 Z" fill="#7ba3b8" />
            </svg>
          </div>

          <div className="footer-bottom">
            <span>© 2026 DataBrain IT Solutions. All rights reserved.</span>
            <span>Managed with DataBrain Cloud Infrastructure.</span>
          </div>
        </div>
      </footer>

      {/* Order Service Modal */}
      {selectedService && (
        <div className="customer-modal-backdrop" onClick={() => setSelectedService(null)}>
          <form
            className="customer-modal"
            onSubmit={purchaseService}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">{selectedService.name} Plan</p>
                <h2>Complete your order</h2>
                <p>Instant activation upon order placement</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setSelectedService(null)}
                aria-label="Close purchase"
              >
                <X />
              </button>
            </div>
            <label>
              Customer name
              <input
                required
                value={buyer.name}
                onChange={(event) => setBuyer({ ...buyer, name: event.target.value })}
                placeholder="Your full name"
              />
            </label>
            <label>
              Email address
              <input
                required
                type="email"
                value={buyer.email}
                onChange={(event) => setBuyer({ ...buyer, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Billing cycle
              <select
                value={buyer.cycle}
                onChange={(event) => {
                  const newCycle = event.target.value;
                  setBuyer({ ...buyer, cycle: newCycle });
                  if (newCycle === 'Monthly') setSelectedDuration('1 Month');
                  else if (newCycle === 'Quarterly') setSelectedDuration('3 Months');
                  else if (newCycle === 'Annual') setSelectedDuration('12 Months');
                  else if (newCycle === '2 Years') setSelectedDuration('24 Months');
                }}
              >
                <option value="Monthly">Monthly (1 Month - {getPlanPricing(selectedService, '1 Month').priceAmount}/mo)</option>
                <option value="Quarterly">Quarterly (3 Months - {getPlanPricing(selectedService, '3 Months').priceAmount}/mo)</option>
                <option value="Annual">Annual (12 Months - {getPlanPricing(selectedService, '12 Months').priceAmount}/mo - Save 25%)</option>
                <option value="2 Years">2 Years (24 Months - {getPlanPricing(selectedService, '24 Months').priceAmount}/mo - Save 40%)</option>
              </select>
            </label>
            <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#0369a1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block' }}>Total Payable Amount</span>
                <small style={{ fontSize: '11px', color: '#64748b' }}>{getPlanPricing(selectedService, selectedDuration).billedText}</small>
              </div>
              <strong style={{ fontSize: '18px', color: '#0284c7', fontWeight: 800 }}>
                {getPlanPricing(selectedService, selectedDuration).billedTotalFormatted}
              </strong>
            </div>
            {purchaseMessage && (
              <div className="purchase-success">
                <Check /> <span>{purchaseMessage}</span>
                <div style={{ marginTop: '8px' }}>
                  <a href="/portal" style={{ color: '#1197d4', fontWeight: 700, textDecoration: 'underline' }}>
                    Open in Client Portal &rarr;
                  </a>
                </div>
              </div>
            )}
            <div className="customer-modal-actions">
              <button type="button" className="button secondary" onClick={() => setSelectedService(null)}>
                Cancel
              </button>
              <button className="button primary">Place order <ArrowRight /></button>
            </div>
          </form>
        </div>
      )}

      {/* Client Auth Modal */}
      {authModalOpen && (
        <div className="customer-modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div
            className="customer-modal"
            style={{ width: 'min(100%, 420px)' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Client Portal Access</p>
                <h2>{authMode === 'login' ? 'Sign in to DataBrain' : 'Create an Account'}</h2>
                <p>Manage your hosting, domains, and invoices</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setAuthModalOpen(false)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f0f5f8', padding: '3px', borderRadius: '6px', marginBottom: '14px' }}>
              <button
                type="button"
                style={{
                  background: authMode === 'login' ? '#fff' : 'transparent',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '7px',
                  fontWeight: 700,
                  fontSize: '11px',
                  color: authMode === 'login' ? '#1197d4' : '#68828f',
                  cursor: 'pointer'
                }}
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                style={{
                  background: authMode === 'register' ? '#fff' : 'transparent',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '7px',
                  fontWeight: 700,
                  fontSize: '11px',
                  color: authMode === 'register' ? '#1197d4' : '#68828f',
                  cursor: 'pointer'
                }}
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
              >
                Register
              </button>
            </div>

            {authMode === 'login' && (
              <div
                style={{
                  background: '#eef8fc',
                  border: '1px solid #c9e7f4',
                  borderRadius: '6px',
                  padding: '10px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11px'
                }}
              >
                <div>
                  <strong>⚡ Demo Account:</strong>
                  <div style={{ color: '#097bb3' }}>amit@gmail.com</div>
                </div>
                <button
                  type="button"
                  style={{
                    background: '#1197d4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                  onClick={() => setLoginForm({ identifier: 'amit@gmail.com', password: 'password123' })}
                >
                  Quick Fill
                </button>
              </div>
            )}

            {authError && (
              <div className="contact-feedback error" style={{ fontSize: '11px', padding: '8px 10px', marginBottom: '12px' }}>
                <X size={14} /> {authError}
              </div>
            )}

            {authSuccess && (
              <div className="contact-feedback sent" style={{ fontSize: '11px', padding: '8px 10px', marginBottom: '12px' }}>
                <Check size={14} /> {authSuccess}
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin}>
                <label>
                  Email address or Phone
                  <input
                    required
                    type="text"
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </label>
                <div className="customer-modal-actions" style={{ marginTop: '16px' }}>
                  <button type="button" className="button secondary" onClick={() => setAuthModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="button primary" disabled={authLoading}>
                    {authLoading ? 'Signing in...' : 'Sign In'} <ArrowRight />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <label>
                  Full name
                  <input
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="e.g. Amit Sharma"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Phone number
                  <input
                    required
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    type="password"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                  />
                </label>
                <div className="customer-modal-actions" style={{ marginTop: '16px' }}>
                  <button type="button" className="button secondary" onClick={() => setAuthModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="button primary" disabled={authLoading}>
                    {authLoading ? 'Registering...' : 'Create Account'} <ArrowRight />
                  </button>
                </div>
              </form>
            )}

            <div style={{ textAlign: 'center', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #edf2f4' }}>
              <a href="/portal" style={{ fontSize: '11px', color: '#1197d4', fontWeight: 600 }}>
                Open Dedicated Client Portal Screen &rarr;
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Razorpay Checkout Modal */}
      {paymentDetails && (
        <RazorpayModal
          details={paymentDetails}
          onClose={() => setPaymentDetails(null)}
          onSuccess={async (paymentId) => {
            setPurchaseMessage(`Payment ${paymentId} completed successfully! Your subscription/domain is activated.`);
            if (paymentDetails.type === 'domain' && currentUser) {
              const token = localStorage.getItem('databrain_auth_token');
              if (token && domainResult?.domain) {
                try {
                  await fetch(`${apiUrl}/api/client/domains/register`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      domainName: domainResult.domain,
                      years: 1,
                      amount: paymentDetails.amount
                    })
                  });
                } catch {
                  // Fallback: registration already confirmed via order
                }
              }
            }
          }}
        />
      )}
    </main>
  );
}

