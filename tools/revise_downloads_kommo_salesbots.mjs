import fs from 'node:fs';
import path from 'node:path';

const dir = '/Users/hyngridsouza/Downloads/kommo-import-salesbots-final';
const backupDir = path.join(dir, `_backup_before_revisions_${new Date().toISOString().replace(/[:.]/g, '-')}`);

const GOOGLE_REVIEW_URL =
  'https://www.google.com/search?q=Vista+da+Serra+Ch%C3%A3+Grande+PE+avalia%C3%A7%C3%A3o+Google';

const FIELD = {
  checkin: '{{lead.cf.1043016}}',
  checkout: '{{lead.cf.1043018}}',
  guests: '{{lead.cf.1043020}}',
};

const STATUS = {
  contatoInicial: 107317519,
  coletaInformacoes: 107317523,
  orcamentoEnviado: 107317527,
  reservaConfirmada: 107317531,
};

function readBot(file) {
  const fullPath = path.join(dir, file);
  const root = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  return {
    file,
    fullPath,
    root,
    text: JSON.parse(root.model.text),
    positions: JSON.parse(root.model.positions),
  };
}

function writeBot(bot) {
  bot.root.model.text = JSON.stringify(bot.text);
  bot.root.model.positions = JSON.stringify(bot.positions);
  fs.writeFileSync(bot.fullPath, `${JSON.stringify(bot.root, null, 2)}\n`);
}

function deepReplace(value, replacements) {
  if (typeof value === 'string') {
    return replacements.reduce((current, [find, replace]) => current.split(find).join(replace), value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepReplace(item, replacements));
  }

  if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      value[key] = deepReplace(value[key], replacements);
    }
  }

  return value;
}

function syncTextAndPositions(bot, replacements) {
  bot.text = deepReplace(bot.text, replacements);
  bot.positions = deepReplace(bot.positions, replacements);
}

function findQuestionPosition(bot, step) {
  const position = bot.positions.find((item) => item.type === 'question' && item.step === step);
  if (!position) {
    throw new Error(`${bot.file}: position for step ${step} not found`);
  }

  return position;
}

function maxActionId(bot) {
  let max = 100;

  for (const position of bot.positions) {
    for (const action of position.actions || []) {
      if (typeof action.id === 'number') {
        max = Math.max(max, action.id);
      }
    }
  }

  return max;
}

function action(name, params) {
  return {
    handler: 'action',
    params: {
      name,
      params,
    },
  };
}

function positionAction(id, sort, handler, params) {
  return {
    id,
    sort,
    params: {
      handler,
      params,
    },
    links: [],
  };
}

function addStatusActionToStep(bot, step, statusId) {
  const block = bot.text[String(step)];
  const statusAction = action('change_status', {
    value: statusId,
    pipeline_id: 13907427,
  });

  const gotoIndex = block.question.findIndex((item) => item.handler === 'goto');
  if (!block.question.some((item) => item.handler === 'action' && item.params?.name === 'change_status')) {
    block.question.splice(gotoIndex === -1 ? block.question.length : gotoIndex, 0, statusAction);
  }

  const position = findQuestionPosition(bot, step);
  if (!position.actions.some((item) => item.params?.handler === 'action' && item.params?.params?.name === 'change_status')) {
    const nextId = maxActionId(bot) + 1;
    position.actions.push(
      positionAction(nextId, position.actions.length, 'action', {
        name: 'change_status',
        params: {
          value: statusId,
          pipeline_id: 13907427,
        },
      }),
    );
  }
}

function addNoteActionToStep(bot, step, noteText) {
  const block = bot.text[String(step)];
  const noteAction = action('add_note', {
    note_type: 4,
    element_type: 1,
    text: noteText,
    type: 1,
    contact_type: 'main',
  });

  if (!block.question.some((item) => JSON.stringify(item).includes(noteText))) {
    block.question.unshift(noteAction);
  }

  const position = findQuestionPosition(bot, step);
  if (!position.actions.some((item) => JSON.stringify(item).includes(noteText))) {
    const nextId = maxActionId(bot) + 1;
    position.actions.unshift(positionAction(nextId, 0, 'action', noteAction.params));
    position.actions.forEach((item, index) => {
      item.sort = index;
    });
  }
}

function updateStartButtons(bot, step, buttons) {
  const block = bot.text[String(step)];
  const send = block.question.find((item) => item.handler === 'send_message');
  send.params.buttons = buttons.map((text) => ({ type: 'inline', text }));

  const answer = block.answer.find((item) => item.handler === 'buttons');
  answer.params = buttons.map((value, index) => ({
    value,
    params: answer.params[index]?.params || [{ handler: 'goto', params: { type: 'finish', step: 99 } }],
    synonyms: [],
  }));

  const position = findQuestionPosition(bot, step);
  const actionItem = position.actions.find((item) => item.params?.handler === 'send_message');
  actionItem.params.params.buttons = send.params.buttons;
  actionItem.synonyms = buttons.map(() => []);
}

function reviseGlobalVariables(bot) {
  syncTextAndPositions(bot, [
    ['{{Data de Check-in}}', FIELD.checkin],
    ['{{Data de Check-out}}', FIELD.checkout],
    ['{{Quantidade de Hóspedes}}', FIELD.guests],
  ]);
}

function reviseBoasVindas() {
  const bot = readBot('Salesbot1_BoasVindas.json');
  reviseGlobalVariables(bot);
  for (const block of Object.values(bot.text)) {
    if (!block || typeof block !== 'object') {
      continue;
    }

    for (const item of block.question || []) {
      if (item.handler === 'goto' && item.params?.type === 'finish') {
        item.params.step = 99;
      }
    }
  }
  writeBot(bot);
}

function reviseFollowup() {
  const bot = readBot('Salesbot2_FollowupOrcamento.json');
  addNoteActionToStep(bot, 3, 'LEAD_MORNO: cliente pediu para pensar mais no follow-up de orçamento. Retomar em 15 dias.');
  writeBot(bot);
}

function reviseReservaConfirmada() {
  const bot = readBot('Salesbot3_ReservaConfirmada.json');
  reviseGlobalVariables(bot);
  syncTextAndPositions(bot, [
    [
      '🏡 Ao chegar, sua cabana é a *Pitiguari/Graúna*. Nossa colaboradora estará à espera.',
      '🏡 Ao chegar, a equipe confirma a cabana reservada e orienta sua entrada. Nossa colaboradora estará à espera.',
    ],
    [
      '📋 Informações de chegada',
      '📍 Abrir no Waze',
    ],
  ]);
  writeBot(bot);
}

function revisePreCheckin() {
  const bot = readBot('Salesbot4_PreCheckin.json');
  reviseGlobalVariables(bot);
  syncTextAndPositions(bot, [
    [
      '⏰ Horários e regras',
      '⏰ Horários',
    ],
    [
      '🗺️ Como chegar',
      '📍 Localização',
    ],
    [
      '❓ Tenho dúvida',
      '📶 Wi-Fi e guia',
    ],
    [
      '→ Cabana Pitiguari/Graúna (segunda à direita)',
      '→ A cabana e orientação de entrada serão confirmadas pela equipe',
    ],
    [
      '📶 Wi-Fi no guia:\nhttps://canva.link/gptxjsgd2qn9y7t',
      '📶 Wi-Fi, restaurantes próximos e atrações estão no guia:\nhttps://canva.link/gptxjsgd2qn9y7t',
    ],
  ]);

  const setButtons = (step, buttons) => {
    const block = bot.text[String(step)];
    const send = block.question.find((item) => item.handler === 'send_message');
    send.params.buttons = buttons.map(({ text }) => ({ type: 'inline', text }));
    block.answer = [
      {
        handler: 'buttons',
        params: buttons.map(({ text, target }) => ({
          value: text,
          params: [{ handler: 'goto', params: { type: 'question', step: target } }],
          synonyms: [],
        })),
      },
    ];

    const position = findQuestionPosition(bot, step);
    const sendAction = position.actions.find((item) => item.params?.handler === 'send_message');
    sendAction.params.params.buttons = send.params.buttons;
    sendAction.synonyms = buttons.map(() => []);
  };

  setButtons(0, [
    { text: '⏰ Horários', target: 1 },
    { text: '📍 Localização', target: 2 },
    { text: '📶 Wi-Fi e guia', target: 8 },
    { text: '❓ Tenho dúvida', target: 5 },
  ]);

  setButtons(1, [
    { text: '✅ Tudo certo!', target: 3 },
    { text: '❓ Tenho dúvida', target: 5 },
  ]);

  setButtons(2, [
    { text: '✅ Anotado!', target: 3 },
    { text: '❓ Tenho dúvida', target: 5 },
  ]);

  if (!bot.text['8']) {
    bot.text['8'] = {
      question: [
        {
          handler: 'send_message',
          params: {
            type: 'external',
            text: '📶 *Wi-Fi, restaurantes e guia completo*\n\nTodas as informações práticas da estadia estão neste guia:\nhttps://canva.link/gptxjsgd2qn9y7t\n\nLá você encontra Wi-Fi, café da manhã, atrações, restaurantes próximos e regras da Vista da Serra.',
            tag: '',
            send_to_all_chat_sources: true,
            recipient: {
              type: 'all_contacts',
              way_of_communication: 'over_all',
            },
            is_in_starting_block: false,
            on_error: null,
            buttons: [
              { type: 'inline', text: '✅ Tudo certo!' },
              { type: 'inline', text: '❓ Tenho dúvida' },
            ],
          },
        },
      ],
      block_uuid: '5b5f36e8-6a72-4c95-92e2-8a9e7c9c4df9',
      answer: [
        {
          handler: 'buttons',
          params: [
            {
              value: '✅ Tudo certo!',
              params: [{ handler: 'goto', params: { type: 'question', step: 3 } }],
              synonyms: [],
            },
            {
              value: '❓ Tenho dúvida',
              params: [{ handler: 'goto', params: { type: 'question', step: 5 } }],
              synonyms: [],
            },
          ],
        },
      ],
    };
  }

  if (!bot.positions.some((item) => item.type === 'question' && item.step === 8)) {
    const finish = bot.positions.find((item) => item.type === 'finish');
    const id = Math.max(...bot.positions.map((item) => item.id)) + 1;
    bot.positions.push({
      id,
      x: 1680,
      y: 260,
      z: Math.max(...bot.positions.map((item) => item.z || 0)) + 1,
      height: 200,
      width: 400,
      type: 'question',
      step: 8,
      name: 'Enviar mensagem',
      deletable: true,
      block_uuid: bot.text['8'].block_uuid,
      actions: [
        {
          id: maxActionId(bot) + 1,
          sort: 0,
          synonyms: [[], []],
          params: {
            handler: 'send_message',
            params: bot.text['8'].question[0].params,
          },
          links: [],
        },
      ],
      goto: finish ? { block: finish.id } : null,
      no_answer: null,
      on_error: null,
    });
  }

  writeBot(bot);
}

function revisePosVenda() {
  const bot = readBot('Salesbot5_PosVenda.json');
  syncTextAndPositions(bot, [
    ['👉 [COLE AQUI O LINK DO GOOGLE]', `👉 ${GOOGLE_REVIEW_URL}`],
    ['RECLAMACAO (nota 1-2): {{message_text}} — EQUIPE DEVE ENTRAR EM CONTATO', 'NPS_CRITICO: reclamacao nota 1-2: {{message_text}} — EQUIPE DEVE ENTRAR EM CONTATO COM PRIORIDADE'],
    ['PROMOTOR — enviou link do Google para avaliacao.', `PROMOTOR — enviou link do Google para avaliacao: ${GOOGLE_REVIEW_URL}`],
  ]);
  writeBot(bot);
}

function reviseColeta() {
  const bot = readBot('Salesbot6_ColetaInformacoes.json');
  addStatusActionToStep(bot, 2, STATUS.orcamentoEnviado);
  syncTextAndPositions(bot, [
    ['Recebido! Obrigada. Nossa equipe vai conferir os dados e preparar o orçamento. 🏔️', 'Recebido! Obrigada. Nossa equipe vai conferir os dados e preparar o orçamento. Já encaminhei para a etapa de orçamento enviado. 🏔️'],
  ]);
  writeBot(bot);
}

function reviseHospedado() {
  const bot = readBot('Salesbot8_Hospedado.json');
  updateStartButtons(bot, 0, ['Tudo certo', 'Preciso de ajuda', 'Pedir informação', '🚨 Problema urgente']);
  const answer = bot.text['0'].answer.find((item) => item.handler === 'buttons');
  answer.params[3].params = [{ handler: 'goto', params: { type: 'question', step: 2 } }];
  syncTextAndPositions(bot, [
    ['Sinto muito por isso. Me diga o que aconteceu para acionarmos a equipe.', 'Sinto muito por isso. Me diga o que aconteceu para acionarmos a equipe. Se for urgente, escreva URGENTE junto da mensagem.'],
    ['Solicitacao de ajuda durante hospedagem: {{message_text}}', 'ALERTA HOSPEDAGEM: solicitacao de ajuda/problema urgente durante hospedagem: {{message_text}}'],
  ]);
  writeBot(bot);
}

function reviseClienteRecorrente() {
  const bot = readBot('Salesbot9_ClienteRecorrente.json');
  syncTextAndPositions(bot, [
    [
      'Quer que a gente prepare uma nova cotação para sua próxima estadia?',
      'Quer que a gente prepare uma nova cotação para sua próxima estadia? Você pretende retornar para a mesma cabana?',
    ],
    [
      'Perfeito! Me envie as datas desejadas e a quantidade de hóspedes. 📅',
      'Perfeito! Me envie as datas desejadas, quantidade de hóspedes e se quer repetir a mesma cabana. 📅',
    ],
    [
      'Cliente recorrente solicitou novo orçamento: {{message_text}}',
      'Cliente recorrente solicitou novo orçamento / mesma cabana: {{message_text}}',
    ],
  ]);
  writeBot(bot);
}

function validate() {
  const files = fs.readdirSync(dir).filter((file) => file.endsWith('.json')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const report = [];

  for (const file of files) {
    const bot = readBot(file);
    const raw = JSON.stringify(bot.root);
    const questionSteps = Object.keys(bot.text).filter((key) => key !== 'conversation').map(Number);
    const positionSteps = bot.positions.filter((item) => item.type === 'question').map((item) => item.step);
    const badGoto = bot.positions.filter((item) => item.goto && !bot.positions.some((other) => other.id === item.goto.block));
    const missingPositions = questionSteps.filter((step) => !positionSteps.includes(step));
    report.push({
      file,
      name: bot.root.model.name,
      badGoto: badGoto.length,
      missingPositions,
      oldPipelineRefs: raw.match(/10228883|78477675|78477403/g)?.length || 0,
      placeholderGoogle: raw.includes('[COLE AQUI O LINK DO GOOGLE]'),
      literalDateVars: raw.match(/{{Data de Check-in}}|{{Data de Check-out}}|{{Quantidade de Hóspedes}}/g)?.length || 0,
      fixedCabin: raw.includes('Pitiguari/Graúna'),
    });
  }

  return report;
}

fs.mkdirSync(backupDir, { recursive: true });
for (const file of fs.readdirSync(dir).filter((item) => item.endsWith('.json'))) {
  fs.copyFileSync(path.join(dir, file), path.join(backupDir, file));
}

reviseBoasVindas();
reviseFollowup();
reviseReservaConfirmada();
revisePreCheckin();
revisePosVenda();
reviseColeta();
reviseHospedado();
reviseClienteRecorrente();

const report = validate();
console.log(JSON.stringify({ backupDir, report }, null, 2));
