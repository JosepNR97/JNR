import {
  ABOUT_DATA,
  CERTIFICATIONS_SECTION_DATA,
  CONTACT_DATA,
  HERO_DATA,
  NAV_DATA,
  SERVICES_DATA,
} from './aboutMe';
import { EDUCATION_DATA } from './constants';
import { EXPERIENCE_DATA } from './experienceInfo';
import type { Language, TranslationStructure } from './types';

const EDUCATION_COPY: Record<
  Language,
  Pick<
    TranslationStructure['education'],
    'badge' | 'title' | 'subtitle' | 'academicTitle' | 'professionalTitle' | 'viewCredential'
  >
> = {
  ca: {
    badge: 'Formació continuada',
    title: 'Formació i certificacions',
    subtitle:
      "Compromís constant amb l'aprenentatge i la validació tècnica a través dels estàndards de la indústria.",
    academicTitle: 'Formació acadèmica',
    professionalTitle: 'Certificacions professionals',
    viewCredential: 'Veure credencial',
  },
  es: {
    badge: 'Formación continua',
    title: 'Formación y certificaciones',
    subtitle:
      'Compromiso constante con el aprendizaje y la validación técnica a través de los estándares de la industria.',
    academicTitle: 'Formación académica',
    professionalTitle: 'Certificaciones profesionales',
    viewCredential: 'Ver credencial',
  },
  en: {
    badge: 'Continuous Learning',
    title: 'Education & Certifications',
    subtitle: 'Commitment to technical excellence through constant learning and industry validation.',
    academicTitle: 'Academic Background',
    professionalTitle: 'Professional Certifications',
    viewCredential: 'View credential',
  },
};

const EXPERIENCE_COPY: Record<
  Language,
  Pick<TranslationStructure['experience'], 'title' | 'subtitle' | 'detailTitle' | 'expand' | 'collapse'>
> = {
  ca: {
    title: 'Trajectòria professional',
    subtitle: 'Activa cada targeta per explorar el detall dels projectes.',
    detailTitle: 'Detall de projectes',
    expand: 'Veure projectes destacats',
    collapse: 'Ocultar detalls',
  },
  es: {
    title: 'Trayectoria profesional',
    subtitle: 'Activa cada tarjeta para explorar el detalle de los proyectos.',
    detailTitle: 'Detalle de proyectos',
    expand: 'Ver proyectos destacados',
    collapse: 'Ocultar detalles',
  },
  en: {
    title: 'Professional Experience',
    subtitle: 'Activate each card to explore project details.',
    detailTitle: 'Project Details',
    expand: 'View featured projects',
    collapse: 'Hide details',
  },
};

const createTranslation = (language: Language): TranslationStructure => ({
  nav: {
    home: NAV_DATA.home[language],
    about: NAV_DATA.about[language],
    services: NAV_DATA.services[language],
    education: NAV_DATA.education[language],
    experience: NAV_DATA.experience[language],
    contact: NAV_DATA.contact[language],
  },
  hero: {
    badge: HERO_DATA.badge[language],
    title: HERO_DATA.title[language],
    tagline: HERO_DATA.tagline[language],
    connect: HERO_DATA.connect[language],
    portfolio: HERO_DATA.portfolio[language],
    downloadCv: HERO_DATA.downloadCv[language],
  },
  about: {
    title: ABOUT_DATA.title[language],
    p1: ABOUT_DATA.p1[language],
    p2: ABOUT_DATA.p2[language],
    p3: ABOUT_DATA.p3[language],
    languagesTitle: ABOUT_DATA.languages.label[language],
    languagesText: ABOUT_DATA.languages.items[language],
    yearsLabel: ABOUT_DATA.yearsLabel[language],
    projectsLabel: ABOUT_DATA.projectsLabel[language],
  },
  services: {
    title: SERVICES_DATA.title[language],
    subtitle: SERVICES_DATA.subtitle[language],
    items: SERVICES_DATA.items.map((service) => ({
      id: service.id,
      title: service.title[language],
      description: service.description[language],
      iconName: service.iconName,
    })),
  },
  education: {
    ...EDUCATION_COPY[language],
    academic: EDUCATION_DATA.academic.map((item) => ({
      id: item.id,
      degree: item.degree[language],
      institution: item.institution,
      year: item.year[language],
      logoUrl: item.logoUrl,
      description: item.description[language],
    })),
    professional: EDUCATION_DATA.professional.map((vendor) => ({
      id: vendor.id,
      name: vendor.name,
      logoUrl: vendor.logoUrl,
      tags: vendor.tags,
      certifications: vendor.certifications.map((certification) => ({
        name: certification.name,
        image: certification.image,
        date: certification.date[language],
        credentialUrl: certification.credentialUrl,
      })),
    })),
  },
  experience: {
    ...EXPERIENCE_COPY[language],
    items: EXPERIENCE_DATA.map((item) => ({
      id: item.id,
      role: item.role,
      company: item.company,
      period: item.period[language],
      description: item.description[language],
      logoUrl: item.logoUrl,
      achievements: item.achievements.map((achievement) => ({
        year: achievement.year,
        sector: achievement.sector[language],
        title: achievement.title[language],
        description: achievement.description[language],
      })),
    })),
  },
  certifications: {
    title: CERTIFICATIONS_SECTION_DATA.title[language],
    openVendor:
      language === 'ca'
        ? 'Veure certificacions de'
        : language === 'es'
          ? 'Ver certificaciones de'
          : 'View certifications from',
  },
  contact: {
    title: CONTACT_DATA.title[language],
    subtitle: CONTACT_DATA.subtitle[language],
    location: CONTACT_DATA.location[language],
    rights: CONTACT_DATA.rights[language],
  },
});

export const translations = {
  ca: createTranslation('ca'),
  es: createTranslation('es'),
  en: createTranslation('en'),
} satisfies Record<Language, TranslationStructure>;
