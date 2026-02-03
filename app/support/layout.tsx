import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Us - Type Chart Calculator',
  description: 'Help keep Type Chart Calculator free and ad-free. Support development with a contribution via PayPal.',
  keywords: 'support, donate, contribute, paypal, free tool, ad-free',
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
