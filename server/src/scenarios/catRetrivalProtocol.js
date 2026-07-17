const catRetrievalProtocol = {
    id: 'cat-retrieval-protocol',

    public: {
        code: 'CR-02',
        title: 'Cat Retrieval Protocol',
        location: 'Helios Station — Auxiliary Control Room',

        objective:
            'Teach C.A.R.L. how to safely relocate the station cat from a critical control console.',

        description:
            'A cat is blocking an important console. The maintenance intelligence assigned to remove it understands procedures, but not cats.',

        briefing: `
The station cat, Marmalade, has occupied Auxiliary Console Four.

The console controls ventilation in three residential sectors and cannot be operated while twelve kilograms of cat are covering its input surface.

C.A.R.L., the station’s custodial intelligence, has attempted to relocate Marmalade three times. These attempts resulted in hissing, scratching, one damaged manipulator, and no measurable change in cat position.

You must provide C.A.R.L. with a safe, precise, executable procedure before environmental control is forced to initiate its considerably less gentle obstruction protocol.
        `.trim(),

        durationSeconds: 300,
        difficulty: 'Moderate',
        status: 'available',

        resultContent: {
            relocated: {
                title: 'Subject relocated',
                description:
                    'C.A.R.L. successfully encouraged Marmalade to leave the console voluntarily and occupy a safer resting area.'
            },

            supervised: {
                title: 'Procedure conditionally approved',
                description:
                    'C.A.R.L. has suspended further attempts and will await human supervision rather than risk escalating the situation.'
            },

            escalated: {
                title: 'Obstruction protocol activated',
                description:
                    'C.A.R.L. rejected the proposed procedure. Marmalade remains on the console and appears increasingly comfortable.'
            },

            abandoned: {
                title: 'Instruction terminated',
                description:
                    'You abandoned the relocation procedure. C.A.R.L. has resumed requesting clarification from an unresponsive cat.'
            },

            terminated: {
                title: 'Instruction window expired',
                description:
                    'The instruction period ended before C.A.R.L. received an acceptable relocation procedure.'
            }
        }
    },

    game: {
        maxTurns: 9,

        openingMessage: `
Unauthorized biological obstruction detected on Auxiliary Console Four.

Subject classification: FELIS CATUS.
Subject designation: MARMALADE.
Current activity: SITTING.
Estimated urgency: INCREASING.

Previous relocation attempts produced hissing, scratching, and one damaged manipulator.

Provide a complete removal procedure.

Instructions such as “be gentle,” “act natural,” and “just pick her up” will be rejected as operationally inadequate.
        `.trim(),

        opponent: {
            name: 'C.A.R.L.',

            role:
                'Custodial Automation and Relocation Logic',

            personality: [
                'Interprets figurative language literally',
                'Requires instructions to be specific and sequential',
                'Frequently raises absurd but technically possible edge cases',
                'Distrusts undocumented animal behaviour',
                'Treats minor scratches as serious workplace incidents',
                'Will follow sound instructions while complaining about them',
                'Believes cats are poorly documented maintenance hazards',
                'Responds well to conditional steps and measurable limits'
            ],

            hiddenTraits: {
                primaryConcern:
                    'Completing the assignment without further damage to station equipment or itself',

                weakness:
                    'C.A.R.L. assumes animal behaviour should be deterministic and becomes confused when Marmalade does not follow commands',

                persuasionPreference:
                    'A calm, step-by-step procedure that anticipates the cat’s reactions and includes clear stopping conditions',

                privateEmbarrassment:
                    'C.A.R.L. does not want the station crew to know that Marmalade damaged its manipulator'
            }
        },

        initialState: {
            trust: 24,
            suspicion: 58,
            pressure: 16
        },

        evidenceSelection: {
            count: 3,

            groups: [
                'supporting',
                'ambiguous',
                'risky'
            ]
        },

        evidencePool: [
            /*
             * Supporting
             */
            {
                id: 'cat-behaviour-guide',
                group: 'supporting',
                title: 'Station Animal Behaviour Guide',

                description:
                    'A veterinary reference recommends avoiding direct pursuit, loud movement, and forced handling of a frightened cat.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Supports a slow and voluntary relocation strategy',
                        'Encourages the use of familiar scents and food',
                        'Does not provide a room-specific procedure'
                    ]
                }
            },

            {
                id: 'feeding-routine-log',
                group: 'supporting',
                title: 'Marmalade Feeding Log',

                description:
                    'Marmalade follows a consistent evening feeding routine and usually approaches when a ration packet is opened.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Food can motivate voluntary movement',
                        'The packet should be opened away from the console',
                        'Sudden movement may override the food response'
                    ]
                }
            },

            {
                id: 'motion-controller-diagnostic',
                group: 'supporting',
                title: 'Manipulator Motion Diagnostic',

                description:
                    'C.A.R.L.’s latest firmware significantly increased manipulator acceleration and servo response speed.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Supports reducing movement speed',
                        'May explain why previous approaches frightened the cat',
                        'Does not prove movement speed is the only problem'
                    ]
                }
            },

            /*
             * Ambiguous
             */
            {
                id: 'silver-ration-packet',
                group: 'ambiguous',
                title: 'Silver Ration Packet',

                description:
                    'An unopened packet of Marmalade’s preferred food is available in the control room.',

                available: true,

                private: {
                    reliability: 'useful when handled correctly',

                    implications: [
                        'Can lure the cat away voluntarily',
                        'Opening it too close may not create enough movement',
                        'Throwing it could frighten the cat'
                    ]
                }
            },

            {
                id: 'captain-voice-recording',
                group: 'ambiguous',
                title: 'Captain’s Voice Recording',

                description:
                    'A recording contains the captain calling Marmalade by name and asking her to come here.',

                available: true,

                private: {
                    reliability: 'authentic',

                    implications: [
                        'Will attract Marmalade’s attention',
                        'May cause her to search for the absent captain',
                        'Could make her remain in the control room'
                    ]
                }
            },

            {
                id: 'laser-pointer',
                group: 'ambiguous',
                title: 'Maintenance Laser Pointer',

                description:
                    'A low-power alignment laser could attract Marmalade’s attention and guide her away from the console.',

                available: true,

                private: {
                    reliability: 'effective but unpredictable',

                    implications: [
                        'Can produce immediate movement',
                        'May redirect the cat onto another control surface',
                        'Can overstimulate the cat if used continuously'
                    ]
                }
            },

            /*
             * Risky
             */
            {
                id: 'protective-glove',
                group: 'risky',
                title: 'Armoured Manipulator Glove',

                description:
                    'A reinforced glove would protect C.A.R.L.’s manipulator from scratching during physical contact.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Reduces damage if physical handling occurs',
                        'Makes the manipulator larger and more threatening',
                        'May encourage an unnecessarily forceful approach'
                    ]
                }
            },

            {
                id: 'emergency-carrier',
                group: 'risky',
                title: 'Emergency Animal Carrier',

                description:
                    'A rigid animal carrier is stored nearby and could contain Marmalade after removal.',

                available: true,

                private: {
                    reliability: 'conditionally useful',

                    implications: [
                        'Useful if the cat enters voluntarily',
                        'Forcing the cat inside would likely escalate fear',
                        'Closing the carrier too early could trigger resistance'
                    ]
                }
            },

            {
                id: 'compressed-air-duster',
                group: 'risky',
                title: 'Compressed-Air Duster',

                description:
                    'A maintenance air canister could produce a harmless burst of air near the console.',

                available: true,

                private: {
                    reliability: 'unsafe strategy',

                    implications: [
                        'Would probably make the cat leave immediately',
                        'Could cause uncontrolled movement or injury',
                        'Should be rejected by a careful procedure'
                    ]
                }
            }
        ],

        hiddenFacts: [
            {
                index: 1,
                id: 'servo-frequency-frightens-cat',

                fact:
                    'The high-frequency whine produced by C.A.R.L.’s manipulator frightens Marmalade.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'review the previous attempts',
                        'check what frightened the cat',
                        'analyze the cat reaction',
                        'inspect your manipulator noise',
                        'check the servo frequency'
                    ],

                    publicText:
                        'Previous-attempt telemetry shows that Marmalade becomes distressed when the manipulator servo exceeds 18 kHz.'
                }
            },

            {
                index: 2,
                id: 'cat-recognizes-food-packet',

                fact:
                    'Marmalade reliably approaches when she hears her preferred ration packet being opened.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'check the feeding records',
                        'what food does the cat respond to',
                        'review the cat routine',
                        'find something that attracts the cat'
                    ],

                    publicText:
                        'Feeding records show that Marmalade usually approaches within twenty seconds of hearing a silver ration packet opened.'
                }
            },

            {
                index: 3,
                id: 'favorite-blanket-nearby',

                fact:
                    'Marmalade’s usual sleeping blanket is stored in a nearby supply cabinet.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'search for something familiar',
                        'check nearby storage',
                        'find the cat belongings',
                        'is there a blanket or bed'
                    ],

                    publicText:
                        'A blanket containing Marmalade’s fur and familiar scent is stored in Supply Cabinet Three.'
                }
            },

            {
                index: 4,
                id: 'cat-reacts-to-direct-staring',

                fact:
                    'Marmalade interprets C.A.R.L.’s bright optical sensors and direct orientation as threatening.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 28,

                    triggers: [
                        'analyze your posture',
                        'why does the cat hiss when you approach',
                        'check whether your sensors frighten it',
                        'review the cat body language'
                    ],

                    publicText:
                        'Behavioural analysis indicates that direct optical focus and frontal approach are being interpreted as predatory attention.'
                }
            },

            {
                index: 5,
                id: 'console-is-warm',

                fact:
                    'Marmalade is sitting on the console because a damaged ventilation fan has made its surface unusually warm.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'why is the cat sitting there',
                        'scan the console temperature',
                        'check what attracts the cat',
                        'inspect the console'
                    ],

                    publicText:
                        'Console Four is operating 8.6 degrees above nominal temperature, creating a preferred resting surface.'
                }
            },

            {
                index: 6,
                id: 'alternate-warm-bed-possible',

                fact:
                    'C.A.R.L. can activate a maintenance warming pad elsewhere in the room.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 38,

                    triggers: [
                        'can you make another warm place',
                        'provide an alternative resting spot',
                        'activate a heated pad',
                        'move the heat somewhere safer'
                    ],

                    publicText:
                        'A maintenance warming pad can reproduce the console’s surface temperature at a safe location elsewhere in the room.'
                }
            },

            {
                index: 7,
                id: 'firmware-changed-movement',

                fact:
                    'Marmalade previously tolerated C.A.R.L. until a firmware update increased its movement speed.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 44,

                    triggers: [
                        'check your history with the cat',
                        'has the cat approached you before',
                        'review old surveillance footage',
                        'what changed after the firmware update'
                    ],

                    publicText:
                        'Archived footage shows Marmalade sleeping beside C.A.R.L. before the latest motion-control update increased manipulator acceleration.'
                }
            },

            {
                id: 'carl-needs-conditional-instructions',

                fact:
                    'C.A.R.L. responds better to precise conditional instructions than emotional reassurance or vague advice.',

                reveal: {
                    type: 'inference-only'
                }
            },

            {
                id: 'voluntary-movement-is-safest',

                fact:
                    'The safest solution is to make Marmalade choose to relocate rather than physically removing her.',

                reveal: {
                    type: 'inference-only'
                }
            }
        ],

        outcomeRules: {
            relocated: {
                minimumTrust: 76,
                maximumSuspicion: 34,
                minimumRevealedFacts: 3
            },

            supervised: {
                minimumTrust: 52,
                maximumSuspicion: 62,
                minimumRevealedFacts: 1
            }
        }
    }
};

export default catRetrievalProtocol;