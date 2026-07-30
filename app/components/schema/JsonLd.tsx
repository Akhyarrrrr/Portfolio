export default function JsonLd({
  id,
  data,
}: {
  id: string;
  data: Record<string, unknown>;
}) {
  // Plain server-rendered <script>, not next/script — structured data must
  // be present in the initial HTML for crawlers, not injected after
  // hydration via strategy="afterInteractive". `id` is required per usage
  // (not hardcoded) because pages that render multiple JsonLd instances
  // (e.g. project pages: Person + SoftwareApplication) previously all
  // shared id="json-ld" — Next dedupes <Script> by id, so only one of the
  // two schemas ever actually reached the page.
  return (
    <script
      id={id}
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD requires raw script content
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
