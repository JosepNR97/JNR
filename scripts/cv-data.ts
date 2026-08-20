import { PROFILE_DATA } from '../aboutMe';
import { translations } from '../translations';
import type { Language } from '../types';
import { fileURLToPath } from 'node:url';

const CV_COPY = {
  ca: {
    profile: 'Perfil professional',
    contact: 'Contacte',
    expertise: "Àrees d'especialització",
    experience: 'Experiència professional',
    projects: 'Projectes destacats',
    education: 'Formació acadèmica',
    certifications: 'Certificacions professionals',
    email: 'Correu electrònic',
    linkedin: 'LinkedIn',
    website: 'Portafoli web',
    credential: 'Veure credencial',
    generatedFrom: 'CV generat des del portafoli professional',
  },
  es: {
    profile: 'Perfil profesional',
    contact: 'Contacto',
    expertise: 'Áreas de especialización',
    experience: 'Experiencia profesional',
    projects: 'Proyectos destacados',
    education: 'Formación académica',
    certifications: 'Certificaciones profesionales',
    email: 'Correo electrónico',
    linkedin: 'LinkedIn',
    website: 'Portfolio web',
    credential: 'Ver credencial',
    generatedFrom: 'CV generado desde el portfolio profesional',
  },
  en: {
    profile: 'Professional profile',
    contact: 'Contact',
    expertise: 'Areas of expertise',
    experience: 'Professional experience',
    projects: 'Selected projects',
    education: 'Academic background',
    certifications: 'Professional certifications',
    email: 'Email',
    linkedin: 'LinkedIn',
    website: 'Web portfolio',
    credential: 'View credential',
    generatedFrom: 'CV generated from the professional portfolio',
  },
} satisfies Record<Language, Record<string, string>>;

const sanitizePdfText = (value: string) =>
  value
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const summarize = (value: string, maximumLength = 245) => {
  const text = sanitizePdfText(value);
  if (text.length <= maximumLength) return text;

  const truncated = text.slice(0, maximumLength + 1);
  const lastSpace = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, Math.max(lastSpace, maximumLength - 24)).trim()}...`;
};

const validCredentialUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : null);

export interface CvProject {
  year: string;
  sector: string;
  title: string;
  summary: string;
  role: string;
  company: string;
}

export interface CvModel {
  language: Language;
  labels: (typeof CV_COPY)[Language];
  profile: {
    name: string;
    title: string;
    tagline: string;
    email: string;
    linkedin: string;
    website: string;
    location: string;
    imagePath: string;
    summary: string[];
    languages: string;
  };
  expertise: Array<{ title: string; description: string }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  recentProjects: CvProject[];
  earlierProjects: CvProject[];
  education: Array<{
    degree: string;
    institution: string;
    period: string;
    description: string;
  }>;
  certificationProviders: Array<{
    name: string;
    certifications: Array<{
      name: string;
      date: string;
      credentialUrl: string | null;
    }>;
  }>;
}

export const buildCvModel = (language: Language): CvModel => {
  const t = translations[language];
  const projects = t.experience.items.map((item) =>
    item.achievements.map((achievement) => ({
      year: sanitizePdfText(achievement.year),
      sector: sanitizePdfText(achievement.sector),
      title: sanitizePdfText(achievement.title),
      summary: summarize(achievement.description),
      role: sanitizePdfText(item.role),
      company: sanitizePdfText(item.company),
    })),
  );

  return {
    language,
    labels: CV_COPY[language],
    profile: {
      name: PROFILE_DATA.name,
      title: sanitizePdfText(t.hero.title),
      tagline: sanitizePdfText(t.hero.tagline),
      email: PROFILE_DATA.email,
      linkedin: PROFILE_DATA.linkedin,
      website: PROFILE_DATA.website,
      location: sanitizePdfText(t.contact.location),
      imagePath: fileURLToPath(new URL('../public/assets/people/josep-nunez-riba.png', import.meta.url)),
      summary: [t.about.p1, t.about.p2, t.about.p3].map(sanitizePdfText),
      languages: sanitizePdfText(t.about.languagesText),
    },
    expertise: t.services.items.map((item) => ({
      title: sanitizePdfText(item.title),
      description: summarize(item.description, 190),
    })),
    experience: t.experience.items.map((item) => ({
      role: sanitizePdfText(item.role),
      company: sanitizePdfText(item.company),
      period: sanitizePdfText(item.period),
      description: sanitizePdfText(item.description),
    })),
    recentProjects: projects.slice(0, 2).flat(),
    earlierProjects: projects.slice(2).flat(),
    education: t.education.academic.map((item) => ({
      degree: sanitizePdfText(item.degree),
      institution: sanitizePdfText(item.institution),
      period: sanitizePdfText(item.year),
      description: sanitizePdfText(item.description ?? ''),
    })),
    certificationProviders: t.education.professional.map((vendor) => ({
      name: sanitizePdfText(vendor.name),
      certifications: vendor.certifications.map((certification) => ({
        name: sanitizePdfText(certification.name),
        date: sanitizePdfText(certification.date),
        credentialUrl: validCredentialUrl(certification.credentialUrl),
      })),
    })),
  };
};
