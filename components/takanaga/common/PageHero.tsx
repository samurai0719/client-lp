import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
};

export default function PageHero({ eyebrow, title, subtitle, breadcrumbs }: Props) {
  return (
    <>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="tkn-page-hero">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {eyebrow && (
            <p className="tkn-eyebrow !text-(--tkn-blue-light) mb-3">{eyebrow}</p>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-white/75 text-sm sm:text-base leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
