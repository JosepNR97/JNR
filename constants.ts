import { MultiLanguageString } from "./types";

export const CAREER_START_YEAR = 2021;

export const IMAGES = {
  logos: {
    ntt: "https://upload.wikimedia.org/wikipedia/commons/6/67/Logo_Global_NTT_DATA_Future_Blue_RGB.png",
    accenture: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg",
    togaf: "https://image.makewebeasy.net/makeweb/m_750x0/VC8hKuwUh/PartnerLogos/togaf.png",
    safe: "https://scrumcraft.com/wp-content/uploads/2024/01/SAI_temp-logo_dteal.png",
    aws: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
    google: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg",
    azure: "https://www.bizstream.com/wp-content/uploads/2022/04/microsoft-azure-logo.png",
    ardoq: "https://images.credly.com/images/074823c7-1b50-453c-ad9e-d254b1d89237/large_blob.png",
    leanix: "https://confare.at/wp-content/uploads/Logo_LeanIX-RGB__horizontal_duotone_flat.png",
    servicenow: "https://cdn-public.softwarereviews.com/production/logos/offerings/4803/large/ServiceNow_logo.png?1745595736",
    isdi: "https://fad.es/wp-content/uploads/2019/06/logo-isdi-e1561372639174.png",
    ub: "https://upload.wikimedia.org/wikipedia/ca/thumb/2/2c/Logotip_UB.svg/2560px-Logotip_UB.svg.png",
    cambridge: "https://www.cam.ac.uk/sites/default/files/secondary-logo-stacked.png"
  },
  badges: {
    togafF: "https://images.credly.com/images/50b366b1-43d9-4b09-847d-761a6268fd5c/image.png",
    togafP: "https://images.credly.com/images/e36934b0-9b77-4bef-bf0c-a479c6c4f660/image.png",
    safe6: "https://images.credly.com/images/3e987079-3013-4359-9ad3-578c0b864e3d/image.png",
    awsPrac: "https://images.credly.com/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png",
    awsAI: "https://images.credly.com/images/4d4693bb-530e-4bca-9327-de07f3aa2348/image.png",
    awsPartnerTech: "https://images.credly.com/images/8f006312-3154-45bf-a845-4a043641e83c/blob",
    awsPartnerSales: "https://images.credly.com/images/46ea4542-72a8-46a1-8d68-b72c4ca50820/blob",
    googleLead: "https://images.credly.com/images/44994cda-b5b0-44cb-9a6d-d29b57163073/image.png",
    azureFund: "https://images.credly.com/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/twitter_thumb_201604_image.png",
    azureAI: "https://images.credly.com/images/4136ced8-75d5-4afb-8677-40b6236e2672/twitter_thumb_201604_azure-ai-fundamentals-600x600.png",
    azureData: "https://images.credly.com/images/70eb1e3f-d4de-4377-a062-b20fb29594ea/twitter_thumb_201604_azure-data-fundamentals-600x600.png",
    powerFund: "https://images.credly.com/images/2a6251f2-737b-4bf6-9190-d77570cc76fc/twitter_thumb_201604_CERT-Fundamentals-Power-Platform.png",
    ardoqFund: "https://images.credly.com/images/b7e1d43a-502e-4d5e-9e98-727ca7b0e5fa/image.png",
    leanix1: "https://cc.sj-cdn.net/instructor/26n620binjnso-leanix/course_series/e532arv2dve9/promo-image.1729521839.jpg",
    leanix2: "https://cc.sj-cdn.net/instructor/26n620binjnso-leanix/course_series/a35b0o837ep3/promo-image.1729521851.jpg",
    accentureLeader1: "https://images.credly.com/images/d03f2c22-ee38-404a-a19b-cfed053bdfa3/image.png",
    accentureLeader2: "https://images.credly.com/images/e5faf960-966d-4414-8372-6009362d39f6/image.png",
    accentureLeader3: "https://images.credly.com/images/ebf2d86e-33b0-4a49-b06a-e78ace8b27a6/image.png",
    servicenow: "https://images.credly.com/images/5a1dc59c-5961-40f6-88dd-3e6c366a3620/Credential_Badge_-_Micro-Cert_-_Welcome_to_ServiceNow.png",
    servicenow2:"https://learning.servicenow.com/Enterprise%20Architecture.svg",
    cae: "https://elandenglishonline.com/wp-content/uploads/2022/02/01.png",
    fce: "https://www.academiadublin.es/wp-content/uploads/2025/07/fce-cambridge-toledo.png"
  }
};

export const LINKS = {
  credentials: {
      default: "#",
      togafF: "https://www.credly.com/badges/20a1f2a1-a568-450a-a33d-be8222c7175d/public_url",
      togafP: "https://www.credly.com/badges/770c1958-b216-434b-8ab9-8c358ae7e11a/public_url",
      safe6: "https://www.credly.com/badges/18cef1f5-c4d6-4ea9-aec4-2679a72a15b4/public_url",
      awsPrac: "https://www.credly.com/badges/49e13956-350e-4021-b1ae-9cbc84d1703b/public_url",
      awsAI: "https://www.credly.com/badges/7c35f443-446c-4ac5-9ffd-52bc6b546fdf/public_url",
      awsPartnerTech: "https://www.credly.com/badges/0e206dd5-d3b2-4443-ad21-db4398417ee0/public_url",
      awsPartnerSales: "https://www.credly.com/badges/801b9b56-4e93-40d8-840c-be5df87c95a0/public_url",
      googleLead: "https://www.credly.com/badges/f848102c-bcc2-4707-8bcd-9ba6cc9b4fb2/public_url",
      azureFund: "https://learn.microsoft.com/api/credentials/share/es-es/JosepNezRiba-6009/CDD89EE538A49237?sharingId=3AB956A14FB38743",
      azureAI: "https://learn.microsoft.com/api/credentials/share/en-us/JosepNezRiba-6009/8CC32189E807032C?sharingId=3AB956A14FB38743",
      azureData: "https://learn.microsoft.com/api/credentials/share/es-es/JosepNezRiba-6009/3946170505A0A4AB?sharingId=3AB956A14FB38743",
      powerFund: "https://learn.microsoft.com/api/credentials/share/ca-es/JosepNezRiba-6009/4B086F7F65DA81AE?sharingId=3AB956A14FB38743",
      ardoqFund: "https://www.credly.com/badges/339579ca-08aa-4e35-81aa-9f00b6d9f878/public_url",
      leanix1: "https://verify.skilljar.com/c/x8uvsjxa5ajc",
      leanix2: "https://verify.skilljar.com/c/7nzc9vfuvnmu",
      accentureLeader1: "https://www.credly.com/badges/d8d400e0-0660-4c93-9984-c502d100b327/public_url",
      accentureLeader2: "https://www.credly.com/badges/a08927dc-a605-4c25-ba98-889a958ee56a",
      accentureLeader3: "https://www.credly.com/badges/cc5e74d2-1ddb-476e-a4a9-309bde3afe28",
      servicenow: "https://www.credly.com/badges/4eff0dfb-d801-4ce8-91df-ba0b49374bb9/public_url"
  }
};

// Centralized Education Data
export const EDUCATION_DATA = {
  academic: [
    {
      id: "ac1",
      degree: {
        ca: "Màster en Transformació Digital",
        es: "Máster en Transformación Digital",
        en: "Master in Digital Transformation"
      },
      institution: "ISDI",
      year: {
        ca: "Set. 2022 - Nov. 2022",
        es: "Sept. 2022 - Nov. 2022",
        en: "Sept 2022 - Nov 2022"
      },
      logoUrl: IMAGES.logos.isdi,
      description: {
        ca: "Especialització en Cloud.",
        es: "Especialización en Cloud.",
        en: "Cloud Specialization."
      }
    },
    {
      id: "ac2",
      degree: {
        ca: "Grau en Enginyeria Informàtica",
        es: "Grado en Ingeniería Informática",
        en: "Bachelor's Degree in Computer Engineering"
      },
      institution: "Universitat de Barcelona",
      year: {
        ca: "Set. 2015 - Juny 2022",
        es: "Sept. 2015 - Jun. 2022",
        en: "Sept 2015 - June 2022"
      },
      logoUrl: IMAGES.logos.ub,
      description: {
        ca: "Minor en Informàtica.",
        es: "Minor en Informática.",
        en: "Computer Science Minor."
      }
    },
    {
      id: "ac3",
      degree: {
        ca: "Grau en Matemàtiques",
        es: "Grado en Matemáticas",
        en: "Bachelor's Degree in Mathematics"
      },
      institution: "Universitat de Barcelona",
      year: {
        ca: "2015 - 2017",
        es: "Sept. 2015 - 2017",
        en: "Sept 2015 - 2017"
      },
      logoUrl: IMAGES.logos.ub,
      description: {
        ca: "Dos primers cursos complets.",
        es: "Dos primeros cursos completos.",
        en: "First two years completed."
      }
    }
  ],
  professional: [
    {
      id: "v_aws",
      name: "Amazon Web Services (AWS)",
      logoUrl: IMAGES.logos.aws,
      tags: ["Cloud", "AI", "Partner"],
      certifications: [
        { 
          name: "AWS Certified AI Practitioner", 
          image: IMAGES.badges.awsAI, 
          date: { ca: "Maig 2025", es: "Mayo 2025", en: "May 2025" }, 
          credentialUrl: LINKS.credentials.awsAI 
        },
        { 
          name: "AWS Certified Cloud Practitioner", 
          image: IMAGES.badges.awsPrac, 
          date: { ca: "Des. 2022", es: "Dic. 2022", en: "Dec. 2022" }, 
          credentialUrl: LINKS.credentials.awsPrac 
        },
        { 
          name: "AWS Partner: Accreditation (Technical)", 
          image: IMAGES.badges.awsPartnerTech, 
          date: { ca: "Nov. 2022", es: "Nov. 2022", en: "Nov. 2022" }, 
          credentialUrl: LINKS.credentials.awsPartnerTech 
        },
        { 
          name: "AWS Partner: Sales Accreditation (Business)", 
          image: IMAGES.badges.awsPartnerSales, 
          date: { ca: "Nov. 2022", es: "Nov. 2022", en: "Nov. 2022" }, 
          credentialUrl: LINKS.credentials.awsPartnerSales 
        }
      ]
    },
    {
      id: "v_ms",
      name: "Microsoft Azure",
      logoUrl: IMAGES.logos.azure,
      tags: ["Azure", "Data", "AI", "Power Platform"],
      certifications: [
        { 
          name: "Microsoft Certified: Azure AI Fundamentals", 
          image: IMAGES.badges.azureAI, 
          date: { ca: "Jul. 2024", es: "Jul. 2024", en: "Jul. 2024" }, 
          credentialUrl: LINKS.credentials.azureAI 
        },
        { 
          name: "Microsoft Certified: Azure Data Fundamentals", 
          image: IMAGES.badges.azureData, 
          date: { ca: "Jul. 2024", es: "Jul. 2024", en: "Jul. 2024" }, 
          credentialUrl: LINKS.credentials.azureData 
        },
        { 
          name: "Microsoft Certified: Azure Fundamentals", 
          image: IMAGES.badges.azureFund, 
          date: { ca: "Jul. 2024", es: "Jul. 2024", en: "Jul. 2024" }, 
          credentialUrl: LINKS.credentials.azureFund 
        },
        { 
          name: "Microsoft Certified: Power Platform Fundamentals", 
          image: IMAGES.badges.powerFund, 
          date: { ca: "Maig 2024", es: "Mayo 2024", en: "May 2024" }, 
          credentialUrl: LINKS.credentials.powerFund 
        }
      ]
    },
    {
      id: "v_google",
      name: "Google Cloud",
      logoUrl: IMAGES.logos.google,
      tags: ["Cloud", "Digital Transformation"],
      certifications: [
        { 
          name: "Google Cloud Certified Digital Cloud Leader", 
          image: IMAGES.badges.googleLead, 
          date: { ca: "Des. 2022", es: "Dic. 2022", en: "Dec. 2022" }, 
          credentialUrl: LINKS.credentials.googleLead 
        }
      ]
    },
    {
      id: "v_togaf",
      name: "The Open Group",
      logoUrl: IMAGES.logos.togaf,
      tags: ["Enterprise Architecture", "Framework"],
      certifications: [
        { 
          name: "TOGAF® Enterprise Architecture Practitioner", 
          image: IMAGES.badges.togafP, 
          date: { ca: "Juny 2025", es: "Junio 2025", en: "June 2025" }, 
          credentialUrl: LINKS.credentials.togafP 
        },
        { 
          name: "TOGAF® Enterprise Architecture Foundation", 
          image: IMAGES.badges.togafF, 
          date: { ca: "Març 2025", es: "Marzo 2025", en: "March 2025" }, 
          credentialUrl: LINKS.credentials.togafF 
        }
      ]
    },
    {
      id: "v_safe",
      name: "Scaled Agile, Inc.",
      logoUrl: IMAGES.logos.safe,
      tags: ["Agile", "Transformation"],
      certifications: [
        { 
          name: "Certificación SAFe® Agilist (SA) - Leading SAFe", 
          image: IMAGES.badges.safe6, 
          date: { ca: "Abr. 2024", es: "Abr. 2024", en: "Apr. 2024" }, 
          credentialUrl: LINKS.credentials.safe6 
        }
      ]
    },
    {
      id: "v_leanix",
      name: "SAP LeanIX",
      logoUrl: IMAGES.logos.leanix,
      tags: ["EA Tooling", "SaaS Management"],
      certifications: [
        { 
          name: "LeanIX Certified Practitioner (Level 2)", 
          image: IMAGES.badges.leanix2, 
          date: { ca: "Març 2025", es: "Marzo 2025", en: "March 2025" }, 
          credentialUrl: LINKS.credentials.leanix2 
        },
        { 
          name: "LeanIX Certified Practitioner (Level 1)", 
          image: IMAGES.badges.leanix1, 
          date: { ca: "Feb. 2025", es: "Feb. 2025", en: "Feb. 2025" }, 
          credentialUrl: LINKS.credentials.leanix1 
        }
      ]
    },
    {
      id: "v_ardoq",
      name: "Ardoq",
      logoUrl: IMAGES.logos.ardoq,
      tags: ["EA Tooling", "Data Driven"],
      certifications: [
        { 
          name: "Ardoq Practitioner", 
          image: IMAGES.badges.ardoqFund, 
          date: { ca: "Oct. 2025", es: "Oct. 2025", en: "Oct. 2025" }, 
          credentialUrl: LINKS.credentials.ardoqFund 
        }
      ]
    },
    {
      id: "v_snow",
      name: "ServiceNow",
      logoUrl: IMAGES.logos.servicenow,
      tags: ["ITSM", "Platform"],
      certifications: [
        { 
          name: "Enterprise Architecture Implementation Delivery Accreditation", 
          image: IMAGES.badges.servicenow2, 
          date: { ca: "Jul. 2025", es: "Jul. 2025", en: "Jul. 2025" }, 
          credentialUrl: LINKS.credentials.default 
        },
        { 
          name: "Micro-Certification - Welcome to ServiceNow", 
          image: IMAGES.badges.servicenow, 
          date: { ca: "Jul. 2025", es: "Jul. 2025", en: "Jul. 2025" }, 
          credentialUrl: LINKS.credentials.servicenow 
        }
      ]
    },
    {
      id: "v_acc",
      name: "Accenture",
      logoUrl: IMAGES.logos.accenture,
      tags: ["Leadership", "Management"],
      certifications: [
        { 
          name: "People Leadership Credential - Chapter 3: Empower", 
          image: IMAGES.badges.accentureLeader1, 
          date: { ca: "Juny 2024", es: "Junio 2024", en: "June 2024" }, 
          credentialUrl: LINKS.credentials.accentureLeader1 
        },
        { 
          name: "People Leadership Credential - Chapter 2: Develop", 
          image: IMAGES.badges.accentureLeader2, 
          date: { ca: "Maig 2024", es: "Mayo 2024", en: "May 2024" }, 
          credentialUrl: LINKS.credentials.accentureLeader2 
        },
        { 
          name: "People Leadership Credential - Chapter 1: Connect", 
          image: IMAGES.badges.accentureLeader3, 
          date: { ca: "Nov. 2023", es: "Nov. 2023", en: "Nov. 2023" }, 
          credentialUrl: LINKS.credentials.accentureLeader3 
        }
      ]
    },
    {
      id: "v_cambridge",
      name: "University of Cambridge",
      logoUrl: IMAGES.logos.cambridge,
      tags: ["Languages", "English"],
      certifications: [
        { 
          name: "Certificate in Advanced English (CAE)", 
          image: IMAGES.badges.cae, 
          date: { ca: "Oct. 2020", es: "Oct. 2020", en: "Oct. 2020" }, 
          credentialUrl: LINKS.credentials.default 
        },
        { 
          name: "First Certificate in English (FCE)", 
          image: IMAGES.badges.fce, 
          date: { ca: "Maig 2012", es: "Mayo 2012", en: "May 2012" }, 
          credentialUrl: LINKS.credentials.default 
        }
      ]
    }
  ]
};

// For Certifications Carousel
export const CERTIFICATION_LOGOS = [
  { name: "AWS", url: IMAGES.logos.aws },
  { name: "Microsoft Azure", url: IMAGES.logos.azure },
  { name: "Google Cloud", url: IMAGES.logos.google },
  { name: "The Open Group", url: IMAGES.logos.togaf },
  { name: "SAFe", url: IMAGES.logos.safe },
  { name: "LeanIX", url: IMAGES.logos.leanix },
  { name: "Ardoq", url: IMAGES.logos.ardoq },
  { name: "ServiceNow", url: IMAGES.logos.servicenow }
];
