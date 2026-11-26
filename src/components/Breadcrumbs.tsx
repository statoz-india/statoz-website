import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structuredData";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/* Visible breadcrumbs plus their BreadcrumbList schema, so every inner page
   that shows a trail also gets the rich result. */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <JsonLd data={breadcrumbJsonLd(items)} />
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1;
          return (
            <li key={item.label}>
              {item.href && !current ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span aria-current={current ? "page" : undefined}>{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
