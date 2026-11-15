export function shouldShowLayout(
  searchParams?: { layout?: string | string[] } | null,
): boolean {
  const rawLayout = searchParams?.layout;
  const layoutParam = Array.isArray(rawLayout) ? rawLayout[0] : rawLayout;
  return layoutParam?.toLowerCase() !== "false";
}
