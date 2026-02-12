export const CHAT_NAME_MAX_LENGTH = 64;
export const PASSWORD_MAX_LENGTH = 256;

export interface BundleFormValues {
  chatName: string;
  password: string;
}

export interface CreateBundlePayload {
  chat_name: string;
  password: string;
}

export type BundleFormErrors = Partial<Record<"chatName" | "password", string>>;

export interface BundleValidationResult {
  errors: BundleFormErrors;
  payload?: CreateBundlePayload;
}

export function validateBundleFormInput(
  values: BundleFormValues,
): BundleValidationResult {
  const errors: BundleFormErrors = {};
  const chatName = values.chatName.trim();

  if (!chatName) {
    errors.chatName = "Chat name is required.";
  } else if (chatName.length > CHAT_NAME_MAX_LENGTH) {
    errors.chatName = `Chat name must be ${CHAT_NAME_MAX_LENGTH} characters or fewer.`;
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length > PASSWORD_MAX_LENGTH) {
    errors.password = `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`;
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  return {
    errors: {},
    payload: {
      chat_name: chatName,
      password: values.password,
    },
  };
}
