import { useState, useRef, useEffect, useCallback } from 'react'
import { Camera, CameraOff, Clock, CheckCircle2, PartyPopper } from 'lucide-react'
import jsQR from 'jsqr'
import Modal from '../../components/Modal'

function nowTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
function todayISO() {
    return new Date().toISOString().split('T')[0]
}

export default function AttendanceModal({
    isOpen, onClose,
    trainerRecord, ptClients, allMembers,
    onClockIn, onClockOut,
    onMarkClientAttendance, clientAttendance
}) {
    const [mode,            setMode]            = useState('self')
    const [scanning,        setScanning]        = useState(false)
    const [cameraError,     setCameraError]     = useState(null)
    const [scanResult,      setScanResult]      = useState(null)   // { success, name }
    const [sessionComplete, setSessionComplete] = useState(false)  // after clock-out

    const videoRef  = useRef(null)
    const canvasRef = useRef(null)
    const rafRef    = useRef(null)
    const streamRef = useRef(null)

    // Stop camera on modal close or mode switch away from client
    const stopCamera = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
        streamRef.current = null
        setScanning(false)
    }, [])

    useEffect(() => {
        if (!isOpen) { stopCamera(); setScanResult(null); setSessionComplete(false) }
    }, [isOpen, stopCamera])

    useEffect(() => {
        if (mode !== 'client') stopCamera()
    }, [mode, stopCamera])

    function handleClose() {
        stopCamera()
        setScanResult(null)
        setSessionComplete(false)
        onClose()
    }

    // ── Clock-Out: save record then show completion screen ────────────────────
    function handleClockOut() {
        onClockOut()            // dispatches ADD_TRAINER_ATTENDANCE with clockOut time
        setSessionComplete(true) // show "Session Complete" UI
    }

    // ── Reset after "Session Complete" screen is dismissed ────────────────────
    function handleSessionDone() {
        setSessionComplete(false)
        onClose()
    }

    // ── QR Scan ───────────────────────────────────────────────────────────────
    function tick() {
        const video  = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas) return

        if (video.readyState === HTMLMediaElement.HAVE_ENOUGH_DATA) {
            canvas.width  = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            const img  = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
            if (code?.data) { handleQRDecode(code.data); return }
        }
        rafRef.current = requestAnimationFrame(tick)
    }

    function startCamera() {
        setCameraError(null)
        setScanResult(null)
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                streamRef.current = stream
                if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
                setScanning(true)
                rafRef.current = requestAnimationFrame(tick)
            })
            .catch(() => setCameraError('Camera access was denied. Please allow camera permission and try again.'))
    }

    function handleQRDecode(data) {
        stopCamera()
        // QR encodes the memberId string e.g. "member-1"
        // Look up in ALL members (not just PT) so any client's QR works
        const searchList = allMembers?.length ? allMembers : ptClients
        const member = searchList.find(c => c.id === data)
        if (member) {
            onMarkClientAttendance(member)
            setScanResult({ success: true, name: member.name })
        } else {
            setScanResult({ success: false, name: data })
        }
    }

    // ── Derived state ─────────────────────────────────────────────────────────
    const today        = todayISO()
    const alreadyIn    = !!trainerRecord?.clockIn
    const alreadyOut   = !!trainerRecord?.clockOut
    const markedToday  = (clientAttendance || []).filter(r => r.date === today)

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Mark Attendance">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>

                {/* ── Mode tab switcher ── */}
                <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: 3 }}>
                    {[['self', 'My Attendance'], ['client', 'Client Attendance']].map(([key, label]) => (
                        <button key={key} onClick={() => setMode(key)} style={{
                            flex: 1, padding: '8px 0', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            fontWeight: 700, fontSize: 'var(--text-xs)',
                            background: mode === key ? 'var(--accent)' : 'transparent',
                            color: mode === key ? '#fff' : 'var(--text-muted)',
                            transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                </div>

                {/* ════════ SELF MODE ════════ */}
                {mode === 'self' && (
                    sessionComplete ? (
                        /* ── Session Complete screen ── */
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4) 0' }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CheckCircle2 size={36} color="#22c55e" />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontWeight: 800, fontSize: 'var(--text-base)', marginBottom: 4 }}>Session Complete!</p>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Your attendance has been recorded for today.</p>
                            </div>
                            {/* Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', width: '100%' }}>
                                <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', borderTop: '3px solid #22c55e' }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Clocked In</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#22c55e' }}>{trainerRecord?.clockIn || '—'}</div>
                                </div>
                                <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', borderTop: '3px solid #f59e0b' }}>
                                    <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Clocked Out</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#f59e0b' }}>{trainerRecord?.clockOut || nowTime()}</div>
                                </div>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} onClick={handleSessionDone}>
                                Done
                            </button>
                        </div>
                    ) : (
                        /* ── Normal clock-in/out view ── */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)' }}>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                                    Today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                    <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderTop: `3px solid ${alreadyIn ? '#22c55e' : 'var(--border)'}` }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Clock In</div>
                                        <div style={{ fontSize: 16, fontWeight: 800, color: alreadyIn ? '#22c55e' : 'var(--text-muted)' }}>
                                            {trainerRecord?.clockIn || '—'}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'center', padding: 'var(--space-3)', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', borderTop: `3px solid ${alreadyOut ? '#f59e0b' : 'var(--border)'}` }}>
                                        <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Clock Out</div>
                                        <div style={{ fontSize: 16, fontWeight: 800, color: alreadyOut ? '#f59e0b' : 'var(--text-muted)' }}>
                                            {trainerRecord?.clockOut || '—'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                                <button className="btn btn-primary" disabled={alreadyIn} onClick={onClockIn}
                                    style={{ opacity: alreadyIn ? 0.4 : 1, gap: 8 }}>
                                    <Clock size={15} />
                                    {alreadyIn ? '✓ Clocked In' : 'Clock In'}
                                </button>
                                <button className="btn btn-secondary" disabled={!alreadyIn || alreadyOut} onClick={handleClockOut}
                                    style={{ opacity: (!alreadyIn || alreadyOut) ? 0.4 : 1, gap: 8 }}>
                                    <Clock size={15} />
                                    Clock Out
                                </button>
                            </div>

                            {!alreadyIn && (
                                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Clock in first to enable Clock Out.
                                </p>
                            )}
                        </div>
                    )
                )}

                {/* ════════ CLIENT MODE ════════ */}
                {mode === 'client' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>

                        {/* QR Scanner area */}
                        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#000', aspectRatio: '4/3', maxHeight: 240 }}>
                            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', display: scanning ? 'block' : 'none' }} playsInline muted />
                            <canvas ref={canvasRef} style={{ display: 'none' }} />

                            {/* Idle placeholder */}
                            {!scanning && !scanResult && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'var(--bg-input)' }}>
                                    <Camera size={36} color="var(--text-muted)" />
                                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>Point camera at client's QR code</p>
                                    <button className="btn btn-primary btn-sm" onClick={startCamera}>
                                        <Camera size={13} /> Open Camera
                                    </button>
                                </div>
                            )}

                            {/* Scanning overlay */}
                            {scanning && (
                                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ width: 160, height: 160, border: '2px solid var(--accent)', borderRadius: 12, boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)' }} />
                                </div>
                            )}

                            {/* Scan result overlay */}
                            {scanResult && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: scanResult.success ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', backdropFilter: 'blur(4px)' }}>
                                    {scanResult.success ? (
                                        <>
                                            <CheckCircle2 size={44} color="#22c55e" />
                                            <p style={{ fontWeight: 800, color: '#22c55e', fontSize: 'var(--text-base)' }}>{scanResult.name}</p>
                                            <p style={{ fontSize: 11, color: '#22c55e' }}>Attendance Marked ✓</p>
                                        </>
                                    ) : (
                                        <>
                                            <CameraOff size={44} color="#ef4444" />
                                            <p style={{ fontWeight: 700, color: '#ef4444' }}>Unknown QR Code</p>
                                            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not a registered PT client</p>
                                        </>
                                    )}
                                    <button className="btn btn-secondary btn-sm" style={{ marginTop: 4 }} onClick={() => { setScanResult(null); startCamera() }}>
                                        Scan Again
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Scanning status bar */}
                        {scanning && (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>● Scanning for QR code…</span>
                                <button className="btn btn-secondary btn-sm" onClick={stopCamera}>
                                    <CameraOff size={12} /> Stop
                                </button>
                            </div>
                        )}

                        {/* Camera error */}
                        {cameraError && (
                            <p style={{ fontSize: 11, color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                                {cameraError}
                            </p>
                        )}

                        {/* Today's marked clients */}
                        {markedToday.length > 0 && (
                            <div>
                                <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                                    Marked today ({markedToday.length})
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                    {markedToday.map(r => (
                                        <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 999, padding: '3px 10px' }}>
                                            <CheckCircle2 size={10} color="#22c55e" />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e' }}>{r.memberName}</span>
                                            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{r.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Modal>
    )
}
