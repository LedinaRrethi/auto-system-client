
const TermsAndPrivacyPolicyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Terms & Privacy Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-sm leading-relaxed">
          Welcome to <strong>AutoSystem</strong>. This document outlines our Terms of Use and Privacy Policy. By registering or using our platform, you agree to the conditions described below.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
        <p className="text-sm leading-relaxed">
          Users are responsible for maintaining the confidentiality of their login information. Sharing credentials or impersonating others is strictly prohibited.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Data Collection</h2>
        <p className="text-sm leading-relaxed">
          We collect and store personal information such as name, email, birthdate, and vehicle data. This data is used to provide services like vehicle registration, fines management, and inspection scheduling.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Protection</h2>
        <p className="text-sm leading-relaxed">
          All user data is securely stored and not shared with third parties without consent, except when required by law. Passwords are hashed and never stored in plain text.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Use of Cookies</h2>
        <p className="text-sm leading-relaxed">
          AutoSystem uses cookies to enhance user experience. These cookies store minimal information and are not used for tracking purposes outside the platform.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Rights & Restrictions</h2>
        <p className="text-sm leading-relaxed">
          Users with specific roles (Individual, Police, Specialist, Admin) have different levels of access. Unauthorized actions or misuse of roles may lead to suspension or account termination.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Changes & Updates</h2>
        <p className="text-sm leading-relaxed">
          We reserve the right to update these terms at any time. Users will be notified of significant changes. Continued use of the platform constitutes agreement to the revised terms.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
        <p className="text-sm leading-relaxed">
          For questions or concerns regarding these terms, contact us at <a href="mailto:support@autosystem.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@autosystem.com</a>.
        </p>
      </section>
    </div>
  );
};

export default TermsAndPrivacyPolicyPage;
