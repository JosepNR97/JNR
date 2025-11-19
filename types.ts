export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
  logoUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Strategy' | 'Digital' | 'Cloud' | 'Agile' | 'AI' | 'Security';
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudyItem {
  id: string;
  title: string;
  client: string;
  challengeTitle: string;
  challenge: string;
  approachTitle: string;
  approach: string;
  resultsTitle: string;
  results: string[];
  cta: string;
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  aboutText1: string;
  aboutText2: string;
  yearsExp: string;
  projectsLed: string;
  yearsLabel: string;
  projectsLabel: string;
  linkedinUrl: string;
  email: string;
  location: string;
  connectLinkedin: string;
  viewPortfolio: string;
}

export interface TranslationStructure {
  nav: {
    about: string;
    services: string;
    work: string;
    testimonials: string;
    experience: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    tagline: string;
    connect: string;
    portfolio: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    years: string;
    yearsLabel: string;
    projects: string;
    projectsLabel: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  caseStudies: {
    badge: string;
    title: string;
    subtitle: string;
    items: CaseStudyItem[];
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  experience: {
    title: string;
    subtitle: string;
    detailTitle: string;
    items: ExperienceItem[];
    expand: string;
    collapse: string;
  };
  certifications: {
    title: string;
  };
  contact: {
    title: string;
    subtitle: string;
    availabilityTitle: string;
    availabilityText1: string;
    availabilityText2: string;
    rights: string;
  };
}
