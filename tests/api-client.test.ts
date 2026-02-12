import assert from "node:assert/strict";
import test from "node:test";
import { createBundle } from "../lib/api";

test("createBundle sends relay from env and returns API error body for 429", async () => {
  process.env.NEXT_PUBLIC_ENCRYPTROOM_API_URL = "https://api.encryptroom.org";
  process.env.NEXT_PUBLIC_ENCRYPTROOM_RELAY_URL = "tls://relay1.encryptroom.org:443";

  const fetchMock: typeof fetch = async (...args: Parameters<typeof fetch>) => {
    const init = args[1];
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : undefined;

    assert.equal(body?.chat_name, "friends-night");
    assert.equal(body?.password, "correct horse battery staple");
    assert.equal(body?.relay_url, "tls://relay1.encryptroom.org:443");

    return new Response(JSON.stringify({ error: "Too many requests right now." }), {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": "6",
      },
    });
  };

  const result = await createBundle(
    {
      chat_name: "friends-night",
      password: "correct horse battery staple",
    },
    fetchMock,
  );

  assert.equal(result.ok, false);
  if (result.ok) {
    return;
  }

  assert.equal(result.status, 429);
  assert.equal(result.message, "Too many requests right now.");
  assert.equal(result.retryAfterSeconds, 6);
});
