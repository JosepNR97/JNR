// @vitest-environment node

import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  PDFBool,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFString,
} from 'pdf-lib';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { CV_FILENAMES } from '../cvConfig';
import { translations } from '../translations';
import type { Language } from '../types';
import { buildCvModel, sanitizePdfText } from './cv-data';
import { generateCvDocuments } from './generate-cv';

const languages: Language[] = ['ca', 'es', 'en'];

const forbiddenLegacyData = [
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
    if (outputDirectory) {
      await rm(outputDirectory, { recursive: true, force: true });
    }
  });

  it.each(languages)(
    'creates a complete four-page %s PDF with links and metadata',
    async (language) => {
      const model = buildCvModel(language);

      const pdfBytes = await readFile(
        path.join(outputDirectory, CV_FILENAMES[language]),
      );

      const pdf = await PDFDocument.load(pdfBytes);

      const validCredentialLinks = model.certificationProviders.flatMap(
        (provider) =>
          provider.certifications.filter(
            (certification) => certification.credentialUrl,
          ),
      ).length;

      expect(pdf.getPageCount()).toBe(4);

      expect(pdf.getTitle()).toBe(
        `${model.profile.name} - CV ${language.toUpperCase()}`,
      );

      expect(pdf.getAuthor()).toBe(model.profile.name);
      expect(pdf.getSubject()).toBe(model.profile.title);
      expect(pdf.getCreator()).toBe('JNR Portfolio CV Generator');

      const annotationCount = pdf.getPages().reduce(
        (total, page) => total + (page.node.Annots()?.size() ?? 0),
        0,
      );

      expect(annotationCount).toBe(validCredentialLinks + 3);

      const annotationLinks = pdf.getPages().flatMap((page) => {
        const annotations = page.node.Annots();

        if (!annotations) {
          return [];
        }

        return Array.from(
          { length: annotations.size() },
          (_, index) => {
            const annotation = pdf.context.lookup(
              annotations.get(index),
              PDFDict,
            );

            const action = annotation.lookup(
              PDFName.of('A'),
              PDFDict,
            );

            const uri = action.lookup(PDFName.of('URI'));

            const newWindow = action.lookup(
              PDFName.of('NewWindow'),
              PDFBool,
            );

            return {
              url:
                uri instanceof PDFString ||
                uri instanceof PDFHexString
                  ? uri.decodeText()
                  : '',
              opensInNewWindow: newWindow.asBoolean(),
            };
          },
        );
      });

      const expectedUrls = [
        `mailto:${model.profile.email}`,
        model.profile.linkedin,
        model.profile.website,
        ...model.certificationProviders.flatMap((provider) =>
          provider.certifications.flatMap((certification) =>
            certification.credentialUrl
              ? [certification.credentialUrl]
              : [],
          ),
        ),
      ];

      expect(
        annotationLinks.map((link) => link.url).sort(),
      ).toEqual(expectedUrls.sort());

      expect(
        annotationLinks.every((link) => link.opensInNewWindow),
      ).toBe(true);

      pdf.getPages().forEach((page) => {
        const resources = page.node.Resources();

        const fonts = resources?.lookup(
          PDFName.of('Font'),
          PDFDict,
        );

        expect(fonts?.keys().length).toBeGreaterThan(0);
      });
    },
  );

  it.each(languages)(
    'stays in sync with portfolio data and excludes legacy data in the %s model',
    (language) => {
      const model = buildCvModel(language);
      const source = translations[language];
      const serializedModel = JSON.stringify(model);

      const sourceProjects = source.experience.items.flatMap(
        (item) => item.achievements,
      );

      const modelProjects = [
        ...model.recentProjects,
        ...model.earlierProjects,
      ];

      const sourceCertificationNames =
        source.education.professional.flatMap(
          (provider) =>
            provider.certifications.map(
              (certification) =>
                sanitizePdfText(certification.name),
            ),
        );

      const modelCertificationNames =
        model.certificationProviders.flatMap(
          (provider) =>
            provider.certifications.map(
              (certification) => certification.name,
            ),
        );

      expect(model.experience).toHaveLength(
        source.experience.items.length,
      );

      expect(modelProjects).toHaveLength(
        sourceProjects.length,
      );

      expect(model.education).toHaveLength(
        source.education.academic.length,
      );

      expect(modelCertificationNames).toEqual(
        sourceCertificationNames,
      );

      forbiddenLegacyData.forEach((value) => {
        expect(serializedModel).not.toContain(value);
      });
    },
  );
});