// app/layout.js
import './globals.css';
import { Inter } from 'next/font/google'; // Use Inter or any other font of your choice
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NADEEM FOODS',
  description: 'Delicious food at your doorstep',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
