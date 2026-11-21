import { readFile } from 'node:fs/promises';

const dryRun = process.env.DRY_RUN === 'true';
const repository = process.env.GITHUB_REPOSITORY ?? 'JosepNR97/JNR';
const token = process.env.GH_TOKEN;
const apiUrl = process.env.GITHUB_API_URL ?? 'https://api.github.com';
const sourcePath = '.github/backlog-import-v10.json';
const apiRoot = `/repos/${repository}`;
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const labelDefinitions = [
  {
    name: 'area:design',
    color: '0EA5E9',
    description: 'Visual design, content presentation and UX',
  },
  {
    name: 'area:technical',
    color: '6366F1',
    description: 'Architecture, security, SEO, testing and performance',
  },
  {
    name: 'area:functionality',
    color: 'F59E0B',
    description: 'User-facing interaction and functionality',
  },
  {
    name: 'phase:now',
    color: 'DCFCE7',
    description: 'Recommended for the next iteration',
  },
  {
    name: 'phase:next',
    color: 'FEF3C7',
    description: 'Recommended after immediate work',
  },
  {
    name: 'phase:optional',
    color: 'E2E8F0',
    description: 'Undertake only when the benefit is demonstrated',
  },
];

const areaLabels = {
  'Diseño': 'area:design',
  'Técnico': 'area:technical',
  Funcionalidad: 'area:functionality',
};
const phaseLabels = {
  Ahora: 'phase:now',
  Siguiente: 'phase:next',
  Opcional: 'phase:optional',
};

const issueMarker = (id) => `<!-- jnr-backlog:v10:${id} -->`;
const pendingMarker = '<!-- jnr-import:pending-dependencies -->';
const issueTitle = (item) => `[${item.id}] ${item.title}`;

async function request(method, path, body) {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2026-03-10',
        'User-Agent': 'JNR-backlog-import',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      return response.status === 204 ? null : response.json();
    }

    const details = await response.text();
    const retryable = [429, 500, 502, 503, 504].includes(response.status);
    if (retryable && attempt < 3) {
      const retryAfter = Number(response.headers.get('retry-after'));
      await wait(
        Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : attempt * 1500,
      );
      continue;
    }

    throw new Error(
      `${method} ${path} returned ${response.status}: ${details.slice(0, 500)}`,
    );
  }

  throw new Error(`Unable to complete ${method} ${path}`);
}

async function getAllPages(path) {
  const result = [];
  for (let page = 1; page <= 30; page += 1) {
    const delimiter = path.includes('?') ? '&' : '?';
    const batch = await request(
      'GET',
      `${path}${delimiter}per_page=100&page=${page}`,
    );
    if (!Array.isArray(batch)) {
      throw new Error(`Expected an array from ${path}`);
    }
    result.push(...batch);
    if (batch.length < 100) return result;
  }
  throw new Error(`Too many pages for ${path}; refusing a partial import`);
}

function validateSeed(data) {
  if (data.version !== 'v10' || !Array.isArray(data.items)) {
    throw new Error('Unexpected backlog data version or format');
  }
  const ids = new Set();
  for (const item of data.items) {
    if (!/^[A-Z][0-9]+$/.test(item.id) || ids.has(item.id)) {
      throw new Error(`Duplicate or invalid backlog ID: ${item.id}`);
    }
    ids.add(item.id);
    if (
      !areaLabels[item.level] ||
      !phaseLabels[item.when] ||
      typeof item.promptTask !== 'string' ||
      !Array.isArray(item.dependsOn)
    ) {
      throw new Error(`Incomplete backlog item: ${item.id}`);
    }
  }
  for (const item of data.items) {
    for (const dependency of item.dependsOn) {
      if (!ids.has(dependency.id)) {
        throw new Error(`Unknown dependency: ${item.id} -> ${dependency.id}`);
      }
      if (!['requiere', 'recomienda'].includes(dependency.type)) {
        throw new Error(`Unknown dependency type on ${item.id}`);
      }
    }
  }
}

function renderDependencies(item, issueMap) {
  if (item.dependsOn.length === 0) {
    return 'Sin dependencias identificadas.';
  }

  return item.dependsOn
    .map((dependency) => {
      const related = issueMap.get(dependency.id);
      const reference = related ? `#${related.number}` : dependency.id;
      const relation =
        dependency.type === 'requiere'
          ? '**Bloqueante (requiere)**'
          : '**Recomendada (no bloqueante)**';
      const reason = dependency.reason ? ` — ${dependency.reason}` : '';
      return `- ${relation}: ${reference}${reason}`;
    })
    .join('\n');
}

function renderIssue(item, harness, issueMap, pending) {
  const files = item.files.map((file) => `- \`${file}\``).join('\n');
  const prompt = [
    harness,
    '',
    'TAREA ESPECIFICA',
    '',
    item.promptTask,
    '',
    'REINDEXACION / SEARCH CONSOLE',
    '',
    `Clasificacion: ${item.reindex}`,
    `Accion: ${item.reindexNote}`,
  ].join('\n');

  return [
    issueMarker(item.id),
    pending ? pendingMarker : '',
    '> Importado del backlog JNR v10. Esta issue es ahora la fuente de verdad; no hay que mantener el antiguo HTML.',
    '',
    '## Qué queremos conseguir',
    '',
    item.que,
    '',
    '## Por qué merece la pena',
    '',
    item.porque,
    '',
    '## Enfoque recomendado',
    '',
    item.como,
    '',
    '## Clasificación',
    '',
    `- **Área:** ${item.level}`,
    `- **Fase:** ${item.when}`,
    `- **Impacto:** ${item.impact}`,
    `- **Esfuerzo estimado:** ${item.effort}`,
    `- **Reindexación manual:** ${item.reindex}`,
    `- **Criterio de Search Console:** ${item.reindexNote}`,
    '',
    '## Dependencias',
    '',
    renderDependencies(item, issueMap),
    '',
    '## Ficheros orientativos (verificar contra main)',
    '',
    files,
    '',
    '## Criterios de cierre',
    '',
    '- [ ] Revisión del `main` actual y alcance contrastado con esta descripción.',
    '- [ ] Requisitos específicos y restricciones del prompt atendidos.',
    '- [ ] Evidencia de validación aportada (o de auditoría cuando no haya código).',
    '- [ ] Impacto SEO y requisitos de Search Console revisados.',
    '- [ ] Issue cerrada al terminar; si hay PR, vincularla con `Closes #N`.',
    '',
    '<details>',
    '<summary><strong>Prompt completo para implementar o auditar esta iniciativa</strong></summary>',
    '',
    '````text',
    prompt,
    '````',
    '',
    '</details>',
    '',
  ].join('\n');
}

async function ensureLabels() {
  const existing = new Set(
    (await getAllPages(`${apiRoot}/labels`)).map((label) => label.name),
  );
  for (const label of labelDefinitions) {
    if (existing.has(label.name)) continue;
    await request('POST', `${apiRoot}/labels`, label);
    console.log(`Created label ${label.name}`);
    await wait(350);
  }
}

async function loadIssues() {
  const existing = await getAllPages(`${apiRoot}/issues?state=all`);
  const byId = new Map();
  for (const issue of existing) {
    if (issue.pull_request) continue;
    const match = issue.title?.match(/^\[([A-Z][0-9]+)\]/);
    if (!match) continue;
    if (byId.has(match[1])) {
      throw new Error(`Multiple existing issues use ID ${match[1]}`);
    }
    byId.set(match[1], issue);
  }
  return byId;
}

async function ensureNativeBlockers(items, issueMap) {
  for (const item of items) {
    const blockedIssue = issueMap.get(item.id);
    const blockingDependencies = item.dependsOn.filter(
      (dependency) => dependency.type === 'requiere',
    );
    if (!blockingDependencies.length) continue;
    const path = `${apiRoot}/issues/${blockedIssue.number}/dependencies/blocked_by`;
    const existing = await request('GET', path);
    const alreadyBlockedBy = new Set(existing.map((issue) => issue.id));
    for (const dependency of blockingDependencies) {
      const blocker = issueMap.get(dependency.id);
      if (!alreadyBlockedBy.has(blocker.id)) {
        await request('POST', path, { issue_id: blocker.id });
        console.log(`Created native blocker ${item.id} <- ${dependency.id}`);
        await wait(350);
      }
    }
  }
}

async function main() {
  const seed = JSON.parse(await readFile(sourcePath, 'utf8'));
  validateSeed(seed);

  if (dryRun) {
    console.log(`DRY RUN: ${seed.items.length} issues planned for ${repository}`);
    for (const item of seed.items) {
      const body = renderIssue(item, seed.harness, new Map(), true);
      console.log(`- ${issueTitle(item)} (${body.length} characters)`);
    }
    return;
  }

  if (!token || process.env.GITHUB_REPOSITORY !== 'JosepNR97/JNR') {
    throw new Error('This import requires GITHUB_TOKEN and the JNR repository');
  }

  await ensureLabels();
  const issues = await loadIssues();
  const created = [];

  for (const item of seed.items) {
    if (issues.has(item.id)) {
      console.log(`Skipping existing ${item.id} (#${issues.get(item.id).number})`);
      continue;
    }
    const issue = await request('POST', `${apiRoot}/issues`, {
      title: issueTitle(item),
      body: renderIssue(item, seed.harness, issues, item.dependsOn.length > 0),
      labels: [areaLabels[item.level], phaseLabels[item.when]],
    });
    issues.set(item.id, issue);
    created.push(issue);
    console.log(`Created ${item.id}: ${issue.html_url}`);
    await wait(500);
  }

  let repaired = 0;
  for (const item of seed.items) {
    const issue = issues.get(item.id);
    if (!issue.body?.includes(pendingMarker)) continue;
    const body = renderIssue(item, seed.harness, issues, false);
    await request('PATCH', `${apiRoot}/issues/${issue.number}`, { body });
    repaired += 1;
    await wait(350);
  }

  await ensureNativeBlockers(seed.items, issues);

  const summary = [
    '## JNR backlog migration v10',
    '',
    `- Total backlog: ${seed.items.length}`,
    `- Issues created in this run: ${created.length}`,
    `- Dependency references updated: ${repaired}`,
    `- Pre-existing issues reused: ${seed.items.length - created.length}`,
    '',
    '### Imported issue links',
    ...seed.items.map((item) => `- ${item.id}: ${issues.get(item.id).html_url}`),
  ].join('\n');
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    const { appendFile } = await import('node:fs/promises');
    await appendFile(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
