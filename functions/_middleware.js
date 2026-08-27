/**
 * Keep Cloudflare Pages' stable project hostname out of the canonical URL set.
 *
 * - `project.pages.dev` redirects when SITE_URL points at a custom domain.
 * - `hash.project.pages.dev` and branch previews remain available for QA.
 * - Projects whose canonical SITE_URL is already pages.dev are unchanged.
 */
export async function onRequest(context) {
  const primarySiteUrl = context.env?.SITE_URL;
  if (!primarySiteUrl) return context.next();

  let primaryUrl;
  try {
    primaryUrl = new URL(primarySiteUrl);
  } catch {
    return context.next();
  }

  const requestUrl = new URL(context.request.url);
  const hostParts = requestUrl.hostname.split('.');
  const isStablePagesHostname =
    hostParts.length === 3 && hostParts[1] === 'pages' && hostParts[2] === 'dev';

  if (isStablePagesHostname && requestUrl.hostname !== primaryUrl.hostname) {
    const destination = new URL(`${requestUrl.pathname}${requestUrl.search}`, primaryUrl.origin);
    return Response.redirect(destination, 301);
  }

  return context.next();
}
