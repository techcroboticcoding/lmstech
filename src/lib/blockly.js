import * as Blockly from 'blockly'
import { pythonGenerator } from 'blockly/python'
import 'blockly/blocks'

export function registerTechcBlocks() {
  if (Blockly.Blocks.techc_start) return

  Blockly.Blocks.techc_start = {
    init() {
      this.appendDummyInput().appendField('🟨 ketika mulai')
      this.setNextStatement(true)
      this.setColour(45)
      this.setDeletable(false)
      this.setMovable(false)
    },
  }

  Blockly.Blocks.techc_led = {
    init() {
      this.appendDummyInput()
        .appendField('💡 LED PIN 15 →')
        .appendField(new Blockly.FieldDropdown([
          ['NYALA', '1'],
          ['MATI', '0'],
        ]), 'STATE')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(195)
    },
  }

  Blockly.Blocks.techc_wait = {
    init() {
      this.appendDummyInput()
        .appendField('⏱️ tunggu')
        .appendField(new Blockly.FieldNumber(1, 0.1, 60, 0.1), 'SECONDS')
        .appendField('detik')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(255)
    },
  }

  Blockly.Blocks.techc_repeat = {
    init() {
      this.appendDummyInput()
        .appendField('🔁 ulangi')
        .appendField(new Blockly.FieldNumber(5, 1, 50, 1), 'COUNT')
        .appendField('kali')
      this.appendStatementInput('DO').appendField('lakukan')
      this.setPreviousStatement(true)
      this.setNextStatement(true)
      this.setColour(120)
    },
  }

  pythonGenerator.forBlock.techc_start = () => ''
  pythonGenerator.forBlock.techc_led = (block) => `led.value(${Number(block.getFieldValue('STATE'))})\n`
  pythonGenerator.forBlock.techc_wait = (block) => `time.sleep(${Number(block.getFieldValue('SECONDS'))})\n`
  pythonGenerator.forBlock.techc_repeat = (block, generator) => {
    const count = Number(block.getFieldValue('COUNT'))
    const branch = generator.statementToCode(block, 'DO')
    return `for _ in range(${count}):\n${branch || '    pass\n'}`
  }
}

export const toolbox = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category', name: '💡 LED', colour: '#2B8CFF',
      contents: [{ kind: 'block', type: 'techc_led' }],
    },
    {
      kind: 'category', name: '⏱️ Waktu', colour: '#8164E8',
      contents: [{ kind: 'block', type: 'techc_wait' }],
    },
    {
      kind: 'category', name: '🔁 Ulangi', colour: '#22B573',
      contents: [{ kind: 'block', type: 'techc_repeat' }],
    },
  ],
}

export function workspaceToPython(workspace) {
  return pythonGenerator.workspaceToCode(workspace).trim()
}

export function loadExample(workspace) {
  const xmlText = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="techc_start" x="24" y="24">
        <next>
          <block type="techc_led">
            <field name="STATE">1</field>
            <next>
              <block type="techc_wait">
                <field name="SECONDS">2</field>
                <next>
                  <block type="techc_led">
                    <field name="STATE">0</field>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </xml>`

  const dom = Blockly.utils.xml.textToDom(xmlText)
  Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace)
}

export function loadChallenge(workspace) {
  const xmlText = `
    <xml xmlns="https://developers.google.com/blockly/xml">
      <block type="techc_start" x="24" y="24">
        <next>
          <block type="techc_repeat">
            <field name="COUNT">5</field>
            <statement name="DO">
              <block type="techc_led">
                <field name="STATE">1</field>
                <next>
                  <block type="techc_wait">
                    <field name="SECONDS">0.5</field>
                    <next>
                      <block type="techc_led">
                        <field name="STATE">0</field>
                        <next>
                          <block type="techc_wait">
                            <field name="SECONDS">0.5</field>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </statement>
          </block>
        </next>
      </block>
    </xml>`

  const dom = Blockly.utils.xml.textToDom(xmlText)
  Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace)
}
