import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-midnight-900 via-midnight-800 to-midnight-900 text-white py-10 sm:py-16 md:py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-crimson-500/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-navy-500/10 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center space-x-2 mb-6 md:mb-8 hover:opacity-80 transition-opacity duration-300 inline-flex">
              <img src="/tupng.png" alt="Transferring Up" className="h-14 w-14 md:h-16 md:w-16 object-contain scale-150" />
              <span className="text-2xl md:text-3xl font-bold tracking-tight font-display"><span className="text-[#F5EDD9]">Transferring</span> <span className="text-[#8B1A1A]">Up</span></span>
            </a>
            <p className="text-gray-400 mb-6 md:mb-8 max-w-lg text-lg md:text-xl leading-relaxed">
              Our founder got into Cornell with a 2.9 GPA — bottom of his class. We built a system out of that experience and now use it for every student we work with, regardless of where they're starting from.
            </p>
            <div className="flex items-center space-x-2 text-gray-400">
              <MapPin className="h-5 w-5 text-crimson-400" />
              <span className="text-base">Serving students nationwide</span>
            </div>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">Services</h3>
            <ul className="space-y-3 md:space-y-4 text-gray-400">
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Transfer Strategy</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>GPA Transformation</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Application Help</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Academic Planning</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">Company</h3>
            <ul className="space-y-3 md:space-y-4 text-gray-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>About</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Team</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Contact</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="#success" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Success Stories</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-white transition-colors duration-300 text-base md:text-lg flex items-center group cursor-pointer">
                  <span>Resources</span>
                  <ExternalLink className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700/50 mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 md:pt-12">
          <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center">
            <p className="text-gray-400 text-base md:text-lg">
              © 2025 Transferring Up. All rights reserved.
            </p>
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-8">
              <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:space-x-6 text-gray-400">
                <div className="flex items-center space-x-3 group">
                  <Mail className="h-5 w-5 flex-shrink-0 text-crimson-400 group-hover:text-crimson-300 transition-colors duration-300" />
                  <a href="mailto:as4489@cornell.edu" className="hover:text-white transition-colors duration-300 text-base">
                    Ajay: as4489@cornell.edu
                  </a>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Phone className="h-5 w-5 flex-shrink-0 text-crimson-400 group-hover:text-crimson-300 transition-colors duration-300" />
                  <a href="tel:+19802489218" className="hover:text-white transition-colors duration-300 text-base">
                    (980) 248-9218
                  </a>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Mail className="h-5 w-5 flex-shrink-0 text-crimson-400 group-hover:text-crimson-300 transition-colors duration-300" />
                  <a href="mailto:bryankliu@gmail.com" className="hover:text-white transition-colors duration-300 text-base">
                    Bryan: bryankliu@gmail.com
                  </a>
                </div>
                <div className="flex items-center space-x-3 group">
                  <Phone className="h-5 w-5 flex-shrink-0 text-crimson-400 group-hover:text-crimson-300 transition-colors duration-300" />
                  <a href="tel:+18572455772" className="hover:text-white transition-colors duration-300 text-base">
                    Bryan: (857) 245-5772
                  </a>
                </div>
              </div>
              <div className="flex space-x-6 md:space-x-8">
                <a href="#" className="text-gray-400 hover:text-white text-base transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white text-base transition-colors duration-300">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;