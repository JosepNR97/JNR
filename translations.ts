import { TranslationStructure } from './types';
import { UNIVERSAL_DATA } from './constants';

export const translations: Record<'ca' | 'es' | 'en', TranslationStructure> = {
  ca: {
    nav: {
      about: "Sobre mi",
      services: "Serveis",
      education: "Formació",
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
      yearsLabel: "Anys d'experiència",
      projectsLabel: "Projectes executats"
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
          title: "Arquitectura empresarial",
          description: "Disseny de mapes de capacitats, gestió de portafoli d'aplicacions i definició d'arquitectures objectiu.",
          iconName: "Architecture"
        },
        {
          id: "s3",
          title: "Transformació cloud i aplicacions",
          description: "Modernització d'arquitectures, estratègies de migració (6R) i disseny d'aplicacions natives al núvol.",
          iconName: "Cloud"
        },
        {
          id: "s4",
          title: "Intel·ligència artificial i GenAI",
          description: "Exploració de casos d'ús, desplegament d'agents intel·ligents i adopció d'IA Generativa.",
          iconName: "AI"
        }
      ]
    },
    education: {
      badge: "Formació continuada",
      title: "Formació i certificacions",
      subtitle: "El compromís amb l'excel·lència tècnica requereix un aprenentatge constant i validació pels estàndards de la indústria.",
      items: [
        {
          id: "ed1",
          title: "Certificacions professionals",
          institution: "Estàndards de la indústria",
          description: "Acreditacions tècniques i metodològiques que validen el coneixement en arquitectura, agilitat i plataformes cloud.",
          items: [
            "The Open Group Certified: TOGAF 9",
            "Scaled Agile: SAFe 6 Agilist",
            "AWS Certified Cloud Practitioner",
            "Google Cloud Digital Leader",
            "Microsoft Certified: Azure Fundamentals",
            "Ardoq & LeanIX Certified"
          ]
        },
        {
          id: "ed2",
          title: "Formació acadèmica",
          institution: "Universitat i Postgrau",
          description: "Base acadèmica sòlida en enginyeria i gestió tecnològica.",
          items: [
            "Grau en Enginyeria Informàtica",
            "Màster en Gestió i Direcció de Sistemes TI"
          ]
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
            "2025: SECTOR PÚBLIC (TRANSPORT) - Evolución de arquitectura y sistemas: Análisis de las capacidades actuales a nivel de aplicaciones y tecnología como parte de un importante programa de Transformación Digital, con el objetivo de definir la arquitectura objetivo y formular un plan estratégico de transición, detallando iniciativas concretas para migrar hacia una plataforma tecnológica modernizada.",
            "2025: SECTOR PÚBLIC - Análisis de disposición para la toma de un sistema: Como parte de una Oficina Técnica, alineación estratégica de múltiples líneas de trabajo (Arquitectura de Solución, Interoperabilidad e Integración, DevOps, Seguridad, etc.) para llevar a cabo una evaluación de preparación para la asunción de un sistema crítico. El proyecto incluyó un análisis de riesgos sobre los servicios del proveedor actual, que concluyó con la creación d'un plan de mitigación integral, iniciativas de remediación y una hoja de ruta detallada para la implementación.",
            "2025: COMPANYIA D'ASSEGURANCES - Visión y análisis de arquitectura: Evaluación de las capacidades actuales de la función de arquitectura empresarial para analizar su grado de madurez y generación de principios directors per al futur de l'arquitectura de la companyia, acompanyada de la descripció d'iniciatives a executar per assolir els objectius proposats en termes de definició del marc d'arquitectura i evolució tecnològica."
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
            "2024~2025: ASSEGURADORA NACIONAL - Oficina de Transformación Cloud: Acompañamiento de los J2C de las distintas entidades internacionales de la compañía con el objetivo de estandarizar el proceso de adopción de la nube, analizar el parque de aplicaciones actual, definir arquetipos, aceleradores y trackers de migración, planificar las migraciones a alto nivel, definir el nuevo modelo operativo y crear una comunidad cloud en la empresa.",
            "2024: SECTOR PÚBLIC - Plan de Modernización de Sistemas: Evaluación del mapa de aplicaciones en base a criterios técnicos y revisión de arquitectura técnica para el posterior diseño del mapa de aplicaciones futuro, identificación de iniciativas y programas adicionales incluyendo automatización y activos de inteligencia artificial, culminant en la elaboración del plan per als següents 3 anys amb un conjunto de programes e iniciatives que donin resposta a les necessitats tecnològiques avaluades.",
            "2024: COMPANYIA DE MARKETPLACES DIGITALS - Análisis para Insourcing de EPSS: Análisis en profundidad de los datos, los procesos y la tecnología relacionados con el servicio de EPSS proporcionado por proveedor externo para comprender el servicio actual y originar la estrategia futura de internalización de dicho servicio.",
            "2022~2024: ENTITAT BANCÀRIA NACIONAL - Implantación de herramienta de PPM: Definición y operativización de procesos y metodologías de trabajo de las distintas organizaciones del cliente a través de implantaciones a medida en herramienta de PPM para funcionalidades como: gestión de proyectos y demanda, asignación de recursos, gestión de presupuesto, inclusión de nuevas organizaciones, etc."
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
            "2021~2022: SECTOR BANCARI - Gobierno de negocio: Desarrollo de proyectos de gobierno de negocio para el sector bancario."
          ]
        }
      ]
    },
    certifications: {
      title: "Certificacions i tecnologies"
    },
    caseStudies: {
      badge: "Casos d'Èxit",
      title: "Projectes amb Impacte",
      subtitle: "Resultats tangibles a través de l'estratègia i la tecnologia.",
      items: [
        {
          id: "cs1",
          title: "Modernització de Plataforma Bancària",
          client: "Banc Nacional Top 3",
          challengeTitle: "El Repte",
          challenge: "Sistemes 'legacy' monolítics que frenaven el time-to-market de nous productes financers.",
          approachTitle: "L'Enfocament",
          approach: "Disseny d'arquitectura orientada a esdeveniments i migració gradual al núvol.",
          resultsTitle: "Resultats",
          results: ["Reducció del 40% en costos d'infraestructura", "Desplegament de features en dies en lloc de mesos"],
          cta: "Veure detalls"
        }
      ]
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
      education: "Formación",
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
      yearsLabel: "Años de experiencia",
      projectsLabel: "Proyectos ejecutados"
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
          title: "Arquitectura empresarial",
          description: "Diseño de mapas de capacidades, gestión de portafolio de aplicaciones y definición de arquitecturas objetivo.",
          iconName: "Architecture"
        },
        {
          id: "s3",
          title: "Transformación cloud y aplicaciones",
          description: "Modernización de arquitecturas, estrategias de migración (6R) y diseño de aplicaciones nativas en la nube.",
          iconName: "Cloud"
        },
        {
          id: "s4",
          title: "Inteligencia artificial y GenAI",
          description: "Exploración de casos de uso, despliegue de agentes inteligentes y adopción de IA Generativa.",
          iconName: "AI"
        }
      ]
    },
    education: {
      badge: "Formación continua",
      title: "Formación y certificaciones",
      subtitle: "El compromiso con la excelencia técnica requiere un aprendizaje constante y validación por los estándares de la industria.",
      items: [
        {
          id: "ed1",
          title: "Certificaciones profesionales",
          institution: "Estándares de la industria",
          description: "Acreditaciones técnicas y metodológicas que validan el conocimiento en arquitectura, agilidad y plataformas cloud.",
          items: [
            "The Open Group Certified: TOGAF 9",
            "Scaled Agile: SAFe 6 Agilist",
            "AWS Certified Cloud Practitioner",
            "Google Cloud Digital Leader",
            "Microsoft Certified: Azure Fundamentals",
            "Ardoq & LeanIX Certified"
          ]
        },
        {
          id: "ed2",
          title: "Formación académica",
          institution: "Universidad y Postgrado",
          description: "Base académica sólida en ingeniería y gestión tecnológica.",
          items: [
            "Grado en Ingeniería Informática",
            "Máster en Gestión y Dirección de Sistemas TI"
          ]
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
            "2024: SECTOR PÚBLICO - Plan de Modernización de Sistemas: Evaluación del mapa de aplicaciones en base a criterios técnicos y revisión de arquitectura técnica para el posterior diseño del mapa de aplicaciones futuro, identificación de iniciativas y programas adicionales incluyendo automatización y activos de inteligencia artificial, culminant en la elaboración del plan para los siguientes 3 años con un conjunto de programas e iniciativas que den respuesta a las necesidades tecnológicas evaluadas.",
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
    caseStudies: {
      badge: "Casos de Éxito",
      title: "Proyectos con Impacto",
      subtitle: "Resultados tangibles a través de la estrategia y la tecnología.",
      items: [
        {
          id: "cs1",
          title: "Modernización de Plataforma Bancaria",
          client: "Banco Nacional Top 3",
          challengeTitle: "El Reto",
          challenge: "Sistemas 'legacy' monolíticos que frenaban el time-to-market de nuevos productos financieros.",
          approachTitle: "El Enfoque",
          approach: "Diseño de arquitectura orientada a eventos y migración gradual a la nube.",
          resultsTitle: "Resultados",
          results: ["Reducción del 40% en costes de infraestructura", "Despliegue de features en días en lugar de meses"],
          cta: "Ver detalles"
        }
      ]
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
      education: "Education",
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
      yearsLabel: "Years of Experience",
      projectsLabel: "Projects Executed"
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
          title: "Enterprise Architecture",
          description: "Capability map design, application portfolio management, and target architecture definition.",
          iconName: "Architecture"
        },
        {
          id: "s3",
          title: "Cloud & App Transformation",
          description: "Architecture modernization, migration strategies (6R), and cloud-native application development.",
          iconName: "Cloud"
        },
        {
          id: "s4",
          title: "AI & GenAI",
          description: "Use case exploration, intelligent agent deployment, and Generative AI adoption.",
          iconName: "AI"
        }
      ]
    },
    education: {
      badge: "Continuous Learning",
      title: "Education & Certifications",
      subtitle: "Commitment to technical excellence requires constant learning and validation by industry standards.",
      items: [
        {
          id: "ed1",
          title: "Professional Certifications",
          institution: "Industry Standards",
          description: "Technical and methodological accreditations validating knowledge in architecture, agility, and cloud platforms.",
          items: [
            "The Open Group Certified: TOGAF 9",
            "Scaled Agile: SAFe 6 Agilist",
            "AWS Certified Cloud Practitioner",
            "Google Cloud Digital Leader",
            "Microsoft Certified: Azure Fundamentals",
            "Ardoq & LeanIX Certified"
          ]
        },
        {
          id: "ed2",
          title: "Academic Background",
          institution: "University & Postgraduate",
          description: "Solid academic foundation in engineering and technology management.",
          items: [
            "Degree in Computer Engineering",
            "Master in IT Systems Management"
          ]
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
    caseStudies: {
      badge: "Success Stories",
      title: "Impactful Projects",
      subtitle: "Tangible results through strategy and technology.",
      items: [
        {
          id: "cs1",
          title: "Banking Platform Modernization",
          client: "Top 3 National Bank",
          challengeTitle: "The Challenge",
          challenge: "Monolithic legacy systems hindering time-to-market for new financial products.",
          approachTitle: "The Approach",
          approach: "Design of event-driven architecture and gradual migration to the cloud.",
          resultsTitle: "Results",
          results: ["40% reduction in infrastructure costs", "Feature deployment in days instead of months"],
          cta: "View details"
        }
      ]
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
