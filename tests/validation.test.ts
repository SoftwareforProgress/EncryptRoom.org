import assert from "node:assert/strict";
import test from "node:test";
import { validateBundleFormInput } from "../lib/validation";

test("validateBundleFormInput trims chat name", () => {
  const result = validateBundleFormInput({
    chatName: "  friends-night  ",
    password: "correct horse battery staple",
  });

  assert.deepEqual(result.errors, {});
  assert.equal(result.payload?.chat_name, "friends-night");
  assert.equal(result.payload?.password, "correct horse battery staple");
});

test("validateBundleFormInput rejects missing required fields", () => {
  const result = validateBundleFormInput({
    chatName: " ",
    password: "",
  });

  assert.equal(result.errors.chatName, "Chat name is required.");
  assert.equal(result.errors.password, "Password is required.");
  assert.equal(result.payload, undefined);
});
