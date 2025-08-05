export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Heading with vibrant gradient text */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
          Unlock the Power of PDFs – One Toolkit, Every Solution
        </h1>

        {/* Description with light text */}
        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
          Your all-in-one, free toolkit for PDF editing, file conversion, and
          daily tools. Everything works instantly in your browser — no
          signup, no payment, no hassle.
        </p>

        {/* CTA Buttons with glowing effects */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-cyan-500/30">
            <span className="relative z-10">Start Processing PDFs</span>
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 animate-pulse"></span>
          </button>
          <button className="border border-gray-600 bg-gray-800/50 text-gray-200 px-6 py-3 rounded-lg font-medium hover:bg-gray-700/50 transition-all shadow-sm hover:shadow-purple-500/10">
            Learn More
          </button>
        </div>

        {/* Stats/Features with glowing cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg hover:shadow-cyan-500/10 transition-all hover:border-cyan-400/30">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300">100%</div>
            <div className="text-gray-400">Free Tools</div>
          </div>
          <div className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg hover:shadow-purple-500/10 transition-all hover:border-purple-400/30">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300">15+</div>
            <div className="text-gray-400">Mini Tools</div>
          </div>
          <div className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg hover:shadow-cyan-500/10 transition-all hover:border-cyan-400/30">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-cyan-300">No</div>
            <div className="text-gray-400">Watermarks</div>
          </div>
          <div className="p-4 bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700 shadow-lg hover:shadow-purple-500/10 transition-all hover:border-purple-400/30">
            <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300">Secure</div>
            <div className="text-gray-400">Processing</div>
          </div>
        </div>
      </div>
    </section>
  );
}