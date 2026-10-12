# TECH-C Robot Lab — Tahap 1 (React + Vite)

MVP LMS robotik kids-friendly untuk 1 lesson:

**Belajar → Rakit → Blocks → Connect Pico → Run → Challenge → Quiz**

## Stack
- React + Vite
- Blockly
- Web Serial API
- Raspberry Pi Pico + MicroPython

## Menjalankan

Pastikan Node.js 18+ sudah terpasang.

```bash
npm install
npm run dev
```

Buka URL Vite yang tampil, biasanya:

```text
http://localhost:5173
```

Untuk Web Serial, gunakan browser yang mendukung Web Serial (umumnya Chrome/Chromium desktop) dan jalankan melalui `localhost` atau HTTPS.

## Hardware Lesson 01

- Raspberry Pi Pico
- LED
- Resistor 220Ω
- Breadboard
- Jumper

Wiring:

```text
GP15 → resistor 220Ω → kaki panjang LED
GND  → kaki pendek LED
```

## Cara Connect Pico

1. Colok Pico melalui USB.
2. Pastikan firmware Pico menjalankan MicroPython.
3. Klik **Connect Pico**.
4. Pilih USB Serial Raspberry Pi Pico.
5. Susun blok.
6. Klik **Jalankan**.

## Catatan Web Serial

Web Serial mengharuskan koneksi dimulai dari aksi pengguna. Untuk MVP ini program dikirim ke REPL MicroPython Pico melalui USB secara langsung. Program yang dikirim dieksekusi saat itu juga; penyimpanan program permanen menjadi tahap berikutnya.

## Tahap berikutnya

- Login siswa
- Laravel API + database
- Teacher dashboard
- Banyak lesson
- Quiz dari database
- XP/badge server-side
- Progress per siswa
- LCD, button, buzzer, sensor, servo, motor
- Hardware checker
