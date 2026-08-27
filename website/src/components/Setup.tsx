import { Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { DEPLOY_URL, REPO_URL } from "../lib/site";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, leave the code visible to select manually */
    }
  };
  return (
    <div className="relative group bg-black rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] tracking-widest uppercase text-gray-500 font-mono">{lang}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${lang} snippet`}
          className="inline-flex items-center gap-1.5 text-[11px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-full px-3 py-1 transition-colors"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap break-all">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function Setup() {
  return (
    <section id="setup" className="bg-black px-3 sm:px-4 md:px-6 py-20 md:py-28">
      <div className="bg-ink-800 border border-white/[0.06] rounded-[1.5rem] md:rounded-shell px-6 sm:px-8 md:px-10 lg:px-12 py-12 md:py-16 max-w-shell mx-auto">
        <div className="max-w-3xl mx-auto mb-12 md:mb-16">
          <p className="eyebrow">Setup</p>
          <h2 className="mt-5 text-3xl sm:text-4xl md:text-5xl font-medium text-cream tracking-tight leading-[1.08]">
            Five minutes. <span className="font-serif italic font-normal">Zero cost.</span>
          </h2>
          <p className="text-gray-400 text-sm mt-5 leading-relaxed">
            You need a Spotify account, a Vercel account, and Node.js 20+.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Step 1 */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                1
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-medium">Create a Spotify app</h3>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                  Open the{" "}
                  <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    Spotify Developer Dashboard <ExternalLink className="w-3 h-3" />
                  </a>{" "}
                  → <strong className="text-gray-300">Create app</strong>. Add this exact redirect URI:
                </p>
                <div className="mt-4">
                  <CodeBlock code="http://127.0.0.1:5175/callback" lang="text" />
                  <p className="text-[11px] text-gray-500 mt-2">Spotify rejects <code className="bg-white/5 px-1 py-0.5 rounded">localhost</code>, it has to be the loopback IP. Tick <strong className="text-gray-300">Web API</strong>, save, then copy Client ID & Secret from Settings.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                2
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-medium">Get the code</h3>
                <div className="mt-4">
                  <CodeBlock
                    code={`git clone ${REPO_URL}.git
cd spotify-readme-card
npm install
cp .env.example .env`}
                  />
                  <p className="text-gray-400 text-sm mt-3">Put the two values from step 1 into <code className="bg-white/5 px-1.5 py-0.5 rounded text-primary/80">.env</code>:</p>
                  <div className="mt-3">
                    <CodeBlock
                      code={`SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REFRESH_TOKEN=`}
                      lang="ini"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                3
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-medium">Generate a refresh token</h3>
                <div className="mt-4">
                  <CodeBlock code="npm run authorize" />
                  <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                    The script prints an authorization URL. Open it, approve, and your refresh token is written back into <code className="bg-white/5 px-1.5 py-0.5 rounded">.env</code> automatically. Check locally:
                  </p>
                  <div className="mt-3">
                    <CodeBlock code={`npm i -g vercel   # if you don't have it\nnpm run dev       # http://localhost:3000`} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                4
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-medium">Deploy</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={DEPLOY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-black rounded-full px-5 py-2.5 text-sm font-medium hover:bg-white transition-colors"
                  >
                    Deploy with Vercel
                  </a>
                  <span className="text-gray-500 text-xs self-center">or via dashboard or CLI, see README</span>
                </div>
                <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                  Add three env vars: <code className="bg-white/5 px-1 py-0.5 rounded">SPOTIFY_CLIENT_ID</code>,{" "}
                  <code className="bg-white/5 px-1 py-0.5 rounded">SPOTIFY_CLIENT_SECRET</code>,{" "}
                  <code className="bg-white/5 px-1 py-0.5 rounded">SPOTIFY_REFRESH_TOKEN</code>. Every push to <code className="bg-white/5 px-1 py-0.5 rounded">main</code> redeploys.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-black rounded-2xl p-6 sm:p-8 border border-white/[0.06]">
            <div className="flex items-start gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center text-sm font-bold">
                5
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-cream font-medium">Put it in your README</h3>
                <div className="mt-4">
                  <CodeBlock code={`<img src="https://YOUR-APP.vercel.app/" alt="What I'm listening to" width="420" />`} lang="md" />
                  <p className="text-gray-400 text-sm mt-3">Make it clickable:</p>
                  <div className="mt-3">
                    <CodeBlock code={`[![Spotify](https://YOUR-APP.vercel.app/)](https://open.spotify.com/user/YOUR_USER_ID)`} lang="md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API reference */}
        <div className="max-w-3xl mx-auto mt-16 md:mt-20">
          <h3 className="text-cream font-medium text-lg mb-4">API reference</h3>
          <div className="bg-black rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-4 py-3 font-medium text-primary/70 tracking-widest uppercase text-[10px]">Method</th>
                    <th className="px-4 py-3 font-medium text-primary/70 tracking-widest uppercase text-[10px]">Path</th>
                    <th className="px-4 py-3 font-medium text-primary/70 tracking-widest uppercase text-[10px]">Response</th>
                    <th className="px-4 py-3 font-medium text-primary/70 tracking-widest uppercase text-[10px]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">GET</td>
                    <td className="px-4 py-3 font-mono text-cream">/</td>
                    <td className="px-4 py-3 font-mono text-gray-400">image/svg+xml</td>
                    <td className="px-4 py-3 text-gray-400">Detailed 420×142</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">GET</td>
                    <td className="px-4 py-3 font-mono text-cream">/small</td>
                    <td className="px-4 py-3 font-mono text-gray-400">image/svg+xml</td>
                    <td className="px-4 py-3 text-gray-400">Compact 340×76</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">GET</td>
                    <td className="px-4 py-3 font-mono text-cream">/portrait</td>
                    <td className="px-4 py-3 font-mono text-gray-400">image/svg+xml</td>
                    <td className="px-4 py-3 text-gray-400">Portrait 300×420</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-primary">GET</td>
                    <td className="px-4 py-3 font-mono text-cream">/json</td>
                    <td className="px-4 py-3 font-mono text-gray-400">application/json</td>
                    <td className="px-4 py-3 text-gray-400">Raw track data</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-black rounded-2xl border border-white/[0.06] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
              <p className="text-[10px] tracking-widest uppercase text-primary/60">Query parameters</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="px-3 py-2 font-medium text-gray-400">Param</th>
                    <th className="px-3 py-2 font-medium text-gray-400">Values</th>
                    <th className="px-3 py-2 font-medium text-gray-400">Default</th>
                    <th className="px-3 py-2 font-medium text-gray-400">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-[11px]">
                  {[
                    ["theme", "dark / light / spotify …", "dark", "Colour preset"],
                    ["mode", "dark / light", "dark", "Glass shell on /portrait"],
                    ["width", "320–760", "420/340/300", "Card width"],
                    ["radius", "0–40", "16/14/22", "Corner radius"],
                    ["bars", "true/false", "true", "Equalizer"],
                    ["blur", "true/false", "true", "Album backdrop"],
                    ["glass", "true/false", "true", "Frosted glass"],
                    ["tint", "0–100", "55", "Album colour bleed"],
                    ["show_border", "true/false", "true", "Outer border"],
                    ["bg/surface/text/sub/accent/border", "hex", "theme", "Custom colours"],
                  ].map(([a, b, c, d]) => (
                    <tr key={a}>
                      <td className="px-3 py-2 text-primary whitespace-nowrap">{a}</td>
                      <td className="px-3 py-2 text-gray-400">{b}</td>
                      <td className="px-3 py-2 text-gray-500">{c}</td>
                      <td className="px-3 py-2 text-gray-400">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
