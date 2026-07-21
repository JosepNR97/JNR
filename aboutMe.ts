
import { assetPath } from './assetPath';
import type { MultiLanguageString, ServiceItem } from './types';

export const PROFILE_DATA = {
  name: "Josep Núñez Riba",
  email: "josepnunez97@gmail.com",
  linkedin: "https://www.linkedin.com/in/josep-nunez-riba",
  image: assetPath('people/josep-nunez-riba.webp'),
  location: {
    ca: "Barcelona",
    es: "Barcelona",
    en: "Barcelona"
  }
};

export const NAV_DATA = {
  home: { ca: "Inici", es: "Inicio", en: "Home" },
  about: { ca: "Sobre mi", es: "Sobre mí", en: "About me" },
  services: { ca: "Especialització", es: "Especialización", en: "Expertise" },
  education: { ca: "Formació", es: "Formación", en: "Education" },
  experience: { ca: "Experiència", es: "Experiencia", en: "Experience" },
  contact: { ca: "Contactar", es: "Contactar", en: "Contact" }
};

export const HERO_DATA = {
  badge: {
    ca: "Estratègia • Tecnologia • Innovació",
    es: "Estrategia • Tecnología • Innovación",
    en: "Strategy • Technology • Innovation"
  },
  title: {
    ca: "Gerent d'estratègia tecnològica",
    es: "Gerente de estrategia tecnológica",
    en: "Technology Strategy Manager"
  },
  tagline: {
    ca: "Impulsant l'eficiència operativa i el creixement a través de la transformació digital i la intel·ligència artificial.",
    es: "Impulsando la eficiencia operativa y el crecimiento a través de la transformación digital y la inteligencia artificial.",
    en: "Driving operational efficiency and growth through digital transformation and artificial intelligence."
  },
  connect: {
    ca: "Connectar a LinkedIn",
    es: "Conectar en LinkedIn",
    en: "Connect on LinkedIn"
  },
  portfolio: {
    ca: "Veure portafoli",
    es: "Ver portafolio",
    en: "View Portfolio"
  }
};

export const ABOUT_DATA = {
  title: { ca: "Sobre mi", es: "Sobre mí", en: "About me" },
  p1: {
    ca: "Professional amb experiència en projectes de transformació digital, arquitectura empresarial i estratègia cloud per a diverses empreses i organitzacions, amb un enfocament en la millora contínua per aplicar solucions innovadores i eficients en la indústria tecnològica.",
    es: "Profesional con experiencia en proyectos de transformación digital, arquitectura empresarial y estrategia cloud para diversas empresas y organizaciones, con un enfoque en la mejora continua para aplicar soluciones innovadoras y eficientes en la industria tecnológica.",
    en: "Strategy and consulting professional working on digital transformation projects, enterprise architecture, and cloud strategies for various companies and organizations, with a focus on continuous improvement to apply innovative and efficient solutions in the technology industry."
  },
  p2: {
    ca: "Combino visió estratègica amb un profund coneixement tècnic. El meu enfocament es centra en desmitificar la tecnologia per a l'alta direcció, permetent decisions informades que impulsen el creixement.",
    es: "Combino visión estratégica con un profundo conocimiento técnico. Mi enfoque se centra en desmitificar la tecnología para la alta dirección, permitiendo decisiones informadas que impulsan el crecimiento.",
    en: "I combine strategic vision with deep technical knowledge. My focus is on demystifying technology for senior management, enabling informed decisions that drive growth."
  },
  p3: {
    ca: "He treballat amb grans corporacions i empreses de múltiples sectors (banca, asseguradores, sector públic, transport, organismes internacionals, comunicacions, mitjans i tecnología, etc.), adaptant metodologies àgils i arquitectures modernes a les necessitats específiques de cada negoci.",
    es: "He trabajado con grandes corporaciones y empresas de múltiples sectores (banca, seguros, sector público, transporte, organismos internacionales, comunicaciones, medios y tecnología, etc.), adaptando metodologías ágiles y arquitecturas modernas a las necesidades específicas de cada negocio.",
    en: "I have worked with large corporations and companies across multiple sectors (banking, insurance, public sector, transport, international organizations, communication, media & technology, etc.), adapting agile methodologies and modern architectures to the specific needs of each business."
  },
  languages: {
    label: { ca: "Idiomes", es: "Idiomas", en: "Languages" },
    items: {
      ca: "Català i castellà natius / Anglès fluid",
      es: "Catalán y castellano nativos / Inglés fluido",
      en: "Native Catalan, Spanish / Fluent English"
    }
  },
  yearsLabel: { ca: "Anys d'experiència", es: "Años de experiencia", en: "Years of Experience" },
  projectsLabel: { ca: "Projectes executats", es: "Proyectos ejecutados", en: "Projects Executed" }
};

export const SERVICES_DATA = {
  title: { ca: "Àrees d'especialització", es: "Áreas de especialización", en: "Areas of Expertise" },
  subtitle: {
    ca: "Solucions estratègiques dissenyades per tancar la bretxa entre els objectius comercials i les capacitats tecnològiques més avançades.",
    es: "Soluciones estratégicas diseñadas para cerrar la brecha entre los objetivos comerciales y las capacidades tecnológicas más avanzadas.",
    en: "Strategic solutions designed to bridge the gap between business goals and the most advanced technological capabilities."
  },
  items: [
    {
      id: "s1",
      title: { ca: "Estratègia IT i govern", es: "Estrategia IT y gobierno", en: "IT Strategy & Governance" },
      description: {
        ca: "Gestió de projectes i programes de transformació digital mitjançant l'alineació del roadmap tecnològic amb resultats, objectius i indicadors de negoci, procurant el retorn de les inversions.",
        es: "Gestión de proyectos y programas de transformación digital mediante la alineación del roadmap tecnológico con resultados, objetivos e indicadores de negocio, procurando el retorno de las inversiones.",
        en: "Digital transformation projects and programs management by aligning the technology roadmap with business outcomes, objectives, and indicators, ensuring return on investment."
      },
      iconName: "Strategy"
    },
    {
      id: "s2",
      title: { ca: "Arquitectura empresarial", es: "Arquitectura empresarial", en: "Enterprise Architecture" },
      description: {
        ca: "Disseny de mapes de capacitats, gestió de portafoli d'aplicacions i definició d'arquitectures objectiu. Introducció de metodologies àgils per a l'evolució contínua de l'arquitectura i lideratge i suport a equips tècnics.",
        es: "Diseño de mapas de capacidades, gestión de portafolio de aplicaciones y definición de arquitecturas objetivo. Introducción de metodologías ágiles para la evolución continua de la arquitectura y liderazgo y soporte a equipos técnicos.",
        en: "Capability map design, application portfolio management, and target architecture definition. Introduction of agile methodologies for continuous architecture evolution and leadership and support to technical teams."
      },
      iconName: "Architecture"
    },
    {
      id: "s3",
      title: { ca: "Transformació cloud i d'aplicacions", es: "Transformación cloud y de aplicaciones", en: "Cloud & App Transformation" },
      description: {
        ca: "Modernització d'arquitectures, estratègies de migració i disseny d'aplicacions natives al núvol. Implementació de pràctiques DevOps i automatització per optimitzar el desenvolupament i les operacions.",
        es: "Modernización de arquitecturas, estrategias de migración y diseño de aplicaciones nativas en la nube. Implementación de prácticas DevOps y automatización para optimizar el desarrollo y las operaciones.",
        en: "Architecture modernization, migration strategies, and cloud-native application development. Implementation of DevOps practices and automation to optimize development and operations."
      },
      iconName: "Cloud"
    },
    {
      id: "s4",
      title: { ca: "Intel·ligència artificial i GenAI", es: "Inteligencia artificial y GenAI", en: "AI & GenAI" },
      description: {
        ca: "Integració d'IA en processos empresarials per millorar l'eficiència i la presa de decisions. Exploració de casos d'ús, desplegament d'agents intel·ligents i adopció d'IA Generativa.",
        es: "Integración de IA en procesos empresariales para mejorar la eficiencia y la toma de decisiones. Exploración de casos de uso, despliegue de agentes inteligentes y adopción de IA Generativa.",
        en: "Integration of AI into business processes to enhance efficiency and decision-making. Use case exploration, intelligent agent deployment, and Generative AI adoption."
      },
      iconName: "AI"
    }
  ] satisfies Array<{
    id: string;
    title: MultiLanguageString;
    description: MultiLanguageString;
    iconName: ServiceItem['iconName'];
  }>
};

export const CERTIFICATIONS_SECTION_DATA = {
  title: {
    ca: "Certificacions i tecnologies",
    es: "Certificaciones y tecnologías",
    en: "Certifications and Technologies"
  }
};

export const CONTACT_DATA = {
  title: { ca: "Connectem", es: "Conectemos", en: "Let's Connect" },
  subtitle: {
    ca: "Sempre obert a parlar sobre tecnologia, estratègia i innovació. No dubtis a contactar per compartir idees o explorar sinergies.",
    es: "Siempre abierto a hablar sobre tecnología, estrategia e innovación. No dudes en contactar para compartir ideas o explorar sinergias.",
    en: "Always open to discussing technology, strategy, and innovation. Feel free to reach out to share ideas or explore synergies."
  },
  location: { ca: "Barcelona, Espanya", es: "Barcelona, España", en: "Barcelona, Spain" },
  rights: { ca: "Tots els drets reservats.", es: "Todos los derechos reservados.", en: "All rights reserved." }
};
