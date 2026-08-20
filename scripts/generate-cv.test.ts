// @vitest-environment node

import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { PDFDict, PDFDocument, PDFHexString, PDFName, PDFString } from 'pdf-lib';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CV_FILENAMES } from '../cvConfig';
import type { Language } from '../types';
import { buildCvModel } from './cv-data';
import { generateCvDocuments } from './generate-cv';

const languages: Language[] = ['ca', 'es', 'en'];
const forbiddenLegacyData = [
  '03/06/1997',
  '608361356',
  'Pau Alsina',
  'Masculino',
  'voluntariado',
];

describe('CV generator', () => {
  let outputDirectory = '';

  beforeAll(async () => {
    outputDirectory = await mkdtemp(path.join(tmpdir(), 'jnr-cv-'));
    await generateCvDocuments(outputDirectory);
  }, 60_000);

  afterAll(async () => {
    if (outputDirectory) await rm(outputDirectory, { recursive: true, force: true });
  });

  it.each(languages)('creates a complete four-page %s PDF with links and metadata', async (language) => {
    const model = buildCvModel(language);
    const pdfBytes = await readFile(path.join(outputDirectory, CV_FILENAMES[language]));
    const pdf = await PDFDocument.load(pdfBytes);
    const validCredentialLinks = model.certificationProviders.flatMap((provider) =>
      provider.certifications.filter((certification) => certification.credentialUrl),
    ).length;

    expect(pdf.getPageCount()).toBe(4);
    expect(pdf.getTitle()).toBe(`${model.profile.name} - CV ${language.toUpperCase()}`);
    expect(pdf.getAuthor()).toBe(model.profile.name);
    expect(pdf.getSubject()).toBe(model.profile.title);
    expect(pdf.getCreator()).toBe('JNR Portfolio CV Generator');

    const annotationCount = pdf.getPages().reduce(
      (total, page) => total + (page.node.Annots()?.size() ?? 0),
      0,
    );
    expect(annotationCount).toBe(validCredentialLinks + 3);

    const annotationUrls = pdf.getPages().flatMap((page) => {
      const annotations = page.node.Annots();
      if (!annotations) return [];

      return Array.from({ length: annotations.size() }, (_, index) => {
        const annotation = pdf.context.lookup(annotations.get(index), PDFDict);
        const action = annotation.lookup(PDFName.of('A'), PDFDict);
        const uri = action.lookup(PDFName.of('URI'));
        return uri instanceof PDFString || uri instanceof PDFHexString ? uri.decodeText() : '';
      });
    });
    const expectedUrls = [
      `mailto:${model.profile.email}`,
      model.profile.linkedin,
      model.profile.website,
      ...model.certificationProviders.flatMap((provider) =>
        provider.certifications.flatMap((certification) =>
          certification.credentialUrl ? [certification.credentialUrl] : [],
        ),
      ),
    ];
    expect(annotationUrls.sort()).toEqual(expectedUrls.sort());

    pdf.getPages().forEach((page) => {
      const resources = page.node.Resources();
      const fonts = resources?.lookup(PDFName.of('Font'), PDFDict);
      expect(fonts?.keys().length).toBeGreaterThan(0);
    });
  });

  it.each(languages)('contains only current portfolio data in the %s model', (language) => {
    const model = buildCvModel(language);
    const serializedModel = JSON.stringify(model);
    const projects = [...model.recentProjects, ...model.earlierProjects];
    const certifications = model.certificationProviders.flatMap((provider) => provider.certifications);

    expect(model.experience).toHaveLength(4);
    expect(projects).toHaveLength(14);
    expect(model.education).toHaveLength(3);
    expect(certifications).toHaveLength(31);
    forbiddenLegacyData.forEach((value) => expect(serializedModel).not.toContain(value));
  });
});
