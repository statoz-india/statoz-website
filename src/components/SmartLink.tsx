import Link from "next/link";
import type { ComponentProps } from "react";

/* Links inside MDX posts: site paths (/predictions/ipl, #section) use
   next/link for client-side navigation; full URLs open in a new tab. */
export default function SmartLink({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />;
  }
  return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />;
}
