import { useApp } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { diets } from '../../data/diets'

export default function DietPlan() {
    const { user } = useAuth()

    // Only PT members see diet plan
    if (user?.membershipType !== 'pt') {
        return (
            <div className="animate-fade-in-up">
                <div className="page-header">
                    <h1>Diet Plan</h1>
                </div>
                <div className="card-flat" style={{ textAlign: 'center', padding: 'var(--space-16)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🔒</div>
                    <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-2)' }}>PT Membership Required</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Diet plans are available exclusively for Personal Training members. Speak to the gym owner to upgrade.</p>
                </div>
            </div>
        )
    }

    const plan = diets[0]
    const totals = plan.meals.reduce((acc, meal) => {
        meal.items.forEach(item => {
            acc.calories += item.calories
            acc.protein += item.protein
            acc.carbs += item.carbs
            acc.fat += item.fat
        })
        return acc
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 })

    return (
        <div className="animate-fade-in-up">
            <div className="page-header">
                <h1>My Diet Plan</h1>
                <p>Personalized nutrition from your trainer</p>
            </div>

            {/* Macro Summary */}
            <div className="card-flat" style={{ marginBottom: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', textAlign: 'center' }}>
                {[
                    { label: 'Calories', value: plan.targetCalories, actual: totals.calories, unit: 'kcal', color: 'var(--accent)' },
                    { label: 'Protein', value: plan.targetProtein, actual: totals.protein, unit: 'g', color: 'var(--success)' },
                    { label: 'Carbs', value: plan.targetCarbs, actual: totals.carbs, unit: 'g', color: 'var(--info)' },
                    { label: 'Fat', value: plan.targetFat, actual: totals.fat, unit: 'g', color: 'var(--danger)' }
                ].map(({ label, value, actual, unit, color }) => (
                    <div key={label}>
                        <div className="font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{actual}<span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{unit}</span></div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Target: {value}{unit}</div>
                    </div>
                ))}
            </div>

            {/* Meals */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {plan.meals.map(meal => {
                    const mealCals = meal.items.reduce((s, i) => s + i.calories, 0)
                    return (
                        <div className="card-flat" key={meal.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                                <div>
                                    <h3 style={{ fontWeight: 700 }}>{meal.name}</h3>
                                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{meal.time}</p>
                                </div>
                                <div className="font-mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>{mealCals} kcal</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {meal.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{item.name}</p>
                                            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{item.qty}</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textAlign: 'right' }}>
                                            <span className="font-mono">{item.calories}kcal</span>
                                            <span>P:{item.protein}g C:{item.carbs}g F:{item.fat}g</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
