export const lesson = {
  id: 'led-01',
  level: 'LEVEL 1 · BASIC ELECTRONICS',
  title: 'Misi 01 — Nyalakan LED',
  objective: 'Belajar mengontrol LED menggunakan Raspberry Pi Pico.',
  duration: 60,
  materials: ['Raspberry Pi Pico', 'LED', 'Resistor 220Ω', 'Breadboard', 'Jumper', 'Kabel USB'],
  wiring: [
    ['GP15', 'Resistor 220Ω', 'Kaki panjang LED'],
    ['GND', 'Kaki pendek LED', 'GND Pico'],
  ],
  quiz: [
    { question: 'Apa fungsi LED pada rangkaian kita?', options: ['Mengukur jarak', 'Menghasilkan cahaya', 'Menggerakkan motor', 'Menyimpan data'], answer: 1 },
    { question: 'LED pada lesson ini dipasang ke pin berapa?', options: ['GP2', 'GP4', 'GP15', 'GP28'], answer: 2 },
    { question: 'Mengapa kita memakai resistor 220Ω?', options: ['Agar LED aman dari arus berlebih', 'Agar Pico terhubung Wi-Fi', 'Agar LCD menyala', 'Agar program lebih cepat'], answer: 0 },
    { question: 'Apa fungsi blok “tunggu 2 detik”?', options: ['Menghapus program', 'Memberi jeda 2 detik', 'Mengganti pin', 'Mematikan Pico'], answer: 1 },
    { question: 'Jika LED diberi perintah NYALA, apa yang diharapkan?', options: ['LED menyala', 'LED rusak', 'Motor berputar', 'LCD menampilkan nama'], answer: 0 },
  ],
}
