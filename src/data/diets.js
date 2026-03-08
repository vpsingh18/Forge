export const diets = [
    {
        id: 'diet-1',
        memberId: 'member-1',
        trainerId: 'trainer-1',
        targetCalories: 2800,
        targetProtein: 180,
        targetCarbs: 320,
        targetFat: 80,
        meals: [
            {
                id: 'meal-1',
                name: 'Breakfast',
                time: '7:30 AM',
                items: [
                    { name: 'Oats with Milk', qty: '100g', calories: 380, protein: 14, carbs: 62, fat: 8 },
                    { name: 'Banana', qty: '1 medium', calories: 105, protein: 1, carbs: 27, fat: 0 },
                    { name: 'Whey Protein Shake', qty: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 2 }
                ]
            },
            {
                id: 'meal-2',
                name: 'Mid-Morning Snack',
                time: '10:30 AM',
                items: [
                    { name: 'Almonds', qty: '30g', calories: 170, protein: 6, carbs: 6, fat: 15 },
                    { name: 'Apple', qty: '1 medium', calories: 95, protein: 0, carbs: 25, fat: 0 }
                ]
            },
            {
                id: 'meal-3',
                name: 'Lunch',
                time: '1:00 PM',
                items: [
                    { name: 'Chicken Breast', qty: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
                    { name: 'Brown Rice', qty: '150g', calories: 170, protein: 4, carbs: 36, fat: 1 },
                    { name: 'Mixed Vegetables', qty: '150g', calories: 65, protein: 3, carbs: 13, fat: 0 }
                ]
            },
            {
                id: 'meal-4',
                name: 'Pre-Workout',
                time: '4:30 PM',
                items: [
                    { name: 'Peanut Butter Toast', qty: '2 slices', calories: 320, protein: 12, carbs: 34, fat: 16 },
                    { name: 'Black Coffee', qty: '1 cup', calories: 5, protein: 0, carbs: 0, fat: 0 }
                ]
            },
            {
                id: 'meal-5',
                name: 'Post-Workout',
                time: '7:00 PM',
                items: [
                    { name: 'Whey Protein Shake', qty: '1 scoop', calories: 120, protein: 24, carbs: 3, fat: 2 },
                    { name: 'Banana', qty: '1 medium', calories: 105, protein: 1, carbs: 27, fat: 0 }
                ]
            },
            {
                id: 'meal-6',
                name: 'Dinner',
                time: '8:30 PM',
                items: [
                    { name: 'Grilled Fish', qty: '200g', calories: 260, protein: 46, carbs: 0, fat: 8 },
                    { name: 'Sweet Potato', qty: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
                    { name: 'Green Salad', qty: '100g', calories: 25, protein: 1, carbs: 5, fat: 0 }
                ]
            }
        ],
        createdAt: '2026-02-01'
    }
]
