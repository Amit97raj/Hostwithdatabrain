"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  CreditCard,
  Download,
  Edit3,
  Eye,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Lock,
  Mail,
  Menu,
  MessageSquare,
  Phone,
  Plus,
  Printer,
  Receipt,
  Search,
  Send,
  Server,
  Settings2,
  ThumbsUp,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";

type TicketReply = {
  id: string;
  sender: string;
  role: 'staff' | 'client' | string;
  message: string;
  createdAt: string;
};

type TicketDetail = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  service: string;
  message: string;
  status: 'Open' | 'Pending' | 'Resolved' | 'Closed' | string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical' | string;
  department?: string;
  createdAt: string;
  updatedAt?: string;
  replies?: TicketReply[];
};

type DomainDetail = {
  id: string;
  name: string;
  customer: string;
  customerEmail?: string;
  registeredDate?: string;
  expiryDate?: string;
  status: string;
  autoRenew?: boolean;
  locked?: boolean;
  privacyProtection?: boolean;
  authCode?: string;
  nameservers?: string[];
  dnsRecords?: { id: string; type: string; name: string; value: string; ttl?: string; priority?: string }[];
};

type CustomerDetail = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  detail?: string;
  status?: string;
  createdAt?: string;
  orders?: { id: string; product: string; amount: string; status: string; date?: string }[];
  invoices?: { id: string; amount: string; status: string; createdAt?: string }[];
};

type OrderDetail = {
  id: string;
  customer: string;
  product: string;
  amount: string;
  cycle?: string;
  status: string;
  date?: string;
  serviceId?: string;
  customerId?: string;
  customerEmail?: string;
  customerDetail?: { id: string; name: string; email?: string; phone?: string; status?: string; detail?: string };
  invoiceDetail?: { id: string; amount: string; status: string; total?: string; createdAt?: string };
};

type InvoiceDetail = {
  id: string;
  orderId?: string;
  customer: string;
  customerEmail?: string;
  serviceName: string;
  amount: string;
  total?: string;
  status: 'Paid' | 'Unpaid' | 'Overdue' | 'Cancelled' | string;
  createdAt: string;
  dueDate?: string;
  paidAt?: string;
  paymentId?: string;
  company?: {
    name: string;
    shortName?: string;
    logoUrl?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
};

type RecordItem = {
  id: string;
  name: string;
  detail: string;
  status: string;
  question?: string;
  answer?: string;
  category?: string;
  helpfulVotes?: number;
  date?: string;
  product?: string;
  cycle?: string;
  amount?: string;
  total?: string;
  customerId?: string;
  customerEmail?: string;
  price?: string;
  description?: string;
  popular?: boolean;
  features?: string[];
  customer?: string;
  registeredDate?: string;
  expiryDate?: string;
  autoRenew?: boolean;
  locked?: boolean;
  privacyProtection?: boolean;
  authCode?: string;
  nameservers?: string[];
  dnsRecords?: { id: string; type: string; name: string; value: string; ttl?: string; priority?: string }[];
  domain?: DomainDetail;
  ticket?: TicketDetail;
  replies?: TicketReply[];
  priority?: string;
  department?: string;
  createdAt?: string;
  message?: string;
  email?: string;
  phone?: string;
  service?: string;
  serviceName?: string;
  orderId?: string;
  dueDate?: string;
  paidAt?: string;
  paymentId?: string;
  invoice?: InvoiceDetail;
};
type ModuleResponse = {
  title: string;
  description: string;
  count: string;
  records: RecordItem[];
};
type CustomerOption = { id: string; name: string };
type ServiceOption = { id: string; name: string; price: string; status: string; popular?: boolean };
type ServiceDetail = { id: string; name: string; description: string; price: string; status: string; popular?: boolean; features: string[] };
const fallback: ModuleResponse = {
  title: "Admin module",
  description: "Manage this area of your hosting business.",
  count: "0",
  records: [],
};
const labels: Record<string, string> = {
  analytics: "Analytics",
  customers: "Customers",
  orders: "Orders",
  services: "Services",
  domains: "Domains",
  invoices: "Invoices",
  "support-tickets": "Support tickets",
  "knowledge-base": "Knowledge base",
  blog: "Blog articles",
  settings: "Settings",
};

export default function AdminModulePage() {
  const { module } = useParams<{ module: string }>();
  const [data, setData] = useState<ModuleResponse>(fallback);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [companyProfile, setCompanyProfile] = useState({
    name: "DataBrain IT Solutions",
    email: "hello@databrainit.com",
    phone: "+91 98765 43210",
    address: "Bengaluru, Karnataka, India",
    website: "https://databrainit.com",
    logoUrl: "https://databrainit.com/images/logo.png",
  });
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [viewCustomer, setViewCustomer] = useState<CustomerDetail | null>(null);
  const [viewOrder, setViewOrder] = useState<OrderDetail | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [orderId, setOrderId] = useState("");
  const [orderForm, setOrderForm] = useState({
    customer: "",
    product: "",
    serviceId: "",
    cycle: "Monthly",
    amount: "",
    status: "Paid",
  });
  const [serviceOpen, setServiceOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    popular: false,
    status: "Active",
  });
  const [viewService, setViewService] = useState<ServiceDetail | null>(null);
  const [domainOpen, setDomainOpen] = useState(false);
  const [domainId, setDomainId] = useState("");
  const [domainForm, setDomainForm] = useState({
    name: "",
    customer: "",
    customerEmail: "",
    expiryDate: "",
    registeredDate: "",
    status: "Active",
    autoRenew: true,
    locked: true,
    privacyProtection: true,
    primaryNs: "ns1.databrainhost.com",
    secondaryNs: "ns2.databrainhost.com",
  });
  const [viewDomain, setViewDomain] = useState<DomainDetail | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Cloud Hosting",
    department: "Technical Support",
    priority: "Medium",
    status: "Open",
    message: "",
  });
  const [viewTicket, setViewTicket] = useState<TicketDetail | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqId, setFaqId] = useState("");
  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
    category: "General",
    status: "Active",
  });
  const [viewFaq, setViewFaq] = useState<RecordItem | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [testFaqOpen, setTestFaqOpen] = useState(true);
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);
  const [kbCategoryFilter, setKbCategoryFilter] = useState("All");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [viewInvoice, setViewInvoice] = useState<InvoiceDetail | null>(null);
  const [invoiceFilter, setInvoiceFilter] = useState<"All" | "Paid" | "Unpaid" | "Overdue">("All");
  const [invoiceForm, setInvoiceForm] = useState({
    customer: "",
    customerEmail: "",
    serviceName: "Cloud Hosting Pro",
    orderId: "",
    amount: "₹149",
    cycle: "Annual",
    status: "Unpaid",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });
  const title = labels[module] || module.replace(/-/g, " ");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  const productButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (orderOpen && services.length) {
      setProductMenuOpen(true);
      window.setTimeout(() => productButtonRef.current?.focus(), 50);
    }
  }, [orderOpen, services.length]);

  function loadModule() {
    return fetch(`${apiUrl}/api/admin/${module}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setData)
      .catch(() => setData({ ...fallback, title }));
  }
  useEffect(() => {
    loadModule();
  }, [module, title]);
  useEffect(() => {
    fetch(`${apiUrl}/api/admin/customers`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((response: { records: CustomerOption[] }) =>
        setCustomers(response.records),
      )
      .catch(() => setCustomers([]));
    fetch(`${apiUrl}/api/services`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((response: ServiceOption[]) => setServices(response))
      .catch(() => setServices([]));
    fetch(`${apiUrl}/api/company`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then(setCompanyProfile)
      .catch(() => undefined);
  }, [apiUrl]);
  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  }
  async function saveCustomer(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const url = customerId
      ? `${apiUrl}/api/admin/customers/${encodeURIComponent(customerId)}`
      : `${apiUrl}/api/admin/customers`;
    const method = customerId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      await loadModule();
      setForm({ name: "", email: "", phone: "", status: "Active" });
      setCustomerId("");
      setFormOpen(false);
      notify(customerId ? "Customer updated successfully!" : "Customer added successfully!");
    } else {
      const error = await response
        .json()
        .catch(() => ({ message: "Unable to save customer" }));
      notify(error.message);
    }
    setSaving(false);
  }

  async function openCustomer(record: RecordItem) {
    const [emailPart, phonePart] = (record.detail || "").split(" · ");
    setViewCustomer({
      id: record.id,
      name: record.name,
      email: emailPart || "",
      phone: phonePart || "",
      status: record.status || "Active",
      orders: [],
      invoices: []
    });
    try {
      const res = await fetch(`${apiUrl}/api/admin/customers/${record.id}`);
      if (res.ok) {
        const data = await res.json();
        setViewCustomer(data);
      }
    } catch {
      // keep fallback
    }
  }

  function editCustomer(record: RecordItem | CustomerDetail) {
    let email = "";
    let phone = "";
    let status = record.status || "Active";

    if ("email" in record && record.email) {
      email = record.email;
      phone = record.phone || "";
    } else if (record.detail) {
      const parts = record.detail.split(" · ");
      email = parts[0] || "";
      phone = parts[1] || "";
    }

    setCustomerId(record.id);
    setForm({
      name: record.name || "",
      email: email,
      phone: phone,
      status: status,
    });
    setFormOpen(true);
  }

  async function deleteCustomer(record: { id: string; name: string }) {
    if (!window.confirm(`Are you sure you want to delete customer "${record.name}" (${record.id})?`)) {
      return;
    }
    const response = await fetch(`${apiUrl}/api/admin/customers/${record.id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await loadModule();
      notify(`Customer "${record.name}" deleted successfully!`);
      if (viewCustomer && viewCustomer.id === record.id) {
        setViewCustomer(null);
      }
    } else {
      const error = await response
        .json()
        .catch(() => ({ message: "Unable to delete customer" }));
      notify(error.message);
    }
  }
  async function saveOrder(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(
      `${apiUrl}/api/admin/orders${orderId ? `/${encodeURIComponent(orderId)}` : ""}`,
      {
        method: orderId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderForm,
          serviceId: orderForm.serviceId || undefined,
        }),
      },
    );
    if (response.ok) {
      await loadModule();
      setOrderOpen(false);
      setProductMenuOpen(false);
      setOrderId("");
      setOrderForm({
        customer: "",
        product: "",
        serviceId: "",
        cycle: "Monthly",
        amount: "",
        status: "Paid",
      });
      notify(
        orderId ? "Order updated successfully!" : "Order created successfully!",
      );
    } else {
      const error = await response
        .json()
        .catch(() => ({ message: "Unable to save order" }));
      notify(error.message);
    }
    setSaving(false);
  }

  async function openOrderModal(record: RecordItem) {
    const parts = (record.detail || "").split(" · ");
    const fallbackOrder: OrderDetail = {
      id: record.id,
      customer: record.name,
      product: record.product || parts[0] || "Web Hosting",
      amount: record.amount || parts[1] || "₹149",
      cycle: record.cycle || "Monthly",
      status: record.status || "Paid",
      date: record.date || "Sep 24, 2026",
      customerId: record.customerId,
      customerEmail: record.customerEmail,
    };
    setViewOrder(fallbackOrder);

    try {
      const res = await fetch(`${apiUrl}/api/admin/orders/${encodeURIComponent(record.id)}`);
      if (res.ok) {
        const fullOrder = await res.json();
        setViewOrder(fullOrder);
      }
    } catch {
      // keep fallback
    }
  }

  async function deleteOrder(record: { id: string; name?: string }) {
    if (!window.confirm(`Are you sure you want to delete order "${record.id}"?`)) {
      return;
    }
    const response = await fetch(`${apiUrl}/api/admin/orders/${encodeURIComponent(record.id)}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await loadModule();
      notify(`Order "${record.id}" deleted successfully!`);
      if (viewOrder && viewOrder.id === record.id) {
        setViewOrder(null);
      }
    } else {
      const error = await response
        .json()
        .catch(() => ({ message: "Unable to delete order" }));
      notify(error.message);
    }
  }
  async function saveService(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: serviceForm.price,
      popular: serviceForm.popular,
      status: serviceForm.status,
      features: serviceForm.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
    };
    const response = await fetch(
      `${apiUrl}/api/admin/services${serviceId ? `/${serviceId}` : ""}`,
      {
        method: serviceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (response.ok) {
      await loadModule();
      setServiceOpen(false);
      setServiceId("");
      setServiceForm({
        name: "",
        description: "",
        price: "",
        features: "",
        popular: false,
        status: "Active",
      });
      notify(
        serviceId
          ? "Service updated successfully"
          : "Service created successfully",
      );
    } else {
      const error = await response
        .json()
        .catch(() => ({ message: "Unable to save service" }));
      notify(error.message);
    }
    setSaving(false);
  }
  function editOrder(record: RecordItem | OrderDetail) {
    let customerName = "";
    let product = "";
    let amount = "";
    let cycle = "Monthly";
    let status = "Paid";
    let sId = "";

    const rec = record as RecordItem;
    const ord = record as OrderDetail;

    if (ord.customer) {
      customerName = ord.customer;
      product = ord.product || "";
      amount = ord.amount || "";
      cycle = ord.cycle || "Monthly";
      status = ord.status || "Paid";
      sId = ord.serviceId || "";
    } else {
      customerName = rec.name || "";
      const parts = (rec.detail || "").split(" · ");
      product = rec.product || parts[0] || "";
      amount = rec.amount || parts[1] || "";
      cycle = rec.cycle || "Monthly";
      status = rec.status || "Paid";
    }

    if (!customers.some((customer) => customer.name === customerName)) {
      setCustomers((current) => [
        ...current,
        { id: `order-${record.id}`, name: customerName },
      ]);
    }

    setOrderId(record.id);
    const matchedService = services.find(
      (service) => service.name === product || service.id === sId,
    );
    setOrderForm({
      customer: customerName,
      product: product,
      serviceId: matchedService ? matchedService.id : sId,
      cycle: cycle,
      amount: amount,
      status: status,
    });
    setProductMenuOpen(false);
    setOrderOpen(true);
  }
  async function editService(record: RecordItem) {
    setServiceId(record.id);
    try {
      const response = await fetch(`${apiUrl}/api/admin/services/${record.id}`);
      if (response.ok) {
        const fullService = await response.json();
        setServiceForm({
          name: fullService.name || record.name,
          description: fullService.description || "",
          price: fullService.price || (record.detail ? record.detail.split(" · ")[0] : ""),
          features: Array.isArray(fullService.features)
            ? fullService.features.join("\n")
            : (fullService.features || ""),
          popular: Boolean(fullService.popular),
          status: fullService.status || record.status || "Active",
        });
        setServiceOpen(true);
        return;
      }
    } catch {
      // fallback to basic parse
    }
    const [price, featureCount] = (record.detail || "").split(" · ");
    setServiceForm({
      name: record.name,
      description: record.description || "",
      price: record.price || price || "",
      features: record.features ? record.features.join("\n") : (featureCount ? `${featureCount} managed features` : ""),
      popular: Boolean(record.popular),
      status: record.status || "Active",
    });
    setServiceOpen(true);
  }
  async function openService(record: RecordItem) {
    try {
      const response = await fetch(`${apiUrl}/api/admin/services/${record.id}`);
      if (response.ok) {
        setViewService(await response.json());
        return;
      }
    } catch {
      // fallback
    }
    setViewService({
      id: record.id,
      name: record.name,
      description: record.description || "Comprehensive high-performance web hosting package managed by DataBrain.",
      price: record.price || (record.detail ? record.detail.split(" · ")[0] : "₹149"),
      status: record.status || "Active",
      popular: record.popular,
      features: record.features || ["1 Website", "10 GB NVMe Storage", "Free SSL Certificate", "Weekly Backups"]
    });
  }
  async function deleteService(record: RecordItem) {
    if (!window.confirm(`Delete ${record.name}? This cannot be undone.`)) return;
    const response = await fetch(`${apiUrl}/api/admin/services/${record.id}`, { method: "DELETE" });
    if (response.ok) { await loadModule(); notify("Service deleted successfully"); }
    else notify("Unable to delete service");
  }
  async function openDomain(record: RecordItem) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/domains/${record.id}`);
      if (res.ok) {
        setViewDomain(await res.json());
        return;
      }
    } catch {}
    setViewDomain(record.domain || {
      id: record.id,
      name: record.name,
      customer: record.customer || (record.detail ? record.detail.split(" · ")[0] : "Amit Sharma"),
      customerEmail: record.customerEmail || "client@databrainhost.com",
      registeredDate: record.registeredDate || "2025-10-14",
      expiryDate: record.expiryDate || "2026-10-14",
      status: record.status || "Active",
      autoRenew: record.autoRenew !== undefined ? record.autoRenew : true,
      locked: record.locked !== undefined ? record.locked : true,
      privacyProtection: record.privacyProtection !== undefined ? record.privacyProtection : true,
      authCode: record.authCode || "DB#8892_Trx",
      nameservers: record.nameservers || ["ns1.databrainhost.com", "ns2.databrainhost.com"],
      dnsRecords: record.dnsRecords || [
        { id: "rec-1", type: "A", name: "@", value: "185.199.108.153", ttl: "3600" },
        { id: "rec-2", type: "CNAME", name: "www", value: record.name, ttl: "3600" },
      ],
    });
  }
  async function editDomain(record: RecordItem) {
    setDomainId(record.id);
    let target = record.domain;
    if (!target) {
      try {
        const res = await fetch(`${apiUrl}/api/admin/domains/${record.id}`);
        if (res.ok) target = await res.json();
      } catch {}
    }
    const customer = target?.customer || record.customer || (record.detail ? record.detail.split(" · ")[0] : "");
    const email = target?.customerEmail || record.customerEmail || "";
    const expiry = target?.expiryDate || record.expiryDate || "";
    const reg = target?.registeredDate || record.registeredDate || "";
    const ns = target?.nameservers || record.nameservers || ["ns1.databrainhost.com", "ns2.databrainhost.com"];

    setDomainForm({
      name: target?.name || record.name,
      customer: customer || "Amit Sharma",
      customerEmail: email || "client@databrainhost.com",
      expiryDate: expiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      registeredDate: reg || new Date().toISOString().split("T")[0],
      status: target?.status || record.status || "Active",
      autoRenew: target?.autoRenew !== undefined ? target.autoRenew : true,
      locked: target?.locked !== undefined ? target.locked : true,
      privacyProtection: target?.privacyProtection !== undefined ? target.privacyProtection : true,
      primaryNs: ns[0] || "ns1.databrainhost.com",
      secondaryNs: ns[1] || "ns2.databrainhost.com",
    });
    setDomainOpen(true);
  }
  function openAddDomainModal() {
    setDomainId("");
    setDomainForm({
      name: "",
      customer: customers[0]?.name || "Amit Sharma",
      customerEmail: "client@databrainhost.com",
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      registeredDate: new Date().toISOString().split("T")[0],
      status: "Active",
      autoRenew: true,
      locked: true,
      privacyProtection: true,
      primaryNs: "ns1.databrainhost.com",
      secondaryNs: "ns2.databrainhost.com",
    });
    setDomainOpen(true);
  }
  async function saveDomain(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const url = domainId ? `${apiUrl}/api/admin/domains/${domainId}` : `${apiUrl}/api/admin/domains`;
    const method = domainId ? "PUT" : "POST";
    const body = {
      name: domainForm.name,
      customer: domainForm.customer,
      customerEmail: domainForm.customerEmail,
      expiryDate: domainForm.expiryDate,
      registeredDate: domainForm.registeredDate,
      status: domainForm.status,
      autoRenew: domainForm.autoRenew,
      locked: domainForm.locked,
      privacyProtection: domainForm.privacyProtection,
      nameservers: [domainForm.primaryNs, domainForm.secondaryNs].filter(Boolean),
    };
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      await loadModule();
      setDomainOpen(false);
      setDomainId("");
      notify(domainId ? "Domain updated successfully" : "Domain registered successfully");
    } else {
      const err = await response.json().catch(() => ({ message: "Unable to save domain" }));
      notify(err.message || "Unable to save domain");
    }
    setSaving(false);
  }
  async function deleteDomain(record: RecordItem) {
    if (!window.confirm(`Delete domain "${record.name}"? This cannot be undone.`)) return;
    const response = await fetch(`${apiUrl}/api/admin/domains/${record.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadModule();
      notify("Domain deleted successfully");
    } else {
      notify("Unable to delete domain");
    }
  }

  async function openTicket(record: RecordItem) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/support-tickets/${record.id}`);
      if (res.ok) {
        setViewTicket(await res.json());
        return;
      }
    } catch {}
    setViewTicket(record.ticket || {
      id: record.id,
      name: record.name,
      email: record.email || (record.detail && record.detail.includes("@") ? record.detail.split(" · ")[1] : "client@databrainhost.com"),
      phone: record.phone || "+91 98765 43210",
      service: record.service || (record.detail ? record.detail.split(" · ")[0] : "Web Hosting"),
      message: record.message || record.detail || "Customer inquiry regarding hosting service.",
      status: record.status || "Open",
      priority: record.priority || "Medium",
      department: record.department || "Technical Support",
      createdAt: record.createdAt || new Date().toISOString(),
      replies: record.replies || [],
    });
  }

  function editTicket(record: RecordItem | TicketDetail) {
    setTicketId(record.id);
    const email = record.email || ("detail" in record && record.detail && record.detail.includes("@") ? record.detail.split(" · ")[1] : "");
    const phone = record.phone || ("detail" in record && record.detail && !record.detail.includes("@") ? record.detail.split(" · ")[1] : "");
    const service = record.service || ("detail" in record && record.detail ? record.detail.split(" · ")[0] : "Cloud Hosting");

    setTicketForm({
      name: record.name,
      email: email || "amit@gmail.com",
      phone: phone || "+91 98765 43210",
      service: service || "Cloud Hosting",
      department: record.department || "Technical Support",
      priority: record.priority || "Medium",
      status: record.status || "Open",
      message: record.message || ("detail" in record ? record.detail : ""),
    });
    setTicketOpen(true);
  }

  function openAddTicketModal() {
    setTicketId("");
    setTicketForm({
      name: customers[0]?.name || "Amit Sharma",
      email: "amit@gmail.com",
      phone: "+91 98765 43210",
      service: "Cloud Hosting",
      department: "Technical Support",
      priority: "Medium",
      status: "Open",
      message: "",
    });
    setTicketOpen(true);
  }

  async function saveTicket(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const url = ticketId ? `${apiUrl}/api/admin/support-tickets/${ticketId}` : `${apiUrl}/api/admin/support-tickets`;
    const method = ticketId ? "PUT" : "POST";
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticketForm),
    });
    if (response.ok) {
      await loadModule();
      setTicketOpen(false);
      setTicketId("");
      notify(ticketId ? "Support ticket updated successfully" : "New support ticket created");
      if (viewTicket && viewTicket.id === ticketId) {
        setViewTicket({ ...viewTicket, ...ticketForm });
      }
    } else {
      const err = await response.json().catch(() => ({ message: "Unable to save ticket" }));
      notify(err.message || "Unable to save ticket");
    }
    setSaving(false);
  }

  async function quickUpdateTicketStatus(tId: string, newStatus: string) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/support-tickets/${tId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        if (viewTicket && viewTicket.id === tId) {
          setViewTicket(updated);
        }
        await loadModule();
        notify(`Ticket #${tId} status changed to ${newStatus}`);
      } else {
        notify("Failed to update ticket status");
      }
    } catch {
      notify("Network error updating status");
    }
  }

  async function sendAdminReply(targetStatus?: string) {
    if (!viewTicket || !adminReplyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`${apiUrl}/api/admin/support-tickets/${viewTicket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminReply: adminReplyText,
          replySender: companyProfile.name ? `${companyProfile.name} Support Team` : "DataBrain Support Engineer",
          status: targetStatus || viewTicket.status,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setViewTicket(updated);
        setAdminReplyText("");
        await loadModule();
        notify(`Staff reply posted & status is ${updated.status}`);
      } else {
        notify("Failed to send reply");
      }
    } catch {
      notify("Network error sending reply");
    }
    setSendingReply(false);
  }

  async function deleteTicket(record: RecordItem | { id: string; name: string }) {
    if (!window.confirm(`Delete ticket #${record.id} for "${record.name}"? This cannot be undone.`)) return;
    const response = await fetch(`${apiUrl}/api/admin/support-tickets/${record.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadModule();
      if (viewTicket && viewTicket.id === record.id) {
        setViewTicket(null);
      }
      notify(`Ticket #${record.id} deleted successfully`);
    } else {
      notify("Unable to delete support ticket");
    }
  }

  function openFaqModal(record: RecordItem) {
    setViewFaq(record);
    setTestFaqOpen(true);
  }
  function editFaq(record: RecordItem) {
    setFaqId(record.id);
    setFaqForm({
      question: record.question || record.name,
      answer: record.answer || "",
      category: record.category || "General",
      status: record.status || "Active",
    });
    setFaqOpen(true);
  }
  async function deleteFaq(record: RecordItem) {
    if (!window.confirm(`Delete FAQ: "${record.name}"? This cannot be undone.`)) return;
    const response = await fetch(`${apiUrl}/api/admin/faqs/${record.id}`, { method: "DELETE" });
    if (response.ok) {
      await loadModule();
      notify("FAQ deleted successfully");
    } else {
      notify("Unable to delete FAQ");
    }
  }
  async function saveFaq(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch(
      `${apiUrl}/api/admin/faqs${faqId ? `/${faqId}` : ""}`,
      {
        method: faqId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqForm),
      }
    );
    if (response.ok) {
      await loadModule();
      setFaqOpen(false);
      setFaqId("");
      setFaqForm({ question: "", answer: "", category: "General", status: "Active" });
      notify(faqId ? "FAQ updated successfully!" : "FAQ Question & Answer uploaded successfully!");
    } else {
      const error = await response.json().catch(() => ({ message: "Unable to save FAQ" }));
      notify(error.message);
    }
    setSaving(false);
  }
  async function openInvoice(record: RecordItem) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/invoices/${record.id}`);
      if (res.ok) {
        setViewInvoice(await res.json());
        return;
      }
    } catch {}
    setViewInvoice(record.invoice || {
      id: record.id,
      orderId: record.orderId || "#DB-10850",
      customer: record.customer || record.name,
      customerEmail: record.customerEmail || record.email || "",
      serviceName: record.serviceName || (record.detail ? record.detail.split(" · ")[0] : "Cloud Hosting Pro"),
      amount: record.amount || (record.detail && record.detail.includes(" · ") ? record.detail.split(" · ")[1] : "₹149"),
      total: record.total || record.amount || (record.detail && record.detail.includes(" · ") ? record.detail.split(" · ")[1] : "₹149"),
      status: record.status || "Paid",
      createdAt: record.createdAt || new Date().toISOString(),
      dueDate: record.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: record.paidAt,
      paymentId: record.paymentId,
      company: companyProfile,
    });
  }

  function openAddInvoiceModal() {
    setInvoiceId("");
    const defaultCust = customers[0]?.name || "Amit Sharma";
    const defaultServ = services[0]?.name || "Starter Plan";
    const defaultPrice = services[0]?.price || "₹149";
    setInvoiceForm({
      customer: defaultCust,
      customerEmail: "amit@gmail.com",
      serviceName: defaultServ,
      orderId: `#DB-${10843 + data.records.length}`,
      amount: defaultPrice,
      cycle: "Annual",
      status: "Unpaid",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
    setInvoiceOpen(true);
  }

  async function editInvoice(record: RecordItem | InvoiceDetail) {
    setInvoiceId(record.id);
    const recItem: RecordItem | null = ("detail" in record) ? (record as RecordItem) : null;
    let inv: InvoiceDetail | null = ("company" in record) ? (record as InvoiceDetail) : (recItem?.invoice || null);
    if (!inv) {
      try {
        const res = await fetch(`${apiUrl}/api/admin/invoices/${record.id}`);
        if (res.ok) inv = await res.json();
      } catch {}
    }
    const cust = inv?.customer || recItem?.customer || recItem?.name || "Customer";
    const email = inv?.customerEmail || recItem?.customerEmail || recItem?.email || "";
    const sName = inv?.serviceName || recItem?.serviceName || (recItem?.detail ? recItem.detail.split(" · ")[0] : "Cloud Hosting Pro");
    const amt = inv?.amount || recItem?.amount || (recItem?.detail && recItem.detail.includes(" · ") ? recItem.detail.split(" · ")[1] : "₹149");
    const st = inv?.status || record.status || "Unpaid";
    const due = inv?.dueDate ? inv.dueDate.split("T")[0] : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const ord = inv?.orderId || recItem?.orderId || "";

    setInvoiceForm({
      customer: cust,
      customerEmail: email,
      serviceName: sName,
      orderId: ord,
      amount: amt,
      cycle: "Annual",
      status: st,
      dueDate: due,
    });
    setInvoiceOpen(true);
  }

  async function saveInvoice(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const url = invoiceId ? `${apiUrl}/api/admin/invoices/${encodeURIComponent(invoiceId)}` : `${apiUrl}/api/admin/invoices`;
    const method = invoiceId ? "PUT" : "POST";
    const body = {
      customer: invoiceForm.customer,
      customerEmail: invoiceForm.customerEmail,
      serviceName: invoiceForm.serviceName,
      orderId: invoiceForm.orderId,
      amount: invoiceForm.amount,
      total: invoiceForm.amount,
      status: invoiceForm.status,
      dueDate: invoiceForm.dueDate,
    };
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      await loadModule();
      setInvoiceOpen(false);
      setInvoiceId("");
      notify(invoiceId ? "Invoice updated successfully!" : "Invoice created successfully!");
    } else {
      const err = await response.json().catch(() => ({ message: "Unable to save invoice" }));
      notify(err.message || "Unable to save invoice");
    }
    setSaving(false);
  }

  async function toggleInvoiceStatus(record: RecordItem | InvoiceDetail) {
    const nextStatus = record.status === "Paid" ? "Unpaid" : "Paid";
    const response = await fetch(`${apiUrl}/api/admin/invoices/${encodeURIComponent(record.id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (response.ok) {
      await loadModule();
      if (viewInvoice && viewInvoice.id === record.id) {
        setViewInvoice({
          ...viewInvoice,
          status: nextStatus,
          paidAt: nextStatus === "Paid" ? new Date().toISOString() : undefined,
          paymentId: nextStatus === "Paid" ? `pay_manual_${Date.now()}` : undefined,
        });
      }
      notify(`Invoice #${record.id} marked as ${nextStatus}!`);
    } else {
      notify("Unable to update invoice status.");
    }
  }

  async function deleteInvoice(record: RecordItem) {
    if (!window.confirm(`Are you sure you want to delete invoice #${record.id}? This will remove it from financial ledgers.`)) return;
    const response = await fetch(`${apiUrl}/api/admin/invoices/${encodeURIComponent(record.id)}`, {
      method: "DELETE",
    });
    if (response.ok) {
      await loadModule();
      notify(`Invoice #${record.id} deleted successfully.`);
    } else {
      notify("Unable to delete invoice.");
    }
  }

  function printInvoice(invoiceId: string) {
    fetch(`${apiUrl}/api/invoices/${invoiceId}`)
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((invoice) => {
        const printWindow = window.open("", "_blank", "width=900,height=1000");
        if (!printWindow) return notify("Popup blocked. Please allow popups to print the invoice.");
        const html = `
          <html>
            <head>
              <title>${invoice.id}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 32px; color: #0f172a; }
                .invoice { max-width: 820px; margin: 0 auto; border: 1px solid #dfeaf3; border-radius: 16px; padding: 28px; }
                .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
                .brand { display: flex; align-items: center; gap: 12px; }
                .brand img { width: 48px; height: 48px; border-radius: 12px; }
                .brand h2 { margin: 0; font-size: 22px; }
                .meta { text-align: right; font-size: 13px; line-height: 1.7; }
                .section-title { font-size: 12px; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
                .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
                .box { border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; }
                table { width: 100%; border-collapse: collapse; margin-top: 12px; }
                th, td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }
                th { background: #f8fafc; font-size: 12px; color: #475569; text-transform: uppercase; }
                .total-box { display: flex; justify-content: flex-end; margin-top: 20px; }
                .total-box table { width: 260px; }
                .footer { margin-top: 28px; font-size: 12px; color: #475569; }
              </style>
            </head>
            <body>
              <div class="invoice">
                <div class="top">
                  <div class="brand">
                    <img src="${companyProfile.logoUrl}" alt="${companyProfile.name}" />
                    <div>
                      <h2>${companyProfile.name}</h2>
                      <div>${companyProfile.website}</div>
                    </div>
                  </div>
                  <div class="meta">
                    <strong>Invoice ${invoice.id}</strong><br />
                    Issued: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}<br />
                    Due: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div class="details">
                  <div class="box">
                    <div class="section-title">Bill to</div>
                    <strong>${invoice.customer}</strong><br />
                    ${invoice.customerEmail || 'No email provided'}
                  </div>
                  <div class="box">
                    <div class="section-title">Company details</div>
                    ${companyProfile.email}<br />
                    ${companyProfile.phone}<br />
                    ${companyProfile.address}
                  </div>
                </div>
                <div class="section-title">Order summary</div>
                <table>
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Billing cycle</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${invoice.serviceName}</td>
                      <td>Annual</td>
                      <td>${invoice.amount}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="total-box">
                  <table>
                    <tr>
                      <td><strong>Total</strong></td>
                      <td><strong>${invoice.total}</strong></td>
                    </tr>
                  </table>
                </div>
                <div class="footer">
                  Thank you for choosing ${companyProfile.name}. This invoice was generated automatically for your service purchase.
                </div>
              </div>
            </body>
          </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 300);
      })
      .catch(() => notify("Unable to load invoice details."));
  }
  const filtered = data.records.filter((record) => {
    const matchesSearch = `${record.name} ${record.detail} ${record.question || ""} ${record.answer || ""} ${record.category || ""} ${record.id} ${record.customer || ""} ${record.serviceName || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (module === "knowledge-base" && kbCategoryFilter !== "All") {
      return (record.category || "General").toLowerCase() === kbCategoryFilter.toLowerCase();
    }
    if (module === "invoices" && invoiceFilter !== "All") {
      return (record.status || "Unpaid").toLowerCase() === invoiceFilter.toLowerCase();
    }
    return true;
  });

  return (
    <div className="app-shell">
      <aside className={`sidebar module-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="brand">
          <img
            src="https://databrainit.com/images/logo.png"
            alt="DataBrain IT Solutions logo"
          />
          <div className="brand-copy">
            <strong>DataBrain</strong>
            <span>Hosting console</span>
          </div>
          <button
            className="icon-button close-sidebar"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <nav className="main-nav">
          <a className="back-module" href="/admin">
            <ArrowLeft /> Dashboard
          </a>
          <p className="nav-label">Manage</p>
          {Object.entries(labels).map(([slug, label]) => (
            <a
              key={slug}
              className={`nav-item ${slug === module ? "active" : ""}`}
              href={`/admin/${slug}`}
            >
              <Settings2 />
              <span>{label}</span>
            </a>
          ))}
          <a className="nav-item" href="/admin/cms">
            <Server />
            <span>Website CMS</span>
          </a>
        </nav>
      </aside>
      <div
        className={`mobile-overlay ${menuOpen ? "show" : ""}`}
        onClick={() => setMenuOpen(false)}
      />
      <main className="main-content">
        <header className="topbar">
          <button
            className="menu-toggle icon-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{data.title}</strong>
          </div>
          <div className="top-actions">
            <div className="top-avatar avatar blue">AS</div>
          </div>
        </header>
        <div className="content-wrap module-content">
          <section className="module-heading">
            <div>
              <p className="eyebrow">Workspace / Manage</p>
              <h1>{data.title}</h1>
              <p className="subheading">{data.description}</p>
            </div>
            <div className="welcome-actions">
              <button
                className="button secondary"
                onClick={() => notify("Export is being prepared")}
              >
                <Download /> Export
              </button>
              <button
                className="button primary"
                onClick={() =>
                  module === "customers"
                    ? (setCustomerId(""), setForm({ name: "", email: "", phone: "", status: "Active" }), setFormOpen(true))
                    : module === "orders"
                      ? setOrderOpen(true)
                      : module === "services"
                        ? setServiceOpen(true)
                        : module === "domains"
                          ? openAddDomainModal()
                          : module === "support-tickets"
                            ? openAddTicketModal()
                            : module === "knowledge-base"
                            ? (setFaqId(""), setFaqForm({ question: "", answer: "", category: "General", status: "Active" }), setFaqOpen(true))
                            : module === "invoices"
                              ? openAddInvoiceModal()
                              : notify(`New ${data.title.toLowerCase()} form opened`)
                }
              >
                <Plus /> {module === "knowledge-base" ? "Add FAQ / Question" : module === "support-tickets" ? "New Ticket" : module === "invoices" ? "New Invoice" : "Add new"}
              </button>
            </div>
          </section>
          <section className="module-stats">
            <article className="panel">
              {module === "knowledge-base" ? <BookOpen /> : module === "support-tickets" ? <Headphones /> : module === "invoices" ? <FileText /> : <Users />}
              <div>
                <span>{module === "knowledge-base" ? "Total Articles" : module === "invoices" ? "Total Invoices" : "Total records"}</span>
                <strong>{data.count}</strong>
              </div>
            </article>
            <article className="panel">
              <CheckCircle2 />
              <div>
                <span>{module === "knowledge-base" ? "Published FAQs" : module === "support-tickets" ? "Pending / Open" : module === "invoices" ? "Paid Invoices" : "Active"}</span>
                <strong>
                  {
                    module === "support-tickets"
                      ? data.records.filter((record) => record.status === "Open" || record.status === "Pending").length
                      : module === "invoices"
                        ? data.records.filter((record) => record.status === "Paid").length
                        : data.records.filter((record) => record.status === "Active" || record.status === "Paid").length
                  }
                </strong>
              </div>
            </article>
            <article className="panel">
              {module === "knowledge-base" ? <HelpCircle /> : module === "invoices" ? <Clock /> : <Server />}
              <div>
                <span>{module === "knowledge-base" ? "Active Categories" : module === "invoices" ? "Pending / Unpaid" : "API status"}</span>
                <strong className={module === "knowledge-base" || module === "invoices" ? "" : "api-online"}>
                  {module === "knowledge-base"
                    ? new Set(data.records.map((record) => record.category || "General")).size
                    : module === "invoices"
                      ? data.records.filter((record) => record.status !== "Paid").length
                      : "Connected"}
                </strong>
              </div>
            </article>
          </section>
          <section className="panel module-table">
            <div className="module-toolbar">
              <div className="search-box">
                <Search />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${data.title.toLowerCase()}...`}
                />
              </div>
              <button
                className="button secondary"
                onClick={() => notify("Filters opened")}
              >
                <Settings2 /> Filters
              </button>
            </div>
            {module === "knowledge-base" && (
              <div className="kb-filter-bar">
                {["All", "Hosting", "Domains", "Billing", "Migration", "Technical", "Security", "General"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`kb-filter-tab ${kbCategoryFilter === cat ? "active" : ""}`}
                    onClick={() => setKbCategoryFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
            {module === "invoices" && (
              <div className="invoice-filter-bar">
                {(["All", "Paid", "Unpaid", "Overdue"] as const).map((st) => {
                  const count = st === "All"
                    ? data.records.length
                    : data.records.filter((r) => (r.status || "Unpaid").toLowerCase() === st.toLowerCase()).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      className={`invoice-filter-chip ${invoiceFilter === st ? "active" : ""}`}
                      onClick={() => setInvoiceFilter(st)}
                    >
                      {st}
                      <span className="invoice-filter-count">{count}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {filtered.length ? (
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th>{module === "knowledge-base" ? "Question & ID" : module === "customers" ? "Customer" : module === "orders" ? "Order & Customer" : module === "services" ? "Service Plan" : module === "domains" ? "Domain Name & ID" : module === "support-tickets" ? "Customer & Ticket ID" : module === "invoices" ? "Invoice # & Customer" : "Record"}</th>
                      <th>{module === "knowledge-base" ? "Category & Answer Snippet" : module === "customers" ? "Contact Details" : module === "orders" ? "Product & Billing" : module === "services" ? "Pricing & Features" : module === "domains" ? "Registrant & Expiration" : module === "support-tickets" ? "Service & Inquiry Details" : module === "invoices" ? "Service & Order Ref" : "Details"}</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right", paddingRight: 20 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((record) => (
                      <>
                        <tr
                          key={record.id}
                          style={module === "knowledge-base" ? { cursor: "pointer" } : undefined}
                          onClick={module === "knowledge-base" ? () => setExpandedFaqId(expandedFaqId === record.id ? null : record.id) : undefined}
                        >
                          <td>
                            {module === "customers" ? (
                              <div
                                className="customer-row-user"
                                onClick={() => openCustomer(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view ${record.name}'s profile`}
                              >
                                <div className={`customer-avatar-badge avatar ${['blue', 'violet', 'green', 'orange', 'pink'][(record.name.charCodeAt(0) || 0) % 5]}`}>
                                  {record.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="customer-info-meta">
                                  <strong className="customer-display-name">{record.name}</strong>
                                  <span className="customer-id-pill">#{record.id}</span>
                                </div>
                              </div>
                            ) : module === "orders" ? (
                              <div
                                className="order-row-user"
                                onClick={() => openOrderModal(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view order ${record.id} details`}
                              >
                                <div className={`order-avatar-badge avatar ${['blue', 'violet', 'green', 'orange', 'pink'][(record.name.charCodeAt(0) || 0) % 5]}`}>
                                  {record.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="order-info-meta">
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <strong className="order-display-name">{record.name}</strong>
                                    <span className="order-id-pill">{record.id}</span>
                                  </div>
                                  <span className="order-date-text">{record.date || "Sep 24, 2026"}</span>
                                </div>
                              </div>
                            ) : module === "services" ? (
                              <div
                                className="service-row-item"
                                onClick={() => openService(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view ${record.name} plan details`}
                              >
                                <div className="service-avatar-badge">
                                  <Server />
                                </div>
                                <div className="service-info-meta">
                                  <div className="service-title-row">
                                    <strong className="service-display-name">{record.name}</strong>
                                    <span className="service-id-pill">#{record.id}</span>
                                    {record.popular && (
                                      <span className="service-popular-pill">★ Popular</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : module === "domains" ? (
                              <div
                                className="domain-row-item"
                                onClick={() => openDomain(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view ${record.name} domain details`}
                              >
                                <div className="domain-avatar-badge">
                                  <Globe />
                                </div>
                                <div className="domain-info-meta">
                                  <div className="domain-title-row">
                                    <strong className="domain-display-name">{record.name}</strong>
                                    <span className="domain-id-pill">#{record.id}</span>
                                    {record.locked && (
                                      <span className="domain-feature-pill locked" title="Domain Transfer Lock Active">
                                        <Lock style={{ width: 10, height: 10 }} /> Locked
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : module === "support-tickets" ? (
                              <div
                                className="ticket-row-item"
                                onClick={() => openTicket(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view ticket #${record.id} thread`}
                              >
                                <div className="ticket-avatar-badge">
                                  <Headphones />
                                </div>
                                <div className="ticket-info-meta">
                                  <div className="ticket-title-row">
                                    <strong className="ticket-customer-name">{record.name}</strong>
                                    <span className="ticket-id-pill">#{record.id}</span>
                                  </div>
                                  {(record.email || record.ticket?.email) && (
                                    <span className="ticket-email-text">
                                      <Mail style={{ width: 11, height: 11 }} /> {record.email || record.ticket?.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : module === "knowledge-base" ? (
                              <div className="kb-row-item">
                                <button
                                  type="button"
                                  className={`kb-chevron-btn ${expandedFaqId === record.id ? "expanded" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedFaqId(expandedFaqId === record.id ? null : record.id);
                                  }}
                                  title={expandedFaqId === record.id ? "Collapse answer" : "Expand answer"}
                                  aria-label={expandedFaqId === record.id ? "Collapse answer" : "Expand answer"}
                                >
                                  <ChevronDown />
                                </button>
                                <div
                                  className="kb-avatar-badge"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFaqModal(record);
                                  }}
                                  title="Click to view full FAQ"
                                >
                                  <HelpCircle />
                                </div>
                                <div className="kb-info-meta">
                                  <div className="kb-title-row">
                                    <strong
                                      className="kb-question-title"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openFaqModal(record);
                                      }}
                                      title="Click to view question & answer"
                                    >
                                      {record.question || record.name}
                                    </strong>
                                    <span className="kb-id-pill">#{record.id}</span>
                                  </div>
                                </div>
                              </div>
                            ) : module === "invoices" ? (
                              <div
                                className="invoice-row-item"
                                onClick={() => openInvoice(record)}
                                style={{ cursor: "pointer" }}
                                title={`Click to view invoice #${record.id}`}
                              >
                                <div className={`invoice-avatar-badge ${(record.status || "Unpaid").toLowerCase()}`}>
                                  <FileText />
                                </div>
                                <div className="invoice-info-meta">
                                  <div className="invoice-title-row">
                                    <strong className="invoice-customer-name">{record.customer || record.name}</strong>
                                    <span className="invoice-id-pill">#{record.id}</span>
                                  </div>
                                  {(record.customerEmail || record.email) && (
                                    <span className="invoice-email-text">
                                      <Mail style={{ width: 11, height: 11 }} /> {record.customerEmail || record.email}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div>
                                  <strong>{record.name}</strong>
                                  <span>{record.id}</span>
                                </div>
                              </div>
                            )}
                          </td>
                          <td>
                            {module === "customers" ? (
                              <div className="customer-contact-wrap">
                                <div className="customer-email-line">
                                  <Mail className="contact-icon" />
                                  <span>{record.detail ? record.detail.split(" · ")[0] : "No email"}</span>
                                </div>
                                {record.detail && record.detail.includes(" · ") && (
                                  <div className="customer-phone-line">
                                    <Phone className="contact-icon" />
                                    <span>{record.detail.split(" · ")[1]}</span>
                                  </div>
                                )}
                              </div>
                            ) : module === "orders" ? (
                              <div className="order-details-wrap">
                                <div className="order-product-line">
                                  <Server className="order-icon" />
                                  <strong className="order-product-name">{record.product || record.detail.split(" · ")[0]}</strong>
                                </div>
                                <div className="order-amount-line">
                                  <span className="order-amount-badge">{record.amount || record.detail.split(" · ")[1] || "₹149"}</span>
                                  <span className="order-cycle-text">{record.cycle || "Monthly"}</span>
                                </div>
                              </div>
                            ) : module === "services" ? (
                              <div className="service-details-wrap">
                                <div className="service-metrics-line">
                                  <span className="service-price-badge">
                                    {record.price || (record.detail ? record.detail.split(" · ")[0] : "₹149")} / mo
                                  </span>
                                  <span className="service-features-badge">
                                    <CheckCircle2 style={{ width: 12, height: 12 }} />
                                    {record.features ? `${record.features.length} features` : (record.detail ? record.detail.split(" · ")[1] || "4 features" : "Managed")}
                                  </span>
                                </div>
                                {record.description && (
                                  <span className="service-desc-snippet" title={record.description}>
                                    {record.description}
                                  </span>
                                )}
                              </div>
                            ) : module === "domains" ? (
                              <div className="domain-details-wrap">
                                <div className="domain-owner-line">
                                  <strong className="domain-owner-name">{record.customer || (record.detail ? record.detail.split(" · ")[0] : "Customer")}</strong>
                                  {record.customerEmail && (
                                    <span className="domain-owner-email">({record.customerEmail})</span>
                                  )}
                                </div>
                                <div className="domain-metrics-line">
                                  <span className="domain-expiry-badge">
                                    <Calendar style={{ width: 12, height: 12 }} />
                                    {record.expiryDate ? `Expires ${record.expiryDate}` : (record.detail && record.detail.includes("Expires ") ? record.detail.split(" · ")[1] : "Active Period")}
                                  </span>
                                  <span className="domain-dns-badge">
                                    <CheckCircle2 style={{ width: 11, height: 11 }} />
                                    {record.dnsRecords ? `${record.dnsRecords.length} DNS records` : "DNS Configured"}
                                  </span>
                                  {record.autoRenew && (
                                    <span className="domain-feature-pill autorenew" title="Auto-renewal is enabled">
                                      ⚡ Auto-renew
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : module === "support-tickets" ? (
                              <div className="ticket-details-wrap">
                                <div className="ticket-metrics-line">
                                  <span className="ticket-service-badge">
                                    <Server style={{ width: 11, height: 11 }} />
                                    {record.service || (record.detail ? record.detail.split(" · ")[0] : "Hosting Support")}
                                  </span>
                                  <span className={`ticket-priority-badge ${(record.priority || "Medium").toLowerCase()}`}>
                                    {record.priority || "Medium"}
                                  </span>
                                  {(record.phone || record.ticket?.phone) && (
                                    <span className="ticket-phone-badge">
                                      <Phone style={{ width: 11, height: 11 }} /> {record.phone || record.ticket?.phone}
                                    </span>
                                  )}
                                  {(record.createdAt || record.ticket?.createdAt) && (
                                    <span className="ticket-date-badge">
                                      <Calendar style={{ width: 11, height: 11 }} />
                                      {new Date(record.createdAt || record.ticket?.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <div className="ticket-snippet" title={record.message || record.detail}>
                                  {record.message || record.detail}
                                </div>
                              </div>
                            ) : module === "knowledge-base" ? (
                              <div className="kb-details-wrap">
                                <div className="kb-metrics-line">
                                  <span className={`kb-category-pill cat-${(record.category || 'general').toLowerCase()}`}>
                                    {record.category || "General"}
                                  </span>
                                  <span className="kb-votes-pill" title="Helpful votes from clients">
                                    <ThumbsUp style={{ width: 11, height: 11 }} /> {record.helpfulVotes ?? 0} helpful
                                  </span>
                                </div>
                                <div className="kb-answer-snippet" title={record.answer || record.detail}>
                                  {record.answer || record.detail || "No answer provided"}
                                </div>
                              </div>
                            ) : module === "invoices" ? (
                              <div className="invoice-details-wrap">
                                <div className="invoice-service-line">
                                  <Server className="invoice-icon" />
                                  <strong className="invoice-service-name">
                                    {record.serviceName || (record.detail ? record.detail.split(" · ")[0] : "Cloud Hosting Pro")}
                                  </strong>
                                </div>
                                <div className="invoice-order-line">
                                  <span className="invoice-amount-text" style={{ fontSize: "13px", color: "#0284c7" }}>
                                    {record.total || record.amount || (record.detail && record.detail.includes(" · ") ? record.detail.split(" · ")[1] : "₹149")}
                                  </span>
                                  <span className="invoice-order-ref">{record.orderId || "#DB-Direct"}</span>
                                  {record.dueDate && (
                                    <span className="invoice-date-line" style={{ fontSize: "11px", color: "#64748b" }}>
                                      <Calendar style={{ width: 10, height: 10 }} />
                                      Due {new Date(record.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              record.detail
                            )}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${record.status.toLowerCase()}`}
                            >
                              <span className="status-dot" /> {record.status}
                            </span>
                          </td>
                          <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "right" }}>
                            {module === "services" ? (
                              <div className="service-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openService(record);
                                  }}
                                  title={`View ${record.name} details`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editService(record);
                                  }}
                                  title={`Edit ${record.name}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteService(record);
                                  }}
                                  title={`Delete ${record.name}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "knowledge-base" ? (
                              <div className="kb-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFaqModal(record);
                                  }}
                                  title={`View full FAQ #${record.id}`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editFaq(record);
                                  }}
                                  title={`Edit FAQ #${record.id}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteFaq(record);
                                  }}
                                  title={`Delete FAQ #${record.id}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "customers" ? (
                              <div className="customer-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCustomer(record);
                                  }}
                                  title={`View ${record.name}'s profile`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editCustomer(record);
                                  }}
                                  title={`Edit ${record.name}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCustomer(record);
                                  }}
                                  title={`Delete ${record.name}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "orders" ? (
                              <div className="order-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderModal(record);
                                  }}
                                  title={`View order ${record.id}`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editOrder(record);
                                  }}
                                  title={`Edit order ${record.id}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteOrder(record);
                                  }}
                                  title={`Delete order ${record.id}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "domains" ? (
                              <div className="domain-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDomain(record);
                                  }}
                                  title={`View ${record.name} details`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editDomain(record);
                                  }}
                                  title={`Edit ${record.name}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteDomain(record);
                                  }}
                                  title={`Delete ${record.name}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "support-tickets" ? (
                              <div className="ticket-actions">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openTicket(record);
                                  }}
                                  title={`View ticket #${record.id} details & conversation`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editTicket(record);
                                  }}
                                  title={`Edit ticket #${record.id}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTicket(record);
                                  }}
                                  title={`Delete ticket #${record.id}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : module === "invoices" ? (
                              <div className="action-buttons-wrap">
                                <button
                                  type="button"
                                  className="action-btn view-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openInvoice(record);
                                  }}
                                  title={`View invoice #${record.id}`}
                                >
                                  <Eye /> View
                                </button>
                                <button
                                  type="button"
                                  className="action-btn download-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    printInvoice(record.id);
                                  }}
                                  title="Download / Print PDF"
                                >
                                  <Printer /> Print
                                </button>
                                <button
                                  type="button"
                                  className={`action-btn ${record.status === "Paid" ? "unpaid-toggle-btn" : "paid-toggle-btn"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleInvoiceStatus(record);
                                  }}
                                  title={record.status === "Paid" ? "Mark as Unpaid" : "Mark as Paid"}
                                >
                                  <Check /> {record.status === "Paid" ? "Unpaid" : "Paid"}
                                </button>
                                <button
                                  type="button"
                                  className="action-btn edit-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    editInvoice(record);
                                  }}
                                  title={`Edit invoice #${record.id}`}
                                >
                                  <Edit3 /> Edit
                                </button>
                                <button
                                  type="button"
                                  className="action-btn delete-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteInvoice(record);
                                  }}
                                  title={`Delete invoice #${record.id}`}
                                >
                                  <Trash2 /> Delete
                                </button>
                              </div>
                            ) : (
                              <button className="text-link" onClick={() => notify(`Editing ${record.name}`)}>Edit</button>
                            )}
                          </td>
                        </tr>
                        {module === "knowledge-base" && expandedFaqId === record.id && (
                          <tr key={`${record.id}-drawer`} className="faq-expanded-drawer">
                            <td colSpan={4}>
                              <div className="kb-drawer-card">
                                <div className="kb-drawer-header">
                                  <span className="kb-drawer-badge">
                                    <CheckCircle2 style={{ width: 13, height: 13 }} /> VERIFIED ANSWER
                                  </span>
                                  <div className="kb-drawer-actions">
                                    <button
                                      type="button"
                                      className="kb-copy-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(record.answer || record.detail || "");
                                        setCopiedFaqId(record.id);
                                        setTimeout(() => setCopiedFaqId(null), 2000);
                                        notify("Answer copied to clipboard!");
                                      }}
                                    >
                                      {copiedFaqId === record.id ? (
                                        <>
                                          <Check style={{ width: 12, height: 12, color: "#16a34a" }} /> Copied!
                                        </>
                                      ) : (
                                        <>
                                          <Copy style={{ width: 12, height: 12 }} /> Copy Answer
                                        </>
                                      )}
                                    </button>
                                    <button
                                      type="button"
                                      className="action-btn view-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        openFaqModal(record);
                                      }}
                                      title="Open full view modal"
                                    >
                                      <Eye /> View Full
                                    </button>
                                    <button
                                      type="button"
                                      className="action-btn edit-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        editFaq(record);
                                      }}
                                      title="Edit question & answer"
                                    >
                                      <Edit3 /> Edit
                                    </button>
                                  </div>
                                </div>
                                <div className="kb-drawer-content">
                                  <p>{record.answer || record.detail || "No answer provided yet."}</p>
                                </div>
                                <div className="kb-drawer-footer">
                                  <div className="kb-drawer-meta">
                                    <span>Category: <strong className={`kb-category-pill cat-${(record.category || 'general').toLowerCase()}`}>{record.category || "General"}</strong></span>
                                    <span>Status: <strong style={{ color: record.status === "Active" ? "#16a34a" : "#ca8a04" }}>● {record.status}</strong></span>
                                    <span>Article ID: <strong>#{record.id}</strong></span>
                                    <span>Helpful Feedback: <strong>{record.helpfulVotes ?? 0} upvotes</strong></span>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-module">
                <Settings2 />
                <h2>No records found</h2>
                <p>
                  Connect this module's provider or add your first record to
                  begin.
                </p>
                <button
                  className="button primary"
                  onClick={() =>
                    module === "customers"
                      ? setFormOpen(true)
                      : module === "orders"
                        ? (setOrderId(""), setOrderForm({ customer: "", product: "", serviceId: "", cycle: "Monthly", amount: "", status: "Paid" }), setOrderOpen(true))
                        : module === "services"
                          ? setServiceOpen(true)
                          : module === "knowledge-base"
                            ? (setFaqId(""), setFaqForm({ question: "", answer: "", category: "General", status: "Active" }), setFaqOpen(true))
                            : notify(`New ${data.title.toLowerCase()} form opened`)
                  }
                >
                  <Plus /> Add record
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
      {formOpen && (
        <div className="customer-modal-backdrop" onClick={() => setFormOpen(false)}>
          <form className="customer-modal" onSubmit={saveCustomer} onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Customers</p>
                <h2>{customerId ? "Edit customer" : "Add customer"}</h2>
                <p>{customerId ? "Update customer profile and contact details." : "Create a customer and add them to your workspace."}</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setFormOpen(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>
            <label>
              Full name
              <input
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Rohan Kapoor"
              />
            </label>
            <label>
              Email address
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                placeholder="customer@example.com"
              />
            </label>
            <label>
              Phone number
              <input
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                placeholder="e.g. +91 98765 43210"
              />
            </label>
            <label>
              Account Status
              <select
                value={form.status}
                onChange={(event) =>
                  setForm({ ...form, status: event.target.value })
                }
                className="customer-select"
              >
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
            </label>
            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setFormOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                {saving ? "Saving..." : customerId ? "Save changes" : "Create customer"} {customerId ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Plus />}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewCustomer && (
        <div className="customer-modal-backdrop" onClick={() => setViewCustomer(null)}>
          <div className="customer-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="customer-view-header">
              <div className="customer-view-title-wrap">
                <div className={`customer-avatar-large avatar ${['blue', 'violet', 'green', 'orange', 'pink'][(viewCustomer.name.charCodeAt(0) || 0) % 5]}`}>
                  {viewCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2>{viewCustomer.name}</h2>
                    <span className={`status-badge ${(viewCustomer.status || 'Active').toLowerCase()}`}>
                      <span className="status-dot" /> {viewCustomer.status || 'Active'}
                    </span>
                  </div>
                  <span className="customer-id-pill">Customer ID: #{viewCustomer.id}</span>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setViewCustomer(null)}
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>

            <div className="customer-view-body">
              <div className="customer-view-grid">
                <div className="view-card">
                  <span className="view-card-label"><Mail style={{ width: 13, height: 13 }} /> Email Address</span>
                  <strong className="view-card-value">
                    {viewCustomer.email || (viewCustomer.detail ? viewCustomer.detail.split(" · ")[0] : "No email")}
                  </strong>
                </div>
                <div className="view-card">
                  <span className="view-card-label"><Phone style={{ width: 13, height: 13 }} /> Contact Phone</span>
                  <strong className="view-card-value">
                    {viewCustomer.phone || (viewCustomer.detail && viewCustomer.detail.includes(" · ") ? viewCustomer.detail.split(" · ")[1] : "Not provided")}
                  </strong>
                </div>
                <div className="view-card">
                  <span className="view-card-label"><CheckCircle2 style={{ width: 13, height: 13 }} /> Account Status</span>
                  <strong className={`view-card-value ${(viewCustomer.status || 'Active').toLowerCase() === 'active' ? 'text-green' : ''}`}>
                    {viewCustomer.status || 'Active'}
                  </strong>
                </div>
                <div className="view-card">
                  <span className="view-card-label"><Server style={{ width: 13, height: 13 }} /> Workspace Tier</span>
                  <strong className="view-card-value">Cloud Hosting Client</strong>
                </div>
              </div>

              {viewCustomer.orders && viewCustomer.orders.length > 0 && (
                <div className="customer-section-orders">
                  <h3>Associated Orders ({viewCustomer.orders.length})</h3>
                  <div className="orders-mini-list">
                    {viewCustomer.orders.map((ord) => (
                      <div key={ord.id} className="order-mini-item">
                        <div>
                          <strong>{ord.product}</strong>
                          <span>{ord.id}</span>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <strong>{ord.amount}</strong>
                          <span className={`status ${(ord.status || 'Active').toLowerCase()}`}>{ord.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary danger-button"
                onClick={() => {
                  deleteCustomer({ id: viewCustomer.id, name: viewCustomer.name });
                }}
              >
                <Trash2 style={{ width: 14, height: 14 }} /> Delete
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  const targetCustomer = viewCustomer;
                  setViewCustomer(null);
                  editCustomer(targetCustomer);
                }}
              >
                <Edit3 style={{ width: 14, height: 14 }} /> Edit
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => setViewCustomer(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {viewOrder && (
        <div className="customer-modal-backdrop" onClick={() => setViewOrder(null)}>
          <div className="order-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-view-header">
              <div className="order-view-title-wrap">
                <div className={`order-avatar-large avatar ${['blue', 'violet', 'green', 'orange', 'pink'][(viewOrder.customer.charCodeAt(0) || 0) % 5]}`}>
                  {viewOrder.customer.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h2>Order {viewOrder.id}</h2>
                    <span className={`status-badge ${(viewOrder.status || 'Paid').toLowerCase()}`}>
                      <span className="status-dot" /> {viewOrder.status || 'Paid'}
                    </span>
                  </div>
                  <span className="order-id-pill" style={{ marginTop: '3px' }}>Date: {viewOrder.date || 'Sep 24, 2026'}</span>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setViewOrder(null)}
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>

            <div className="order-view-body">
              <div className="order-view-grid">
                <div className="view-card">
                  <span className="view-card-label"><Users style={{ width: 13, height: 13 }} /> Customer</span>
                  <strong className="view-card-value">{viewOrder.customer}</strong>
                  {viewOrder.customerId && <span style={{ fontSize: '11px', color: '#64748b' }}>#{viewOrder.customerId}</span>}
                </div>
                <div className="view-card">
                  <span className="view-card-label"><Mail style={{ width: 13, height: 13 }} /> Customer Email</span>
                  <strong className="view-card-value">
                    {viewOrder.customerEmail || (viewOrder.customerDetail ? viewOrder.customerDetail.email || viewOrder.customerDetail.detail?.split(' · ')[0] : 'N/A')}
                  </strong>
                </div>
                <div className="view-card">
                  <span className="view-card-label"><Server style={{ width: 13, height: 13 }} /> Service / Product</span>
                  <strong className="view-card-value">{viewOrder.product}</strong>
                </div>
                <div className="view-card">
                  <span className="view-card-label"><CheckCircle2 style={{ width: 13, height: 13 }} /> Billing Cycle</span>
                  <strong className="view-card-value">{viewOrder.cycle || 'Monthly'}</strong>
                </div>
                <div className="view-card order-view-fullwidth" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <span className="view-card-label" style={{ color: '#166534' }}>Total Order Amount</span>
                  <strong className="view-card-value" style={{ fontSize: '20px', color: '#15803d' }}>{viewOrder.amount}</strong>
                </div>
              </div>

              {viewOrder.invoiceDetail && (
                <div className="invoice-preview-card">
                  <div className="invoice-preview-left">
                    <BookOpen />
                    <div>
                      <strong>Invoice #{viewOrder.invoiceDetail.id}</strong>
                      <span>Status: {viewOrder.invoiceDetail.status} • Total: {viewOrder.invoiceDetail.total || viewOrder.invoiceDetail.amount}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button secondary"
                    style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    onClick={() => printInvoice(viewOrder.invoiceDetail!.id)}
                  >
                    <Download style={{ width: 13, height: 13 }} /> Invoice PDF
                  </button>
                </div>
              )}
            </div>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary danger-button"
                onClick={() => {
                  deleteOrder({ id: viewOrder.id, name: viewOrder.customer });
                }}
              >
                <Trash2 style={{ width: 14, height: 14 }} /> Delete Order
              </button>
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  const target = viewOrder;
                  setViewOrder(null);
                  editOrder(target);
                }}
              >
                <Edit3 style={{ width: 14, height: 14 }} /> Edit Order
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {orderOpen && (
        <div className="customer-modal-backdrop" onClick={() => setOrderOpen(false)}>
          <form className="customer-modal" onSubmit={saveOrder} onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Orders</p>
                <h2>{orderId ? `Edit Order (${orderId})` : "Create New Order"}</h2>
                <p>{orderId ? "Update order service, cycle, pricing and status." : "Create a new order and generate an automatic invoice."}</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setOrderOpen(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>
            <label>
              Customer Name
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  required
                  value={orderForm.customer}
                  onChange={(event) =>
                    setOrderForm({ ...orderForm, customer: event.target.value })
                  }
                  placeholder="Customer name"
                  style={{ flex: 1 }}
                />
                {customers.length > 0 && (
                  <select
                    value=""
                    onChange={(event) => {
                      if (event.target.value) {
                        setOrderForm({ ...orderForm, customer: event.target.value });
                      }
                    }}
                    style={{ width: '130px', marginTop: '6px' }}
                    title="Select existing customer"
                  >
                    <option value="">Existing...</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </label>
            <label>
              Product / Service
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  required
                  value={orderForm.product}
                  onChange={(event) =>
                    setOrderForm({ ...orderForm, product: event.target.value })
                  }
                  placeholder="Hosting plan or service"
                  style={{ flex: 1 }}
                />
                {services.length > 0 && (
                  <select
                    value=""
                    onChange={(event) => {
                      const selected = services.find((s) => s.id === event.target.value);
                      if (selected) {
                        setOrderForm({
                          ...orderForm,
                          product: selected.name,
                          serviceId: selected.id,
                          amount: selected.price,
                        });
                      }
                    }}
                    style={{ width: '130px', marginTop: '6px' }}
                    title="Select standard service"
                  >
                    <option value="">Services...</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.price})</option>
                    ))}
                  </select>
                )}
              </div>
            </label>
            <div className="cms-form-grid">
              <label>
                Billing cycle
                <select
                  value={orderForm.cycle}
                  onChange={(event) =>
                    setOrderForm({ ...orderForm, cycle: event.target.value })
                  }
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                  <option value="2 years">2 years</option>
                </select>
              </label>
              <label>
                Amount
                <input
                  required
                  value={orderForm.amount}
                  onChange={(event) =>
                    setOrderForm({ ...orderForm, amount: event.target.value })
                  }
                  placeholder="₹149"
                />
              </label>
            </div>
            <label>
              Order Status
              <select
                value={orderForm.status}
                onChange={(event) =>
                  setOrderForm({ ...orderForm, status: event.target.value })
                }
              >
                <option value="Paid">Paid</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Refunded">Refunded</option>
              </select>
            </label>
            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setOrderOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : orderId
                    ? "Update order"
                    : "Create order"}{" "}
                {orderId ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Plus />}
              </button>
            </div>
          </form>
        </div>
      )}
      {serviceOpen && (
        <div className="customer-modal-backdrop" onClick={() => setServiceOpen(false)}>
          <form
            className="customer-modal"
            style={{ width: "min(100%, 540px)" }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={saveService}
          >
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Service Catalog</p>
                <h2>{serviceId ? "Edit Service Plan" : "Add New Service Plan"}</h2>
                <p>Configure pricing, allocated resources and customer features.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setServiceOpen(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>
            <label>
              Service Plan Name
              <input
                required
                value={serviceForm.name}
                onChange={(event) =>
                  setServiceForm({ ...serviceForm, name: event.target.value })
                }
                placeholder="e.g. Starter, Business, Cloud Pro"
              />
            </label>
            <label>
              Short Plan Description
              <textarea
                required
                rows={2}
                value={serviceForm.description}
                onChange={(event) =>
                  setServiceForm({
                    ...serviceForm,
                    description: event.target.value,
                  })
                }
                placeholder="Briefly describe what this hosting plan offers"
              />
            </label>
            <div className="cms-form-grid">
              <label>
                Price (with currency)
                <input
                  required
                  value={serviceForm.price}
                  onChange={(event) =>
                    setServiceForm({
                      ...serviceForm,
                      price: event.target.value,
                    })
                  }
                  placeholder="e.g. ₹149, ₹299"
                />
              </label>
              <label>
                Status
                <select
                  value={serviceForm.status}
                  onChange={(event) =>
                    setServiceForm({
                      ...serviceForm,
                      status: event.target.value,
                    })
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
            <label>
              Features & Resources <small style={{ fontWeight: 400, color: "#64748b" }}>(One feature per line)</small>
              <textarea
                rows={4}
                value={serviceForm.features}
                onChange={(event) =>
                  setServiceForm({
                    ...serviceForm,
                    features: event.target.value,
                  })
                }
                placeholder={"1 Website\n10 GB NVMe Storage\nFree SSL Certificate\nWeekly Backups"}
              />
            </label>
            <label className="service-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px' }}>
              <input
                type="checkbox"
                checked={serviceForm.popular}
                onChange={(event) =>
                  setServiceForm({
                    ...serviceForm,
                    popular: event.target.checked,
                  })
                }
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Mark as Most Popular plan badge</span>
            </label>
            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setServiceOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : serviceId
                    ? "Update Service"
                    : "Create Service"}{" "}
                {serviceId ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Plus />}
              </button>
            </div>
          </form>
        </div>
      )}
      {viewService && (
        <div className="customer-modal-backdrop" onClick={() => setViewService(null)}>
          <section
            className="service-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="service-view-header">
              <div className="service-view-title-wrap">
                <div className="service-avatar-large">
                  <Server />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h2>{viewService.name}</h2>
                    <span className="service-id-pill">#{viewService.id}</span>
                    {viewService.popular && (
                      <span className="service-popular-pill">★ Most Popular</span>
                    )}
                  </div>
                  <span className={`status-badge ${(viewService.status || 'Active').toLowerCase()}`}>
                    <span className="status-dot" /> {viewService.status}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setViewService(null)}
                aria-label="Close details"
              >
                <X />
              </button>
            </div>

            <div className="service-view-grid">
              <div className="service-metric-card">
                <span>Monthly Pricing</span>
                <strong style={{ color: '#047857' }}>{viewService.price}</strong>
              </div>
              <div className="service-metric-card">
                <span>Total Features</span>
                <strong>{viewService.features ? viewService.features.length : 0} included</strong>
              </div>
              <div className="service-metric-card">
                <span>Plan Category</span>
                <strong>Cloud Hosting</strong>
              </div>
            </div>

            {viewService.description && (
              <div className="service-desc-card">
                <span>Plan Overview</span>
                <p>{viewService.description}</p>
              </div>
            )}

            <div className="service-features-list-wrap">
              <h3>Included Features & Allocations</h3>
              {viewService.features && viewService.features.length ? (
                <div className="service-features-grid">
                  {viewService.features.map((feature: string, idx: number) => (
                    <div key={idx} className="service-feature-item">
                      <CheckCircle2 style={{ width: 14, height: 14, color: '#10b981', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: '8px 0' }}>No specific features listed for this service.</p>
              )}
            </div>

            <div className="customer-modal-actions" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="button secondary"
                onClick={() => setViewService(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  const s = viewService;
                  setViewService(null);
                  editService({
                    id: s.id,
                    name: s.name,
                    detail: `${s.price} · ${s.features?.length || 0} features`,
                    status: s.status,
                    price: s.price,
                    description: s.description,
                    popular: s.popular,
                    features: s.features,
                  });
                }}
              >
                <Edit3 style={{ width: 14, height: 14 }} /> Edit Plan
              </button>
            </div>
          </section>
        </div>
      )}
      {domainOpen && (
        <div className="customer-modal-backdrop" onClick={() => setDomainOpen(false)}>
          <form
            className="customer-modal"
            style={{ width: "min(100%, 560px)" }}
            onClick={(e) => e.stopPropagation()}
            onSubmit={saveDomain}
          >
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Domain Management</p>
                <h2>{domainId ? "Edit Domain Configuration" : "Register / Add New Domain"}</h2>
                <p>Manage registrant, nameservers, status, and domain security options.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setDomainOpen(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <label>
              Domain Name
              <input
                required
                value={domainForm.name}
                onChange={(event) =>
                  setDomainForm({ ...domainForm, name: event.target.value })
                }
                placeholder="e.g. yourbrand.com, mycompany.in"
                disabled={Boolean(domainId)}
              />
            </label>

            <div className="cms-form-grid">
              <label>
                Registrant / Customer
                <input
                  required
                  value={domainForm.customer}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, customer: event.target.value })
                  }
                  placeholder="e.g. Amit Sharma"
                />
              </label>

              <label>
                Customer Email
                <input
                  type="email"
                  value={domainForm.customerEmail}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, customerEmail: event.target.value })
                  }
                  placeholder="client@databrainhost.com"
                />
              </label>
            </div>

            <div className="cms-form-grid">
              <label>
                Expiration Date
                <input
                  type="date"
                  required
                  value={domainForm.expiryDate}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, expiryDate: event.target.value })
                  }
                />
              </label>

              <label>
                Domain Status
                <select
                  value={domainForm.status}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, status: event.target.value })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Expired">Expired</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </label>
            </div>

            <div className="cms-form-grid">
              <label>
                Primary Nameserver
                <input
                  value={domainForm.primaryNs}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, primaryNs: event.target.value })
                  }
                  placeholder="ns1.databrainhost.com"
                />
              </label>

              <label>
                Secondary Nameserver
                <input
                  value={domainForm.secondaryNs}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, secondaryNs: event.target.value })
                  }
                  placeholder="ns2.databrainhost.com"
                />
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '10px 0 16px' }}>
              <label className="service-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={domainForm.locked}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, locked: event.target.checked })
                  }
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Enable Registrar Transfer Lock (Prevents unauthorized transfer)</span>
              </label>

              <label className="service-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={domainForm.autoRenew}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, autoRenew: event.target.checked })
                  }
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Enable Auto-Renew before expiration</span>
              </label>

              <label className="service-check" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={domainForm.privacyProtection}
                  onChange={(event) =>
                    setDomainForm({ ...domainForm, privacyProtection: event.target.checked })
                  }
                />
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Enable WHOIS ID Privacy Protection</span>
              </label>
            </div>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setDomainOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                {saving
                  ? "Saving..."
                  : domainId
                    ? "Update Domain"
                    : "Add Domain"}{" "}
                {domainId ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <Plus />}
              </button>
            </div>
          </form>
        </div>
      )}
      {viewDomain && (
        <div className="customer-modal-backdrop" onClick={() => setViewDomain(null)}>
          <section
            className="domain-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="domain-view-header">
              <div className="domain-view-title-wrap">
                <div className="domain-avatar-large">
                  <Globe />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h2>{viewDomain.name}</h2>
                    <span className="domain-id-pill">#{viewDomain.id}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`status-badge ${(viewDomain.status || 'Active').toLowerCase()}`}>
                      <span className="status-dot" /> {viewDomain.status}
                    </span>
                    {viewDomain.locked && (
                      <span className="domain-feature-pill locked">
                        <Lock style={{ width: 10, height: 10 }} /> Transfer Locked
                      </span>
                    )}
                    {viewDomain.autoRenew && (
                      <span className="domain-feature-pill autorenew">
                        ⚡ Auto-Renew Enabled
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setViewDomain(null)}
                aria-label="Close details"
              >
                <X />
              </button>
            </div>

            <div className="domain-view-grid">
              <div className="domain-metric-card">
                <span>Expiration Date</span>
                <strong style={{ color: '#b45309' }}>{viewDomain.expiryDate || "Oct 14, 2026"}</strong>
              </div>
              <div className="domain-metric-card">
                <span>Registered On</span>
                <strong>{viewDomain.registeredDate || "Oct 14, 2025"}</strong>
              </div>
              <div className="domain-metric-card">
                <span>DNS Zone Records</span>
                <strong>{viewDomain.dnsRecords ? viewDomain.dnsRecords.length : 0} active</strong>
              </div>
            </div>

            <div className="domain-info-section">
              <h4>Registrant Contact & Privacy</h4>
              <div className="domain-info-row">
                <span>Domain Owner</span>
                <strong>{viewDomain.customer}</strong>
              </div>
              <div className="domain-info-row">
                <span>Registrant Email</span>
                <strong>{viewDomain.customerEmail || "Not provided"}</strong>
              </div>
              <div className="domain-info-row">
                <span>WHOIS Privacy</span>
                <strong style={{ color: viewDomain.privacyProtection ? '#059669' : '#64748b' }}>
                  {viewDomain.privacyProtection ? '🛡️ Enabled & Hidden' : 'Public'}
                </strong>
              </div>
              <div className="domain-info-row">
                <span>EPP / Auth Code</span>
                <span className="domain-auth-box">{viewDomain.authCode || 'DB#8892_Trx'}</span>
              </div>
            </div>

            <div className="domain-info-section">
              <h4>Active Nameservers</h4>
              <div>
                {(viewDomain.nameservers && viewDomain.nameservers.length ? viewDomain.nameservers : ['ns1.databrainhost.com', 'ns2.databrainhost.com']).map((ns, idx) => (
                  <span key={idx} className="domain-ns-chip">{ns}</span>
                ))}
              </div>
            </div>

            {viewDomain.dnsRecords && viewDomain.dnsRecords.length > 0 && (
              <div className="domain-info-section">
                <h4>Configured DNS Zone Records</h4>
                <table className="domain-dns-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Host / Name</th>
                      <th>Target / Value</th>
                      <th>TTL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewDomain.dnsRecords.map((r, i) => (
                      <tr key={i}>
                        <td><strong>{r.type}</strong></td>
                        <td>{r.name}</td>
                        <td>{r.value}</td>
                        <td>{r.ttl || '3600'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="customer-modal-actions" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="button secondary"
                onClick={() => setViewDomain(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  const d = viewDomain;
                  setViewDomain(null);
                  editDomain({
                    id: d.id,
                    name: d.name,
                    detail: `${d.customer} · Expires ${d.expiryDate}`,
                    status: d.status,
                    domain: d,
                  });
                }}
              >
                <Edit3 style={{ width: 14, height: 14 }} /> Edit Domain
              </button>
            </div>
          </section>
        </div>
      )}
      {faqOpen && (
        <div className="customer-modal-backdrop" onClick={() => setFaqOpen(false)}>
          <form className="customer-modal kb-edit-modal" style={{ width: "min(100%, 580px)" }} onClick={(e) => e.stopPropagation()} onSubmit={saveFaq}>
            <div className="customer-modal-header">
              <div>
                <p className="eyebrow">Knowledge Base & FAQ</p>
                <h2>{faqId ? "Edit FAQ Article" : "Add FAQ Question & Answer"}</h2>
                <p>Provide a clear question and a thorough, helpful answer for your clients.</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setFaqOpen(false)}
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <label>
              Question Title
              <input
                required
                value={faqForm.question}
                onChange={(event) =>
                  setFaqForm({ ...faqForm, question: event.target.value })
                }
                placeholder="e.g. Can I migrate my existing website to DataBrain?"
              />
            </label>

            <div className="cms-form-grid">
              <label>
                Category
                <select
                  value={faqForm.category}
                  onChange={(event) =>
                    setFaqForm({ ...faqForm, category: event.target.value })
                  }
                >
                  <option>General</option>
                  <option>Hosting</option>
                  <option>Domains</option>
                  <option>Billing</option>
                  <option>Migration</option>
                  <option>Technical</option>
                  <option>Security</option>
                </select>
              </label>

              <label>
                Publication Status
                <select
                  value={faqForm.status}
                  onChange={(event) =>
                    setFaqForm({ ...faqForm, status: event.target.value })
                  }
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Draft">Draft (Internal)</option>
                </select>
              </label>
            </div>

            <label>
              Detailed Answer <small style={{ fontWeight: 400, color: "#64748b" }}>(Visible when question is expanded)</small>
              <textarea
                required
                rows={7}
                value={faqForm.answer}
                onChange={(event) =>
                  setFaqForm({ ...faqForm, answer: event.target.value })
                }
                placeholder="Write the full answer here. Explain step-by-step or provide complete information..."
              />
            </label>

            <div className="customer-modal-actions">
              <button
                type="button"
                className="button secondary"
                onClick={() => setFaqOpen(false)}
              >
                Cancel
              </button>
              <button className="button primary" disabled={saving}>
                {saving ? "Saving..." : faqId ? "Update FAQ Article" : "Publish FAQ Article"} <Plus />
              </button>
            </div>
          </form>
        </div>
      )}
      {viewFaq && (
        <div className="customer-modal-backdrop" onClick={() => setViewFaq(null)}>
          <section className="customer-modal kb-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <div className="kb-modal-header-top">
                  <span className={`kb-category-pill cat-${(viewFaq.category || 'general').toLowerCase()}`}>
                    {viewFaq.category || "General"}
                  </span>
                  <span className={`status-badge ${(viewFaq.status || 'Active').toLowerCase()}`}>
                    <span className="status-dot" /> {viewFaq.status || "Active"}
                  </span>
                  <span className="kb-id-pill">#{viewFaq.id}</span>
                </div>
                <h2 className="kb-modal-title">{viewFaq.question || viewFaq.name}</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setViewFaq(null)} aria-label="Close details">
                <X />
              </button>
            </div>

            <div className="kb-modal-stats-grid">
              <div className="kb-modal-stat-box">
                <span className="kb-modal-stat-label">Category</span>
                <span className="kb-modal-stat-val">{viewFaq.category || "General"}</span>
              </div>
              <div className="kb-modal-stat-box">
                <span className="kb-modal-stat-label">Feedback</span>
                <span className="kb-modal-stat-val" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ThumbsUp style={{ width: 12, height: 12, color: '#0284c7' }} /> {viewFaq.helpfulVotes ?? 0} helpful
                </span>
              </div>
              <div className="kb-modal-stat-box">
                <span className="kb-modal-stat-label">Status</span>
                <span className="kb-modal-stat-val" style={{ color: viewFaq.status === "Active" ? "#16a34a" : "#ca8a04" }}>
                  ● {viewFaq.status || "Active"}
                </span>
              </div>
            </div>

            <div className="kb-answer-card">
              <div className="kb-answer-card-header">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen style={{ width: 15, height: 15 }} /> Full Verified Answer
                </span>
                <button
                  type="button"
                  className="kb-copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(viewFaq.answer || viewFaq.detail || "");
                    setCopiedFaqId(viewFaq.id);
                    setTimeout(() => setCopiedFaqId(null), 2000);
                    notify("Answer copied to clipboard!");
                  }}
                >
                  {copiedFaqId === viewFaq.id ? (
                    <>
                      <Check style={{ width: 12, height: 12, color: "#16a34a" }} /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy style={{ width: 12, height: 12 }} /> Copy Text
                    </>
                  )}
                </button>
              </div>
              <p className="kb-answer-text">
                {viewFaq.answer || viewFaq.detail || "No answer text available."}
              </p>
            </div>

            {/* Live Interactive Accordion Test Preview */}
            <div className="kb-preview-wrapper">
              <div
                className="kb-preview-header"
                onClick={() => setTestFaqOpen(!testFaqOpen)}
              >
                <span>Interactive Customer Accordion Preview</span>
                {testFaqOpen ? <ChevronUp style={{ width: 16, height: 16 }} /> : <ChevronDown style={{ width: 16, height: 16 }} />}
              </div>
              {testFaqOpen && (
                <div className="kb-preview-body">
                  <p style={{ margin: 0 }}>{viewFaq.answer || viewFaq.detail}</p>
                </div>
              )}
            </div>

            <div className="customer-modal-actions" style={{ marginTop: "24px" }}>
              <button type="button" className="button secondary" onClick={() => setViewFaq(null)}>
                Close
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => {
                  const target = viewFaq;
                  setViewFaq(null);
                  editFaq(target);
                }}
              >
                <Edit3 style={{ width: 14, height: 14, marginRight: 6 }} /> Edit Question & Answer
              </button>
            </div>
          </section>
        </div>
      )}
      {viewTicket && (
        <div className="customer-modal-backdrop" onClick={() => setViewTicket(null)}>
          <section className="customer-modal ticket-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ticket-view-header">
              <div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
                  <span className="ticket-id-pill">#{viewTicket.id}</span>
                  <span className={`status-badge ${(viewTicket.status || 'open').toLowerCase()}`}>
                    <span className="status-dot" /> {viewTicket.status}
                  </span>
                  <span className={`ticket-priority-badge ${(viewTicket.priority || 'Medium').toLowerCase()}`}>
                    {viewTicket.priority || "Medium"}
                  </span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: "4px 0" }}>
                  {viewTicket.service}
                </h2>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  Opened by <strong>{viewTicket.name}</strong> on {new Date(viewTicket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button type="button" className="icon-button" onClick={() => setViewTicket(null)} aria-label="Close details">
                <X />
              </button>
            </div>

            {/* Quick Status Changer Toolbar */}
            <div className="status-changer-box">
              <span className="status-changer-label">
                <Settings2 style={{ width: 15, height: 15 }} /> Ticket Status:
              </span>
              <div className="status-changer-buttons">
                <button
                  type="button"
                  className={`status-toggle-btn btn-open ${viewTicket.status === 'Open' ? 'active' : ''}`}
                  onClick={() => quickUpdateTicketStatus(viewTicket.id, 'Open')}
                >
                  ● Open
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn btn-pending ${viewTicket.status === 'Pending' ? 'active' : ''}`}
                  onClick={() => quickUpdateTicketStatus(viewTicket.id, 'Pending')}
                >
                  ⏱ Pending
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn btn-resolved ${viewTicket.status === 'Resolved' ? 'active' : ''}`}
                  onClick={() => quickUpdateTicketStatus(viewTicket.id, 'Resolved')}
                >
                  ✓ Resolved
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn btn-closed ${viewTicket.status === 'Closed' ? 'active' : ''}`}
                  onClick={() => quickUpdateTicketStatus(viewTicket.id, 'Closed')}
                >
                  ✕ Closed
                </button>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="ticket-meta-grid">
              <div className="ticket-meta-cell">
                <span className="ticket-meta-label">Customer Name</span>
                <span className="ticket-meta-value">{viewTicket.name}</span>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-label">Email Address</span>
                <span className="ticket-meta-value">{viewTicket.email || "No email registered"}</span>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-label">Phone Contact</span>
                <span className="ticket-meta-value">{viewTicket.phone || "No phone provided"}</span>
              </div>
              <div className="ticket-meta-cell">
                <span className="ticket-meta-label">Assigned Department</span>
                <span className="ticket-meta-value">{viewTicket.department || "Technical Support"}</span>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="ticket-thread-section">
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                <MessageSquare style={{ width: 14, height: 14 }} /> Conversation Thread
              </div>

              {/* Original Message */}
              <div className="ticket-message-card original">
                <div className="ticket-message-header">
                  <span className="ticket-message-author">
                    {viewTicket.name}
                    <span className="client-role-badge">Customer</span>
                  </span>
                  <span className="ticket-message-time">
                    <Clock style={{ width: 11, height: 11, display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                    {new Date(viewTicket.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="ticket-message-body">{viewTicket.message}</p>
              </div>

              {/* Replies */}
              {viewTicket.replies && viewTicket.replies.length > 0 && viewTicket.replies.map((reply) => (
                <div key={reply.id} className={`ticket-message-card ${reply.role === 'staff' ? 'staff' : 'client'}`}>
                  <div className="ticket-message-header">
                    <span className="ticket-message-author">
                      {reply.sender}
                      <span className={reply.role === 'staff' ? 'staff-role-badge' : 'client-role-badge'}>
                        {reply.role === 'staff' ? 'Support Engineer' : 'Client'}
                      </span>
                    </span>
                    <span className="ticket-message-time">
                      <Clock style={{ width: 11, height: 11, display: "inline", verticalAlign: "middle", marginRight: 3 }} />
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="ticket-message-body">{reply.message}</p>
                </div>
              ))}
            </div>

            {/* Staff Quick Reply Box */}
            <div className="ticket-reply-card">
              <label style={{ fontSize: "12.5px", fontWeight: 700, color: "#1e293b", marginBottom: "6px", display: "block" }}>
                Send Official Staff Reply to {viewTicket.name}
              </label>
              <textarea
                rows={3}
                placeholder="Type resolution notes, diagnostics, or response to customer..."
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
              />
              <div className="ticket-reply-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    const target = viewTicket;
                    setViewTicket(null);
                    editTicket(target);
                  }}
                  title="Edit full ticket properties"
                >
                  <Edit3 style={{ width: 13, height: 13, marginRight: 4 }} /> Edit Details
                </button>
                <button
                  type="button"
                  className="button secondary"
                  style={{ background: "#fef3c7", borderColor: "#fde68a", color: "#b45309" }}
                  disabled={sendingReply || !adminReplyText.trim()}
                  onClick={() => sendAdminReply("Pending")}
                >
                  Reply & Keep Pending
                </button>
                <button
                  type="button"
                  className="button secondary"
                  style={{ background: "#dcfce7", borderColor: "#bbf7d0", color: "#15803d" }}
                  disabled={sendingReply || !adminReplyText.trim()}
                  onClick={() => sendAdminReply("Resolved")}
                >
                  ✓ Reply & Mark Resolved
                </button>
                <button
                  type="button"
                  className="button primary"
                  disabled={sendingReply || !adminReplyText.trim()}
                  onClick={() => sendAdminReply()}
                >
                  <Send style={{ width: 13, height: 13, marginRight: 4 }} /> Send Reply
                </button>
              </div>
            </div>

            <div className="customer-modal-actions" style={{ marginTop: "20px" }}>
              <button type="button" className="button secondary" onClick={() => setViewTicket(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      )}

      {ticketOpen && (
        <div className="customer-modal-backdrop" onClick={() => setTicketOpen(false)}>
          <div className="customer-modal" style={{ width: "min(100%, 580px)" }} onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <h2>{ticketId ? `Edit Support Ticket #${ticketId}` : "Open New Support Ticket"}</h2>
                <p>Manage customer service inquiries, status updates, and priorities</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setTicketOpen(false)}
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>

            <form onSubmit={saveTicket} className="customer-form">
              <div className="form-grid">
                <label>
                  Customer Name
                  <input
                    required
                    value={ticketForm.name}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, name: event.target.value })
                    }
                    placeholder="e.g. Amit Sharma"
                  />
                </label>
                <label>
                  Customer Email
                  <input
                    type="email"
                    value={ticketForm.email}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, email: event.target.value })
                    }
                    placeholder="e.g. amit@gmail.com"
                  />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Customer Phone
                  <input
                    value={ticketForm.phone}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, phone: event.target.value })
                    }
                    placeholder="e.g. +91 98765 43210"
                  />
                </label>
                <label>
                  Related Service
                  <select
                    value={ticketForm.service}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, service: event.target.value })
                    }
                  >
                    <option>Cloud Hosting</option>
                    <option>Web Hosting</option>
                    <option>WordPress Pro</option>
                    <option>Domain & DNS</option>
                    <option>Billing & Invoicing</option>
                    <option>SSL & Security</option>
                    <option>General inquiry</option>
                  </select>
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Department
                  <select
                    value={ticketForm.department}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, department: event.target.value })
                    }
                  >
                    <option>Technical Support</option>
                    <option>Billing & Accounts</option>
                    <option>Domain & DNS</option>
                    <option>Sales & Upgrades</option>
                  </select>
                </label>
                <label>
                  Priority
                  <select
                    value={ticketForm.priority}
                    onChange={(event) =>
                      setTicketForm({ ...ticketForm, priority: event.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </label>
              </div>

              <label>
                Status
                <select
                  value={ticketForm.status}
                  onChange={(event) =>
                    setTicketForm({ ...ticketForm, status: event.target.value })
                  }
                  style={{ fontWeight: 700 }}
                >
                  <option value="Open">● Open</option>
                  <option value="Pending">⏱ Pending (Waiting Customer / Action)</option>
                  <option value="Resolved">✓ Resolved</option>
                  <option value="Closed">✕ Closed</option>
                </select>
              </label>

              <label>
                Inquiry / Issue Description
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(event) =>
                    setTicketForm({ ...ticketForm, message: event.target.value })
                  }
                  placeholder="Describe the issue, customer question, or troubleshooting request..."
                />
              </label>

              <div className="customer-modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setTicketOpen(false)}
                >
                  Cancel
                </button>
                <button className="button primary" disabled={saving}>
                  {saving ? "Saving..." : ticketId ? "Save Ticket Changes" : "Create Ticket"} <Plus />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal - Printable Tax Invoice */}
      {viewInvoice && (
        <div className="customer-modal-backdrop" onClick={() => setViewInvoice(null)}>
          <section
            className="invoice-sheet-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topbar: Company Logo/Details and Invoice Heading */}
            <div className="invoice-sheet-topbar">
              <div className="invoice-sheet-brand">
                <div className="invoice-sheet-logo">
                  <FileText />
                </div>
                <div className="invoice-sheet-brand-text">
                  <h2>{viewInvoice.company?.name || companyProfile.name}</h2>
                  <p>{viewInvoice.company?.website || companyProfile.website} · {viewInvoice.company?.email || companyProfile.email}</p>
                </div>
              </div>
              <div className="invoice-sheet-heading">
                <h1>Tax Invoice</h1>
                <span className="invoice-sheet-id-badge">#{viewInvoice.id}</span>
              </div>
            </div>

            {/* Status Stamp & Summary Alert */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              <div className={`invoice-seal ${(viewInvoice.status || "Unpaid").toLowerCase()}`}>
                {viewInvoice.status === "Paid" ? (
                  <>
                    <CheckCircle2 style={{ width: 16, height: 16 }} />
                    PAID IN FULL
                  </>
                ) : viewInvoice.status === "Overdue" ? (
                  <>
                    <AlertCircle style={{ width: 16, height: 16 }} />
                    OVERDUE NOTICE
                  </>
                ) : (
                  <>
                    <Clock style={{ width: 16, height: 16 }} />
                    PAYMENT DUE
                  </>
                )}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Order Ref: <strong style={{ color: "#0f172a" }}>{viewInvoice.orderId || "#DB-Direct"}</strong>
              </div>
            </div>

            {/* Billed To & Invoice Metadata Cards */}
            <div className="invoice-meta-grid">
              <div className="invoice-meta-card">
                <h4>Billed To (Client)</h4>
                <div className="invoice-customer-title">{viewInvoice.customer}</div>
                <div style={{ fontSize: "13px", color: "#475569", lineHeight: 1.6 }}>
                  <div>{viewInvoice.customerEmail || "No email registered"}</div>
                  <div>Bengaluru, Karnataka, India</div>
                </div>
              </div>

              <div className="invoice-meta-card">
                <h4>Invoice Summary</h4>
                <div className="invoice-meta-detail-row">
                  <span>Invoice Number:</span>
                  <strong>#{viewInvoice.id}</strong>
                </div>
                <div className="invoice-meta-detail-row">
                  <span>Issue Date:</span>
                  <strong>{new Date(viewInvoice.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</strong>
                </div>
                <div className="invoice-meta-detail-row">
                  <span>Payment Due:</span>
                  <strong style={{ color: viewInvoice.status === "Paid" ? "#059669" : "#b45309" }}>
                    {viewInvoice.dueDate ? new Date(viewInvoice.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "On Receipt"}
                  </strong>
                </div>
                <div className="invoice-meta-detail-row">
                  <span>Payment Terms:</span>
                  <strong>Net 7 Days</strong>
                </div>
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div className="invoice-items-table-wrap">
              <table className="invoice-items-table">
                <thead>
                  <tr>
                    <th>Item & Description</th>
                    <th>Billing Cycle</th>
                    <th>Unit Price</th>
                    <th style={{ textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="invoice-item-name">{viewInvoice.serviceName}</div>
                      <div className="invoice-item-desc">High performance NVMe cloud hosting infrastructure with 99.9% uptime SLA</div>
                    </td>
                    <td>Annual</td>
                    <td>{viewInvoice.amount}</td>
                    <td style={{ textAlign: "right", fontWeight: 700 }}>{viewInvoice.total || viewInvoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Subtotal & Totals Box */}
            <div className="invoice-summary-block">
              <table className="invoice-summary-table">
                <tbody>
                  <tr>
                    <td className="summary-label">Subtotal:</td>
                    <td className="summary-value">{viewInvoice.amount}</td>
                  </tr>
                  <tr>
                    <td className="summary-label">GST / Taxes (0%):</td>
                    <td className="summary-value">₹0</td>
                  </tr>
                  <tr className="summary-total-row">
                    <td className="summary-label">Grand Total:</td>
                    <td className="summary-value">{viewInvoice.total || viewInvoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment Audit Info */}
            {viewInvoice.status === "Paid" ? (
              <div className="invoice-payment-info-box">
                <div className="invoice-payment-title">
                  <CheckCircle2 style={{ width: 16, height: 16 }} />
                  Payment Verified & Settled
                </div>
                <div className="invoice-payment-meta">
                  Ref ID: {viewInvoice.paymentId || "pay_rzp_auto_settled"} · Paid on {viewInvoice.paidAt ? new Date(viewInvoice.paidAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Settled"}
                </div>
              </div>
            ) : (
              <div className="invoice-payment-info-box pending">
                <div className="invoice-payment-title">
                  <Clock style={{ width: 16, height: 16 }} />
                  Awaiting Customer Payment
                </div>
                <div className="invoice-payment-meta">
                  Due on {viewInvoice.dueDate ? new Date(viewInvoice.dueDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "Receipt"} · UPI / NetBanking / Cards
                </div>
              </div>
            )}

            {/* Footer with Actions */}
            <div className="invoice-sheet-footer">
              <div>
                Thank you for your business. For billing inquiries, contact {companyProfile.email}.
              </div>
              <div className="invoice-sheet-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setViewInvoice(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    const inv = viewInvoice;
                    setViewInvoice(null);
                    editInvoice(inv);
                  }}
                >
                  <Edit3 style={{ width: 13, height: 13, marginRight: 4 }} /> Edit Invoice
                </button>
                <button
                  type="button"
                  className={`button ${viewInvoice.status === "Paid" ? "secondary" : "primary"}`}
                  onClick={() => toggleInvoiceStatus(viewInvoice)}
                >
                  <Check style={{ width: 14, height: 14 }} />
                  {viewInvoice.status === "Paid" ? "Mark as Unpaid" : "Mark as Paid"}
                </button>
                <button
                  type="button"
                  className="button primary"
                  onClick={() => printInvoice(viewInvoice.id)}
                >
                  <Printer style={{ width: 14, height: 14 }} /> Print / Download PDF
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Create / Edit Invoice Modal */}
      {invoiceOpen && (
        <div className="customer-modal-backdrop" onClick={() => setInvoiceOpen(false)}>
          <div className="customer-modal" style={{ width: "min(100%, 580px)" }} onClick={(e) => e.stopPropagation()}>
            <div className="customer-modal-header">
              <div>
                <h2>{invoiceId ? `Edit Invoice #${invoiceId}` : "Generate New Customer Invoice"}</h2>
                <p>Create a tax invoice, assign hosting services, and manage payment statuses</p>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setInvoiceOpen(false)}
                aria-label="Close modal"
              >
                <X />
              </button>
            </div>

            <form onSubmit={saveInvoice} className="customer-form">
              <div className="form-grid">
                <label>
                  Customer Name
                  <input
                    required
                    value={invoiceForm.customer}
                    onChange={(event) =>
                      setInvoiceForm({ ...invoiceForm, customer: event.target.value })
                    }
                    placeholder="e.g. Amit Sharma"
                    list="invoice-customer-options"
                  />
                  <datalist id="invoice-customer-options">
                    {customers.map((c) => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </label>
                <label>
                  Customer Email
                  <input
                    type="email"
                    value={invoiceForm.customerEmail}
                    onChange={(event) =>
                      setInvoiceForm({ ...invoiceForm, customerEmail: event.target.value })
                    }
                    placeholder="e.g. amit@gmail.com"
                  />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Hosting Service Plan
                  <select
                    value={invoiceForm.serviceName}
                    onChange={(event) => {
                      const selectedPlan = services.find((s) => s.name === event.target.value);
                      setInvoiceForm({
                        ...invoiceForm,
                        serviceName: event.target.value,
                        amount: selectedPlan ? selectedPlan.price : invoiceForm.amount,
                      });
                    }}
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.price})
                      </option>
                    ))}
                    <option value="Custom Hosting Plan">Custom Hosting Plan</option>
                    <option value="Domain Registration (.com)">Domain Registration (.com)</option>
                    <option value="SSL Certificate & Setup">SSL Certificate & Setup</option>
                    <option value="WordPress Maintenance">WordPress Maintenance</option>
                  </select>
                </label>
                <label>
                  Related Order ID
                  <input
                    value={invoiceForm.orderId}
                    onChange={(event) =>
                      setInvoiceForm({ ...invoiceForm, orderId: event.target.value })
                    }
                    placeholder="e.g. #DB-10850"
                  />
                </label>
              </div>

              <div className="form-grid">
                <label>
                  Invoice Amount (INR)
                  <input
                    required
                    value={invoiceForm.amount}
                    onChange={(event) =>
                      setInvoiceForm({ ...invoiceForm, amount: event.target.value })
                    }
                    placeholder="e.g. ₹149"
                  />
                </label>
                <label>
                  Due Date
                  <input
                    type="date"
                    required
                    value={invoiceForm.dueDate}
                    onChange={(event) =>
                      setInvoiceForm({ ...invoiceForm, dueDate: event.target.value })
                    }
                  />
                </label>
              </div>

              <label>
                Payment Status
                <select
                  value={invoiceForm.status}
                  onChange={(event) =>
                    setInvoiceForm({ ...invoiceForm, status: event.target.value })
                  }
                  style={{ fontWeight: 700 }}
                >
                  <option value="Unpaid">⏱ Unpaid (Awaiting Payment)</option>
                  <option value="Paid">✓ Paid (Settled in Full)</option>
                  <option value="Overdue">⚠️ Overdue</option>
                  <option value="Cancelled">✕ Cancelled</option>
                </select>
              </label>

              <div className="customer-modal-actions">
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setInvoiceOpen(false)}
                >
                  Cancel
                </button>
                <button className="button primary" disabled={saving}>
                  {saving ? "Saving..." : invoiceId ? "Update Invoice" : "Generate Invoice"} <Plus />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
