'use client'

import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link'

export default function LegalPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-5" style={{ 
          background: 'linear-gradient(135deg, #14432A 0%, #206542 100%)',
          color: 'white'
        }}>
          <div className="container py-4">
            <h1 className="display-5 fw-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Legal
            </h1>
            <p className="lead mb-0" style={{ maxWidth: '720px', opacity: 0.95 }}>
              Policies that govern use of Centuries Mutual websites, apps, and brokerage-related services—including 
              blockchain-backed tools, network features, and secure communications.
            </p>
          </div>
        </section>

        <section className="py-5">
          <div className="container" style={{ maxWidth: '860px' }}>
            <p className="text-muted mb-5">
              Below you will find our <strong className="text-dark">Terms and Conditions</strong> and{' '}
              <strong className="text-dark">Privacy Policy</strong> in one place. These documents apply to members, 
              hosts, tenants, landlords, and other users of Centuries Mutual. By accessing our platform, you agree 
              to the Terms; our Privacy Policy explains how we handle personal data across payments, rentals, 
              documents, and messaging products. For support questions, visit our{' '}
              <Link href="/help-desk" style={{ color: '#14432A' }}>Help desk</Link>.
            </p>

            <article id="terms-and-conditions" className="mb-5 pb-5 border-bottom">
              <h2 className="h3 fw-bold mb-4" style={{ color: '#14432A' }}>Terms and Conditions</h2>
              <p className="text-muted small mb-4">Last updated: March 2026</p>

              <h3 className="h5 fw-bold mt-4 mb-3">1. Agreement</h3>
              <p className="text-muted">
                These Terms and Conditions (&quot;Terms&quot;) govern your access to and use of websites, mobile applications, 
                and related services operated by Centuries Mutual (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), including brokerage, 
                network, blockchain-enabled features, document tools, and marketplace offerings. If you do not agree, 
                do not use the services.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">2. Services</h3>
              <p className="text-muted">
                We provide a technology-forward brokerage and community platform that may include rental and roommate 
                tools, eDocuments, payments and travel-related services, secure messaging, and other products described 
                on our site. Specific offerings may change; we may modify or discontinue features with reasonable notice 
                where required by law.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">3. Eligibility and accounts</h3>
              <p className="text-muted">
                You must be legally able to enter a binding contract in your jurisdiction. You are responsible for 
                account credentials, accurate profile information, and all activity under your account. You must notify 
                us promptly of unauthorized use.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">4. User conduct</h3>
              <p className="text-muted">
                You agree not to misuse the services: no unlawful activity, fraud, harassment, interference with security 
                or systems, scraping that violates our rules, or attempts to circumvent access controls. Listings, 
                messages, and documents you submit must comply with applicable law and must not infringe others&apos; rights.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">5. Blockchain and third-party technology</h3>
              <p className="text-muted">
                Where we describe blockchain, ledger, or distributed features, those tools supplement—not replace—your 
                legal obligations and any written agreements (for example, leases or roommate arrangements). Third-party 
                networks, wallet providers, or payment processors may apply additional terms.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">6. Fees and payments</h3>
              <p className="text-muted">
                Certain services may be subject to fees disclosed at checkout or in separate agreements. Taxes may apply. 
                You authorize us and our partners to charge payment methods you provide according to those terms.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">7. Intellectual property</h3>
              <p className="text-muted">
                The platform, branding, and proprietary content are owned by Centuries Mutual or licensors. Except as 
                expressly allowed, you may not copy, modify, distribute, or create derivative works from our materials.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">8. Disclaimers</h3>
              <p className="text-muted">
                Services are provided &quot;as is&quot; and &quot;as available&quot; to the fullest extent permitted by law. We do not 
                guarantee uninterrupted or error-free operation. Brokerage and rental outcomes depend on many factors 
                outside our control; platform tools are not a substitute for independent legal or financial advice.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">9. Limitation of liability</h3>
              <p className="text-muted">
                To the maximum extent permitted by law, Centuries Mutual and its affiliates will not be liable for 
                indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or goodwill, 
                arising from your use of the services. Our aggregate liability for claims relating to the services is 
                limited to the greater of amounts you paid us for the service giving rise to the claim in the twelve 
                months before the claim or one hundred U.S. dollars, except where limitation is prohibited.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">10. Governing law</h3>
              <p className="text-muted">
                These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law rules, 
                except where mandatory consumer protections apply. Exclusive venue for disputes shall be in courts 
                located in Dallas County, Texas, subject to arbitration or alternative dispute resolution if we specify 
                a separate agreement with you.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">11. Changes</h3>
              <p className="text-muted">
                We may update these Terms by posting a revised version and updating the &quot;Last updated&quot; date. Continued 
                use after changes constitutes acceptance of the updated Terms where permitted by law.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">12. Contact</h3>
              <p className="text-muted mb-0">
                For legal notices or questions about these Terms, use the channels listed on our{' '}
                <Link href="/help-desk" style={{ color: '#14432A' }}>Help desk</Link> page.
              </p>
            </article>

            <article id="privacy-policy">
              <h2 className="h3 fw-bold mb-4" style={{ color: '#14432A' }}>Privacy Policy</h2>
              <p className="text-muted small mb-4">Last updated: March 2026</p>

              <h3 className="h5 fw-bold mt-4 mb-3">1. Scope</h3>
              <p className="text-muted">
                This Privacy Policy describes how Centuries Mutual collects, uses, discloses, and protects personal 
                information when you use our websites, apps, and related services—including when you create a profile, 
                list or search for housing, use eDocuments, send messages, or complete payments.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">2. Information we collect</h3>
              <p className="text-muted">
                We may collect identifiers (name, email, phone), account credentials, verification and trust-related 
                data you choose to provide, payment information processed by partners, device and log data (IP address, 
                browser type, usage metrics), content you submit (messages, listings, documents), and approximate 
                location where needed for fraud prevention or service delivery.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">3. How we use information</h3>
              <p className="text-muted">
                We use personal information to provide and improve the platform, authenticate users, process 
                transactions, communicate with you, personalize your experience (including &quot;For you&quot; style content 
                where offered), detect abuse, comply with law, and enforce our Terms. We may use aggregated or 
                de-identified data that does not identify you.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">4. Sharing</h3>
              <p className="text-muted">
                We may share information with service providers who assist with hosting, analytics, payments, customer 
                support, and security; with other users where you direct (for example, showing listing or profile details); 
                to comply with legal process; or in connection with a merger or asset sale. We do not sell your personal 
                information for money as traditionally defined where such sale is restricted by applicable U.S. state law, 
                except as described in any state-specific notice we provide.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">5. Cookies and similar technologies</h3>
              <p className="text-muted">
                We use cookies and similar tools for session management, preferences, analytics, and security. You may 
                control cookies through browser settings; some features may not work if you disable them.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">6. Security</h3>
              <p className="text-muted">
                We implement administrative, technical, and organizational measures designed to protect personal data. 
                No method of transmission over the Internet is completely secure; we encourage strong passwords and 
                safeguarding your devices.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">7. Retention</h3>
              <p className="text-muted">
                We retain information as long as needed to provide services, comply with law, resolve disputes, and 
                enforce agreements. Retention periods may vary by data category.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">8. Your choices</h3>
              <p className="text-muted">
                Depending on your location, you may have rights to access, correct, delete, or export personal information, 
                or to object to or restrict certain processing. Contact us through the Help desk to exercise these rights; 
                we may verify your request as permitted by law.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">9. Children</h3>
              <p className="text-muted">
                Our services are not directed to children under 13 (or the age required in your jurisdiction). We do 
                not knowingly collect personal information from children.
              </p>

              <h3 className="h5 fw-bold mt-4 mb-3">10. Changes to this policy</h3>
              <p className="text-muted mb-0">
                We may update this Privacy Policy from time to time. We will post the updated policy and revise the 
                &quot;Last updated&quot; date. For material changes, we may provide additional notice as required.
              </p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
