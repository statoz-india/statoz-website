import Link from "next/link";
import { BrandIcon } from "@/components/PagesBrandIcon";
import { ROUTES } from "@/lib/routes";

type BrandMarkProps = {
  image?: boolean;
};

export default function BrandMark({ image = false }: BrandMarkProps) {
  return (
    <Link className="brand" href={ROUTES.home} aria-label="StatOz home">
      <BrandIcon name="logo" size={image ? 44 : 30} alt="" />
      <span className="brand__text">StatOz</span>
    </Link>
  );
}
