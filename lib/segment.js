export function extractSegmentIdFromUrl(url) {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p === "segments" || p === "segment");
    if (idx >= 0 && parts[idx + 1]) {
      const id = parts[idx + 1].split("?")[0].split("#")[0];
      return /^\d+$/.test(id) ? id : null;
    }
    return null;
  } catch {
    return null;
  }
}

export function slugify(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
