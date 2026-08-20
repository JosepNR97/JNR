
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
    role: "Technology Strategy & Transformation Manager",
    company: "NTT DATA Europe & Latam",
    period: {
      ca: "Jul. 2026 - Actualitat",
      es: "Jul. 2026 - Actualidad",
      en: "Jul. 2026 - Present"
    },
    description: {
      ca: "Direcció de projectes i equips i desenvolupament comercial en consultoria d'estratègia tecnològica, modernització i transformació digital.",
      es: "Dirección de proyectos y equipos y desarrollo comercial en consultoría de estrategia tecnológica, modernización y transformación digital.",
      en: "Project and team management and commercial development in technology strategy, modernization, and digital transformation consulting."
    },
    logoUrl: IMAGES.logos.ntt,
    achievements: [
      {
        year: "2026",
        sector: {
          ca: "Grup de companyies aèries",
          es: "Grupo de compañías aéreas",
          en: "Airline Companies Group"
        },
        title: {
          ca: "Anàlisi de sobirania de TI",
          es: "Análisis de soberanía de TI",
          en: "IT Sovereignty Assessment"
        },
        description: {
          ca: "Avaluació de la postura de sobirania de TI, analitzant aplicacions crítiques, plataformes cloud, proveïdors, contractes, dades i IA per identificar dependències, riscos de concentració i exposició jurisdiccional. Definició d'opcions inicials de mitigació, quick wins i recomanacions executives per prioritzar els següents passos i donar suport a la presa de decisions a nivell de direcció.",
          es: "Evaluación de la postura de soberanía de TI, analizando aplicaciones críticas, plataformas cloud, proveedores, contratos, datos e IA para identificar dependencias, riesgos de concentración y exposición jurisdiccional. Definición de opciones iniciales de mitigación, quick wins y recomendaciones ejecutivas para priorizar próximos pasos y apoyar la toma de decisiones a nivel de dirección.",
          en: "Assessment of the IT sovereignty posture, analyzing critical applications, cloud platforms, suppliers, contracts, data and AI to identify dependencies, concentration risks and jurisdictional exposure. Definition of initial mitigation options, quick wins and executive recommendations to prioritize next steps and support management decision-making."
        }
      },
      {
        year: "2026",
        sector: {
          ca: "Sector públic (Espanya - Transport)",
          es: "Sector público (España - Transporte)",
          en: "Public Sector (Spain - Transport)"
        },
        title: {
          ca: "Disseny de casos d'ús de transformació",
          es: "Diseño de casos de uso de transformación",
          en: "Transformation Use Case Design"
        },
        description: {
          ca: "Definició funcional i tècnica i planificació de casos d'ús prioritaris per a la transformació, cobrint disseny de models funcionals, regles de negoci, prototips i criteris d'acceptació, juntament amb el model E2E d'intercanvi d'informació i governança.",
          es: "Definición funcional y técnica y planificación de casos de uso prioritarios para la transformación, cubriendo diseño de modelos funcionales, reglas de negocio, prototipos y criterios de aceptación, junto con el modelo E2E de intercambio de información y gobierno.",
          en: "Functional and technical definition and planning of priority use cases for transformation, covering functional model design, business rules, prototypes, and acceptance criteria, along with the E2E information exchange and governance model."
        }
      },
      {
        year: "2026",
        sector: {
          ca: "Sector públic (Espanya - Transport)",
          es: "Sector público (España - Transporte)",
          en: "Public Sector (Spain - Transport)"
        },
        title: {
          ca: "Evolució de plataforma tecnològica d'explotació",
          es: "Evolución de plataforma tecnológica de explotación",
          en: "Evolution of Technology Platform for Operations"
        },
        description: {
          ca: "Extensió de les capacitats i requisits de la plataforma d'explotació, avaluant solucions de mercat mitjançant un benchmark detallat amb proveïdors, comparant escenaris d'evolució a mida, basats en producte o mixtos (i els seus models d'arquitectura) i definició del pla de programa per a la seva implantació, incloent iniciatives prioritzades, estimació econòmica, planificació temporal i dedicacions necessàries.",
          es: "Extensión de las capacidades y requisitos de la plataforma de explotación, evaluando soluciones de mercado mediante un benchmark detallado con proveedores, comparando escenarios de evolución a medida, basados en producto o mixtos (y sus modelos de arquitectura) y definición del plan de programa para su implantación, incluyendo iniciativas priorizadas, estimación económica, planificación temporal y dedicaciones necesarias.",
          en: "Extension of the capabilities and requirements of the operations platform, evaluating market solutions through a detailed benchmark with providers, comparing custom evolution scenarios, product-based or mixed (and their architecture models) and defining the program implementation plan, including prioritized initiatives, economic estimation, timeline planning and necessary allocations."
        }
      }
    ]
  },
  {
    id: "2",
    role: "Technology Strategy & Transformation Senior Consultant",
    company: "NTT DATA Europe & Latam",
    period: {
      ca: "Gen. 2025 - Jul. 2026",
      es: "Ene. 2025 - Jul. 2026",
      en: "Jan. 2025 - Jul. 2026"
    },
    description: {
      ca: "Consultoria estratègica enfocada en evolució d'arquitectura, anàlisi de sistemes crítics i definició de marcs d'arquitectura empresarial.",
      es: "Consultoría estratégica enfocada en evolución de arquitectura, análisis de sistemas críticos y definición de marcos de arquitectura empresarial.",
      en: "Strategic consulting focused on architecture evolution, critical systems analysis, and definition of enterprise architecture frameworks."
    },
    logoUrl: IMAGES.logos.ntt,
    achievements: [
      {
        year: "2026",
        sector: {
          ca: "Grup de serveis de vigilància i seguretat",
          es: "Grupo de servicios de vigilancia y seguridad",
          en: "Security Services Group"
        },
        title: {
          ca: "Anàlisi i disseny de modernització d'un sistema",
          es: "Análisis y diseño de modernización de un sistema",
          en: "Analysis and Design of System Modernization"
        },
        description: {
          ca: "Avaluació tècnica i de producte per analitzar la viabilitat d'escalar una plataforma interna de comunicació en un entorn multipaís, analitzant els dominis d'arquitectura, infraestructura i cloud, escalabilitat, resiliència, seguretat, CI/CD, observabilitat i model de proveïdor, i definint la visió futura, possibles llacunes, riscos i full de ruta prioritzat amb estimació d'esforç i cost per a la seva adopció.",
          es: "Evaluación técnica y de producto para analizar la viabilidad de escalar una plataforma interna de comunicación en un entorno multipaís, analizando los dominios de arquitectura, infraestructura y cloud, escalabilidad, resiliencia, seguridad, CI/CD, observabilidad y modelo de proveedor, y definiendo la visión futura, posibles brechas, riesgos y hoja de ruta priorizada con estimación de esfuerzo y coste para su adopción.",
          en: "Technical and product evaluation to analyze the feasibility of scaling an internal communication platform in a multi-country environment, analyzing the domains of architecture, infrastructure and cloud, scalability, resilience, security, CI/CD, observability and vendor model, and defining the future vision, possible gaps, risks and prioritized roadmap with effort and cost estimation for its adoption."
        }
      },
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
          en: "Architecture and Systems Evolution"
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
          en: "Systems Optimization and Vendor Evaluation"
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
          en: "System Intake Readiness Analysis"
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
          en: "Architecture Vision and Analysis"
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
    id: "3",
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
    id: "4",
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
