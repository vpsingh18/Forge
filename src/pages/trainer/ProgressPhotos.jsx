import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { Camera, Upload, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { getInitials } from '../../utils/helpers'

export default function ProgressPhotos() {
    const { state } = useApp()
    const { user } = useAuth()
    const trainerData = state.trainers.find(t => t.id === user?.id) || state.trainers[0]
    const myClients = state.members.filter(m => m.trainerId === trainerData?.id)

    // Only PT clients for this page
    const ptClients = myClients.filter(c => c.membershipType === 'pt')

    // photos: { [memberId]: [{ id, url, date }] } — resets on refresh, replaced by API when DB is ready
    const [photos, setPhotos] = useState({})
    const [selectedClientId, setSelectedClientId] = useState(ptClients[0]?.id ?? null)
    const [lightbox, setLightbox] = useState(null) // { clientId, index }
    const fileRef = useRef(null)

    function handleUpload(e) {
        const files = Array.from(e.target.files)
        if (!files.length || !selectedClientId) return
        files.forEach(file => {
            const reader = new FileReader()
            reader.onload = ev => {
                const newPhoto = {
                    id: `ph-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    url: ev.target.result,
                    date: new Date().toISOString().split('T')[0],
                }
                setPhotos(prev => ({
                    ...prev,
                    [selectedClientId]: [...(prev[selectedClientId] ?? []), newPhoto],
                }))
            }
            reader.readAsDataURL(file)
        })
        e.target.value = ''
    }

    function removePhoto(clientId, photoId) {
        setPhotos(prev => ({
            ...prev,
            [clientId]: (prev[clientId] ?? []).filter(p => p.id !== photoId),
        }))
    }

    const clientPhotos = photos[selectedClientId] ?? []
    const selectedClient = ptClients.find(c => c.id === selectedClientId)

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1><span>Progress</span> <span className="text-gradient">Photos</span></h1>
                <p>Visual check-ins · {ptClients.length} PT client{ptClients.length !== 1 ? 's' : ''}</p>
            </div>

            {ptClients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                    <Camera size={40} strokeWidth={1.5} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>No PT clients assigned</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>

                    {/* ── Client list ── */}
                    <div className="card-flat">
                        <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-3)' }}>
                            PT Clients
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                            {ptClients.map(c => {
                                const count = (photos[c.id] ?? []).length
                                const isSelected = selectedClientId === c.id
                                return (
                                    <button key={c.id} onClick={() => setSelectedClientId(c.id)} style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: 'var(--space-3)', borderRadius: 'var(--radius-md)',
                                        border: `1px solid ${isSelected ? 'var(--accent)' : 'transparent'}`,
                                        background: isSelected ? 'var(--accent-glow)' : 'transparent',
                                        cursor: 'pointer', width: '100%', textAlign: 'left',
                                        transition: 'all 0.15s',
                                    }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 8,
                                            background: isSelected ? 'var(--accent)' : 'var(--bg-input)',
                                            color: isSelected ? 'var(--text-inverse)' : 'var(--text-primary)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 11, fontWeight: 800, flexShrink: 0,
                                        }}>
                                            {getInitials(c.name)}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: isSelected ? 'var(--accent)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {c.name}
                                            </p>
                                            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                                                {count} photo{count !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* ── Gallery area ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

                        {/* Header row */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <h2 style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>{selectedClient?.name}</h2>
                                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                                    {clientPhotos.length} photo{clientPhotos.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            <>
                                <input type="file" accept="image/*" multiple ref={fileRef} style={{ display: 'none' }} onChange={handleUpload} />
                                <button className="btn btn-primary" onClick={() => fileRef.current?.click()}>
                                    <Upload size={15} /> Upload Photos
                                </button>
                            </>
                        </div>

                        {/* Empty state — no button, Upload Photos at top is the CTA */}
                        {clientPhotos.length === 0 ? (
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                gap: 'var(--space-3)', padding: 'var(--space-16)',
                                border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)',
                                color: 'var(--text-muted)', textAlign: 'center',
                            }}>
                                <Camera size={40} strokeWidth={1.5} style={{ opacity: 0.3 }} />
                                <div>
                                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 4 }}>No photos yet</p>
                                    <p style={{ fontSize: 'var(--text-xs)' }}>Use the Upload Photos button above to add progress photos</p>
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                                {clientPhotos.map((photo, idx) => (
                                    <div key={photo.id}
                                        style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' }}
                                        onClick={() => setLightbox({ clientId: selectedClientId, index: idx })}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'scale(1.02)'
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                                            e.currentTarget.querySelector('.del-btn').style.opacity = '1'
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = 'scale(1)'
                                            e.currentTarget.style.boxShadow = 'none'
                                            e.currentTarget.querySelector('.del-btn').style.opacity = '0'
                                        }}
                                    >
                                        <img src={photo.url} alt={`Progress ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 'var(--space-2) var(--space-3)', background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)', fontSize: 10, color: '#fff', fontWeight: 600 }}>
                                            {new Date(photo.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <button className="del-btn"
                                            onClick={e => { e.stopPropagation(); removePhoto(selectedClientId, photo.id) }}
                                            style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.15s' }}>
                                            <X size={13} />
                                        </button>
                                    </div>
                                ))}

                                {/* Add more tile */}
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-lg)', border: '2px dashed var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                                >
                                    <Plus size={26} />
                                    <span style={{ fontSize: 11, fontWeight: 600 }}>Add Photo</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── Lightbox ── */}
            {lightbox && (() => {
                const imgs = photos[lightbox.clientId] ?? []
                const photo = imgs[lightbox.index]
                if (!photo) return null
                const client = ptClients.find(c => c.id === lightbox.clientId)
                return (
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 'var(--space-6)' }}
                        onClick={() => setLightbox(null)}
                    >
                        {lightbox.index > 0 && (
                            <button onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, index: p.index - 1 })) }}
                                style={{ position: 'absolute', left: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ChevronLeft size={22} />
                            </button>
                        )}

                        <div onClick={e => e.stopPropagation()} style={{ maxWidth: 480, width: '100%', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
                            <img src={photo.url} alt="Progress" style={{ width: '100%', display: 'block', maxHeight: '80vh', objectFit: 'contain', background: '#000' }} />
                            <div style={{ background: 'var(--bg-card)', padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{client?.name}</p>
                                    <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                        {new Date(photo.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{lightbox.index + 1} / {imgs.length}</span>
                            </div>
                        </div>

                        {lightbox.index < imgs.length - 1 && (
                            <button onClick={e => { e.stopPropagation(); setLightbox(p => ({ ...p, index: p.index + 1 })) }}
                                style={{ position: 'absolute', right: 24, width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ChevronRight size={22} />
                            </button>
                        )}

                        <button onClick={() => setLightbox(null)}
                            style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <X size={18} />
                        </button>
                    </div>
                )
            })()}
        </div>
    )
}
