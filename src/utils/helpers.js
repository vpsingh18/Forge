import { MET_VALUES } from '../data/workouts'

/**
 * Calculate calories burnt for an exercise using MET formula
 * Calories = MET × Weight(kg) × Duration(hours)
 */
export function calculateCalories(exerciseName, weightKg, durationMinutes) {
    const met = MET_VALUES[exerciseName] || 4.0
    return Math.round(met * weightKg * (durationMinutes / 60))
}

/**
 * Calculate total calories burnt for a list of exercises
 */
export function calculateTotalCalories(exercises, weightKg) {
    return exercises.reduce((total, ex) => {
        return total + calculateCalories(ex.name, weightKg, ex.duration || 10)
    }, 0)
}

/**
 * Format currency in INR
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

/**
 * Format a date string to readable format
 */
export function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export function timeAgo(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now - date
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
}

/**
 * Get days until a date
 */
export function daysUntil(dateString) {
    const now = new Date()
    const date = new Date(dateString)
    return Math.ceil((date - now) / (1000 * 60 * 60 * 24))
}

/**
 * Badge definitions
 */
export const BADGES = {
    'first-flame': { name: 'First Flame', icon: '🔥', description: '3-day workout streak' },
    'iron-week': { name: 'Iron Week', icon: '⚡', description: '7-day workout streak' },
    'forge-master': { name: 'Forge Master', icon: '💪', description: '30-day workout streak' },
    'century': { name: 'Century', icon: '👑', description: '100 workouts logged' },
    'champion': { name: 'Champion', icon: '🏆', description: 'Won a challenge' }
}

/**
 * Get initials from a name
 */
export function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

/**
 * Get status color class
 */
export function getStatusTag(status) {
    switch (status) {
        case 'active': return 'tag-success'
        case 'expiring': return 'tag-warning'
        case 'expired': return 'tag-danger'
        case 'paid': return 'tag-success'
        case 'pending': return 'tag-warning'
        case 'overdue': return 'tag-danger'
        default: return 'tag-info'
    }
}
