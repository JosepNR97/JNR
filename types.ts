export type Language = 'ca' | 'es' | 'en';

export type MultiLanguageString = Record<Language, string>;

export interface AchievementItem {
  year: string;
  sector: string;
  title: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  achievements: AchievementItem[];
  logoUrl: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Strategy' | 'Architecture' | 'Cloud' | 'Agile' | 'AI';
}

export interface AcademicItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  logoUrl: string;
  description?: string;
}

export interface CertificationItem {
  name: string;
  image: string;
  date: string;
  credentialUrl: string;
}

export interface VendorItem {
  id: string;
  name: string;
  logoUrl: string;
  tags: string[];
  certifications: CertificationItem[];
}

export interface TranslationStructure {
  nav: {
    home: string;
    about: string;
    services: string;
    education: string;
    experience: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    tagline: string;
    connect: string;
    portfolio: string;
    downloadCv: string;
  };
  about: {
    title: string;
    p1: string;
    p2: string;
    p3: string;
    languagesTitle: string;
    languagesText: string;
    yearsLabel: string;
    projectsLabel: string;
  };
  services: {
    title: string;
    subtitle: string;
    items: ServiceItem[];
  };
  education: {
    badge: string;
    title: string;
    subtitle: string;
    academicTitle: string;
    professionalTitle: string;
    viewCredential: string;
    academic: AcademicItem[];
    professional: VendorItem[];
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
    openVendor: string;
  };
  contact: {
    title: string;
    subtitle: string;
    location: string;
    rights: string;
  };
}
