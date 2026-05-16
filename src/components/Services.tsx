import { useState, useEffect, useRef } from 'react';
import { GraduationCap, FileText, Target, Users, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const Services = () => {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  const services = [
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Transfer Strategy",
      result: "Dozens Helped",
      description: "School selection, credit mapping, timeline creation",
      color: "from-navy-400 to-navy-500",
      detailedText: "We don't just help you pick schools - we build a comprehensive transfer roadmap. Our strategy includes analyzing your current academic standing, identifying target schools that align with your goals, creating semester-by-semester course plans that maximize credit transfer, and developing a timeline that gives you the best shot at acceptance. We've helped dozens of students navigate this complex process, from community college transfers to lateral moves between four-year institutions. Every strategy is personalized to your unique situation, academic background, and career aspirations."
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Essay Perfection",
      result: "T20 Acceptances",
      description: "Professional editing, narrative development",
      color: "from-crimson-400 to-crimson-500",
      detailedText: "Your transfer essay is your chance to tell your story - and we make sure it's compelling. Our essay team, led by transfer students who got into Johns Hopkins and Cornell, knows exactly what admissions officers want to see. We help you craft a narrative that explains your transfer motivation, highlights your growth, and demonstrates your fit for your target schools. From brainstorming to final edits, we work with you through unlimited revisions until your essay is perfect. Our students have used these essays to gain acceptance to top 20 universities across the country."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Extracurricular Development",
      result: "Leadership Built",
      description: "Activity planning, leadership opportunities, impact creation",
      color: "from-forest-400 to-forest-500",
      detailedText: "Extracurriculars can make or break your transfer application, especially when your GPA isn't perfect. We help you strategically build meaningful activities that demonstrate leadership, passion, and impact. This includes identifying opportunities at your current school, connecting you with conferences and competitions, helping you start new initiatives, and positioning your existing activities in the best light. We've helped students launch successful clubs, secure research positions, and create community impact projects that significantly strengthened their transfer applications."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "24/7 Support",
      result: "Unlimited Access",
      description: "Text support, weekly calls, goal tracking",
      color: "from-crimson-500 to-crimson-600",
      detailedText: "Transfer applications are stressful, and questions don't wait for business hours. That's why you get direct text access to both of your consultants, 24/7. Whether you're panicking about a deadline at midnight or need quick feedback on an essay draft, we're here. Beyond texting, you get weekly strategy calls to track progress, adjust plans, and stay motivated. We also provide goal tracking and accountability to ensure you're hitting every milestone on your transfer timeline. This level of support is what sets us apart from other consulting services."
    }
  ];

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="py-10 sm:py-16 md:py-20 bg-[#F5EDD9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-6 sm:mb-10 scroll-fade-in ${isVisible ? 'visible' : ''}`}>
          <div className="inline-flex items-center px-6 py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Proven System • Real Results
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-6">
            The <span className="text-crimson-500">Complete</span> Transfer System
          </h2>
          
          <p className="text-xl text-[#3D3D4E] max-w-3xl mx-auto mb-8" itemProp="description">
            Everything you need to transfer up. Nothing you don't.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`group relative scroll-scale-in scroll-stagger-${index + 1} ${isVisible ? 'visible' : ''}`}
            >
              <div 
                className="bg-cream-50 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-cream-300 group-hover:border-crimson-300 h-full cursor-pointer card-float"
                onClick={() => toggleService(index)}
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r ${service.color} rounded-lg md:rounded-xl text-white mb-4 md:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-lg md:text-xl font-bold text-[#1C1C1E] mb-2">
                  {service.title}
                </h3>
                
                <div className="text-xl md:text-2xl font-bold text-crimson-500 mb-2 md:mb-3">
                  {service.result}
                </div>
                
                <p className="text-[#3D3D4E] text-xs md:text-sm leading-relaxed mb-3 md:mb-4">
                  {service.description}
                </p>

                {/* Click to expand indicator */}
                <div className="flex items-center justify-center space-x-2 text-navy-500 text-xs md:text-sm font-medium">
                  <span>Click for details</span>
                  {expandedService === index ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>

                {/* Expanded Content */}
                {expandedService === index && (
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-cream-300 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-[#3D3D4E] text-xs md:text-sm leading-relaxed">
                      {service.detailedText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;