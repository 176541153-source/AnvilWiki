import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildServer } from '../src/mcp/server.js';
import type { queryCloudflare } from '../src/core/providers/cloudflare.js';

function tmpSite(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ops-mcp-'));
  writeFileSync(join(dir, 'wrangler.toml'), '[vars]\nSITE_URL = "https://wiki.example.com"\nPUBLIC_CF_BEACON_TOKEN = "tag1"\n');
  writeFileSync(join(dir, '.env'), 'CF_API_TOKEN=t\nCF_ACCOUNT_ID=a\n');
  return dir;
}

const fakeCf = (async () => ({
  totals: { visits: 7 },
  pages: [{ page: 'https://wiki.example.com/', visits: 7 }],
})) as unknown as typeof queryCloudflare;

async function connect(cwd: string) {
  const server = buildServer({ cwd, cfQuery: fakeCf });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await server.connect(serverTransport);
  const client = new Client({ name: 'test', version: '0.0.0' });
  await client.connect(clientTransport);
  return client;
}

describe('anvil-ops MCP server', () => {
  it('lists doctor and metrics tools', async () => {
    const client = await connect(tmpSite());
    const tools = await client.listTools();
    expect(tools.tools.map((t) => t.name).sort()).toEqual(['doctor', 'metrics']);
    expect(tools.tools.every((t) => t.description && t.description.length > 0)).toBe(true);
  });

  it('doctor tool returns markdown report', async () => {
    const client = await connect(tmpSite());
    const res = await client.callTool({ name: 'doctor', arguments: {} });
    const text = (res.content as { type: string; text: string }[])[0].text;
    expect(text).toContain('# anvil-ops doctor');
    expect(res.isError).toBeFalsy();
  });

  it('metrics tool returns markdown with cf data', async () => {
    const client = await connect(tmpSite());
    const res = await client.callTool({ name: 'metrics', arguments: { days: 7 } });
    const text = (res.content as { type: string; text: string }[])[0].text;
    expect(text).toContain('visits=7');
  });

  it('metrics with no source configured = isError with fix', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'ops-mcp-'));
    writeFileSync(join(dir, 'wrangler.toml'), '[vars]\nSITE_URL = "https://x.com"\n');
    const client = await connect(dir);
    const res = await client.callTool({ name: 'metrics', arguments: {} });
    expect(res.isError).toBe(true);
    const text = (res.content as { type: string; text: string }[])[0].text;
    expect(text).toMatch(/doctor/);
  });
});
