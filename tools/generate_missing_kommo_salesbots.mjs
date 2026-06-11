import { writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { join } from 'node:path';

const outDir = '/Users/hyngridsouza/DevLocal/CESAR/urbanize/kommo-import-salesbots-final';
mkdirSync(outDir, { recursive: true });

const pipelineId = 13907427;
const stages = {
  contatoInicial: 107317519,
  coleta: 107317523,
  orcamento: 107317527,
  negociacao: 107370219,
  reserva: 107317531,
  preCheckin: 107370279,
  hospedado: 107370339,
  posVenda: 107370663,
  clienteRecorrente: 142,
  lost: 143,
};

function sendMessage(text, buttons, isStart = false) {
  const params = {
    type: 'external',
    text,
    tag: '',
    send_to_all_chat_sources: true,
    recipient: { type: 'all_contacts', way_of_communication: 'over_all' },
    is_in_starting_block: isStart,
    on_error: null,
  };
  if (buttons?.length) {
    params.buttons = buttons.map((buttonText) => ({ type: 'inline', text: buttonText }));
  }
  return { handler: 'send_message', params };
}

function goto(step, type = 'question') {
  return { handler: 'goto', params: { type, step } };
}

function waitAnswer(step) {
  return { handler: 'wait_answer', params: { type: 'question', step } };
}

function addNote(text) {
  return {
    handler: 'action',
    params: {
      name: 'add_note',
      params: {
        note_type: 4,
        element_type: 1,
        text,
        type: 1,
        contact_type: 'main',
      },
    },
  };
}

function changeStatus(value) {
  return {
    handler: 'action',
    params: {
      name: 'change_status',
      params: { value, pipeline_id: pipelineId },
    },
  };
}

function block(question, answer) {
  const result = { question, block_uuid: randomUUID() };
  if (answer) result.answer = answer;
  return result;
}

function buttonsAnswer(map) {
  return [
    {
      handler: 'buttons',
      params: Object.entries(map).map(([value, target]) => ({
        value,
        params: [Array.isArray(target) ? target[0] : goto(target)],
        synonyms: [],
      })),
    },
  ];
}

function buildPositions(textBlocks) {
  const entries = Object.entries(textBlocks)
    .filter(([key]) => key !== 'conversation')
    .map(([key, value], index) => ({
      key,
      step: Number(key),
      block: value,
      index,
    }));

  const positions = [
    {
      id: 0,
      x: 0,
      y: 0,
      z: 1,
      height: 38,
      width: 170,
      type: 'start',
      step: -1,
      deletable: true,
      actions: [{ id: -3, sort: 0, params: { handler: '_start', params: [] }, links: [] }],
      goto: { block: 1 },
    },
  ];

  const stepToPositionId = new Map(entries.map((entry) => [entry.step, entry.index + 1]));
  const finishId = entries.length + 1;
  let actionId = 100;

  for (const entry of entries) {
    const actions = [];
    const question = entry.block.question || [];

    for (const [sort, action] of question.entries()) {
      const positionAction = {
        id: actionId++,
        sort,
        params: { handler: action.handler, params: action.params ?? [] },
        links: [],
      };
      if (action.handler === 'send_message' && action.params?.buttons) {
        positionAction.synonyms = action.params.buttons.map(() => []);
      } else if (action.handler === 'send_message') {
        positionAction.synonyms = [[]];
      }
      actions.push(positionAction);
    }

    const last = question[question.length - 1];
    let nextStep = null;
    if (last?.handler === 'goto') {
      nextStep = last.params?.step;
      actions.pop();
    }

    const position = {
      id: entry.index + 1,
      x: 420 + (entry.index % 4) * 420,
      y: Math.floor(entry.index / 4) * 260,
      z: entry.index + 2,
      height: 200,
      width: 400,
      type: 'question',
      step: entry.step,
      name: 'Enviar mensagem',
      deletable: true,
      block_uuid: entry.block.block_uuid,
      actions,
      goto: null,
      no_answer: null,
      on_error: null,
    };

    if (nextStep !== null) {
      position.goto = nextStep === 99 ? { block: finishId } : { block: stepToPositionId.get(Number(nextStep)) };
    }

    positions.push(position);
  }

  positions.push({
    id: finishId,
    x: 420,
    y: Math.ceil(entries.length / 4) * 260,
    z: finishId + 1,
    height: 0,
    width: 374,
    type: 'finish',
    step: 99,
    deletable: true,
    actions: [{ id: actionId++, sort: 0, params: { handler: '_stop', params: [] }, links: [] }],
  });
  positions.push({
    id: -1,
    x: -350,
    y: 0,
    z: 0,
    height: 0,
    width: 260,
    type: 'static',
    step: -1,
    deletable: true,
    actions: [],
    code: 'trigger',
  });

  return positions;
}

function makeBot(name, textBlocks) {
  const modelText = { ...textBlocks, conversation: false };
  return {
    type_functionality: 0,
    model: {
      text: JSON.stringify(modelText),
      name,
      positions: JSON.stringify(buildPositions(modelText)),
      type: 2,
    },
  };
}

const bots = [
  {
    file: 'Salesbot6_ColetaInformacoes_kommo_import.json',
    bot: makeBot('Coleta de Informações — Vista da Serra', {
      0: block(
        [
          sendMessage(
            'Perfeito, {{lead.name}}! 😊\n\nPara montar seu orçamento da Vista da Serra, preciso confirmar alguns dados:\n\n📅 Data de check-in\n📅 Data de check-out\n👥 Quantidade de hóspedes\n🐶 Vai levar pet?\n\nPode me enviar tudo em uma mensagem?',
            ['Enviar dados agora', 'Falar com atendente'],
            true,
          ),
        ],
        buttonsAnswer({
          'Enviar dados agora': 1,
          'Falar com atendente': 3,
        }),
      ),
      1: block([
        sendMessage('Pode enviar por aqui. Vou registrar para nossa equipe montar o orçamento. 😊'),
        waitAnswer(2),
      ]),
      2: block([
        addNote('Dados enviados na etapa Coleta de Informações: {{message_text}}'),
        sendMessage('Recebido! Obrigada. Nossa equipe vai conferir os dados e preparar o orçamento. 🏔️'),
        goto(99, 'finish'),
      ]),
      3: block([
        addNote('Cliente solicitou atendimento humano durante coleta de informações.'),
        sendMessage('Certo. Vou chamar um atendente para continuar por aqui. ⏳'),
        goto(99, 'finish'),
      ]),
    }),
  },
  {
    file: 'Salesbot7_Negociacao_kommo_import.json',
    bot: makeBot('Negociação — Vista da Serra', {
      0: block(
        [
          sendMessage(
            'Oi, {{lead.name}}! 😊\n\nVi que estamos ajustando sua reserva na Vista da Serra.\n\nComo posso ajudar para avançarmos?',
            ['Ajustar datas', 'Ver forma de pagamento', 'Confirmar reserva', 'Falar com atendente'],
            true,
          ),
        ],
        buttonsAnswer({
          'Ajustar datas': 1,
          'Ver forma de pagamento': 2,
          'Confirmar reserva': 3,
          'Falar com atendente': 4,
        }),
      ),
      1: block([
        sendMessage('Me informe as novas datas desejadas que eu registro para a equipe recalcular. 📅'),
        waitAnswer(10),
      ]),
      2: block([
        addNote('Cliente pediu informacoes sobre forma de pagamento na negociacao.'),
        sendMessage('Vou pedir para nossa equipe te passar as melhores opções de pagamento. ⏳'),
        goto(99, 'finish'),
      ]),
      3: block([
        addNote('Cliente quer confirmar reserva pela etapa de negociacao.'),
        sendMessage('Ótimo! Vou encaminhar para confirmação da reserva agora. 🎉'),
        goto(20),
      ]),
      4: block([
        addNote('Cliente solicitou atendimento humano na negociacao.'),
        sendMessage('Certo. Um atendente continua com você em instantes. 😊'),
        goto(99, 'finish'),
      ]),
      10: block([
        addNote('Novas datas solicitadas na negociacao: {{message_text}}'),
        sendMessage('Recebido! Nossa equipe vai verificar disponibilidade e ajustar a proposta. 🏔️'),
        goto(99, 'finish'),
      ]),
      20: block([
        changeStatus(stages.reserva),
        goto(99, 'finish'),
      ]),
    }),
  },
  {
    file: 'Salesbot8_Hospedado_kommo_import.json',
    bot: makeBot('Hospedado — Vista da Serra', {
      0: block(
        [
          sendMessage(
            'Olá, {{lead.name}}! Seja bem-vindo(a) à Vista da Serra. 🌿\n\nEstá tudo certo com sua hospedagem?',
            ['Tudo certo', 'Preciso de ajuda', 'Pedir informação'],
            true,
          ),
        ],
        buttonsAnswer({
          'Tudo certo': 1,
          'Preciso de ajuda': 2,
          'Pedir informação': 3,
        }),
      ),
      1: block([
        sendMessage('Que bom! Aproveite sua estadia. Qualquer coisa, estamos por aqui. 🏔️'),
        goto(99, 'finish'),
      ]),
      2: block([
        sendMessage('Sinto muito por isso. Me diga o que aconteceu para acionarmos a equipe.'),
        waitAnswer(10),
      ]),
      3: block([
        sendMessage('Pode perguntar por aqui. Vou registrar e a equipe responde em seguida.'),
        waitAnswer(11),
      ]),
      10: block([
        addNote('Solicitacao de ajuda durante hospedagem: {{message_text}}'),
        sendMessage('Recebido. Nossa equipe vai verificar e te responder o quanto antes. ⏳'),
        goto(99, 'finish'),
      ]),
      11: block([
        addNote('Pergunta durante hospedagem: {{message_text}}'),
        sendMessage('Anotado! Já encaminhei para a equipe. 😊'),
        goto(99, 'finish'),
      ]),
    }),
  },
  {
    file: 'Salesbot9_ClienteRecorrente_kommo_import.json',
    bot: makeBot('Cliente Recorrente — Vista da Serra', {
      0: block(
        [
          sendMessage(
            'Oi, {{lead.name}}! 😊\n\nQue bom ter você de volta à Vista da Serra.\n\nQuer que a gente prepare uma nova cotação para sua próxima estadia?',
            ['Quero novo orçamento', 'Ver disponibilidade', 'Falar com atendente', 'Agora não'],
            true,
          ),
        ],
        buttonsAnswer({
          'Quero novo orçamento': 1,
          'Ver disponibilidade': 1,
          'Falar com atendente': 3,
          'Agora não': 4,
        }),
      ),
      1: block([
        sendMessage('Perfeito! Me envie as datas desejadas e a quantidade de hóspedes. 📅'),
        waitAnswer(2),
      ]),
      2: block([
        addNote('Cliente recorrente solicitou novo orçamento: {{message_text}}'),
        sendMessage('Recebido! Vou encaminhar para a equipe preparar sua cotação. 🌿'),
        goto(5),
      ]),
      3: block([
        addNote('Cliente recorrente pediu atendimento humano.'),
        sendMessage('Certo. Um atendente continua com você em instantes. 😊'),
        goto(99, 'finish'),
      ]),
      4: block([
        sendMessage('Sem problema! Quando quiser voltar à Vista da Serra, será um prazer receber você novamente. 🏔️'),
        goto(99, 'finish'),
      ]),
      5: block([
        changeStatus(stages.contatoInicial),
        goto(99, 'finish'),
      ]),
    }),
  },
  {
    file: 'Salesbot10_ClosedLost_kommo_import.json',
    bot: makeBot('Perdido / Remarcar — Vista da Serra', {
      0: block(
        [
          sendMessage(
            'Oi, {{lead.name}}. Tudo bem? 😊\n\nVi que a reserva não avançou agora.\n\nPode nos contar o principal motivo? Isso ajuda a melhorar nosso atendimento.',
            ['Preço', 'Datas não serviram', 'Escolhi outro local', 'Quero remarcar depois'],
            true,
          ),
        ],
        buttonsAnswer({
          Preço: 1,
          'Datas não serviram': 2,
          'Escolhi outro local': 3,
          'Quero remarcar depois': 4,
        }),
      ),
      1: block([
        addNote('Motivo de perda informado: preco.'),
        sendMessage('Obrigada pelo retorno. Se surgir uma condição melhor, podemos te avisar por aqui. 🌿'),
        goto(99, 'finish'),
      ]),
      2: block([
        addNote('Motivo de perda informado: datas nao serviram.'),
        sendMessage('Entendi. Quando tiver novas datas, nos chame e verificamos disponibilidade. 📅'),
        goto(99, 'finish'),
      ]),
      3: block([
        addNote('Motivo de perda informado: escolheu outro local.'),
        sendMessage('Obrigada por avisar. Esperamos receber você em uma próxima oportunidade. 🏔️'),
        goto(99, 'finish'),
      ]),
      4: block([
        addNote('Cliente quer remarcar depois a partir de lead perdido.'),
        sendMessage('Claro! Vou deixar registrado para retomarmos em outra data. 😊'),
        goto(5),
      ]),
      5: block([
        changeStatus(stages.contatoInicial),
        goto(99, 'finish'),
      ]),
    }),
  },
];

for (const { file, bot } of bots) {
  writeFileSync(join(outDir, file), JSON.stringify(bot, null, 2));
}

console.log(JSON.stringify(bots.map(({ file, bot }) => ({ file, name: bot.model.name })), null, 2));
