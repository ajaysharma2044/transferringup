import { useState } from 'react';
import { Mail, Phone, Video, CheckCircle, ArrowRight, Send, AlertCircle, Clock, Users, Star } from 'lucide-react';
import QuestionForm from './QuestionForm';

interface ContactProps {}

const Contact = ({}: ContactProps) => {
  return (
    <section id="contact" className="py-10 sm:py-16 md:py-20 bg-[#F5EDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16 scroll-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C1C1E] mb-4 sm:mb-6">
            Contact <span className="text-crimson-500">Our Team</span>
          </h2>

          <p className="text-lg sm:text-xl text-[#3D3D4E] max-w-3xl mx-auto mb-6 sm:mb-8">
            Get in touch with our transfer experts for questions about our services.
          </p>
        </div>

        {/* Quick Question Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <QuestionForm />
        </div>

        {/* Contact Information */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-cream-50 rounded-xl p-5 sm:p-8 shadow-lg border border-cream-300 scroll-scale-in premium-hover">
            <h3 className="text-2xl font-bold text-[#1C1C1E] text-center mb-8">
              Get in Touch
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-crimson-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#1C1C1E] mb-2">Ajay Sharma</h4>
                <p className="text-[#3D3D4E] mb-4">CEO & Co-Founder</p>
                <a 
                  href="mailto:as4489@cornell.edu"
                  className="text-crimson-500 hover:text-crimson-600 font-medium"
                >
                  as4489@cornell.edu
                </a>
                <div className="mt-4">
                  <a 
                    href="tel:+19802489218"
                    className="text-forest-500 hover:text-forest-600 font-medium"
                  >
                    (980) 248-9218
                  </a>
                </div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-navy-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-[#1C1C1E] mb-2">Bryan Liu</h4>
                <p className="text-[#3D3D4E] mb-4">COO & Co-Founder</p>
                <a 
                  href="mailto:bryankliu@gmail.com"
                  className="text-navy-500 hover:text-navy-600 font-medium block mb-2"
                >
                  bryankliu@gmail.com
                </a>
                <div className="mt-4">
                  <a 
                    href="tel:+18572455772"
                    className="text-forest-500 hover:text-forest-600 font-medium"
                  >
                    (857) 245-5772
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;