import { Calendar, ArrowRight, ArrowLeft, User, Mail, Phone, FileText, DollarSign, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MetaPixelEvents } from '../lib/metaPixel';
import { submitToHubSpot } from '../lib/hubspot';
import { submitFormWithNotification } from '../lib/formSubmission';

const ConsultationBooking = () => {
  const [step, setStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentSchool: '',
    collegeGPA: '',
    highSchoolGPA: '',
    targetSchools: '',
    testScore: '',
    financialAid: '',
    biggestChallenge: ''
  });

  useEffect(() => {
    if (showCalendar) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      MetaPixelEvents.ViewContent('Consultation Booking', 'Consultation');

      const handleCalendlyEvent = (e: MessageEvent) => {
        if (e.data.event && e.data.event.indexOf('calendly') === 0) {
          if (e.data.event === 'calendly.event_scheduled') {
            MetaPixelEvents.Schedule(0);
            MetaPixelEvents.BookConsultation();
          }
        }
      };

      window.addEventListener('message', handleCalendlyEvent);

      return () => {
        document.body.removeChild(script);
        window.removeEventListener('message', handleCalendlyEvent);
      };
    }
  }, [showCalendar]);

  const handleContinueToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(2);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToStep1 = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(1);
      setIsTransitioning(false);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      submitFormWithNotification({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        currentSchool: formData.currentSchool,
        collegeGPA: formData.collegeGPA,
        highSchoolGPA: formData.highSchoolGPA,
        targetSchools: formData.targetSchools,
        testScore: formData.testScore,
        financialAid: formData.financialAid,
        biggestChallenge: formData.biggestChallenge,
        message: formData.biggestChallenge,
        source: 'Consultation Booking Form',
      }).catch((err) => console.log('Form submission error:', err));

      submitToHubSpot({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        currentSchool: formData.currentSchool,
        currentGPA: formData.collegeGPA,
        targetSchools: formData.targetSchools,
        biggestChallenge: formData.biggestChallenge,
      }).catch((err) => console.log('HubSpot submission error:', err));

      MetaPixelEvents.Lead();

      setShowCalendar(true);
    } catch (error) {
      console.error('Error submitting consultation form:', error);
      setShowCalendar(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const step1Valid = formData.firstName && formData.email && formData.phone;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 gap-3">
      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
          step >= 1 ? 'bg-navy-500 text-white shadow-md shadow-navy-500/30' : 'bg-cream-200 text-[#8A8A9A]'
        }`}>
          {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
        </div>
        <span className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${
          step >= 1 ? 'text-navy-600' : 'text-[#8A8A9A]'
        }`}>Your Info</span>
      </div>

      <div className={`w-12 sm:w-20 h-0.5 rounded-full transition-all duration-500 ${
        step >= 2 ? 'bg-navy-500' : 'bg-cream-300'
      }`} />

      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
          step >= 2 ? 'bg-navy-500 text-white shadow-md shadow-navy-500/30' : 'bg-cream-200 text-[#8A8A9A]'
        }`}>
          {showCalendar ? <CheckCircle className="h-5 w-5" /> : '2'}
        </div>
        <span className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${
          step >= 2 ? 'text-navy-600' : 'text-[#8A8A9A]'
        }`}>Background</span>
      </div>

      <div className={`w-12 sm:w-20 h-0.5 rounded-full transition-all duration-500 ${
        showCalendar ? 'bg-navy-500' : 'bg-cream-300'
      }`} />

      <div className="flex items-center gap-2">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
          showCalendar ? 'bg-navy-500 text-white shadow-md shadow-navy-500/30' : 'bg-cream-200 text-[#8A8A9A]'
        }`}>
          3
        </div>
        <span className={`text-sm font-medium hidden sm:inline transition-colors duration-300 ${
          showCalendar ? 'text-navy-600' : 'text-[#8A8A9A]'
        }`}>Schedule</span>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={handleContinueToStep2} className={`transition-all duration-300 ${
      isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="text-center mb-6">
        <p className="text-[#5A5A6E] text-base">
          Takes less than 30 seconds — just your basic info to get started.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="relative">
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              First Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A] pointer-events-none" />
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jane"
                className="w-full pl-10 pr-4 py-3.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Smith"
              className="w-full px-4 py-3.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A] pointer-events-none" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              className="w-full pl-10 pr-4 py-3.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Phone *
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A] pointer-events-none" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 123-4567"
              className="w-full pl-10 pr-4 py-3.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!step1Valid}
        className="w-full mt-8 bg-navy-500 hover:bg-navy-600 disabled:opacity-50 disabled:cursor-not-allowed text-cream-100 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 btn-premium shadow-lg shadow-navy-500/20 transition-all duration-200"
      >
        <span>Continue</span>
        <ArrowRight className="h-5 w-5" />
      </button>

      <p className="text-center text-xs text-[#8A8A9A] mt-4">
        Your information is secure and never shared with third parties.
      </p>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={handleSubmit} className={`transition-all duration-300 ${
      isTransitioning ? 'opacity-0 translate-x-[20px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={handleBackToStep1}
          className="flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-700 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <p className="text-[#5A5A6E] text-base ml-auto mr-auto pr-10">
          Tell us about your academic background.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Current School
          </label>
          <input
            type="text"
            name="currentSchool"
            value={formData.currentSchool}
            onChange={handleChange}
            placeholder="e.g., Arizona State University"
            className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              College GPA
            </label>
            <input
              type="text"
              name="collegeGPA"
              value={formData.collegeGPA}
              onChange={handleChange}
              placeholder="e.g., 3.8 (or N/A if not yet in college)"
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              High School GPA
            </label>
            <input
              type="text"
              name="highSchoolGPA"
              value={formData.highSchoolGPA}
              onChange={handleChange}
              placeholder="e.g., 3.9"
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Target Schools
          </label>
          <input
            type="text"
            name="targetSchools"
            value={formData.targetSchools}
            onChange={handleChange}
            placeholder="e.g., Cornell, Brown, NYU, Michigan, Columbia, Duke, Vanderbilt, etc."
            className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Test Score (SAT/ACT)
            </label>
            <input
              type="text"
              name="testScore"
              value={formData.testScore}
              onChange={handleChange}
              placeholder="e.g., SAT 1400, ACT 32"
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
              <DollarSign className="h-4 w-4 inline mr-2" />
              Applying for Financial Aid?
            </label>
            <select
              name="financialAid"
              value={formData.financialAid}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
            >
              <option value="">Select one</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            What's your biggest challenge with transferring?
          </label>
          <textarea
            name="biggestChallenge"
            value={formData.biggestChallenge}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us what's on your mind..."
            className="w-full px-4 py-3 border border-cream-300 rounded-xl focus:ring-2 focus:ring-navy-500 focus:border-transparent form-input-premium"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-8 bg-navy-500 hover:bg-navy-600 text-cream-100 font-semibold py-4 px-6 rounded-xl flex items-center justify-center space-x-2 btn-premium shadow-lg shadow-navy-500/20 transition-all duration-200"
      >
        <Calendar className="h-5 w-5" />
        <span>Continue to Schedule</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </form>
  );

  return (
    <section id="consultation" className="py-10 sm:py-16 md:py-20 bg-[#F5EDD9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-4">
            Learn More About Our Services
          </h2>
          <p className="text-lg md:text-xl text-[#3D3D4E] max-w-2xl mx-auto">
            Schedule a call to see how TransferringUp can help you transfer to your dream school
          </p>
        </div>

        {!showCalendar ? (
          <div className="bg-cream-50 rounded-2xl shadow-lg border border-cream-300 p-6 sm:p-8 blur-up">
            {renderStepIndicator()}
            {step === 1 ? renderStep1() : renderStep2()}
          </div>
        ) : (
          <div className="bg-cream-50 rounded-2xl shadow-lg border border-cream-300 overflow-hidden scroll-scale-in">
            {renderStepIndicator()}
            <div className="bg-gradient-to-r from-navy-500 to-navy-600 text-white px-8 py-6">
              <h3 className="text-2xl font-bold text-center">Pick Your Time</h3>
              <p className="text-center text-navy-100 mt-2">Schedule your call below</p>
            </div>

            <div className="p-4">
              <div
                className="calendly-inline-widget"
                data-url="https://calendly.com/as4489-cornell/new-meeting-1?background_color=f8f5f5"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ConsultationBooking;
