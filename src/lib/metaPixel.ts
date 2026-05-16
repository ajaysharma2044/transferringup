declare global {
  interface Window {
    fbq: (
      action: string,
      eventName: string,
      parameters?: Record<string, any>
    ) => void;
    _fbq: any;
  }
}

const isFbqReady = () =>
  typeof window !== 'undefined' && typeof window.fbq === 'function';

export const trackEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (isFbqReady()) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackCustomEvent = (
  eventName: string,
  parameters?: Record<string, any>
) => {
  if (isFbqReady()) {
    window.fbq('trackCustom', eventName, parameters);
  }
};

export const MetaPixelEvents = {
  ViewContent: (contentName: string, contentCategory?: string) => {
    trackEvent('ViewContent', {
      content_name: contentName,
      content_category: contentCategory,
    });
  },

  Lead: (value?: number, currency: string = 'USD') => {
    trackEvent('Lead', {
      value,
      currency,
    });
  },

  CompleteRegistration: (status: string = 'completed') => {
    trackEvent('CompleteRegistration', {
      status,
    });
  },

  InitiateCheckout: (value?: number, currency: string = 'USD') => {
    trackEvent('InitiateCheckout', {
      value,
      currency,
    });
  },

  Purchase: (value: number, currency: string = 'USD', contentName?: string) => {
    trackEvent('Purchase', {
      value,
      currency,
      content_name: contentName,
    });
  },

  Schedule: (value?: number) => {
    trackEvent('Schedule', {
      value,
    });
  },

  Contact: () => {
    trackEvent('Contact');
  },

  SubmitApplication: () => {
    trackCustomEvent('SubmitApplication');
  },

  BookConsultation: () => {
    trackCustomEvent('BookConsultation');
  },
};
