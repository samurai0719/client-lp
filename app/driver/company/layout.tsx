import SingleMetaPixel from '@/components/analytics/SingleMetaPixel';
import { DORATECH_PIXEL_ID } from '@/lib/analytics/doratechCompanyPixel';

/** ドラテク 企業向けページの Meta Pixel（求職者向けとは別Pixel） */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SingleMetaPixel id={DORATECH_PIXEL_ID} />
      {children}
    </>
  );
}
