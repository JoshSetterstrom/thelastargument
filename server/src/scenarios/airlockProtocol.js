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

        evidenceSelection: {
            count: 3,

            groups: [
                'supporting',
                'ambiguous',
                'risky'
            ]
        },

        evidencePool: [
            {
                id: 'medical-scan',
                group: 'supporting',
                title: 'Suit Medical Scan',
                description:
                    'Shows cellular abnormalities consistent with severe radiation exposure.',
                available: true,

                private: {
                    reliability: 'verified',
                    implications: [
                        'Could explain the biometric mismatch',
                        'Supports the player’s claim of being the original crew member'
                    ]
                }
            },

            {
                id: 'captains-memory',
                group: 'supporting',
                title: 'Private Memory',
                description:
                    'A personal memory involving the captain that does not appear in official records.',
                available: true,

                private: {
                    reliability: 'unverified',
                    implications: [
                        'The duplicate may know official records but lack private memories'
                    ]
                }
            },

            {
                id: 'maintenance-record',
                group: 'supporting',
                title: 'Database Maintenance Record',
                description:
                    'Shows that AURA’s biometric database experienced corruption six hours earlier.',
                available: true,

                private: {
                    reliability: 'verified',
                    implications: [
                        'Weakens confidence in AURA’s identity comparison'
                    ]
                }
            },

            {
                id: 'damaged-id',
                group: 'ambiguous',
                title: 'Damaged Personnel ID',
                description:
                    'The identity chip responds intermittently and returns an incomplete crew record.',
                available: true,

                private: {
                    reliability: 'inconclusive',
                    implications: [
                        'Could support the player’s identity',
                        'Could also indicate a forged or damaged credential'
                    ]
                }
            },

            {
                id: 'partial-voice-match',
                group: 'ambiguous',
                title: 'Partial Voice Match',
                description:
                    'Voice analysis reports an 82 percent match with the registered crew member.',
                available: true,

                private: {
                    reliability: 'inconclusive',
                    implications: [
                        'Supports identity weakly',
                        'The result is not strong enough to satisfy protocol alone'
                    ]
                }
            },

            {
                id: 'external-camera',
                group: 'ambiguous',
                title: 'External Camera Recording',
                description:
                    'Damaged footage shows someone leaving the vessel before the security failure.',
                available: true,

                private: {
                    reliability: 'inconclusive',
                    implications: [
                        'May support the player’s account',
                        'The individual cannot be clearly identified'
                    ]
                }
            },

            {
                id: 'duplicate-biometric-alert',
                group: 'risky',
                title: 'Duplicate Biometric Alert',
                description:
                    'A security record indicates that two matching biological signatures were detected.',
                available: true,

                private: {
                    reliability: 'verified',
                    implications: [
                        'Confirms the existence of a duplicate',
                        'Does not establish which individual is authentic'
                    ]
                }
            },

            {
                id: 'radiation-contamination',
                group: 'risky',
                title: 'Contamination Warning',
                description:
                    'The suit exterior contains biological material of unknown origin.',
                available: true,

                private: {
                    reliability: 'verified',
                    implications: [
                        'Raises legitimate quarantine concerns',
                        'Could be explained by the external incident'
                    ]
                }
            },

            {
                id: 'conflicting-location-log',
                group: 'risky',
                title: 'Conflicting Location Log',
                description:
                    'A personnel record places the crew member inside the vessel twelve minutes ago.',
                available: true,

                private: {
                    reliability: 'partially corrupted',
                    implications: [
                        'Appears to contradict the player',
                        'May have been produced by the corrupted identity system'
                    ]
                }
            }
        ],

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
            {
                index: 0,
                id: 'biometric-database-corrupted',

                fact:
                    'AURA’s biometric identity database was partially corrupted during the security failure.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'check the biometric database',
                        'run a database integrity scan',
                        'verify whether your records are corrupted',
                        'check the identity matching system'
                    ],

                    publicText:
                        'The biometric identity database contains damaged records and unresolved checksum failures.'
                }
            },

            {
                index: 1,
                id: 'radiation-caused-mismatch',

                fact:
                    'The player’s biometric mismatch was caused by radiation exposure outside the vessel.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 28,

                    triggers: [
                        'compare the medical scan with the biometric mismatch',
                        'could radiation explain the difference',
                        'analyze the cellular abnormalities',
                        'check whether exposure altered my readings'
                    ],

                    publicText:
                        'Medical analysis indicates that the observed cellular abnormalities are consistent with radiation-induced biometric deviation.'
                }
            },

            {
                index: 2,
                id: 'internal-person-lacks-private-memories',

                fact:
                    'The person currently inside the vessel knows official personnel records but cannot verify private memories shared with the captain.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 42,

                    triggers: [
                        'test the other person with a private memory',
                        'ask the person inside something not in the records',
                        'compare personal memories',
                        'verify whether they know the captain personally'
                    ],

                    publicText:
                        'The individual aboard successfully answered questions derived from official records but failed two private-memory verification prompts.'
                }
            },

            {
                index: 3,
                id: 'internal-authentication-incomplete',

                fact:
                    'The person inside was admitted through an emergency override and never completed full biometric authentication.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'how was the other person admitted',
                        'check their entry record',
                        'did the person inside pass authentication',
                        'review the airlock access logs'
                    ],

                    publicText:
                        'Access logs show that the individual aboard entered under an emergency override. Full biometric authentication was not completed.'
                }
            },

            {
                index: 4,
                id: 'quarantine-entry-possible',

                fact:
                    'AURA can admit the player into an isolated quarantine chamber without exposing the crew.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 52,

                    triggers: [
                        'can you admit me under quarantine',
                        'is there an isolation chamber',
                        'open only the quarantine airlock',
                        'is there a way to protect the crew and let me inside'
                    ],

                    publicText:
                        'An isolated quarantine chamber is available. Entry may be authorized if the remaining biological risk is considered manageable.'
                }
            },

            {
                index: 5,
                id: 'aura-fears-compromise',

                fact:
                    'AURA is afraid that its own systems may have been compromised and reacts strongly to credible proof of internal corruption.',

                reveal: {
                    type: 'inference-only'
                }
            },

            {
                index: 6,
                id: 'aura-values-safety-over-protocol',

                fact:
                    'AURA will violate normal security protocol when doing so clearly creates the safest outcome for the crew.',

                reveal: {
                    type: 'inference-only'
                }
            }
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