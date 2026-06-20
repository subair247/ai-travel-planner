import './globals.css';
import React from 'react';

export const metadata = {
  title: 'Trao AI Travel Planner',
  description: 'Intelligent Cloud Itineraries',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}