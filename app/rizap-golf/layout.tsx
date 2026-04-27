import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RIZAP GOLF｜体験レッスン付きゴルフ力診断',
};

export default function RizapGolfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
