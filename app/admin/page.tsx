'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity, ArrowUpRight, Bell, BookOpen, ChartNoAxesCombined, CheckCircle2, ChevronDown,
  ChevronRight, ChevronsUpDown, Download, FileText, Globe2, Headphones, LayoutDashboard,
  Mail, Menu, MessageCircle, MessagesSquare, MoreHorizontal, Plus, Search, Server, Settings2,
  ShoppingBag, Sparkles, TrendingDown, TrendingUp, UserPlus, Users, X, PanelsTopLeft, Newspaper
} from 'lucide-react';

type DashboardData = {
  stats: {
    label: string;
    value: string;
    change: string;
    note: string;
    tone: string;
    negative?: boolean;
    href?: string;
    module?: string;
    description?: string;
  }[];
  orders: { id: string; date: string; customer: string; initials: string; product: string; cycle: string; amount: string; status: string }[];
  renewals: { name: string; owner: string; due: string; icon: string }[];
  overview?: {
    totalRevenue: string;
    revenueGrowth: string;
    previousPeriod: string;
    activeServicesTotal: string;
  };
};

const fallbackData: DashboardData = {
  stats: [
    { label: 'Total revenue', value: '₹18,42,680', change: '12.8%', note: 'vs. last month', tone: 'teal', href: '/admin/invoices' },
    { label: 'Active services', value: '1,284', change: '8.4%', note: '+96 this month', tone: 'blue', href: '/admin/services' },
    { label: 'New customers', value: '248', change: '6.2%', note: '+18 this week', tone: 'orange', href: '/admin/customers' },
    { label: 'Open tickets', value: '38', change: '2.1%', note: '8 high priority', tone: 'purple', negative: true, href: '/admin/support-tickets' }
  ],
  orders: [
    { id: '#DB-10842', date: 'Sep 23, 2026', customer: 'Rohan Kapoor', initials: 'RK', product: 'Pro Hosting', cycle: 'Annual', amount: '₹8,499', status: 'Active' },
    { id: '#DB-10841', date: 'Sep 23, 2026', customer: 'Neha Patel', initials: 'NP', product: 'Domain + SSL', cycle: '2 years', amount: '₹3,240', status: 'Pending' },
    { id: '#DB-10840', date: 'Sep 22, 2026', customer: 'Aditya Singh', initials: 'AS', product: 'VPS Cloud 2', cycle: 'Monthly', amount: '₹2,899', status: 'Active' },
    { id: '#DB-10839', date: 'Sep 22, 2026', customer: 'Sneha Mehta', initials: 'SM', product: 'Business Email', cycle: 'Annual', amount: '₹5,499', status: 'Active' }
  ],
  renewals: [
    { name: 'Cloud Hosting Pro', owner: 'BluePeak Studios', due: 'in 2 days', icon: 'server' },
    { name: 'databrainlabs.in', owner: 'Priya Nair', due: 'in 6 days', icon: 'globe' },
    { name: 'Business Email Plus', owner: 'Vertex Retail', due: 'in 12 days', icon: 'mail' }
  ],
  overview: {
    totalRevenue: '₹18,42,680',
    revenueGrowth: '12.8%',
    previousPeriod: '₹16,34,120',
    activeServicesTotal: '1,284'
  }
};

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard }, { label: 'Analytics', icon: ChartNoAxesCombined },
  { label: 'Customers', icon: Users, count: '248' }, { label: 'Orders', icon: ShoppingBag, count: '12', alert: true },
  { label: 'Services', icon: Server }, { label: 'Domains', icon: Globe2 }, { label: 'Invoices', icon: FileText },
  { label: 'Support tickets', icon: MessagesSquare, count: '8', alert: true }, { label: 'Knowledge base', icon: BookOpen }, { label: 'Blog', icon: Newspaper, count: '4' }, { label: 'CMS', icon: PanelsTopLeft }
];

const fieldLinks: Record<string, string> = {
  'Total revenue': '/admin/invoices',
  'Active services': '/admin/services',
  'New customers': '/admin/customers',
  'Open tickets': '/admin/support-tickets'
};

export default function Dashboard() {
  const [data, setData] = useState(fallbackData);
  const [activePage, setActivePage] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [range, setRange] = useState('Last 6 months');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/dashboard`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((incoming) => {
        if (incoming && incoming.stats) {
          setData(incoming);
        }
      })
      .catch(() => undefined);
  }, []);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand">
          <img src="https://databrainit.com/images/logo.png" alt="DataBrain IT Solutions logo" />
          <div className="brand-copy">
            <strong>DataBrain</strong>
            <span>Hosting console</span>
          </div>
          <button className="icon-button close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X />
          </button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-dot" />
          <div>
            <small>Workspace</small>
            <strong>DataBrain Cloud</strong>
          </div>
          <ChevronsUpDown />
        </div>
        <nav className="main-nav">
          <p className="nav-label">Overview</p>
          {navItems.slice(0, 2).map((item) => (
            <NavItem key={item.label} {...item} activePage={activePage} setActivePage={setActivePage} notify={notify} />
          ))}
          <p className="nav-label">Manage</p>
          {navItems.slice(2, 7).map((item) => (
            <NavItem key={item.label} {...item} activePage={activePage} setActivePage={setActivePage} notify={notify} />
          ))}
          <p className="nav-label">Support</p>
          {navItems.slice(7).map((item) => (
            <NavItem key={item.label} {...item} activePage={activePage} setActivePage={setActivePage} notify={notify} />
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavItem label="Settings" icon={Settings2} activePage={activePage} setActivePage={setActivePage} notify={notify} />
          <div className="help-card">
            <div className="help-icon"><Headphones /></div>
            <strong>Need a hand?</strong>
            <p>Our team is ready to help.</p>
            <button onClick={() => notify('Support request panel opened')}>Contact support <ArrowUpRight /></button>
          </div>
          <div className="admin-mini">
            <div className="avatar blue">AS</div>
            <div>
              <strong>Arjun Sharma</strong>
              <span>Super admin</span>
            </div>
            <button className="icon-button" onClick={() => notify('Account menu opened')} aria-label="Account menu">
              <MoreHorizontal />
            </button>
          </div>
        </div>
      </aside>

      <div className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <main className="main-content">
        <header className="topbar">
          <button className="menu-toggle icon-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <ChevronRight />
            <strong>{activePage}</strong>
          </div>
          <div className="top-actions">
            <div className="search-box">
              <Search />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && search && notify(`Searching for “${search}”`)}
                placeholder="Search anything..."
                aria-label="Search anything"
              />
              <kbd>⌘ K</kbd>
            </div>
            <button className="icon-button notification-button" onClick={() => notify('You have 3 new notifications')} aria-label="Notifications">
              <Bell />
              <span />
            </button>
            <div className="top-avatar avatar blue">AS</div>
          </div>
        </header>

        <div className="content-wrap">
          <section className="welcome-row">
            <div>
              <p className="eyebrow">Tuesday, September 23, 2026</p>
              <h1>Good morning, Arjun <span>👋</span></h1>
              <p className="subheading">Here’s what’s happening across your hosting business today.</p>
            </div>
            <div className="welcome-actions">
              <button className="button secondary" onClick={() => notify('Your report is being prepared')}>
                <Download /> Export report
              </button>
              <Link href="/admin/customers" className="button primary" style={{ textDecoration: 'none' }}>
                <Plus /> Add customer
              </Link>
            </div>
          </section>

          <section className="stats-grid">
            {data.stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="dashboard-grid">
            <RevenuePanel range={range} setRange={setRange} notify={notify} overview={data.overview} />
            <ServicePanel overview={data.overview} />
          </section>

          <section className="lower-grid">
            <OrdersPanel orders={data.orders} notify={notify} />
            <div className="right-stack">
              <RenewalsPanel renewals={data.renewals} />
              <ActivityPanel />
            </div>
          </section>
        </div>
      </main>

      {toast && (
        <div className="toast">
          <CheckCircle2 />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function NavItem({ label, icon: Icon, count, alert, activePage, setActivePage, notify }: { label: string; icon: React.ElementType; count?: string; alert?: boolean; activePage: string; setActivePage: (value: string) => void; notify: (message: string) => void }) {
  const slug = label.toLowerCase().replace(/\s+/g, '-');
  const href = label === 'Dashboard' ? '/admin' : label === 'CMS' ? '/admin/cms' : label === 'Blog' ? '/admin/blog' : `/admin/${slug}`;
  return (
    <Link
      className={`nav-item ${activePage === label ? 'active' : ''}`}
      href={href}
      onClick={() => {
        setActivePage(label);
        if (label !== 'Dashboard' && label !== 'CMS' && label !== 'Blog') notify(`${label} module selected`);
      }}
    >
      <Icon />
      <span>{label}</span>
      {count && <b className={alert ? 'nav-alert' : ''}>{count}</b>}
    </Link>
  );
}

function StatCard({ label, value, change, note, tone, negative, href }: DashboardData['stats'][number]) {
  const targetHref = href || fieldLinks[label] || '/admin';

  return (
    <Link
      href={targetHref}
      className="stat-card clickable-stat-card"
      title={`Click to view and manage ${label} in admin`}
      aria-label={`View ${label} details`}
    >
      <div className="stat-top">
        <span>{label}</span>
        <div className="stat-top-right">
          <span className={`trend ${negative ? 'negative' : 'positive'}`}>
            {negative ? <TrendingDown /> : <TrendingUp />} {change}
          </span>
          <span className="card-redirect-badge">
            <ArrowUpRight />
          </span>
        </div>
      </div>
      <strong className="stat-number">{value}</strong>
      <div className="stat-foot">
        <span>{note}</span>
        <div className={`sparkline ${tone}`}>
          {[7, 10, 8, 13, 11, 16, 14, 19].map((height, index) => (
            <i key={index} style={{ height }} />
          ))}
        </div>
      </div>
      <div className="stat-card-hint">
        <span>Manage {label.toLowerCase()}</span>
        <ArrowUpRight style={{ width: 12, height: 12 }} />
      </div>
    </Link>
  );
}

function RevenuePanel({ range, setRange, notify, overview }: { range: string; setRange: (value: string) => void; notify: (message: string) => void; overview?: DashboardData['overview'] }) {
  const currentTotal = overview?.totalRevenue || '₹18,42,680';
  const currentGrowth = overview?.revenueGrowth || '12.8%';
  const prevPeriod = overview?.previousPeriod || '₹16,34,120';

  return (
    <article className="panel revenue-panel">
      <PanelHeader title="Revenue overview" subtitle="Track your sales performance over time">
        <div className="panel-header-actions">
          <Link href="/admin/invoices" className="panel-link-badge" title="View all invoices">
            Invoices <ArrowUpRight />
          </Link>
          <div className="select-wrap">
            <select
              value={range}
              onChange={(event) => {
                setRange(event.target.value);
                notify(`Showing ${event.target.value.toLowerCase()}`);
              }}
              aria-label="Revenue range"
            >
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
            <ChevronDown />
          </div>
        </div>
      </PanelHeader>

      <Link href="/admin/invoices" className="revenue-summary-link" title="Click to view detailed invoices ledger">
        <div className="revenue-summary">
          <strong>{currentTotal}</strong>
          <span className="trend positive"><TrendingUp /> {currentGrowth}</span>
          <small>compared to {prevPeriod} last period • <span className="underline-link">View breakdown &rarr;</span></small>
        </div>
      </Link>

      <div className="chart">
        <div className="y-axis"><span>₹6L</span><span>₹4L</span><span>₹2L</span><span>₹0</span></div>
        <div className="chart-area">
          <div className="grid-lines"><i /><i /><i /><i /></div>
          <svg viewBox="0 0 700 220" preserveAspectRatio="none" aria-label="Revenue graph">
            <defs>
              <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#42b9e8" stopOpacity=".25" />
                <stop offset="1" stopColor="#42b9e8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="chart-fill" d="M0,174 C43,165 55,147 90,152 S130,174 170,140 S213,117 260,134 S300,94 350,113 S395,83 430,97 S479,123 520,82 S567,49 610,67 S658,25 700,39 L700,220 L0,220 Z" />
            <path className="chart-line" d="M0,174 C43,165 55,147 90,152 S130,174 170,140 S213,117 260,134 S300,94 350,113 S395,83 430,97 S479,123 520,82 S567,49 610,67 S658,25 700,39" />
            <circle cx="610" cy="67" r="5" />
          </svg>
          <div className="x-axis"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div>
        </div>
      </div>
    </article>
  );
}

function PanelHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: React.ReactNode }) {
  return (
    <div className="panel-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function ServicePanel({ overview }: { overview?: DashboardData['overview'] }) {
  const servicesTotal = overview?.activeServicesTotal || '1,284';

  return (
    <article className="panel services-panel">
      <PanelHeader title="Service distribution" subtitle="Active services by category">
        <Link href="/admin/services" className="panel-link-badge" title="Manage all services">
          Manage <ArrowUpRight />
        </Link>
      </PanelHeader>

      <Link href="/admin/services" className="donut-clickable-wrap" title="Click to view and configure hosting services">
        <div className="donut">
          <div className="donut-center">
            <strong>{servicesTotal}</strong>
            <span>Total</span>
          </div>
        </div>
        <div className="legend">
          <LegendRow color="hosting" label="Web Hosting" percent="42%" />
          <LegendRow color="domains" label="Domains" percent="27%" />
          <LegendRow color="servers" label="VPS & Servers" percent="18%" />
          <LegendRow color="email" label="Business Email" percent="13%" />
        </div>
      </Link>
      <div className="service-note">
        <Sparkles />
        <span>Web hosting is your fastest growing category <strong>this month.</strong></span>
      </div>
    </article>
  );
}

function LegendRow({ color, label, percent }: { color: string; label: string; percent: string }) {
  return (
    <div>
      <i className={`dot ${color}`} />
      <span>{label}</span>
      <strong>{percent}</strong>
    </div>
  );
}

function OrdersPanel({ orders, notify }: { orders: DashboardData['orders']; notify: (message: string) => void }) {
  return (
    <article className="panel table-panel">
      <PanelHeader title="Recent orders" subtitle="Latest activity from your customers">
        <Link className="text-link" href="/admin/orders" title="View all orders">
          View all <ArrowUpRight />
        </Link>
      </PanelHeader>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>
                  <Link href="/admin/orders" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <strong>{order.id}</strong>
                    <span>{order.date}</span>
                  </Link>
                </td>
                <td>
                  <Link href="/admin/customers" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="customer-cell">
                      <div className={`avatar ${['pink', 'green', 'violet', 'orange'][index % 4]}`}>
                        {order.initials}
                      </div>
                      <strong>{order.customer}</strong>
                    </div>
                  </Link>
                </td>
                <td>
                  <Link href="/admin/services" style={{ textDecoration: 'none', color: 'inherit' }}>
                    {order.product} <span className="muted">{order.cycle}</span>
                  </Link>
                </td>
                <td><strong>{order.amount}</strong></td>
                <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>
                  <Link href="/admin/orders" className="row-more" title="View order details">
                    <MoreHorizontal />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function RenewalsPanel({ renewals }: { renewals: DashboardData['renewals'] }) {
  return (
    <article className="panel renewals-panel">
      <PanelHeader title="Renewals due" subtitle="Next 30 days">
        <Link className="text-link" href="/admin/services" title="View all renewals">
          View all <ArrowUpRight />
        </Link>
      </PanelHeader>
      <div className="renewal-list">
        {renewals.map((item) => (
          <Link href="/admin/services" key={item.name} className="renewal" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={`service-icon ${item.icon}-bg`}>
              {item.icon === 'server' ? <Server /> : item.icon === 'globe' ? <Globe2 /> : <Mail />}
            </div>
            <div>
              <strong>{item.name}</strong>
              <span>{item.owner}</span>
            </div>
            <time>{item.due}</time>
          </Link>
        ))}
      </div>
    </article>
  );
}

function ActivityPanel() {
  return (
    <article className="panel activity-panel">
      <PanelHeader title="Recent activity" subtitle="Live updates from your team">
        <Link href="/admin/support-tickets" className="text-link" title="Open support tickets">
          Helpdesk <ArrowUpRight />
        </Link>
      </PanelHeader>
      <div className="activity-list">
        <Link href="/admin/customers" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ActivityRow icon={<UserPlus />} title="New customer registered" detail="Rahul Verma joined DataBrain" time="10m" />
        </Link>
        <Link href="/admin/invoices" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ActivityRow icon={<CheckCircle2 />} title="Payment received" detail="₹8,499 from Rohan Kapoor" time="32m" green />
        </Link>
        <Link href="/admin/support-tickets" style={{ textDecoration: 'none', color: 'inherit' }}>
          <ActivityRow icon={<MessageCircle />} title="Ticket #TK-4821 updated" detail="Support team replied" time="1h" amber />
        </Link>
      </div>
    </article>
  );
}

function ActivityRow({ icon, title, detail, time, green, amber }: { icon: React.ReactNode; title: string; detail: string; time: string; green?: boolean; amber?: boolean }) {
  return (
    <div className="activity">
      <div className={`activity-icon ${green ? 'green-icon' : amber ? 'amber-icon' : ''}`}>{icon}</div>
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
      <time>{time}</time>
    </div>
  );
}
