export interface InstamartSearchRequest {
  addressId: string;
  query: string;
  offset?: number;
}

export interface InstamartSearchResult {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: { message?: string };
}

/**
 * Calls Swiggy Instamart's official MCP server.
 *
 * The caller supplies a valid OAuth 2.1 bearer token obtained through
 * Swiggy Builders Club. Tokens must never be hard-coded or committed.
 *
 * Official endpoint: https://mcp.swiggy.com/im
 */
export async function searchInstamart(
  accessToken: string,
  request: InstamartSearchRequest,
): Promise<InstamartSearchResult> {
  if (!accessToken) throw new Error('Missing Swiggy access token');
  if (!request.addressId) throw new Error('Missing Instamart addressId');
  if (!request.query.trim()) throw new Error('Missing product query');

  const endpoint = 'https://mcp.swiggy.com/im';

  const initializeResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: {
          name: 'NestBasket',
          version: '1.0.0',
        },
      },
    }),
  });

  if (!initializeResponse.ok) {
    throw new Error(`Swiggy MCP initialize failed: HTTP ${initializeResponse.status}`);
  }

  const sessionId = initializeResponse.headers.get('mcp-session-id');

  const initializedResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
      params: {},
    }),
  });

  if (!initializedResponse.ok && initializedResponse.status !== 202) {
    throw new Error(`Swiggy MCP session setup failed: HTTP ${initializedResponse.status}`);
  }

  const toolResponse = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json, text/event-stream',
      'Content-Type': 'application/json',
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'search_products',
        arguments: {
          addressId: request.addressId,
          query: request.query.trim(),
          ...(request.offset != null ? { offset: request.offset } : {}),
        },
      },
    }),
  });

  if (!toolResponse.ok) {
    throw new Error(`Swiggy search_products failed: HTTP ${toolResponse.status}`);
  }

  const raw = await toolResponse.text();

  try {
    // Streamable HTTP may return JSON or Server-Sent Events.
    const jsonPayload = raw.trim().startsWith('{')
      ? raw.trim()
      : raw
          .split(/\\r?\\n/)
          .filter((line) => line.startsWith('data:'))
          .map((line) => line.slice(5).trim())
          .filter(Boolean)
          .at(-1) ?? '';

    const parsed = JSON.parse(jsonPayload);
    if (parsed?.error) {
      return {
        success: false,
        error: { message: parsed.error.message || 'Instamart search failed' },
      };
    }
    return parsed?.result ?? parsed;
  } catch {
    return {
      success: false,
      error: { message: 'Instamart returned a non-JSON MCP response' },
    };
  }
}
