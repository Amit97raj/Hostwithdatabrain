'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  HardDrive,
  Headphones,
  KeyRound,
  Layers,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Trash2,
  Unlock,
  User,
  Zap
} from 'lucide-react';
import RazorpayModal, { PaymentDetails } from '../components/RazorpayModal';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type OrderItem = {
  id: string;
  date: string;
  customer: string;
  product: string;
  cycle: string;
  amount: string;
  status: string;
  serviceId?: string;
  customerEmail?: string;
};

type InvoiceItem = {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  serviceName: string;
  amount: string;
  total: string;
  status: string;
  createdAt: string;
  dueDate: string;
  company?: {
    name: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
};

type TicketItem = {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
  phone?: string;
  priority?: string;
  department?: string;
  replies?: {
    id: string;
    sender: string;
    role: string;
    message: string;
    createdAt: string;
  }[];
};

type DnsRecord = {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: string;
  priority?: string;
};

type DomainItem = {
  id: string;
  name: string;
  customer: string;
  customerEmail: string;
  registeredDate: string;
  expiryDate: string;
  status: string;
  autoRenew: boolean;
  privacyProtection: boolean;
  locked: boolean;
  authCode: string;
  nameservers: string[];
  dnsRecords: DnsRecord[];
};

type ClientOverview = {
  user: UserProfile;
  stats: {
    totalServices: number;
    activeServices: number;
    totalInvoices: number;
    unpaidInvoices: number;
    openTickets: number;
    uptime: string;
    serverLocation: string;
  };
  orders: OrderItem[];
  invoices: InvoiceItem[];
  tickets: TicketItem[];
};

export default function ClientPortal() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ClientOverview | null>(null);
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [activeTab, setActiveTab] = useState<'services' | 'domains' | 'invoices' | 'tickets' | 'security'>('services');

  // Auth form states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ identifier: 'amit@gmail.com', password: 'password123' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '' });

  // Modal states
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ service: 'Web Hosting', message: '', priority: 'Normal' });
  const [invoiceModalItem, setInvoiceModalItem] = useState<InvoiceItem | null>(null);
  const [cpanelModalItem, setCpanelModalItem] = useState<OrderItem | null>(null);

  // Razorpay payment modal
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

  // Domain Modals
  const [dnsModalDomain, setDnsModalDomain] = useState<DomainItem | null>(null);
  const [newDnsRecord, setNewDnsRecord] = useState({ type: 'A', name: '@', value: '', ttl: '3600', priority: '10' });
  const [nsModalDomain, setNsModalDomain] = useState<DomainItem | null>(null);
  const [nsValues, setNsValues] = useState<string[]>(['ns1.databrainhost.com', 'ns2.databrainhost.com']);
  const [authCodeDomain, setAuthCodeDomain] = useState<DomainItem | null>(null);
  const [registerDomainModal, setRegisterDomainModal] = useState(false);
  const [domainSearchInput, setDomainSearchInput] = useState('');
  const [domainSearchResult, setDomainSearchResult] = useState<{ domain: string; available: boolean; price: string } | null>(null);
  const [domainSearching, setDomainSearching] = useState(false);

  // Profile edit states
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [selectedClientTicket, setSelectedClientTicket] = useState<TicketItem | null>(null);
  const [clientReplyText, setClientReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [toast, setToast] = useState('');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  useEffect(() => {
    const savedToken = localStorage.getItem('databrain_auth_token');
    if (savedToken) {
      setToken(savedToken);
      loadClientData(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3200);
  }

  async function loadClientData(authToken: string) {
    setLoading(true);
    try {
      const [overviewRes, domainsRes] = await Promise.all([
        fetch(`${apiUrl}/api/client/overview`, {
          headers: { Authorization: `Bearer ${authToken}` }
        }),
        fetch(`${apiUrl}/api/client/domains`, {
          headers: { Authorization: `Bearer ${authToken}` }
        })
      ]);

      if (overviewRes.ok) {
        const overview: ClientOverview = await overviewRes.json();
        setData(overview);
        setUser(overview.user);
        setProfileForm({ name: overview.user.name, phone: overview.user.phone || '' });
      } else {
        localStorage.removeItem('databrain_auth_token');
        setToken(null);
        setUser(null);
      }

      if (domainsRes.ok) {
        const doms: DomainItem[] = await domainsRes.json();
        setDomains(doms);
      }
    } catch {
      notify('Unable to connect to server');
    }
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const result = await res.json();
      if (res.ok && result.token) {
        localStorage.setItem('databrain_auth_token', result.token);
        setToken(result.token);
        setUser(result.user);
        loadClientData(result.token);
        notify(`Welcome back, ${result.user.name}!`);
      } else {
        setAuthError(result.message || 'Invalid email or password.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    }
    setAuthLoading(false);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });
      const result = await res.json();
      if (res.ok && result.token) {
        localStorage.setItem('databrain_auth_token', result.token);
        setToken(result.token);
        setUser(result.user);
        loadClientData(result.token);
        notify(`Account created! Welcome, ${result.user.name}`);
      } else {
        setAuthError(result.message || 'Registration failed.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    }
    setAuthLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem('databrain_auth_token');
    setToken(null);
    setUser(null);
    setData(null);
    setDomains([]);
    notify('You have been logged out.');
  }

  async function handleCreateTicket(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ticketForm)
      });
      if (res.ok) {
        const result = await res.json();
        setTicketModalOpen(false);
        setTicketForm({ service: 'Web Hosting', message: '', priority: 'Normal' });
        notify(`Ticket ${result.ticket.id} opened successfully!`);
        loadClientData(token);
      } else {
        notify('Could not create ticket.');
      }
    } catch {
      notify('Network error creating ticket.');
    }
  }

  async function handleAddDnsRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !dnsModalDomain) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/domains/${dnsModalDomain.id}/dns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newDnsRecord)
      });
      if (res.ok) {
        const result = await res.json();
        setDnsModalDomain(result.domain);
        setNewDnsRecord({ type: 'A', name: '@', value: '', ttl: '3600', priority: '10' });
        notify(`DNS record added to ${dnsModalDomain.name}`);
        loadClientData(token);
      }
    } catch {
      notify('Failed to add DNS record');
    }
  }

  async function handleDeleteDnsRecord(domainId: string, recordId: string) {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/domains/${domainId}/dns/${recordId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setDnsModalDomain(result.domain);
        notify('DNS record removed');
        loadClientData(token);
      }
    } catch {
      notify('Failed to delete DNS record');
    }
  }

  async function handleSaveNameservers(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !nsModalDomain) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/domains/${nsModalDomain.id}/nameservers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nameservers: nsValues })
      });
      if (res.ok) {
        setNsModalDomain(null);
        notify(`Nameservers updated for ${nsModalDomain.name}`);
        loadClientData(token);
      }
    } catch {
      notify('Failed to update nameservers');
    }
  }

  async function handleToggleLock(domain: DomainItem) {
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/domains/${domain.id}/toggle-lock`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        notify(`Domain ${domain.name} is now ${result.locked ? 'Locked' : 'Unlocked'}`);
        loadClientData(token);
      }
    } catch {
      notify('Failed to toggle lock status');
    }
  }

  async function handleCheckDomainPortal(e: React.FormEvent) {
    e.preventDefault();
    const query = domainSearchInput.trim().toLowerCase();
    if (!query) return;
    setDomainSearching(true);
    setDomainSearchResult(null);
    try {
      const res = await fetch(`${apiUrl}/api/domain-check?domain=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setDomainSearchResult({
          domain: query.includes('.') ? query : `${query}.com`,
          available: Boolean(data.result?.available),
          price: '₹799'
        });
      } else {
        setDomainSearchResult({ domain: query, available: true, price: '₹799' });
      }
    } catch {
      setDomainSearchResult({ domain: query, available: true, price: '₹799' });
    }
    setDomainSearching(false);
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    try {
      const res = await fetch(`${apiUrl}/api/client/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      if (res.ok) {
        notify('Profile updated successfully!');
        loadClientData(token);
      }
    } catch {
      notify('Failed to update profile.');
    }
  }

  async function sendClientReply() {
    if (!selectedClientTicket || !clientReplyText.trim() || !token) return;
    setReplyLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/client/tickets/${selectedClientTicket.id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: clientReplyText })
      });
      if (res.ok) {
        const result = await res.json();
        setSelectedClientTicket(result.ticket);
        setClientReplyText('');
        loadClientData(token);
        notify('Reply sent successfully to support engineer!');
      } else {
        notify('Failed to send reply');
      }
    } catch {
      notify('Network error sending reply');
    }
    setReplyLoading(false);
  }

  // 1. Unauthenticated view (Login / Register)
  if (!token || !user) {
    return (
      <div className="portal-shell">
        <header className="portal-header">
          <div className="portal-brand">
            <a href="/" className="portal-brand">
              <img src="https://databrainit.com/images/logo.png" alt="DataBrain logo" />
              <div>
                <strong>DataBrain</strong>
                <small>Client Portal</small>
              </div>
            </a>
          </div>
          <div className="portal-header-right">
            <a href="/" className="portal-back-link">
              <ArrowLeft size={14} /> Back to Website
            </a>
          </div>
        </header>

        <div className="portal-auth-container">
          <div className="portal-auth-card">
            <div className="portal-auth-header">
              <span className="portal-badge-status">
                <span className="pulse-dot" /> Secure 256-Bit SSL
              </span>
              <h1>{authMode === 'login' ? 'Sign in to Client Portal' : 'Create Client Account'}</h1>
              <p>Manage your hosting infrastructure, domains, and support</p>
            </div>

            <div className="portal-auth-tabs">
              <button
                type="button"
                className={`portal-auth-tab ${authMode === 'login' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('login');
                  setAuthError('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`portal-auth-tab ${authMode === 'register' ? 'active' : ''}`}
                onClick={() => {
                  setAuthMode('register');
                  setAuthError('');
                }}
              >
                Create Account
              </button>
            </div>

            {authMode === 'login' && (
              <div className="portal-demo-callout">
                <div>
                  <strong>⚡ Demo Quick-Fill:</strong>
                  <p>amit@gmail.com / password123</p>
                </div>
                <button
                  type="button"
                  className="portal-btn-demo"
                  onClick={() => setLoginForm({ identifier: 'amit@gmail.com', password: 'password123' })}
                >
                  Apply Demo
                </button>
              </div>
            )}

            {authError && (
              <div className="portal-error-banner">
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleLogin}>
                <div className="portal-form-group">
                  <label htmlFor="login-email">Email Address or Phone</label>
                  <div className="portal-input-wrap">
                    <Mail />
                    <input
                      id="login-email"
                      type="text"
                      required
                      placeholder="you@example.com"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="login-password">Password</label>
                  <div className="portal-input-wrap">
                    <Lock />
                    <input
                      id="login-password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="portal-btn-primary" disabled={authLoading}>
                  {authLoading ? 'Signing in...' : 'Sign In to Portal'} <ArrowRight size={15} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="portal-form-group">
                  <label htmlFor="reg-name">Full Name</label>
                  <div className="portal-input-wrap">
                    <User />
                    <input
                      id="reg-name"
                      type="text"
                      required
                      placeholder="e.g. Amit Sharma"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="reg-email">Email Address</label>
                  <div className="portal-input-wrap">
                    <Mail />
                    <input
                      id="reg-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="reg-phone">Phone Number</label>
                  <div className="portal-input-wrap">
                    <Globe2 />
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="reg-password">Password</label>
                  <div className="portal-input-wrap">
                    <Lock />
                    <input
                      id="reg-password"
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="portal-btn-primary" disabled={authLoading}>
                  {authLoading ? 'Creating account...' : 'Complete Registration'} <ArrowRight size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {toast && (
          <div className="portal-toast">
            <CheckCircle2 size={16} /> <span>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. Authenticated Dashboard view
  return (
    <div className="portal-shell">
      {/* Top Navigation */}
      <header className="portal-header">
        <div className="portal-header-left">
          <a href="/" className="portal-brand">
            <img src="https://databrainit.com/images/logo.png" alt="DataBrain logo" />
            <div>
              <strong>DataBrain</strong>
              <small>Client Portal</small>
            </div>
          </a>
          <span className="portal-badge-status">
            <span className="pulse-dot" /> Live SLA: 99.99% Uptime
          </span>
        </div>

        <div className="portal-header-right">
          <button
            type="button"
            className="portal-back-link"
            onClick={() => setRegisterDomainModal(true)}
          >
            <Globe2 size={14} /> Register Domain
          </button>
          <a href="/#plans" className="portal-back-link">
            <Plus size={14} /> Order Hosting
          </a>
          <a href="/" className="portal-back-link">
            Main Site <ArrowRight size={14} />
          </a>

          <div className="portal-user-chip">
            <div className="portal-avatar">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'CU'}
            </div>
            <div className="portal-user-meta">
              <span className="portal-user-name">{user.name}</span>
              <span className="portal-user-email">{user.email}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-signout"
            onClick={handleLogout}
            title="Sign out of portal"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="portal-main">
        {/* Hero Banner */}
        <section className="portal-hero">
          <div className="portal-hero-copy">
            <h1>Welcome back, {user.name} 👋</h1>
            <p>
              Account ID: <strong>{user.id}</strong> · Cloud Datacenter: <strong>Mumbai (BOM-01)</strong> · Razorpay Verified Client
            </p>
          </div>
          <div className="portal-hero-actions">
            <button
              type="button"
              className="portal-btn-white"
              onClick={() => setTicketModalOpen(true)}
            >
              <Headphones size={14} /> Open Support Ticket
            </button>
            <button
              type="button"
              className="portal-btn-ghost"
              onClick={() => setRegisterDomainModal(true)}
            >
              <Globe2 size={14} /> Search New Domain
            </button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="portal-stats-grid">
          <article className="portal-stat-card">
            <div className="portal-stat-icon cyan">
              <Server size={22} />
            </div>
            <div className="portal-stat-info">
              <small>Active Hosting</small>
              <strong>{data?.stats.activeServices ?? 0} Plans</strong>
              <span>NVMe Storage & Free SSL</span>
            </div>
          </article>

          <article className="portal-stat-card">
            <div className="portal-stat-icon purple">
              <Globe2 size={22} />
            </div>
            <div className="portal-stat-info">
              <small>Registered Domains</small>
              <strong>{domains.length} Domains</strong>
              <span>DNS Zone Editor Active</span>
            </div>
          </article>

          <article className="portal-stat-card">
            <div className="portal-stat-icon emerald">
              <FileText size={22} />
            </div>
            <div className="portal-stat-info">
              <small>Invoices & Billing</small>
              <strong>{data?.stats.totalInvoices ?? 0} Invoices</strong>
              <span>
                {data?.stats.unpaidInvoices === 0
                  ? 'All invoices paid'
                  : `${data?.stats.unpaidInvoices} pending payment`}
              </span>
            </div>
          </article>

          <article className="portal-stat-card">
            <div className="portal-stat-icon amber">
              <Headphones size={22} />
            </div>
            <div className="portal-stat-info">
              <small>Support Tickets</small>
              <strong>{data?.stats.openTickets ?? 0} Open</strong>
              <span>Avg. response &lt; 15 mins</span>
            </div>
          </article>
        </section>

        {/* Navigation Tabs */}
        <nav className="portal-nav-bar" aria-label="Portal sections">
          <button
            type="button"
            className={`portal-nav-tab ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <Server size={16} /> My Hosting & Services
            <span className="portal-tab-count">{data?.orders.length ?? 0}</span>
          </button>
          <button
            type="button"
            className={`portal-nav-tab ${activeTab === 'domains' ? 'active' : ''}`}
            onClick={() => setActiveTab('domains')}
          >
            <Globe2 size={16} /> Domains & DNS
            <span className="portal-tab-count">{domains.length}</span>
          </button>
          <button
            type="button"
            className={`portal-nav-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <FileText size={16} /> Invoices & Billing
            <span className="portal-tab-count">{data?.invoices.length ?? 0}</span>
          </button>
          <button
            type="button"
            className={`portal-nav-tab ${activeTab === 'tickets' ? 'active' : ''}`}
            onClick={() => setActiveTab('tickets')}
          >
            <Headphones size={16} /> Support Tickets
            <span className="portal-tab-count">{data?.tickets.length ?? 0}</span>
          </button>
          <button
            type="button"
            className={`portal-nav-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={16} /> Account & Security
          </button>
        </nav>

        {/* Tab 1: Services */}
        {activeTab === 'services' && (
          <div>
            <div className="portal-section-header">
              <div>
                <h2>Active Services & Cloud Subscriptions</h2>
                <p>Manage your web servers, domain connections, and resource allocations</p>
              </div>
              <a href="/#plans" className="portal-btn-sm primary">
                <Plus size={14} /> Add Service
              </a>
            </div>

            {!data?.orders || data.orders.length === 0 ? (
              <div className="portal-card portal-empty">
                <Server />
                <h3>No hosting services active yet</h3>
                <p>You haven’t ordered any hosting plans or servers yet.</p>
                <a href="/#plans" className="portal-btn-sm primary">
                  Browse Hosting Plans <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <div className="portal-services-list">
                {data.orders.map((order, idx) => (
                  <article key={order.id} className="portal-service-card">
                    <div className="portal-service-main">
                      <div className="portal-service-info">
                        <div className="portal-service-icon">
                          <Server size={24} />
                        </div>
                        <div className="portal-service-details">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3>{order.product} Hosting</h3>
                            <span className="portal-badge-active">
                              <Check size={11} /> {order.status}
                            </span>
                          </div>
                          <p>
                            <span>Order #{order.id}</span> · <span>Cycle: {order.cycle}</span> · <span>Ordered on: {order.date}</span>
                          </p>
                        </div>
                      </div>
                      <div className="portal-service-price">
                        <strong>{order.amount}</strong>
                        <span>/{order.cycle.toLowerCase()}</span>
                      </div>
                    </div>

                    <div className="portal-service-metrics">
                      <div className="portal-metric-item">
                        <small>Disk Usage (NVMe)</small>
                        <strong>{(2.4 + idx * 1.5).toFixed(1)} GB / 20 GB</strong>
                        <div className="portal-progress-bar">
                          <div
                            className="portal-progress-fill"
                            style={{ width: `${Math.min(100, (2.4 + idx * 1.5) * 5)}%` }}
                          />
                        </div>
                      </div>

                      <div className="portal-metric-item">
                        <small>Monthly Bandwidth</small>
                        <strong>{(14.2 + idx * 8).toFixed(1)} GB / 500 GB</strong>
                        <div className="portal-progress-bar">
                          <div
                            className="portal-progress-fill"
                            style={{ width: `${Math.min(100, (14.2 + idx * 8) / 5)}%`, background: '#10b981' }}
                          />
                        </div>
                      </div>

                      <div className="portal-metric-item">
                        <small>SSL Certificate</small>
                        <strong style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={14} /> Active & Secured
                        </strong>
                        <span style={{ fontSize: '10px', color: '#8da4ae' }}>Auto-renews via Let’s Encrypt</span>
                      </div>

                      <div className="portal-metric-item">
                        <small>Server Region</small>
                        <strong>Mumbai (BOM-01)</strong>
                        <span style={{ fontSize: '10px', color: '#8da4ae' }}>Ultra low latency &lt; 25ms</span>
                      </div>
                    </div>

                    <div className="portal-service-footer">
                      <div className="portal-server-info">
                        <span>
                          Server IP: <code>185.199.{100 + idx * 4}.{12 + idx}</code>
                        </span>
                        <span>
                          Nameservers: <code>ns1.databrainhost.com</code>
                        </span>
                      </div>

                      <div className="portal-service-actions">
                        <button
                          type="button"
                          className="portal-btn-sm"
                          onClick={() => setCpanelModalItem(order)}
                        >
                          <Terminal size={14} /> Control Panel
                        </button>
                        <button
                          type="button"
                          className="portal-btn-sm primary"
                          onClick={() =>
                            setPaymentDetails({
                              title: 'Subscription Renewal',
                              subtitle: `Renew ${order.product} (${order.cycle})`,
                              amount: order.amount,
                              targetId: order.id,
                              type: 'service',
                              customerName: user.name,
                              customerEmail: user.email
                            })
                          }
                        >
                          <RefreshCw size={14} /> Renew with Razorpay
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Domains & DNS */}
        {activeTab === 'domains' && (
          <div>
            <div className="portal-section-header">
              <div>
                <h2>Domains & DNS Management</h2>
                <p>Manage authoritative DNS records, nameserver propagation, and transfer locks</p>
              </div>
              <button
                type="button"
                className="portal-btn-sm primary"
                onClick={() => setRegisterDomainModal(true)}
              >
                <Plus size={14} /> Register New Domain
              </button>
            </div>

            {domains.length === 0 ? (
              <div className="portal-card portal-empty">
                <Globe2 />
                <h3>No domains registered yet</h3>
                <p>Search and register your dream domain with instant DNS setup.</p>
                <button
                  type="button"
                  className="portal-btn-sm primary"
                  onClick={() => setRegisterDomainModal(true)}
                >
                  Find a Domain <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <div className="portal-services-list">
                {domains.map((dom) => (
                  <article key={dom.id} className="portal-domain-card">
                    <div className="portal-domain-main">
                      <div className="portal-domain-info">
                        <div className="portal-domain-icon">
                          <Globe2 size={24} />
                        </div>
                        <div>
                          <div className="portal-domain-title">
                            <h3>{dom.name}</h3>
                            <span className="portal-badge-active">
                              <Check size={11} /> {dom.status}
                            </span>
                            {dom.locked && (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontSize: '10px',
                                  background: '#f1f5f9',
                                  color: '#475569',
                                  padding: '2px 7px',
                                  borderRadius: '4px',
                                  fontWeight: 600
                                }}
                              >
                                <Lock size={10} /> Transfer Lock
                              </span>
                            )}
                          </div>
                          <div className="portal-domain-meta">
                            <span>Domain ID: {dom.id}</span> ·
                            <span>Expires: {dom.expiryDate}</span> ·
                            <span style={{ color: '#059669', fontWeight: 600 }}>Privacy Protection Active</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ fontSize: '14px', color: '#0b3447', display: 'block' }}>
                          Auto-Renew: {dom.autoRenew ? 'Enabled' : 'Disabled'}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#7993a0' }}>
                          Renews at ₹799/yr
                        </span>
                      </div>
                    </div>

                    <div className="portal-service-footer">
                      <div className="portal-server-info">
                        <span>
                          Nameserver 1: <code>{dom.nameservers[0] || 'ns1.databrainhost.com'}</code>
                        </span>
                        <span>
                          Records: <strong>{dom.dnsRecords?.length || 0} DNS entries</strong>
                        </span>
                      </div>

                      <div className="portal-service-actions">
                        <button
                          type="button"
                          className="portal-btn-sm primary"
                          onClick={() => setDnsModalDomain(dom)}
                        >
                          <Layers size={14} /> DNS Zone Editor
                        </button>
                        <button
                          type="button"
                          className="portal-btn-sm"
                          onClick={() => {
                            setNsModalDomain(dom);
                            setNsValues(dom.nameservers || ['ns1.databrainhost.com', 'ns2.databrainhost.com']);
                          }}
                        >
                          Nameservers
                        </button>
                        <button
                          type="button"
                          className="portal-btn-sm"
                          onClick={() => handleToggleLock(dom)}
                          title={dom.locked ? 'Unlock domain for transfer' : 'Lock domain for security'}
                        >
                          {dom.locked ? <Unlock size={14} /> : <Lock size={14} />} {dom.locked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                          type="button"
                          className="portal-btn-sm"
                          onClick={() => setAuthCodeDomain(dom)}
                        >
                          <KeyRound size={14} /> Auth Code
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Invoices */}
        {activeTab === 'invoices' && (
          <div>
            <div className="portal-section-header">
              <div>
                <h2>Invoices & Billing Statements</h2>
                <p>Review payment receipts, download tax invoices, and pay pending balances</p>
              </div>
            </div>

            {!data?.invoices || data.invoices.length === 0 ? (
              <div className="portal-card portal-empty">
                <FileText />
                <h3>No invoices generated yet</h3>
                <p>Invoices are automatically created whenever you order or renew a service.</p>
              </div>
            ) : (
              <div className="portal-card">
                <div className="portal-table-wrap">
                  <table className="portal-table">
                    <thead>
                      <tr>
                        <th>Invoice #</th>
                        <th>Service Plan</th>
                        <th>Created Date</th>
                        <th>Due Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td>
                            <strong>{inv.id}</strong>
                          </td>
                          <td>{inv.serviceName}</td>
                          <td>
                            {new Date(inv.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            {new Date(inv.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            })}
                          </td>
                          <td>
                            <strong>{inv.amount}</strong>
                          </td>
                          <td>
                            <span className={inv.status === 'Paid' ? 'portal-badge-active' : 'portal-badge-pending'}>
                              {inv.status === 'Paid' ? <Check size={11} /> : <Clock size={11} />} {inv.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="portal-btn-sm"
                                onClick={() => setInvoiceModalItem(inv)}
                              >
                                View Invoice
                              </button>
                              {inv.status !== 'Paid' && (
                                <button
                                  type="button"
                                  className="portal-btn-sm primary"
                                  onClick={() =>
                                    setPaymentDetails({
                                      title: 'Invoice Payment',
                                      subtitle: `Tax Invoice ${inv.id} (${inv.serviceName})`,
                                      amount: inv.amount,
                                      targetId: inv.id,
                                      type: 'invoice',
                                      customerName: user.name,
                                      customerEmail: user.email
                                    })
                                  }
                                >
                                  Pay via Razorpay
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tickets */}
        {activeTab === 'tickets' && (
          <div>
            <div className="portal-section-header">
              <div>
                <h2>Customer Support Tickets</h2>
                <p>Direct assistance from DataBrain server engineers and domain specialists</p>
              </div>
              <button
                type="button"
                className="portal-btn-sm primary"
                onClick={() => setTicketModalOpen(true)}
              >
                <Plus size={14} /> Open New Ticket
              </button>
            </div>

            {!data?.tickets || data.tickets.length === 0 ? (
              <div className="portal-card portal-empty">
                <Headphones />
                <h3>No support tickets</h3>
                <p>Have questions about DNS, server setup, or billing? Our team is always here.</p>
                <button
                  type="button"
                  className="portal-btn-sm primary"
                  onClick={() => setTicketModalOpen(true)}
                >
                  <Plus size={14} /> Create Support Ticket
                </button>
              </div>
            ) : (
              <div className="portal-tickets-list">
                {data.tickets.map((ticket) => (
                  <article key={ticket.id} className="portal-ticket-item">
                    <div className="portal-ticket-left">
                      <div className="portal-ticket-icon">
                        <Headphones size={20} />
                      </div>
                      <div className="portal-ticket-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <h4>{ticket.service}</h4>
                          <span className={
                            ticket.status === 'Resolved' ? 'portal-badge-resolved' :
                            ticket.status === 'Pending' ? 'portal-badge-pending' :
                            ticket.status === 'Closed' ? 'portal-badge-closed' :
                            'portal-badge-open'
                          }>
                            {ticket.status === 'Resolved' ? '✓ Resolved' :
                             ticket.status === 'Pending' ? '⏱ Pending' :
                             ticket.status === 'Closed' ? '✕ Closed' :
                             '● Open'}
                          </span>
                        </div>
                        <p>{ticket.message}</p>
                        <div className="portal-ticket-meta">
                          <span>
                            Ticket ID: <strong>{ticket.id}</strong>
                          </span>
                          <span>Opened: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                          {ticket.phone && <span>Phone: {ticket.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="portal-btn-sm"
                      onClick={() => setSelectedClientTicket(ticket)}
                    >
                      View Thread
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Security & Account */}
        {activeTab === 'security' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="portal-card" style={{ padding: '24px' }}>
              <div className="portal-section-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2>Profile Details</h2>
                  <p>Update your billing contact information</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile}>
                <div className="portal-form-group">
                  <label htmlFor="prof-name">Full Name</label>
                  <div className="portal-input-wrap">
                    <User />
                    <input
                      id="prof-name"
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="prof-email">Email Address (Read-only)</label>
                  <div className="portal-input-wrap">
                    <Mail />
                    <input
                      id="prof-email"
                      type="email"
                      disabled
                      value={user.email}
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="prof-phone">Phone Number</label>
                  <div className="portal-input-wrap">
                    <Globe2 />
                    <input
                      id="prof-phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <button type="submit" className="portal-btn-primary" style={{ width: 'auto' }}>
                  Save Profile Changes
                </button>
              </form>
            </div>

            <div className="portal-card" style={{ padding: '24px' }}>
              <div className="portal-section-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2>Security & Credentials</h2>
                  <p>Manage authentication and access protections</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div
                  style={{
                    padding: '14px',
                    border: '1px solid #e1ecf0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#0b3447' }}>
                      Two-Factor Authentication (2FA)
                    </strong>
                    <span style={{ fontSize: '11px', color: '#728c98' }}>
                      Protect your account with OTP authenticator
                    </span>
                  </div>
                  <button
                    type="button"
                    className="portal-btn-sm"
                    onClick={() => notify('2FA setup wizard opened')}
                  >
                    Enable 2FA
                  </button>
                </div>

                <div
                  style={{
                    padding: '14px',
                    border: '1px solid #e1ecf0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#0b3447' }}>Change Password</strong>
                    <span style={{ fontSize: '11px', color: '#728c98' }}>
                      Regularly updating your password keeps servers safe
                    </span>
                  </div>
                  <button
                    type="button"
                    className="portal-btn-sm"
                    onClick={() => notify('Password reset link sent to your email')}
                  >
                    Update
                  </button>
                </div>

                <div
                  style={{
                    padding: '14px',
                    border: '1px solid #e1ecf0',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '13px', display: 'block', color: '#0b3447' }}>Active Sessions</strong>
                    <span style={{ fontSize: '11px', color: '#728c98' }}>Current browser session (Active now)</span>
                  </div>
                  <span className="portal-badge-active" style={{ fontSize: '11px' }}>
                    Current
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Razorpay Checkout Modal */}
      {paymentDetails && (
        <RazorpayModal
          details={paymentDetails}
          onClose={() => setPaymentDetails(null)}
          onSuccess={(paymentId) => {
            notify(`Payment ${paymentId} completed successfully!`);
            if (token) loadClientData(token);
          }}
        />
      )}

      {/* Modal: DNS Zone Editor */}
      {dnsModalDomain && (
        <div className="portal-modal-backdrop" onClick={() => setDnsModalDomain(null)}>
          <div
            className="portal-modal"
            style={{ width: 'min(100%, 720px)' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>DNS Zone Editor · {dnsModalDomain.name}</h3>
                <p>Manage authoritative records for pointing websites, subdomains, and mail servers</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setDnsModalDomain(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              {/* Add Record Form */}
              <form
                onSubmit={handleAddDnsRecord}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e1ecf0',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '18px'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '12px', color: '#0b3447', marginBottom: '10px' }}>
                  + Add New Record
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1.5fr 80px auto', gap: '8px', alignItems: 'end' }}>
                  <div>
                    <label style={{ fontSize: '10px', display: 'block', color: '#688492', fontWeight: 600 }}>TYPE</label>
                    <select
                      value={newDnsRecord.type}
                      onChange={(e) => setNewDnsRecord({ ...newDnsRecord, type: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #dce8ee', fontSize: '12px' }}
                    >
                      <option value="A">A</option>
                      <option value="CNAME">CNAME</option>
                      <option value="MX">MX</option>
                      <option value="TXT">TXT</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', display: 'block', color: '#688492', fontWeight: 600 }}>NAME</label>
                    <input
                      required
                      placeholder="@ or sub"
                      value={newDnsRecord.name}
                      onChange={(e) => setNewDnsRecord({ ...newDnsRecord, name: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #dce8ee', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', display: 'block', color: '#688492', fontWeight: 600 }}>VALUE / TARGET</label>
                    <input
                      required
                      placeholder="IP or hostname"
                      value={newDnsRecord.value}
                      onChange={(e) => setNewDnsRecord({ ...newDnsRecord, value: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #dce8ee', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', display: 'block', color: '#688492', fontWeight: 600 }}>TTL</label>
                    <input
                      value={newDnsRecord.ttl}
                      onChange={(e) => setNewDnsRecord({ ...newDnsRecord, ttl: e.target.value })}
                      style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #dce8ee', fontSize: '12px' }}
                    />
                  </div>
                  <button type="submit" className="portal-btn-sm primary" style={{ height: '35px' }}>
                    Save
                  </button>
                </div>
              </form>

              {/* Existing Records */}
              <div style={{ overflowX: 'auto' }}>
                <table className="portal-dns-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Host / Name</th>
                      <th>Target Value</th>
                      <th>TTL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dnsModalDomain.dnsRecords || []).map((rec) => (
                      <tr key={rec.id}>
                        <td>
                          <span className={`portal-dns-record-badge ${rec.type.toLowerCase()}`}>{rec.type}</span>
                        </td>
                        <td>
                          <code>{rec.name}</code>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{rec.value}</span>
                        </td>
                        <td>{rec.ttl}s</td>
                        <td>
                          <button
                            type="button"
                            className="portal-btn-icon-danger"
                            onClick={() => handleDeleteDnsRecord(dnsModalDomain.id, rec.id)}
                            title="Delete DNS record"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button type="button" className="portal-btn-sm" onClick={() => setDnsModalDomain(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Nameservers */}
      {nsModalDomain && (
        <div className="portal-modal-backdrop" onClick={() => setNsModalDomain(null)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>Nameserver Configuration</h3>
                <p>{nsModalDomain.name}</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setNsModalDomain(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNameservers}>
              <div className="portal-modal-body">
                <div style={{ marginBottom: '14px', display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="portal-btn-sm"
                    onClick={() => setNsValues(['ns1.databrainhost.com', 'ns2.databrainhost.com'])}
                  >
                    Use DataBrain Default
                  </button>
                </div>

                <div className="portal-form-group">
                  <label>Primary Nameserver</label>
                  <input
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dce8ee' }}
                    value={nsValues[0] || ''}
                    onChange={(e) => {
                      const updated = [...nsValues];
                      updated[0] = e.target.value;
                      setNsValues(updated);
                    }}
                  />
                </div>

                <div className="portal-form-group">
                  <label>Secondary Nameserver</label>
                  <input
                    required
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #dce8ee' }}
                    value={nsValues[1] || ''}
                    onChange={(e) => {
                      const updated = [...nsValues];
                      updated[1] = e.target.value;
                      setNsValues(updated);
                    }}
                  />
                </div>
              </div>

              <div className="portal-modal-footer">
                <button type="button" className="portal-btn-sm" onClick={() => setNsModalDomain(null)}>
                  Cancel
                </button>
                <button type="submit" className="portal-btn-sm primary">
                  Save Nameservers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Auth/EPP Code */}
      {authCodeDomain && (
        <div className="portal-modal-backdrop" onClick={() => setAuthCodeDomain(null)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>Authorization / EPP Code</h3>
                <p>{authCodeDomain.name}</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setAuthCodeDomain(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <p style={{ fontSize: '12px', color: '#688492' }}>
                This authorization code is required if you wish to transfer this domain to another registrar:
              </p>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '18px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: '#0b3447',
                  margin: '14px 0'
                }}
              >
                {authCodeDomain.authCode}
              </div>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                Keep this code confidential to protect against unauthorized transfers.
              </p>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn-sm"
                onClick={() => {
                  navigator.clipboard.writeText(authCodeDomain.authCode);
                  notify('Auth code copied to clipboard!');
                }}
              >
                Copy Code
              </button>
              <button type="button" className="portal-btn-sm primary" onClick={() => setAuthCodeDomain(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register New Domain */}
      {registerDomainModal && (
        <div className="portal-modal-backdrop" onClick={() => setRegisterDomainModal(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>Register a New Domain</h3>
                <p>Instant activation & automatic DNS setup on DataBrain nameservers</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setRegisterDomainModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <form onSubmit={handleCheckDomainPortal} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                  required
                  placeholder="e.g. mynewbrand.com"
                  value={domainSearchInput}
                  onChange={(e) => setDomainSearchInput(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', border: '1px solid #dce8ee', borderRadius: '6px', fontSize: '13px' }}
                />
                <button type="submit" className="portal-btn-sm primary" disabled={domainSearching}>
                  {domainSearching ? 'Checking...' : 'Check'}
                </button>
              </form>

              {domainSearchResult && (
                <div
                  style={{
                    background: domainSearchResult.available ? '#def7ee' : '#fef2f2',
                    border: `1px solid ${domainSearchResult.available ? '#b2ecd1' : '#fecaca'}`,
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <strong style={{ color: domainSearchResult.available ? '#065f46' : '#991b1b', fontSize: '14px' }}>
                      {domainSearchResult.domain}
                    </strong>
                    <div style={{ fontSize: '11px', color: '#688492', marginTop: '2px' }}>
                      {domainSearchResult.available ? 'Ready for immediate registration' : 'Currently unavailable'}
                    </div>
                  </div>

                  {domainSearchResult.available && (
                    <button
                      type="button"
                      className="portal-btn-sm primary"
                      onClick={() => {
                        const targetDomain = domainSearchResult.domain;
                        setRegisterDomainModal(false);
                        setPaymentDetails({
                          title: 'Domain Registration',
                          subtitle: `Register ${targetDomain} (1 Year)`,
                          amount: domainSearchResult.price,
                          type: 'domain',
                          customerName: user.name,
                          customerEmail: user.email
                        });
                      }}
                    >
                      Register for {domainSearchResult.price}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="portal-modal-footer">
              <button type="button" className="portal-btn-sm" onClick={() => setRegisterDomainModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Ticket */}
      {ticketModalOpen && (
        <div className="portal-modal-backdrop" onClick={() => setTicketModalOpen(false)}>
          <div
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3 id="ticket-modal-title">Open Support Ticket</h3>
                <p>Describe your issue and an engineer will respond promptly</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setTicketModalOpen(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="portal-modal-body">
                <div className="portal-form-group">
                  <label htmlFor="ticket-service">Related Service</label>
                  <select
                    id="ticket-service"
                    style={{ width: '100%', padding: '10px', borderRadius: '7px', border: '1px solid #dce8ee' }}
                    value={ticketForm.service}
                    onChange={(e) => setTicketForm({ ...ticketForm, service: e.target.value })}
                  >
                    <option value="Web Hosting">Web Hosting</option>
                    <option value="Domain Registration">Domain & DNS Management</option>
                    <option value="SSL Certificate">SSL Certificate</option>
                    <option value="Business Email">Business Email</option>
                    <option value="VPS / Dedicated Server">VPS / Cloud Server</option>
                    <option value="Billing & Invoicing">Billing & Invoicing</option>
                  </select>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="ticket-priority">Priority</label>
                  <select
                    id="ticket-priority"
                    style={{ width: '100%', padding: '10px', borderRadius: '7px', border: '1px solid #dce8ee' }}
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  >
                    <option value="Normal">Normal — standard support</option>
                    <option value="High">High — service degraded</option>
                    <option value="Urgent">Urgent — website or server down</option>
                  </select>
                </div>

                <div className="portal-form-group">
                  <label htmlFor="ticket-message">Message Details</label>
                  <textarea
                    id="ticket-message"
                    required
                    rows={4}
                    style={{ width: '100%', padding: '10px', borderRadius: '7px', border: '1px solid #dce8ee' }}
                    placeholder="Provide details about your query or error messages..."
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  />
                </div>
              </div>

              <div className="portal-modal-footer">
                <button
                  type="button"
                  className="portal-btn-sm"
                  onClick={() => setTicketModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="portal-btn-sm primary">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Invoice */}
      {invoiceModalItem && (
        <div className="portal-modal-backdrop" onClick={() => setInvoiceModalItem(null)}>
          <div
            className="portal-modal"
            style={{ width: 'min(100%, 650px)' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>Tax Invoice #{invoiceModalItem.id}</h3>
                <p>DataBrain IT Solutions Official Receipt</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setInvoiceModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body invoice-print-card">
              <div className="invoice-brand-row">
                <div className="invoice-company">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <img src="https://databrainit.com/images/logo.png" alt="logo" style={{ width: '24px', height: '24px' }} />
                    <strong>DataBrain IT Solutions</strong>
                  </div>
                  <p>Bengaluru, Karnataka, India</p>
                  <p>Email: hello@databrainit.com · Web: databrainit.com</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`invoice-status-tag ${invoiceModalItem.status.toLowerCase()}`}>
                    {invoiceModalItem.status}
                  </span>
                  <div style={{ fontSize: '11px', color: '#79929e', marginTop: '6px' }}>
                    Due: {new Date(invoiceModalItem.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="invoice-meta-grid">
                <div className="invoice-meta-box">
                  <small>Billed To:</small>
                  <strong>{invoiceModalItem.customer}</strong>
                  <div>{invoiceModalItem.customerEmail}</div>
                </div>
                <div className="invoice-meta-box" style={{ textAlign: 'right' }}>
                  <small>Invoice Details:</small>
                  <div>Order: <strong>{invoiceModalItem.orderId}</strong></div>
                  <div>Date: {new Date(invoiceModalItem.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Term</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>{invoiceModalItem.serviceName} Web Hosting</strong>
                      <div style={{ fontSize: '10px', color: '#79939f' }}>Includes NVMe storage, free SSL, weekly backups</div>
                    </td>
                    <td>1 Year</td>
                    <td style={{ textAlign: 'right' }}>
                      <strong>{invoiceModalItem.amount}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="invoice-total-row">
                <span>Total Amount:</span>
                <strong>{invoiceModalItem.amount}</strong>
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn-sm"
                onClick={() => window.print()}
              >
                <Download size={14} /> Print / Save PDF
              </button>
              {invoiceModalItem.status !== 'Paid' && (
                <button
                  type="button"
                  className="portal-btn-sm primary"
                  onClick={() => {
                    const item = invoiceModalItem;
                    setInvoiceModalItem(null);
                    setPaymentDetails({
                      title: 'Invoice Payment',
                      subtitle: `Tax Invoice ${item.id}`,
                      amount: item.amount,
                      targetId: item.id,
                      type: 'invoice',
                      customerName: user.name,
                      customerEmail: user.email
                    });
                  }}
                >
                  Pay via Razorpay
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: cPanel Simulator */}
      {cpanelModalItem && (
        <div className="portal-modal-backdrop" onClick={() => setCpanelModalItem(null)}>
          <div
            className="portal-modal"
            style={{ width: 'min(100%, 600px)' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <h3>Server Control Panel · {cpanelModalItem.product}</h3>
                <p>Direct access to your server tools and configurations</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setCpanelModalItem(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                {[
                  { label: 'File Manager', icon: HardDrive, note: 'Upload & edit code' },
                  { label: 'phpMyAdmin', icon: Database, note: 'Manage SQL databases' },
                  { label: 'MySQL Databases', icon: Layers, note: 'Users & schemas' },
                  { label: 'Email Accounts', icon: Mail, note: 'Create inbox & forwarders' },
                  { label: 'SSL/TLS Status', icon: ShieldCheck, note: 'Let’s Encrypt active' },
                  { label: 'Terminal / SSH', icon: Terminal, note: 'Port 22 SSH keys' },
                  { label: 'DNS Zone Editor', icon: Globe2, note: 'A, CNAME, MX records' },
                  { label: 'Cron Jobs', icon: Clock, note: 'Scheduled background jobs' },
                  { label: 'Metrics & Logs', icon: Cpu, note: 'CPU, RAM, bandwidth' }
                ].map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e1ecf0',
                      borderRadius: '8px',
                      padding: '14px 10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                    onClick={() => notify(`Opening ${tool.label}...`)}
                  >
                    <tool.icon size={22} color="#1197d4" />
                    <strong style={{ fontSize: '12px', color: '#0b3447' }}>{tool.label}</strong>
                    <small style={{ fontSize: '10px', color: '#79939f' }}>{tool.note}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn-sm"
                onClick={() => setCpanelModalItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: View Ticket Thread (Client Portal) */}
      {selectedClientTicket && (
        <div className="portal-modal-backdrop" onClick={() => setSelectedClientTicket(null)}>
          <div
            className="portal-modal"
            style={{ width: 'min(100%, 650px)' }}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="portal-modal-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>#{selectedClientTicket.id}</span>
                  <span className={
                    selectedClientTicket.status === 'Resolved' ? 'portal-badge-resolved' :
                    selectedClientTicket.status === 'Pending' ? 'portal-badge-pending' :
                    selectedClientTicket.status === 'Closed' ? 'portal-badge-closed' :
                    'portal-badge-open'
                  }>
                    {selectedClientTicket.status === 'Resolved' ? '✓ Resolved' :
                     selectedClientTicket.status === 'Pending' ? '⏱ Pending' :
                     selectedClientTicket.status === 'Closed' ? '✕ Closed' :
                     '● Open'}
                  </span>
                </div>
                <h3>{selectedClientTicket.service}</h3>
                <p>Opened on {new Date(selectedClientTicket.createdAt).toLocaleDateString()}</p>
              </div>
              <button
                type="button"
                className="portal-modal-close"
                onClick={() => setSelectedClientTicket(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="portal-modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {selectedClientTicket.status === 'Resolved' ? (
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', color: '#065f46', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={16} />
                  <span><strong>Ticket Resolved:</strong> DataBrain engineers have resolved this issue. If you still have questions, you can send a reply below to reopen.</span>
                </div>
              ) : selectedClientTicket.status === 'Pending' ? (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', color: '#92400e', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} />
                  <span><strong>Status Pending:</strong> Our support engineers are currently processing or investigating this request.</span>
                </div>
              ) : null}

              {/* Original Query */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: '#64748b' }}>
                  <strong>Your Inquiry:</strong>
                  <span>{new Date(selectedClientTicket.createdAt).toLocaleString()}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13.5px', color: '#1e293b', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {selectedClientTicket.message}
                </p>
              </div>

              {/* Thread replies */}
              {selectedClientTicket.replies && selectedClientTicket.replies.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {selectedClientTicket.replies.map((reply) => (
                    <div
                      key={reply.id}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: reply.role === 'staff' ? '#f0fdf4' : '#f0f9ff',
                        border: `1px solid ${reply.role === 'staff' ? '#bbf7d0' : '#bae6fd'}`,
                        marginLeft: reply.role === 'staff' ? '14px' : '0',
                        marginRight: reply.role === 'client' ? '14px' : '0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11.5px' }}>
                        <strong style={{ color: reply.role === 'staff' ? '#166534' : '#0369a1' }}>
                          {reply.sender} {reply.role === 'staff' ? '(DataBrain Staff)' : '(You)'}
                        </strong>
                        <span style={{ color: '#94a3b8' }}>{new Date(reply.createdAt).toLocaleString()}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {reply.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                <label htmlFor="client-reply-box" style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b', marginBottom: '6px', display: 'block' }}>
                  Send Reply or Follow-up:
                </label>
                <textarea
                  id="client-reply-box"
                  rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
                  placeholder="Type your message to DataBrain engineers..."
                  value={clientReplyText}
                  onChange={(e) => setClientReplyText(e.target.value)}
                />
              </div>
            </div>

            <div className="portal-modal-footer">
              <button
                type="button"
                className="portal-btn-sm"
                onClick={() => setSelectedClientTicket(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="portal-btn-sm primary"
                disabled={replyLoading || !clientReplyText.trim()}
                onClick={sendClientReply}
              >
                {replyLoading ? 'Sending...' : 'Send Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="portal-toast">
          <CheckCircle2 size={16} /> <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
