const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.API_PORT || 4000;

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use('/uploads', express.static(uploadsDir));

const dashboard = {
  stats: [
    { label: 'Total revenue', value: '₹18,42,680', change: '12.8%', note: 'vs. last month', tone: 'teal' },
    { label: 'Active services', value: '1,284', change: '8.4%', note: '+96 this month', tone: 'blue' },
    { label: 'New customers', value: '248', change: '6.2%', note: '+18 this week', tone: 'orange' },
    { label: 'Open tickets', value: '38', change: '2.1%', note: '8 high priority', tone: 'purple', negative: true }
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
  ]
};

const cmsFile = path.join(__dirname, 'cms.json');
const customersFile = path.join(__dirname, 'customers.json');
const ordersFile = path.join(__dirname, 'orders.json');
const servicesFile = path.join(__dirname, 'services.json');
const invoicesFile = path.join(__dirname, 'invoices.json');
const ticketsFile = path.join(__dirname, 'tickets.json');
const usersFile = path.join(__dirname, 'users.json');
const domainsFile = path.join(__dirname, 'domains.json');
const domainPricesFile = path.join(__dirname, 'domain-prices.json');
const faqsFile = path.join(__dirname, 'faqs.json');
const blogsFile = path.join(__dirname, 'blogs.json');
const companyProfile = {
  name: 'DataBrain IT Solutions',
  shortName: 'DataBrain',
  logoUrl: 'https://databrainit.com/images/logo.png',
  email: 'hello@databrainit.com',
  phone: '+91 98765 43210',
  address: 'Bengaluru, Karnataka, India',
  website: 'https://databrainit.com'
};
const defaultCms = {
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
    description: 'From your first domain search to your busiest season, DataBrain gives you the infrastructure and human support to keep moving confidently.',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80',
    metricValue: '+38%',
    metricLabel: 'faster growth after switching',
    feature1Title: 'Speed without shortcuts',
    feature1Description: 'NVMe storage and next-gen infrastructure keep every click feeling instant.',
    feature2Title: 'People who pick up',
    feature2Description: 'Get thoughtful, expert support whenever you need a second pair of eyes.'
  },
  social: { instagram: 'https://instagram.com/databrainit', facebook: 'https://facebook.com/databrainit', linkedin: 'https://linkedin.com/company/databrainit', youtube: 'https://youtube.com/@databrainit' },
  seo: { title: 'DataBrain IT Solutions | Fast, reliable web hosting', description: 'Web hosting, domains, SSL, business email and digital services from DataBrain.' },
  navigation: { showOffers: true, showBlog: true, showKnowledgeBase: true }
};
let cms = fs.existsSync(cmsFile) ? JSON.parse(fs.readFileSync(cmsFile, 'utf8')) : defaultCms;
let customers = fs.existsSync(customersFile) ? JSON.parse(fs.readFileSync(customersFile, 'utf8')) : [];
let orders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile, 'utf8')) : dashboard.orders;
let services = fs.existsSync(servicesFile) ? JSON.parse(fs.readFileSync(servicesFile, 'utf8')) : [];
let invoices = fs.existsSync(invoicesFile) ? JSON.parse(fs.readFileSync(invoicesFile, 'utf8')) : [];
let tickets = fs.existsSync(ticketsFile) ? JSON.parse(fs.readFileSync(ticketsFile, 'utf8')) : [];
let domains = fs.existsSync(domainsFile) ? JSON.parse(fs.readFileSync(domainsFile, 'utf8')) : [];
let domainPrices = fs.existsSync(domainPricesFile) ? JSON.parse(fs.readFileSync(domainPricesFile, 'utf8')) : {};
let faqs = fs.existsSync(faqsFile) ? JSON.parse(fs.readFileSync(faqsFile, 'utf8')) : [];
let blogs = fs.existsSync(blogsFile) ? JSON.parse(fs.readFileSync(blogsFile, 'utf8')) : [];
const defaultUsers = [
  {
    id: 'USR-0001',
    name: 'Amit Sharma',
    email: 'amit@gmail.com',
    phone: '+91 98765 43210',
    password: 'password123',
    createdAt: '2026-09-20T10:00:00.000Z'
  },
  {
    id: 'USR-0002',
    name: 'Rohan Kapoor',
    email: 'rohan@example.com',
    phone: '+91 98111 22334',
    password: 'password123',
    createdAt: '2026-09-21T10:00:00.000Z'
  }
];
let users = fs.existsSync(usersFile) ? JSON.parse(fs.readFileSync(usersFile, 'utf8')) : defaultUsers;
if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function getAuthUser(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const userId = decoded.split(':')[0];
    return users.find(u => u.id === userId) || null;
  } catch {
    return null;
  }
}

function generateInvoice(order) {
  const invoiceId = `INV-${String((invoices.length || 0) + 1).padStart(4, '0')}`;
  const invoice = {
    id: invoiceId,
    orderId: order.id,
    customer: order.customer || 'Customer',
    customerEmail: order.customerEmail || '',
    serviceName: order.product || 'Hosting service',
    amount: order.amount || '₹0',
    total: order.amount || '₹0',
    status: order.status || 'Paid',
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    company: companyProfile
  };
  invoices = [invoice, ...invoices];
  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  return invoice;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'databrain-api', timestamp: new Date().toISOString() });
});

app.get('/api/domain-prices', (_req, res) => {
  res.json(domainPrices);
});

app.get('/api/domain-check', async (req, res) => {
  const domain = req.query.domain;
  if (!domain) return res.status(400).json({ message: 'Domain query is required.' });
  try {
    const response = await fetch(`https://api.digmyname.com/functions/v1/public-api/check?domain=${encodeURIComponent(domain)}`);
    if (!response.ok) return res.status(response.status).json({ message: 'Domain check service unavailable.' });
    const data = await response.json();

    const cleanDomain = String(domain).toLowerCase().trim();
    const sortedTlds = Object.keys(domainPrices).sort((a, b) => b.length - a.length);
    let matchedTld = '.com';
    for (const t of sortedTlds) {
      if (cleanDomain.endsWith(t)) {
        matchedTld = t;
        break;
      }
    }

    const tldConfig = domainPrices[matchedTld] || { price: 799, currency: '₹', period: '/yr' };
    let dynamicPrice = tldConfig.price;
    const isPremium = Boolean(data.result?.premium || data.result?.likely_premium);

    if (isPremium && data.result?.price_usd && data.result.price_usd > 0) {
      dynamicPrice = Math.max(tldConfig.price, Math.round(data.result.price_usd * 88));
    }

    if (data.result) {
      data.result.price_inr = dynamicPrice;
      data.result.formatted_price = `₹${dynamicPrice.toLocaleString('en-IN')}`;
      data.result.price_period = tldConfig.period || '/yr';
      data.result.tld = matchedTld;
      data.result.is_premium = isPremium;
    }

    res.json(data);
  } catch {
    res.status(500).json({ message: 'Unable to check domain availability.' });
  }
});

// User Auth APIs
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) return res.status(400).json({ message: 'All fields are required.' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email is already registered.' });
  if (users.find(u => u.phone === phone)) return res.status(409).json({ message: 'Phone number is already registered.' });
  const user = { id: `USR-${String(users.length + 1).padStart(4, '0')}`, name, email, phone, password, createdAt: new Date().toISOString() };
  users.push(user);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token });
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) return res.status(400).json({ message: 'Email/phone and password are required.' });
  const user = users.find(u => (u.email === identifier || u.phone === identifier) && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials. Please check your email/phone and password.' });
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone }, token });
});

app.get('/api/auth/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authenticated.' });
  try {
    const decoded = Buffer.from(auth.split(' ')[1], 'base64').toString();
    const userId = decoded.split(':')[0];
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ message: 'User not found.' });
    res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

function getDashboardData() {
  const currentInvoices = fs.existsSync(invoicesFile) ? JSON.parse(fs.readFileSync(invoicesFile, 'utf8')) : invoices;
  const currentOrders = fs.existsSync(ordersFile) ? JSON.parse(fs.readFileSync(ordersFile, 'utf8')) : orders;
  const currentCustomers = fs.existsSync(customersFile) ? JSON.parse(fs.readFileSync(customersFile, 'utf8')) : customers;
  const currentTickets = fs.existsSync(ticketsFile) ? JSON.parse(fs.readFileSync(ticketsFile, 'utf8')) : tickets;
  const currentServices = fs.existsSync(servicesFile) ? JSON.parse(fs.readFileSync(servicesFile, 'utf8')) : services;

  // 1. Total revenue: Base ₹18,32,840 + sum of paid invoices
  const paidInvoiceSum = currentInvoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => {
      const num = parseInt(String(inv.amount || inv.total || '0').replace(/[^0-9]/g, ''), 10) || 0;
      return sum + num;
    }, 0);
  const totalRevenueNumber = 1832840 + paidInvoiceSum;
  const formattedRevenue = `₹${totalRevenueNumber.toLocaleString('en-IN')}`;

  // 2. Active services: Base 1,272 + active/paid orders
  const activeOrdersCount = currentOrders.filter(o => o.status === 'Active' || o.status === 'Paid').length;
  const activeServicesTotal = 1272 + activeOrdersCount;
  const formattedActiveServices = activeServicesTotal.toLocaleString('en-IN');

  // 3. New customers: Base 236 + current registered customer count
  const totalCustomers = 236 + currentCustomers.length;
  const formattedCustomers = totalCustomers.toLocaleString('en-IN');

  // 4. Open tickets: Base 35 + open tickets
  const openTicketsCount = 35 + currentTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;

  const stats = [
    {
      label: 'Total revenue',
      value: formattedRevenue,
      change: '12.8%',
      note: 'vs. last month',
      tone: 'teal',
      href: '/admin/invoices',
      module: 'invoices',
      description: 'View invoices and revenue ledger'
    },
    {
      label: 'Active services',
      value: formattedActiveServices,
      change: '8.4%',
      note: `+${96 + currentServices.length} this month`,
      tone: 'blue',
      href: '/admin/services',
      module: 'services',
      description: 'Manage active hosting services & packages'
    },
    {
      label: 'New customers',
      value: formattedCustomers,
      change: '6.2%',
      note: `+${18 + Math.floor(currentCustomers.length / 2)} this week`,
      tone: 'orange',
      href: '/admin/customers',
      module: 'customers',
      description: 'Customer directory and user accounts'
    },
    {
      label: 'Open tickets',
      value: String(openTicketsCount),
      change: '2.1%',
      note: `${Math.min(openTicketsCount, 8)} high priority`,
      tone: 'purple',
      negative: true,
      href: '/admin/support-tickets',
      module: 'support-tickets',
      description: 'Support requests and customer helpdesk'
    }
  ];

  const recentOrders = currentOrders.slice(0, 5).map(o => ({
    id: o.id,
    date: o.date || 'Sep 23, 2026',
    customer: o.customer,
    initials: o.initials || (o.customer ? o.customer.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : 'CU'),
    product: o.product || 'Web Hosting',
    cycle: o.cycle || 'Annual',
    amount: o.amount || '₹0',
    status: o.status || 'Active'
  }));

  return {
    stats,
    orders: recentOrders.length > 0 ? recentOrders : dashboard.orders,
    renewals: dashboard.renewals,
    overview: {
      totalRevenue: formattedRevenue,
      revenueGrowth: '12.8%',
      previousPeriod: '₹16,34,120',
      activeServicesTotal: formattedActiveServices
    }
  };
}

app.get('/api/dashboard', (_req, res) => {
  res.json(getDashboardData());
});

app.get('/api/company', (_req, res) => {
  res.json(companyProfile);
});

app.get('/api/invoices', (_req, res) => {
  res.json(invoices);
});

app.get('/api/invoices/:id', (req, res) => {
  const invoice = invoices.find((item) => item.id === req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
  res.json(invoice);
});

app.get('/api/admin/:module', (req, res) => {
  const moduleName = req.params.module;
  const title = moduleName.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const recordsByModule = {
    customers,
    orders: orders.map((order) => ({
      id: order.id,
      name: order.customer,
      detail: `${order.product} · ${order.amount}`,
      status: order.status,
      date: order.date,
      product: order.product,
      cycle: order.cycle,
      amount: order.amount,
      customerId: order.customerId,
      customerEmail: order.customerEmail,
    })),
    services: services.map((service) => ({
      id: service.id,
      name: service.name,
      detail: `${service.price} · ${service.features.length} features`,
      status: service.status,
      price: service.price,
      description: service.description,
      popular: service.popular,
      features: service.features,
    })),
    domains: domains.map((d) => ({
      id: d.id,
      name: d.name,
      detail: `${d.customer} · Expires ${d.expiryDate} · ${d.dnsRecords ? d.dnsRecords.length : 0} DNS records`,
      status: d.status,
      customer: d.customer,
      customerEmail: d.customerEmail,
      registeredDate: d.registeredDate,
      expiryDate: d.expiryDate,
      autoRenew: d.autoRenew,
      locked: d.locked,
      privacyProtection: d.privacyProtection,
      authCode: d.authCode,
      nameservers: d.nameservers,
      dnsRecords: d.dnsRecords,
      domain: d
    })),
    invoices: invoices.map((invoice) => ({
      id: invoice.id,
      name: invoice.id,
      detail: `${invoice.customer || 'Customer'} · ${invoice.amount}`,
      status: invoice.status || 'Paid',
      orderId: invoice.orderId,
      customer: invoice.customer,
      customerEmail: invoice.customerEmail,
      serviceName: invoice.serviceName,
      amount: invoice.amount,
      total: invoice.total || invoice.amount,
      createdAt: invoice.createdAt,
      dueDate: invoice.dueDate,
      paidAt: invoice.paidAt,
      paymentId: invoice.paymentId,
      company: invoice.company || companyProfile,
      invoice: invoice
    })),
    'support-tickets': tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      detail: `${ticket.service} · ${ticket.phone || ticket.email || 'No contact'}`,
      status: ticket.status || 'Open',
      message: ticket.message,
      email: ticket.email,
      phone: ticket.phone,
      service: ticket.service,
      priority: ticket.priority || 'Medium',
      department: ticket.department || 'Technical Support',
      createdAt: ticket.createdAt,
      replies: ticket.replies || [],
      ticket: ticket
    })),
    'knowledge-base': faqs.map((faq) => ({
      id: faq.id,
      name: faq.question,
      detail: `${faq.category || 'General'} · ${faq.answer ? (faq.answer.length > 70 ? faq.answer.slice(0, 70) + '...' : faq.answer) : 'No answer'}`,
      status: faq.status,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'General',
      helpfulVotes: faq.helpfulVotes || 0
    })),
    blog: blogs.map((b) => ({
      id: b.id,
      name: b.title,
      detail: `${b.authorName} · ${b.readingTime} · ${b.category}`,
      status: b.status,
      blog: b
    }))
  };
  const records = recordsByModule[moduleName] || [];
  res.json({ title, description: `Manage ${title.toLowerCase()} from your DataBrain workspace.`, count: String(records.length), records });
});

app.get('/api/services', (_req, res) => res.json(services.filter((service) => service.status === 'Active')));

app.get('/api/starter-price', (_req, res) => {
  const activeServices = services.filter((s) => s.status === 'Active');
  const starter = activeServices.find((s) => s.name.toLowerCase().includes('starter')) || activeServices[0] || { price: '₹149' };
  const cleaned = starter.price.replace(/[^\d]/g, '') || '149';
  res.json({
    serviceId: starter.id || 'SRV-001',
    name: starter.name || 'Starter',
    price: starter.price || '₹149',
    amount: cleaned,
    currency: '₹',
    period: '/mo'
  });
});

app.post('/api/admin/services', (req, res) => {
  const { name, description, price, features, popular, status } = req.body || {};
  if (!name || !description || !price) return res.status(400).json({ message: 'Name, description and price are required.' });
  const service = { id: `SRV-${String(services.length + 1).padStart(3, '0')}`, name: String(name).trim(), description: String(description).trim(), price: String(price).trim(), popular: Boolean(popular), status: status || 'Active', features: Array.isArray(features) ? features.filter(Boolean) : [] };
  services = [service, ...services];
  fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2));
  res.status(201).json(service);
});

app.put('/api/admin/services/:id', (req, res) => {
  const serviceIndex = services.findIndex((service) => service.id === req.params.id);
  if (serviceIndex < 0) return res.status(404).json({ message: 'Service not found.' });
  services[serviceIndex] = { ...services[serviceIndex], ...req.body, id: services[serviceIndex].id };
  fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2));
  res.json(services[serviceIndex]);
});

app.get('/api/admin/services/:id', (req, res) => {
  const service = services.find((item) => item.id === req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  res.json(service);
});

app.delete('/api/admin/services/:id', (req, res) => {
  const service = services.find((item) => item.id === req.params.id);
  if (!service) return res.status(404).json({ message: 'Service not found.' });
  services = services.filter((item) => item.id !== req.params.id);
  fs.writeFileSync(servicesFile, JSON.stringify(services, null, 2));
  res.json({ deleted: true, service });
});

app.post('/api/admin/customers', (req, res) => {
  const { name, email, phone } = req.body || {};
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });
  const customer = {
    id: `CUS-${248 + customers.length + 1}`,
    name: String(name).trim(),
    detail: phone ? `${String(email).trim()} · ${String(phone).trim()}` : String(email).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : '',
    status: 'Active',
    createdAt: new Date().toISOString()
  };
  customers = [customer, ...customers];
  fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));
  res.status(201).json(customer);
});

app.get('/api/admin/customers/:id', (req, res) => {
  const customer = customers.find((item) => item.id === req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found.' });
  const customerOrders = orders.filter((o) => o.customer && customer.name && o.customer.toLowerCase().trim() === customer.name.toLowerCase().trim());
  const customerInvoices = invoices.filter((i) => (i.customer && customer.name && i.customer.toLowerCase().trim() === customer.name.toLowerCase().trim()) || (i.customerEmail && customer.detail && customer.detail.toLowerCase().includes(i.customerEmail.toLowerCase())));
  res.json({
    ...customer,
    orders: customerOrders,
    invoices: customerInvoices
  });
});

app.put('/api/admin/customers/:id', (req, res) => {
  const index = customers.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Customer not found.' });
  const { name, email, phone, status } = req.body || {};
  const current = customers[index];
  const updatedEmail = email ? String(email).trim() : (current.email || (current.detail ? current.detail.split(' · ')[0] : ''));
  const updatedPhone = phone !== undefined ? String(phone).trim() : (current.phone || (current.detail && current.detail.includes(' · ') ? current.detail.split(' · ')[1] : ''));
  
  customers[index] = {
    ...current,
    name: name ? String(name).trim() : current.name,
    email: updatedEmail,
    phone: updatedPhone,
    detail: updatedPhone ? `${updatedEmail} · ${updatedPhone}` : updatedEmail,
    status: status || current.status || 'Active'
  };
  fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));
  res.json(customers[index]);
});

app.delete('/api/admin/customers/:id', (req, res) => {
  const customer = customers.find((item) => item.id === req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found.' });
  customers = customers.filter((item) => item.id !== req.params.id);
  fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));
  res.json({ deleted: true, customer });
});

// Admin Domain APIs
app.get('/api/admin/domains', (_req, res) => {
  res.json(domains);
});

app.get('/api/admin/domains/:id', (req, res) => {
  const domain = domains.find((d) => d.id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase());
  if (!domain) return res.status(404).json({ message: 'Domain not found.' });
  res.json(domain);
});

app.post('/api/admin/domains', (req, res) => {
  const { name, customer, customerEmail, expiryDate, registeredDate, status, autoRenew, locked, privacyProtection, nameservers, dnsRecords } = req.body || {};
  if (!name || !customer) return res.status(400).json({ message: 'Domain name and customer are required.' });
  
  const cleanName = String(name).toLowerCase().trim();
  const existing = domains.find((d) => d.name.toLowerCase() === cleanName);
  if (existing) return res.status(400).json({ message: 'Domain already registered.' });

  const newDomain = {
    id: `DOM-${1000 + domains.length + 1}`,
    name: cleanName,
    customer: String(customer).trim(),
    customerEmail: customerEmail ? String(customerEmail).trim() : 'client@databrainhost.com',
    registeredDate: registeredDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: status || 'Active',
    autoRenew: autoRenew !== undefined ? Boolean(autoRenew) : true,
    privacyProtection: privacyProtection !== undefined ? Boolean(privacyProtection) : true,
    locked: locked !== undefined ? Boolean(locked) : true,
    authCode: `DB#${Math.floor(1000 + Math.random() * 9000)}_Reg`,
    nameservers: Array.isArray(nameservers) && nameservers.length ? nameservers : ['ns1.databrainhost.com', 'ns2.databrainhost.com'],
    dnsRecords: Array.isArray(dnsRecords) ? dnsRecords : [
      { id: `rec-${Date.now()}-1`, type: 'A', name: '@', value: '185.199.108.153', ttl: '3600' },
      { id: `rec-${Date.now()}-2`, type: 'CNAME', name: 'www', value: cleanName, ttl: '3600' }
    ]
  };

  domains = [newDomain, ...domains];
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.status(201).json(newDomain);
});

app.put('/api/admin/domains/:id', (req, res) => {
  const index = domains.findIndex((d) => d.id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase());
  if (index < 0) return res.status(404).json({ message: 'Domain not found.' });

  domains[index] = {
    ...domains[index],
    ...req.body,
    id: domains[index].id
  };
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.json(domains[index]);
});

app.delete('/api/admin/domains/:id', (req, res) => {
  const index = domains.findIndex((d) => d.id === req.params.id || d.name.toLowerCase() === req.params.id.toLowerCase());
  if (index < 0) return res.status(404).json({ message: 'Domain not found.' });
  const deleted = domains.splice(index, 1)[0];
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.json({ success: true, deleted });
});

// Knowledge Base & FAQ APIs
app.get('/api/faqs', (_req, res) => {
  res.json(faqs.filter(f => f.status === 'Active'));
});

app.get('/api/admin/faqs', (_req, res) => {
  res.json(faqs);
});

app.get('/api/admin/faqs/:id', (req, res) => {
  const faq = faqs.find(f => f.id === req.params.id);
  if (!faq) return res.status(404).json({ message: 'FAQ not found.' });
  res.json(faq);
});

app.post('/api/admin/faqs', (req, res) => {
  const { question, answer, category, status } = req.body || {};
  if (!question || !answer) return res.status(400).json({ message: 'Question and answer are required.' });
  const newFaq = {
    id: `KB-${String(faqs.length + 1).padStart(3, '0')}`,
    question: String(question).trim(),
    answer: String(answer).trim(),
    category: category ? String(category).trim() : 'General',
    status: status || 'Active',
    helpfulVotes: 0,
    createdAt: new Date().toISOString()
  };
  faqs = [newFaq, ...faqs];
  fs.writeFileSync(faqsFile, JSON.stringify(faqs, null, 2));
  res.status(201).json(newFaq);
});

app.put('/api/admin/faqs/:id', (req, res) => {
  const index = faqs.findIndex(f => f.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: 'FAQ not found.' });
  const { question, answer, category, status } = req.body || {};
  faqs[index] = {
    ...faqs[index],
    ...(question && { question: String(question).trim() }),
    ...(answer && { answer: String(answer).trim() }),
    ...(category && { category: String(category).trim() }),
    ...(status && { status }),
    updatedAt: new Date().toISOString()
  };
  fs.writeFileSync(faqsFile, JSON.stringify(faqs, null, 2));
  res.json(faqs[index]);
});

app.delete('/api/admin/faqs/:id', (req, res) => {
  const index = faqs.findIndex(f => f.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: 'FAQ not found.' });
  const deleted = faqs.splice(index, 1)[0];
  fs.writeFileSync(faqsFile, JSON.stringify(faqs, null, 2));
  res.json({ success: true, deleted });
});

// Blog Management APIs
app.get('/api/blogs', (_req, res) => {
  res.json(blogs);
});

app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === req.params.id || b.slug === req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog post not found.' });
  res.json(blog);
});

app.post(['/api/blogs', '/api/admin/blogs'], (req, res) => {
  const {
    title,
    authorName,
    readingTime,
    authorPic,
    shortDescription,
    longDescription,
    category,
    coverImage,
    status
  } = req.body || {};

  if (!title || !shortDescription) {
    return res.status(400).json({ message: 'Title and short description are required.' });
  }

  const slug = (title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'post') + '-' + Date.now().toString().slice(-4);

  const newBlog = {
    id: `BLOG-${String(Date.now()).slice(-4)}`,
    title: String(title).trim(),
    slug,
    category: category ? String(category).trim() : 'Hosting',
    authorName: authorName ? String(authorName).trim() : 'DataBrain Team',
    authorPic: authorPic ? String(authorPic).trim() : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    readingTime: readingTime ? String(readingTime).trim() : '4 min read',
    shortDescription: String(shortDescription).trim(),
    longDescription: longDescription ? String(longDescription).trim() : '',
    coverImage: coverImage ? String(coverImage).trim() : 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    status: status || 'Published',
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    createdAt: new Date().toISOString()
  };

  blogs = [newBlog, ...blogs];
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
  res.status(201).json(newBlog);
});

app.put(['/api/blogs/:id', '/api/admin/blogs/:id'], (req, res) => {
  const index = blogs.findIndex(b => b.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: 'Blog post not found.' });

  const {
    title,
    authorName,
    readingTime,
    authorPic,
    shortDescription,
    longDescription,
    category,
    coverImage,
    status
  } = req.body || {};

  blogs[index] = {
    ...blogs[index],
    ...(title !== undefined && { title: String(title).trim() }),
    ...(authorName !== undefined && { authorName: String(authorName).trim() }),
    ...(readingTime !== undefined && { readingTime: String(readingTime).trim() }),
    ...(authorPic !== undefined && { authorPic: String(authorPic).trim() }),
    ...(shortDescription !== undefined && { shortDescription: String(shortDescription).trim() }),
    ...(longDescription !== undefined && { longDescription: String(longDescription).trim() }),
    ...(category !== undefined && { category: String(category).trim() }),
    ...(coverImage !== undefined && { coverImage: String(coverImage).trim() }),
    ...(status !== undefined && { status }),
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
  res.json(blogs[index]);
});

app.delete(['/api/blogs/:id', '/api/admin/blogs/:id'], (req, res) => {
  const index = blogs.findIndex(b => b.id === req.params.id);
  if (index < 0) return res.status(404).json({ message: 'Blog post not found.' });
  const deleted = blogs.splice(index, 1)[0];
  fs.writeFileSync(blogsFile, JSON.stringify(blogs, null, 2));
  res.json({ success: true, deleted });
});

app.get('/api/cms', (_req, res) => res.json(cms));

app.put('/api/cms', (req, res) => {
  cms = {
    ...cms,
    ...req.body,
    banner: { ...cms.banner, ...req.body.banner },
    why: { ...(cms.why || defaultCms.why), ...(req.body.why || {}) },
    social: { ...cms.social, ...req.body.social },
    seo: { ...cms.seo, ...req.body.seo },
    navigation: { ...cms.navigation, ...req.body.navigation }
  };
  fs.writeFileSync(cmsFile, JSON.stringify(cms, null, 2));
  res.json({ saved: true, cms });
});

app.post('/api/upload', (req, res) => {
  try {
    const { dataUrl, filename } = req.body || {};
    if (!dataUrl) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return res.json({ url: dataUrl });
    }

    const matches = dataUrl.match(/^data:([A-Za-z0-9\-+\/.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 data URL format' });
    }

    const mimeType = matches[1].toLowerCase();
    const base64Data = matches[2];
    let ext = 'png';
    if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = 'jpg';
    else if (mimeType.includes('webp')) ext = 'webp';
    else if (mimeType.includes('svg')) ext = 'svg';
    else if (mimeType.includes('gif')) ext = 'gif';

    const safeBase = (filename || 'banner').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const outFileName = `${safeBase}-${Date.now()}.${ext}`;
    const outFilePath = path.join(uploadsDir, outFileName);

    fs.writeFileSync(outFilePath, Buffer.from(base64Data, 'base64'));

    const host = req.get('host') || `localhost:${port}`;
    const protocol = req.protocol === 'https' ? 'https' : 'http';
    const fileUrl = `${protocol}://${host}/uploads/${outFileName}`;

    res.json({ success: true, url: fileUrl, filename: outFileName });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Failed to process upload' });
  }
});

app.post('/api/customers', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });
  res.status(201).json({ id: `CUS-${Date.now()}`, name, email, createdAt: new Date().toISOString() });
});

app.post('/api/admin/orders', (req, res) => {
  const { customer, product, cycle, amount, status, serviceId } = req.body || {};
  if (!customer || !product || !amount) return res.status(400).json({ message: 'Customer, product and amount are required.' });
  const order = { id: `#DB-${10843 + orders.length}`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), customer: String(customer).trim(), product: String(product).trim(), cycle: cycle || 'Monthly', amount: String(amount).trim(), serviceId: serviceId || null, status: status || 'Paid' };
  orders = [order, ...orders];
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  const invoice = generateInvoice(order);
  res.status(201).json({ order, invoice });
});

app.get('/api/admin/orders/:id', (req, res) => {
  const paramId = decodeURIComponent(req.params.id);
  const cleanId = paramId.replace(/^#/, '');
  const order = orders.find((o) => o.id === paramId || o.id.replace(/^#/, '') === cleanId);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  const orderCustomer = customers.find((c) => (c.name && order.customer && c.name.toLowerCase() === order.customer.toLowerCase()) || (order.customerId && c.id === order.customerId));
  const orderInvoice = invoices.find((inv) => inv.orderId === order.id || (inv.customer === order.customer && inv.amount === order.amount));
  res.json({
    ...order,
    customerDetail: orderCustomer,
    invoiceDetail: orderInvoice,
  });
});

app.put('/api/admin/orders/:id', (req, res) => {
  const paramId = decodeURIComponent(req.params.id);
  const cleanId = paramId.replace(/^#/, '');
  const orderIndex = orders.findIndex((order) => order.id === paramId || order.id.replace(/^#/, '') === cleanId);
  if (orderIndex < 0) return res.status(404).json({ message: 'Order not found.' });
  orders[orderIndex] = { ...orders[orderIndex], ...req.body, id: orders[orderIndex].id };
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.json(orders[orderIndex]);
});

app.delete('/api/admin/orders/:id', (req, res) => {
  const paramId = decodeURIComponent(req.params.id);
  const cleanId = paramId.replace(/^#/, '');
  const order = orders.find((o) => o.id === paramId || o.id.replace(/^#/, '') === cleanId);
  if (!order) return res.status(404).json({ message: 'Order not found.' });
  orders = orders.filter((o) => o.id !== order.id);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.json({ deleted: true, order });
});

// Admin Invoice APIs
app.get('/api/admin/invoices', (_req, res) => {
  res.json(invoices);
});

app.get('/api/admin/invoices/:id', (req, res) => {
  const invoice = invoices.find((item) => item.id === req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });
  res.json(invoice);
});

app.post('/api/admin/invoices', (req, res) => {
  const { customer, customerEmail, serviceName, orderId, amount, total, status, dueDate, createdAt } = req.body || {};
  if (!customer || !amount) {
    return res.status(400).json({ message: 'Customer name and amount are required.' });
  }

  const cleanAmount = String(amount).startsWith('₹') ? String(amount).trim() : `₹${String(amount).trim()}`;
  const nextNum = (invoices.length > 0)
    ? Math.max(...invoices.map((i) => parseInt(String(i.id).replace(/\D/g, '') || '0', 10)), 0) + 1
    : 1;
  const newInvoiceId = `INV-${String(nextNum).padStart(4, '0')}`;
  const now = new Date().toISOString();
  const isPaid = status === 'Paid';

  const invoice = {
    id: newInvoiceId,
    orderId: orderId ? String(orderId).trim() : `#DB-${10843 + orders.length}`,
    customer: String(customer).trim(),
    customerEmail: customerEmail ? String(customerEmail).trim() : '',
    serviceName: serviceName ? String(serviceName).trim() : 'Cloud Hosting Pro',
    amount: cleanAmount,
    total: total ? (String(total).startsWith('₹') ? String(total).trim() : `₹${String(total).trim()}`) : cleanAmount,
    status: status || 'Unpaid',
    createdAt: createdAt || now,
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    paidAt: isPaid ? now : undefined,
    paymentId: isPaid ? `pay_manual_${Date.now()}` : undefined,
    company: companyProfile
  };

  invoices = [invoice, ...invoices];
  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  res.status(201).json(invoice);
});

app.put('/api/admin/invoices/:id', (req, res) => {
  const index = invoices.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Invoice not found.' });

  const current = invoices[index];
  const { customer, customerEmail, serviceName, orderId, amount, total, status, dueDate } = req.body || {};

  const wasPaid = current.status === 'Paid';
  const willBePaid = status === 'Paid';
  const now = new Date().toISOString();

  invoices[index] = {
    ...current,
    customer: customer !== undefined ? String(customer).trim() : current.customer,
    customerEmail: customerEmail !== undefined ? String(customerEmail).trim() : current.customerEmail,
    serviceName: serviceName !== undefined ? String(serviceName).trim() : current.serviceName,
    orderId: orderId !== undefined ? String(orderId).trim() : current.orderId,
    amount: amount !== undefined ? (String(amount).startsWith('₹') ? String(amount).trim() : `₹${String(amount).trim()}`) : current.amount,
    total: total !== undefined ? (String(total).startsWith('₹') ? String(total).trim() : `₹${String(total).trim()}`) : (amount ? (String(amount).startsWith('₹') ? String(amount).trim() : `₹${String(amount).trim()}`) : current.total),
    status: status || current.status,
    dueDate: dueDate || current.dueDate,
    paidAt: willBePaid && !wasPaid ? now : (willBePaid ? current.paidAt || now : (status && !willBePaid ? undefined : current.paidAt)),
    paymentId: willBePaid && !wasPaid ? `pay_manual_${Date.now()}` : (willBePaid ? current.paymentId || `pay_ref_${Date.now()}` : (status && !willBePaid ? undefined : current.paymentId))
  };

  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  res.json(invoices[index]);
});

app.patch('/api/admin/invoices/:id/status', (req, res) => {
  const index = invoices.findIndex((i) => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Invoice not found.' });

  const targetStatus = req.body?.status || (invoices[index].status === 'Paid' ? 'Unpaid' : 'Paid');
  const now = new Date().toISOString();

  invoices[index].status = targetStatus;
  if (targetStatus === 'Paid') {
    invoices[index].paidAt = invoices[index].paidAt || now;
    invoices[index].paymentId = invoices[index].paymentId || `pay_manual_${Date.now()}`;
  } else {
    delete invoices[index].paidAt;
    delete invoices[index].paymentId;
  }

  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  res.json({ success: true, invoice: invoices[index] });
});

app.delete('/api/admin/invoices/:id', (req, res) => {
  const invoice = invoices.find((i) => i.id === req.params.id);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found.' });

  invoices = invoices.filter((i) => i.id !== req.params.id);
  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  res.json({ deleted: true, invoice });
});

app.post('/api/orders', (req, res) => {
  const { customer, serviceId, cycle } = req.body || {};
  const service = services.find((item) => item.id === serviceId && item.status === 'Active');
  if (!customer?.name || !customer?.email || !service) return res.status(400).json({ message: 'Customer name, email and an active service are required.' });
  let account = customers.find((item) => item.email === customer.email);
  if (!account) {
    account = { id: `CUS-${248 + customers.length + 1}`, name: String(customer.name).trim(), detail: String(customer.email).trim(), status: 'Active' };
    customers = [account, ...customers];
    fs.writeFileSync(customersFile, JSON.stringify(customers, null, 2));
  }
  const order = { id: `#DB-${10843 + orders.length}`, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), customer: account.name, customerId: account.id, product: service.name, serviceId: service.id, cycle: cycle || 'Annual', amount: service.price, status: 'Paid', customerEmail: String(customer.email).trim() };
  orders = [order, ...orders];
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  const invoice = generateInvoice(order);
  res.status(201).json({ order, customer: account, service, invoice });
});

app.post('/api/contact', (req, res) => {
  const { name, email, service, phone, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ message: 'Name, email and message are required.' });
  const ticket = {
    id: `TK-${String(tickets.length + 1).padStart(4, '0')}`,
    name: String(name).trim(),
    email: String(email).trim(),
    service: service ? String(service).trim() : 'General inquiry',
    phone: phone ? String(phone).trim() : '',
    message: String(message).trim(),
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  tickets = [ticket, ...tickets];
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.status(201).json({ success: true, ticket });
});

app.get('/api/tickets', (_req, res) => {
  res.json(tickets);
});

app.get('/api/admin/support-tickets', (_req, res) => {
  res.json({
    title: 'Support tickets',
    description: 'Manage support tickets from your DataBrain workspace.',
    count: String(tickets.length),
    records: tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      detail: `${ticket.service} · ${ticket.phone || ticket.email || 'No contact'}`,
      status: ticket.status || 'Open',
      message: ticket.message,
      email: ticket.email,
      phone: ticket.phone,
      service: ticket.service,
      priority: ticket.priority || 'Medium',
      department: ticket.department || 'Technical Support',
      createdAt: ticket.createdAt,
      replies: ticket.replies || [],
      ticket: ticket
    }))
  });
});

app.get('/api/tickets/:id', (req, res) => {
  const ticket = tickets.find((item) => item.id === req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
  res.json(ticket);
});

app.get('/api/admin/support-tickets/:id', (req, res) => {
  const ticket = tickets.find((item) => item.id === req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found.' });
  res.json(ticket);
});

app.post('/api/admin/support-tickets', (req, res) => {
  const { name, email, phone, service, message, status, priority, department } = req.body || {};
  if (!name || !message) return res.status(400).json({ message: 'Customer name and issue message are required.' });

  const maxNum = tickets.reduce((max, t) => {
    const num = parseInt((t.id || '').replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  const newId = `TK-${String(maxNum + 1).padStart(4, '0')}`;

  const validStatuses = ['Open', 'Pending', 'Resolved', 'Closed'];
  const validStatus = status && validStatuses.includes(status) ? status : 'Open';

  const newTicket = {
    id: newId,
    name: String(name).trim(),
    email: String(email || '').trim(),
    phone: String(phone || '').trim(),
    service: String(service || 'General inquiry').trim(),
    message: String(message).trim(),
    status: validStatus,
    priority: priority || 'Medium',
    department: department || 'Technical Support',
    createdAt: new Date().toISOString(),
    replies: []
  };

  tickets = [newTicket, ...tickets];
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.status(201).json(newTicket);
});

app.put('/api/admin/support-tickets/:id', (req, res) => {
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === req.params.id);
  if (ticketIndex < 0) return res.status(404).json({ message: 'Ticket not found.' });

  const existing = tickets[ticketIndex];
  const { name, email, phone, service, message, status, priority, department, adminReply, replySender } = req.body || {};

  const updatedReplies = [...(existing.replies || [])];
  if (adminReply && String(adminReply).trim()) {
    updatedReplies.push({
      id: `rep-${Date.now()}`,
      sender: replySender || 'DataBrain Support Engineer',
      role: 'staff',
      message: String(adminReply).trim(),
      createdAt: new Date().toISOString()
    });
  }

  const validStatuses = ['Open', 'Pending', 'Resolved', 'Closed'];
  const newStatus = status && validStatuses.includes(status) ? status : (existing.status || 'Open');

  tickets[ticketIndex] = {
    ...existing,
    ...(name !== undefined ? { name: String(name).trim() } : {}),
    ...(email !== undefined ? { email: String(email).trim() } : {}),
    ...(phone !== undefined ? { phone: String(phone).trim() } : {}),
    ...(service !== undefined ? { service: String(service).trim() } : {}),
    ...(message !== undefined ? { message: String(message).trim() } : {}),
    ...(priority !== undefined ? { priority: String(priority).trim() } : {}),
    ...(department !== undefined ? { department: String(department).trim() } : {}),
    status: newStatus,
    replies: updatedReplies,
    id: existing.id,
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.json(tickets[ticketIndex]);
});

app.delete('/api/admin/support-tickets/:id', (req, res) => {
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === req.params.id);
  if (ticketIndex < 0) return res.status(404).json({ message: 'Ticket not found.' });
  const deleted = tickets[ticketIndex];
  tickets = tickets.filter((ticket) => ticket.id !== req.params.id);
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.json({ success: true, message: `Ticket ${deleted.id} deleted successfully.`, ticket: deleted });
});

app.post('/api/client/tickets/:id/reply', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const ticketIndex = tickets.findIndex((ticket) => ticket.id === req.params.id);
  if (ticketIndex < 0) return res.status(404).json({ message: 'Ticket not found.' });

  const { message } = req.body || {};
  if (!message || !String(message).trim()) return res.status(400).json({ message: 'Reply message cannot be empty.' });

  const existing = tickets[ticketIndex];
  const replyItem = {
    id: `rep-${Date.now()}`,
    sender: user.name || 'Client',
    role: 'client',
    message: String(message).trim(),
    createdAt: new Date().toISOString()
  };

  const nextStatus = existing.status === 'Resolved' || existing.status === 'Closed' ? 'Open' : existing.status;

  tickets[ticketIndex] = {
    ...existing,
    status: nextStatus,
    replies: [...(existing.replies || []), replyItem],
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.json({ success: true, ticket: tickets[ticketIndex] });
});

// Client Portal Endpoints
app.get('/api/client/overview', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });

  const emailNorm = user.email.toLowerCase();
  const nameNorm = user.name.toLowerCase();

  const userOrders = orders.filter(o => 
    (o.customerEmail && o.customerEmail.toLowerCase() === emailNorm) ||
    (o.customer && o.customer.toLowerCase() === nameNorm)
  );

  const userInvoices = invoices.filter(inv =>
    (inv.customerEmail && inv.customerEmail.toLowerCase() === emailNorm) ||
    (inv.customer && inv.customer.toLowerCase() === nameNorm)
  );

  const userTickets = tickets.filter(t =>
    (t.email && t.email.toLowerCase() === emailNorm) ||
    (t.name && t.name.toLowerCase() === nameNorm)
  );

  const activeServices = userOrders.filter(o => o.status === 'Active' || o.status === 'Paid');
  const unpaidInvoices = userInvoices.filter(i => i.status !== 'Paid');
  const openTickets = userTickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed');

  res.json({
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    stats: {
      totalServices: userOrders.length,
      activeServices: activeServices.length,
      totalInvoices: userInvoices.length,
      unpaidInvoices: unpaidInvoices.length,
      openTickets: openTickets.length,
      uptime: '99.99%',
      serverLocation: 'Mumbai (Asia-South1)'
    },
    orders: userOrders,
    invoices: userInvoices,
    tickets: userTickets
  });
});

app.post('/api/client/tickets', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const { service, message } = req.body || {};
  if (!message) return res.status(400).json({ message: 'Ticket message is required.' });
  const ticket = {
    id: `TK-${String(tickets.length + 1).padStart(4, '0')}`,
    name: user.name,
    email: user.email,
    service: service ? String(service).trim() : 'General hosting inquiry',
    phone: user.phone || '',
    message: String(message).trim(),
    status: 'Open',
    createdAt: new Date().toISOString()
  };
  tickets = [ticket, ...tickets];
  fs.writeFileSync(ticketsFile, JSON.stringify(tickets, null, 2));
  res.status(201).json({ success: true, ticket });
});

app.post('/api/client/invoices/:id/pay', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const invoiceIndex = invoices.findIndex((i) => i.id === req.params.id);
  if (invoiceIndex < 0) return res.status(404).json({ message: 'Invoice not found.' });
  invoices[invoiceIndex].status = 'Paid';
  invoices[invoiceIndex].paidAt = new Date().toISOString();
  fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
  res.json({ success: true, invoice: invoices[invoiceIndex] });
});

app.put('/api/client/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const { name, phone } = req.body || {};
  if (name) user.name = String(name).trim();
  if (phone) user.phone = String(phone).trim();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// Domain Management APIs
app.get('/api/client/domains', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const userDomains = domains.filter(
    (d) =>
      (d.customerEmail && d.customerEmail.toLowerCase() === user.email.toLowerCase()) ||
      (d.customer && d.customer.toLowerCase() === user.name.toLowerCase())
  );
  res.json(userDomains);
});

app.post('/api/client/domains/:id/dns', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const domain = domains.find((d) => d.id === req.params.id);
  if (!domain) return res.status(404).json({ message: 'Domain not found.' });
  const { type, name, value, ttl, priority } = req.body || {};
  if (!type || !name || !value) return res.status(400).json({ message: 'Type, name and value are required.' });
  const newRecord = {
    id: `rec-${Date.now()}`,
    type: String(type).toUpperCase().trim(),
    name: String(name).trim(),
    value: String(value).trim(),
    ttl: String(ttl || '3600').trim(),
    ...(priority ? { priority: String(priority).trim() } : {})
  };
  domain.dnsRecords = [...(domain.dnsRecords || []), newRecord];
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.status(201).json({ success: true, record: newRecord, domain });
});

app.delete('/api/client/domains/:id/dns/:recordId', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const domain = domains.find((d) => d.id === req.params.id);
  if (!domain) return res.status(404).json({ message: 'Domain not found.' });
  domain.dnsRecords = (domain.dnsRecords || []).filter((r) => r.id !== req.params.recordId);
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.json({ success: true, domain });
});

app.put('/api/client/domains/:id/nameservers', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const domain = domains.find((d) => d.id === req.params.id);
  if (!domain) return res.status(404).json({ message: 'Domain not found.' });
  const { nameservers } = req.body || {};
  if (!Array.isArray(nameservers) || nameservers.length < 2) {
    return res.status(400).json({ message: 'At least 2 nameservers are required.' });
  }
  domain.nameservers = nameservers.map((ns) => String(ns).trim());
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.json({ success: true, domain });
});

app.put('/api/client/domains/:id/toggle-lock', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const domain = domains.find((d) => d.id === req.params.id);
  if (!domain) return res.status(404).json({ message: 'Domain not found.' });
  domain.locked = !domain.locked;
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));
  res.json({ success: true, locked: domain.locked, domain });
});

app.post('/api/client/domains/register', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ message: 'Not authenticated.' });
  const { domainName, years, amount } = req.body || {};
  if (!domainName) return res.status(400).json({ message: 'Domain name is required.' });

  const newDomain = {
    id: `DOM-${1000 + domains.length + 1}`,
    name: String(domainName).toLowerCase().trim(),
    customer: user.name,
    customerEmail: user.email,
    registeredDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + (Number(years) || 1) * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    autoRenew: true,
    privacyProtection: true,
    locked: true,
    authCode: `DB#${Math.floor(1000 + Math.random() * 9000)}_Reg`,
    nameservers: ['ns1.databrainhost.com', 'ns2.databrainhost.com'],
    dnsRecords: [
      { id: `rec-${Date.now()}-1`, type: 'A', name: '@', value: '185.199.108.153', ttl: '3600' },
      { id: `rec-${Date.now()}-2`, type: 'CNAME', name: 'www', value: String(domainName).toLowerCase().trim(), ttl: '3600' }
    ]
  };

  domains = [newDomain, ...domains];
  fs.writeFileSync(domainsFile, JSON.stringify(domains, null, 2));

  // Also create order and invoice
  const order = {
    id: `#DB-${10843 + orders.length}`,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    customer: user.name,
    product: `Domain: ${newDomain.name}`,
    cycle: `${years || 1} Year`,
    amount: amount || '₹799',
    status: 'Paid',
    customerEmail: user.email
  };
  orders = [order, ...orders];
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  const invoice = generateInvoice(order);

  res.status(201).json({ success: true, domain: newDomain, order, invoice });
});

// Razorpay / Payment Gateway Simulation API
app.post('/api/payment/simulate-checkout', (req, res) => {
  const { type, targetId, amount, paymentMethod, customer } = req.body || {};
  const paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
  const receiptId = `RCP-${Date.now()}`;

  if (type === 'invoice' && targetId) {
    const invoiceIndex = invoices.findIndex((i) => i.id === targetId);
    if (invoiceIndex >= 0) {
      invoices[invoiceIndex].status = 'Paid';
      invoices[invoiceIndex].paidAt = new Date().toISOString();
      invoices[invoiceIndex].paymentId = paymentId;
      fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2));
    }
  }

  res.json({
    success: true,
    paymentId,
    receiptId,
    amount: amount || '₹149',
    method: paymentMethod || 'UPI',
    timestamp: new Date().toISOString(),
    status: 'Captured'
  });
});

app.listen(port, () => {
  console.log(`DataBrain API running at http://localhost:${port}`);
});
