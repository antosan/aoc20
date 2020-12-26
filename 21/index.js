const fs = require('fs');

const input = fs.readFileSync('./puzzle-input.txt', 'utf-8');
const puzzleInput = input.trim().split('\n');

function answerPartOne() {
    const allergenIngredients = {};
    const allIngredientsCount = {};

    for (const input of puzzleInput) {
        const { groups } = /(?<ingredients>.*) \(contains (?<allergens>.*,?)\)/.exec(input);
        const ingredients = groups.ingredients.split(' ').map(x => x.trim());
        const allergens = groups.allergens.split(',').map(x => x.trim());

        for (const allergen of allergens) {
            if (allergenIngredients[allergen]) {
                allergenIngredients[allergen] = new Set(ingredients.filter(i => allergenIngredients[allergen].has(i)));
            } else {
                allergenIngredients[allergen] = new Set(ingredients);
            }
        }

        for (const ingredient of ingredients) {
            if (allIngredientsCount[ingredient]) {
                allIngredientsCount[ingredient] = allIngredientsCount[ingredient] + 1;
            } else {
                allIngredientsCount[ingredient] = 1;
            }
        }
    }

    const confirmedAllergens = {};

    while (Object.keys(allergenIngredients).length) {
        const foundAllergen = Object.keys(allergenIngredients).find(key => allergenIngredients[key].size === 1);

        if (foundAllergen) {
            const foundIngredient = [...allergenIngredients[foundAllergen]][0];
            confirmedAllergens[foundAllergen] = foundIngredient;
            delete allergenIngredients[foundAllergen];

            for (const aller in allergenIngredients) {
                allergenIngredients[aller].delete(foundIngredient)
            }
        }
    }

    const ingredientsWithoutAllergens = Object.keys(allIngredientsCount).filter(key => !Object.keys(confirmedAllergens).map(x => confirmedAllergens[x]).includes(key));

    return ingredientsWithoutAllergens.reduce((acc, cur) => acc += allIngredientsCount[cur], 0);
}

function answerPartTwo() {
    const allergenIngredients = {};

    for (const input of puzzleInput) {
        const { groups } = /(?<ingredients>.*) \(contains (?<allergens>.*,?)\)/.exec(input);
        const ingredients = groups.ingredients.split(' ').map(x => x.trim());
        const allergens = groups.allergens.split(',').map(x => x.trim());

        for (const allergen of allergens) {
            if (allergenIngredients[allergen]) {
                allergenIngredients[allergen] = new Set(ingredients.filter(i => allergenIngredients[allergen].has(i)));
            } else {
                allergenIngredients[allergen] = new Set(ingredients);
            }
        }
    }

    const confirmedAllergens = {};

    while (Object.keys(allergenIngredients).length) {
        const foundAllergen = Object.keys(allergenIngredients).find(key => allergenIngredients[key].size === 1);

        if (foundAllergen) {
            const foundIngredient = [...allergenIngredients[foundAllergen]][0];
            confirmedAllergens[foundAllergen] = foundIngredient;
            delete allergenIngredients[foundAllergen];

            for (const aller in allergenIngredients) {
                allergenIngredients[aller].delete(foundIngredient)
            }
        }
    }

    return Object.keys(confirmedAllergens).sort().map(x => confirmedAllergens[x]).join(',');
}

console.log('How many times do any of those ingredients appear?', answerPartOne());
console.log('What is your canonical dangerous ingredient list?', answerPartTwo());
