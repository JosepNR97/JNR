export interface ImageDeliveryRule {
  widths: readonly number[];
  avifQuality: number;
  webpQuality: number;
}

export const IMAGE_DELIVERY_RULES = {
  people: {
    widths: [
      480,
      960,
    ],
    avifQuality: 60,
    webpQuality: 84,
  },

  certifications: {
    widths: [
      48,
      96,
      192,
    ],
    avifQuality: 78,
    webpQuality: 90,
  },

  'credential-issuers': {
    widths: [
      80,
      160,
      320,
    ],
    avifQuality: 78,
    webpQuality: 90,
  },

  education: {
    widths: [
      64,
      128,
      256,
    ],
    avifQuality: 78,
    webpQuality: 90,
  },

  employers: {
    widths: [
      144,
      288,
    ],
    avifQuality: 78,
    webpQuality: 90,
  },

  brand: {
    widths: [
      64,
      128,
      256,
    ],
    avifQuality: 78,
    webpQuality: 90,
  },
} as const satisfies Record<
  string,
  ImageDeliveryRule
>;
