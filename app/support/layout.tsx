import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support Us - Help Keep Type Chart Calculator Free',
  description: 'Support Type Chart Calculator and help us keep the tool free and ad-free for everyone. Your contribution helps maintain and improve the service.',
  keywords: 'support, donate, contribute, help, funding',
  openGraph: {
    title: 'Support Us - Help Keep Type Chart Calculator Free',
    description: 'Support Type Chart Calculator and help us keep it free for everyone',
    url: 'https://www.typematchup.org/support',
    type: 'website',
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
