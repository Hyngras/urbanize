import fs from 'node:fs';
import path from 'node:path';

const dir = '/Users/hyngridsouza/Downloads/kommo-import-salesbots-final';
const file = 'Salesbot1_BoasVindas.json';
const fullPath = path.join(dir, file);
const backupPath = path.join(dir, `Salesbot1_BoasVindas.before_fix_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

const root = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
const text = JSON.parse(root.model.text);
const positions = JSON.parse(root.model.positions);

function maxActionId() {
  let max = 100;

  for (const position of positions) {
    for (const action of position.actions || []) {
      if (typeof action.id === 'number') {
        max = Math.max(max, action.id);
      }
    }
  }

  return max;
}

function noteAction(noteText) {
  return {
    handler: 'action',
    params: {
      name: 'add_note',
      params: {
        note_type: 4,
        element_type: 1,
        text: noteText,
        type: 1,
        contact_type: 'main',
      },
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

function questionPosition(step) {
  const position = positions.find((item) => item.type === 'question' && item.step === step);
  if (!position) {
    throw new Error(`Position not found for step ${step}`);
  }

  return position;
}

function convertFreeTextStep(step, nextStep) {
  const block = text[String(step)];
  const sendMessage = block.question.find((item) => item.handler === 'send_message');

  if (!sendMessage) {
    throw new Error(`send_message not found for step ${step}`);
  }

  delete sendMessage.params.buttons;
  delete block.answer;

  if (!block.question.some((item) => item.handler === 'wait_answer')) {
    block.question.push({
      handler: 'wait_answer',
      params: {
        type: 'question',
        step: nextStep,
      },
    });
  }

  const position = questionPosition(step);
  const sendAction = position.actions.find((item) => item.params?.handler === 'send_message');

  if (sendAction) {
    delete sendAction.params.params.buttons;
    delete sendAction.synonyms;
    sendAction.links = [];
  }

  if (!position.actions.some((item) => item.params?.handler === 'wait_answer')) {
    position.actions.push(
      positionAction(maxActionId() + 1, position.actions.length, 'wait_answer', {
        type: 'question',
        step: nextStep,
      }),
    );
  }

  position.goto = null;
}

function replaceStepWithNote(step, noteText, nextStep) {
  text[String(step)].question = [
    noteAction(noteText),
    {
      handler: 'goto',
      params: {
        type: 'question',
        step: nextStep,
      },
    },
  ];

  const position = questionPosition(step);
  position.name = 'Adicionar nota';
  position.actions = [
    positionAction(maxActionId() + 1, 0, 'action', noteAction(noteText).params),
  ];

  const target = positions.find((item) => item.type === 'question' && item.step === nextStep);
  position.goto = target ? { block: target.id } : null;
}

fs.copyFileSync(fullPath, backupPath);

convertFreeTextStep(1, 2);
convertFreeTextStep(3, 4);
convertFreeTextStep(5, 6);
convertFreeTextStep(7, 13);

replaceStepWithNote(22, 'Nome completo informado no atendimento inicial: {{message_text}}', 23);
replaceStepWithNote(24, 'WhatsApp informado no atendimento inicial: {{message_text}}', 99);
text['24'].question[1].params.type = 'finish';

const finish = positions.find((item) => item.type === 'finish');
const step24 = questionPosition(24);
step24.goto = finish ? { block: finish.id } : null;

root.model.text = JSON.stringify(text);
root.model.positions = JSON.stringify(positions);
fs.writeFileSync(fullPath, `${JSON.stringify(root, null, 2)}\n`);

const raw = JSON.stringify(root);
const report = {
  backupPath,
  emptyButtons: raw.match(/"text":""/g)?.length || 0,
  invalidLeadNameSet: raw.includes('"custom_field":"{{lead.name}}"'),
  badGotoBlocks: positions.filter((item) => item.goto && !positions.some((other) => other.id === item.goto.block)).map((item) => item.step),
  hasWaitAnswers: [1, 3, 5, 7].map((step) => ({
    step,
    hasWait: text[String(step)].question.some((item) => item.handler === 'wait_answer'),
  })),
};

console.log(JSON.stringify(report, null, 2));
