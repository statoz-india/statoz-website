import Link from "next/link";
import type { ComponentProps } from "react";

/* Links inside article copy: site paths go through next/link, anything else
   opens in a new tab. */
export default function SmartLink({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}
