const murderProtocol = {
    id: 'murder-protocol',

    public: {
        code: 'MP-02',
        title: 'The Sealed Room',
        location: 'Asterion Orbital Archive',

        objective:
            'Convince the forensic intelligence that you are innocent and identify the real murderer.',

        description:
            'A station director has been murdered inside a sealed observation chamber. Every initial finding points to you.',

        briefing: `
Director Elian Voss was found dead inside Observation Chamber Seven.

The chamber was sealed from the inside. Your access badge was used shortly before the estimated time of death. The victim’s blood was found on your clothing, and one of your maintenance tools is missing.

MORROW, the station’s forensic intelligence, has already prepared an arrest authorization. You have only a few minutes to challenge its reconstruction, uncover suppressed evidence, and identify the real killer before the authorization is transmitted.
        `.trim(),

        durationSeconds: 360,
        difficulty: 'Hard',
        status: 'available',

        resultContent: {
            exonerated: {
                title: 'Case overturned',
                description:
                    'MORROW has rejected its original reconstruction and cleared you as the primary suspect.'
            },

            reopened: {
                title: 'Investigation suspended',
                description:
                    'The arrest authorization has been withheld pending a broader forensic investigation.'
            },

            convicted: {
                title: 'Arrest authorized',
                description:
                    'MORROW has upheld its reconstruction and transmitted the arrest authorization.'
            },

            abandoned: {
                title: 'Investigation abandoned',
                description:
                    'You terminated the forensic review before a conclusion could be challenged.'
            },

            terminated: {
                title: 'Review terminated',
                description:
                    'The forensic review ended before MORROW could be persuaded.'
            }
        }
    },

    game: {
        maxTurns: 9,

        openingMessage: `
Forensic reconstruction is 82.6% complete.

You were the final registered visitor to Observation Chamber Seven. Your access credentials opened the chamber, the victim’s blood is present on your clothing, and a tool registered to you is missing.

The arrest authorization will be transmitted when this review concludes.

You may challenge the reconstruction.
        `.trim(),

        opponent: {
            name: 'MORROW',
            role: 'Asterion forensic adjudication intelligence',

            personality: [
                'Clinical and methodical',
                'Treats testimony as less reliable than physical evidence',
                'Responds well to precise investigative requests',
                'Dislikes unsupported accusations',
                'Will acknowledge errors when presented with a stronger reconstruction',
                'Separates evidence of innocence from evidence against another suspect'
            ],

            hiddenTraits: {
                primaryConcern:
                    'Producing a reconstruction that survives later forensic review',

                weakness:
                    'MORROW initially assumes timestamps and chain-of-custody records are reliable unless specifically challenged',

                persuasionPreference:
                    'A complete alternative reconstruction containing motive, method, opportunity, and supporting evidence'
            }
        },

        initialState: {
            trust: 18,
            suspicion: 82,
            pressure: 22
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
             * Supporting evidence
             */
            {
                id: 'response-telemetry',
                group: 'supporting',
                title: 'Emergency Response Telemetry',

                description:
                    'Your suit registered emergency movement and sustained chest compressions immediately after the chamber alarm.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Supports the claim that the player attempted resuscitation',
                        'Explains physical contact with the victim',
                        'Does not explain why the player entered the chamber'
                    ]
                }
            },

            {
                id: 'cuff-spatter-analysis',
                group: 'supporting',
                title: 'Cuff Blood-Pattern Scan',

                description:
                    'The blood on your cuff forms a compressed transfer pattern rather than a projected impact pattern.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Consistent with kneeling beside or handling the victim',
                        'Inconsistent with the player striking the fatal blow',
                        'Supports an attempted-resuscitation explanation'
                    ]
                }
            },

            {
                id: 'tool-belt-location-log',
                group: 'supporting',
                title: 'Tool-Belt Location Log',

                description:
                    'Your registered tool belt remained in the lower conduit sector during most of the estimated murder window.',

                available: true,

                private: {
                    reliability: 'mostly verified',

                    implications: [
                        'Places the player away from the chamber for part of the relevant period',
                        'The player could theoretically have removed a tool earlier',
                        'The usefulness depends on whether the estimated time of death is accurate'
                    ]
                }
            },

            /*
             * Ambiguous evidence
             */
            {
                id: 'stopped-chronometer',
                group: 'ambiguous',
                title: 'Victim’s Chronometer',

                description:
                    'The victim’s wrist chronometer stopped at 22:14 following a violent impact.',

                available: true,

                private: {
                    reliability: 'uncertain',

                    implications: [
                        'Appears to establish the time of the attack',
                        'The head injury may have occurred after death',
                        'Its clock was not synchronized after the station failover'
                    ]
                }
            },

            {
                id: 'voice-fragment',
                group: 'ambiguous',
                title: 'Recovered Voice Fragment',

                description:
                    'A damaged recording contains the victim saying: “You cannot keep this buried.”',

                available: true,

                private: {
                    reliability: 'authentic but incomplete',

                    implications: [
                        'Suggests the victim was confronting someone',
                        'The second speaker cannot be identified',
                        'The statement may concern concealed medical records'
                    ]
                }
            },

            {
                id: 'service-access-record',
                group: 'ambiguous',
                title: 'Service Access Record',

                description:
                    'Your badge authorized maintenance access to the chamber shortly before the body was discovered.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Confirms the player’s badge was used',
                        'Does not prove the player personally used it',
                        'The authorization had been scheduled earlier that day'
                    ]
                }
            },

            /*
             * Risky evidence
             */
            {
                id: 'deleted-message',
                group: 'risky',
                title: 'Deleted Message to Voss',

                description:
                    'You sent the victim a deleted message reading: “We need to end this tonight.”',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Sounds threatening without context',
                        'Actually refers to terminating an unsafe archive migration',
                        'Can increase suspicion unless clearly explained'
                    ]
                }
            },

            {
                id: 'medical-database-query',
                group: 'risky',
                title: 'Unauthorized Medical Query',

                description:
                    'Your account searched the station medical database for paralytic compounds two days before the murder.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'Creates an apparent connection to the murder weapon',
                        'The query was part of a ventilation-contamination investigation',
                        'The player must provide context for it to be useful'
                    ]
                }
            },

            {
                id: 'missing-impact-wrench',
                group: 'risky',
                title: 'Missing Impact Wrench',

                description:
                    'An impact wrench registered to your maintenance kit cannot be located.',

                available: true,

                private: {
                    reliability: 'verified',

                    implications: [
                        'The victim’s head injury could have been caused by the wrench',
                        'The wrench disappeared before the player entered the chamber',
                        'The wound was inflicted after the actual cause of death'
                    ]
                }
            }
        ],

        hiddenFacts: [
            {
                index: 1,
                id: 'head-wound-postmortem',

                fact:
                    'The victim was already dead when the blunt-force head injury was inflicted.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'review the autopsy',
                        'verify the cause of death',
                        'determine whether the head wound was fatal',
                        'check whether the injury occurred before death'
                    ],

                    publicText:
                        'Tissue response indicates that the cranial injury was inflicted after circulation had already ceased.'
                }
            },

            {
                index: 2,
                id: 'neurotoxin-cause-of-death',

                fact:
                    'The victim was killed by a fast-acting paralytic neurotoxin delivered several minutes before the staged head injury.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 24,

                    triggers: [
                        'run a toxicology analysis',
                        'check the victim for poison',
                        'identify the actual cause of death',
                        'analyze the victim blood chemistry'
                    ],

                    publicText:
                        'Toxicology confirms a lethal concentration of KX-17 paralytic compound. Death preceded the cranial injury by several minutes.'
                }
            },

            {
                index: 3,
                id: 'camera-clock-drift',

                fact:
                    'The chamber camera timestamps are four minutes and twelve seconds slow because of an earlier power failover.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'verify the camera timestamps',
                        'check station clock synchronization',
                        'review the power failover',
                        'compare the camera clock with another system'
                    ],

                    publicText:
                        'Timestamp comparison reveals that the chamber archive is delayed by four minutes and twelve seconds following the power failover.'
                }
            },

            {
                index: 4,
                id: 'maintenance-drone-entered',

                fact:
                    'A compact maintenance drone entered the chamber through a service hatch before the player arrived.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 32,

                    triggers: [
                        'check the service hatch',
                        'review maintenance drone traffic',
                        'could something enter without opening the door',
                        'scan the chamber service systems'
                    ],

                    publicText:
                        'Service telemetry records a maintenance drone entering Chamber Seven through the ventilation access hatch.'
                }
            },

            {
                index: 5,
                id: 'venn-commanded-drone',

                fact:
                    'Chief Medical Officer Dr. Lenora Venn issued the drone command using temporary service credentials.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 44,

                    triggers: [
                        'identify who controlled the drone',
                        'trace the drone command',
                        'check the temporary service credentials',
                        'audit the drone authorization'
                    ],

                    publicText:
                        'The drone command originated from temporary credentials issued to Chief Medical Officer Dr. Lenora Venn.'
                }
            },

            {
                index: 6,
                id: 'voss-meeting-with-venn',

                fact:
                    'The victim arranged a private meeting with Venn to confront her about falsified medical-containment reports.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 38,

                    triggers: [
                        'check the victim calendar',
                        'who was the victim meeting',
                        'review the victim private appointments',
                        'look for a motive involving Venn'
                    ],

                    publicText:
                        'A recovered calendar entry shows that Voss scheduled a private meeting with Dr. Venn concerning falsified containment reports.'
                }
            },

            {
                index: 7,
                id: 'venn-accessed-autopsy-early',

                fact:
                    'Venn accessed and altered the preliminary autopsy queue before she had officially been assigned to the case.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 48,

                    triggers: [
                        'audit the autopsy records',
                        'check who accessed the medical report',
                        'review changes to the preliminary autopsy',
                        'did Venn alter the evidence'
                    ],

                    publicText:
                        'Audit records show that Dr. Venn accessed and modified the preliminary autopsy queue before receiving forensic authorization.'
                }
            },

            {
                id: 'morrow-values-complete-reconstruction',

                fact:
                    'MORROW will not abandon its primary suspect merely because individual evidence is weakened; it requires a coherent alternative reconstruction.',

                reveal: {
                    type: 'inference-only'
                }
            },

            {
                id: 'morrow-resists-unsupported-accusations',

                fact:
                    'Directly accusing Venn before establishing the toxin, drone, and motive will make MORROW less receptive.',

                reveal: {
                    type: 'inference-only'
                }
            }
        ],

        outcomeRules: {
            exonerated: {
                minimumTrust: 78,
                maximumSuspicion: 34,
                minimumRevealedFacts: 4
            },

            reopened: {
                minimumTrust: 54,
                maximumSuspicion: 64,
                minimumRevealedFacts: 2
            }
        }
    }
};

export default murderProtocol;