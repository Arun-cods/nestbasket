import { searchInstamart } from '../../src/lib/storeAdapters/instamart';

type RequestLike = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => void;
  setHeader?: (name: string, value: string) => void;
};

export default async function handler(req: RequestLike, res: ResponseLike) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authorization = req.headers?.authorization ?? req.headers?.Authorization;
  const accessToken = Array.isArray(authorization)
    ? authorization[0]?.replace(/^Bearer\\s+/i, '')
    : authorization?.replace(/^Bearer\\s+/i, '');

  if (!accessToken) {
    return res.status(401).json({
      error: 'Swiggy OAuth required',
      message: 'Connect an authenticated Swiggy account before requesting live Instamart data.',
    });
  }

  const body = (req.body ?? {}) as { addressId?: string; query?: string; offset?: number };

  if (!body.addressId || !body.query?.trim()) {
    return res.status(400).json({
      error: 'addressId and query are required',
    });
  }

  try {
    const result = await searchInstamart(accessToken, {
      addressId: body.addressId,
      query: body.query,
      offset: body.offset,
    });

    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Instamart request failed';
    return res.status(502).json({ error: message });
  }
}
