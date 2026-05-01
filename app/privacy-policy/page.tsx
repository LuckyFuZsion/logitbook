'use client'

import Link from 'next/link'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-4 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-white/60 mb-6">
          <Link href="/" className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60">
            Back to home
          </Link>
        </p>

        <h1
          className="text-4xl md:text-5xl font-black text-white/90 mb-8 text-balance"
          style={{ fontFamily: 'var(--font-orbitron)' }}
        >
          PRIVACY <span className="text-[var(--brand-red)]">POLICY</span>
        </h1>

        <div className="space-y-6 text-white/65 leading-relaxed text-base">
          <section className="space-y-3">
            <p className="text-white/90 font-bold">LOGITSHOP.COM</p>
            <p className="text-white/75 font-bold">Website privacy policy</p>
            <p>
              This website is operated by LOGITSHOP.COM. The privacy of our users is extremely important to us and therefore we encourage all users to read this policy very carefully because it contains important information regarding:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>who we are;</li>
              <li>how and why we collect, store, use and share personal information;</li>
              <li>your rights in relation to your personal information; and</li>
              <li>how to contact us and supervisory authorities in the event that you have a complaint.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Who we are
            </h2>
            <p>
              LOGITSHOP.COM ('we', 'us', 'our') collect, use and are responsible for storing certain personal information about you ('you', 'your', 'yours').
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              The personal information we collect and use
            </h2>
            <p>
              Personal information is information which you can be identified from (and does not include any anonymised forms of information).
            </p>
            <p className="text-white/85 font-bold">1. Types of personal information</p>
            <p>We may process the following types of personal information in relation to you:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Contact details such as email addresses, postal addresses, telephone numbers and secure bank details such as full card details</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              How your personal information is collected
            </h2>
            <p>This section describes how the above types of personal information are collected by us. Your personal information will be collected as follows:</p>
            <p className="text-white/85 font-bold">1. Personal information obtained from you directly</p>
            <p>We will sometimes obtain information from you directly, including when you:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Purchase a product or contact us using the contact details available on the website</li>
            </ul>
            <p className="text-white/85 font-bold">2. Additional sources</p>
            <p>We shall collect personal information in relation to you from the following sources:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Through your social media ID on any personal devices</li>
            </ul>
            <p className="text-white/85 font-bold">3. Changes to the way in which we collect your personal information</p>
            <p>In the event that we need to obtain personal information in relation to you from any other source than those described above, we shall notify you of this.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              How we use your personal information
            </h2>
            <p className="text-white/85 font-bold">1. General purposes</p>
            <p>In general, your personal information will generally be processed for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>To enter into a contract for the sale of goods to you</li>
            </ul>
            <p className="text-white/85 font-bold">2. Monitoring</p>
            <p>We may monitor communications, and in doing so we may obtain your personal information through this process. We will undertake monitoring in the following circumstances:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>All calls and emails will be monitored for quality assurance, training, fraud prevention and compliance</li>
            </ul>
            <p className="text-white/85 font-bold">3. Use of your information for marketing purposes</p>
            <p>We have described above that one of the general purposes for which your data shall be processed is for our marketing purposes.</p>
            <p>We wish to make you aware that you have the right to object or to opt-out of any direct marketing by:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Contacting us on the email address <a className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60" href="mailto:info@logitshop.com">info@logitshop.com</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Lawful basis for processing of your personal information
            </h2>
            <p>We have described above the purposes for which we may process your personal information. These purposes will at all times be justified by UK data protection law.</p>
            <p className="text-white/85 font-bold">1. General lawful bases</p>
            <p>The lawful basis upon which we are able to process your personal data are:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>(1) where we have your consent to use your data for a specific purpose;</li>
              <li>(2) where it is necessary to enter into a legal contract with you or to perform obligations under a legal contract with you;</li>
              <li>(3) where it is necessary to enable us to comply with a legal obligation;</li>
              <li>(4) where it is necessary to ensure our own legitimate interests or the legitimate interests of a third party (provided that your own interests and rights do not override those interests). Wherever we rely upon this basis, details of the legitimate interests concerned shall be provided to you;</li>
              <li>(5) where we need to protect your own vital interests (or the vital interests of another person); and/or</li>
              <li>(6) where it is needed in the public interest (or where we are acting in our official functions), provided that the task or function has a clear basis in law.</li>
            </ul>
            <p>In general, in order to meet the purposes we have described above, we will process your personal information where it is necessary in order to enter into a contract with you or in order to carry out a legal contract.</p>
            <p className="text-white/85 font-bold">2. Lawful bases specifically applicable to marketing</p>
            <p>We are able to lawfully process your personal data for marketing purposes because it is in our legitimate interests to do so. Our legitimate interests relevant to our marketing needs are:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>To ensure that we can promote our business and to ensure that we can maintain and improve the standards of our products and services</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Sharing of your personal information
            </h2>
            <p>On any occasion where any of your personal information is shared with any third party, we shall only permit them to process such information for our required purposes, under our specific instruction, and not for their own purposes. We are required to enter into a formal legal agreement to enable such sharing to take place.</p>
            <p>We do not anticipate that we will need to share your personal information with any third party. We will notify should this position change.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Necessity of information
            </h2>
            <p>Where information is requested from you and you do not provide this:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>It may prevent you from purchasing our products</li>
            </ul>
            <p>We will inform you at the point of collecting information from you, whether you are required to provide the information to us.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              How long your personal information will be kept
            </h2>
            <p>Your personal information will only be kept for the period of time which is necessary for us to fulfil the above purposes.</p>
            <p>We envisage that your personal information shall be retained by us for the following:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Name, email address and postal address - 4 years</li>
              <li>IP address - 7 months</li>
            </ul>
            <p>After the period described above, your information shall be properly deleted or anonymised.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Keeping your information secure
            </h2>
            <p>We will ensure the proper safety and security of your personal information and have measures in place to do so. We will also use technological and organisation measures to keep your information secure. These measures are as follows:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>All data is stored on secured servers. All payment details will be made via a secure portal</li>
            </ul>
            <p>We have proper procedures in place to deal with any data security breach, which shall be reported and dealt with in accordance with data protection laws and regulations. You shall also be notified of any suspected data breach concerning your personal information.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Children
            </h2>
            <p>Our website is not intended for children (anybody under the age of 18). We do not intend to collect data from children.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Your rights
            </h2>
            <p>Under the UK General Data Protection Regulation you have a number of important rights free of charge. In summary, those include rights to:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>(1) fair processing of information and transparency over how we use your use personal information;</li>
              <li>(2) access to your personal information and to certain other supplementary information that this Privacy Statement is already designed to address;</li>
              <li>(3) require us to correct any mistakes in your information which we hold;</li>
              <li>(4) require the erasure of personal information concerning you in certain situations;</li>
              <li>(5) receive the personal information concerning you which you have provided to us, in a structured, commonly used and machine-readable format and have the right to transmit this information to a third party in certain situations;</li>
              <li>(6) object at any time to processing of personal information concerning you for direct marketing;</li>
              <li>(7) object to decisions being taken by automated means which produce legal effects concerning you or similarly significantly affect you;</li>
              <li>(8) object in certain other situations to our continued processing of your personal information, or ask us to suspend the processing procedure in order for you confirm its assurance or our reasoning for processing it;</li>
              <li>(9) object to processing our your personal information where we are doing so in reliance upon a legitimate interest of our own or of a third party and where you wish to raise to an objection to this particular ground;</li>
              <li>(10) otherwise restrict our processing of your personal information in certain circumstances;</li>
              <li>(11) claim compensation for damages caused by our breach of any data protection laws; and/or</li>
              <li>(12) in any circumstance where we rely upon your consent for processing personal information, you may withdraw this consent at any time.</li>
            </ul>
            <p>
              For further information on each of those rights, including the circumstances in which they apply, see the Guidance from the UK Information Commissioner's Office (ICO) on your rights under the General Data Protection Regulations.
            </p>
            <p>If you would like to exercise any of these rights please contact DANIEL METCALFE in the following manner:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Via 'Contact Us' at <a className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60" href="mailto:info@logitshop.com">info@logitshop.com</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Your Requirements
            </h2>
            <p>If you would like this policy in another format (for example: audio, large print, braille) please contact us using the details below.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Complaints procedure
            </h2>
            <p>We hope that we can resolve any query or concern you raise about our use of your information.</p>
            <p>The UK General Data Protection Regulation also gives you right to lodge a complaint with the supervisory authority. The supervisory authority in the United Kingdom is the Information Commissioner.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Changes to the privacy policy
            </h2>
            <p>This privacy policy was published on 2nd January 2024 and last updated on 2nd January 2024.</p>
            <p>We may change this privacy policy from time to time and will notify you of any changes by:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>By email if you have opted into receiving emails and via the logitshop.com website footer</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Contacting us
            </h2>
            <p>The relevant person to contact regarding your personal information is: DANIEL METCALFE.</p>
            <p>Any requests or questions regarding the use of your personal information should be made to the above named person using the following method:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/70">
              <li>Via 'Contact Us' at <a className="underline underline-offset-4 decoration-white/20 hover:decoration-white/60" href="mailto:info@logitshop.com">info@logitshop.com</a></li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-black text-white/85" style={{ fontFamily: 'var(--font-orbitron)' }}>
              Sources of further Information
            </h2>
            <p>This policy provides key information to you regarding the processed of your information. For certain areas of our information processing, we have further comprehensive details contained in other documentation. This information can be located as follows:</p>
            <p className="text-white/75 font-bold">logitshop.com</p>
          </section>
        </div>
      </div>
    </main>
  )
}

