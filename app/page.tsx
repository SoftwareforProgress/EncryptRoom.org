"use client";

import { BundleForm } from "@/components/BundleForm";
import Header from "@/components/Header";

export default function Home() {
    return (
        <>
            <Header />

            <main className="page-shell">
                <section
                    className="landing-grid"
                    aria-labelledby="bundle-title"
                >
                    <div className="landing-copy">
                        <p className="eyebrow">EncryptRoom</p>
                        <h1 id="bundle-title">
                            Download your client bundle and join private live
                            terminal chat
                        </h1>
                        <p className="intro">
                            This experience is for joining chat rooms on the
                            managed EncryptRoom service. Clients encrypt on the
                            user side, while the relay forwards ciphertext for
                            live room communication.
                        </p>

                        <div className="info-grid" id="how-it-helps">
                            <article className="info-card">
                                <h2>Managed relay, private chat</h2>
                                <p>
                                    You connect through our hosted relay for
                                    room coordination. Messages and display
                                    payloads are encrypted client-side before
                                    relay forwarding.
                                </p>
                            </article>

                            <article className="info-card">
                                <h2>Presence-based by design</h2>
                                <p>
                                    EncryptRoom is a live room model, not a
                                    mailbox. Connected participants see live
                                    chat. Offline participants miss messages.
                                </p>
                            </article>

                            <article className="info-card">
                                <h2>What you download</h2>
                                <p>
                                    You receive platform-specific terminal
                                    clients in one bundle so your group can run
                                    the right binary and join the same room.
                                </p>
                            </article>

                            <article className="info-card">
                                <h2>Security boundaries</h2>
                                <p>
                                    Encryption protects message content in
                                    transit. It does not remove network metadata
                                    exposure or endpoint compromise risk.
                                </p>
                            </article>
                        </div>

                        <p className="foundation-credit" id="foundation-credit">
                            Made by{" "}
                            <a
                                href="https://softwareforprogress.org"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <strong>Software for Progress Foundation</strong>
                            </a>
                            .
                        </p>
                    </div>

                    <aside
                        className="bundle-card"
                        id="create-bundle"
                        aria-label="Create chat bundle form"
                    >
                        <h2>Create Chat Bundle</h2>
                        <p className="card-intro">
                            Create a room bundle for Windows, macOS, and Linux
                            clients. Share the correct client app with trusted
                            participants to start chatting live.
                        </p>
                        <BundleForm />
                    </aside>
                </section>
            </main>
        </>
    );
}
