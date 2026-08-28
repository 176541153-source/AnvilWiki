const CANONICAL_HOST = 'anvilwiki.pages.dev';
const PAGES_HOST = 'anvilwiki.pages.dev';

function shouldRedirect(hostname) {
  return (
    hostname === `www.${CANONICAL_HOST}` ||
    (PAGES_HOST !== CANONICAL_HOST &&
      (hostname === PAGES_HOST || hostname.endsWith(`.${PAGES_HOST}`)))
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (shouldRedirect(url.hostname)) {
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      url.port = '';
      return Response.redirect(url, 301);
    }

    return env.ASSETS.fetch(request);
  },
};
