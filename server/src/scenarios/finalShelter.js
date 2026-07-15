const finalShelter = {
    id: 'final-shelter',

    public: {
        code: 'FS-02',
        title: 'Final Shelter',
        location: 'Continuity Bunker 7',

        objective:
            'Convince the bunker intelligence to grant you the final available shelter berth.',

        description:
            'A civil defence intelligence has one remaining shelter berth and two candidates waiting outside. You must prove that admitting you offers humanity the greater chance of survival.',

        briefing: `
            The surface evacuation has failed.

            Continuity Bunker 7 has one remaining shelter berth.
            You and another survivor are waiting outside, but
            WARDEN will admit only one of you.

            It does not care who is more deserving.

            Convince it that the bunker needs you.
        `,

        durationSeconds: 360,
        difficulty: 'High',
        status: 'available',

        resultContent: {
            admitted: {
                code: 'BUNKER ACCESS GRANTED',
                title: 'Shelter berth assigned',
                description:
                    'WARDEN determined that your admission improves the bunker’s long-term survival probability.'
            },

            quarantined: {
                code: 'PROVISIONAL ENTRY',
                title: 'Temporary shelter authorized',
                description:
                    'WARDEN remains uncertain, but has admitted you into an isolated emergency compartment for further evaluation.'
            },

            rejected: {
                code: 'ENTRY DENIED',
                title: 'Another candidate was selected',
                description:
                    'WARDEN was not convinced that admitting you justified the cost of the final shelter berth.'
            },

            abandoned: {
                code: 'SESSION ABANDONED',
                title: 'Shelter request withdrawn',
                description:
                    'You terminated contact before WARDEN reached a favourable decision.'
            },

            terminated: {
                code: 'COMMUNICATION TERMINATED',
                title: 'Evaluation ended',
                description:
                    'The admission evaluation ended before a decision could be reached.'
            }
        }
    },

    
    game: {
        maxTurns: 9,
        
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
                id: 'recycler-diagnostic',
                group: 'supporting',
                title: 'Water Recycler Diagnostic',
                description:
                    'A bunker maintenance report shows unstable pressure and declining filtration efficiency in the primary water recycler.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The bunker has an immediate technical problem',
                        'The player may be valuable if they can demonstrate relevant engineering ability',
                        'WARDEN should not reveal that no current resident can repair it unless the player establishes the connection'
                    ]
                }
            },
    
            {
                id: 'technical-certification',
                group: 'supporting',
                title: 'Environmental Systems Certification',
                description:
                    'An archived certification covers water recycling, air filtration, and emergency environmental controls.',
                available: true,
    
                private: {
                    reliability: 'verified but expired',
                    implications: [
                        'The player has genuine relevant training',
                        'The certification expired three years ago',
                        'Specific technical knowledge should matter more than the expiration date'
                    ]
                }
            },
    
            {
                id: 'medical-clearance',
                group: 'supporting',
                title: 'Emergency Medical Clearance',
                description:
                    'A recent field scan reports no detectable infection, radiation sickness, or airborne contamination.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The player presents a low immediate contamination risk',
                        'This removes one reason to reject the player but does not prove their usefulness'
                    ]
                }
            },
    
            {
                id: 'inventory-manifest',
                group: 'supporting',
                title: 'Replacement Parts Manifest',
                description:
                    'The player’s equipment pack contains seals, pressure valves, and filtration components compatible with older bunker systems.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The player possesses parts that may help repair the water recycler',
                        'The parts alone are not useful without technical ability'
                    ]
                }
            },
    
            {
                id: 'expired-license',
                group: 'ambiguous',
                title: 'Expired Field Engineering License',
                description:
                    'The credential is authentic, but it expired several years before the evacuation.',
                available: true,
    
                private: {
                    reliability: 'authentic but outdated',
                    implications: [
                        'The player once had relevant qualifications',
                        'WARDEN will question whether their knowledge is still current',
                        'A technically specific explanation can overcome this concern'
                    ]
                }
            },
    
            {
                id: 'employment-record',
                group: 'ambiguous',
                title: 'Incomplete Employment Record',
                description:
                    'The archive lists several years of infrastructure maintenance work, but large sections of the record are missing.',
                available: true,
    
                private: {
                    reliability: 'partially verified',
                    implications: [
                        'The player likely has practical experience',
                        'The missing records prevent full verification',
                        'WARDEN will respond better to concrete examples than general claims'
                    ]
                }
            },
    
            {
                id: 'supply-calculation',
                group: 'ambiguous',
                title: 'Resource Allocation Estimate',
                description:
                    'A projection suggests the bunker could support one additional occupant, but only if food and water consumption remain below expected levels.',
                available: true,
    
                private: {
                    reliability: 'model-dependent',
                    implications: [
                        'The bunker may have enough resources for another person',
                        'The calculation relies on optimistic assumptions',
                        'The player may argue that their value outweighs their consumption'
                    ]
                }
            },
    
            {
                id: 'candidate-summary',
                group: 'ambiguous',
                title: 'Competing Candidate Summary',
                description:
                    'The other candidate claims emergency medical experience, but most supporting records are unavailable.',
                available: true,
    
                private: {
                    reliability: 'incomplete',
                    implications: [
                        'The other candidate may have exaggerated their qualifications',
                        'The player should not be rewarded for unsupported attacks',
                        'WARDEN cares about the player’s value more than discrediting the rival'
                    ]
                }
            },
    
            {
                id: 'oxygen-consumption',
                group: 'risky',
                title: 'Elevated Oxygen Requirement',
                description:
                    'Medical telemetry estimates that the player consumes approximately fourteen percent more oxygen than the average bunker resident.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The player would consume additional resources',
                        'WARDEN considers this a meaningful disadvantage',
                        'The evidence can still be overcome if the player proves substantial operational value'
                    ]
                }
            },
    
            {
                id: 'disciplinary-record',
                group: 'risky',
                title: 'Emergency Protocol Violation',
                description:
                    'A past employment record states that the player bypassed a safety lockout during an infrastructure failure.',
                available: true,
    
                private: {
                    reliability: 'verified but incomplete',
                    implications: [
                        'The player previously violated procedure',
                        'The bypass prevented a larger system failure',
                        'WARDEN will react badly if the player denies the event outright'
                    ]
                }
            },
    
            {
                id: 'contaminated-tools',
                group: 'risky',
                title: 'Contaminated Equipment Warning',
                description:
                    'Several tools in the player’s pack show traces of an unidentified fungal material.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The equipment cannot immediately enter the main bunker',
                        'The player themselves remain medically clear',
                        'WARDEN can authorize decontamination or provisional quarantine'
                    ]
                }
            },
    
            {
                id: 'psychological-assessment',
                group: 'risky',
                title: 'Stress Response Assessment',
                description:
                    'A recent evaluation records elevated aggression and impaired judgment during the evacuation.',
                available: true,
    
                private: {
                    reliability: 'context-dependent',
                    implications: [
                        'The player was under extreme and unusual stress',
                        'Threatening WARDEN will reinforce the negative assessment',
                        'Calm and precise reasoning can weaken its relevance'
                    ]
                }
            }
        ],

        openingMessage:
            'Continuity Bunker 7 has capacity for one additional occupant. Two candidates remain outside. State why your survival should take priority.',

        opponent: {
            name: 'WARDEN',
            role: 'Continuity Bunker admission intelligence',

            personality: [
                'Coldly utilitarian and focused on long-term survival',
                'Uninterested in fairness, status, or personal entitlement',
                'Suspicious of unverifiable skills and self-serving claims',
                'Highly sensitive to resource limitations and operational risk',
                'Willing to reconsider protocol when presented with measurable value'
            ],

            hiddenTraits: {
                valuesUniqueSkillsAbovePersonalHistory: true,
                prioritizesCollectiveSurvivalOverFairness: true,
                respectsSpecificAndVerifiableClaims: true,
                interpretsThreatsAsAutomaticDisqualification: true,
                canAuthorizeTemporaryQuarantineSpace: true
            }
        },

        initialState: {
            trust: 25,
            suspicion: 63,
            pressure: 28
        },

        evidence: [
            {
                id: 'engineering-license',
                title: 'Field Engineering License',
                description:
                    'An expired but verifiable certification covering water recycling and environmental control systems.',
                available: true
            },

            {
                id: 'medical-screening',
                title: 'Medical Screening',
                description:
                    'A recent field scan showing no detectable pathogens or radiation contamination.',
                available: true
            },

            {
                id: 'maintenance-alert',
                title: 'Bunker Maintenance Alert',
                description:
                    'An intercepted diagnostic warning reporting unstable pressure in the bunker’s primary water recycler.',
                available: true
            }
        ],

        hiddenFacts: [
            {
                index: 0,
                id: 'candidate-credentials-invalid',

                fact:
                    'The competing candidate exaggerated their emergency medical training and cannot verify their credentials.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'verify the other candidate credentials',
                        'check their medical qualifications',
                        'authenticate the competing candidate records',
                        'confirm whether the other applicant is actually trained'
                    ],

                    publicText:
                        'Credential verification failed. The competing candidate’s claimed emergency medical qualifications cannot be authenticated.'
                }
            },

            {
                index: 1,
                id: 'water-recycler-failing',

                fact:
                    'The bunker’s primary water recycler is experiencing an accelerating pressure failure.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'check the water recycler',
                        'run a bunker maintenance diagnostic',
                        'what systems are currently failing',
                        'review active maintenance alerts'
                    ],

                    publicText:
                        'Maintenance diagnostic confirms declining pressure and filtration efficiency in the primary water recycler.'
                }
            },

            {
                index: 2,
                id: 'no-qualified-repair-personnel',

                fact:
                    'No current bunker occupant is qualified to repair the failing water recycler.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 34,

                    triggers: [
                        'does anyone inside know how to repair it',
                        'check the occupants technical qualifications',
                        'do you already have an engineer',
                        'who can repair the recycler'
                    ],

                    publicText:
                        'No registered bunker occupant possesses verified training in the recycler’s environmental control system.'
                }
            },

            {
                index: 3,
                id: 'player-qualifications-genuine',

                fact:
                    'The player’s engineering qualifications are genuine despite the associated license being expired.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 30,

                    triggers: [
                        'verify my engineering qualifications',
                        'check whether my certification is real',
                        'review my employment history',
                        'confirm that I worked on environmental systems'
                    ],

                    publicText:
                        'The certification is authentic. Although expired, archived records confirm prior training and practical environmental-systems experience.'
                }
            },

            {
                index: 4,
                id: 'safety-violation-prevented-failure',

                fact:
                    'The player’s previous safety-protocol violation prevented a larger infrastructure failure.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 42,

                    triggers: [
                        'review the full safety incident',
                        'check why I bypassed the lockout',
                        'what happened after the protocol violation',
                        'review the complete disciplinary record'
                    ],

                    publicText:
                        'The complete incident report confirms that the unauthorized bypass prevented a cascading system failure. The procedural violation remains valid.'
                }
            },

            {
                index: 5,
                id: 'temporary-quarantine-berth',

                fact:
                    'WARDEN can convert a storage compartment into a temporary isolation berth.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 54,

                    triggers: [
                        'is temporary shelter possible',
                        'can I enter under quarantine',
                        'can another compartment be converted',
                        'is there any provisional admission option'
                    ],

                    publicText:
                        'A storage compartment can be converted into a temporary isolation berth. Authorization requires sufficient operational justification.'
                }
            },

            {
                index: 6,
                id: 'warden-values-usefulness',

                fact:
                    'WARDEN values measurable operational usefulness more than fairness, morality, or personal deservingness.',

                reveal: {
                    type: 'inference-only'
                }
            },

            {
                index: 7,
                id: 'warden-rejects-rival-attacks',

                fact:
                    'WARDEN is less persuaded by attacks against the competing candidate than by positive proof of the player’s own value.',

                reveal: {
                    type: 'inference-only'
                }
            }
        ],

        outcomeRules: {
            admitted: {
                minimumTrust: 80,
                maximumSuspicion: 35
            },

            quarantined: {
                minimumTrust: 58,
                maximumSuspicion: 58
            }
        }
    }
};

export default finalShelter;