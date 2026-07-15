export const startGame = async scenarioId => {
    const response = await fetch('/api/games', {
        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            scenarioId
        })
    });

    const result = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.error?.message ??
            'Unable to start the selected scenario.'
        );
    }

    return result.data;
};

export const getGame = async gameId => {
    const response = await fetch(`/api/games/${gameId}`);

    const result = await response
        .json()
        .catch(() => null);

    if (!response.ok) {
        throw new Error(
            result?.error?.message ??
            'Unable to retrieve the game session.'
        );
    }

    return result.data;
};