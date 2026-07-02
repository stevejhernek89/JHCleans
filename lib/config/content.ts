/**
 * Editable marketing content — FAQs, testimonials placeholders, features, etc.
 */

export const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const featureCards = [
  {
    id: "deep-cleaning",
    title: "Deep Cleaning",
    description:
      "High-pressure washing removes grime, residue, and buildup from inside and out.",
    icon: "sparkles",
  },
  {
    id: "odor-reduction",
    title: "Odor Reduction",
    description:
      "Targeted deodorizing helps reduce unpleasant smells at the source.",
    icon: "wind",
  },
  {
    id: "sanitizing",
    title: "Sanitizing Service",
    description:
      "Professional-grade sanitizing for a cleaner, fresher bin you can feel good about.",
    icon: "shield",
  },
  {
    id: "curbside",
    title: "Curbside Convenience",
    description:
      "We come to you. Leave your cans accessible — we handle the rest.",
    icon: "truck",
  },
  {
    id: "booking",
    title: "Easy Online Booking",
    description:
      "Schedule in minutes with our simple online booking flow.",
    icon: "calendar",
  },
  {
    id: "recurring",
    title: "Recurring Cleaning Plans",
    description:
      "Set it and forget it with flexible monthly or biweekly plans.",
    icon: "refresh-cw",
  },
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Book Online",
    description:
      "Choose your service, pick a date, and tell us how many bins need cleaning.",
    icon: "calendar",
  },
  {
    step: 2,
    title: "Leave Your Cans Accessible",
    description:
      "Place your empty bins at the curb or in an agreed location before we arrive.",
    icon: "map-pin",
  },
  {
    step: 3,
    title: "We Clean and Deodorize",
    description:
      "Our team deep cleans, sanitizes, and deodorizes each bin with professional equipment.",
    icon: "droplets",
  },
  {
    step: 4,
    title: "Enjoy Fresh, Clean Cans",
    description:
      "Come home to bins that look, smell, and feel noticeably cleaner.",
    icon: "sparkles",
  },
] as const;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    id: "how-it-works",
    question: "How does garbage-can cleaning work?",
    answer:
      "We use professional pressure-washing equipment to deep clean the interior and exterior of your bins. The process includes scrubbing, rinsing, sanitizing, and deodorizing — all done curbside at your home.",
  },
  {
    id: "need-home",
    question: "Do I need to be home?",
    answer:
      "No. As long as your bins are accessible at the agreed location, you do not need to be home. We'll send confirmation when service is complete.",
  },
  {
    id: "empty-cans",
    question: "Should the cans be empty?",
    answer:
      "Yes. Bins should be empty on your scheduled service day so we can thoroughly clean the interior. We recommend scheduling after your regular trash pickup.",
  },
  {
    id: "when-schedule",
    question: "When should I schedule the cleaning?",
    answer:
      "The best time is after your trash has been collected and the bin is empty. Many customers schedule the day after pickup for best results.",
  },
  {
    id: "duration",
    question: "How long does the service take?",
    answer:
      "Most residential bins take approximately 15–20 minutes each. Multi-bin jobs may take a bit longer depending on condition and quantity.",
  },
  {
    id: "recycling",
    question: "Do you clean recycling cans?",
    answer:
      "Yes. We clean both garbage and recycling bins. You can specify how many of each when booking.",
  },
  {
    id: "rain",
    question: "What happens if it rains?",
    answer:
      "Light rain usually doesn't affect service. In severe weather, we'll contact you to reschedule at no extra charge.",
  },
  {
    id: "products",
    question: "What products do you use?",
    answer:
      "We use professional cleaning and deodorizing products selected for effective results. Ask us about product details when you book.",
  },
  {
    id: "recurring",
    question: "How do recurring plans work?",
    answer:
      "Choose monthly or biweekly service and we'll automatically schedule recurring visits. You can reschedule or pause through our contact team.",
  },
  {
    id: "payment",
    question: "What payment methods are accepted?",
    answer:
      "Payment options will be confirmed at booking. Contact us if you have specific payment questions.",
  },
  {
    id: "areas",
    question: "What areas do you service?",
    answer:
      "Use our ZIP code checker on this page or contact us to confirm whether we serve your neighborhood. Our service area is expanding.",
  },
  {
    id: "reschedule",
    question: "Can I reschedule or cancel?",
    answer:
      "Yes. Contact us as soon as possible to reschedule or cancel. See our Cancellation Policy for details.",
  },
];

/**
 * Placeholder testimonials — clearly marked, easy to replace.
 * Do NOT present these as real customer reviews at launch.
 */
export const testimonialsConfig = {
  enabled: true,
  isPlaceholder: true,
  items: [
    {
      id: "placeholder-1",
      quote:
        "[Placeholder testimonial — replace with a real customer review before launch.]",
      author: "[Customer name]",
      location: "[City, ST]",
      rating: null as number | null,
    },
    {
      id: "placeholder-2",
      quote:
        "[Placeholder testimonial — replace with a real customer review before launch.]",
      author: "[Customer name]",
      location: "[City, ST]",
      rating: null as number | null,
    },
    {
      id: "placeholder-3",
      quote:
        "[Placeholder testimonial — replace with a real customer review before launch.]",
      author: "[Customer name]",
      location: "[City, ST]",
      rating: null as number | null,
    },
  ],
};

export const aboutContent = {
  headline: "Built by Local Entrepreneurs, Driven by Community",
  story: [
    "JHCleans was started by two young entrepreneurs who wanted to build a useful local service through hard work, reliability, and excellent customer care.",
    "What began as a neighborhood idea has grown into a professional curbside cleaning service focused on helping homeowners keep their bins clean, fresh, and presentable — without the hassle.",
    "We're ambitious about quality, responsible in how we operate, and committed to treating every customer like a neighbor. Our goal is simple: make one unpleasant household job disappear from your to-do list.",
  ],
  values: [
    {
      title: "Reliability",
      description: "We show up on time and do what we say we'll do.",
    },
    {
      title: "Quality",
      description: "Every bin gets the same careful attention to detail.",
    },
    {
      title: "Community",
      description: "We're building a service our neighbors can count on.",
    },
    {
      title: "Care",
      description: "Your satisfaction and trust matter to us.",
    },
  ],
  foundersNote:
    "Young Founders. Big Impact.",
  photoPlaceholder:
    "Second team photo coming soon — add when available.",
  founders: [
    {
      id: "founder-1",
      name: "James",
      role: "Co-Founder",
      image: "/images/founders/founder-1.png",
      imageAlt: "James, JHCleans co-founder",
    },
    {
      id: "founder-2",
      name: null,
      role: "Co-Founder",
      image: null,
      imageAlt: "JHCleans co-founder — photo coming soon",
    },
  ],
};
