import { expect, test } from "bun:test";
import { renderedMetadata } from "./render";

// Uses the installed sandbox browser; no real network or external data.
test.skipIf(!process.env.CHROMIUM_PATH || process.getuid?.() === 0)("renders SPA metadata while blocking private-network subrequests", async () => {
  const urls: string[] = [];
  const transport = async (url: string) => {
    urls.push(url);
    const html = `<html><head><title>Initial</title></head><body><script>
      const meta=document.createElement('meta');meta.setAttribute('property','og:image');meta.content='https://example.com/cover.webp';document.head.append(meta);
      document.title='Rendered SPA';fetch('https://127.0.0.1/private').catch(()=>{});
      fetch('https://localhost/private').catch(()=>{});
    </script></body></html>`;
    return { bytes: Buffer.from(html), type: "text/html", url };
  };
  const metadata = await renderedMetadata("https://example.com/story", transport);
  expect(metadata).toContain("Rendered SPA"); expect(metadata).toContain("og:image");
  expect(urls).toEqual(["https://example.com/story"]);
}, 20000);