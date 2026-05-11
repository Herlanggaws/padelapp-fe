export default function PrivacyPolicyContent() {
  return (
    <main className="flex flex-col gap-6 p-6 pb-10 text-sm text-[#41493A]">
      <section className="flex flex-col gap-2">
        <h1 className="text-[28px] font-normal text-[#151C27] leading-[33.6px] tracking-[-1%]">
          Privacy Policy
        </h1>
        <p>
          This Privacy Policy explains how RallyRank (the &quot;App&quot;, &quot;we&quot;,
          &quot;our&quot;, or &quot;us&quot;) collects, uses, and protects your information
          when you use our services.
        </p>
        <p>Last updated: May 11, 2026</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Information We Collect</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            Account information such as your name, email address, and login
            credentials.
          </li>
          <li>
            Activity data such as clubs joined, matches created, event
            participation, and app interactions.
          </li>
          <li>
            Device and technical data, including browser type, device details,
            IP address, and diagnostic logs.
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          How We Use Your Information
        </h2>
        <p>We use your information to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Provide and improve RallyRank services and features.</li>
          <li>Manage your account, authentication, and security.</li>
          <li>Enable match organization, club participation, and scheduling.</li>
          <li>Communicate important updates, support responses, and notices.</li>
          <li>Detect abuse, fraud, or other harmful activity.</li>
        </ul>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">How We Share Information</h2>
        <p>
          We do not sell your personal data. We may share information with
          trusted service providers that help us operate the App, with legal
          authorities when required by law, and in connection with a merger,
          acquisition, or business transfer.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          Cookies and Local Storage
        </h2>
        <p>
          We may use cookies and local storage to keep you signed in, remember
          preferences, and improve your app experience. You can manage cookies
          in your browser settings, but disabling them may affect functionality.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Data Retention</h2>
        <p>
          We retain personal information for as long as needed to provide
          services, comply with legal obligations, resolve disputes, and enforce
          agreements. Retention periods may vary by data type and legal
          requirements.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Data Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational
          safeguards to protect your data. However, no system is completely
          secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">
          International Data Transfers
        </h2>
        <p>
          Your information may be processed in countries outside your location.
          When this happens, we take reasonable steps to ensure your data is
          protected according to applicable law.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Children&apos;s Privacy</h2>
        <p>
          RallyRank is not directed to children under the age required by
          applicable law to consent to data processing. If you believe a child
          provided us personal data, contact us so we can review and remove it.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Your Rights</h2>
        <p>
          Depending on your jurisdiction, you may have rights to access, update,
          delete, or restrict processing of your personal data. You may also
          have rights to object to processing or request data portability.
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-[#151C27]">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or your personal data,
          contact us at{" "}
          <a className="underline text-[#151C27] font-semibold" href="mailto:legal@rallyrank.com">
            legal@rallyrank.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
