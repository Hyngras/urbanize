import fs from 'node:fs';
import path from 'node:path';

const downloads = '/Users/hyngridsouza/Downloads';
const finalDir = path.join(downloads, 'kommo-import-salesbots-final');
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outDir = path.join(downloads, `kommo-salesbots-orcamento-vista-da-serra-backup-${stamp}`);
const visualDir = path.join(outDir, 'visual-importavel');
const pureDir = path.join(outDir, 'json-puro');

const STATUS = {
  contatoInicial: 107317519,
  coletaInformacoes: 107317523,
  clienteRecorrente: 142,
  pipeline: 13907427,
};

const FIELD_REPLACEMENTS = [
  ['{{lead.cf.1043016}}', '{{lead.cf.1043232}}'],
  ['{{lead.cf.1043018}}', '{{lead.cf.1043234}}'],
  ['{{Data de Check-in}}', '{{lead.cf.1043232}}'],
  ['{{Data de Check-out}}', '{{lead.cf.1043234}}'],
];

const orderedSources = [
  {
    number: '01',
    find: (files) => files.find((file) => file.includes('Boas-vindas') && file.endsWith('.json')),
    fallbackName: 'Salesbot1_BoasVindasOrcamento.json',
  },
  { number: '02', file: path.join(finalDir, 'Salesbot2_FollowupOrcamento.json') },
  { number: '03', file: path.join(finalDir, 'Salesbot3_ReservaConfirmada.json') },
  { number: '04', file: path.join(finalDir, 'Salesbot4_PreCheckin.json') },
  { number: '05', file: path.join(finalDir, 'Salesbot5_PosVenda.json') },
  { number: '06', file: path.join(finalDir, 'Salesbot6_ColetaInformacoes.json') },
  { number: '07', file: path.join(finalDir, 'Salesbot7_Negociacao.json') },
  { number: '08', file: path.join(finalDir, 'Salesbot8_Hospedado.json') },
  { number: '09', file: path.join(finalDir, 'Salesbot9_ClienteRecorrente.json') },
  { number: '10', file: path.join(finalDir, 'Salesbot10_ClosedLost.json') },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function listDownloadJsons() {
  return fs.readdirSync(downloads)
    .filter((file) => file.endsWith('.json'))
    .map((file) => path.join(downloads, file));
}

function readExport(file) {
  const root = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!root.model?.text) {
    throw new Error(`${file} não parece ser export/import de Salesbot do Kommo`);
  }

  return {
    file,
    root,
    bot: JSON.parse(root.model.text),
    positions: root.model.positions ? JSON.parse(root.model.positions) : [],
  };
}

function writeExport(item, file) {
  item.root.model.text = JSON.stringify(item.bot);
  if (item.root.model.positions) {
    item.root.model.positions = JSON.stringify(item.positions);
  }
  fs.writeFileSync(file, `${JSON.stringify(item.root, null, 2)}\n`);
}

function writePure(item, file) {
  fs.writeFileSync(file, `${JSON.stringify(item.bot, null, 2)}\n`);
}

function slug(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function deepReplace(value, replacements) {
  if (typeof value === 'string') {
    return replacements.reduce((acc, [from, to]) => acc.split(from).join(to), value);
  }
  if (Array.isArray(value)) return value.map((entry) => deepReplace(entry, replacements));
  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) value[key] = deepReplace(value[key], replacements);
  }
  return value;
}

function replaceEverywhere(item, replacements) {
  item.bot = deepReplace(item.bot, replacements);
  item.positions = deepReplace(item.positions, replacements);
}

function goto(step) {
  return { handler: 'goto', params: { type: 'question', step } };
}

function button(value, step) {
  return { value, params: [goto(step)], synonyms: [] };
}

function setButtons(item, step, entries) {
  const block = item.bot[String(step)];
  if (!block) throw new Error(`${item.file}: bloco ${step} não encontrado`);

  const send = block.question?.find((entry) => entry.handler === 'send_message');
  if (send) send.params.buttons = entries.map(([text]) => ({ type: 'inline', text }));
  block.answer = [{ handler: 'buttons', params: entries.map(([text, target]) => button(text, target)) }];

  const position = item.positions.find((entry) => entry.type === 'question' && entry.step === step);
  const action = position?.actions?.find((entry) => entry.params?.handler === 'send_message');
  if (action) {
    action.params.params.buttons = entries.map(([text]) => ({ type: 'inline', text }));
    action.synonyms = entries.map(() => []);
  }
}

function setStatus(item, step, statusId) {
  const block = item.bot[String(step)];
  const action = block?.question?.find((entry) => entry.handler === 'action' && entry.params?.name === 'change_status');
  if (action) {
    action.params.params.value = statusId;
    action.params.params.pipeline_id = STATUS.pipeline;
  }

  const position = item.positions.find((entry) => entry.type === 'question' && entry.step === step);
  const pAction = position?.actions?.find((entry) => entry.params?.handler === 'action' && entry.params?.params?.name === 'change_status');
  if (pAction) {
    pAction.params.params.params.value = statusId;
    pAction.params.params.params.pipeline_id = STATUS.pipeline;
  }
}

function setFirstMessageText(item, step, text) {
  const send = item.bot[String(step)]?.question?.find((entry) => entry.handler === 'send_message');
  if (send) send.params.text = text;

  const position = item.positions.find((entry) => entry.type === 'question' && entry.step === step);
  const action = position?.actions?.find((entry) => entry.params?.handler === 'send_message');
  if (action) action.params.params.text = text;
}

function patchNps(item) {
  if (item.root.model.name !== 'Pos-venda NPS — Vista da Serra') return;
  setButtons(item, 0, [['1', 10], ['2', 10], ['3', 2], ['4', 2], ['5', 1]]);
  setButtons(item, 1, [['Avaliar no Google', 90], ['Ja quero remarcar!', 91], ['Deixar comentario', 93]]);
  setStatus(item, 999, STATUS.clienteRecorrente);

  const note = item.bot['11']?.question?.find((entry) => entry.handler === 'action' && entry.params?.name === 'add_note');
  if (note) {
    note.params.params.text = 'NPS_CRITICO: reclamacao nota 1-2: {{message_text}} — EQUIPE DEVE ENTRAR EM CONTATO COM PRIORIDADE';
  }
}

function patchClienteRecorrente(item) {
  if (item.root.model.name !== 'Cliente Recorrente — Vista da Serra') return;
  setFirstMessageText(
    item,
    0,
    'Oi, {{lead.name}}! 😊\n\nQue bom ter você de volta à Vista da Serra.\n\nQuer que a gente prepare uma nova cotação para sua próxima estadia? Você pretende retornar para a mesma cabana?',
  );
  setButtons(item, 0, [
    ['Quero novo orçamento', 1],
    ['Ver disponibilidade', 1],
    ['Falar com atendente', 3],
    ['Agora não', 4],
  ]);
  setStatus(item, 5, STATUS.coletaInformacoes);
}

function patchHospedado(item) {
  if (item.root.model.name !== 'Hospedado — Vista da Serra') return;
  setButtons(item, 0, [
    ['Tudo certo', 1],
    ['Preciso de ajuda', 2],
    ['Pedir informação', 3],
    ['🚨 Problema urgente', 2],
  ]);
  replaceEverywhere(item, [
    [
      'Se for urgente, escreva URGENTE junto da mensagem.\n\nSe for urgente, escreva URGENTE junto da mensagem.',
      'Se for urgente, escreva URGENTE junto da mensagem.',
    ],
  ]);
}

function patchPreCheckin(item) {
  if (item.root.model.name !== 'Pre Check-in — Vista da Serra') return;
  setButtons(item, 0, [
    ['⏰ Horários', 1],
    ['📍 Localização', 2],
    ['📶 Wi-Fi e guia', 8],
    ['❓ Tenho dúvida', 5],
  ]);
  setButtons(item, 1, [['✅ Tudo certo!', 3], ['❓ Tenho dúvida', 5]]);
  setButtons(item, 2, [['✅ Anotado!', 3], ['❓ Tenho dúvida', 5]]);
  if (item.bot['8']) setButtons(item, 8, [['✅ Tudo certo!', 3], ['❓ Tenho dúvida', 5]]);
}

function patchBoasVindas(item) {
  if (item.root.model.name !== 'Boas-vindas + Orçamento — Vista da Serra') return;

  for (const step of ['21', '22', '23', '24']) {
    delete item.bot[step];
  }

  item.positions = item.positions.filter((entry) => ![21, 22, 23, 24].includes(entry.step));
}

function analyze(bot) {
  const edges = [];
  function walk(from, value) {
    if (!value || typeof value !== 'object') return;
    if (value.handler === 'goto' && value.params?.type === 'question') {
      edges.push({ from, to: String(value.params.step), via: 'goto' });
    }
    if (value.handler === 'wait_answer') {
      edges.push({ from, to: String(value.params.step), via: 'wait_answer' });
    }
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) child.forEach((entry) => walk(from, entry));
      else walk(from, child);
    }
  }

  for (const [key, block] of Object.entries(bot)) {
    if (key !== 'conversation') walk(key, block);
  }

  const blocks = new Set(Object.keys(bot).filter((key) => key !== 'conversation'));
  const reachable = new Set(['0']);
  let changed = true;
  while (changed) {
    changed = false;
    for (const edge of edges) {
      if (reachable.has(edge.from) && blocks.has(edge.to) && !reachable.has(edge.to)) {
        reachable.add(edge.to);
        changed = true;
      }
    }
  }

  return {
    blocks: blocks.size,
    missingEdges: edges.filter((edge) => !blocks.has(edge.to)),
    orphanBlocks: [...blocks].filter((key) => !reachable.has(key)),
    emptyButtons: Object.entries(bot)
      .filter(([, block]) => (block.answer || []).some((entry) => entry.handler === 'buttons' && Array.isArray(entry.params) && entry.params.length === 0))
      .map(([key]) => key),
    oldDateFields: JSON.stringify(bot).includes('1043016') || JSON.stringify(bot).includes('1043018'),
  };
}

ensureDir(visualDir);
ensureDir(pureDir);

const downloadJsons = listDownloadJsons();
const report = [];

for (const source of orderedSources) {
  const file = source.file || source.find(downloadJsons);
  if (!file || !fs.existsSync(file)) {
    throw new Error(`Arquivo de origem não encontrado para robô ${source.number}`);
  }

  const item = readExport(file);
  replaceEverywhere(item, FIELD_REPLACEMENTS);
  patchPreCheckin(item);
  patchHospedado(item);
  patchNps(item);
  patchClienteRecorrente(item);
  patchBoasVindas(item);

  const name = item.root.model.name || path.basename(file, '.json');
  const outName = `${source.number}_${slug(name)}.json`;
  const validation = analyze(item.bot);

  writeExport(item, path.join(visualDir, outName));
  writePure(item, path.join(pureDir, outName));

  report.push({
    number: source.number,
    name,
    visualFile: path.join('visual-importavel', outName),
    pureJsonFile: path.join('json-puro', outName),
    validation,
  });
}

const readme = [
  '# Backup Salesbots Kommo - Orçamento Vista da Serra',
  '',
  `Gerado em: ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Recife' })}`,
  '',
  'Pastas:',
  '- `visual-importavel`: arquivos completos de importação do Kommo, com `model.text` e `model.positions`.',
  '- `json-puro`: somente o JSON interno do fluxo, útil para auditoria/correção técnica.',
  '',
  'Observação:',
  '- Se um robô for salvo pelo modo código dentro do Kommo, o próprio Kommo pode impedir abrir aquele mesmo robô no editor visual depois.',
  '- Para preservar as duas opções, importe/copiei uma versão separada quando quiser editar visualmente.',
  '',
  'Robôs incluídos:',
  ...report.map((entry) => `- ${entry.number}: ${entry.name}`),
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'README.md'), readme);
fs.writeFileSync(path.join(outDir, 'validation-report.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(outDir);
