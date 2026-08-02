import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | TypeMatchup',
  description: 'Read the TypeMatchup privacy policy, including how analytics, cookies, advertising services, and contact information may be used.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <article className="max-w-3xl mx-auto prose prose-gray">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> August 2, 2026</p>
        <p>
          TypeMatchup operates the website at typematchup.org. This Privacy Policy explains what information may be
          collected when you use the site, why it is used, and the choices available to you. By using TypeMatchup, you
          acknowledge the practices described below.
        </p>

        <h2>Information We Collect</h2>
        <p>
          You can use the calculators and read the site without creating an account. We do not ask for your name,
          password, or Pokemon team data. Calculator selections are processed in your browser and are not submitted as a
          user profile.
        </p>
        <p>
          Our hosting and analytics providers may automatically receive limited technical information, such as your IP
          address, browser and device type, operating system, referring page, pages viewed, approximate location, and the
          time of a request. Cookies or similar technologies may also be used to distinguish visits and measure site
          performance.
        </p>

        <h2>How We Use Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>operate, secure, and troubleshoot the website;</li>
          <li>understand which tools and guides are useful;</li>
          <li>improve performance, navigation, and content;</li>
          <li>detect abuse and protect the service; and</li>
          <li>support advertising and measure ad performance if advertising is enabled.</li>
        </ul>

        <h2>Analytics, Advertising, and Third Parties</h2>
        <p>
          TypeMatchup uses Google Analytics and Vercel Analytics to understand aggregate website usage. Google and Vercel
          may process technical and usage data according to their own privacy policies. You can limit analytics through
          browser controls, privacy extensions, or cookie settings available in your region.
        </p>
        <p>
          We may use Google AdSense to display advertisements. Google and its partners may use cookies or similar
          technologies to serve, personalize, and measure ads based on visits to this and other websites. You can manage
          personalized advertising through <a href="https://adssettings.google.com/" rel="noopener noreferrer">Google Ads Settings</a>.
          Where required, a consent prompt will be provided before non-essential advertising cookies are used.
        </p>
        <p>
          Third-party vendors, including Google, use cookies to serve ads based on a visitor&apos;s prior visits to this
          website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve ads based
          on those visits. Visitors may opt out of personalized advertising in Google Ads Settings or review additional
          industry opt-out choices at <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer">YourAdChoices</a>.
          We do not send names, email addresses, phone numbers, or other directly identifying information to Google in ad
          request URLs or targeting parameters.
        </p>

        <h2>Location Data and Advertising Choices</h2>
        <p>
          TypeMatchup does not request precise GPS location from your device. Service providers may infer an approximate
          region from an IP address for security, analytics, consent, or advertising purposes. Where local law requires
          consent— including for visitors in the European Economic Area, the United Kingdom, or Switzerland—we will use
          a consent mechanism for eligible advertising and analytics technologies. Your available choices may include
          accepting, rejecting, or managing non-essential purposes. Withdrawing consent does not affect processing that
          occurred before the change.
        </p>
        <p>
          The Support page may load PayPal services when you choose to make a contribution. PayPal processes payment and
          transaction information under its own privacy policy. TypeMatchup does not receive or store your complete card
          or bank account details.
        </p>

        <h2>Data Retention and Sharing</h2>
        <p>
          Analytics and server records are retained only as long as reasonably needed for the purposes described above or
          as required by law. We do not sell personal information. Information may be shared with service providers that
          operate hosting, analytics, advertising, or payment functions, or when disclosure is required to comply with law
          and protect the rights and security of users and the service.
        </p>

        <h2>Your Choices and Rights</h2>
        <p>
          You can block or delete cookies through your browser, use privacy controls offered by Google, or stop using the
          service. Depending on your location, you may have rights to request access, correction, deletion, restriction,
          or objection regarding personal information. Because TypeMatchup does not provide user accounts, we may need
          enough information to verify and locate any relevant record before responding.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          TypeMatchup is a general-audience reference tool and does not knowingly collect personal information directly
          from children. If you believe a child has provided personal information, contact us so we can investigate and
          remove it where appropriate.
        </p>

        <h2>Policy Changes</h2>
        <p>
          We may update this policy when our services or legal obligations change. The revised version will be posted on
          this page with a new update date.
        </p>

        <h2>Contact</h2>
        <p>
          Privacy questions and requests can be sent to{' '}
          <a href="mailto:lincyang85@gmail.com">lincyang85@gmail.com</a>. You can also visit the{' '}
          <Link href="/contact">Contact page</Link>.
        </p>
      </article>
    </div>
  );
}
