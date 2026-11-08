import { buildLlmsFullTxt, markdownResponse } from "@/lib/llms";

/* Every page's content in plain markdown, plus brand, topics and answers to
   the questions people ask AI assistants. Rebuilt from site data on deploy. */

export const dynamic = "force-static";

export function GET() {
  return markdownResponse(buildLlmsFullTxt());
}
