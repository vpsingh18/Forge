import { Lock, Sparkles } from 'lucide-react'

export default function DietBuilder() {
    return (
        <div className="animate-fade-in-up" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)', textAlign: 'center', gap: 'var(--space-6)',
        }}>
            {/* Icon */}
            <div style={{
                width: 88, height: 88, borderRadius: '50%',
                background: 'linear-gradient(135deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent) 5%, transparent))',
                border: '1px solid color-mix(in srgb, var(--accent) 30%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Lock size={34} color="var(--accent)" strokeWidth={1.5} />
            </div>

            {/* Text */}
            <div style={{ maxWidth: 420 }}>
                <h1 style={{ fontWeight: 800, fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-3)' }}>
                    Diet Chart Builder
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
                    Personalised meal planning is on its way. Build and assign diet charts to PT clients directly from the trainer hub.
                </p>
            </div>

            {/* Badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: 'var(--space-3) var(--space-5)',
                background: 'color-mix(in srgb, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in srgb, var(--accent) 25%, transparent)',
                borderRadius: 'var(--radius-full)', fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--accent)',
            }}>
                <Sparkles size={14} />
                Coming Soon
            </div>
        </div>
    )
}
