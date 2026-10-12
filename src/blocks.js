import * as Blockly from 'blockly/core';

export function registerTechBlocks() {
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'tech_start',
      message0: 'ketika mulai',
      nextStatement: null,
      colour: 55,
      tooltip: 'Program mulai dari sini.',
      helpUrl: '',
    },
    {
      type: 'tech_set_led',
      message0: 'nyalakan LED PIN %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 15,
          min: 0,
          max: 28,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 140,
      tooltip: 'Nyalakan LED pada pin GPIO.',
      helpUrl: '',
    },
    {
      type: 'tech_set_led_off',
      message0: 'matikan LED PIN %1',
      args0: [
        {
          type: 'field_number',
          name: 'PIN',
          value: 15,
          min: 0,
          max: 28,
          precision: 1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 0,
      tooltip: 'Matikan LED pada pin GPIO.',
      helpUrl: '',
    },
    {
      type: 'tech_wait',
      message0: 'tunggu %1 detik',
      args0: [
        {
          type: 'field_number',
          name: 'SECONDS',
          value: 2,
          min: 0.1,
          max: 60,
          precision: 0.1,
        },
      ],
      previousStatement: null,
      nextStatement: null,
      colour: 210,
      tooltip: 'Berikan jeda.',
      helpUrl: '',
    },
    {
      type: 'tech_repeat',
      message0: 'ulangi %1 kali',
      args0: [
        {
          type: 'field_number',
          name: 'TIMES',
          value: 5,
          min: 1,
          max: 20,
          precision: 1,
        },
      ],
      message1: '%1',
      args1: [{ type: 'input_statement', name: 'DO' }],
      previousStatement: null,
      nextStatement: null,
      colour: 285,
      tooltip: 'Ulangi blok di dalamnya.',
      helpUrl: '',
    },
  ]);
}

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Mulai',
      colour: '#f0b400',
      contents: [{ kind: 'block', type: 'tech_start' }],
    },
    {
      kind: 'category',
      name: 'LED',
      colour: '#2fb344',
      contents: [
        { kind: 'block', type: 'tech_set_led' },
        { kind: 'block', type: 'tech_set_led_off' },
      ],
    },
    {
      kind: 'category',
      name: 'Waktu',
      colour: '#2684ff',
      contents: [{ kind: 'block', type: 'tech_wait' }],
    },
    {
      kind: 'category',
      name: 'Kontrol',
      colour: '#9b59b6',
      contents: [{ kind: 'block', type: 'tech_repeat' }],
    },
  ],
};

export function generateMicroPython(workspace) {
  let lines = [
    'from machine import Pin',
    'from time import sleep',
    '',
  ];

  const blocks = workspace.getTopBlocks(true);
  for (const block of blocks) {
    if (block.type === 'tech_start') {
      lines.push(generateChain(block.getNextBlock(), '  '));
    } else if (block.type === 'tech_set_led' || block.type === 'tech_set_led_off' || block.type === 'tech_wait' || block.type === 'tech_repeat') {
      lines.push(generateStatement(block, ''));
    }
  }

  return normalizeCode(lines.join('\n'));
}

function generateChain(block, indent) {
  const out = [];
  let current = block;
  while (current) {
    out.push(generateStatement(current, indent));
    current = current.getNextBlock();
  }
  return out.filter(Boolean).join('\n');
}

function generateStatement(block, indent) {
  switch (block.type) {
    case 'tech_set_led': {
      const pin = Number(block.getFieldValue('PIN'));
      return `${indent}led_${pin} = Pin(${pin}, Pin.OUT)\n${indent}led_${pin}.value(1)`;
    }
    case 'tech_set_led_off': {
      const pin = Number(block.getFieldValue('PIN'));
      return `${indent}led_${pin} = Pin(${pin}, Pin.OUT)\n${indent}led_${pin}.value(0)`;
    }
    case 'tech_wait': {
      const seconds = Number(block.getFieldValue('SECONDS'));
      return `${indent}sleep(${seconds})`;
    }
    case 'tech_repeat': {
      const times = Number(block.getFieldValue('TIMES'));
      const nested = generateChain(block.getInputTargetBlock('DO'), `${indent}    `);
      return `${indent}for _ in range(${times}):\n${nested || `${indent}    pass`}`;
    }
    default:
      return '';
  }
}

function normalizeCode(code) {
  return code.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}
