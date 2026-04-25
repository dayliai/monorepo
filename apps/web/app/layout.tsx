import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dayli AI — Daily Living Solutions",
  description: "Find adaptive solutions for daily living challenges. AI-powered personalized support for people with disabilities, families, and caregivers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
