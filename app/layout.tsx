import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Small Finance - Real-Time Customer Management Console',
  description: 'Real-Time Customer Management Console for managing loan records, payments, and financial ledger statements.',
  openGraph: {
    title: 'Small Finance',
    description: 'Real-Time Customer Management Console for managing loan records, payments, and financial ledger statements.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Small Finance',
    description: 'Real-Time Customer Management Console for managing loan records, payments, and financial ledger statements.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
