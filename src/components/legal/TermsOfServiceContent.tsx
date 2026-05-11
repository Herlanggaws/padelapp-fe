export default function TermsOfServiceContent() {
  return (
    <main className="flex flex-col gap-6 p-6 pb-10 text-sm text-[#41493A]">
      <section className="flex flex-col gap-2">
        <h1 className="text-[28px] font-normal text-[#151C27] leading-[33.6px] tracking-[-1%]">
          Terms of Service
        </h1>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of RallyRank
          (the &quot;App&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). By creating an account or
          using the App, you agree to these Terms.
        </p>
        <p>Last updated: May 11, 2026</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Eligibility and Accounts</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            You must be legally allowed to use digital services in your
            jurisdiction.
          </li>
          <li>
            You are responsible for providing accurate account information and
            keeping your credentials secure.
          </li>
          <li>
            You are responsible for all activity that occurs under your account.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Use the App for unlawful, harmful, or abusive conduct.</li>
          <li>
            Interfere with the App&apos;s operations, security, or other users&apos;
            experience.
          </li>
          <li>
            Upload content that is fraudulent, defamatory, threatening, or
            infringes rights of others.
          </li>
          <li>
            Attempt unauthorized access to systems, accounts, or data associated
            with the App.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          Clubs, Matches, and Events
        </h2>
        <p>
          RallyRank may provide tools to create, join, and manage clubs,
          matches, and events. Availability, schedules, participation limits,
          and outcomes depend on organizers and participants. We do not
          guarantee participation, attendance, or specific event quality.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          User Content and Permissions
        </h2>
        <p>
          You retain ownership of content you submit. By posting content in the
          App, you grant us a non-exclusive license to host, display, and
          process that content solely to operate and improve the service.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          Intellectual Property
        </h2>
        <p>
          The App, including branding, software, and design elements, is owned
          by RallyRank or its licensors and protected by applicable intellectual
          property laws. You may not copy, distribute, or modify the App except
          as allowed by law.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          Suspension and Termination
        </h2>
        <p>
          We may suspend or terminate access to the App if you violate these
          Terms, create risk to users, or if required by law. You may stop using
          the App at any time.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Disclaimers</h2>
        <p>
          The App is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To
          the fullest extent allowed by law, we disclaim warranties of
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          Limitation of Liability
        </h2>
        <p>
          To the fullest extent allowed by law, RallyRank is not liable for
          indirect, incidental, special, consequential, or punitive damages, or
          for loss of profits, data, or goodwill arising from your use of the
          App.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Indemnity</h2>
        <p>
          You agree to indemnify and hold RallyRank harmless from claims,
          damages, and expenses arising from your misuse of the App, your
          content, or your violation of these Terms.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Governing Law</h2>
        <p>
          These Terms are governed by the laws applicable to the operator of the
          App, without regard to conflict of law principles.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Changes to Terms</h2>
        <p>
          We may update these Terms from time to time. Continued use of the App
          after updates become effective means you accept the revised Terms.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Contact Us</h2>
        <p>
          If you have questions about these Terms, contact us at{" "}
          <a className="underline text-[#151C27] font-semibold" href="mailto:legal@rallyrank.com">
            legal@rallyrank.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
