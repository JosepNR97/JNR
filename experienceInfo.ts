
import { IMAGES } from "./constants";
import { MultiLanguageString } from "./types";

interface StructuredAchievement {
  year: string; // Not multilanguage as numbers/ranges are usually universal, but string for "2024~2025"
  sector: MultiLanguageString;
  title: MultiLanguageString;
  description: MultiLanguageString;
}

interface StructuredExperienceItem {
  id: string;
  role: string; // English role titles are standard in resume, or we can make it MultiLanguageString
  company: string;
  period: MultiLanguageString;
  description: MultiLanguageString;
  logoUrl: string;
  achievements: StructuredAchievement[];
}

export const EXPERIENCE_DATA: StructuredExperienceItem[] = [
  {
    id: "1",
    role: "Technology Strategy & Transformation Senior Consultant",
    company: "NTT DATA Europe & Latam",
    period: {
      ca: "Gen. 2025 - Actualitat",
      es: "Ene. 2025 - Actualidad",
      en: "Jan. 2025 - Present"
    },
    description: {
      ca: "Consultoria estratègica enfocada en evolució d'arquitectura, anàlisi de sistemes crítics i definició de marcs d'arquitectura empresarial.",
      es: "Consultoría estratégica enfocada en evolución de arquitectura, análisis de sistemas críticos y definición de marcos de arquitectura empresarial.",
      en: "Strategic consulting focused on architecture evolution, critical systems analysis, and definition of enterprise architecture frameworks."
    },
    logoUrl: IMAGES.logos.ntt,
    achievements: [
      {
        year: "2025~2026",
        sector: {
          ca: "Companyia d'assegurances",
          es: "Compañía de seguros",
          en: "Insurance Company"
        },
        title: {
          ca: "Transformació i govern d'arquitectura",
          es: "Transformación y gobierno de arquitectura",
          en: "Architecture Transformation and Governance"
        },
        description: {
          ca: "Gestió de programa de transformació de plataforma tecnològica en els camps d'arquitectura event-driven, robustesa d'APIs, solució futura componible i capacitats agèntiques. Suport E2E al disseny proposat i a la implementació d'MVPs sobre diversos casos d'ús per a la validació funcional i tècnica de la solució.",
          es: "Gestión de programa de transformación de plataforma tecnológica en los campos de arquitectura event-driven, robustez de APIs, solución futura componible y capacidades agénticas. Apoyo E2E al diseño propuesto y a la implementación de MVPs sobre varios casos de uso para la validación funcional y técnica de la solución.",
          en: "Technological platform transformation program management in the fields of Event-Driven Architecture, API Robustness, Composable Future Solution and Agentic Capabilities. E2E support to the proposed design and implementation of MVPs on various use cases for the functional and technical validation of the solution."
        }
      },
      {
        year: "2025~2026",
        sector: {
          ca: "Sector públic (Espanya - Transport)",
          es: "Sector público (España - Transporte)",
          en: "Public Sector (Spain - Transport)"
        },
        title: {
          ca: "Evolució d'arquitectura i sistemes",
          es: "Evolución de arquitectura y sistemas",
          en: "Architecture and systems evolution"
        },
        description: {
          ca: "Anàlisi de les capacitats actuals a nivell d'aplicacions i tecnologia com a part d'un important programa de Transformació Digital, amb l'objectiu de definir l'arquitectura objectiu, aixecar els requisits funcionals, realitzar una avaluació de productes de mercat i formular un pla estratègic de transició, detallant iniciatives concretes per migrar cap a una plataforma tecnològica modernitzada.",
          es: "Análisis de las capacidades actuales a nivel de aplicaciones y tecnología como parte de un importante programa de Transformación Digital, con el objetivo de definir la arquitectura objetivo, levantar los requisitos funcionales, realizar una evaluación de productos de mercado y formular un plan estratégico de transición, detallando iniciativas concretas para migrar hacia una plataforma tecnológica modernizada.",
          en: "Analysis of current application and technology capabilities as part of a major Digital Transformation program, with the objective of defining the target architecture, gathering functional requirements, conducting a market product evaluation, and formulating a strategic transition plan detailing concrete initiatives to migrate towards a modernized technology platform."
        }
      },
      {
        year: "2025",
        sector: {
          ca: "Sector públic (Comunitat Europea)",
          es: "Sector público (Comunidad Europea)",
          en: "Public Sector (European Community)"
        },
        title: {
          ca: "Optimització de sistemes i avaluació de proveïdors",
          es: "Optimización de sistemas y evaluación de proveedores",
          en: "Systems optimization and vendor evaluation"
        },
        description: {
          ca: "Anàlisi de requisits funcionals i tècnics de sistema crític sota els prismes d'arquitectura de solució, seguretat, infraestructura i costos. Definició i implementació de marc d'avaluació de proveïdors en cerca de l'optimització del sistema complint els requisits aixecats i generació de full de ruta amb les iniciatives de millora i modernització.",
          es: "Análisis de requisitos funcionales y técnicos de sistema crítico bajo los prismas de arquitectura de solución, seguridad, infraestructura y costes. Definición e implementación de marco de evaluación de proveedores en busca de la optimización del sistema cumpliendo los requisitos levantados y generación de hoja de ruta con las iniciativas de mejora y modernización.",
          en: "Analysis of functional and technical requirements of critical systems under the prisms of solution architecture, security, infrastructure and costs. Definition and implementation of a vendor evaluation framework in search of the optimization of the system by meeting the requirements raised and generation of a roadmap with improvement and modernization initiatives."
        }
      },
      {
        year: "2025",
        sector: {
          ca: "Sector públic (Comunitat Europea)",
          es: "Sector público (Comunidad Europea)",
          en: "Public Sector (European Community)"
        },
        title: {
          ca: "Anàlisi de disposició per a la presa d'un sistema",
          es: "Análisis de disposición para la toma de un sistema",
          en: "System intake readiness analysis"
        },
        description: {
          ca: "Com a part d'una Oficina Tècnica, alineació estratègica de múltiples línies de treball (Arquitectura de Solució, Interoperabilitat e Integració, DevOps, Seguretat, etc.) per dur a terme una avaluació de preparació per a l'assumpció d'un sistema crític. El projecte va incloure un anàlisi de riscos sobre els serveis del proveïdor actual, que va concloure amb la creació d'un pla de mitigació integral, iniciatives de remediació i un full de ruta detallat per a la implementació.",
          es: "Como parte de una Oficina Técnica, alineación estratégica de múltiples líneas de trabajo (Arquitectura de Solución, Interoperabilidad e Integración, DevOps, Seguridad, etc.) para llevar a cabo una evaluación de preparación para la asunción de un sistema crítico. El proyecto incluyó un análisis de riesgos sobre los servicios del proveedor actual, que concluyó con la creación de un plan de mitigación integral, iniciativas de remediación y una hoja de ruta detallada para la implementación.",
          en: "As part of a Technical Office, strategic alignment of multiple workstreams (Solution Architecture, Interoperability and Integration, DevOps, Security, etc.) to conduct a readiness assessment for assuming a critical system. The project included a risk analysis on current provider services, concluding with the creation of a comprehensive mitigation plan, remediation initiatives, and a detailed implementation roadmap."
        }
      },
      {
        year: "2025",
        sector: {
          ca: "Companyia d'assegurances",
          es: "Compañía de seguros",
          en: "Insurance Company"
        },
        title: {
          ca: "Visió i anàlisi d'arquitectura",
          es: "Visión y análisis de arquitectura",
          en: "Architecture vision and analysis"
        },
        description: {
          ca: "Avaluació de les capacitats actuals de la funció d'arquitectura empresarial per analitzar el seu grau de maduresa i generació de principis directors per al futur de l'arquitectura de la companyia, acompanyada de la descripció d'iniciatives a executar per assolir els objectius proposats en termes de definició del marc d'arquitectura i evolució tecnològica.",
          es: "Evaluación de las capacidades actuales de la función de arquitectura empresarial para analizar su grado de madurez y generación de principios directores para el futuro de la arquitectura de la compañía, acompañada de la descripción de iniciativas a ejecutar para alcanzar los objetivos propuestos en términos de definición del marco de arquitectura y evolución tecnológica.",
          en: "Assessment of current enterprise architecture function capabilities to analyze maturity levels and generation of guiding principles for the company's future architecture, accompanied by a description of initiatives to execute to achieve proposed objectives in terms of architecture framework definition and technological evolution."
        }
      }
    ]
  },
  {
    id: "2",
    role: "Technology Strategy & Advisory Analyst",
    company: "Accenture España",
    period: {
      ca: "Set. 2022 - Gen. 2025",
      es: "Sept. 2022 - Ene. 2025",
      en: "Sept. 2022 - Jan. 2025"
    },
    description: {
      ca: "Consultoria de transformació cloud, modernització de sistemes i optimització de processos IT per a grans clients.",
      es: "Consultoría de transformación cloud, modernización de sistemas y optimización de procesos IT para grandes clientes.",
      en: "Cloud transformation consulting, systems modernization, and IT process optimization for large clients."
    },
    logoUrl: IMAGES.logos.accenture,
    achievements: [
      {
        year: "2024~2025",
        sector: {
          ca: "Companyia d'assegurances",
          es: "Compañía de seguros",
          en: "Insurance Company"
        },
        title: {
          ca: "Oficina de Transformació Cloud",
          es: "Oficina de Transformación Cloud",
          en: "Cloud Transformation Office"
        },
        description: {
          ca: "Acompanyament dels J2C de les diferents entitats internacionals de la companyia amb l'objectiu d'estandarditzar el procés d'adopció del núvol, analitzar el parc d'aplicacions actual, definir arquetips, acceleradors i trackers de migració, planificar les migracions a alt nivell, definir el nou model operatiu i crear una comunitat cloud a l'empresa.",
          es: "Acompañamiento de los J2C de las distintas entidades internacionales de la compañía con el objetivo de estandarizar el proceso de adopción de la nube, analizar el parque de aplicaciones actual, definir arquetipos, aceleradores y trackers de migración, planificar las migraciones a alto nivel, definir el nuevo modelo operativo y crear una comunidad cloud en la empresa.",
          en: "Accompanying J2C of various international entities of the company with the aim of standardizing the cloud adoption process, analyzing the current application landscape, defining archetypes, accelerators, and migration trackers, planning high-level migrations, defining the new operating model, and creating a cloud community within the company."
        }
      },
      {
        year: "2024",
        sector: {
          ca: "Sector públic (Espanya)",
          es: "Sector público (España)",
          en: "Public Sector (Spain)"
        },
        title: {
          ca: "Pla de Modernització de Sistemes",
          es: "Plan de Modernización de Sistemas",
          en: "Systems Modernization Plan"
        },
        description: {
          ca: "Avaluació del mapa d'aplicacions en base a criteris tècnics i revisió d'arquitectura tècnica per al posterior disseny del mapa d'aplicacions futur, identificació d'iniciatives i programes addicionals incloent automatització i actius d'intel·ligència artificial, culminant en l'elaboració del pla per als següents 3 anys amb un conjunt de programes i iniciatives que donin resposta a les necessitats tecnològiques avaluades.",
          es: "Evaluación del mapa de aplicaciones en base a criterios técnicos y revisión de arquitectura técnica para el posterior diseño del mapa de aplicaciones futuro, identificación de iniciativas y programas adicionales incluyendo automatización y activos de inteligencia artificial, culminando en la elaboración del plan para los siguientes 3 años con un conjunto de programas e iniciativas que den respuesta a las necesidades tecnológicas evaluadas.",
          en: "Evaluation of the application map based on technical criteria and technical architecture review for the subsequent design of the future application map, identification of additional initiatives and programs including automation and artificial intelligence assets, culminating in the development of a 3-year plan with a set of programs and initiatives responding to evaluated technological needs."
        }
      },
      {
        year: "2024",
        sector: {
          ca: "Companyia de marketplaces digitals",
          es: "Compañía de marketplaces digitales",
          en: "Digital Marketplace Company"
        },
        title: {
          ca: "Anàlisi per Insourcing de EPSS",
          es: "Análisis para Insourcing de EPSS",
          en: "EPSS Insourcing Analysis"
        },
        description: {
          ca: "Anàlisi en profunditat de les dades, els processos i la tecnologia relacionats amb el servei de EPSS proporcionat per proveïdor extern per comprendre el servei actual i originar l'estratègia futura d'internalització de dit servei.",
          es: "Análisis en profundidad de los datos, los procesos y la tecnología relacionados con el servicio de EPSS proporcionado por proveedor externo para comprender el servicio actual y originar la estrategia futura de internalización de dicho servicio.",
          en: "In-depth analysis of data, processes, and technology related to the EPSS service provided by an external vendor to understand the current service and originate the future strategy for insourcing said service."
        }
      },
      {
        year: "2022~2024",
        sector: {
          ca: "Entitat bancària",
          es: "Entidad bancaria",
          en: "Banking Entity"
        },
        title: {
          ca: "Implantació d'eina de PPM",
          es: "Implantación de herramienta de PPM",
          en: "PPM Tool Implementation"
        },
        description: {
          ca: "Definició i operativització de processos i metodologies de treball de les diferents organitzacions del client a través d'implantacions a mida en eina de PPM per a funcionalitats com: gestió de projectes i demanda, assignació de recursos, gestió de pressupost, inclusió de noves organitzacions, etc.",
          es: "Definición y operativización de procesos y metodologías de trabajo de las distintas organizaciones del cliente a través de implantaciones a medida en herramienta de PPM para funcionalidades como: gestión de proyectos y demanda, asignación de recursos, gestión de presupuesto, inclusión de nuevas organizaciones, etc.",
          en: "Definition and operationalization of processes and work methodologies of different client organizations through custom implementations in PPM tool for functionalities such as: project and demand management, resource allocation, budget management, inclusion of new organizations, etc."
        }
      }
    ]
  },
  {
    id: "3",
    role: "Technology Strategy & Advisory Intern",
    company: "Accenture España",
    period: {
      ca: "Abr. 2021 - Ago. 2022",
      es: "Abr. 2021 - Ago. 2022",
      en: "Apr. 2021 - Aug. 2022"
    },
    description: {
      ca: "Inici de carrera professional participant en projectes estratègics per al sector financer.",
      es: "Inicio de carrera profesional participando en proyectos estratégicos para el sector financiero.",
      en: "Start of professional career participating in strategic projects for the financial sector."
    },
    logoUrl: IMAGES.logos.accenture,
    achievements: [
      {
        year: "2021~2022",
        sector: {
          ca: "Entitat bancària",
          es: "Entidad bancaria",
          en: "Banking Entity"
        },
        title: {
          ca: "Govern de negoci",
          es: "Gobierno de negocio",
          en: "Business Governance"
        },
        description: {
          ca: "Desenvolupament de projectes de govern de negoci per al sector bancari.",
          es: "Desarrollo de proyectos de gobierno de negocio para el sector bancario.",
          en: "Development of business governance projects for the banking sector."
        }
      }
    ]
  }
];
