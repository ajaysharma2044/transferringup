import { useEffect, useRef } from 'react';
import { CheckCircle, Calendar } from 'lucide-react';

const ConsultationSuccess = () => {
  const calendarButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadGoogleCalendar = () => {
      if (calendarButtonRef.current && (window as any).calendar) {
        (window as any).calendar.schedulingButton.load({
          url: 'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0cpylZVrz6YD0oo5XyDMtZbTF1LZukFGzHeB9k9W6N44fm0FSg3gRJeYizZhkWfWQTcurGDYOB?gv=true',
          color: '#039BE5',
          label: 'Schedule Your Consultation',
          target: calendarButtonRef.current,
        });
      }
    };

    const link = document.createElement('link');
    link.href = 'https://calendar.google.com/calendar/scheduling-button-script.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://calendar.google.com/calendar/scheduling-button-script.js';
    script.async = true;
    script.onload = () => {
      loadGoogleCalendar();
    };
    document.head.appendChild(script);

    return () => {
      if (link.parentNode) link.parentNode.removeChild(link);
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <section className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-green-50 via-blue-50 to-slate-50 flex items-center justify-center">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h1>

            <p className="text-lg text-gray-700 mb-2">
              Thank you for your payment. You're one step away from your consultation.
            </p>

            <p className="text-base text-gray-600">
              Now, please select a time that works best for your 1-hour strategy session with Ajay.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Schedule Your Consultation</h2>
            </div>

            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <div ref={calendarButtonRef} className="w-full flex justify-center"></div>

              <p className="text-sm text-gray-600 text-center mt-6 max-w-md">
                Select your preferred date and time. You'll receive a confirmation email with the meeting details.
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What to Prepare:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Your current essays (if available)</li>
              <li>• List of extracurricular activities</li>
              <li>• Current transcript/GPA</li>
              <li>• Target schools you're considering</li>
              <li>• Any specific questions or concerns</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSuccess;
