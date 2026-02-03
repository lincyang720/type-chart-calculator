import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Us - Type Chart Calculator',
  description: 'Help keep Type Chart Calculator free and ad-free. Support development with a contribution via PayPal.',
  keywords: 'support, donate, contribute, paypal, free tool, ad-free',
  openGraph: {
    title: 'Support Us - Type Chart Calculator',
    description: 'Help keep Type Chart Calculator free and ad-free. Support development with a contribution.',
    url: 'https://www.typematchup.org/support',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Type Chart Calculator',
    description: 'Help keep Type Chart Calculator free and ad-free. Support development with a contribution.',
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
