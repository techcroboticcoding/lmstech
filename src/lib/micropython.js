export function buildMicroPython(body) {
  const clean = (body || '').trim()
  return [
    'from machine import Pin',
    'import time',
    '',
    'led = Pin(15, Pin.OUT)',
    '',
    clean || 'led.value(0)',
    '',
    'print("TECHC:RUN_OK")',
    '',
  ].join('\n')
}

export function isChallengeSolved(code) {
  const normalized = code.replace(/\s+/g, ' ').toLowerCase()
  return normalized.includes('for _ in range(5):')
    && normalized.includes('led.value(1)')
    && normalized.includes('led.value(0)')
}
