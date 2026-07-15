import { randomInt } from 'node:crypto';

const takeRandom = items => {
    if (!items.length) {
        return null;
    }

    return items[randomInt(items.length)];
};

const shuffle = items => {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const randomIndex = randomInt(index + 1);

        [
            result[index],
            result[randomIndex]
        ] = [
            result[randomIndex],
            result[index]
        ];
    }

    return result;
};

export const selectEvidence = ({
    pool,
    count,
    groups = []
}) => {
    const availableEvidence = pool.filter(
        evidence => evidence.available !== false
    );

    const selected = [];

    for (const group of groups) {
        const candidates = availableEvidence.filter(
            evidence =>
                evidence.group === group &&
                !selected.some(item => item.id === evidence.id)
        );

        const evidence = takeRandom(candidates);

        if (evidence) {
            selected.push(evidence);
        }
    }

    if (selected.length < count) {
        const remaining = shuffle(
            availableEvidence.filter(
                evidence =>
                    !selected.some(item => item.id === evidence.id)
            )
        );

        selected.push(
            ...remaining.slice(0, count - selected.length)
        );
    }

    return selected.slice(0, count);
};