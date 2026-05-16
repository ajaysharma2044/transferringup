import { useState } from 'react';
import { ArrowRight, ArrowLeft, User, Mail, Phone, CheckCircle, School, BookOpen, Target, FileText, DollarSign, Layers, MessageSquare, Send, Upload, X, Paperclip, Award, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { MetaPixelEvents } from '../lib/metaPixel';
import { submitToHubSpot } from '../lib/hubspot';
import { submitFormWithNotification } from '../lib/formSubmission';

interface QuoteFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  zipCode: string;
  currentSchool: string;
  collegeGPA: string;
  highSchoolGPA: string;
  targetSchools: string;
  intendedMajor: string;
  transferTerm: string;
  testScore: string;
  financialAid: string;
  numSchools: string;
  servicesInterested: string;
  biggestChallenge: string;
  additionalInfo: string;
  extracurriculars: string;
}

const INITIAL_FORM: QuoteFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  zipCode: '',
  currentSchool: '',
  collegeGPA: '',
  highSchoolGPA: '',
  targetSchools: '',
  intendedMajor: '',
  transferTerm: '',
  testScore: '',
  financialAid: '',
  numSchools: '',
  servicesInterested: '',
  biggestChallenge: '',
  additionalInfo: '',
  extracurriculars: '',
};

const MAX_FILES = 5;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/webp',
];

const SERVICE_OPTIONS = [
  'Full application strategy',
  'Essay writing & editing',
  'Extracurricular coaching',
  'Interview prep',
  'Financial aid guidance',
  'Course selection',
];

const SCHOOL_COUNT_OPTIONS = ['1-3', '4-6', '7-10', '10+'];
const TRANSFER_TERMS = ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027', 'Not sure yet'];

interface QuoteRequestFormProps {
  onClose: () => void;
}

const QuoteRequestForm = ({ onClose }: QuoteRequestFormProps) => {
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<QuoteFormData>(INITIAL_FORM);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleService = (service: string) => {
    const current = formData.servicesInterested ? formData.servicesInterested.split(', ') : [];
    const updated = current.includes(service)
      ? current.filter(s => s !== service)
      : [...current, service];
    setFormData(prev => ({ ...prev, servicesInterested: updated.join(', ') }));
  };

  const goToStep = (target: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(target);
      setIsTransitioning(false);
    }, 250);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const selected = Array.from(e.target.files || []);
    const totalFiles = files.length + selected.length;

    if (totalFiles > MAX_FILES) {
      setUploadError(`You can upload up to ${MAX_FILES} files.`);
      return;
    }

    for (const file of selected) {
      if (file.size > MAX_FILE_SIZE) {
        setUploadError(`"${file.name}" exceeds the 10 MB limit.`);
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setUploadError(`"${file.name}" is not a supported file type. Use PDF, Word, JPEG, or PNG.`);
        return;
      }
    }

    setFiles(prev => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setUploadError('');
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (!supabase || files.length === 0) return [];

    const urls: string[] = [];
    const timestamp = Date.now();
    const folder = `${formData.email.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}`;

    for (const file of files) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const path = `${folder}/${safeName}`;

      const { error } = await supabase.storage
        .from('quote-attachments')
        .upload(path, file);

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('quote-attachments')
          .getPublicUrl(path);
        urls.push(urlData.publicUrl);
      }
    }

    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fileUrls = await uploadFiles();

      if (supabase) {
        await supabase.from('quote_requests').insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          zip_code: formData.zipCode,
          current_school: formData.currentSchool,
          college_gpa: formData.collegeGPA,
          high_school_gpa: formData.highSchoolGPA,
          target_schools: formData.targetSchools,
          intended_major: formData.intendedMajor,
          transfer_term: formData.transferTerm,
          test_score: formData.testScore,
          financial_aid: formData.financialAid,
          num_schools: formData.numSchools,
          services_interested: formData.servicesInterested,
          biggest_challenge: formData.biggestChallenge,
          additional_info: formData.additionalInfo,
          extracurriculars: formData.extracurriculars,
          file_urls: fileUrls,
        });
      }

      submitFormWithNotification({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        zipCode: formData.zipCode,
        currentSchool: formData.currentSchool,
        collegeGPA: formData.collegeGPA,
        highSchoolGPA: formData.highSchoolGPA,
        targetSchools: formData.targetSchools,
        testScore: formData.testScore,
        financialAid: formData.financialAid,
        intendedMajor: formData.intendedMajor,
        transferTerm: formData.transferTerm,
        numSchools: formData.numSchools,
        servicesInterested: formData.servicesInterested,
        biggestChallenge: formData.biggestChallenge,
        additionalInfo: formData.additionalInfo,
        extracurriculars: formData.extracurriculars,
        fileUrls: fileUrls.join(' | '),
        source: 'Custom Quote Request Form',
      }).catch(() => {});

      submitToHubSpot({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        currentSchool: formData.currentSchool,
        currentGPA: formData.collegeGPA,
        targetSchools: formData.targetSchools,
        biggestChallenge: formData.biggestChallenge,
      }).catch(() => {});

      MetaPixelEvents.Lead();
      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const step1Valid = formData.firstName && formData.email && formData.phone;
  const step2Valid = formData.currentSchool && formData.highSchoolGPA && formData.targetSchools;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 popup-backdrop bg-black/60">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center popup-enter">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-[#0F1C2E] mb-3">Quote Request Received</h3>
          <p className="text-[#3D3D4E] mb-2">
            Thank you, {formData.firstName}! Our team will review your information and send you a personalized quote within 24 hours.
          </p>
          <p className="text-[#5A5A6E] text-sm mb-6">
            Check your email at <span className="font-medium text-[#0F1C2E]">{formData.email}</span> for next steps.
          </p>
          <button
            onClick={onClose}
            className="bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] px-8 py-3 rounded-xl font-semibold transition-colors duration-200"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const stepLabels = ['Info', 'Academic', 'Details', 'Extras'];

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-6 gap-1.5 sm:gap-2">
      {[1, 2, 3, 4].map((s, i) => (
        <div key={s} className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1">
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              step > s ? 'bg-[#0F1C2E] text-white' : step === s ? 'bg-[#8B1A1A] text-white shadow-md' : 'bg-[#E8E0CC] text-[#8A8A9A]'
            }`}>
              {step > s ? <CheckCircle className="h-3.5 w-3.5" /> : s}
            </div>
            <span className={`text-xs font-medium hidden sm:inline transition-colors ${
              step >= s ? 'text-[#0F1C2E]' : 'text-[#8A8A9A]'
            }`}>
              {stepLabels[s - 1]}
            </span>
          </div>
          {i < 3 && (
            <div className={`w-6 sm:w-10 h-0.5 rounded-full transition-all duration-500 ${
              step > s ? 'bg-[#0F1C2E]' : 'bg-[#E8E0CC]'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <form onSubmit={(e) => { e.preventDefault(); goToStep(2); }} className={`transition-all duration-250 ${
      isTransitioning ? 'opacity-0 translate-x-[-16px]' : 'opacity-100 translate-x-0'
    }`}>
      <p className="text-[#5A5A6E] text-sm text-center mb-5">Tell us a bit about yourself so we can build your custom plan.</p>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">First Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A]" />
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="Jane"
                className="w-full pl-9 pr-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Smith"
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A]" />
            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="jane@example.com"
              className="w-full pl-9 pr-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Phone *</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A]" />
            <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567"
              className="w-full pl-9 pr-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A8A9A]" />
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, State"
              className="w-full pl-9 pr-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Zip Code</label>
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="10001"
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
        </div>
      </div>
      <button type="submit" disabled={!step1Valid}
        className="w-full mt-6 bg-[#8B1A1A] hover:bg-[#7A1717] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5EDD9] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 btn-premium transition-colors duration-200">
        <span>Continue</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );

  const renderStep2 = () => (
    <form onSubmit={(e) => { e.preventDefault(); goToStep(3); }} className={`transition-all duration-250 ${
      isTransitioning ? 'opacity-0 translate-x-[16px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="flex items-center mb-5">
        <button type="button" onClick={() => goToStep(1)} className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#7A1717] font-medium">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-[#5A5A6E] text-sm ml-auto mr-auto pr-8">Your academic background helps us scope the work.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
            <School className="h-3.5 w-3.5 inline mr-1.5" />Current School *
          </label>
          <input type="text" name="currentSchool" required value={formData.currentSchool} onChange={handleChange} placeholder="e.g., Arizona State University"
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">College GPA</label>
            <input type="text" name="collegeGPA" value={formData.collegeGPA} onChange={handleChange} placeholder="e.g., 3.8"
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">HS GPA *</label>
            <input type="text" name="highSchoolGPA" required value={formData.highSchoolGPA} onChange={handleChange} placeholder="e.g., 3.9"
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
            <Target className="h-3.5 w-3.5 inline mr-1.5" />Target Schools *
          </label>
          <input type="text" name="targetSchools" required value={formData.targetSchools} onChange={handleChange} placeholder="e.g., Cornell, NYU, Michigan, USC"
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
              <FileText className="h-3.5 w-3.5 inline mr-1.5" />Test Score
            </label>
            <input type="text" name="testScore" value={formData.testScore} onChange={handleChange} placeholder="SAT 1400 / ACT 32"
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
              <DollarSign className="h-3.5 w-3.5 inline mr-1.5" />Financial Aid?
            </label>
            <select name="financialAid" value={formData.financialAid} onChange={handleChange}
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm">
              <option value="">Select one</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Not Sure">Not Sure</option>
            </select>
          </div>
        </div>
      </div>
      <button type="submit" disabled={!step2Valid}
        className="w-full mt-6 bg-[#8B1A1A] hover:bg-[#7A1717] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5EDD9] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 btn-premium transition-colors duration-200">
        <span>Continue</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );

  const renderStep3 = () => (
    <form onSubmit={(e) => { e.preventDefault(); goToStep(4); }} className={`transition-all duration-250 ${
      isTransitioning ? 'opacity-0 translate-x-[16px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="flex items-center mb-5">
        <button type="button" onClick={() => goToStep(2)} className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#7A1717] font-medium">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-[#5A5A6E] text-sm ml-auto mr-auto pr-8">Final details to tailor your quote.</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
              <BookOpen className="h-3.5 w-3.5 inline mr-1.5" />Intended Major
            </label>
            <input type="text" name="intendedMajor" value={formData.intendedMajor} onChange={handleChange} placeholder="e.g., Computer Science"
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Transfer Term</label>
            <select name="transferTerm" value={formData.transferTerm} onChange={handleChange}
              className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm">
              <option value="">Select term</option>
              {TRANSFER_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            <Layers className="h-3.5 w-3.5 inline mr-1.5" />How many schools do you plan to apply to?
          </label>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_COUNT_OPTIONS.map(opt => (
              <button key={opt} type="button" onClick={() => setFormData(prev => ({ ...prev, numSchools: opt }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  formData.numSchools === opt
                    ? 'bg-[#8B1A1A] text-white border-[#8B1A1A]'
                    : 'bg-white text-[#3D3D4E] border-[#E8E0CC] hover:border-[#8B1A1A]/40'
                }`}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            Services you're interested in
          </label>
          <div className="flex flex-wrap gap-2">
            {SERVICE_OPTIONS.map(svc => {
              const selected = formData.servicesInterested.includes(svc);
              return (
                <button key={svc} type="button" onClick={() => toggleService(svc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    selected
                      ? 'bg-[#0F1C2E] text-white border-[#0F1C2E]'
                      : 'bg-white text-[#3D3D4E] border-[#E8E0CC] hover:border-[#0F1C2E]/40'
                  }`}>
                  {svc}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
            <MessageSquare className="h-3.5 w-3.5 inline mr-1.5" />Biggest challenge with transferring?
          </label>
          <textarea name="biggestChallenge" value={formData.biggestChallenge} onChange={handleChange} rows={2} placeholder="Tell us what's on your mind..."
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">Anything else we should know?</label>
          <textarea name="additionalInfo" value={formData.additionalInfo} onChange={handleChange} rows={2} placeholder="Optional..."
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm" />
        </div>
      </div>

      <button type="submit"
        className="w-full mt-6 bg-[#8B1A1A] hover:bg-[#7A1717] text-[#F5EDD9] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 btn-premium transition-colors duration-200">
        <span>Continue</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderStep4 = () => (
    <form onSubmit={handleSubmit} className={`transition-all duration-250 ${
      isTransitioning ? 'opacity-0 translate-x-[16px]' : 'opacity-100 translate-x-0'
    }`}>
      <div className="flex items-center mb-5">
        <button type="button" onClick={() => goToStep(3)} className="flex items-center gap-1 text-sm text-[#8B1A1A] hover:text-[#7A1717] font-medium">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <p className="text-[#5A5A6E] text-sm ml-auto mr-auto pr-8">Share your activities and any supporting docs (optional).</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-1.5">
            <Award className="h-3.5 w-3.5 inline mr-1.5" />Extracurricular Activities
          </label>
          <textarea
            name="extracurriculars"
            value={formData.extracurriculars}
            onChange={handleChange}
            rows={4}
            placeholder="List your clubs, sports, volunteer work, jobs, leadership roles, research, personal projects, etc."
            className="w-full px-3 py-3 border border-[#E8E0CC] rounded-xl focus:ring-2 focus:ring-[#8B1A1A]/30 focus:border-[#8B1A1A] form-input-premium text-sm"
          />
          <p className="text-xs text-[#8A8A9A] mt-1">Include role, organization, and time commitment if possible.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3D3D4E] mb-2">
            <Paperclip className="h-3.5 w-3.5 inline mr-1.5" />Attach Files (Optional)
          </label>
          <p className="text-xs text-[#8A8A9A] mb-3">
            Upload your resume, transcript, essays, or other documents. PDF, Word, JPEG, or PNG up to 10 MB each.
          </p>

          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8E0CC] rounded-xl cursor-pointer hover:border-[#8B1A1A]/40 hover:bg-[#8B1A1A]/[0.02] transition-all duration-200 group">
            <div className="flex flex-col items-center gap-1.5">
              <Upload className="h-5 w-5 text-[#8A8A9A] group-hover:text-[#8B1A1A] transition-colors" />
              <span className="text-sm text-[#5A5A6E] group-hover:text-[#3D3D4E] transition-colors">
                Click to browse files
              </span>
              <span className="text-xs text-[#8A8A9A]">
                {files.length}/{MAX_FILES} files
              </span>
            </div>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {uploadError && (
            <p className="text-xs text-red-600 mt-2">{uploadError}</p>
          )}

          {files.length > 0 && (
            <div className="mt-3 space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center gap-3 bg-white border border-[#E8E0CC] rounded-lg px-3 py-2">
                  <FileText className="h-4 w-4 text-[#8B1A1A] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#3D3D4E] truncate">{file.name}</p>
                    <p className="text-xs text-[#8A8A9A]">{formatFileSize(file.size)}</p>
                  </div>
                  <button type="button" onClick={() => removeFile(i)} className="p-1 hover:bg-red-50 rounded-md transition-colors">
                    <X className="h-3.5 w-3.5 text-[#8A8A9A] hover:text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}
        className="w-full mt-6 bg-[#8B1A1A] hover:bg-[#7A1717] disabled:opacity-60 text-[#F5EDD9] font-semibold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 btn-premium transition-colors duration-200">
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[#F5EDD9]/30 border-t-[#F5EDD9] rounded-full animate-spin" />
            {files.length > 0 ? 'Uploading & Submitting...' : 'Submitting...'}
          </span>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Get My Custom Quote</span>
          </>
        )}
      </button>

      <p className="text-center text-xs text-[#8A8A9A] mt-3">
        Your information is secure and never shared with third parties.
      </p>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 popup-backdrop bg-black/60" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#FAF6EE] rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto popup-enter">
        <div className="sticky top-0 bg-[#FAF6EE] border-b border-[#E8E0CC] px-6 pt-5 pb-4 rounded-t-2xl z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-[#0F1C2E]">Get Your Custom Quote</h3>
            <button onClick={onClose} className="text-[#8A8A9A] hover:text-[#3D3D4E] text-xl leading-none p-1 transition-colors">&times;</button>
          </div>
          {renderStepIndicator()}
        </div>
        <div className="px-6 pb-6 pt-4">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>
    </div>
  );
};

export default QuoteRequestForm;
