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
  challenge: string;
  approach: string;
  results: string[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  about: string;
  linkedinUrl: string;
  email: string;
  location: string;
}
