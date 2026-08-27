export function Footer() {
  return (
    <footer className="bg-black px-3 sm:px-4 md:px-6 pb-6">
      <div className="bg-[#101010] rounded-2xl md:rounded-[2rem] px-6 sm:px-8 md:px-10 py-8 md:py-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[#E1E0CC] font-medium tracking-tight text-lg">
              Spotify README Card <span className="font-serif italic font-normal text-primary/60">live</span>
            </p>
            <p className="text-gray-500 text-xs mt-1.5 max-w-md leading-relaxed">
              Animated now playing SVG cards for your GitHub profile. Edge rendered, zero deps, MIT licensed.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="https://github.com/GautamVhavle/spotify-readme-card"
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest uppercase bg-primary text-black px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://live-spotify-readme-card.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest uppercase bg-white/5 text-primary/70 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors"
            >
              Live demo
            </a>
            <a
              href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FGautamVhavle%2Fspotify-readme-card"
              target="_blank"
              rel="noreferrer"
              className="text-xs tracking-widest uppercase bg-white/5 text-primary/70 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 hover:text-primary transition-colors"
            >
              Deploy
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} Spotify README Card · MIT License</p>
          <p className="flex items-center gap-1.5">
            Built with <span className="text-red-500">❤️</span> by{" "}
            <a
              href="https://gautamvhavle.xyz/"
              target="_blank"
              rel="noreferrer"
              className="text-primary/80 hover:text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-colors"
            >
              Gautam Vhavle
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
