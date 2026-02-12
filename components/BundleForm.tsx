"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { createBundle, type BundleMetadata } from "@/lib/api";
import { downloadBlob } from "@/lib/download";
import {
    CHAT_NAME_MAX_LENGTH,
    PASSWORD_MAX_LENGTH,
    type BundleFormErrors,
    type BundleFormValues,
    validateBundleFormInput,
} from "@/lib/validation";

type Feedback =
    | {
          type: "success";
          message: string;
          metadata: BundleMetadata;
      }
    | {
          type: "error";
          message: string;
      };

const GENERATION_STEPS = [
    "Generating chat room",
    "Securing password and invite",
    "Building client binaries",
    "Packaging download bundle",
];

const INITIAL_VALUES: BundleFormValues = {
    chatName: "",
    password: "",
};

export function BundleForm() {
    const [values, setValues] = useState<BundleFormValues>(INITIAL_VALUES);
    const [showPassword, setShowPassword] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [errors, setErrors] = useState<BundleFormErrors>({});
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [retryAfterSeconds, setRetryAfterSeconds] = useState(0);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [generationSeconds, setGenerationSeconds] = useState(0);

    const isSubmitDisabled = isPending || retryAfterSeconds > 0;

    const metadataItems = useMemo(() => {
        if (feedback?.type !== "success") {
            return [];
        }

        return [
            feedback.metadata.roomId
                ? `Room ID: ${feedback.metadata.roomId}`
                : undefined,
            feedback.metadata.chat
                ? `Chat: ${feedback.metadata.chat}`
                : undefined,
            feedback.metadata.roomName
                ? `Room Name: ${feedback.metadata.roomName}`
                : undefined,
        ].filter((item): item is string => Boolean(item));
    }, [feedback]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!isClient) {
            return undefined;
        }

        if (isPending) {
            document.body.classList.add("is-generating-bundle");
        } else {
            document.body.classList.remove("is-generating-bundle");
        }

        return () => {
            document.body.classList.remove("is-generating-bundle");
        };
    }, [isClient, isPending]);

    useEffect(() => {
        if (retryAfterSeconds <= 0) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setRetryAfterSeconds((current) => {
                if (current <= 1) {
                    window.clearInterval(timerId);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => {
            window.clearInterval(timerId);
        };
    }, [retryAfterSeconds]);

    useEffect(() => {
        if (!isPending) {
            setActiveStepIndex(0);
            setGenerationSeconds(0);
            return undefined;
        }

        const stepIntervalId = window.setInterval(() => {
            setActiveStepIndex(
                (current) => (current + 1) % GENERATION_STEPS.length,
            );
        }, 1400);

        const secondsIntervalId = window.setInterval(() => {
            setGenerationSeconds((current) => current + 1);
        }, 1000);

        return () => {
            window.clearInterval(stepIntervalId);
            window.clearInterval(secondsIntervalId);
        };
    }, [isPending]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitDisabled) {
            return;
        }

        const validationResult = validateBundleFormInput(values);
        if (
            Object.keys(validationResult.errors).length > 0 ||
            !validationResult.payload
        ) {
            setErrors(validationResult.errors);
            setFeedback({
                type: "error",
                message: "Please correct the highlighted fields and try again.",
            });
            return;
        }

        setErrors({});
        setFeedback(null);
        setIsPending(true);

        try {
            const result = await createBundle(validationResult.payload);

            if (result.ok) {
                downloadBlob(result.blob, result.filename);
                setFeedback({
                    type: "success",
                    message:
                        "Bundle created successfully. Your download should start automatically.",
                    metadata: result.metadata,
                });
                setRetryAfterSeconds(0);
                return;
            }

            if (
                result.status === 429 &&
                typeof result.retryAfterSeconds === "number"
            ) {
                setRetryAfterSeconds(result.retryAfterSeconds);
            }

            setFeedback({
                type: "error",
                message:
                    result.status === 429 && result.retryAfterSeconds
                        ? `${result.message} Retry available in ${result.retryAfterSeconds}s.`
                        : result.message,
            });
        } catch {
            setFeedback({
                type: "error",
                message:
                    "Unable to reach the EncryptRoom API. Please try again.",
            });
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <form className="bundle-form" onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                    <label htmlFor="chatName">Chat name</label>
                    <input
                        id="chatName"
                        name="chatName"
                        type="text"
                        autoComplete="off"
                        value={values.chatName}
                        maxLength={CHAT_NAME_MAX_LENGTH}
                        aria-invalid={Boolean(errors.chatName)}
                        aria-describedby={
                            errors.chatName ? "chatName-error" : undefined
                        }
                        onChange={(event) => {
                            setValues((current) => ({
                                ...current,
                                chatName: event.target.value,
                            }));
                        }}
                    />
                    <p className="helper-text">
                        Required. Max {CHAT_NAME_MAX_LENGTH} characters.
                    </p>
                    {errors.chatName ? (
                        <p id="chatName-error" className="field-error">
                            {errors.chatName}
                        </p>
                    ) : null}
                </div>

                <div className="form-row">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrap">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            value={values.password}
                            maxLength={PASSWORD_MAX_LENGTH}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={
                                errors.password ? "password-error" : undefined
                            }
                            onChange={(event) => {
                                setValues((current) => ({
                                    ...current,
                                    password: event.target.value,
                                }));
                            }}
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword((current) => !current)
                            }
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <p className="helper-text">
                        Required. Max {PASSWORD_MAX_LENGTH} characters.
                    </p>
                    {errors.password ? (
                        <p id="password-error" className="field-error">
                            {errors.password}
                        </p>
                    ) : null}
                </div>

                {retryAfterSeconds > 0 ? (
                    <p
                        className="status-message"
                        role="status"
                        aria-live="polite"
                    >
                        Rate-limited. You can submit again in {retryAfterSeconds}
                        s.
                    </p>
                ) : null}

                {feedback?.type === "success" ? (
                    <div
                        className="status-message"
                        role="status"
                        aria-live="polite"
                    >
                        <p>{feedback.message}</p>
                        {metadataItems.length > 0 ? (
                            <ul className="metadata-list">
                                {metadataItems.map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ) : null}

                {feedback?.type === "error" ? (
                    <p
                        className="error-message"
                        role="alert"
                        aria-live="assertive"
                    >
                        {feedback.message}
                    </p>
                ) : null}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitDisabled}
                    aria-disabled={isSubmitDisabled}
                >
                    {isPending ? "Creating bundle..." : "Create Chat Bundle"}
                </button>
            </form>

            {isClient && isPending
                ? createPortal(
                      <div
                          className="generation-overlay"
                          role="status"
                          aria-live="polite"
                          aria-label="Generating bundle. Please wait."
                      >
                          <div className="generation-panel">
                              <div
                                  className="generation-spinner"
                                  aria-hidden="true"
                              />
                              <h3>Please wait, generating your file</h3>
                              <p>
                                  This can take a few minutes depending on build
                                  and packaging time.
                              </p>
                              <p className="generation-elapsed">
                                  Elapsed: {generationSeconds}s
                              </p>
                              <ul className="generation-steps">
                                  {GENERATION_STEPS.map((step, index) => (
                                      <li
                                          key={step}
                                          className={
                                              index === activeStepIndex
                                                  ? "active"
                                                  : "inactive"
                                          }
                                      >
                                          <span aria-hidden="true">
                                              {index === activeStepIndex
                                                  ? "●"
                                                  : "○"}
                                          </span>{" "}
                                          {step}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      </div>,
                      document.body,
                  )
                : null}
        </>
    );
}
