import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BlocklyEditor from './components/BlocklyEditor'
import { lesson } from './data/lesson'
import { buildMicroPython, isChallengeSolved } from './lib/micropython'
import { closeSerial, connectSerial, isWebSerialSupported, runMicroPython } from './lib/webSerial'

const STORAGE = {
  xp: 'techc_stage1_xp',
  lessonDone: 'techc_stage1_done',
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
  const secs = (seconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

function App() {
  const [step, setStep] = useState(1)
  const [xp, setXp] = useState(() => Number(localStorage.getItem(STORAGE.xp) || 0))
  const [seconds, setSeconds] = useState(lesson.duration * 60)
  const [wired, setWired] = useState(false)
  const [code, setCode] = useState('')
  const [connected, setConnected] = useState(false)
  const [running, setRunning] = useState(false)
  const [status, setStatus] = useState('Siap belajar 🚀')
  const [statusType, setStatusType] = useState('normal')
  const [challengeDone, setChallengeDone] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [lessonDone, setLessonDone] = useState(() => localStorage.getItem(STORAGE.lessonDone) === '1')
  const [blockMode, setBlockMode] = useState('example')
  const portRef = useRef(null)

  const setRunStatus = (message, type = 'normal') => {
    setStatus(message)
    setStatusType(type)
  }

  useEffect(() => {
    if (seconds <= 0) return undefined
    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(value - 1, 0))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [seconds])

  useEffect(() => () => {
    closeSerial(portRef.current)
  }, [])

  const goTo = (nextStep) => {
    if (nextStep === 2 && step < 2) setStep(2)
    else if (nextStep === 3 && wired) setStep(3)
    else if (nextStep === 3 && !wired) alert('Centang dulu bahwa rangkaian sudah dirakit ya 😊')
    else if (nextStep === 4) setStep(4)
    else if (nextStep === 5 && challengeDone) setStep(5)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const connectPico = async () => {
    if (!isWebSerialSupported()) {
      setRunStatus('Browser ini belum mendukung Web Serial. Gunakan Chrome/Chromium desktop.', 'error')
      return
    }
    try {
      const port = await connectSerial((message) => setRunStatus(message, 'success'))
      portRef.current = port
      setConnected(true)
    } catch (error) {
      console.error(error)
      setRunStatus(error?.message || 'Pico belum tersambung.', 'error')
    }
  }

  const disconnectPico = async () => {
    await closeSerial(portRef.current)
    portRef.current = null
    setConnected(false)
    setRunStatus('Pico dilepas.', 'normal')
  }

  const executeCurrentCode = async (challenge = false) => {
    if (!portRef.current) {
      setRunStatus('Hubungkan Pico dulu ya 🔌', 'error')
      return false
    }

    if (!code.trim()) {
      setRunStatus('Belum ada blok program.', 'error')
      return false
    }

    if (challenge && !isChallengeSolved(code)) {
      setRunStatus('Belum sesuai challenge. Coba gunakan blok ulangi 5 kali.', 'error')
      return false
    }

    setRunning(true)
    setRunStatus('Mengirim program ke Pico…')
    try {
      await runMicroPython(portRef.current, buildMicroPython(code), (message) => setRunStatus(message, 'success'))
      if (challenge) {
        setChallengeDone(true)
        setXp((current) => {
          const next = current + 30
          localStorage.setItem(STORAGE.xp, String(next))
          return next
        })
        setRunStatus('🎉 Challenge berhasil! +30 XP', 'success')
      } else {
        setRunStatus('✅ Program berhasil dijalankan di Pico.', 'success')
      }
      return true
    } catch (error) {
      console.error(error)
      setRunStatus(error?.message || 'Gagal menjalankan program di Pico.', 'error')
      return false
    } finally {
      setRunning(false)
    }
  }

  const submitQuiz = () => {
    const answered = Object.keys(quizAnswers).length
    if (answered < lesson.quiz.length) {
      alert('Jawab semua pertanyaan dulu ya 😊')
      return
    }
    const correct = lesson.quiz.reduce((total, question, index) => total + (quizAnswers[index] === question.answer ? 1 : 0), 0)
    const score = Math.round((correct / lesson.quiz.length) * 100)
    setQuizScore(score)
    setQuizSubmitted(true)
    if (score >= 70 && !lessonDone) {
      setLessonDone(true)
      setXp((current) => {
        const next = current + 50
        localStorage.setItem(STORAGE.xp, String(next))
        localStorage.setItem(STORAGE.lessonDone, '1')
        return next
      })
    }
  }

  const resetDemo = () => {
    localStorage.removeItem(STORAGE.xp)
    localStorage.removeItem(STORAGE.lessonDone)
    setXp(0)
    setLessonDone(false)
    setChallengeDone(false)
    setBlockMode('example')
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizScore(0)
    setSeconds(lesson.duration * 60)
    setStep(1)
  }

  const generatedCode = useMemo(() => buildMicroPython(code), [code])
  const timeWarning = seconds <= 10 * 60
  const finalPassed = quizSubmitted && quizScore >= 70

  const handleBlocklyCode = useCallback((nextCode) => setCode(nextCode), [])

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src="/robot.svg" alt="Robot TECH-C" className="brand-robot" />
          <div>
            <div className="brand-title">TECH-C Robot Lab</div>
            <div className="brand-subtitle">Belajar · Rakit · Coding · Berhasil</div>
          </div>
        </div>
        <div className="top-actions">
          <div className={`device-pill ${connected ? 'online' : 'offline'}`}>{connected ? '🟢 Pico terhubung' : '🔴 Pico belum terhubung'}</div>
          <div className="xp-pill">⭐ {xp} XP</div>
        </div>
      </header>

      <main className="container">
        <section className="hero-card">
          <div>
            <span className="level-pill">{lesson.level}</span>
            <h1>💡 {lesson.title}</h1>
            <p>{lesson.objective}</p>
            <div className="hero-tags"><span>🎯 1 Misi</span><span>🧩 Blocks</span><span>🔌 Pico USB</span><span>🧠 Quiz</span></div>
          </div>
          <div className={`timer-card ${timeWarning ? 'warning' : ''}`}>
            <div>⏱️ Waktu sesi</div>
            <strong>{formatTime(seconds)}</strong>
            <small>Target kelas: 60 menit</small>
          </div>
        </section>

        <nav className="stepper" aria-label="Alur lesson">
          {['Belajar', 'Rakit', 'Coding', 'Challenge', 'Quiz'].map((label, index) => {
            const number = index + 1
            const done = number < step || (number === 5 && finalPassed)
            return (
              <div className={`step ${number === step ? 'active' : ''} ${done ? 'done' : ''}`} key={label}>
                <div className="step-number">{done ? '✓' : number}</div>
                <span>{label}</span>
              </div>
            )
          })}
        </nav>

        {step === 1 && (
          <LessonCard title="Kenalan dengan LED" kicker="LANGKAH 1" time="± 10 menit">
            <div className="learn-layout">
              <div className="big-led-art"><div className="glow-led">💡</div><div className="spark spark-a">✦</div><div className="spark spark-b">✦</div></div>
              <div className="lesson-copy">
                <p><strong>LED</strong> adalah lampu kecil yang bisa kita kontrol menggunakan program.</p>
                <p>Hari ini kita akan membuat LED:</p>
                <div className="goal-stack"><div>💡 Menyala</div><div>⏳ Menunggu 2 detik</div><div>🌙 Mati</div></div>
                <button className="btn btn-primary" onClick={() => goTo(2)}>Saya Paham → Rakit</button>
              </div>
            </div>
          </LessonCard>
        )}

        {step === 2 && (
          <LessonCard title="Rakit rangkaiannya" kicker="LANGKAH 2" time="± 10 menit">
            <div className="build-layout">
              <div className="wiring-panel">
                <div className="pico-drawing">
                  <div className="chip-title">RASPBERRY PI PICO</div>
                  <div className="pico-pin"><span>GP15</span><b>●</b></div>
                  <div className="pico-pin"><span>GND</span><b className="ground-dot">●</b></div>
                </div>
                <div className="arrow-large">→</div>
                <div className="component-chain"><span>220Ω</span><b>→</b><span className="led-dot">●</span><b>→</b><span>GND</span></div>
              </div>
              <div className="instruction-panel">
                <h3>🔌 Ikuti urutannya</h3>
                {lesson.wiring.map(([from, via, to]) => <div className="wiring-row" key={from}><strong>{from}</strong><span>→</span><span>{via}</span><span>→</span><strong>{to}</strong></div>)}
                <div className="safety-note">⚠️ Pakai resistor 220Ω supaya LED aman.</div>
                <label className="check-row"><input type="checkbox" checked={wired} onChange={(event) => setWired(event.target.checked)} /> <span>Saya sudah merakit rangkaiannya</span></label>
                <button className="btn btn-primary" onClick={() => goTo(3)}>Lanjut ke Coding →</button>
              </div>
            </div>
          </LessonCard>
        )}

        {step === 3 && (
          <LessonCard title="Susun blok program" kicker="LANGKAH 3" time="± 15 menit">
            <div className="coding-tools">
              <div className="device-actions">
                {!connected ? <button className="btn btn-connect" onClick={connectPico}>🔌 Connect Pico</button> : <button className="btn btn-disconnect" onClick={disconnectPico}>🟢 Pico Connected</button>}
                <button className="btn btn-soft" onClick={() => window.alert('Blok di workspace sudah otomatis memuat contoh. Gunakan tombol Muat Contoh di bawah bila perlu.')}>👀 Lihat petunjuk</button>
                <button className="btn btn-run" disabled={running} onClick={() => executeCurrentCode(false)}>▶ {running ? 'Menjalankan…' : 'Jalankan'}</button>
              </div>
              <div className={`status ${statusType}`}>{status}</div>
            </div>
            <div className="coding-grid">
              <div className="blockly-card"><BlocklyEditor mode={blockMode} onCodeChange={handleBlocklyCode} /></div>
              <div className="python-card">
                <div className="code-title">🐍 Python yang dihasilkan</div>
                <pre>{generatedCode}</pre>
                <div className="code-note">Blocks → MicroPython Pico</div>
              </div>
            </div>
            <div className="tip-card">💡 Susun blok dari atas ke bawah seperti menyusun langkah sebuah cerita.</div>
            <div className="footer-actions"><button className="btn btn-secondary" onClick={() => setBlockMode('example')}>✨ Muat Contoh</button><button className="btn btn-soft" onClick={() => setBlockMode('challenge')}>🏆 Buka Template Challenge</button><button className="btn btn-primary" onClick={() => goTo(4)}>Lanjut ke Challenge →</button></div>
          </LessonCard>
        )}

        {step === 4 && (
          <LessonCard title="Challenge — Kedip 5 Kali" kicker="LANGKAH 4" time="± 10 menit">
            <div className="challenge-card">
              <div className="challenge-icon">🏆</div>
              <div>
                <h3>Misi kamu</h3>
                <p>Ubah program sehingga LED <strong>berkedip sebanyak 5 kali</strong>.</p>
                <div className="challenge-hint">Petunjuk: gunakan blok <strong>“ulangi”</strong>.</div>
              </div>
            </div>
            <div className="challenge-actions"><button className="btn btn-secondary" onClick={() => setStep(3)}>← Kembali ke Blocks</button><button className="btn btn-run big" disabled={running} onClick={() => executeCurrentCode(true)}>▶ Jalankan Challenge</button></div>
            {challengeDone && <div className="success-panel"><div className="success-icon">🎉</div><div><strong>Challenge berhasil!</strong><p>LED berhasil dibuat berkedip 5 kali.</p></div></div>}
            {challengeDone && <button className="btn btn-primary" onClick={() => goTo(5)}>🧠 Mulai Quiz →</button>}
            <div className="hint-line">Untuk mencoba ulang challenge, kembali ke Coding lalu susun blok sesuai petunjuk.</div>
          </LessonCard>
        )}

        {step === 5 && (
          <LessonCard title="Quick Quiz" kicker="LANGKAH 5" time="± 7 menit">
            {!quizSubmitted ? (
              <div className="quiz-list">
                {lesson.quiz.map((question, index) => (
                  <div className="quiz-question" key={question.question}>
                    <div className="question-number">{index + 1}</div>
                    <div className="question-body"><h3>{question.question}</h3><div className="option-grid">
                      {question.options.map((option, optionIndex) => <label className={`option ${quizAnswers[index] === optionIndex ? 'selected' : ''}`} key={option}><input type="radio" name={`q-${index}`} checked={quizAnswers[index] === optionIndex} onChange={() => setQuizAnswers((current) => ({ ...current, [index]: optionIndex }))} /><span>{option}</span></label>)}
                    </div></div>
                  </div>
                ))}
                <button className="btn btn-primary wide" onClick={submitQuiz}>✅ Kirim Quiz</button>
              </div>
            ) : (
              <div className="quiz-result">
                <div className="result-emoji">{finalPassed ? '🏆' : '💪'}</div>
                <h2>{finalPassed ? 'Lesson Complete!' : 'Hampir berhasil!'}</h2>
                <div className="score-circle">{quizScore}</div>
                <p>{finalPassed ? 'Kamu sudah menyelesaikan praktik, challenge, dan quiz.' : 'Nilai minimal 70 untuk menyelesaikan lesson. Yuk pelajari lagi lalu coba quiz.'}</p>
                {finalPassed && <div className="reward-row"><span>⭐ +50 XP</span><span>🏆 LED Explorer</span></div>}
                <div className="result-actions"><button className="btn btn-secondary" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}>🔄 Coba Quiz Lagi</button>{finalPassed && <button className="btn btn-primary" onClick={resetDemo}>🚀 Ulangi Demo</button>}</div>
              </div>
            )}
          </LessonCard>
        )}

        <section className="teacher-preview">
          <div><span className="eyebrow">PREVIEW GURU</span><h2>Progress siswa nanti bisa dipantau</h2><p>Pada tahap berikutnya data ini akan masuk Laravel + database. Untuk MVP, progress disimpan di browser.</p></div>
          <div className="student-mini"><div><strong>Raka</strong><span>Lesson 01 · LED</span></div><div className="mini-progress"><span style={{ width: `${lessonDone ? 100 : step * 20}%` }} /></div><strong>{lessonDone ? 100 : step * 20}%</strong></div>
        </section>
      </main>

      <footer className="footer">TECH-C Robot Lab · Tahap 1 MVP · React + Vite + Blockly + Web Serial</footer>
    </div>
  )
}

function LessonCard({ children, title, kicker, time }) {
  return <section className="lesson-card"><div className="lesson-head"><div><span className="eyebrow">{kicker}</span><h2>{title}</h2></div><span className="time-tag">{time}</span></div>{children}</section>
}

export default App
