import { useEffect, useRef } from 'react'
import * as Blockly from 'blockly'
import 'blockly/blocks'
import { loadChallenge, loadExample, registerTechcBlocks, toolbox, workspaceToPython } from '../lib/blockly'

export default function BlocklyEditor({ mode = 'example', onCodeChange }) {
  const containerRef = useRef(null)
  const workspaceRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return undefined

    registerTechcBlocks()
    const workspace = Blockly.inject(containerRef.current, {
      toolbox,
      trashcan: true,
      grid: { spacing: 20, length: 2, colour: '#DCE7F5', snap: true },
      zoom: { controls: true, wheel: false, startScale: 0.88, maxScale: 1.25, minScale: 0.7 },
      renderer: 'zelos',
      move: { scrollbars: true, drag: true, wheel: false },
    })
    workspaceRef.current = workspace

    const listener = () => onCodeChange(workspaceToPython(workspace))
    workspace.addChangeListener(listener)

    if (mode === 'challenge') loadChallenge(workspace)
    else loadExample(workspace)
    onCodeChange(workspaceToPython(workspace))

    return () => {
      workspace.removeChangeListener(listener)
      workspace.dispose()
      workspaceRef.current = null
    }
  }, [mode, onCodeChange])

  return <div ref={containerRef} className="blockly-host" aria-label="Editor blok kode" />
}

export { loadExample, loadChallenge }
