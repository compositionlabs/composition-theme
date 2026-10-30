import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SUPPORT_EMAIL = "chinmay@complabs.co";
const LAST_UPDATED = "October 30, 2026";

export const metadata: Metadata = {
  title: "Jacobian Recorder — Privacy Policy",
  description:
    "How the Jacobian Recorder browser extension collects, uses and stores data.",
  alternates: { canonical: "/recorder/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-base font-medium text-foreground mb-3">{title}</h2>
      <div className="space-y-3 text-muted-foreground">{children}</div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 space-y-2">{children}</ul>;
}

export default function RecorderPrivacy() {
  return (
    <div className="h-full overflow-y-auto font-mono text-sm leading-7 text-foreground">
      <Navbar />
      <main className="w-full max-w-3xl mx-auto px-4 pb-16">
        <h1 className="text-2xl font-medium text-foreground">
          Jacobian Recorder Privacy Policy
        </h1>
        <p className="mt-2 text-muted-foreground">Last updated {LAST_UPDATED}</p>

        <p className="mt-6 text-muted-foreground">
          This policy explains what the Jacobian Recorder browser extension
          (&ldquo;the extension&rdquo;) collects, where that data goes, and who
          can see it. The extension is made by Complabs Inc. (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) for organisations that use Jacobian. Employees use
          it to record their screen while they do their everyday work, so their
          organisation can document and analyse those workflows.
        </p>

        <Section title="When it records">
          <p>
            The extension records only after you press Record in the extension
            and choose what to share in your browser&rsquo;s own screen-sharing
            prompt. Recording stops when you press Stop or use the
            browser&rsquo;s &ldquo;Stop sharing&rdquo; bar. A red indicator is
            shown on the extension&rsquo;s toolbar icon while recording. There
            is no background or automatic recording.
          </p>
        </Section>

        <Section title="What is collected">
          <List>
            <li>
              <strong className="text-foreground">Screen recording.</strong> A
              video of whatever you choose to share, typically your entire
              screen. This includes anything visible on it during the
              recording: applications, web pages, documents, emails and chats,
              and the mouse pointer and its movement.
            </li>
            <li>
              <strong className="text-foreground">Audio.</strong> Your
              microphone (narration) and, if you choose to share it, your
              computer&rsquo;s sound.
            </li>
            <li>
              <strong className="text-foreground">Recording details.</strong>{" "}
              The name and optional description you give a recording, the time
              it was recorded and saved, and the Jacobian account and
              organisation it belongs to.
            </li>
            <li>
              <strong className="text-foreground">Sign-in details.</strong>{" "}
              Your email address and your organisation&rsquo;s Jacobian
              address, entered on the sign-in form and remembered by the
              extension.
            </li>
            <li>
              <strong className="text-foreground">Sign-in session.</strong> A
              Jacobian sign-in session, stored by the extension so you stay
              signed in. You sign in on your organisation&rsquo;s Jacobian
              website; the extension never sees or stores your password.
              Sessions expire after at most 7 days.
            </li>
          </List>
          <p>
            The extension does not collect keystrokes or clicks as separate
            data, browsing history, or location. Recordings capture only what
            is visible or audible while a recording is in progress.
          </p>
        </Section>

        <Section title="Where your data goes">
          <p>
            Recordings are uploaded directly to your organisation&rsquo;s own
            Jacobian deployment, where they are stored on cloud infrastructure
            in the region chosen for that deployment. Uploads are encrypted in
            transit (HTTPS).
          </p>
          <p>
            While you record, pieces of the recording may be held temporarily
            on your own computer (in browser storage) until they are uploaded.
            They are deleted from your computer once the upload is confirmed.
            If an upload cannot complete, the footage stays on your computer
            and you can retry or discard it from the extension.
          </p>
        </Section>

        <Section title="Who can see it">
          <p>
            Your recordings can be accessed by your organisation and by
            authorised Jacobian staff, for providing the service. Your
            organisation, as our customer, controls its data.
          </p>
          <p>
            We do not sell your data. We do not share it with third parties
            other than the infrastructure providers that host the service
            (cloud storage and hosting). We do not use it for advertising, to
            determine creditworthiness, or for any purpose unrelated to the
            recorder.
          </p>
        </Section>

        <Section title="Retention and deletion">
          <p>
            Recordings are kept in your organisation&rsquo;s Jacobian account
            for as long as your organisation keeps them. Your organisation can
            request deletion by contacting us at the address below.
          </p>
          <p>
            Pieces of a recording stored on your computer are deleted after
            they are uploaded, or when you discard them. Uninstalling the
            extension removes its locally stored data.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about this policy or requests about your data can be sent
            to{" "}
            <a className="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
