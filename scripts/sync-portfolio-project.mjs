// Sincroniza JNR Issues -> GitHub Project. Solo la issue es fuente de verdad.
const OWNER = 'JosepNR97';
const REPO = 'JNR';
const PROJECT_TITLE = 'JNR · Portfolio Backlog';
const API = 'https://api.github.com';
const VERSION = '2026-03-10';
const REPO_TOKEN = process.env.GH_REPO_TOKEN;
const PROJECT_TOKEN = process.env.GH_PROJECT_PAT;
const DRY_RUN =
  process.env.GITHUB_EVENT_NAME === 'workflow_dispatch' &&
  process.env.DRY_RUN !== 'false';
const PAUSE = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WRITE_PAUSE_MS = Number(process.env.JNR_WRITE_PAUSE_MS ?? 850);

const FIELDS = [
  {
    name: 'Fase',
    values: ['Ahora', 'Siguiente', 'Opcional'],
    colors: ['GREEN', 'BLUE', 'GRAY'],
  },
  {
    name: 'Área',
    values: ['Diseño', 'Técnico', 'Funcionalidad'],
    colors: ['BLUE', 'PURPLE', 'ORANGE'],
  },
  {
    name: 'Impacto',
    values: ['Alto', 'Medio', 'Bajo'],
    colors: ['RED', 'YELLOW', 'GREEN'],
  },
  {
    name: 'Esfuerzo',
    values: ['Bajo', 'Medio', 'Alto'],
    colors: ['GREEN', 'YELLOW', 'RED'],
  },
  {
    name: 'Reindexación',
    values: ['Sí', 'Recomendada', 'No'],
    colors: ['BLUE', 'YELLOW', 'GRAY'],
  },
  {
    name: 'Relación',
    values: [
      'Sin relaciones',
      'Recomendada',
      'Bloqueante',
      'Mixta',
    ],
    colors: ['GRAY', 'BLUE', 'RED', 'PURPLE'],
  },
  { name: 'Orden', type: 'NUMBER' },
  { name: 'Depende de', type: 'TEXT' },
  { name: 'Facilita a', type: 'TEXT' },
  { name: 'N.º relaciones', type: 'NUMBER' },
];

const AREA = {
  Diseño: 'area:design',
  Técnico: 'area:technical',
  Funcionalidad: 'area:functionality',
};

const FASE = {
  Ahora: 'phase:now',
  Siguiente: 'phase:next',
  Opcional: 'phase:optional',
};

async function rest(path, token, method = 'GET', payload) {
  if (!token) {
    throw new Error('Falta el token para consultar GitHub.');
  }

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': VERSION,
        'Content-Type': 'application/json',
        'User-Agent': 'JNR-project-sync',
      },
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    if (response.ok) {
      return response.status === 204 ? null : response.json();
    }

    const error = await response.text();

    if (
      [429, 500, 502, 503, 504].includes(response.status) &&
      attempt < 3
    ) {
      await PAUSE(attempt * 1600);
      continue;
    }

    throw new Error(
      `${method} ${path}: HTTP ${response.status}: ${error.slice(0, 350)}`,
    );
  }

  throw new Error(`No se completó ${method} ${path}.`);
}

async function graphql(query, variables = {}) {
  const result = await rest('/graphql', PROJECT_TOKEN, 'POST', {
    query,
    variables,
  });

  if (result.errors?.length) {
    throw new Error(result.errors.map((x) => x.message).join('; '));
  }

  return result.data;
}

// Admite las descripciones importadas en 2026 y las nuevas issue forms.
function valueFromBody(body, label) {
  const safe = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const legacy = new RegExp(
    `^\\s*- \\*\\*${safe}:\\*\\*\\s*(.+)$`,
    'm',
  ).exec(body);

  if (legacy) {
    return legacy[1].trim();
  }

  const form = new RegExp(
    `^### ${safe}\\s*\\n+([^\\n#]+)`,
    'm',
  ).exec(body);

  return form?.[1].trim() || '';
}

function issueMetadata(issue) {
  const fields = {
    Área: valueFromBody(issue.body || '', 'Área'),
    Fase: valueFromBody(issue.body || '', 'Fase'),
    Impacto: valueFromBody(issue.body || '', 'Impacto'),
    Esfuerzo: valueFromBody(issue.body || '', 'Esfuerzo estimado'),
    Reindexación: valueFromBody(
      issue.body || '',
      'Reindexación manual',
    ),
  };

  for (const config of FIELDS.filter(
    (field) => field.values && field.name !== 'Relación',
  )) {
    if (!config.values.includes(fields[config.name])) {
      throw new Error(
        `#${issue.number}: falta '${config.name}' o su valor no es válido (${fields[config.name]}). Usa la plantilla de mejora.`,
      );
    }
  }

  const rawOrder = valueFromBody(
    issue.body || '',
    'Orden (opcional)',
  );

  if (
    rawOrder &&
    (!/^\d+$/.test(rawOrder) || Number(rawOrder) < 1)
  ) {
    throw new Error(
      `#${issue.number}: Orden debe ser un entero positivo.`,
    );
  }

  return {
    ...fields,
    Orden: rawOrder ? Number(rawOrder) : null,
  };
}

function section(body, heading) {
  const lines = (body || '').split('\n');
  const target = heading.toLocaleLowerCase('es');
  let active = false;
  const found = [];

  for (const line of lines) {
    const header = /^#{2,3}\s+(.+)\s*$/.exec(line);

    if (header) {
      active =
        header[1].trim().toLocaleLowerCase('es') === target;
      continue;
    }

    if (active) {
      found.push(line);
    }
  }

  return found.join('\n');
}

function references(text) {
  return [
    ...new Set(
      [...text.matchAll(/(?:^|[^\w])#(\d+)\b/g)].map(
        (match) => Number(match[1]),
      ),
    ),
  ];
}

function declaredRelations(issue) {
  const recommended = new Set(
    references(
      section(issue.body, 'Dependencias recomendadas'),
    ),
  );

  const blocking = new Set(
    references(
      section(issue.body, 'Dependencias bloqueantes'),
    ),
  );

  // Compatibilidad con el formato del importador inicial.
  for (const line of section(
    issue.body,
    'Dependencias',
  ).split('\n')) {
    if (/Recomendada \(no bloqueante\)/i.test(line)) {
      references(line).forEach((n) => recommended.add(n));
    }

    if (/Bloqueante \(requiere\)/i.test(line)) {
      references(line).forEach((n) => blocking.add(n));
    }
  }

  recommended.delete(issue.number);
  blocking.delete(issue.number);

  return { recommended, blocking };
}

async function listIssues() {
  const all = [];

  for (let page = 1; page <= 30; page += 1) {
    const batch = await rest(
      `/repos/${OWNER}/${REPO}/issues?state=all&per_page=100&page=${page}`,
      REPO_TOKEN,
    );

    if (!Array.isArray(batch)) {
      throw new Error(
        'La API de issues no ha devuelto un listado.',
      );
    }

    all.push(
      ...batch.filter((issue) => !issue.pull_request),
    );

    if (batch.length < 100) {
      break;
    }

    if (page === 30) {
      throw new Error(
        'Demasiadas páginas de issues: revisa la paginación.',
      );
    }
  }

  return all.filter(
    (issue) =>
      /^\[[A-Z]+\d+\]/.test(issue.title) ||
      /^### Área\s*$/m.test(issue.body || '') ||
      /^- \*\*Área:\*\*/m.test(issue.body || ''),
  );
}

async function reconcileLabels(issue, metadata) {
  const expected = [
    AREA[metadata.Área],
    FASE[metadata.Fase],
  ];

  const current = new Set(
    issue.labels.map((label) => label.name),
  );

  const unwanted = [...current].filter(
    (name) =>
      /^(area:|phase:)/.test(name) &&
      !expected.includes(name),
  );

  if (DRY_RUN) {
    return;
  }

  for (const name of unwanted) {
    await rest(
      `/repos/${OWNER}/${REPO}/issues/${issue.number}/labels/${encodeURIComponent(name)}`,
      REPO_TOKEN,
      'DELETE',
    );
  }

  const missing = expected.filter(
    (name) => !current.has(name),
  );

  if (missing.length) {
    await rest(
      `/repos/${OWNER}/${REPO}/issues/${issue.number}/labels`,
      REPO_TOKEN,
      'POST',
      { labels: missing },
    );
  }
}

async function relationsFor(issues) {
  const known = new Map(
    issues.map((issue) => [issue.number, issue]),
  );

  const relations = new Map();

  for (const issue of issues) {
    const declared = declaredRelations(issue);

    for (const number of [
      ...declared.recommended,
      ...declared.blocking,
    ]) {
      if (!known.has(number)) {
        throw new Error(
          `#${issue.number}: dependencia #${number} ajena al backlog. Revísala antes de sincronizar.`,
        );
      }
    }

    const path =
      `/repos/${OWNER}/${REPO}/issues/${issue.number}` +
      '/dependencies/blocked_by';

    const native = await rest(path, REPO_TOKEN);

    if (!Array.isArray(native)) {
      throw new Error(
        `Respuesta de dependencias inesperada en #${issue.number}.`,
      );
    }

    const nativeSet = new Set(
      native.map((entry) => entry.number),
    );

    // Solo añadimos bloqueos explícitos; nunca recomendaciones.
    for (const number of declared.blocking) {
      if (nativeSet.has(number) || DRY_RUN) {
        continue;
      }

      await rest(path, REPO_TOKEN, 'POST', {
        issue_id: known.get(number).id,
      });

      nativeSet.add(number);
      await PAUSE(300);
    }

    relations.set(issue.number, {
      recommended: declared.recommended,
      blocking: nativeSet,
    });
  }

  return relations;
}

function relationValues(issues, relations) {
  const inverse = new Map(
    issues.map((issue) => [
      issue.number,
      {
        recommended: new Set(),
        blocking: new Set(),
      },
    ]),
  );

  for (const issue of issues) {
    const rel = relations.get(issue.number);

    for (const [kind, group] of Object.entries(rel)) {
      for (const number of group) {
        if (inverse.has(number)) {
          inverse.get(number)[kind].add(issue.number);
        }
      }
    }
  }

  const show = (numbers) =>
    [...numbers]
      .sort((a, b) => a - b)
      .map((n) => `#${n}`)
      .join(', ');

  const describe = (rel) =>
    [
      rel.recommended.size
        ? `Recomendadas: ${show(rel.recommended)}`
        : '',
      rel.blocking.size
        ? `Bloqueantes: ${show(rel.blocking)}`
        : '',
    ]
      .filter(Boolean)
      .join(' · ') || '—';

  const output = new Map();

  for (const issue of issues) {
    const rel = relations.get(issue.number);
    const back = inverse.get(issue.number);

    const hasRecommended =
      rel.recommended.size + back.recommended.size > 0;

    const hasBlocking =
      rel.blocking.size + back.blocking.size > 0;

    output.set(issue.number, {
      'Depende de': describe(rel),
      'Facilita a': describe(back),
      Relación:
        hasRecommended && hasBlocking
          ? 'Mixta'
          : hasBlocking
            ? 'Bloqueante'
            : hasRecommended
              ? 'Recomendada'
              : 'Sin relaciones',
      'N.º relaciones':
        rel.recommended.size +
        rel.blocking.size +
        back.recommended.size +
        back.blocking.size,
    });
  }

  return output;
}

const OWNER_QUERY = `
  query($login: String!, $repo: String!) {
    user(login: $login) {
      id
      projectsV2(first: 100) {
        nodes {
          id
          number
          title
          url
        }
      }
    }
    repository(owner: $login, name: $repo) {
      id
    }
  }
`;

const PROJECT_QUERY = `
  query($login: String!, $number: Int!) {
    user(login: $login) {
      projectV2(number: $number) {
        id
        number
        title
        url
        readme
        fields(first: 100) {
          nodes {
            ... on ProjectV2Field {
              id
              name
            }
            ... on ProjectV2SingleSelectField {
              id
              name
              options {
                id
                name
              }
            }
          }
        }
        views(first: 100) {
          nodes {
            name
          }
        }
        items(first: 100) {
          pageInfo {
            hasNextPage
          }
          nodes {
            id
            content {
              ... on Issue {
                number
                repository {
                  nameWithOwner
                }
              }
            }
            fieldValues(first: 40) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field {
                    ... on ProjectV2SingleSelectField {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldTextValue {
                  text
                  field {
                    ... on ProjectV2Field {
                      name
                    }
                  }
                }
                ... on ProjectV2ItemFieldNumberValue {
                  number
                  field {
                    ... on ProjectV2Field {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

async function getProject(number) {
  const result = await graphql(PROJECT_QUERY, {
    login: OWNER,
    number,
  });

  const project = result.user?.projectV2;

  if (!project) {
    throw new Error(
      `No se ha podido recuperar el Project #${number}.`,
    );
  }

  if (project.items.pageInfo.hasNextPage) {
    throw new Error(
      'El Project supera 100 items; ampliar paginación antes de sincronizar.',
    );
  }

  return project;
}

async function ensureProject() {
  const owner = await graphql(OWNER_QUERY, {
    login: OWNER,
    repo: REPO,
  });

  const matches = (
    owner.user?.projectsV2.nodes || []
  ).filter((p) => p.title === PROJECT_TITLE);

  if (matches.length > 1) {
    throw new Error(
      'Existen varios Projects con el mismo nombre.',
    );
  }

  if (matches.length === 1) {
    return getProject(matches[0].number);
  }

  const data = await graphql(
    `mutation($input:CreateProjectV2Input!) {
      createProjectV2(input:$input) {
        projectV2 { number url }
      }
    }`,
    {
      input: {
        ownerId: owner.user.id,
        repositoryId: owner.repository.id,
        title: PROJECT_TITLE,
      },
    },
  );

  console.log(
    `Project creado: ${data.createProjectV2.projectV2.url}`,
  );

  return getProject(
    data.createProjectV2.projectV2.number,
  );
}

async function ensureFields(project) {
  const existing = new Set(
    project.fields.nodes
      .filter(Boolean)
      .map((field) => field.name),
  );

  for (const config of FIELDS) {
    if (existing.has(config.name)) {
      continue;
    }

    const input = {
      projectId: project.id,
      name: config.name,
      dataType: config.type || 'SINGLE_SELECT',
    };

    if (config.values) {
      input.singleSelectOptions = config.values.map(
        (name, i) => ({
          name,
          description: name,
          color: config.colors[i],
        }),
      );
    }

    await graphql(
      `mutation($input:CreateProjectV2FieldInput!) {
        createProjectV2Field(input:$input) {
          projectV2Field {
            ... on ProjectV2Field { id }
            ... on ProjectV2SingleSelectField { id }
          }
        }
      }`,
      { input },
    );

    existing.add(config.name);
    console.log(`Campo creado: ${config.name}`);
    await PAUSE(200);
  }

  return getProject(project.number);
}

function currentValues(item) {
  const result = new Map();

  for (const entry of item?.fieldValues?.nodes || []) {
    if (!entry?.field?.name) {
      continue;
    }

    result.set(
      entry.field.name,
      entry.name ?? entry.text ?? entry.number,
    );
  }

  return result;
}

async function updateField(
  project,
  itemId,
  field,
  desired,
  current,
) {
  if (desired === null || desired === undefined) {
    return;
  }

  if (
    current.has(field.name) &&
    String(current.get(field.name)) === String(desired)
  ) {
    return;
  }

  const value =
    typeof desired === 'number'
      ? { number: desired }
      : field.options
        ? {
            singleSelectOptionId: field.options.find(
              (option) => option.name === desired,
            )?.id,
          }
        : { text: desired };

  if (
    value.singleSelectOptionId === undefined &&
    field.options
  ) {
    throw new Error(
      `Opción desconocida: ${field.name} = ${desired}`,
    );
  }

  await graphql(
    `mutation($input:UpdateProjectV2ItemFieldValueInput!) {
      updateProjectV2ItemFieldValue(input:$input) {
        projectV2Item { id }
      }
    }`,
    {
      input: {
        projectId: project.id,
        itemId,
        fieldId: field.id,
        value,
      },
    },
  );

  await PAUSE(WRITE_PAUSE_MS);
}

async function syncItems(project, issues, related) {
  const fields = new Map(
    project.fields.nodes
      .filter(Boolean)
      .map((field) => [field.name, field]),
  );

  const items = new Map(
    project.items.nodes
      .filter(
        (item) =>
          item.content?.repository?.nameWithOwner ===
          `${OWNER}/${REPO}`,
      )
      .map((item) => [
        item.content.number,
        item,
      ]),
  );

  const status = fields.get('Status');

  for (const [index, issue] of issues.entries()) {
    const metadata = issueMetadata(issue);

    await reconcileLabels(issue, metadata);

    let item = items.get(issue.number);
    const created = !item;

    if (!item) {
      const data = await graphql(
        `mutation($input:AddProjectV2ItemByIdInput!) {
          addProjectV2ItemById(input:$input) {
            item { id }
          }
        }`,
        {
          input: {
            projectId: project.id,
            contentId: issue.node_id,
          },
        },
      );

      item = data.addProjectV2ItemById.item;
    }

    const actual = currentValues(item);
    const values = {
      ...metadata,
      ...related.get(issue.number),
    };

    for (const config of FIELDS) {
      const field = fields.get(config.name);

      if (!field) {
        throw new Error(
          `Falta el campo del Project: ${config.name}`,
        );
      }

      let desired = values[config.name];

      // Si no hay orden explícito, respetar cambios manuales.
      if (
        config.name === 'Orden' &&
        desired === null
      ) {
        desired = actual.has('Orden')
          ? null
          : index + 1;
      }

      await updateField(
        project,
        item.id,
        field,
        desired,
        actual,
      );
    }

    if (status) {
      const eventAction = process.env.ISSUE_ACTION;
      let nextStatus = null;

      if (
        issue.state === 'closed' &&
        (
          created ||
          eventAction === 'closed' ||
          !actual.has('Status')
        )
      ) {
        nextStatus = 'Done';
      }

      if (
        issue.state === 'open' &&
        (
          created ||
          eventAction === 'reopened' ||
          !actual.has('Status')
        )
      ) {
        nextStatus = 'Todo';
      }

      const option = status.options?.find(
        (entry) =>
          entry.name.toLowerCase().replace(/\s/g, '') ===
          nextStatus?.toLowerCase().replace(/\s/g, ''),
      );

      if (option) {
        await updateField(
          project,
          item.id,
          status,
          option.name,
          actual,
        );
      }
    }

    console.log(
      `#${issue.number}: sincronizada${
        created ? ' (nueva)' : ''
      }.`,
    );
  }
}

async function ensureViews(project) {
  const restFields = await rest(
    `/users/${OWNER}/projectsV2/${project.number}/fields?per_page=100`,
    PROJECT_TOKEN,
  );

  const ids = new Map(
    restFields.map((field) => [
      field.name,
      field.id,
    ]),
  );

  const col = (names) =>
    names
      .map((name) => ids.get(name))
      .filter(Number.isInteger);

  const specs = [
    {
      name: '01 · Backlog completo',
      layout: 'table',
      group_by: col(['Fase']),
      sort_by: [[ids.get('Orden'), 'asc']],
      visible_fields: col([
        'Title',
        'Fase',
        'Área',
        'Impacto',
        'Esfuerzo',
        'Orden',
        'Status',
      ]),
    },
    {
      name: '02 · Por área',
      layout: 'table',
      group_by: col(['Área']),
      sort_by: [[ids.get('Orden'), 'asc']],
      visible_fields: col([
        'Title',
        'Área',
        'Fase',
        'Impacto',
        'Esfuerzo',
        'Orden',
        'Status',
      ]),
    },
    {
      name: '03 · Ejecución',
      layout: 'board',
      vertical_group_by: col(['Status']),
      visible_fields: col([
        'Title',
        'Status',
        'Área',
        'Fase',
        'Impacto',
      ]),
    },
    {
      name: '04 · Dependencias',
      layout: 'table',
      group_by: col(['Relación']),
      sort_by: [
        [ids.get('N.º relaciones'), 'desc'],
        [ids.get('Orden'), 'asc'],
      ],
      visible_fields: col([
        'Title',
        'Fase',
        'Relación',
        'Depende de',
        'Facilita a',
        'N.º relaciones',
        'Status',
      ]),
    },
  ];

  const existing = new Set(
    project.views.nodes.map((v) => v.name),
  );

  const account = await rest(
    `/users/${OWNER}`,
    REPO_TOKEN,
  );

  for (const spec of specs) {
    if (existing.has(spec.name)) {
      continue;
    }

    const path =
      `/users/${account.id}/projectsV2/` +
      `${project.number}/views`;

    const request = {
      ...spec,
      filter: 'is:issue',
    };

    request.sort_by = request.sort_by?.filter(
      ([field]) => Number.isInteger(field),
    );

    try {
      await rest(
        path,
        PROJECT_TOKEN,
        'POST',
        request,
      );

      console.log(
        `Vista configurada: ${spec.name}`,
      );
    } catch (error) {
      console.warn(
        `${spec.name}: no se admitió la configuración avanzada (${error.message}).`,
      );

      try {
        await rest(
          path,
          PROJECT_TOKEN,
          'POST',
          {
            name: spec.name,
            layout: spec.layout,
            filter: 'is:issue',
            visible_fields: spec.visible_fields,
          },
        );
      } catch (restError) {
        console.warn(
          `REST sin éxito (${restError.message}). Se utiliza GraphQL para crear la vista.`,
        );

        const graphFields = project.fields.nodes
          .filter((field) =>
            [
              'Fase',
              'Área',
              'Impacto',
              'Esfuerzo',
              'Reindexación',
              'Orden',
              'Relación',
              'Depende de',
              'Facilita a',
              'N.º relaciones',
            ].includes(field.name),
          )
          .map((field) => field.id);

        await graphql(
          `mutation($input:CreateProjectV2ViewInput!) {
            createProjectV2View(input:$input) {
              projectV2View { id }
            }
          }`,
          {
            input: {
              projectId: project.id,
              name: spec.name,
              layout:
                spec.layout === 'table'
                  ? 'TABLE_LAYOUT'
                  : 'BOARD_LAYOUT',
              configuration: {
                visibleFieldIds: graphFields,
              },
            },
          },
        );
      }

      console.warn(
        `Revisa manualmente Group by y Sort by en: ${spec.name}.`,
      );
    }

    await PAUSE(250);
  }
}

function projectReadme(
  project,
  issues,
  relations,
  related,
) {
  const begin = '<!-- JNR_DEPENDENCIES_BEGIN -->';
  const end = '<!-- JNR_DEPENDENCIES_END -->';

  const lines = [
    begin,
    '## Relaciones del backlog (actualización automática)',
    '',
    'Los vínculos recomendados **no bloquean**. Las dependencias bloqueantes se gestionan también mediante **Relationships** en cada issue.',
    '',
    '| Iniciativa | Depende de | Facilita a |',
    '| --- | --- | --- |',
    ...issues.map(
      (issue) =>
        `| [#${issue.number}](${issue.html_url}) | ` +
        `${related.get(issue.number)['Depende de']} | ` +
        `${related.get(issue.number)['Facilita a']} |`,
    ),
    '',
    '```mermaid',
    'flowchart LR',
    ...issues.map(
      (issue) =>
        `  i${issue.number}["#${issue.number}"]`,
    ),
    ...issues.flatMap((issue) => {
      const rel = relations.get(issue.number);

      return [
        ...[...rel.recommended].map(
          (number) =>
            `  i${number} -.-> i${issue.number}`,
        ),
        ...[...rel.blocking].map(
          (number) =>
            `  i${number} --> i${issue.number}`,
        ),
      ];
    }),
    ...issues.map(
      (issue) =>
        `  click i${issue.number} "${issue.html_url}"`,
    ),
    '```',
    '',
    'Flecha continua = bloqueo real. Flecha discontinua = recomendación de orden. Si la vista de README no representa Mermaid, utiliza la tabla anterior.',
    end,
  ];

  const sectionText = lines.join('\n');
  const current = project.readme || '';

  const start = current.indexOf(begin);
  const finish = current.indexOf(end);

  if (start >= 0 && finish > start) {
    return (
      current.slice(0, start) +
      sectionText +
      current.slice(finish + end.length)
    );
  }

  return [current.trim(), sectionText]
    .filter(Boolean)
    .join('\n\n');
}

async function main() {
  if (
    process.env.GITHUB_REPOSITORY !==
    `${OWNER}/${REPO}`
  ) {
    throw new Error(
      'Este workflow solo puede ejecutarse en JNR.',
    );
  }

  const issues = await listIssues();

  issues.sort(
    (a, b) => a.number - b.number,
  );

  const metadata = issues.map((issue) => ({
    issue,
    fields: issueMetadata(issue),
  }));

  console.log(
    `Issues de mejora verificadas: ${metadata.length}.`,
  );

  if (DRY_RUN) {
    for (const { issue, fields } of metadata) {
      console.log(
        `#${issue.number}: ` +
          `${fields.Fase}, ` +
          `${fields.Área}, ` +
          `${fields.Impacto}, ` +
          `${fields.Esfuerzo}`,
      );
    }

    console.log(
      'Simulación sin crear ni modificar Project, etiquetas o dependencias.',
    );

    return;
  }

  if (!PROJECT_TOKEN) {
    throw new Error(
      'Falta el secreto JNR_PROJECT_PAT (PAT classic con permisos project y repo).',
    );
  }

  if (!issues.length) {
    throw new Error(
      'No hay issues de mejora con el formato esperado.',
    );
  }

  const relations = await relationsFor(issues);
  const related = relationValues(issues, relations);

  let project = await ensureProject();

  project = await ensureFields(project);

  await syncItems(
    project,
    issues,
    related,
  );

  await ensureViews(project);

  const readme = projectReadme(
    project,
    issues,
    relations,
    related,
  );

  if (readme !== (project.readme || '')) {
    await graphql(
      `mutation($input:UpdateProjectV2Input!) {
        updateProjectV2(input:$input) {
          projectV2 { id }
        }
      }`,
      {
        input: {
          projectId: project.id,
          readme,
        },
      },
    );
  }

  console.log(
    `Proyecto actualizado: ${project.url}`,
  );

  const { appendFile } = await import(
    'node:fs/promises'
  );

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `## JNR Project\n\n` +
        `- [Abrir el Project](${project.url})\n` +
        `- Issues: ${issues.length}\n` +
        `- Vistas previstas: 4\n` +
        `- Fuente de datos: descripciones de GitHub Issues y relaciones nativas.\n`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
