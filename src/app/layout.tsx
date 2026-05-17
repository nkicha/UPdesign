
import type {Metadata} from 'next';
// @ts-expect-error
import './globals.css';

export const metadata: Metadata = {
  title: 'ULTRA PUB Design',
  description: 'Fabricant d\'enseignes sur mesure : néons, lettres 3D, habillage véhicules et design vintage pour entreprises.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
