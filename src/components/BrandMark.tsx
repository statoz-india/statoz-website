import Link from "next/link";
import { ROUTES } from "@/lib/routes";

type BrandMarkProps = {
  image?: boolean;
};

export default function BrandMark({ image = false }: BrandMarkProps) {
  return (
    <Link className="brand" href={ROUTES.home} aria-label="StatOz home">
      {image ? (
        <img
          className="brand__image"
          src="/assets/brand/statoz-wordmark-v2.png"
          alt="Statoz"
        />
      ) : (
        <span className="brand__text">
          STAT
          <svg className="brand__o" viewBox="0 0 32 32" aria-hidden="true">
            <polygon
              className="o-ring"
              points="9,3 23,3 29,9 29,23 23,29 9,29 3,23 3,9"
            />
            <polygon
              className="o-core"
              points="12,9 20,9 23,12 23,20 20,23 12,23 9,20 9,12"
            />
          </svg>
          Z
        </span>
      )}
    </Link>
  );
}
