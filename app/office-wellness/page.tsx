import type { Metadata } from 'next';
import OfficeWellnessLP from './OfficeWellnessLP';

export const metadata: Metadata = {
  title: 'オフィスウェルネス | 法人向け出張コンディションケアサービス',
  description: '専門施術者がオフィスに直接伺い、社員の疲労ケアと満足度向上をサポートする法人向けウェルネスサービス。福利厚生・健康経営・定着率向上に。',
};

export default function Page() {
  return <OfficeWellnessLP />;
}
