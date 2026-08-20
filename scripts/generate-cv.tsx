/* eslint-disable react-refresh/only-export-components */
import {
  Document,
  Font,
  Image,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
  renderToFile,
} from '@react-pdf/renderer';
import { PDFBool, PDFDict, PDFDocument, PDFName } from 'pdf-lib';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CV_FILENAMES } from '../cvConfig';
import type { Language } from '../types';
import { buildCvModel } from './cv-data';
import type { CvModel, CvProject } from './cv-data';

const repositoryRoot = fileURLToPath(new URL('..', import.meta.url));
const generatedDocumentsDirectory = path.join(repositoryRoot, 'public', 'assets', 'documents');

Font.register({
  family: 'Inter',
  fonts: [
    {
      src: path.join(repositoryRoot, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-normal.woff'),
      fontWeight: 400,
    },
    {
      src: path.join(repositoryRoot, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-400-italic.woff'),
      fontStyle: 'italic',
      fontWeight: 400,
    },
    {
      src: path.join(repositoryRoot, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-600-normal.woff'),
      fontWeight: 600,
    },
    {
      src: path.join(repositoryRoot, 'node_modules', '@fontsource', 'inter', 'files', 'inter-latin-700-normal.woff'),
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: 'Playfair Display',
  src: path.join(
    repositoryRoot,
    'node_modules',
    '@fontsource',
    'playfair-display',
    'files',
    'playfair-display-latin-700-normal.woff',
  ),
  fontWeight: 700,
});

Font.registerHyphenationCallback((word) => [word]);

const colors = {
  ink: '#182238',
  muted: '#5D6678',
  plum: '#6D3B78',
  plumDark: '#4E285A',
  lavender: '#F4EFF7',
  lavenderStrong: '#E8DDEC',
  blue: '#0879B9',
  bluePale: '#E8F5FB',
  line: '#D8DDE7',
  paper: '#FFFFFF',
  soft: '#F7F8FA',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: 'Inter',
    fontSize: 8.4,
    lineHeight: 1.34,
    paddingTop: 36,
    paddingRight: 38,
    paddingBottom: 36,
    paddingLeft: 38,
  },
  firstPage: {
    backgroundColor: colors.paper,
    color: colors.ink,
    fontFamily: 'Inter',
    fontSize: 8.4,
    lineHeight: 1.34,
    paddingBottom: 30,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 172,
    backgroundColor: colors.lavender,
    paddingTop: 34,
    paddingRight: 20,
    paddingLeft: 20,
  },
  portraitFrame: {
    alignSelf: 'center',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.plum,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 17,
  },
  portrait: {
    width: 98,
    height: 98,
    borderRadius: 49,
    objectFit: 'cover',
  },
  sidebarName: {
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    fontSize: 14,
    lineHeight: 1,
    color: colors.plumDark,
    textAlign: 'center',
    marginBottom: 6,
  },
  sidebarRole: {
    fontSize: 8.5,
    fontWeight: 600,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 18,
  },
  sidebarSection: {
    marginTop: 13,
  },
  sidebarHeading: {
    fontSize: 8.5,
    fontWeight: 700,
    color: colors.plumDark,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.lavenderStrong,
  },
  sidebarText: {
    color: colors.muted,
    fontSize: 7.7,
    lineHeight: 1.36,
    marginBottom: 5,
  },
  contactLabel: {
    color: colors.plum,
    fontSize: 6.7,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  contactValue: {
    color: colors.ink,
    fontSize: 7.5,
    marginBottom: 6,
  },
  sidebarLink: {
    alignSelf: 'flex-start',
    color: colors.blue,
    backgroundColor: colors.bluePale,
    borderRadius: 9,
    fontSize: 6.9,
    fontWeight: 700,
    lineHeight: 1,
    paddingTop: 4,
    paddingRight: 7,
    paddingBottom: 2.5,
    paddingLeft: 7,
    marginTop: 2,
    marginBottom: 4,
    textDecoration: 'none',
  },
  expertisePill: {
    alignSelf: 'flex-start',
    color: colors.plumDark,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.lavenderStrong,
    borderRadius: 8,
    fontSize: 6.9,
    fontWeight: 600,
    lineHeight: 1.18,
    paddingTop: 3.8,
    paddingRight: 6,
    paddingBottom: 2.6,
    paddingLeft: 6,
    marginBottom: 4,
  },
  firstPageMain: {
    marginLeft: 172,
    paddingTop: 34,
    paddingRight: 34,
    paddingBottom: 24,
    paddingLeft: 28,
  },
  eyebrow: {
    color: colors.plum,
    fontSize: 7.1,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  title: {
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1.08,
    color: colors.ink,
    marginBottom: 5,
  },
  tagline: {
    color: colors.plum,
    fontSize: 9.5,
    fontWeight: 600,
    marginBottom: 15,
  },
  sectionHeading: {
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    color: colors.ink,
    fontSize: 13.5,
    marginTop: 10,
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1.4,
    borderBottomColor: colors.plum,
  },
  summaryText: {
    color: colors.muted,
    fontSize: 8,
    lineHeight: 1.38,
    marginBottom: 6,
  },
  experienceItem: {
    position: 'relative',
    borderLeftWidth: 1.4,
    borderLeftColor: colors.plum,
    paddingLeft: 12,
    paddingBottom: 9,
    marginLeft: 3,
  },
  timelineDot: {
    position: 'absolute',
    left: -4.2,
    top: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.plum,
  },
  itemPeriod: {
    color: colors.plum,
    fontSize: 7,
    fontWeight: 700,
    marginBottom: 2,
  },
  itemTitle: {
    color: colors.ink,
    fontSize: 9,
    fontWeight: 700,
    lineHeight: 1.18,
  },
  itemCompany: {
    color: colors.muted,
    fontSize: 7.5,
    fontWeight: 600,
    marginTop: 1,
    marginBottom: 3,
  },
  itemDescription: {
    color: colors.muted,
    fontSize: 7.4,
    lineHeight: 1.34,
  },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    borderBottomWidth: 1.4,
    borderBottomColor: colors.plum,
    paddingBottom: 8,
    marginBottom: 13,
  },
  pageHeaderTitle: {
    fontFamily: 'Playfair Display',
    fontWeight: 700,
    fontSize: 18,
    color: colors.ink,
  },
  pageHeaderMeta: {
    color: colors.plum,
    fontSize: 7.2,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  projectGroup: {
    marginBottom: 9,
  },
  projectGroupHeading: {
    backgroundColor: colors.lavender,
    borderLeftWidth: 3,
    borderLeftColor: colors.plum,
    paddingTop: 6,
    paddingRight: 8,
    paddingBottom: 6,
    paddingLeft: 9,
    marginBottom: 5,
  },
  projectGroupRole: {
    color: colors.ink,
    fontSize: 9.1,
    fontWeight: 700,
  },
  projectGroupCompany: {
    color: colors.muted,
    fontSize: 7.1,
    marginTop: 1,
  },
  project: {
    position: 'relative',
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
    paddingLeft: 11,
    paddingBottom: 6,
    marginLeft: 5,
  },
  projectDot: {
    position: 'absolute',
    left: -3.1,
    top: 3,
    width: 5.2,
    height: 5.2,
    borderRadius: 3,
    backgroundColor: colors.plum,
  },
  projectMeta: {
    color: colors.plum,
    fontSize: 6.8,
    fontWeight: 700,
    marginBottom: 1.5,
  },
  projectTitle: {
    color: colors.ink,
    fontSize: 8.2,
    fontWeight: 700,
    marginBottom: 1.5,
  },
  projectSummary: {
    color: colors.muted,
    fontSize: 7.1,
    lineHeight: 1.28,
  },
  educationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: -7,
  },
  educationCard: {
    width: '48.3%',
    backgroundColor: colors.soft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    padding: 8,
    marginRight: 7,
    marginBottom: 7,
  },
  educationPeriod: {
    color: colors.plum,
    fontSize: 6.8,
    fontWeight: 700,
    marginBottom: 2,
  },
  educationDegree: {
    color: colors.ink,
    fontSize: 8,
    fontWeight: 700,
    lineHeight: 1.22,
  },
  educationInstitution: {
    color: colors.muted,
    fontSize: 7,
    marginTop: 2,
  },
  educationDescription: {
    color: colors.muted,
    fontSize: 6.8,
    fontStyle: 'italic',
    marginTop: 3,
  },
  certificationColumns: {
    flexDirection: 'row',
    marginRight: -10,
  },
  certificationColumn: {
    width: '49%',
    marginRight: 10,
  },
  providerGroup: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    marginBottom: 7,
    overflow: 'hidden',
  },
  providerHeading: {
    color: colors.ink,
    backgroundColor: colors.lavender,
    fontSize: 7.7,
    fontWeight: 700,
    paddingTop: 5,
    paddingRight: 6,
    paddingBottom: 5,
    paddingLeft: 6,
  },
  certificationItem: {
    paddingTop: 4.5,
    paddingRight: 6,
    paddingBottom: 4.5,
    paddingLeft: 6,
    borderTopWidth: 0.6,
    borderTopColor: colors.line,
  },
  certificationName: {
    color: colors.ink,
    fontSize: 6.8,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  certificationMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  certificationDate: {
    color: colors.muted,
    fontSize: 6.2,
  },
  credentialLink: {
    color: colors.blue,
    backgroundColor: colors.bluePale,
    borderRadius: 7,
    fontSize: 5.8,
    fontWeight: 700,
    lineHeight: 1,
    paddingTop: 2.8,
    paddingRight: 5,
    paddingBottom: 1.7,
    paddingLeft: 5,
    textDecoration: 'none',
  },
  footer: {
    position: 'absolute',
    left: 38,
    right: 38,
    bottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: colors.muted,
    fontSize: 6.2,
    borderTopWidth: 0.6,
    borderTopColor: colors.line,
    paddingTop: 4,
  },
  firstPageFooter: {
    left: 194,
    right: 34,
  },
});

const Footer = ({ model, firstPage = false }: { model: CvModel; firstPage?: boolean }) => (
  <View style={[styles.footer, firstPage ? styles.firstPageFooter : {}]} fixed>
    <Text>{model.labels.generatedFrom}</Text>
    <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
  </View>
);

const Sidebar = ({ model }: { model: CvModel }) => (
  <View style={styles.sidebar}>
    <View style={styles.portraitFrame}>
      <Image src={model.profile.imagePath} style={styles.portrait} />
    </View>
    <Text style={styles.sidebarName}>{model.profile.name.replaceAll(' ', '\u00A0')}</Text>
    <Text style={styles.sidebarRole}>{model.profile.title}</Text>

    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarHeading}>{model.labels.contact}</Text>
      <Text style={styles.contactLabel}>{model.labels.email}</Text>
      <Link src={`mailto:${model.profile.email}`} style={styles.contactValue}>
        {model.profile.email}
      </Link>
      <Text style={styles.contactLabel}>{model.labels.linkedin}</Text>
      <Link src={model.profile.linkedin} style={styles.sidebarLink}>
        LinkedIn
      </Link>
      <Text style={styles.contactLabel}>{model.labels.website}</Text>
      <Link src={model.profile.website} style={styles.sidebarLink}>
        josepnr97.github.io/JNR
      </Link>
      <Text style={styles.contactLabel}>{model.profile.location}</Text>
    </View>

    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarHeading}>{model.labels.expertise}</Text>
      {model.expertise.map((item) => (
        <Text key={item.title} style={styles.expertisePill}>
          {item.title}
        </Text>
      ))}
    </View>

    <View style={styles.sidebarSection}>
      <Text style={styles.sidebarHeading}>{model.labels.profile}</Text>
      <Text style={styles.sidebarText}>{model.profile.languages}</Text>
    </View>
  </View>
);

const PageHeader = ({ title, model }: { title: string; model: CvModel }) => (
  <View style={styles.pageHeader}>
    <Text style={styles.pageHeaderTitle}>{title}</Text>
    <Text style={styles.pageHeaderMeta}>
      {model.profile.name} · {model.language.toUpperCase()}
    </Text>
  </View>
);

const ProjectEntry = ({ project }: { project: CvProject }) => (
  <View style={styles.project} wrap={false}>
    <View style={styles.projectDot} />
    <Text style={styles.projectMeta}>
      {project.year} · {project.sector}
    </Text>
    <Text style={styles.projectTitle}>{project.title}</Text>
    <Text style={styles.projectSummary}>{project.summary}</Text>
  </View>
);

const ProjectGroups = ({ projects }: { projects: CvProject[] }) => {
  const groups = projects.reduce<Array<{ role: string; company: string; projects: CvProject[] }>>(
    (result, project) => {
      const current = result.at(-1);
      if (current?.role === project.role && current.company === project.company) {
        current.projects.push(project);
      } else {
        result.push({ role: project.role, company: project.company, projects: [project] });
      }
      return result;
    },
    [],
  );

  return groups.map((group) => (
    <View key={`${group.role}-${group.company}`} style={styles.projectGroup}>
      <View style={styles.projectGroupHeading} wrap={false}>
        <Text style={styles.projectGroupRole}>{group.role}</Text>
        <Text style={styles.projectGroupCompany}>{group.company}</Text>
      </View>
      {group.projects.map((project) => (
        <ProjectEntry key={`${project.year}-${project.title}`} project={project} />
      ))}
    </View>
  ));
};

const CertificationGroup = ({
  provider,
  credentialLabel,
}: {
  provider: CvModel['certificationProviders'][number];
  credentialLabel: string;
}) => (
  <View style={styles.providerGroup} wrap={false}>
    <Text style={styles.providerHeading}>{provider.name}</Text>
    {provider.certifications.map((certification) => (
      <View key={`${provider.name}-${certification.name}`} style={styles.certificationItem}>
        <Text style={styles.certificationName}>{certification.name}</Text>
        <View style={styles.certificationMetaRow}>
          <Text style={styles.certificationDate}>{certification.date}</Text>
          {certification.credentialUrl ? (
            <Link src={certification.credentialUrl} style={styles.credentialLink}>
              {credentialLabel}
            </Link>
          ) : null}
        </View>
      </View>
    ))}
  </View>
);

export const CvDocument = ({ model }: { model: CvModel }) => {
  const providerColumns = model.certificationProviders.reduce<
    [CvModel['certificationProviders'], CvModel['certificationProviders']]
  >(
    (columns, provider) => {
      const getColumnWeight = (column: CvModel['certificationProviders']) =>
        column.reduce((total, item) => total + item.certifications.length + 1, 0);
      const targetColumn = getColumnWeight(columns[0]) <= getColumnWeight(columns[1])
        ? columns[0]
        : columns[1];
      targetColumn.push(provider);
      return columns;
    },
    [[], []],
  );

  return (
    <Document
      title={`${model.profile.name} - CV ${model.language.toUpperCase()}`}
      author={model.profile.name}
      subject={model.profile.title}
      keywords={model.expertise.map((item) => item.title).join(', ')}
      creator="JNR Portfolio CV Generator"
    >
      <Page size="A4" style={styles.firstPage}>
        <Sidebar model={model} />
        <View style={styles.firstPageMain}>
          <Text style={styles.eyebrow}>{model.labels.profile}</Text>
          <Text style={styles.title}>{model.profile.name}</Text>
          <Text style={styles.tagline}>{model.profile.tagline}</Text>

          {model.profile.summary.map((paragraph) => (
            <Text key={paragraph} style={styles.summaryText}>
              {paragraph}
            </Text>
          ))}

          <Text style={styles.sectionHeading}>{model.labels.experience}</Text>
          {model.experience.map((item) => (
            <View key={`${item.role}-${item.period}`} style={styles.experienceItem} wrap={false}>
              <View style={styles.timelineDot} />
              <Text style={styles.itemPeriod}>{item.period}</Text>
              <Text style={styles.itemTitle}>{item.role}</Text>
              <Text style={styles.itemCompany}>{item.company}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
        <Footer model={model} firstPage />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader title={model.labels.projects} model={model} />
        <ProjectGroups projects={model.recentProjects} />
        <Footer model={model} />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader title={model.labels.projects} model={model} />
        <ProjectGroups projects={model.earlierProjects} />

        <Text style={styles.sectionHeading}>{model.labels.education}</Text>
        <View style={styles.educationGrid}>
          {model.education.map((item) => (
            <View key={`${item.degree}-${item.period}`} style={styles.educationCard} wrap={false}>
              <Text style={styles.educationPeriod}>{item.period}</Text>
              <Text style={styles.educationDegree}>{item.degree}</Text>
              <Text style={styles.educationInstitution}>{item.institution}</Text>
              {item.description ? <Text style={styles.educationDescription}>{item.description}</Text> : null}
            </View>
          ))}
        </View>
        <Footer model={model} />
      </Page>

      <Page size="A4" style={styles.page}>
        <PageHeader title={model.labels.certifications} model={model} />
        <View style={styles.certificationColumns}>
          {providerColumns.map((providers, columnIndex) => (
            <View key={`certification-column-${columnIndex}`} style={styles.certificationColumn}>
              {providers.map((provider) => (
                <CertificationGroup
                  key={provider.name}
                  provider={provider}
                  credentialLabel={model.labels.credential}
                />
              ))}
            </View>
          ))}
        </View>
        <Footer model={model} />
      </Page>
    </Document>
  );
};

export const generateCvDocuments = async (outputDirectory = generatedDocumentsDirectory) => {
  await mkdir(outputDirectory, { recursive: true });

  const languages: Language[] = ['ca', 'es', 'en'];
  const generatedFiles: string[] = [];
  const imagePath = buildCvModel('es').profile.imagePath;
  const portraitDataUri = `data:image/png;base64,${(await readFile(imagePath)).toString('base64')}`;

  for (const language of languages) {
    const outputPath = path.join(outputDirectory, CV_FILENAMES[language]);
    const model = buildCvModel(language);
    model.profile.imagePath = portraitDataUri;
    await renderToFile(<CvDocument model={model} />, outputPath);
    await markExternalLinksForNewWindow(outputPath);
    generatedFiles.push(outputPath);
  }

  return generatedFiles;
};

const markExternalLinksForNewWindow = async (pdfPath: string) => {
  const pdf = await PDFDocument.load(await readFile(pdfPath));

  pdf.getPages().forEach((page) => {
    const annotations = page.node.Annots();
    if (!annotations) return;

    for (let index = 0; index < annotations.size(); index += 1) {
      const annotation = pdf.context.lookup(annotations.get(index), PDFDict);
      const action = annotation.lookup(PDFName.of('A'), PDFDict);
      const actionType = action.get(PDFName.of('S'));
      if (actionType?.toString() === '/URI') {
        action.set(PDFName.of('NewWindow'), PDFBool.True);
      }
    }
  });

  await writeFile(pdfPath, await pdf.save());
};

const isExecutedDirectly = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isExecutedDirectly) {
  generateCvDocuments()
    .then((generatedFiles) => {
      console.log(`Generated ${generatedFiles.length} CV documents.`);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}
