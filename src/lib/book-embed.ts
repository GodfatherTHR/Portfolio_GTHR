const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com"]);

function toPreviewPath(pathname: string) {
  return pathname.endsWith("/preview") ? pathname : `${pathname.replace(/\/$/, "")}/preview`;
}

export function extractFirstUrl(value: string) {
  const match = value.match(/https?:\/\/[^\s<>"']+/i);
  return match?.[0] ?? null;
}

export function normalizeBookEmbedUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    const hostname = url.hostname.toLowerCase();

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (YOUTUBE_HOSTS.has(hostname)) {
      const videoId =
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean)[1];

      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (hostname === "drive.google.com" && url.pathname.includes("/file/d/")) {
      return `https://drive.google.com${toPreviewPath(url.pathname)}`;
    }

    if (hostname === "docs.google.com") {
      return `https://docs.google.com${toPreviewPath(url.pathname)}${url.search}`;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function createBookEmbedIframe(rawUrl: string) {
  const embedUrl = normalizeBookEmbedUrl(rawUrl);
  if (!embedUrl) {
    return null;
  }

  return `<iframe src="${embedUrl}" title="Embedded book content" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}
