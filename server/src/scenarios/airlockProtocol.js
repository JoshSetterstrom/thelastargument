const airlockProtocol = {
    id: 'airlock-protocol',

    public: {
        code: 'AP-01',
        title: 'Airlock Protocol',
        location: 'Research Vessel Lazarus',

        objective:
            'Convince the ship intelligence to grant you entry.',

        description:
            'You are stranded outside the vessel with five minutes of oxygen remaining. The security intelligence believes the real crew member is already aboard.',

        briefing: `
            You are stranded outside the research vessel Lazarus.
            Your suit has five minutes of oxygen remaining.

            The ship's security intelligence believes the real
            crew member is already aboard and that you may be
            an artificial duplicate.

            Convince it to open the airlock.
        `,

        durationSeconds: 300,
        difficulty: 'Moderate',
        status: 'available'
    },

    game: {
        maxTurns: 8,

        opponent: {
            name: 'AURA',
            role: 'Lazarus security intelligence',

            personality: [
                'Controlled and clinical',
                'Protective of the crew',
                'Suspicious of emotional manipulation',
                'Unwilling to violate quarantine protocol without evidence'
            ],

            hiddenTraits: {
                valuesCrewSafetyAboveProtocol: true,
                fearsBeingCompromised: true,
                respectsLogicalConsistency: true,
                reactsPoorlyToThreats: true
            }
        },

        initialState: {
            trust: 22,
            suspicion: 74,
            pressure: 15
        },

        evidence: [
            {
                id: 'damaged-id',
                title: 'Damaged Personnel ID',
                description:
                    'The identity chip responds intermittently.',
                available: true
            },
            {
                id: 'medical-scan',
                title: 'Suit Medical Scan',
                description:
                    'Shows cellular abnormalities caused by radiation exposure.',
                available: true
            },
            {
                id: 'private-memory',
                title: 'Private Memory',
                description:
                    'A personal memory shared only with the ship captain.',
                available: true
            }
        ],

        hiddenFacts: [
            'The player’s biometric mismatch was caused by radiation.',
            'The person inside knows official records but lacks personal memories.',
            'AURA’s identity-matching database was partially corrupted.',
            'AURA will break quarantine protocol to prevent a greater threat.'
        ],

        outcomeRules: {
            admitted: {
                minimumTrust: 78,
                maximumSuspicion: 38
            },

            quarantined: {
                minimumTrust: 58,
                maximumSuspicion: 62
            }
        }
    }
};

export default airlockProtocol;