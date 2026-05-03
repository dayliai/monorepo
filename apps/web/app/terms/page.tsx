import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions — Dayli AI',
  description: 'The terms that govern your use of Dayli AI.',
}

export default function TermsPage() {
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
          Terms and Conditions
        </h1>
        <p className="text-sm text-[#461F65]/70">Daily Living Labs (doing business as Dayli AI)</p>
        <p className="text-sm text-[#461F65]/70">Effective Date: April 13, 2026</p>
        <p className="text-sm text-[#461F65]/70 mb-8">Last updated: April 05, 2026</p>

        <div className="text-[#461F65]/80 leading-[1.7] text-[15px] space-y-10 [&_section]:space-y-3">
          <section>
            <p>
              These Terms and Conditions ("Legal Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and Daily Living Labs, doing business as Dayli AI ("Company," "we," "us," "our"), concerning your access to and use of the Services.
            </p>
            <p>
              You can contact us by email at{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>{' '}
              or by mail to:
            </p>
            <address className="not-italic">
              Daily Living Labs<br />
              6057 Preston Haven Dr<br />
              Dallas, TX 75230<br />
              United States
            </address>
            <p>
              You agree that by accessing the Services, you have read, understood, and agreed to be bound by all of these Legal Terms. IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
            <p>
              Supplemental terms and conditions or documents that may be posted on the Services from time to time are hereby incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Legal Terms, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Legal Terms to stay informed of updates.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">Table of Contents</h2>
            <ol className="list-decimal pl-6 space-y-2 marker:text-[#461F65]/60">
              <li>Our Services</li>
              <li>Intellectual Property Rights</li>
              <li>User Representations</li>
              <li>Prohibited Activities</li>
              <li>User Generated Contributions</li>
              <li>Contribution License</li>
              <li>Services Management</li>
              <li>Term and Termination</li>
              <li>Modifications and Interruptions</li>
              <li>Governing Law</li>
              <li>Dispute Resolution</li>
              <li>Corrections</li>
              <li>Disclaimer</li>
              <li>Limitations of Liability</li>
              <li>Indemnification</li>
              <li>User Data</li>
              <li>Electronic Communications, Transactions, and Signatures</li>
              <li>Miscellaneous</li>
              <li>Contact Us</li>
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">1. Our Services</h2>
            <p>
              The information provided when using the Services is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Services from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">2. Intellectual Property Rights</h2>
            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Our intellectual property</h3>
            <p>
              We are the owner or the licensee of all intellectual property rights in our Services, including all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics in the Services (collectively, the "Content"), as well as the trademarks, service marks, and logos contained therein (the "Marks").
            </p>
            <p>Our Content and Marks are protected by copyright and trademark laws (and various other intellectual property rights and unfair competition laws) and treaties around the world.</p>
            <p>The Content and Marks are provided in or through the Services "AS IS" for your personal, non-commercial use or internal business purpose only.</p>

            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Your use of our Services</h3>
            <p>Subject to your compliance with these Legal Terms, we grant you a non-exclusive, non-transferable, revocable license to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#461F65]/60">
              <li>access the Services; and</li>
              <li>download or print a copy of any portion of the Content to which you have properly gained access,</li>
            </ul>
            <p>solely for your personal, non-commercial use or internal business purpose.</p>
            <p>Except as set out in this section or elsewhere in our Legal Terms, no part of the Services and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>
            <p>We reserve all rights not expressly granted to you in and to the Services, Content, and Marks. Any breach of these Intellectual Property Rights will constitute a material breach of our Legal Terms and your right to use our Services will terminate immediately.</p>

            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Your submissions</h3>
            <p>By directly sending us any question, comment, suggestion, idea, feedback, or other information about the Services ("Submissions"), you agree to assign to us all intellectual property rights in such Submission. You agree that we shall own this Submission and be entitled to its unrestricted use and dissemination for any lawful purpose, commercial or otherwise, without acknowledgment or compensation to you.</p>
            <p>You are responsible for what you post or upload. By sending us Submissions through any part of the Services you:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#461F65]/60">
              <li>confirm that you have read and agree with our Prohibited Activities and will not post, send, publish, upload, or transmit through the Services any Submission that is illegal, harassing, hateful, harmful, defamatory, obscene, bullying, abusive, discriminatory, threatening to any person or group, sexually explicit, false, inaccurate, deceptive, or misleading;</li>
              <li>to the extent permissible by applicable law, waive any and all moral rights to any such Submission;</li>
              <li>warrant that any such Submission is original to you or that you have the necessary rights and licenses to submit such Submissions;</li>
              <li>warrant and represent that your Submissions do not constitute confidential information.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">3. User Representations</h2>
            <p>By using the Services, you represent and warrant that: (1) you have the legal capacity and you agree to comply with these Legal Terms; (2) you are not a minor in the jurisdiction in which you reside; (3) you will not access the Services through automated or non-human means; (4) you will not use the Services for any illegal or unauthorized purpose; and (5) your use of the Services will not violate any applicable law or regulation.</p>
            <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Services (or any portion thereof).</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">4. Prohibited Activities</h2>
            <p>You may not access or use the Services for any purpose other than that for which we make the Services available. The Services may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
            <p>As a user of the Services, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#461F65]/60">
              <li>Use the Services to advertise or offer to sell goods and services</li>
              <li>Sell or otherwise transfer your profile</li>
              <li>Submit false, misleading, or inaccurate caregiving needs information</li>
              <li>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Services</li>
              <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services</li>
              <li>Use any information obtained from the Services in order to harass, abuse, or harm another person</li>
              <li>Use the Services in a manner inconsistent with any applicable laws or regulations</li>
              <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Services</li>
              <li>Engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools</li>
              <li>Attempt to impersonate another user or person or use the username of another user</li>
              <li>Interfere with, disrupt, or create an undue burden on the Services or the networks or services connected to the Services</li>
              <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Services to you</li>
              <li>Attempt to bypass any measures of the Services designed to prevent or restrict access to the Services, or any portion of the Services</li>
              <li>Copy or adapt the Services' software, including but not limited to Flash, PHP, HTML, JavaScript, or other code</li>
              <li>Use the Services as part of any effort to compete with us or otherwise use the Services and/or the Content for any revenue-generating endeavor or commercial enterprise</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">5. User Generated Contributions</h2>
            <p>The Services do not offer users to submit or post content. We may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Services. When you create or make available any Contributions, you thereby represent and warrant that your Submissions comply with all applicable laws and our Prohibited Activities.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">6. Contribution License</h2>
            <p>You and the Services agree that we may access, store, process, and use any information and personal data that you provide and your choices (including settings).</p>
            <p>By submitting suggestions or other feedback regarding the Services, you agree that we can use and share such feedback for any purpose without compensation to you.</p>
            <p>We do not assert any ownership over your Contributions. You retain full ownership of all of your Contributions and any intellectual property rights or other proprietary rights associated with your Contributions. We are not liable for any statements or representations in your Contributions provided by you in any area on the Services. You are solely responsible for your Contributions to the Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">7. Services Management</h2>
            <p>We reserve the right, but not the obligation, to: (1) monitor the Services for violations of these Legal Terms; (2) take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities; (3) in our sole discretion and without limitation, refuse, restrict access to, limit the availability of, or disable any of your Contributions or any portion thereof; (4) in our sole discretion and without limitation, notice, or liability, to remove from the Services or otherwise disable all files and content that are excessive in size or are in any way burdensome to our systems; and (5) otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">8. Term and Termination</h2>
            <p>These Legal Terms shall remain in full force and effect while you use the Services. WITHOUT LIMITING ANY OTHER PROVISION OF THESE LEGAL TERMS, WE RESERVE THE RIGHT TO, IN OUR SOLE DISCRETION AND WITHOUT NOTICE OR LIABILITY, DENY ACCESS TO AND USE OF THE SERVICES TO ANY PERSON FOR ANY REASON OR FOR NO REASON, INCLUDING WITHOUT LIMITATION FOR BREACH OF ANY REPRESENTATION, WARRANTY, OR COVENANT CONTAINED IN THESE LEGAL TERMS OR OF ANY APPLICABLE LAW OR REGULATION.</p>
            <p>If we terminate or suspend your account for any reason, you are prohibited from registering and creating a new account under your name, a fake or borrowed name, or the name of any third party. In addition to terminating or suspending your account, we reserve the right to take appropriate legal action, including without limitation pursuing civil, criminal, and injunctive redress.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">9. Modifications and Interruptions</h2>
            <p>We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services.</p>
            <p>We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors. You agree that we have no liability whatsoever for any loss, damage, or inconvenience caused by your inability to access or use the Services during any downtime or discontinuance of the Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">10. Governing Law</h2>
            <p>These Legal Terms shall be governed by and defined following the laws of the State of Texas, United States. Daily Living Labs and yourself irrevocably consent that the courts of Texas shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these Legal Terms.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">11. Dispute Resolution</h2>
            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Informal Negotiations</h3>
            <p>To expedite resolution and control the cost of any dispute, controversy, or claim related to these Legal Terms (each a "Dispute"), the Parties agree to first attempt to negotiate any Dispute informally for at least 30 days before initiating arbitration. Such informal negotiations commence upon written notice from one Party to the other Party.</p>
            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Binding Arbitration</h3>
            <p>Any dispute arising out of or in connection with these Legal Terms, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by binding arbitration under the laws of the State of Texas. The arbitration shall take place in Texas, United States. The governing law of these Legal Terms shall be substantive law of Texas.</p>
            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Restrictions</h3>
            <p>The Parties agree that any arbitration shall be limited to the Dispute between the Parties individually. To the full extent permitted by law: (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</p>
            <h3 className="font-serif text-lg font-semibold text-[#461F65] mt-4 mb-2">Exceptions to Informal Negotiations and Arbitration</h3>
            <p>The Parties agree that the following Disputes are not subject to the above provisions: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a Party; (b) any Dispute related to allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">12. Corrections</h2>
            <p>There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">13. Disclaimer</h2>
            <p>THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SERVICES AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SERVICES' CONTENT OR THE CONTENT OF ANY WEBSITES OR MOBILE APPLICATIONS LINKED TO THE SERVICES AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE OF ANY NATURE WHATSOEVER RESULTING FROM YOUR ACCESS TO AND USE OF THE SERVICES, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SERVICES, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SERVICES BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SERVICES. WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR ANY PRODUCT OR SERVICE ADVERTISED OR OFFERED BY A THIRD PARTY THROUGH THE SERVICES, ANY HYPERLINKED WEBSITE, OR ANY WEBSITE OR MOBILE APPLICATION FEATURED IN ANY BANNER OR OTHER ADVERTISING, AND WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND ANY THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">14. Limitations of Liability</h2>
            <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US. CERTAIN US STATE LAWS AND INTERNATIONAL LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">15. Indemnification</h2>
            <p>You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of: (1) use of the Services; (2) breach of these Legal Terms; (3) any breach of your representations and warranties set forth in these Legal Terms; (4) your violation of the rights of a third party, including but not limited to intellectual property rights; or (5) any overt harmful act toward any other user of the Services with whom you connected via the Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">16. User Data</h2>
            <p>We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption of such data.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">17. Electronic Communications, Transactions, and Signatures</h2>
            <p>Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. YOU HEREBY AGREE TO THE USE OF ELECTRONIC SIGNATURES, CONTRACTS, ORDERS, AND OTHER RECORDS, AND TO ELECTRONIC DELIVERY OF NOTICES, POLICIES, AND RECORDS OF TRANSACTIONS INITIATED OR COMPLETED BY US OR VIA THE SERVICES. You hereby waive any rights or requirements under any statutes, regulations, rules, ordinances, or other laws in any jurisdiction which require an original signature or delivery or retention of non-electronic records, or to payments or the granting of credits by any means other than electronic means.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">18. Miscellaneous</h2>
            <p>These Legal Terms and any policies or operating rules posted by us on the Services or in respect to the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any provision or part of a provision of these Legal Terms is determined to be unlawful, void, or unenforceable, that provision or part of the provision is deemed severable from these Legal Terms and does not affect the validity and enforceability of any remaining provisions. There is no joint venture, partnership, employment or agency relationship created between you and us as a result of these Legal Terms or use of the Services.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-[#461F65] mb-3 pb-2 border-b border-[#461F65]/10">19. Contact Us</h2>
            <p>In order to resolve a complaint regarding the Services or to receive further information regarding use of the Services, please contact us at:</p>
            <p>
              Daily Living Labs (doing business as Dayli AI)<br />
              6057 Preston Haven Dr<br />
              Dallas, TX 75230<br />
              United States<br />
              Email:{' '}
              <a href="mailto:info@dailylivinglabs.com" className="text-[#9230E3] underline hover:no-underline focus-visible:outline-2 focus-visible:outline-[#9230E3] focus-visible:outline-offset-2 rounded">
                info@dailylivinglabs.com
              </a>
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
