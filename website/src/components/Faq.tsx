import { FAQS, GUIDE_PATH } from "../lib/site";

export function Faq() {
  return (
    <section id="faq" className="bg-black px-3 py-16 sm:px-4 sm:py-20 md:px-6 md:py-28">
      <div className="mx-auto max-w-shell">
        <p className="eyebrow">FAQ</p>
        <h2 className="mt-6 max-w-3xl text-3xl font-medium leading-[1.08] tracking-tight text-cream sm:text-4xl md:text-5xl">
          Asked before the <span className="font-serif italic font-normal">paste.</span>
        </h2>

        <dl className="mt-10 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {FAQS.map((item) => (
            <div
              key={item.question}
              className="grid gap-3 py-6 md:grid-cols-[0.8fr_1.2fr] md:gap-10 md:py-8"
            >
              <dt className="text-base font-medium text-cream sm:text-lg">
                {item.question}
              </dt>
              <dd className="text-sm leading-relaxed text-gray-400 sm:text-base">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-8 text-sm text-gray-400">
          The five steps, with the redirect URI and the README snippet, are in the{" "}
          <a
            href={GUIDE_PATH}
            className="text-primary/80 underline decoration-primary/30 underline-offset-4 hover:text-primary hover:decoration-primary"
          >
            setup guide
          </a>
          .
        </p>
      </div>
    </section>
  );
}
