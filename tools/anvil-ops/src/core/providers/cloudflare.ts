import { OpsError } from '../errors.js';

export interface CfPageRow {
  page: string;
  visits: number;
}

export interface CfQueryResult {
  totals: { visits: number };
  pages: CfPageRow[];
}

const CF_GRAPHQL_URL = 'https://api.cloudflare.com/client/v4/graphql';

export function buildCfQuery(): string {
  return `query ($accountTag: string!, $filter: rumOperationsGroups_filter) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumOperationsGroups(limit: 100, filter: $filter, orderBy: [_count_DESC]) {
        count
        dimensions { rumPageUrl }
      }
    }
  }
}`;
}

export function buildCfVariables(args: { siteTag: string; days: number }): Record<string, unknown> {
  const to = new Date();
  const from = new Date(to.getTime() - args.days * 24 * 3600 * 1000);
  return {
    accountTag: '',
    filter: {
      _siteTag: args.siteTag,
      _datetime_geq: from.toISOString(),
      _datetime_lt: to.toISOString(),
    },
  };
}

interface CfGroup {
  count?: number;
  dimensions?: { rumPageUrl?: string };
}

export function parseCfResponse(json: unknown): CfQueryResult {
  const withErrors = json as { errors?: { message?: string }[] };
  if (withErrors?.errors?.length) {
    throw new OpsError(
      'Cloudflare GraphQL error: ' + withErrors.errors.map((e) => e.message ?? '').join('; '),
      'If this is a field-validation error, inspect the live schema: curl -sS https://api.cloudflare.com/client/v4/graphql -H "Authorization: Bearer $CF_API_TOKEN" -H \'Content-Type: application/json\' --data \'{"query":"{ __type(name: \\"RumOperationsGroupsDimensionGroup\\") { fields { name } }"}\'',
    );
  }
  const groups =
    (json as { data?: { viewer?: { accounts?: { rumOperationsGroups?: CfGroup[] }[] } } })
      ?.data?.viewer?.accounts?.[0]?.rumOperationsGroups ?? [];
  const pages = groups.map((g) => ({ page: g.dimensions?.rumPageUrl ?? '(unknown)', visits: g.count ?? 0 }));
  return { totals: { visits: pages.reduce((s, p) => s + p.visits, 0) }, pages };
}

export async function queryCloudflare(opts: {
  apiToken: string;
  accountId: string;
  siteTag: string;
  days: number;
  fetchImpl?: typeof fetch;
}): Promise<CfQueryResult> {
  const doFetch = opts.fetchImpl ?? fetch;
  const variables = buildCfVariables({ siteTag: opts.siteTag, days: opts.days });
  variables.accountTag = opts.accountId;
  const res = await doFetch(CF_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${opts.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: buildCfQuery(), variables }),
  });
  if (res.status === 401 || res.status === 403) {
    throw new OpsError(
      `Cloudflare API returned ${res.status}.`,
      'Create an API token in the Cloudflare dashboard with permission Account > Analytics > Read, set CF_API_TOKEN in .env, then re-run `anvil-ops doctor`.',
    );
  }
  if (!res.ok) {
    throw new OpsError(`Cloudflare API returned ${res.status}.`, 'Re-run in a moment; if it persists run `anvil-ops doctor`.');
  }
  return parseCfResponse(await res.json());
}
