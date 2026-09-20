export const SEO_IDENTITY = {
  givenName: 'Josep',
  familyName: 'Núñez Riba',
  alternateName: 'JosepNR97',

  imagePath:
    'assets/people/josep-nunez-riba-2.webp',

  profiles: {
    linkedin:
      'https://www.linkedin.com/in/josep-nunez-riba',
    github:
      'https://github.com/JosepNR97',
    youtube:
      'https://www.youtube.com/@JNR517',
    instagram:
      'https://www.instagram.com/pepito517/',
  },

  employer: {
    name: 'NTT DATA Europe & Latam',
  },

  alumniOf: [
    {
      type: 'CollegeOrUniversity',
      name: 'Universitat de Barcelona',
    },
    {
      type: 'EducationalOrganization',
      name: 'ISDI',
    },
  ],

  knowsAbout: [
    'Technology Strategy',
    'Digital Transformation',
    'Enterprise Architecture',
    'Cloud Strategy',
    'Artificial Intelligence',
    'Generative AI',
  ],
} as const;

export const SEO_SAME_AS = [
  SEO_IDENTITY.profiles.linkedin,
  SEO_IDENTITY.profiles.github,
  SEO_IDENTITY.profiles.youtube,
  SEO_IDENTITY.profiles.instagram,
] as const;
