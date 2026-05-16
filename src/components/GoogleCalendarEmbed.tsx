import { Calendar, CheckCircle, ExternalLink, AlertCircle, Video, Users } from 'lucide-react';

const GoogleCalendarEmbed = () => {
  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Schedule Your Free Consultation
          </h3>
        </div>
        <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
          Book directly with our Google Calendar. Select your preferred date and time below.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-green-700 bg-green-50 rounded-lg p-2 sm:p-3">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Instant Confirmation</span>
          </div>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-green-700 bg-green-50 rounded-lg p-2 sm:p-3">
            <Video className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Auto Google Meet</span>
          </div>
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-green-700 bg-green-50 rounded-lg p-2 sm:p-3">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">Calendar Reminders</span>
          </div>
        </div>
      </div>

      {/* Google Calendar Embed */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100 relative">
        <iframe 
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1uvKJKLHGq81i7I3vTjt-qgYKzA-WCJ2GxsB-oYahneqIZcj_XmoTNfp2hCVn17CQ8WuAooAw6?gv=true" 
          width="100%" 
          height="600" 
          frameBorder="0"
          title="Schedule Consultation"
          className="w-full min-h-[400px] sm:min-h-[600px]"
          loading="lazy"
          allow="camera; microphone; geolocation"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation allow-popups-to-escape-sandbox"
          onLoad={() => {
            console.log('Google Calendar loaded successfully');
          }}
          onError={(e) => {
            console.error('Calendar iframe failed to load:', e);
            const iframe = e.currentTarget as HTMLIFrameElement;
            iframe.style.display = 'none';
            const errorDiv = iframe.parentElement?.querySelector('.calendar-error') as HTMLElement;
            if (errorDiv) errorDiv.style.display = 'block';
          }}
        />
        
        {/* Fallback error message */}
        <div className="calendar-error hidden p-6 sm:p-8 text-center">
          <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-600 mx-auto mb-3 sm:mb-4" />
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Calendar Not Loading?</h4>
          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
            The calendar might be blocked by your browser or network settings.
          </p>
          <div className="space-y-2 sm:space-y-3">
            <a 
              href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1uvKJKLHGq81i7I3vTjt-qgYKzA-WCJ2GxsB-oYahneqIZcj_XmoTNfp2hCVn17CQ8WuAooAw6?gv=true"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base"
            >
              <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Open Calendar in New Tab</span>
            </a>
            <p className="text-xs sm:text-sm text-gray-500">
              Or contact us directly using the information below
            </p>
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500">
          Calendar loading... If it doesn't appear, try refreshing the page or opening in a new tab.
        </p>
      </div>

      {/* What to Expect */}
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center text-sm sm:text-base">
          <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          What to Expect:
        </h4>
        <ul className="space-y-1 text-blue-800 text-xs sm:text-sm">
          <li>• 60-minute consultation call</li>
          <li>• Complete academic assessment and GPA analysis</li>
          <li>• Personalized transfer strategy overview</li>
          <li>• Target school recommendations</li>
          <li>• Timeline and action plan</li>
          <li>• Q&A session with our founders</li>
        </ul>
      </div>

      {/* Backup Contact Information */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Direct Contact</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-red-600 flex-shrink-0">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Ajay Sharma</p>
              <a 
                href="mailto:as4489@cornell.edu?subject=Transfer%20Consultation%20Request&body=Hi%20Ajay,%0A%0AI'd%20like%20to%20schedule%20a%20free%20transfer%20consultation.%20Here%20are%20my%20details:%0A%0AName:%20%0AEmail:%20%0APhone:%20%0ACurrent%20GPA:%20%0ATarget%20Schools:%20%0A%0APlease%20let%20me%20know%20your%20available%20times.%0A%0AThanks!"
                className="text-gray-600 hover:text-red-600 transition-colors break-all"
              >
                as4489@cornell.edu
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-red-600 flex-shrink-0">
              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Bryan Liu</p>
              <a 
                href="mailto:bryankliu@gmail.com?subject=Transfer%20Consultation%20Request&body=Hi%20Bryan,%0A%0AI'd%20like%20to%20schedule%20a%20free%20transfer%20consultation.%20Here%20are%20my%20details:%0A%0AName:%20%0AEmail:%20%0APhone:%20%0ACurrent%20GPA:%20%0ATarget%20Schools:%20%0A%0APlease%20let%20me%20know%20your%20available%20times.%0A%0AThanks!"
                className="text-gray-600 hover:text-red-600 transition-colors break-all"
              >
                bryankliu@gmail.com
              </a>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-2 sm:mt-3">
          If you can't find a suitable time slot, email us directly and we'll work something out.
        </p>
      </div>
    </div>
  );
};

export default GoogleCalendarEmbed;