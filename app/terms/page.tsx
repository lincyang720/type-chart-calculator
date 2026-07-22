import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | TypeMatchup',
  description: 'Terms governing use of the TypeMatchup Pokemon type calculator, guides, data, and related website services.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <article className="max-w-3xl mx-auto prose prose-gray">
        <h1>Terms of Service</h1>
        <p><strong>Last updated:</strong> July 22, 2026</p>
        <p>
          These Terms of Service govern your use of typematchup.org and the calculators, charts, guides, and other content
          provided by TypeMatchup. By accessing the website, you agree to these terms. If you do not agree, please stop
          using the service.
        </p>

        <h2>Reference and Entertainment Use</h2>
        <p>
          TypeMatchup is an independent reference and entertainment tool for understanding Pokemon type mechanics. The
          calculators provide general matchup information based on standard game mechanics. They are not an official
          battle service, tournament ruling, or substitute for checking the rules of a specific game, generation, or
          competitive format.
        </p>

        <h2>Accuracy and Availability</h2>
        <p>
          We work to keep calculations and guides useful and accurate, but we do not guarantee that all content is
          complete, current, uninterrupted, or error-free. Game updates, alternate forms, abilities, moves, items,
          Terastallization, format rules, or other mechanics may change a result. You are responsible for verifying
          information before relying on it in a tournament, purchase, or other decision.
        </p>
        <p>
          We may update, suspend, remove, or change any part of the website without notice. Access may occasionally be
          interrupted by maintenance, hosting issues, security events, or circumstances outside our control.
        </p>

        <h2>Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>interfere with the website, servers, security, or normal operation;</li>
          <li>use automated requests in a way that creates unreasonable load;</li>
          <li>attempt to gain unauthorized access to systems or data;</li>
          <li>misrepresent an affiliation with TypeMatchup; or</li>
          <li>use the service for unlawful, fraudulent, or abusive activity.</li>
        </ul>

        <h2>Intellectual Property and Fan-Site Disclaimer</h2>
        <p>
          TypeMatchup&apos;s original website design, code, written explanations, and branding are protected by applicable
          intellectual property laws. You may link to public pages and use the calculators for personal reference, but you
          may not reproduce or republish substantial original portions of the site without permission.
        </p>
        <p>
          Pokemon and related names, characters, marks, and game materials are trademarks or intellectual property of
          Nintendo, Game Freak, Creatures Inc., The Pokemon Company, and their respective owners. TypeMatchup is an
          unofficial fan-made website and is not endorsed by, sponsored by, or affiliated with those parties.
        </p>

        <h2>Third-Party Services and Links</h2>
        <p>
          The website may include links, analytics, advertisements, hosting, or payment functions supplied by third
          parties. TypeMatchup does not control third-party services and is not responsible for their content, policies,
          security, or availability. Your use of those services is governed by their own terms.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          To the maximum extent permitted by law, the website and all content are provided &quot;as is&quot; and &quot;as
          available&quot; without warranties of any kind, express or implied. We disclaim warranties of merchantability,
          fitness for a particular purpose, non-infringement, and accuracy.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, TypeMatchup and its operator will not be liable for indirect,
          incidental, special, consequential, or punitive damages, or for loss of data, revenue, opportunity, or use,
          arising from access to or reliance on the website. Where liability cannot be excluded, it will be limited to the
          minimum amount permitted by applicable law.
        </p>

        <h2>Changes to These Terms</h2>
        <p>
          We may revise these terms as the service changes. Updated terms become effective when posted on this page. Your
          continued use after an update indicates acceptance of the revised terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms can be sent to <a href="mailto:lincyang85@gmail.com">lincyang85@gmail.com</a> or
          through the <Link href="/contact">Contact page</Link>.
        </p>
      </article>
    </div>
  );
}
