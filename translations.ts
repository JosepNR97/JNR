
import { TranslationStructure, Language } from './types';
import { EDUCATION_DATA } from './constants';
import { EXPERIENCE_DATA } from './experienceInfo';
import { 
  NAV_DATA, 
  HERO_DATA, 
  ABOUT_DATA, 
  SERVICES_DATA, 
  TESTIMONIALS_DATA, 
  CERTIFICATIONS_SECTION_DATA, 
  CASE_STUDIES_DATA, 
  CONTACT_DATA 
} from './aboutMe';

const getEducationData = (lang: Language) => {
  return {
    badge: lang === 'ca' ? "Formació continuada" : lang === 'es' ? "Formación continua" : "Continuous Learning",
    title: lang === 'ca' ? "Formació i Certificacions" : lang === 'es' ? "Formación y certificaciones" : "Education & Certifications",
    subtitle: lang === 'ca' ? "Compromís constant amb l'aprenentatge i la validació tècnica a través dels estàndards de la indústria." : lang === 'es' ? "Compromiso constante con el aprendizaje y la validación técnica a través de los estándares de la industria." : "Commitment to technical excellence requires constant learning and validation by industry standards.",
    academicTitle: lang === 'ca' ? "Formació Académica" : lang === 'es' ? "Formación Académica" : "Academic Background",
    professionalTitle: lang === 'ca' ? "Certificacions Professionals" : lang === 'es' ? "Certificaciones Profesionales" : "Professional Certifications",
    viewCredential: lang === 'ca' ? "Veure credencial" : lang === 'es' ? "Ver credencial" : "View credential",
    academic: EDUCATION_DATA.academic.map(item => ({
      id: item.id,
      degree: item.degree[lang],
      institution: item.institution,
      year: item.year[lang],
      logoUrl: item.logoUrl,
      description: item.description[lang]
    })),
    professional: EDUCATION_DATA.professional.map(vendor => ({
      id: vendor.id,
      name: vendor.name,
      logoUrl: vendor.logoUrl,
      tags: vendor.tags,
      certifications: vendor.certifications.map(cert => ({
        name: cert.name,
        image: cert.image,
        date: cert.date[lang],
        credentialUrl: cert.credentialUrl
      }))
    }))
  };
};

const getExperienceData = (lang: Language) => {
  return {
    title: lang === 'ca' ? "Trajectòria professional" : lang === 'es' ? "Trayectoria profesional" : "Professional Experience",
    subtitle: lang === 'ca' ? "Fes clic a les targetes per explorar el detall dels projectes." : lang === 'es' ? "Haz clic en las tarjetas para explorar el detalle de los proyectos." : "Click on the cards to explore project details.",
    detailTitle: lang === 'ca' ? "Detall de projectes" : lang === 'es' ? "Detalle de proyectos" : "Project Details",
    expand: lang === 'ca' ? "Veure projectes destacats" : lang === 'es' ? "Ver proyectos destacados" : "View featured projects",
    collapse: lang === 'ca' ? "Ocultar detalls" : lang === 'es' ? "Ocultar detalles" : "Hide details",
    items: EXPERIENCE_DATA.map(item => ({
      id: item.id,
      role: item.role,
      company: item.company,
      period: item.period[lang],
      description: item.description[lang],
      logoUrl: item.logoUrl,
      achievements: item.achievements.map(ach => ({
        year: ach.year,
        sector: ach.sector[lang],
        title: ach.title[lang],
        description: ach.description[lang]
      }))
    }))
  };
};

export const translations: Record<Language, TranslationStructure> = {
  ca: {
    nav: {
      home: NAV_DATA.home.ca,
      about: NAV_DATA.about.ca,
      services: NAV_DATA.services.ca,
      education: NAV_DATA.education.ca,
      testimonials: NAV_DATA.testimonials.ca,
      experience: NAV_DATA.experience.ca,
      contact: NAV_DATA.contact.ca
    },
    hero: {
      badge: HERO_DATA.badge.ca,
      title: HERO_DATA.title.ca,
      tagline: HERO_DATA.tagline.ca,
      connect: HERO_DATA.connect.ca,
      portfolio: HERO_DATA.portfolio.ca
    },
    about: {
      title: ABOUT_DATA.title.ca,
      p1: ABOUT_DATA.p1.ca,
      p2: ABOUT_DATA.p2.ca,
      p3: ABOUT_DATA.p3.ca,
      yearsLabel: ABOUT_DATA.yearsLabel.ca,
      projectsLabel: ABOUT_DATA.projectsLabel.ca
    },
    services: {
      title: SERVICES_DATA.title.ca,
      subtitle: SERVICES_DATA.subtitle.ca,
      items: SERVICES_DATA.items.map(s => ({
        id: s.id,
        title: s.title.ca,
        description: s.description.ca,
        iconName: s.iconName as any
      }))
    },
    education: getEducationData('ca'),
    testimonials: {
      title: TESTIMONIALS_DATA.title.ca,
      subtitle: TESTIMONIALS_DATA.subtitle.ca,
      items: TESTIMONIALS_DATA.items.map(t => ({
        id: t.id,
        quote: t.quote.ca,
        author: t.author,
        role: t.role.ca
      }))
    },
    experience: getExperienceData('ca'),
    certifications: {
      title: CERTIFICATIONS_SECTION_DATA.title.ca
    },
    caseStudies: {
      badge: CASE_STUDIES_DATA.badge.ca,
      title: CASE_STUDIES_DATA.title.ca,
      subtitle: CASE_STUDIES_DATA.subtitle.ca,
      items: CASE_STUDIES_DATA.items.map(cs => ({
        id: cs.id,
        title: cs.title.ca,
        client: cs.client.ca,
        challengeTitle: cs.challengeTitle.ca,
        challenge: cs.challenge.ca,
        approachTitle: cs.approachTitle.ca,
        approach: cs.approach.ca,
        resultsTitle: cs.resultsTitle.ca,
        results: cs.results.map(r => r.ca),
        cta: cs.cta.ca
      }))
    },
    contact: {
      title: CONTACT_DATA.title.ca,
      subtitle: CONTACT_DATA.subtitle.ca,
      location: CONTACT_DATA.location.ca,
      rights: CONTACT_DATA.rights.ca
    }
  },
  es: {
    nav: {
      home: NAV_DATA.home.es,
      about: NAV_DATA.about.es,
      services: NAV_DATA.services.es,
      education: NAV_DATA.education.es,
      testimonials: NAV_DATA.testimonials.es,
      experience: NAV_DATA.experience.es,
      contact: NAV_DATA.contact.es
    },
    hero: {
      badge: HERO_DATA.badge.es,
      title: HERO_DATA.title.es,
      tagline: HERO_DATA.tagline.es,
      connect: HERO_DATA.connect.es,
      portfolio: HERO_DATA.portfolio.es
    },
    about: {
      title: ABOUT_DATA.title.es,
      p1: ABOUT_DATA.p1.es,
      p2: ABOUT_DATA.p2.es,
      p3: ABOUT_DATA.p3.es,
      yearsLabel: ABOUT_DATA.yearsLabel.es,
      projectsLabel: ABOUT_DATA.projectsLabel.es
    },
    services: {
      title: SERVICES_DATA.title.es,
      subtitle: SERVICES_DATA.subtitle.es,
      items: SERVICES_DATA.items.map(s => ({
        id: s.id,
        title: s.title.es,
        description: s.description.es,
        iconName: s.iconName as any
      }))
    },
    education: getEducationData('es'),
    testimonials: {
      title: TESTIMONIALS_DATA.title.es,
      subtitle: TESTIMONIALS_DATA.subtitle.es,
      items: TESTIMONIALS_DATA.items.map(t => ({
        id: t.id,
        quote: t.quote.es,
        author: t.author,
        role: t.role.es
      }))
    },
    experience: getExperienceData('es'),
    certifications: {
      title: CERTIFICATIONS_SECTION_DATA.title.es
    },
    caseStudies: {
      badge: CASE_STUDIES_DATA.badge.es,
      title: CASE_STUDIES_DATA.title.es,
      subtitle: CASE_STUDIES_DATA.subtitle.es,
      items: CASE_STUDIES_DATA.items.map(cs => ({
        id: cs.id,
        title: cs.title.es,
        client: cs.client.es,
        challengeTitle: cs.challengeTitle.es,
        challenge: cs.challenge.es,
        approachTitle: cs.approachTitle.es,
        approach: cs.approach.es,
        resultsTitle: cs.resultsTitle.es,
        results: cs.results.map(r => r.es),
        cta: cs.cta.es
      }))
    },
    contact: {
      title: CONTACT_DATA.title.es,
      subtitle: CONTACT_DATA.subtitle.es,
      location: CONTACT_DATA.location.es,
      rights: CONTACT_DATA.rights.es
    }
  },
  en: {
    nav: {
      home: NAV_DATA.home.en,
      about: NAV_DATA.about.en,
      services: NAV_DATA.services.en,
      education: NAV_DATA.education.en,
      testimonials: NAV_DATA.testimonials.en,
      experience: NAV_DATA.experience.en,
      contact: NAV_DATA.contact.en
    },
    hero: {
      badge: HERO_DATA.badge.en,
      title: HERO_DATA.title.en,
      tagline: HERO_DATA.tagline.en,
      connect: HERO_DATA.connect.en,
      portfolio: HERO_DATA.portfolio.en
    },
    about: {
      title: ABOUT_DATA.title.en,
      p1: ABOUT_DATA.p1.en,
      p2: ABOUT_DATA.p2.en,
      p3: ABOUT_DATA.p3.en,
      yearsLabel: ABOUT_DATA.yearsLabel.en,
      projectsLabel: ABOUT_DATA.projectsLabel.en
    },
    services: {
      title: SERVICES_DATA.title.en,
      subtitle: SERVICES_DATA.subtitle.en,
      items: SERVICES_DATA.items.map(s => ({
        id: s.id,
        title: s.title.en,
        description: s.description.en,
        iconName: s.iconName as any
      }))
    },
    education: getEducationData('en'),
    testimonials: {
      title: TESTIMONIALS_DATA.title.en,
      subtitle: TESTIMONIALS_DATA.subtitle.en,
      items: TESTIMONIALS_DATA.items.map(t => ({
        id: t.id,
        quote: t.quote.en,
        author: t.author,
        role: t.role.en
      }))
    },
    experience: getExperienceData('en'),
    certifications: {
      title: CERTIFICATIONS_SECTION_DATA.title.en
    },
    caseStudies: {
      badge: CASE_STUDIES_DATA.badge.en,
      title: CASE_STUDIES_DATA.title.en,
      subtitle: CASE_STUDIES_DATA.subtitle.en,
      items: CASE_STUDIES_DATA.items.map(cs => ({
        id: cs.id,
        title: cs.title.en,
        client: cs.client.en,
        challengeTitle: cs.challengeTitle.en,
        challenge: cs.challenge.en,
        approachTitle: cs.approachTitle.en,
        approach: cs.approach.en,
        resultsTitle: cs.resultsTitle.en,
        results: cs.results.map(r => r.en),
        cta: cs.cta.en
      }))
    },
    contact: {
      title: CONTACT_DATA.title.en,
      subtitle: CONTACT_DATA.subtitle.en,
      location: CONTACT_DATA.location.en,
      rights: CONTACT_DATA.rights.en
    }
  }
};