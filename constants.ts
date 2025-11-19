import { ExperienceItem, ProfileData, ServiceItem, TestimonialItem, CaseStudyItem } from './types';

export const PROFILE: ProfileData = {
  name: "Josep Núñez Riba",
  title: "Consultor de estrategia tecnológica",
  tagline: "Impulsando la eficiencia operativa y el crecimiento a través de la transformación digital y la inteligencia artificial.",
  about: "Consultor de estrategia tecnológica orientado a resultados con más de 10 años de experiencia especializándome en transformación digital, inteligencia artificial y ciberseguridad. Cuento con un historial probado alineando iniciativas tecnológicas complejas con objetivos de negocio críticos para mejorar drásticamente la eficiencia operativa y acelerar el crecimiento de los ingresos.",
  linkedinUrl: "https://www.linkedin.com/in/josep-nunez-riba",
  email: "contacto@josepnunez.com", 
  location: "Barcelona, España" 
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "1",
    role: "Technology Strategy & Transformation Senior Consultant",
    company: "NTT DATA Europe & Latam",
    period: "Ene. 2025 - Actualidad",
    description: "Consultoría estratégica enfocada en evolución de arquitectura, análisis de sistemas críticos y definición de marcos de arquitectura empresarial.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_Global_NTT_DATA_Future_Blue_RGB.png",
    achievements: [
      "2025: Sector público (Transporte) - Evolución de arquitectura y sistemas: Análisis de las capacidades actuales a nivel de aplicaciones y tecnología como parte de un importante programa de Transformación Digital, con el objetivo de definir la arquitectura objetivo y formular un plan estratégico de transición, detallando iniciativas concretas para migrar hacia una plataforma tecnológica modernizada.",
      "2025: Sector público - Análisis de disposición para la toma de un sistema: Como parte de una Oficina Técnica, alineación estratégica de múltiples líneas de trabajo (Arquitectura de Solución, Interoperabilidad e Integración, DevOps, Seguridad, etc.) para llevar a cabo una evaluación de preparación para la asunción de un sistema crítico. El proyecto incluyó un análisis de riesgos sobre los servicios del proveedor actual, que concluyó con la creación de un plan de mitigación integral, iniciativas de remediación y una hoja de ruta detallada para la implementación.",
      "2025: Compañía de seguros - Visión y análisis de arquitectura: Evaluación de las capacidades actuales de la función de arquitectura empresarial para analizar su grado de madurez y generación de principios directores para el futuro de la arquitectura de la compañía, acompañada de la descripción de iniciativas a ejecutar para alcanzar los objetivos propuestos en términos de definición del marco de arquitectura y evolución tecnológica."
    ]
  },
  {
    id: "2",
    role: "Technology Strategy & Advisory Analyst",
    company: "Accenture España",
    period: "Sept. 2022 - Ene. 2025",
    description: "Consultoría de transformación cloud, modernización de sistemas y optimización de procesos IT para grandes clientes.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
    achievements: [
      "2024~2025: Aseguradora nacional - Oficina de Transformación Cloud: Acompañamiento de los J2C de las distintas entidades internacionales de la compañía con el objetivo de estandarizar el proceso de adopción de la nube, analizar el parque de aplicaciones actual, definir arquetipos, aceleradores y trackers de migración, planificar las migraciones a alto nivel, definir el nuevo modelo operativo y crear una comunidad cloud en la empresa.",
      "2024: Sector público - Plan de Modernización de Sistemas: Evaluación del mapa de aplicaciones en base a criterios técnicos y revisión de arquitectura técnica para el posterior diseño del mapa de aplicaciones futuro, identificación de iniciativas y programas adicionales incluyendo automatización y activos de inteligencia artificial, culminando en la elaboración del plan para los siguientes 3 años con un conjunto de programas e iniciativas que den respuesta a las necesidades tecnológicas evaluadas.",
      "2024: Compañía de marketplaces digitales - Análisis para Insourcing de EPSS: Análisis en profundidad de los datos, los procesos y la tecnología relacionados con el servicio de EPSS proporcionado por proveedor externo para comprender el servicio actual y originar la estrategia futura de internalización del servicio.",
      "2022~2024: Entidad bancaria nacional - Implantación de herramienta de PPM: Definición y operativización de procesos y metodologías de trabajo de las distintas organizaciones del cliente a través de implantaciones a medida en herramienta de PPM para funcionalidades como: gestión de proyectos y demanda, asignación de recursos, gestión de presupuesto, inclusión de nuevas organizaciones, etc."
    ]
  },
  {
    id: "3",
    role: "Technology Strategy & Advisory Intern",
    company: "Accenture España",
    period: "Abr. 2021 - Ago. 2022",
    description: "Inicio de carrera profesional participando en proyectos estratégicos para el sector financiero.",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
    achievements: [
      "2021~2022: Sector bancario - Gobierno de negocio: Desarrollo de proyectos de gobierno de negocio para el sector bancario."
    ]
  }
];

export const SERVICES: ServiceItem[] = [
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
];

export const TESTIMONIALS: TestimonialItem[] = [
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
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "cs1",
    title: "Transformación digital integral en retail global",
    client: "Cadena Multinacional de Moda (Confidencial)",
    challenge: "El cliente operaba con sistemas heredados desconectados (silos), lo que causaba ineficiencias en la cadena de suministro y una experiencia de cliente fragmentada.",
    approach: "Diseñé e implementé una estrategia omnicanal basada en microservicios en la nube, integrando inventario en tiempo real y análisis de datos de clientes.",
    results: [
      "Mejora del 40% en la eficiencia de la cadena de suministro.",
      "Aumento del 22% en las ventas online gracias a la personalización.",
      "Reducción del 30% en costes de mantenimiento de TI."
    ]
  },
  {
    id: "cs2",
    title: "Optimización operativa mediante IA en fintech",
    client: "Plataforma de Pagos Digitales",
    challenge: "El rápido crecimiento de usuarios saturó el soporte al cliente y aumentó los falsos positivos en la detección de fraudes, frenando la expansión.",
    approach: "Lideré la adopción de modelos de IA para la detección predictiva de fraudes y desplegué asistentes virtuales avanzados (NLP) para atención al cliente.",
    results: [
      "Reducción del 95% en tiempos de respuesta de soporte (Nivel 1).",
      "Disminución del 60% en pérdidas por fraude transaccional.",
      "Crecimiento de ingresos del 15% al recuperar transacciones legítimas."
    ]
  }
];
