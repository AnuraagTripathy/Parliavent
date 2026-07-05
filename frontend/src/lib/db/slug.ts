export function slugFromMotion(motion: string): string {
  const slug = motion
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48)
    .replace(/^-+|-+$/g, "");

  return slug || `draft-${Date.now()}`;
}
