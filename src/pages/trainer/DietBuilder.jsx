import { useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'

const MEAL_TIMES = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Pre-Workout', 'Post-Workout', 'Dinner']

const FOOD_LIBRARY = [
    { name: 'Chicken Breast (200g)', calories: 330, protein: 62, carbs: 0, fat: 7 },
    { name: 'Brown Rice (150g)', calories: 170, protein: 4, carbs: 36, fat: 1 },
    { name: 'Oats (100g)', calories: 380, protein: 14, carbs: 62, fat: 8 },
    { name: 'Whey Protein (1 scoop)', calories: 120, protein: 24, carbs: 3, fat: 2 },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
    { name: 'Almonds (30g)', calories: 170, protein: 6, carbs: 6, fat: 15 },
    { name: 'Grilled Fish (200g)', calories: 260, protein: 46, carbs: 0, fat: 8 },
    { name: 'Sweet Potato (150g)', calories: 130, protein: 2, carbs: 30, fat: 0 },
    { name: 'Eggs (2 whole)', calories: 140, protein: 12, carbs: 0, fat: 10 },
    { name: 'Greek Yoghurt (150g)', calories: 100, protein: 17, carbs: 6, fat: 1 }
]

export default function DietBuilder() {
    const [meals, setMeals] = useState(MEAL_TIMES.map(name => ({ name, items: [] })))
    const [saved, setSaved] = useState(false)

    const addItem = (mealIndex, food) => {
        setMeals(prev => prev.map((m, i) => i === mealIndex ? { ...m, items: [...m.items, { ...food, id: Date.now() }] } : m))
    }

    const removeItem = (mealIndex, itemId) => {
        setMeals(prev => prev.map((m, i) => i === mealIndex ? { ...m, items: m.items.filter(it => it.id !== itemId) } : m))
    }

    const totals = meals.reduce((acc, meal) => {
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
                <h1>Diet Chart Builder</h1>
                <p>Create personalised meal plans for PT clients</p>
            </div>

            {/* Daily Total Bar */}
            <div className="card-flat" style={{ marginBottom: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', textAlign: 'center' }}>
                {[
                    { label: 'Calories', value: totals.calories, unit: 'kcal', color: 'var(--accent)' },
                    { label: 'Protein', value: totals.protein, unit: 'g', color: 'var(--success)' },
                    { label: 'Carbs', value: totals.carbs, unit: 'g', color: 'var(--info)' },
                    { label: 'Fat', value: totals.fat, unit: 'g', color: 'var(--danger)' }
                ].map(({ label, value, unit, color }) => (
                    <div key={label}>
                        <div className="font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color }}>{value}<span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{unit}</span></div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {meals.map((meal, mealIndex) => (
                    <div className="card-flat" key={meal.name}>
                        <h3 style={{ fontWeight: 700, marginBottom: 'var(--space-4)' }}>{meal.name}</h3>

                        {meal.items.length > 0 && (
                            <div style={{ marginBottom: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {meal.items.map(item => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-2) var(--space-3)', background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                                        <span style={{ fontWeight: 600 }}>{item.name}</span>
                                        <div style={{ display: 'flex', gap: 'var(--space-4)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                                            <span className="font-mono">{item.calories}kcal</span>
                                            <span>P:{item.protein}g C:{item.carbs}g F:{item.fat}g</span>
                                        </div>
                                        <button onClick={() => removeItem(mealIndex, item.id)} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {FOOD_LIBRARY.map(food => (
                                <button key={food.name} onClick={() => addItem(mealIndex, food)}
                                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-3)', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', cursor: 'pointer', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', transition: 'all var(--transition-fast)' }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
                                    <Plus size={12} /> {food.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <button className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-lg`} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }} style={{ marginTop: 'var(--space-6)', width: '100%' }} id="save-diet">
                <Save size={16} /> {saved ? '✓ Diet Plan Saved!' : 'Save Diet Plan'}
            </button>
        </div>
    )
}
