const baseUrl = import.meta.env?.BASE_URL ?? './';

export const assetPath = (path: string) => `${baseUrl}assets/${path}`;
