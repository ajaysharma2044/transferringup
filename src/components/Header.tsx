import { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  });
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleMobileNavClick = (sectionId: string) => {
    setIsDropdownOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header className="bg-[#0F1C2E] shadow-lg z-50 border-b border-navy-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-5">
          <a href="#home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-300">
            <img src="/tupng.png" alt="Transferring Up" className="h-12 w-12 md:h-14 md:w-14 object-contain scale-150" />
            <span className="text-lg md:text-2xl font-bold tracking-tight font-display"><span className="text-[#F5EDD9]">Transferring</span> <span className="text-[#8B1A1A]">Up</span></span>
          </a>

          <div className="lg:hidden relative">
            <div className="flex items-center space-x-2">
              <a
                href="tel:+19802489218"
                className="flex items-center space-x-1 text-cream-400 hover:text-[#F5EDD9] transition-colors duration-300 text-xs font-medium px-2 py-1 rounded-lg hover:bg-navy-800 tracking-wide"
              >
                <Phone className="h-3 w-3" />
                <span className="hidden sm:inline">Call</span>
              </a>
              <button
                onClick={toggleDropdown}
               className="flex items-center space-x-1 text-cream-400 hover:text-crimson-300 transition-colors duration-300 px-3 py-2 rounded-lg hover:bg-navy-800 text-xs font-medium tracking-wide"
                aria-label="Navigation menu"
              >
               <span>More Info</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-navy-800 rounded-lg shadow-xl border border-navy-700 py-2 z-50">
                <button
                  onClick={() => handleMobileNavClick('services')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Services
                </button>
                <button
                  onClick={() => handleMobileNavClick('about')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Why Us
                </button>
                <button
                  onClick={() => handleMobileNavClick('team')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Team
                </button>
                <button
                  onClick={() => handleMobileNavClick('contact')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Contact
                </button>
                <button
                  onClick={() => handleMobileNavClick('success')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Success Stories
                </button>
                <button
                  onClick={() => handleMobileNavClick('schools')}
                  className="block w-full text-left px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Schools
                </button>
                <a
                  href="/reviews"
                  className="block px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Reviews
                </a>
                <a
                  href="/blog"
                  className="block px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Resources
                </a>
                <a
                  href="/portal"
                  className="block px-4 py-2 text-cream-400 hover:text-crimson-300 hover:bg-navy-700 transition-colors duration-200 text-sm tracking-wide"
                >
                  Client Portal
                </a>
                <div className="border-t border-navy-700 my-2"></div>
                <button
                  onClick={() => handleMobileNavClick('contact')}
                  className="block w-full text-left px-4 py-2 text-crimson-300 hover:text-crimson-200 hover:bg-navy-700 transition-colors duration-200 text-sm font-semibold tracking-wide"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a href="#services" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Why Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#team" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Team
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#success" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Success
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#schools" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Schools
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/reviews" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/blog" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="/portal" className="text-cream-400 hover:text-crimson-300 transition-colors duration-300 text-sm xl:text-base font-medium relative group cursor-pointer tracking-[0.08em]">
              Portal
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crimson-500 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <a
              href="tel:+19802489218"
              className="flex items-center space-x-1 text-cream-400 hover:text-[#F5EDD9] transition-colors duration-300 text-xs xl:text-sm font-medium px-2 py-1 rounded-lg hover:bg-navy-800 whitespace-nowrap tracking-wide"
            >
              <Phone className="h-3 w-3 xl:h-4 xl:w-4" />
              <span>(980) 248-9218</span>
            </a>
          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;
