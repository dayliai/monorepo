import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Dayli AI',
  description: 'How Dayli AI handles your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-[#461F65] focus:px-4 focus:py-2 focus:text-white focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-6 md:px-12 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-[#461F65] focus-visible:outline-offset-2 rounded">
          <img src="/dayli-logotype.png" alt="Dayli AI" className="h-8 md:h-9 object-contain" />
        </Link>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-3xl mx-auto w-full px-4 py-12 focus:outline-none">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#461F65] mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#461F65]/70">Daily Living Labs (doing business as Dayli AI)</p>
        <p className="text-sm text-[#461F65]/70">Effective Date: April 13, 2026</p>
        <p className="text-sm text-[#461F65]/70 mb-8">Last Updated: April 3, 2026</p>

        <div className="text-[#461F65]/80 leading-relaxed space-y-6 text-[15px]">
          <section>
            <p>This Privacy Notice for Daily Living Labs (doing business as Dayli AI) ("we," "us," or "our") describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Visit our website at <a href="https://dayliai.org" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">https://dayliai.org</a> or any website of ours that links to this Privacy Notice.</li>
              <li>Use Dayli AI. Dayli AI is a platform that helps caregivers and individuals with disabilities discover personalized solutions by combining community knowledge, trusted external content, and AI-powered retrieval. Users complete a needs assessment to receive relevant resources and solutions tailored to their needs.</li>
              <li>Engage with us in other related ways, including any marketing or events.</li>
            </ul>
            <p>
              Questions or concerns? Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">Summary of Key Points</h2>
            <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
            <p><strong>Do we process any sensitive personal information?</strong> We process sensitive personal information — including health data and disability and caregiving needs information — when necessary, with your consent or as otherwise permitted by applicable law.</p>
            <p><strong>Do we collect any information from third parties?</strong> We do not collect any information from third parties.</p>
            <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
            <p><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties, including Anthropic (AI), Google Analytics, Supabase, Vercel, Firecrawl, and Supadata.</p>
            <p><strong>How do we keep your information safe?</strong> We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
            <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</p>
            <p>
              <strong>How do you exercise your rights?</strong> You can contact us by emailing us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">1. What Information Do We Collect?</h2>
            <h3 className="font-semibold text-[#461F65] mt-4 mb-1">Personal Information You Disclose to Us</h3>
            <p><em>In Short: We collect personal information that you provide to us.</em></p>
            <p>We collect personal information that you voluntarily provide to us when you register on the Services or otherwise when you contact us. The personal information we collect may include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Names</li>
              <li>Email addresses</li>
              <li>Usernames</li>
              <li>Passwords</li>
              <li>Caregiving needs and disability-related information</li>
            </ul>
            <p><strong>Sensitive Information.</strong> When necessary, with your consent or as otherwise permitted by applicable law, we process the following categories of sensitive information:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Health data</li>
              <li>Disability and caregiving needs information</li>
            </ul>
            <p><strong>Social Media Login Data.</strong> We may provide you with the option to register using your existing social media account details, such as your Google, Facebook, or Apple account. If you choose to register in this way, we will collect certain profile information about you from the social media provider.</p>
            <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>

            <h3 className="font-semibold text-[#461F65] mt-4 mb-1">Information Automatically Collected</h3>
            <p><em>In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</em></p>
            <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, and other technical information. This information is primarily needed to maintain the security and operation of our Services and for our internal analytics and reporting purposes.</p>
            <p>
              We also collect information through cookies and similar technologies. You can find out more about this in our Cookie Notice at{' '}
              <a href="https://dayliai.org/cookies" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">https://dayliai.org/cookies</a>.
            </p>
            <p><strong>Log and Usage Data.</strong> Log and usage data is service-related, diagnostic, usage, and performance information our servers automatically collect when you access or use our Services. This log data may include your IP address, browser type and settings, and information about your activity in the Services.</p>
            <p><strong>Device Data.</strong> We collect device data such as information about your computer, phone, tablet, or other device you use to access the Services. This device data may include information such as your IP address (or proxy server), device and application identification numbers, location, browser type, hardware model, Internet service provider, and system configuration information.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">2. How Do We Process Your Information?</h2>
            <p><em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em></p>
            <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>To facilitate account creation and authentication and otherwise manage user accounts</li>
              <li>To deliver and facilitate delivery of services to the user — including using your needs assessment data to retrieve relevant caregiving solutions</li>
              <li>To respond to user inquiries and offer support to users</li>
              <li>To send administrative information to you, including details about our products and services and changes to our terms and policies</li>
              <li>To request feedback and to contact you about your use of our Services</li>
              <li>To protect our Services, including fraud monitoring and prevention</li>
              <li>To identify usage trends so we can improve how our Services are being used</li>
              <li>To save or protect an individual's vital interest, such as to prevent harm</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">3. What Legal Bases Do We Rely On to Process Your Information?</h2>
            <p><em>In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason to do so under applicable law.</em></p>
            <p>We may process your information if you have given us permission (i.e., consent) to use your personal information for a specific purpose. You can withdraw your consent at any time.</p>
            <p>We may process your personal information when we believe it is necessary to fulfill our contractual obligations to you, including providing our Services (Performance of a Contract).</p>
            <p>We may process your information when we believe it is reasonably necessary to achieve our legitimate business interests, such as analyzing how our Services are used so we can improve them, diagnosing problems, and preventing fraudulent activities (Legitimate Interests).</p>
            <p>We may process your information where we believe it is necessary for compliance with our legal obligations (Legal Obligations).</p>
            <p>We may process your information where we believe it is necessary to protect your vital interests or the vital interests of a third party (Vital Interests).</p>
            <p>If you are located in the EU or UK, this section applies to you. The GDPR and UK GDPR require us to explain the valid legal bases we rely on in order to process your personal information. We may rely on Consent, Performance of a Contract, Legitimate Interests, Legal Obligations, and Vital Interests as outlined above.</p>
            <p>If you are located in Canada, we may process your information if you have given us express or implied consent, or in exceptional cases where permitted by applicable law.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">4. When and With Whom Do We Share Your Personal Information?</h2>
            <p><em>In Short: We may share information in specific situations described in this section and/or with the following third parties.</em></p>
            <p>We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. The third parties we may share personal information with include:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>AI Service Providers — Anthropic (Claude API)</li>
              <li>Allow Users to Connect to Their Third-Party Accounts — Facebook account and Google account</li>
              <li>User Account Registration and Authentication — Facebook Login and Google Sign-In</li>
              <li>Web and Mobile Analytics — Google Analytics</li>
              <li>Website Hosting and Deployment — Vercel</li>
              <li>Database and Backend — Supabase</li>
              <li>Web Content Ingestion — Firecrawl</li>
              <li>YouTube Content Ingestion — Supadata</li>
            </ul>
            <p><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">5. Do We Use Cookies and Other Tracking Technologies?</h2>
            <p><em>In Short: We may use cookies and other tracking technologies to collect and store your information.</em></p>
            <p><strong>We use the following cookies:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Strictly necessary cookies</strong> — these are required for the Services to function and cannot be switched off. They are usually set in response to actions you take such as logging in or filling out forms.</li>
              <li>
                <strong>Analytics cookies</strong> — we use Google Analytics to track and analyze how users interact with our Services. This helps us understand usage patterns and improve the platform. To opt out of being tracked by Google Analytics, visit{' '}
                <a href="https://tools.google.com/dlpage/gaoptout" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">https://tools.google.com/dlpage/gaoptout</a>.
              </li>
            </ul>
            <p><strong>Managing your cookie preferences.</strong> When you first visit our Services, you will be presented with a cookie consent banner allowing you to accept or decline non-essential cookies. If you decline, analytics cookies such as Google Analytics will not be activated. You can also control cookies through your browser settings, though disabling certain cookies may affect the functionality of our Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">6. Do We Offer Artificial Intelligence-Based Products?</h2>
            <p><em>In Short: We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.</em></p>
            <p>We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies. These tools are designed to enhance your experience and provide you with innovative solutions.</p>
            <p>We provide these AI Products through Anthropic. Your input, output, and personal information will be shared with and processed by Anthropic to enable your use of our AI features. Our AI Products are designed for the following functions:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>AI search — semantic retrieval of relevant caregiving solutions</li>
              <li>Text analysis — processing user needs assessment input</li>
              <li>Natural language processing</li>
              <li>AI insights — personalized solution recommendations</li>
            </ul>
            <p><strong>How to Opt Out.</strong> To opt out of AI data processing, you can contact us using the contact information provided at the end of this document.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">7. How Do We Handle Your Social Logins?</h2>
            <p><em>In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em></p>
            <p>Our Services offer you the ability to register and log in using your third-party social media account details (such as your Google or Facebook logins). If you choose to do this, we will receive certain profile information about you from your social media provider, including your name, email address, and profile picture. We will use the information we receive only for the purposes that are described in this Privacy Notice.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">8. Is Your Information Transferred Internationally?</h2>
            <p><em>In Short: We may transfer, store, and process your information in countries other than your own.</em></p>
            <p>Our servers are located in the United States. If you are accessing our Services from outside the United States, please be aware that your information may be transferred to, stored by, and processed by us in the United States.</p>
            <p>If you are a resident in the European Economic Area (EEA), United Kingdom (UK), or Switzerland, we will take all necessary measures to protect your personal information in accordance with this Privacy Notice and applicable law. We have implemented the European Commission's Standard Contractual Clauses for transfers of personal information between us and our third-party providers.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">9. How Long Do We Keep Your Information?</h2>
            <p><em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em></p>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. We will not keep your personal information for longer than the period of time in which users have an account with us.</p>
            <p>When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or securely store your personal information and isolate it from any further processing until deletion is possible.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">10. How Do We Keep Your Information Safe?</h2>
            <p><em>In Short: We aim to protect your personal information through a system of organizational and technical security measures.</em></p>
            <p>We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. Our data is stored and processed using Supabase, which maintains industry-standard security practices. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. You should only access the Services within a secure environment.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">11. Do We Collect Information from Minors?</h2>
            <p><em>In Short: We do not knowingly collect data from or market to children under 18 years of age.</em></p>
            <p>
              We do not knowingly collect, solicit data from, or market to children under 18 years of age. By using the Services, you represent that you are at least 18 years of age. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">12. What Are Your Privacy Rights?</h2>
            <p><em>In Short: Depending on your state of residence in the US or in some regions, such as the EEA, UK, Switzerland, and Canada, you have rights that allow you greater access to and control over your personal information.</em></p>
            <p>In some regions (like the EEA, UK, Switzerland, and Canada), you have certain rights under applicable data protection laws. These may include the right to request access and obtain a copy of your personal information, request rectification or erasure, restrict the processing of your personal information, data portability, and the right not to be subject to automated decision-making.</p>
            <p>
              To exercise your rights, you can email us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>. We will consider and act upon any request in accordance with applicable data protection laws.
            </p>
            <p><strong>Withdrawing your consent.</strong> If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time by contacting us. Please note that this will not affect the lawfulness of the processing before its withdrawal.</p>

            <h3 className="font-semibold text-[#461F65] mt-4 mb-1">Account Information</h3>
            <p>If you would at any time like to review or change the information in your account or terminate your account, you can log in to your account settings and update your user account, or contact us using the contact information provided.</p>
            <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>
            <p><strong>Cookies and similar technologies.</strong> Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser to remove cookies and to reject cookies. If you choose to remove cookies or reject cookies, this could affect certain features or services of our Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">13. Controls for Do-Not-Track Features</h2>
            <p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">14. Do United States Residents Have Specific Privacy Rights?</h2>
            <p><em>In Short: If you are a resident of California, Colorado, Connecticut, Delaware, Florida, Indiana, Iowa, Kentucky, Maryland, Minnesota, Montana, Nebraska, New Hampshire, New Jersey, Oregon, Rhode Island, Tennessee, Texas, Utah, or Virginia, you may have the right to request access to and receive details about the personal information we maintain about you and how we have processed it, correct inaccuracies, get a copy of, or delete your personal information.</em></p>

            <h3 className="font-semibold text-[#461F65] mt-4 mb-1">Categories of Personal Information We Collect</h3>
            <p>The table below shows the categories of personal information we have collected in the past twelve (12) months.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-[#461F65]/20">
                    <th className="py-2 pr-4 align-top">Category</th>
                    <th className="py-2 pr-4 align-top">Examples</th>
                    <th className="py-2 align-top">Collected</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">A. Identifiers</td><td className="py-2 pr-4 align-top">Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name</td><td className="py-2 align-top">YES</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">B. Personal information as defined in the California Customer Records statute</td><td className="py-2 pr-4 align-top">Name, contact information, education, employment, employment history, and financial information</td><td className="py-2 align-top">YES</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">C. Protected classification characteristics under state or federal law</td><td className="py-2 pr-4 align-top">Gender, age, date of birth, race and ethnicity, national origin, marital status, and other demographic data</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">D. Commercial information</td><td className="py-2 pr-4 align-top">Transaction information, purchase history, financial details, and payment information</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">E. Biometric information</td><td className="py-2 pr-4 align-top">Fingerprints and voiceprints</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">F. Internet or other similar network activity</td><td className="py-2 pr-4 align-top">Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">G. Geolocation data</td><td className="py-2 pr-4 align-top">Device location</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">H. Audio, electronic, sensory, or similar information</td><td className="py-2 pr-4 align-top">Images and audio, video or call recordings created in connection with our business activities</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">I. Professional or employment-related information</td><td className="py-2 pr-4 align-top">Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">J. Education information</td><td className="py-2 pr-4 align-top">Student records and directory information</td><td className="py-2 align-top">NO</td></tr>
                  <tr className="border-b border-[#461F65]/10"><td className="py-2 pr-4 align-top">K. Inferences drawn from collected personal information</td><td className="py-2 pr-4 align-top">Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual's preferences and characteristics</td><td className="py-2 align-top">YES</td></tr>
                  <tr><td className="py-2 pr-4 align-top">L. Sensitive personal information</td><td className="py-2 pr-4 align-top">Account login information, health data, and disability and caregiving needs information</td><td className="py-2 align-top">YES</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              To exercise these rights, you can contact us by emailing us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">15. Do We Make Updates to This Notice?</h2>
            <p><em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em></p>
            <p>We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">16. How Can You Contact Us About This Notice?</h2>
            <p>
              If you have questions or comments about this notice, you may email us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>{' '}
              or contact us by post at:
            </p>
            <p>
              Daily Living Labs<br />
              6057 Preston Haven Dr<br />
              Dallas, TX 75230<br />
              United States
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-semibold text-[#461F65] mb-2">17. How Can You Review, Update, or Delete the Data We Collect from You?</h2>
            <p>
              Based on the applicable laws of your country or state of residence, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. To request to review, update, or delete your personal information, please email us at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 px-6 py-12 md:py-16 text-center">
        <p className="text-[14px] text-gray-400">
          © {new Date().getFullYear()} Dayli AI. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
