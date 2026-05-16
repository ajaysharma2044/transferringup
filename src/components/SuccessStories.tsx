import { Star, Quote, Award } from 'lucide-react';

const SuccessStories = () => {
  const testimonials = [
    {
      name: "Yash Singh",
      before: "Drexel University",
      after: "University of Michigan",
      quote: "Honestly, I felt lost. High school didn't go how I wanted with a 3.2 HS GPA, and everyone kept telling me Michigan was impossible. I didn't even know where to start. They helped me understand that the transfer process gives you a real shot if you know what to do. They walked me through everything—building my college profile, finding the right opportunities, writing essays that actually told my story. Without their help, I'd probably still be wondering what if. Now I'm at Michigan.",
      rating: 5,
      result: "ACCEPTED",
      image: "/yash.jpg"
    },
    {
      name: "Abbhi Sharma",
      before: "Community College (2.8 HS GPA)",
      after: "NYU",
      quote: "A 2.8 in high school, then community college. I never thought I'd see myself at a school like NYU. They helped me build a compelling narrative around my growth and college performance. The personal guidance made all the difference.",
      rating: 5,
      result: "ACCEPTED"
    }
  ];

  return (
    <section id="success-stories" className="py-10 sm:py-16 md:py-24 bg-[#F5EDD9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-16 scroll-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-[#8B1A1A]/10 border border-[#8B1A1A]/30 rounded-full text-[#8B1A1A] text-sm font-medium mb-6 backdrop-blur-sm badge-shimmer">
            <Award className="h-4 w-4 mr-2 text-[#8B1A1A]" />
            Real Students - Real Results
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0F1C2E] mb-6">
            Success <span className="text-[#8B1A1A]">Stories</span>
          </h2>

          <p className="text-xl text-[#3D3D4E] max-w-3xl mx-auto">
            From rejection to acceptance. These students did it. So can you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-7xl mx-auto mb-8 sm:mb-16 grid-stagger">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white backdrop-blur-sm rounded-2xl p-5 sm:p-8 shadow-lg relative border border-[#0F1C2E]/10 hover:border-[#8B1A1A]/30 tilt-card"
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="absolute -top-3 -right-3 bg-[#8B1A1A] text-white px-4 py-2 rounded-full text-sm font-bold">
                {testimonial.result}
              </div>

              <div className="flex items-start gap-3 mb-6">
                {testimonial.image && (
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#8B1A1A]/30 flex-shrink-0"
                  />
                )}
                <Quote className="h-8 w-8 text-[#8B1A1A] flex-shrink-0" />
                <h4 className="font-bold text-[#0F1C2E] text-xl">{testimonial.name}</h4>
              </div>

              <div className="text-center mb-4">
                <h5 className="text-[#3D3D4E] font-semibold text-sm uppercase tracking-wide">
                  Before and After
                </h5>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-[#8B1A1A] font-bold text-sm mb-1">BEFORE</div>
                  <div className="text-[#0F1C2E] font-medium">{testimonial.before}</div>
                </div>
                <div className="text-center">
                  <div className="text-[#0F1C2E] font-bold text-sm mb-1">AFTER</div>
                  <div className="text-[#0F1C2E] font-medium">{testimonial.after}</div>
                </div>
              </div>

              <div className="flex mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-gold-400 fill-current" />
                ))}
              </div>

              <p className="text-[#3D3D4E] mb-8 leading-relaxed text-lg italic font-quote">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SuccessStories;
