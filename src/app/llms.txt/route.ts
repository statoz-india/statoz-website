import { buildLlmsTxt, markdownResponse } from "@/lib/llms";

/* Short guide to StatOz for AI assistants (https://llmstxt.org). */

export const dynamic = "force-static";

export function GET() {
  return markdownResponse(buildLlmsTxt());
}
