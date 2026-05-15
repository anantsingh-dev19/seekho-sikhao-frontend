import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Seekho Sikhao — BY VIKRAM SINGH',
  description: 'Mentalism courses in Hindi , Mentalism products, and everything you need to grow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
