import type { Metadata } from "next";
import { Lexend_Deca } from "next/font/google";
import "./globals.css";

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  variable: '--font-lexend',
  weight: ['300', '400', '600', '700'],
  display: 'swap',
});

const SITE_TITLE = "Pramish Sihali | Full-Stack Developer";
const SITE_DESCRIPTION = "Full-Stack Developer specializing in modern web technologies, AI integration, and creating elegant digital experiences.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: ["Full-Stack Developer", "Web Developer", "React", "Next.js", "AI", "Portfolio"],
  authors: [{ name: "Pramish Sihali" }],
  creator: "Pramish Sihali",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Pramish Sihali Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexendDeca.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
