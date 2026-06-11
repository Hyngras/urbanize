import fs from 'node:fs';

const inputPath = '/Users/hyngridsouza/Downloads/Boas-vindas + Orçamento — Vista da Serra.json';
const outputPath = '/Users/hyngridsouza/Downloads/Boas-vindas + Orçamento — Vista da Serra_CORRIGIDO.json';
const petField = '{{lead.cf.1043230}}';

const root = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const bot = JSON.parse(root.model.text);

const goto = (step) => ({
  handler: 'goto',
  params: {
    type: 'question',
    step,
  },
});

const buttonAnswer = (value, step) => ({
  value,
  params: [goto(step)],
  synonyms: [],
});

const elseAnswer = (step) => ({
  type: 'else',
  params: [goto(step)],
});

const setButtonBlocks = (blockId, mapping) => {
  const send = bot[String(blockId)].question.find((item) => item.handler === 'send_message');
  if (!send?.params?.buttons) return;
  send.params.buttons = send.params.buttons.map((button) => ({
    ...button,
    block: mapping[button.text] ?? button.block,
  }));
};

const setButtonAnswers = (blockId, answers, elseStep) => {
  const block = bot[String(blockId)];
  block.answer = [
    {
      handler: 'buttons',
      params: [
        ...answers.map(([value, step]) => buttonAnswer(value, step)),
        elseAnswer(elseStep),
      ],
    },
  ];
};

// Entrada principal: orçamento começa no bloco de check-in, dúvidas vai ao menu.
setButtonBlocks(0, {
  'Solicitar orçamento': 1,
  'Tirar dúvidas': 14,
});
setButtonAnswers(
  0,
  [
    ['Solicitar orçamento', 1],
    ['Tirar dúvidas', 14],
  ],
  14,
);

// Pet: salva no campo personalizado Pet e segue para resumo/nota interna.
bot['13'].question = [
  {
    handler: 'action',
    params: {
      name: 'set_custom_fields',
      params: {
        type: 'lead',
        value: '{{message_text}}',
        value_type: 'value',
        custom_field: petField,
      },
    },
  },
  goto(9),
];

// Resumo e nota interna passam a incluir o campo Pet.
const summary = bot['9'].question.find((item) => item.handler === 'send_message');
summary.params.text = summary.params.text.replace(
  '👥 Adultos: {{lead.cf.1043020}}\n\n',
  `👥 Adultos: {{lead.cf.1043020}}\n🐾 Pet: ${petField}\n\n`,
);

const note = bot['10'].question.find((item) => item.handler === 'action' && item.params?.name === 'add_note');
note.params.params.text = note.params.params.text.replace(
  'Adultos: {{lead.cf.1043020}}',
  `Adultos: {{lead.cf.1043020}}\nPet: ${petField}`,
);

// Menu de dúvidas e submenus: todos os botões passam a ter destino.
setButtonBlocks(14, {
  '⏰ Horários': 15,
  '💰 Valores': 16,
  '📍 Localização': 17,
  '👩‍💼 Atendente': 20,
});
setButtonAnswers(
  14,
  [
    ['⏰ Horários', 15],
    ['💰 Valores', 16],
    ['📍 Localização', 17],
    ['👩‍💼 Atendente', 20],
  ],
  14,
);

setButtonBlocks(15, {
  '↩ Voltar ao menu': 14,
  '📋 Solicitar orçamento': 1,
});
setButtonAnswers(
  15,
  [
    ['↩ Voltar ao menu', 14],
    ['📋 Solicitar orçamento', 1],
  ],
  14,
);

setButtonBlocks(16, {
  '📋 Solicitar orçamento': 1,
  '↩ Voltar ao menu': 14,
  '👩‍💼 Atendente': 20,
});
setButtonAnswers(
  16,
  [
    ['📋 Solicitar orçamento', 1],
    ['↩ Voltar ao menu', 14],
    ['👩‍💼 Atendente', 20],
  ],
  14,
);

setButtonBlocks(17, {
  '↩ Voltar ao menu': 14,
  '📋 Solicitar orçamento': 1,
});
setButtonAnswers(
  17,
  [
    ['↩ Voltar ao menu', 14],
    ['📋 Solicitar orçamento', 1],
  ],
  14,
);

const blockIds = new Set(Object.keys(bot));
const missing = [];
const emptyButtonHandlers = [];
const hasBlock = (step) => step === '99' || blockIds.has(step);

for (const [blockId, block] of Object.entries(bot)) {
  for (const section of ['question', 'answer']) {
    for (const item of block[section] ?? []) {
      if (item.handler === 'goto') {
        const step = String(item.params?.step);
        if (!hasBlock(step)) missing.push(`${blockId}.${section}: goto ${step}`);
      }
      if (item.handler === 'wait_answer') {
        const step = String(item.params?.step);
        if (!hasBlock(step)) missing.push(`${blockId}.${section}: wait_answer ${step}`);
      }
      if (item.handler === 'buttons' && item.params.length === 0) {
        emptyButtonHandlers.push(blockId);
      }
      for (const answer of Array.isArray(item.params) ? item.params : []) {
        for (const action of answer.params ?? []) {
          if (action.handler === 'goto') {
            const step = String(action.params?.step);
            if (!hasBlock(step)) missing.push(`${blockId}.${section}: button goto ${step}`);
          }
        }
      }
      for (const button of Array.isArray(item.params?.buttons) ? item.params.buttons : []) {
        if (button.block !== undefined && !blockIds.has(String(button.block))) {
          missing.push(`${blockId}.${section}: button ${button.text} block ${button.block}`);
        }
      }
    }
  }
}

const serializedBot = JSON.stringify(bot);
if (serializedBot.includes('{{lead.price}}')) {
  throw new Error('Ainda existe referencia a {{lead.price}}.');
}
if (serializedBot.includes('"value":"..."')) {
  throw new Error('Ainda existe value "...".');
}
if (missing.length) {
  throw new Error(`Destinos inexistentes encontrados:\n${missing.join('\n')}`);
}
if (emptyButtonHandlers.some((id) => ['14', '15', '16', '17'].includes(id))) {
  throw new Error(`Menus ainda sem acoes: ${emptyButtonHandlers.join(', ')}`);
}

root.model.text = JSON.stringify(bot);
fs.writeFileSync(outputPath, JSON.stringify(root, null, 2));

console.log(`Arquivo corrigido: ${outputPath}`);
console.log(`Campo Pet usado: ${petField}`);
console.log('Validacao OK: sem blocos inexistentes, sem lead.price e sem menus vazios nos blocos 14-17.');
