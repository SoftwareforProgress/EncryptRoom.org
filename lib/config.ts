const DEFAULT_API_URL = "https://api.encryptroom.org";
const DEFAULT_RELAY_URL = "tls://relay1.encryptroom.org:443";

const RELAY_URL_PROTOCOL_PATTERN = /^(tcp|tls):\/\//;

export function getEncryptRoomApiUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ENCRYPTROOM_API_URL?.trim();
  if (!configured) {
    return DEFAULT_API_URL;
  }

  return configured.replace(/\/+$/, "");
}

export function getEncryptRoomRelayUrl(): string {
  const configured = process.env.NEXT_PUBLIC_ENCRYPTROOM_RELAY_URL?.trim();
  if (!configured) {
    return DEFAULT_RELAY_URL;
  }

  if (!RELAY_URL_PROTOCOL_PATTERN.test(configured)) {
    return DEFAULT_RELAY_URL;
  }

  return configured;
}
