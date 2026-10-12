# Struktur Tahap 1

```text
techc-lms-stage1-react/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── public/
│   └── robot.svg
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   └── BlocklyEditor.jsx
    ├── data/
    │   └── lesson.js
    └── lib/
        ├── blockly.js
        ├── micropython.js
        └── webSerial.js
```

## Tahap 1 scope

1. Kids-friendly lesson page.
2. Alur 5 step: Belajar → Rakit → Coding → Challenge → Quiz.
3. Blockly custom blocks untuk LED, wait, dan repeat.
4. Generator blok → MicroPython.
5. Connect Raspberry Pi Pico melalui USB Web Serial.
6. Kirim program finite ke MicroPython raw REPL.
7. Challenge dicek dari struktur program, lalu program dijalankan ke Pico.
8. Quiz 5 soal dengan passing score 70.
9. XP + progress sementara localStorage.
10. Timer 60 menit.

## Belum termasuk

- Login dan akun siswa
- Laravel API / MySQL
- Teacher dashboard real-time
- Multi lesson database
- Sertifikat
- Server-side XP dan progress
- Hardware checker yang membaca sensor secara otomatis
