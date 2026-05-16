import { useState, useEffect } from 'react';
import { X, Trophy } from 'lucide-react';

const RecentWinsPopup = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('recentWinsShown');
    if (hasSeenPopup) return;

    const timer = setTimeout(() => {
      setIsVisible(true);
      sessionStorage.setItem('recentWinsShown', 'true');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 popup-backdrop"
      onClick={() => setIsVisible(false)}
    >
      <div
        className="bg-cream-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative popup-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 z-10 bg-white/90 rounded-full p-1.5 shadow-lg hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-[#3D3D4E]" />
        </button>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1C1C1E]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Some of Our Recent Wins
            </h2>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="bg-[#1C1C1E] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-t-lg text-center tracking-wide">
                Rutgers &rarr; Northwestern
              </div>
              <div className="overflow-hidden rounded-b-lg border border-gray-200 border-t-0">
                <img
                  src="/IMG_5939.jpg"
                  alt="Northwestern University acceptance"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </div>

            <div className="relative group">
              <div className="bg-[#1C1C1E] text-white text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-t-lg text-center tracking-wide">
                3.0 HS GPA &rarr; UMich in 1 Year
              </div>
              <div className="overflow-hidden rounded-b-lg border border-gray-200 border-t-0">
                <img
                  src="/IMG_5938.jpg"
                  alt="University of Michigan acceptance"
                  className="w-full h-auto"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#3D3D4E]/70 mt-4">
            Real results from real TransferringUp clients
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentWinsPopup;
