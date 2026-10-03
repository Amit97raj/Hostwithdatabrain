import type { Metadata } from 'next';
import './globals.css';
import './site.css';
import './cms.css';
import './responsive.css';
import './module.css';
import './customer.css';
import './order.css';
import './service-form.css';
import './service-view.css';
import './domain-view.css';
import './ticket-view.css';
import './knowledge-view.css';
import './invoice-view.css';
import './portal.css';
import './faq-category.css';
import './pricing-section.css';
import './ambient-glow.css';
import AmbientMouseGlow from './components/AmbientMouseGlow';

export const metadata: Metadata = {
  title: 'DataBrain Admin | Hosting Control Center',
  description: 'DataBrain hosting and digital services administration panel'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AmbientMouseGlow />
        {children}
      </body>
    </html>
  );
}
