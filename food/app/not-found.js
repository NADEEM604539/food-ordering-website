
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#1e1e2f] to-[#0f0c29] text-white px-4 relative overflow-hidden">

      {/* Glowing Rings Background */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[120px] top-[-100px] left-[-150px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] bottom-[-120px] right-[-100px] animate-pulse"></div>

      {/* 404 Code */}
      <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 drop-shadow-[0_0_20px_rgba(255,80,80,0.8)]">
        404
      </h1>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-semibold mt-4 mb-2 text-center">
        This Page is Lost in Space 🚀
      </h2>

      {/* Subtext */}
      <p className="text-gray-300 text-center max-w-xl text-lg mb-6">
        Sorry, the page you’re looking for doesn’t exist, got moved, or maybe it’s on vacation. 
        Let’s help you find your way back.
      </p>

      {/* Home Button */}

      {/* Animated Orb/Spinner */}
      <div className="mt-16 w-28 h-28">
        <svg
          className="w-full h-full animate-spin-slow"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeDasharray="75"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="red" />
              <stop offset="50%" stopColor="orange" />
              <stop offset="100%" stopColor="yellow" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
