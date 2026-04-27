import type { Metadata } from "next";
import { Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { CookiesModal } from "@/components/CookiesModal";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dayli AI — Daily Living Solutions",
  description: "Find adaptive solutions for daily living challenges.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('dayli-theme');
              if (t && t !== 'light') document.documentElement.classList.add('theme-' + t);
              if (localStorage.getItem('dayli-large-text') === 'true') document.documentElement.classList.add('large-text');
            } catch(e) {}
          })();
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-NDG8J355');
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-NDG8J355"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-[9999] focus:bg-[#4A154B] focus:text-white focus:px-4 focus:py-2 focus:text-[16px] focus:font-bold">
          Skip to main content
        </a>
        {children}
        <CookiesModal />
      </body>
    </html>
  );
}
