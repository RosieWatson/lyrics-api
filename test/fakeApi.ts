import { NextApiRequest, NextApiResponse } from 'next';

type Recorded = {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
};

export function fakeRequest(method: string, query: Record<string, string> = {}) {
  return { method, query } as unknown as NextApiRequest;
}

export function fakeResponse() {
  const recorded: Recorded = { statusCode: 200, headers: {}, body: undefined };
  const res = {
    setHeader(name: string, value: string) {
      recorded.headers[name] = value;
      return res;
    },
    status(code: number) {
      recorded.statusCode = code;
      return res;
    },
    json(body: unknown) {
      recorded.body = body;
      return res;
    },
    end() {
      return res;
    },
  };
  return { res: res as unknown as NextApiResponse, recorded };
}
