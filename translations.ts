import { TranslationStructure } from './types';
import { UNIVERSAL_DATA } from './constants';

export const translations: Record<'ca' | 'es' | 'en', TranslationStructure> = {
  ca: {
    nav: {
      about: "Sobre mi",
      services: "Serveis",
      work: "Casos d'èxit",
      testimonials: "Testimonis",
      experience: "Experiència",
      contact: "Contactar"
    },
    hero: {
      badge: "Estratègia • Tecnologia • Innovació",
      title: "Consultor d'estratègia tecnològica",
      tagline: "Impulsant l'eficiència operativa i el creixement a través de la transformació digital i la intel·ligència artificial.",
      connect: "Connectar a LinkedIn",
      portfolio: "Veure portafoli"
    },
    about: {
      title: "Sobre mi",
      p1: "Consultor d'estratègia tecnològica orientat a resultats amb més de 10 anys d'experiència especialitzant-me en transformació digital, intel·ligència artificial i ciberseguretat. Compto amb un historial provat alineant iniciatives tecnològiques complexes amb objectius de negoci crítics per millorar dràsticament l'eficiència operativa i accelerar el creixement dels ingressos.",
      p2: "Com a consultor independent, combino visió estratègica amb un profund coneixement tècnic. El meu enfocament es centra en desmitificar la tecnologia per a l'alta direcció, permetent decisions informades que impulsen el creixement.",
      p3: "He treballat amb startups en fase de creixement i grans corporacions, adaptant metodologies àgils i arquitectures modernes a les necessitats específiques de cada negoci.",
      years: "10+",
      yearsLabel: "Anys d'experiència",
      projects: "25+",
      projectsLabel: "Projectes liderats"
    },
    services: {
      title: "Àrees d'especialització",
      subtitle: "Solucions estratègiques dissenyades per tancar la bretxa entre els objectius comercials i les capacitats tecnològiques més avançades.",
      items: [
        {
          id: "s1",
          title: "Estratègia IT i govern",
          description: "Alineació de roadmap tecnològic amb KPIs de negoci i gestió d'inversions.",
          iconName: "Strategy"
        },
        {
          id: "s2",
          title: "Intel·ligència artificial",
          description: "Implementació d'IA i Machine Learning per a automatització i anàlisi predictiu.",
          iconName: "AI"
        },
        {
          id: "s3",
          title: "Ciberseguretat estratègica",
          description: "Disseny de marcs de seguretat resilients i gestió de riscos corporatius.",
          iconName: "Security"
        },
        {
          id: "s4",
          title: "Transformació cloud",
          description: "Modernització d'infraestructura per a màxima agilitat i optimització de costos.",
          iconName: "Cloud"
        }
      ]
    },
    caseStudies: {
      badge: "Portafoli selecte",
      title: "Casos d'èxit",
      subtitle: "Exemples reals de transformació estratègica i resultats quantificables en entorns complexos.",
      items: [
        {
          id: "cs1",
          title: "Transformació digital integral en retail global",
          client: "Cadena Multinacional de Moda (Confidencial)",
          challengeTitle: "El desafiament",
          challenge: "El client operava amb sistemes heretats desconnectats (silos), la qual cosa causava ineficiències en la cadena de subministrament i una experiència de client fragmentada.",
          approachTitle: "Enfocament estratègic",
          approach: "Vaig dissenyar i implementar una estratègia omnicanal basada en microserveis al núvol, integrant inventari en temps real i anàlisi de dades de clients.",
          resultsTitle: "Resultats clau",
          results: [
            "Millora del 40% en l'eficiència de la cadena de subministrament.",
            "Augment del 22% en les vendes online gràcies a la personalització.",
            "Reducció del 30% en costos de manteniment de TI."
          ],
          cta: "Sol·licitar detalls complets"
        },
        {
          id: "cs2",
          title: "Optimització operativa mitjançant IA en fintech",
          client: "Plataforma de Pagaments Digitals",
          challengeTitle: "El desafiament",
          challenge: "El ràpid creixement d'usuaris va saturar el suport al client i va augmentar els falsos positius en la detecció de fraus, frenant l'expansió.",
          approachTitle: "Enfocament estratègic",
          approach: "Vaig liderar l'adopció de models d'IA per a la detecció predictiva de fraus i vaig desplegar assistents virtuals avançats (NLP) per a atenció al client.",
          resultsTitle: "Resultats clau",
          results: [
            "Reducció del 95% en temps de resposta de suport (Nivell 1).",
            "Disminució del 60% en pèrdues per frau transaccional.",
            "Creixement d'ingressos del 15% en recuperar transaccions legítimes."
          ],
          cta: "Sol·licitar detalls complets"
        }
      ]
    },
    testimonials: {
      title: "El que diuen els meus clients",
      subtitle: "L'impacte real es mesura en la satisfacció del client i els resultats tangibles del negoci.",
      items: [
        {
          id: "t1",
          quote: "La claredat estratègica del Josep i la seva visió de futur van transformar la nostra infraestructura heretada en una avantatge competitiu modern i àgil.",
          author: "Carlos M.",
          role: "CEO, Sector Retail"
        },
        {
          id: "t2",
          quote: "La seva capacitat per executar implementacions complexes d'IA i automatització sense interrompre les nostres operacions crítiques diàries va ser impressionant.",
          author: "Laura G.",
          role: "Directora de TI, Finances"
        },
        {
          id: "t3",
          quote: "El Josep no només va implementar nova tecnologia, sinó que va instaurar una cultura d'eficiència que va impactar positivament en la nostra rendibilitat des del primer trimestre.",
          author: "Marc R.",
          role: "Líder de Projecte, Logística"
        }
      ]
    },
    experience: {
      title: "Trajectòria professional",
      subtitle: "Fes clic a les targetes per explorar el detall dels projectes.",
      detailTitle: "Detall de projectes",
      expand: "Veure projectes destacats",
      collapse: "Ocultar detalls",
      items: [
        {
          id: "1",
          role: "Technology Strategy & Transformation Senior Consultant",
          company: "NTT DATA Europe & Latam",
          period: "Gen. 2025 - Actualitat",
          description: "Consultoria estratègica enfocada en evolució d'arquitectura, anàlisi de sistemes crítics i definició de marcs d'arquitectura empresarial.",
          logoUrl: UNIVERSAL_DATA.logos.ntt,
          achievements: [
            "2025: SECTOR PÚBLIC (TRANSPORT) - Evolució d'arquitectura i sistemes: Anàlisi de les capacitats actuals a nivell d'aplicacions i tecnologia com a part d'un important programa de Transformació Digital, amb l'objectiu de definir l'arquitectura objectiu i formular un pla estratègic de transició, detallant iniciatives concretes per migrar cap a una plataforma tecnològica modernitzada.",
            "2025: SECTOR PÚBLIC - Anàlisi de disposició per a la presa d'un sistema: Com a part d'una Oficina Tècnica, alineació estratègica de múltiples línies de treball (Arquitectura de Solució, Interoperabilitat i Integració, DevOps, Seguretat, etc.) per dur a terme una avaluació de preparació per a l'assumpció d'un sistema crític. El projecte va incloure una anàlisi de riscos sobre els serveis del proveïdor actual, que va concloure amb la creació d'un pla de mitigació integral, iniciatives de remediació i un full de ruta detallat per a la implementació.",
            "2025: COMPANYIA D'ASSEGURANCES - Visió i anàlisi d'arquitectura: Avaluació de les capacitats actuals de la funció d'arquitectura empresarial per analitzar el seu grau de maduresa i generació de principis directors per al futur de l'arquitectura de la companyia, acompanyada de la descripció d'iniciatives a executar per assolir els objectius proposats en termes de definició del marc d'arquitectura i evolució tecnològica."
          ]
        },
        {
          id: "2",
          role: "Technology Strategy & Advisory Analyst",
          company: "Accenture España",
          period: "Set. 2022 - Gen. 2025",
          description: "Consultoria de transformació cloud, modernització de sistemes i optimització de processos IT per a grans clients.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2024~2025: ASSEGURADORA NACIONAL - Oficina de Transformació Cloud: Acompanyament dels J2C de les distintes entitats internacionals de la companyia amb l'objectiu d'estandarditzar el procés d'adopció del núvol, analitzar el parc d'aplicacions actual, definir arquetips, acceleradors i trackers de migració, planificar les migracions a alt nivell, definir el nou model operatiu i crear una comunitat cloud a l'empresa.",
            "2024: SECTOR PÚBLIC - Pla de Modernització de Sistemes: Avaluació del mapa d'aplicacions en base a criteris tècnics i revisió d'arquitectura tècnica per al posterior disseny del mapa d'aplicacions futur, identificació d'iniciatives i programes addicionals incloent automatització i actius d'intel·ligència artificial, culminant en l'elaboració del pla per als següents 3 anys amb un conjunt de programes e iniciatives que donin resposta a les necessitats tecnològiques avaluades.",
            "2024: COMPANYIA DE MARKETPLACES DIGITALS - Anàlisi per Insourcing de EPSS: Anàlisi en profunditat de les dades, els processos i la tecnologia relacionats amb el servei de EPSS proporcionat per proveïdor extern per comprendre el servei actual i originar l'estratègia futura d'internalització de l'esmentat servei.",
            "2022~2024: ENTITAT BANCÀRIA NACIONAL - Implantació d'eina de PPM: Definició i operativització de processos i metodologies de treball de les distintes organitzacions del client a través d'implantacions a mida en eina de PPM per a funcionalitats com: gestió de projectes i demanda, assignació de recursos, gestió de pressupost, inclusió de noves organitzacions, etc."
          ]
        },
        {
          id: "3",
          role: "Technology Strategy & Advisory Intern",
          company: "Accenture España",
          period: "Abr. 2021 - Ago. 2022",
          description: "Inici de carrera professional participant en projectes estratègics per al sector financer.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2021~2022: SECTOR BANCARI - Govern de negoci: Desenvolupament de projectes de govern de negoci per al sector bancari."
          ]
        }
      ]
    },
    certifications: {
      title: "Certificacions i tecnologies"
    },
    contact: {
      title: "Parlem del teu proper desafiament",
      subtitle: "Estic sempre interessat en escoltar sobre nous projectes i oportunitats de col·laboració.",
      availabilityTitle: "Disponibilitat",
      availabilityText1: "Actualment estic acceptant nous projectes de consultoria estratègica i transformació digital.",
      availabilityText2: "No dubtis en contactar-me directament per correu electrònic o LinkedIn per agendar una breu conversa introductòria.",
      rights: "Tots els drets reservats."
    }
  },
  es: {
    nav: {
      about: "Sobre mí",
      services: "Servicios",
      work: "Casos de éxito",
      testimonials: "Testimonios",
      experience: "Experiencia",
      contact: "Contactar"
    },
    hero: {
      badge: "Estrategia • Tecnología • Innovación",
      title: "Consultor de estrategia tecnológica",
      tagline: "Impulsando la eficiencia operativa y el crecimiento a través de la transformación digital y la inteligencia artificial.",
      connect: "Conectar en LinkedIn",
      portfolio: "Ver portafolio"
    },
    about: {
      title: "Sobre mí",
      p1: "Consultor de estrategia tecnológica orientado a resultados con más de 10 años de experiencia especializándome en transformación digital, inteligencia artificial y ciberseguridad. Cuento con un historial probado alineando iniciativas tecnológicas complejas con objetivos de negocio críticos para mejorar drásticamente la eficiencia operativa y acelerar el crecimiento de los ingresos.",
      p2: "Como consultor independiente, combino visión estratégica con un profundo conocimiento técnico. Mi enfoque se centra en desmitificar la tecnología para la alta dirección, permitiendo decisiones informadas que impulsan el crecimiento.",
      p3: "He trabajado con startups en fase de crecimiento y grandes corporaciones, adaptando metodologías ágiles y arquitecturas modernas a las necesidades específicas de cada negocio.",
      years: "10+",
      yearsLabel: "Años de experiencia",
      projects: "25+",
      projectsLabel: "Proyectos liderados"
    },
    services: {
      title: "Áreas de especialización",
      subtitle: "Soluciones estratégicas diseñadas para cerrar la brecha entre los objetivos comerciales y las capacidades tecnológicas más avanzadas.",
      items: [
        {
          id: "s1",
          title: "Estrategia IT y gobierno",
          description: "Alineación de roadmap tecnológico con KPIs de negocio y gestión de inversiones.",
          iconName: "Strategy"
        },
        {
          id: "s2",
          title: "Inteligencia artificial",
          description: "Implementación de IA y Machine Learning para automatización y análisis predictivo.",
          iconName: "AI"
        },
        {
          id: "s3",
          title: "Ciberseguridad estratégica",
          description: "Diseño de marcos de seguridad resilientes y gestión de riesgos corporativos.",
          iconName: "Security"
        },
        {
          id: "s4",
          title: "Transformación cloud",
          description: "Modernización de infraestructura para máxima agilidad y optimización de costes.",
          iconName: "Cloud"
        }
      ]
    },
    caseStudies: {
      badge: "Portafolio selecto",
      title: "Casos de éxito",
      subtitle: "Ejemplos reales de transformación estratégica y resultados cuantificables en entornos complejos.",
      items: [
        {
          id: "cs1",
          title: "Transformación digital integral en retail global",
          client: "Cadena Multinacional de Moda (Confidencial)",
          challengeTitle: "El desafío",
          challenge: "El cliente operaba con sistemas heredados desconectados (silos), lo que causaba ineficiencias en la cadena de suministro y una experiencia de cliente fragmentada.",
          approachTitle: "Enfoque estratégico",
          approach: "Diseñé e implementé una estrategia omnicanal basada en microservicios en la nube, integrando inventario en tiempo real y análisis de datos de clientes.",
          resultsTitle: "Resultados clave",
          results: [
            "Mejora del 40% en la eficiencia de la cadena de suministro.",
            "Aumento del 22% en las ventas online gracias a la personalización.",
            "Reducción del 30% en costes de mantenimiento de TI."
          ],
          cta: "Solicitar detalles completos"
        },
        {
          id: "cs2",
          title: "Optimización operativa mediante IA en fintech",
          client: "Plataforma de Pagos Digitales",
          challengeTitle: "El desafío",
          challenge: "El rápido crecimiento de usuarios saturó el soporte al cliente y aumentó los falsos positivos en la detección de fraudes, frenando la expansión.",
          approachTitle: "Enfoque estratégico",
          approach: "Lideré la adopción de modelos de IA para la detección predictiva de fraudes y desplegué asistentes virtuales avanzados (NLP) para atención al cliente.",
          resultsTitle: "Resultados clave",
          results: [
            "Reducción del 95% en tiempos de respuesta de soporte (Nivel 1).",
            "Disminución del 60% en pérdidas por fraude transaccional.",
            "Crecimiento de ingresos del 15% al recuperar transacciones legítimas."
          ],
          cta: "Solicitar detalles completos"
        }
      ]
    },
    testimonials: {
      title: "Lo que dicen mis clientes",
      subtitle: "El impacto real se mide en la satisfacción del cliente y los resultados tangibles del negocio.",
      items: [
        {
          id: "t1",
          quote: "La claridad estratégica de Josep y su visión de futuro transformaron nuestra infraestructura heredada en una ventaja competitiva moderna y ágil.",
          author: "Carlos M.",
          role: "CEO, Sector Retail"
        },
        {
          id: "t2",
          quote: "Su capacidad para ejecutar implementaciones complejas de IA y automatización sin interrumpir nuestras operaciones críticas diarias fue impresionante.",
          author: "Laura G.",
          role: "Directora de TI, Finanzas"
        },
        {
          id: "t3",
          quote: "Josep no solo implementó nueva tecnología, sino que instauró una cultura de eficiencia que impactó positivamente en nuestra rentabilidad desde el primer trimestre.",
          author: "Marc R.",
          role: "Líder de Proyecto, Logística"
        }
      ]
    },
    experience: {
      title: "Trayectoria profesional",
      subtitle: "Haz clic en las tarjetas para explorar el detalle de los proyectos.",
      detailTitle: "Detalle de proyectos",
      expand: "Ver proyectos destacados",
      collapse: "Ocultar detalles",
      items: [
        {
          id: "1",
          role: "Technology Strategy & Transformation Senior Consultant",
          company: "NTT DATA Europe & Latam",
          period: "Ene. 2025 - Actualidad",
          description: "Consultoría estratégica enfocada en evolución de arquitectura, análisis de sistemas críticos y definición de marcos de arquitectura empresarial.",
          logoUrl: UNIVERSAL_DATA.logos.ntt,
          achievements: [
            "2025: SECTOR PÚBLICO (TRANSPORTE) - Evolución de arquitectura y sistemas: Análisis de las capacidades actuales a nivel de aplicaciones y tecnología como parte de un importante programa de Transformación Digital, con el objetivo de definir la arquitectura objetivo y formular un plan estratégico de transición, detallando iniciativas concretas para migrar hacia una plataforma tecnológica modernizada.",
            "2025: SECTOR PÚBLICO - Análisis de disposición para la toma de un sistema: Como parte de una Oficina Técnica, alineación estratégica de múltiples líneas de trabajo (Arquitectura de Solución, Interoperabilidad e Integración, DevOps, Seguridad, etc.) para llevar a cabo una evaluación de preparación para la asunción de un sistema crítico. El proyecto incluyó un análisis de riesgos sobre los servicios del proveedor actual, que concluyó con la creación d'un plan de mitigación integral, iniciativas de remediación y una hoja de ruta detallada para la implementación.",
            "2025: COMPAÑÍA DE SEGUROS - Visión y análisis de arquitectura: Evaluación de las capacidades actuales de la función de arquitectura empresarial para analizar su grado de madurez y generación de principios directores para el futuro de la arquitectura de la compañía, acompañada de la descripción de iniciativas a ejecutar para alcanzar los objetivos propuestos en términos de definición del marco de arquitectura y evolución tecnológica."
          ]
        },
        {
          id: "2",
          role: "Technology Strategy & Advisory Analyst",
          company: "Accenture España",
          period: "Sept. 2022 - Ene. 2025",
          description: "Consultoría de transformación cloud, modernización de sistemas y optimización de procesos IT para grandes clientes.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2024~2025: ASEGURADORA NACIONAL - Oficina de Transformación Cloud: Acompañamiento de los J2C de las distintas entidades internacionales de la compañía con el objetivo de estandarizar el proceso de adopción de la nube, analizar el parque de aplicaciones actual, definir arquetipos, aceleradores y trackers de migración, planificar las migraciones a alto nivel, definir el nuevo modelo operativo y crear una comunidad cloud en la empresa.",
            "2024: SECTOR PÚBLICO - Plan de Modernización de Sistemas: Evaluación del mapa de aplicaciones en base a criterios técnicos y revisión de arquitectura técnica para el posterior diseño del mapa de aplicaciones futuro, identificación de iniciativas y programas adicionales incluyendo automatización y activos de inteligencia artificial, culminando en la elaboración del plan para los siguientes 3 años con un conjunto de programas e iniciativas que den respuesta a las necesidades tecnológicas evaluadas.",
            "2024: COMPAÑÍA DE MARKETPLACES DIGITALES - Análisis para Insourcing de EPSS: Análisis en profundidad de los datos, los procesos y la tecnología relacionados con el servicio de EPSS proporcionado por proveedor externo para comprender el servicio actual y originar la estrategia futura de internalización del servicio.",
            "2022~2024: ENTIDAD BANCARIA NACIONAL - Implantación de herramienta de PPM: Definición y operativización de procesos y metodologías de trabajo de las distintas organizaciones del cliente a través de implantaciones a medida en herramienta de PPM para funcionalidades como: gestión de proyectos y demanda, asignación de recursos, gestión de presupuesto, inclusión de nuevas organizaciones, etc."
          ]
        },
        {
          id: "3",
          role: "Technology Strategy & Advisory Intern",
          company: "Accenture España",
          period: "Abr. 2021 - Ago. 2022",
          description: "Inicio de carrera profesional participando en proyectos estratégicos para el sector financiero.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2021~2022: SECTOR BANCARIO - Gobierno de negocio: Desarrollo de proyectos de gobierno de negocio para el sector bancario."
          ]
        }
      ]
    },
    certifications: {
      title: "Certificaciones y tecnologías"
    },
    contact: {
      title: "Hablemos de tu próximo desafío",
      subtitle: "Estoy siempre interesado en escuchar sobre nuevos proyectos y oportunidades de colaboración.",
      availabilityTitle: "Disponibilidad",
      availabilityText1: "Actualmente estoy aceptando nuevos proyectos de consultoría estratégica y transformación digital.",
      availabilityText2: "No dudes en contactarme directamente por correo electrónico o LinkedIn para agendar una breve conversación introductoria.",
      rights: "Todos los derechos reservados."
    }
  },
  en: {
    nav: {
      about: "About me",
      services: "Services",
      work: "Success Stories",
      testimonials: "Testimonials",
      experience: "Experience",
      contact: "Contact"
    },
    hero: {
      badge: "Strategy • Technology • Innovation",
      title: "Technology Strategy Consultant",
      tagline: "Driving operational efficiency and growth through digital transformation and artificial intelligence.",
      connect: "Connect on LinkedIn",
      portfolio: "View Portfolio"
    },
    about: {
      title: "About me",
      p1: "Results-oriented Technology Strategy Consultant with over 10 years of experience specializing in digital transformation, artificial intelligence, and cybersecurity. I have a proven track record of aligning complex technology initiatives with critical business goals to dramatically improve operational efficiency and accelerate revenue growth.",
      p2: "As an independent consultant, I combine strategic vision with deep technical knowledge. My focus is on demystifying technology for senior management, enabling informed decisions that drive growth.",
      p3: "I have worked with growing startups and large corporations, adapting agile methodologies and modern architectures to the specific needs of each business.",
      years: "10+",
      yearsLabel: "Years of Experience",
      projects: "25+",
      projectsLabel: "Projects Led"
    },
    services: {
      title: "Areas of Expertise",
      subtitle: "Strategic solutions designed to bridge the gap between business goals and the most advanced technological capabilities.",
      items: [
        {
          id: "s1",
          title: "IT Strategy & Governance",
          description: "Aligning technology roadmap with business KPIs and investment management.",
          iconName: "Strategy"
        },
        {
          id: "s2",
          title: "Artificial Intelligence",
          description: "Implementation of AI and Machine Learning for automation and predictive analytics.",
          iconName: "AI"
        },
        {
          id: "s3",
          title: "Strategic Cybersecurity",
          description: "Design of resilient security frameworks and corporate risk management.",
          iconName: "Security"
        },
        {
          id: "s4",
          title: "Cloud Transformation",
          description: "Infrastructure modernization for maximum agility and cost optimization.",
          iconName: "Cloud"
        }
      ]
    },
    caseStudies: {
      badge: "Select Portfolio",
      title: "Success Stories",
      subtitle: "Real examples of strategic transformation and quantifiable results in complex environments.",
      items: [
        {
          id: "cs1",
          title: "Comprehensive Digital Transformation in Global Retail",
          client: "Multinational Fashion Chain (Confidential)",
          challengeTitle: "The Challenge",
          challenge: "The client operated with disconnected legacy systems (silos), causing supply chain inefficiencies and a fragmented customer experience.",
          approachTitle: "Strategic Approach",
          approach: "Designed and implemented an omnichannel strategy based on cloud microservices, integrating real-time inventory and customer data analytics.",
          resultsTitle: "Key Results",
          results: [
            "40% improvement in supply chain efficiency.",
            "22% increase in online sales thanks to personalization.",
            "30% reduction in IT maintenance costs."
          ],
          cta: "Request full details"
        },
        {
          id: "cs2",
          title: "Operational Optimization via AI in Fintech",
          client: "Digital Payments Platform",
          challengeTitle: "The Challenge",
          challenge: "Rapid user growth saturated customer support and increased false positives in fraud detection, stalling expansion.",
          approachTitle: "Strategic Approach",
          approach: "Led the adoption of AI models for predictive fraud detection and deployed advanced virtual assistants (NLP) for customer support.",
          resultsTitle: "Key Results",
          results: [
            "95% reduction in support response times (Level 1).",
            "60% decrease in transactional fraud losses.",
            "15% revenue growth by recovering legitimate transactions."
          ],
          cta: "Request full details"
        }
      ]
    },
    testimonials: {
      title: "What My Clients Say",
      subtitle: "Real impact is measured in customer satisfaction and tangible business results.",
      items: [
        {
          id: "t1",
          quote: "Josep's strategic clarity and vision for the future transformed our legacy infrastructure into a modern and agile competitive advantage.",
          author: "Carlos M.",
          role: "CEO, Retail Sector"
        },
        {
          id: "t2",
          quote: "His ability to execute complex AI and automation implementations without disrupting our critical daily operations was impressive.",
          author: "Laura G.",
          role: "IT Director, Finance"
        },
        {
          id: "t3",
          quote: "Josep not only implemented new technology but also instilled a culture of efficiency that positively impacted our profitability from the first quarter.",
          author: "Marc R.",
          role: "Project Leader, Logistics"
        }
      ]
    },
    experience: {
      title: "Professional Experience",
      subtitle: "Click on the cards to explore project details.",
      detailTitle: "Project Details",
      expand: "View featured projects",
      collapse: "Hide details",
      items: [
        {
          id: "1",
          role: "Technology Strategy & Transformation Senior Consultant",
          company: "NTT DATA Europe & Latam",
          period: "Jan. 2025 - Present",
          description: "Strategic consulting focused on architecture evolution, critical systems analysis, and definition of enterprise architecture frameworks.",
          logoUrl: UNIVERSAL_DATA.logos.ntt,
          achievements: [
            "2025: PUBLIC SECTOR (TRANSPORT) - Architecture and systems evolution: Analysis of current capabilities at the application and technology level as part of a major Digital Transformation program, aiming to define the target architecture and formulate a strategic transition plan, detailing concrete initiatives to migrate towards a modernized technological platform.",
            "2025: PUBLIC SECTOR - System intake readiness analysis: As part of a Technical Office, strategic alignment of multiple workstreams (Solution Architecture, Interoperability and Integration, DevOps, Security, etc.) to conduct a readiness assessment for assuming a critical system. The project included a risk analysis on current provider services, concluding with the creation of a comprehensive mitigation plan, remediation initiatives, and a detailed implementation roadmap.",
            "2025: INSURANCE COMPANY - Architecture vision and analysis: Assessment of current enterprise architecture function capabilities to analyze maturity levels and generation of guiding principles for the company's future architecture, accompanied by a description of initiatives to execute to achieve proposed objectives in terms of architecture framework definition and technological evolution."
          ]
        },
        {
          id: "2",
          role: "Technology Strategy & Advisory Analyst",
          company: "Accenture Spain",
          period: "Sept. 2022 - Jan. 2025",
          description: "Cloud transformation consulting, systems modernization, and IT process optimization for large clients.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2024~2025: NATIONAL INSURER - Cloud Transformation Office: Accompanying J2C of various international entities of the company with the aim of standardizing the cloud adoption process, analyzing the current application landscape, defining archetypes, accelerators, and migration trackers, planning high-level migrations, defining the new operating model, and creating a cloud community within the company.",
            "2024: PUBLIC SECTOR - Systems Modernization Plan: Evaluation of the application map based on technical criteria and technical architecture review for the subsequent design of the future application map, identification of additional initiatives and programs including automation and artificial intelligence assets, culminating in the development of a 3-year plan with a set of programs and initiatives responding to evaluated technological needs.",
            "2024: DIGITAL MARKETPLACE COMPANY - EPSS Insourcing Analysis: In-depth analysis of data, processes, and technology related to the EPSS service provided by an external vendor to understand the current service and originate the future strategy for insourcing said service.",
            "2022~2024: NATIONAL BANKING ENTITY - PPM Tool Implementation: Definition and operationalization of processes and work methodologies of different client organizations through custom implementations in PPM tool for functionalities such as: project and demand management, resource allocation, budget management, inclusion of new organizations, etc."
          ]
        },
        {
          id: "3",
          role: "Technology Strategy & Advisory Intern",
          company: "Accenture Spain",
          period: "Apr. 2021 - Aug. 2022",
          description: "Start of professional career participating in strategic projects for the financial sector.",
          logoUrl: UNIVERSAL_DATA.logos.accenture,
          achievements: [
            "2021~2022: BANKING SECTOR - Business Governance: Development of business governance projects for the banking sector."
          ]
        }
      ]
    },
    certifications: {
      title: "Certifications and Technologies"
    },
    contact: {
      title: "Let's talk about your next challenge",
      subtitle: "I am always interested in hearing about new projects and collaboration opportunities.",
      availabilityTitle: "Availability",
      availabilityText1: "I am currently accepting new strategic consulting and digital transformation projects.",
      availabilityText2: "Feel free to contact me directly via email or LinkedIn to schedule a brief introductory conversation.",
      rights: "All rights reserved."
    }
  }
};
