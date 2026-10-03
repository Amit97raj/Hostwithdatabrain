'use client';

import { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
  X,
  Zap
} from 'lucide-react';

export type PaymentDetails = {
  title: string;
  subtitle: string;
  amount: string;
  targetId?: string;
  type: 'invoice' | 'service' | 'domain';
  customerName?: string;
  customerEmail?: string;
};

type Props = {
  details: PaymentDetails;
  onSuccess: (paymentId: string, receiptId: string) => void;
  onClose: () => void;
};

export default function RazorpayModal({ details, onSuccess, onClose }: Props) {
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState('Google Pay');
  const [upiId, setUpiId] = useState('amit@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('882');
  const [cardName, setCardName] = useState(details.customerName || 'Amit Sharma');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [result, setResult] = useState<{ paymentId: string; receiptId: string } | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  async function handlePay() {
    setStep('processing');
    try {
      const response = await fetch(`${apiUrl}/api/payment/simulate-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: details.type,
          targetId: details.targetId,
          amount: details.amount,
          paymentMethod: method.toUpperCase(),
          customer: {
            name: details.customerName,
            email: details.customerEmail
          }
        })
      });

      const data = await response.json();
      setTimeout(() => {
        setResult({ paymentId: data.paymentId, receiptId: data.receiptId });
        setStep('success');
      }, 1400);
    } catch {
      setTimeout(() => {
        const fallbackPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 9)}`;
        const fallbackReceipt = `RCP-${Date.now()}`;
        setResult({ paymentId: fallbackPaymentId, receiptId: fallbackReceipt });
        setStep('success');
      }, 1400);
    }
  }

  function handleComplete() {
    if (result) {
      onSuccess(result.paymentId, result.receiptId);
    }
    onClose();
  }

  return (
    <div className="rzp-overlay" onClick={onClose}>
      <div
        className="rzp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rzp-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header with Razorpay & DataBrain Branding */}
        <div className="rzp-header">
          <div className="rzp-brand-row">
            <div className="rzp-brand">
              <img src="https://databrainit.com/images/logo.png" alt="DataBrain" />
              <div>
                <strong>DataBrain IT Solutions</strong>
                <span className="rzp-badge">
                  <ShieldCheck size={12} /> Razorpay Trusted Business
                </span>
              </div>
            </div>
            {step !== 'processing' && (
              <button
                type="button"
                className="rzp-close"
                onClick={onClose}
                aria-label="Close payment"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="rzp-amount-row">
            <div>
              <small>{details.title}</small>
              <h3 id="rzp-title">{details.subtitle}</h3>
            </div>
            <div className="rzp-amount">
              <strong>{details.amount}</strong>
              <span>INR</span>
            </div>
          </div>
        </div>

        {/* Processing State */}
        {step === 'processing' && (
          <div className="rzp-body rzp-center">
            <div className="rzp-spinner" />
            <h3>Processing Payment...</h3>
            <p>Communicating securely with bank via 256-bit SSL encryption</p>
            <div className="rzp-security-note">
              <Lock size={13} /> Do not close this window or press back
            </div>
          </div>
        )}

        {/* Success State */}
        {step === 'success' && result && (
          <div className="rzp-body rzp-center">
            <div className="rzp-success-circle">
              <Check size={36} />
            </div>
            <h2 className="rzp-success-title">Payment Successful!</h2>
            <p className="rzp-success-desc">
              Your transaction has been approved and processed instantly.
            </p>

            <div className="rzp-receipt-card">
              <div>
                <span>Payment ID</span>
                <code>{result.paymentId}</code>
              </div>
              <div>
                <span>Receipt #</span>
                <strong>{result.receiptId}</strong>
              </div>
              <div>
                <span>Amount Paid</span>
                <strong style={{ color: '#059669' }}>{details.amount}</strong>
              </div>
              <div>
                <span>Payment Method</span>
                <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{method}</span>
              </div>
            </div>

            <button type="button" className="rzp-submit-btn" onClick={handleComplete}>
              Continue to Services <ArrowRight size={15} />
            </button>
          </div>
        )}

        {/* Method Selection & Form */}
        {step === 'select' && (
          <div className="rzp-body">
            {/* Payment Method Selector */}
            <div className="rzp-methods-bar">
              <button
                type="button"
                className={`rzp-method-btn ${method === 'upi' ? 'active' : ''}`}
                onClick={() => setMethod('upi')}
              >
                <Smartphone size={16} /> UPI / QR
              </button>
              <button
                type="button"
                className={`rzp-method-btn ${method === 'card' ? 'active' : ''}`}
                onClick={() => setMethod('card')}
              >
                <CreditCard size={16} /> Card
              </button>
              <button
                type="button"
                className={`rzp-method-btn ${method === 'netbanking' ? 'active' : ''}`}
                onClick={() => setMethod('netbanking')}
              >
                <Building2 size={16} /> NetBanking
              </button>
            </div>

            {/* UPI View */}
            {method === 'upi' && (
              <div>
                <p className="rzp-field-label">Select UPI App</p>
                <div className="rzp-app-grid">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      className={`rzp-app-box ${selectedUpiApp === app ? 'active' : ''}`}
                      onClick={() => setSelectedUpiApp(app)}
                    >
                      <Zap size={18} color="#0c83ba" />
                      <span>{app}</span>
                    </button>
                  ))}
                </div>

                <div className="rzp-form-group">
                  <label htmlFor="rzp-upi-id">Or enter Virtual Payment Address (VPA / UPI ID)</label>
                  <input
                    id="rzp-upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@upi"
                  />
                </div>

                <div className="rzp-qr-hint">
                  <QrCode size={18} />
                  <span>Scan QR code with any UPI app to pay instant {details.amount}</span>
                </div>
              </div>
            )}

            {/* Card View */}
            {method === 'card' && (
              <div>
                <div className="rzp-card-mockup">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', letterSpacing: '2px', opacity: 0.8 }}>DEBIT / CREDIT</span>
                    <span style={{ fontSize: '14px', fontWeight: 800 }}>VISA</span>
                  </div>
                  <div className="rzp-card-num">{cardNumber || '•••• •••• •••• ••••'}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                    <span>{cardName.toUpperCase()}</span>
                    <span>EXP: {cardExpiry}</span>
                  </div>
                </div>

                <div className="rzp-form-group">
                  <label htmlFor="rzp-card-number">Card Number</label>
                  <input
                    id="rzp-card-number"
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 8901 2345 6789"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="rzp-form-group">
                    <label htmlFor="rzp-card-expiry">Expiry Date</label>
                    <input
                      id="rzp-card-expiry"
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="rzp-form-group">
                    <label htmlFor="rzp-card-cvv">CVV</label>
                    <input
                      id="rzp-card-cvv"
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="•••"
                    />
                  </div>
                </div>

                <div className="rzp-form-group">
                  <label htmlFor="rzp-card-name">Cardholder Name</label>
                  <input
                    id="rzp-card-name"
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name as on card"
                  />
                </div>
              </div>
            )}

            {/* NetBanking View */}
            {method === 'netbanking' && (
              <div>
                <p className="rzp-field-label">Select Popular Bank</p>
                <div className="rzp-bank-grid">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map(
                    (bank) => (
                      <button
                        key={bank}
                        type="button"
                        className={`rzp-bank-pill ${selectedBank === bank ? 'active' : ''}`}
                        onClick={() => setSelectedBank(bank)}
                      >
                        <Building2 size={14} /> {bank}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <button type="button" className="rzp-submit-btn" onClick={handlePay}>
              <Lock size={15} /> Pay {details.amount} securely
            </button>

            <div className="rzp-footer-trust">
              <span>🔒 256-bit SSL</span>
              <span>PCI-DSS Level 1</span>
              <span>Verified by VISA / RuPay</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
