const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export function isWebSerialSupported() {
  return 'serial' in navigator;
}

export async function connectPico() {
  if (!isWebSerialSupported()) {
    throw new Error('Web Serial tidak didukung browser ini. Gunakan Chrome/Chromium desktop.');
  }

  const port = await navigator.serial.requestPort();
  await port.open({ baudRate: 115200 });
  return port;
}

export async function disconnectPico(port) {
  if (!port) return;
  try {
    await port.close();
  } catch {
    // Port mungkin sudah ditutup/diambil alih browser.
  }
}

async function write(writer, value) {
  await writer.write(textEncoder.encode(value));
}

export async function runMicroPython(port, source) {
  if (!port) throw new Error('Pico belum terhubung.');
  const writer = port.writable.getWriter();

  // MicroPython raw REPL: Ctrl-C, Ctrl-A, code, Ctrl-D.
  try {
    await write(writer, '\x03\x03');
    await new Promise((resolve) => setTimeout(resolve, 120));
    await write(writer, '\x01');
    await new Promise((resolve) => setTimeout(resolve, 120));
    await write(writer, source);
    await write(writer, '\x04');
  } finally {
    writer.releaseLock();
  }
}

export async function readAvailable(port, onChunk, durationMs = 1200) {
  if (!port?.readable) return;
  const reader = port.readable.getReader();
  const start = Date.now();
  try {
    while (Date.now() - start < durationMs) {
      const timeout = new Promise((resolve) => setTimeout(() => resolve({ timeout: true }), 150));
      const result = await Promise.race([reader.read(), timeout]);
      if (result?.timeout) continue;
      if (result.done) break;
      if (result.value) onChunk(textDecoder.decode(result.value));
    }
  } finally {
    reader.releaseLock();
  }
}
