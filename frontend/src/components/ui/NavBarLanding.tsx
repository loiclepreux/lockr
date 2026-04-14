import { useState, useEffect } from "react";
import Logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function NavBarLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
  className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    isScrolled 
      ? "bg-black/80 backdrop-blur-md py-4 shadow-xl" 
      : "bg-transparent py-6"
  }`}
>
  <div className="w-full px-6 md:px-10 flex items-center justify-between">
    
    <div className="flex items-center gap-3">
        <img src={Logo} alt="" width={40}/>
        <span className="text-2xl font-bold text-white tracking-tighter">
            Lockr
        </span>
    </div>

    <div className="flex items-center">
      <button className="border border-white/30 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all backdrop-blur-sm">
            <Link to="/signin" className="link link-hover text-sm">Se Connecter</Link>
      </button>
    </div>

  </div>
</nav>
  );
}