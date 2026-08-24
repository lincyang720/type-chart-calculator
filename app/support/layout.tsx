import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support TypeMatchup',
  description: 'Help keep TypeMatchup free. Support development and maintenance with an optional contribution via PayPal.',
  keywords: 'support, donate, contribute, paypal, free tool',
  openGraph: {
    siteName: 'TypeMatchup',
    title: 'Support TypeMatchup',
    description: 'Help keep TypeMatchup free. Support development with an optional contribution.',
    url: 'https://www.typematchup.org/support',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support TypeMatchup',
    description: 'Help keep TypeMatchup free. Support development with an optional contribution.',
  },
  alternates: {
    canonical: '/support',
  },
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
