import Link from "next/link";

export default function HowItHelpsPage() {
    return (
        <main className="about-shell">
            <section className="about-card" aria-labelledby="helps-title">
                <p className="eyebrow">EncryptRoom</p>
                <h1 id="helps-title">How It Helps People</h1>
                <p className="about-intro">
                    EncryptRoom is built for groups that need private,
                    low-friction, live communication without account systems
                    or central message history.
                </p>

                <h2>Why teams choose this model</h2>
                <ul className="about-list">
                    <li>
                        Fast onboarding: share one client binary per operating
                        system and join the same room.
                    </li>
                    <li>
                        No account/signup flow: no email verification or
                        password reset burden.
                    </li>
                    <li>
                        Live-only communication: good for short coordination
                        windows and active sessions.
                    </li>
                    <li>
                        Privacy-oriented transport: clients encrypt content
                        before relay forwarding.
                    </li>
                </ul>

                <h2>Best fit use cases</h2>
                <ul className="about-list">
                    <li>Private friend and community rooms.</li>
                    <li>Temporary coordination during events or response work.</li>
                    <li>
                        Groups that prefer terminal tools over heavy platform
                        chat applications.
                    </li>
                    <li>
                        Teams that want hosted relay convenience while keeping
                        message contents client-encrypted.
                    </li>
                </ul>

                <h2>User experience</h2>
                <ol className="about-steps">
                    <li>Create and download a room bundle.</li>
                    <li>Share the right binary with trusted participants.</li>
                    <li>
                        Each user opens the terminal client and enters display
                        name and room password.
                    </li>
                    <li>
                        Everyone present in the room can communicate live right
                        away.
                    </li>
                </ol>

                <h2>Important expectations</h2>
                <ul className="about-list">
                    <li>
                        If a participant is offline, they miss messages by
                        design.
                    </li>
                    <li>
                        Network metadata (timing/volume) is still observable at
                        the transport layer.
                    </li>
                    <li>
                        Endpoint compromise (malware/keyloggers) is outside the
                        protection scope of relay hardening.
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

                <p className="about-actions">
                    <Link href="/">Back to bundle creator</Link>
                </p>
            </section>
        </main>
    );
}
