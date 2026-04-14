import background from "../../assets/video/background.webm";

export default function HeroBanner() {
  return (
    <div className="relative min-h-[90vh] w-full overflow-hidden flex flex-col">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source src={background} type="video/webm" />
      </video>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 to-black/30 pointer-events-none"></div>

      <div className="relative z-20 flex-1 flex flex-col px-6 sm:px-10">
        <div className="mt-32 mb-10 flex-1 border border-white/10 rounded-sm flex items-center px-6 md:px-20 lg:px-32">
          <div className="max-w-4xl text-left py-12">
            <h1 className="mb-6 text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-tight">
              Sécurisez vos fichiers <br className="hidden sm:block" />
              <span className="text-blue-700 italic"> avec Lockr</span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-gray-300 max-w-lg leading-relaxed">
              Gérez, stockez et accédez à vos données personnelles en toute sécurité. 
              Une interface intuitive conçue pour votre vie numérique.
            </p>
            
            <button className="bg-blue-700 text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg active:scale-95">
              Essayer Lockr
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}