import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="about-shell">
            <section className="about-card" aria-labelledby="about-title">
                <p className="eyebrow">About EncryptRoom</p>
                <h1 id="about-title">What EncryptRoom Does</h1>
                <p className="about-intro">
                    EncryptRoom provides downloadable terminal clients for
                    private live chat rooms on the managed EncryptRoom relay. It
                    is intentionally a live-room system, not a persistent inbox
                    or message history platform.
                </p>

                <h2>Core Behavior</h2>
                <ul className="about-list">
                    <li>Clients encrypt message payloads before sending.</li>
                    <li>
                        Relay forwards ciphertext frames between room members.
                    </li>
                    <li>No chat history is stored for later retrieval.</li>
                    <li>
                        Clients connect to relay, not directly to each other.
                    </li>
                    <li>If you are offline, you miss messages by design.</li>
                </ul>

                <h2>What Users Receive</h2>
                <ul className="about-list">
                    <li>
                        A room bundle with platform-specific terminal clients
                        for Windows, macOS, and Linux.
                    </li>
                    <li>
                        Each client includes embedded room invite data so users
                        can join the intended room quickly.
                    </li>
                    <li>
                        Participants enter display name and room password in the
                        terminal client at startup.
                    </li>
                </ul>

                <h2>Room Creation to Live Chat</h2>
                <ol className="about-steps">
                    <li>Create a room bundle from the main page.</li>
                    <li>Share the correct client binary with trusted users.</li>
                    <li>
                        User opens client, enters display name and password.
                    </li>
                    <li>Client authenticates and joins the live room.</li>
                    <li>Participants exchange encrypted live messages.</li>
                </ol>

                <h2>Authentication and Encryption</h2>
                <ul className="about-list">
                    <li>
                        Room authentication uses challenge-response verification
                        derived from room secret material.
                    </li>
                    <li>
                        Room passwords are used client-side for invite unlocking
                        and are not sent as plaintext relay login secrets.
                    </li>
                    <li>
                        Message security uses X25519 + HKDF-SHA256 +
                        ChaCha20-Poly1305 with monotonic counters and replay
                        rejection.
                    </li>
                    <li>
                        Display names and message bodies are encrypted inside
                        payloads.
                    </li>
                </ul>

                <h2>Security Boundaries</h2>
                <ul className="about-list">
                    <li>
                        Protects message confidentiality and integrity from
                        relay visibility.
                    </li>
                    <li>
                        Does not hide network-level metadata like timing and
                        connection volume.
                    </li>
                    <li>
                        Does not protect compromised endpoints (malware,
                        keyloggers, memory theft).
                    </li>
                    <li>
                        Membership changes require new room/invite distribution
                        in the current design.
                    </li>
                </ul>

                <p className="foundation-credit">
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
                <p className="relay-link-note">
                    Want to review how the relay works?{" "}
                    <a
                        href="https://github.com/SoftwareforProgress/EncryptRoom"
                        target="_blank"
                        rel="noreferrer noopener"
                    >
                        View the EncryptRoom Open Source project on GitHub →
                    </a>
                </p>

                <p className="about-actions">
                    <Link href="/">Back to bundle creator</Link>
                </p>
            </section>
        </main>
    );
}
