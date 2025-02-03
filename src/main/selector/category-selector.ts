import { Random, Range } from '@batpb/genart';

export class CategorySelector<Type> {
    readonly #CHOICES: Map<Type, Range> = new Map<Type, Range>();

    #sameChoice: boolean;
    #currentCategory: Type;
    #choice: number | undefined = undefined;

    constructor(choices: { category: Type; range: Range; }[], sameChoice: boolean) {
        for (const choice of choices) {
            this.#CHOICES.set(choice.category, choice.range);
        }

        this.#sameChoice = sameChoice;
        this.#currentCategory = this.getRandomCategory();
    }

    public get currentCategory(): Type | undefined {
        return this.#currentCategory;
    }

    public set currentCategory(category: Type | undefined) {
        if (category) {
            this.#currentCategory = category;
        }
    }

    public get sameChoice(): boolean {
        return this.#sameChoice;
    }

    public set sameChoice(sameChoice: boolean) {
        this.#sameChoice = sameChoice;
    }

    public getRandomCategory(): Type {
        const keys: Type[] = Array.from(this.#CHOICES.keys());
        return Random.randomElement(keys) ?? keys[0];
    }

    public setRandomCategory(): void {
        const keys: Type[] = Array.from(this.#CHOICES.keys());
        this.resetChoice();
        this.#currentCategory = Random.randomElement(keys) ?? keys[0];
    }

    public resetChoice(): void {
        this.#choice = undefined;
    }

    public getCurrentCategoryRange(): Range | undefined {
        if (this.#currentCategory) {
            return this.#CHOICES.get(this.#currentCategory);
        } else {
            return undefined;
        }
    }

    public getChoice(): number {
        let result: number;

        if (this.#sameChoice) {
            if (!this.#choice) {
                this.#choice = this.#calculateChoice();
            }

            result = this.#choice;
        } else {
            result = this.#calculateChoice();
        }

        return result;
    }

    #calculateChoice(): number {
        const range: Range | undefined = this.#CHOICES.get(this.#currentCategory);
        let result: number = 0;
        if (range) {
            result = Random.randomFloatInRange(range);
        }

        return result;
    }
}
