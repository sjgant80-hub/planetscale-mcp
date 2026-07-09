#!/usr/bin/env node
/**
 * planetscale-mcp · MCP server for PlanetScale
 * Auto-generated wrapping 0 tools from OpenAPI.
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { Planetscale } from '@ai-native-solutions/planetscale-sdk';

const TOOLS = [];

const server = new Server({ name: 'planetscale-mcp', version: '1.0.0' }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

const client = new Planetscale({ apiKey: process.env.PLANETSCALE_API_KEY });

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const method = req.params.name.replace('planetscale_', '');
  if (typeof client[method] !== 'function') throw new Error('unknown tool: ' + req.params.name);
  const result = await client[method](req.params.arguments || {});
  return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
});

await server.connect(new StdioServerTransport());
console.error('planetscale-mcp v1.0.0 · 0 tools ready');
