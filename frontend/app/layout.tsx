import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'NexusCareer | Full-Stack Job Portal & Placement Preparation Hub',
  description:
    'Accelerate your career with curated software engineering job opportunities and comprehensive placement preparation for Aptitude, DSA, Core CS, and Company Hiring processes.',
  keywords: [
    'Job Portal',
    'Tech Jobs',
    'Software Engineer Hiring',
    'DSA Preparation',
    'Aptitude Tests',
    'Company Hiring Process',
    'Placement Prep',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="flex min-h-screen flex-col bg-[#070a12] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
