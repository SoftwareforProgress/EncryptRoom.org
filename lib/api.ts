import { getEncryptRoomApiUrl, getEncryptRoomRelayUrl } from "./config";
import { parseContentDispositionFilename, parseRetryAfterHeader } from "./http";
import type { CreateBundlePayload } from "./validation";

const FALLBACK_FILENAME = "encryptroom-bundle.zip";

export interface BundleMetadata {
  roomId?: string;
  chat?: string;
  roomName?: string;
}

export interface CreateBundleSuccess {
  ok: true;
  blob: Blob;
  filename: string;
  metadata: BundleMetadata;
}

export interface CreateBundleError {
  ok: false;
  status: number;
  message: string;
  retryAfterSeconds?: number;
}

export type CreateBundleResult = CreateBundleSuccess | CreateBundleError;

function normalizeHeaderValue(value: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function fallbackErrorMessage(status: number): string {
  if (status === 400) {
    return "Invalid request. Please review your inputs and try again.";
  }

  if (status === 429) {
    return "Rate limit exceeded. Please wait before retrying.";
  }

  if (status >= 500) {
    return "EncryptRoom API is unavailable right now. Please try again shortly.";
  }

  return `Request failed with status ${status}.`;
}

async function extractApiErrorMessage(response: Response): Promise<string | undefined> {
  const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return undefined;
  }

  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string" && body.error.trim()) {
      return body.error;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export async function createBundle(
  payload: CreateBundlePayload,
  fetchImpl: typeof fetch = fetch,
): Promise<CreateBundleResult> {
  const apiUrl = getEncryptRoomApiUrl();
  const relayUrl = getEncryptRoomRelayUrl();
  const response = await fetchImpl(`${apiUrl}/api/v1/bundles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/zip",
    },
    body: JSON.stringify({
      ...payload,
      relay_url: relayUrl,
    }),
  });

  if (!response.ok) {
    const apiErrorMessage = await extractApiErrorMessage(response);
    return {
      ok: false,
      status: response.status,
      message: apiErrorMessage ?? fallbackErrorMessage(response.status),
      retryAfterSeconds:
        response.status === 429
          ? parseRetryAfterHeader(response.headers.get("retry-after"))
          : undefined,
    };
  }

  const fileName =
    parseContentDispositionFilename(response.headers.get("content-disposition")) ??
    FALLBACK_FILENAME;

  return {
    ok: true,
    blob: await response.blob(),
    filename: fileName,
    metadata: {
      roomId: normalizeHeaderValue(response.headers.get("X-EncryptRoom-Room-ID")),
      chat: normalizeHeaderValue(response.headers.get("X-EncryptRoom-Chat")),
      roomName: normalizeHeaderValue(
        response.headers.get("X-EncryptRoom-Room-Name"),
      ),
    },
  };
}
