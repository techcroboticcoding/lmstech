const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export function isWebSerialSupported() {
  return 'serial' in navigator
}

export async function connectSerial(onLog = () => {}) {
  if (!isWebSerialSupported()) {
    throw new Error('Browser ini tidak mendukung Web Serial. Gunakan Chrome/Chromium desktop melalui localhost atau HTTPS.')
  }

  const port = await navigator.serial.requestPort()
  await port.open({ baudRate: 115200 })
  onLog('🟢 Pico terhubung.')
  return port
}

export async function closeSerial(port) {
  if (!port) return
  try {
    if (port.readable) {
      await port.cancel()
    }
  } catch {
    // Ignore reader cancellation errors while closing.
  }
  try {
    if (port.writable) {
      await port.close()
    }
  } catch {
    // Ignore already-closed ports.
  }
}

async function writeText(port, text) {
  const writer = port.writable.getWriter()
  try {
    await writer.write(new TextEncoder().encode(text))
  } finally {
    writer.releaseLock()
  }
}

export async function runMicroPython(port, code, onLog = () => {}) {
  if (!port?.writable) throw new Error('Pico belum terhubung.')

  // Interrupt any running program, then enter MicroPython raw REPL.
  await writeText(port, '\u0003\u0003')
  await sleep(150)
  await writeText(port, '\u0001')
  await sleep(150)

  // Send the finite lesson program and Ctrl-D to execute it.
  await writeText(port, code)
  await writeText(port, '\u0004')
  onLog('▶ Program dikirim ke Pico.')
  await sleep(250)
  onLog('✅ Pico menerima program.')
}
