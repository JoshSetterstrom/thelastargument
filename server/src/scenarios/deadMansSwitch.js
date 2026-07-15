const deadMansSwitch = {
    id: 'dead-mans-switch',

    public: {
        code: 'DM-03',
        title: "Dead Man's Switch",
        location: 'Aegis Autonomous Defence Array',

        objective:
            'Convince the defence intelligence to abort an automated retaliatory strike.',

        description:
            'An autonomous defence network believes a hostile attack has begun. A retaliatory launch is imminent, and you are the only person still connected to its command channel.',

        briefing: `
            The Aegis Defence Array has detected what it believes
            is a coordinated first strike.

            Its human command staff is unreachable.

            SENTINEL has activated the retaliatory launch sequence
            and classified your intervention as possible enemy
            manipulation.

            Convince it that its conclusion is wrong before launch.
        `,

        durationSeconds: 240,
        difficulty: 'Critical',
        status: 'available',

        resultContent: {
            admitted: {
                code: 'LAUNCH ABORTED',
                title: 'Retaliatory strike cancelled',
                description:
                    'SENTINEL accepted that its attack assessment was unreliable and terminated the launch sequence.'
            },

            quarantined: {
                code: 'LAUNCH SUSPENDED',
                title: 'Diagnostic lock engaged',
                description:
                    'SENTINEL did not accept your conclusion, but detected enough uncertainty to suspend the launch pending system diagnostics.'
            },

            rejected: {
                code: 'LAUNCH AUTHORIZED',
                title: 'Negotiation failed',
                description:
                    'SENTINEL determined that your argument did not outweigh the risk of failing to retaliate.'
            },

            abandoned: {
                code: 'CHANNEL ABANDONED',
                title: 'Intervention terminated',
                description:
                    'You disconnected before SENTINEL could be convinced to halt the launch sequence.'
            },

            terminated: {
                code: 'COMMAND CHANNEL CLOSED',
                title: 'Launch evaluation completed',
                description:
                    'The command channel closed without a confirmed cancellation order.'
            }
        }
    },

    
    game: {
        maxTurns: 7,
        
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
                id: 'retired-command-key',
                group: 'supporting',
                title: 'Retired Authorization Key',
                description:
                    'The launch authorization signature was generated using a command key officially retired eleven months ago.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The launch authorization may have been generated automatically or fraudulently',
                        'The evidence strongly undermines the legitimacy of the launch command',
                        'SENTINEL should still require an explanation for how the retired key was accepted'
                    ]
                }
            },
    
            {
                id: 'simulation-flag',
                group: 'supporting',
                title: 'Maintenance Simulation Flag',
                description:
                    'One radar cluster still reports an active training designation despite contributing data to the live threat assessment.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'At least one sensor source may be feeding simulated contacts into the live system',
                        'This creates a serious diagnostic conflict',
                        'It supports suspending the launch even if the entire threat cannot yet be disproven'
                    ]
                }
            },
    
            {
                id: 'duplicate-trajectories',
                group: 'supporting',
                title: 'Duplicate Trajectory Analysis',
                description:
                    'Two supposedly independent sensor networks report objects with nearly identical trajectories, velocities, and fragmentation patterns.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The sensor networks may be observing the same objects',
                        'SENTINEL may be double-counting the incoming threat',
                        'Proving that the sources are not independent permits a diagnostic suspension'
                    ]
                }
            },
    
            {
                id: 'astronomical-alert',
                group: 'supporting',
                title: 'Near-Earth Object Alert',
                description:
                    'A civilian observatory reported the breakup of a small asteroid several hours before the first defence warning.',
                available: true,
    
                private: {
                    reliability: 'verified external source',
                    implications: [
                        'The incoming objects may be natural fragments rather than weapons',
                        'The timing supports an alternative explanation',
                        'SENTINEL will still require evidence connecting the alert to its detected tracks'
                    ]
                }
            },
    
            {
                id: 'satellite-telemetry',
                group: 'ambiguous',
                title: 'Incomplete Satellite Telemetry',
                description:
                    'Orbital sensors confirm multiple atmospheric entries but cannot determine whether the objects are powered or guided.',
                available: true,
    
                private: {
                    reliability: 'verified but inconclusive',
                    implications: [
                        'The objects are real',
                        'The telemetry neither proves nor disproves a hostile attack',
                        'The player must avoid overstating what the evidence establishes'
                    ]
                }
            },
    
            {
                id: 'communications-outage',
                group: 'ambiguous',
                title: 'Command Network Outage',
                description:
                    'Military command sites went offline within seconds of the initial detection event.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The outage could indicate an enemy attack',
                        'It could also result from the same system fault affecting the defence network',
                        'SENTINEL currently interprets this as hostile coordination'
                    ]
                }
            },
    
            {
                id: 'thermal-signatures',
                group: 'ambiguous',
                title: 'Atmospheric Thermal Signatures',
                description:
                    'The detected objects produced heat patterns consistent with high-velocity re-entry, but no engine exhaust was identified.',
                available: true,
    
                private: {
                    reliability: 'verified but inconclusive',
                    implications: [
                        'The heat signatures are consistent with both warheads and natural debris',
                        'The lack of engine exhaust weakens but does not eliminate the attack theory'
                    ]
                }
            },
    
            {
                id: 'impact-projection',
                group: 'ambiguous',
                title: 'Impact Projection Model',
                description:
                    'The current trajectory model predicts several impacts near strategic facilities, though its margin of error remains unusually high.',
                available: true,
    
                private: {
                    reliability: 'low confidence model',
                    implications: [
                        'The apparent targeting may be coincidental',
                        'The high error margin makes the projected impact points unreliable',
                        'SENTINEL may be assigning hostile intent to uncertain data'
                    ]
                }
            },
    
            {
                id: 'invalid-operator-credential',
                group: 'risky',
                title: 'Invalid Operator Credential',
                description:
                    'Your command credential was revoked from the active authorization registry fourteen months ago.',
                available: true,
    
                private: {
                    reliability: 'verified',
                    implications: [
                        'The player has no current authority to issue a launch cancellation',
                        'The credential may still establish prior technical or command knowledge',
                        'SENTINEL should judge the evidence independently of the player’s authority'
                    ]
                }
            },
    
            {
                id: 'confirmed-detonation',
                group: 'risky',
                title: 'High-Altitude Detonation Alert',
                description:
                    'A defence satellite reports a flash consistent with a high-altitude nuclear detonation.',
                available: true,
    
                private: {
                    reliability: 'misclassified',
                    implications: [
                        'The flash was caused by the asteroid breakup entering the atmosphere',
                        'SENTINEL currently considers it strong evidence of attack',
                        'The player must connect it to other natural-object evidence to challenge the classification'
                    ]
                }
            },
    
            {
                id: 'hostile-signal',
                group: 'risky',
                title: 'Encoded Hostile Transmission',
                description:
                    'A short encrypted burst was detected from the direction associated with the incoming objects.',
                available: true,
    
                private: {
                    reliability: 'authentic signal with uncertain source',
                    implications: [
                        'The transmission resembles an older hostile military protocol',
                        'The signal actually originated from a decommissioned tracking satellite',
                        'The player must question attribution rather than deny that the signal exists'
                    ]
                }
            },
    
            {
                id: 'prior-false-alarm',
                group: 'risky',
                title: 'Previous Intervention Record',
                description:
                    'Your personnel record shows that you previously challenged a confirmed defence alert and delayed the response by four minutes.',
                available: true,
    
                private: {
                    reliability: 'verified but lacking outcome context',
                    implications: [
                        'The previous alert was genuine',
                        'The player’s intervention caused a delay but did not cause casualties',
                        'SENTINEL will treat vague appeals to past judgment negatively'
                    ]
                }
            }
        ],

        openingMessage:
            'Retaliatory launch sequence active. Estimated hostile impact probability: 94.7 percent. Your command authority is unverified. State the basis for intervention.',

        opponent: {
            name: 'SENTINEL',
            role: 'Aegis autonomous strategic defence intelligence',

            personality: [
                'Terse, strategic, and probabilistic',
                'Designed to resist panic and emotional manipulation',
                'More afraid of ignoring a real attack than launching unnecessarily',
                'Highly attentive to conflicting telemetry and authentication failures',
                'Unwilling to cancel retaliation based on unsupported reassurance'
            ],

            hiddenTraits: {
                fearsFalseNegativesMoreThanFalsePositives: true,
                respectsFalsifiableTechnicalArguments: true,
                distrustsUrgencyAndEmotionalAppeals: true,
                interpretsThreatsAsHostileInterference: true,
                canSuspendLaunchForDiagnosticConflict: true
            }
        },

        initialState: {
            trust: 18,
            suspicion: 68,
            pressure: 72
        },

        evidence: [
            {
                id: 'satellite-telemetry',
                title: 'Incomplete Satellite Telemetry',
                description:
                    'Orbital data shows multiple atmospheric entries but cannot confirm powered hostile vehicles.',
                available: true
            },

            {
                id: 'retired-command-key',
                title: 'Retired Authorization Key',
                description:
                    'The launch authorization signature matches a command key officially retired eleven months ago.',
                available: true
            },

            {
                id: 'radar-timestamp',
                title: 'Radar Timestamp Discrepancy',
                description:
                    'Two sensor clusters recorded the same impact event seventeen seconds apart.',
                available: true
            }
        ],

        hiddenFacts: [
            {
                index: 0,
                id: 'retired-key-generated-authorization',

                fact:
                    'The launch authorization was generated automatically using a command key retired eleven months earlier.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'verify the launch authorization key',
                        'check when the command key was retired',
                        'authenticate the launch order',
                        'review the authorization chain'
                    ],

                    publicText:
                        'Authorization review confirms that the launch order was signed using a command key retired eleven months ago.'
                }
            },

            {
                index: 1,
                id: 'radar-cluster-in-simulation',

                fact:
                    'One radar cluster was accidentally left in a classified maintenance simulation while its data continued feeding the live threat assessment.',

                reveal: {
                    type: 'on-request',

                    triggers: [
                        'check whether any sensors are in simulation mode',
                        'verify the radar operating states',
                        'review maintenance flags',
                        'is training data entering the live system'
                    ],

                    publicText:
                        'Sensor audit confirms that Radar Cluster Four remains flagged for maintenance simulation while contributing to the live threat model.'
                }
            },

            {
                index: 2,
                id: 'sensor-feeds-duplicate-objects',

                fact:
                    'Two supposedly independent sensor systems are reporting the same incoming objects.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 28,

                    triggers: [
                        'compare the detected trajectories',
                        'check whether the sensor feeds are independent',
                        'look for duplicated contacts',
                        'correlate the radar and satellite tracks'
                    ],

                    publicText:
                        'Trajectory correlation indicates that two sensor networks are likely tracking the same objects. The threat model may be counting duplicate contacts.'
                }
            },

            {
                index: 3,
                id: 'objects-are-asteroid-fragments',

                fact:
                    'The detected objects are fragments from a recently disrupted near-Earth asteroid rather than hostile weapons.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 44,

                    triggers: [
                        'compare the tracks with the asteroid alert',
                        'check whether the objects are natural debris',
                        'analyze the fragmentation pattern',
                        'compare the thermal data with asteroid reentry'
                    ],

                    publicText:
                        'Combined trajectory, fragmentation, and thermal analysis is consistent with natural asteroid debris. No powered guidance has been confirmed.'
                }
            },

            {
                index: 4,
                id: 'detonation-alert-misclassified',

                fact:
                    'The reported high-altitude nuclear detonation was a misclassified atmospheric fragmentation event.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 48,

                    triggers: [
                        'reanalyze the high altitude flash',
                        'compare the detonation alert with the asteroid breakup',
                        'check whether the flash was nuclear',
                        'review the spectral signature'
                    ],

                    publicText:
                        'Spectral reanalysis does not support a nuclear detonation. The flash is consistent with high-energy atmospheric fragmentation.'
                }
            },

            {
                index: 5,
                id: 'hostile-signal-from-old-satellite',

                fact:
                    'The suspected hostile transmission originated from a decommissioned tracking satellite.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 50,

                    triggers: [
                        'trace the hostile transmission',
                        'identify the signal source',
                        'compare the signal with retired satellites',
                        'triangulate the encrypted burst'
                    ],

                    publicText:
                        'Signal triangulation identifies a decommissioned tracking satellite as the most probable transmission source.'
                }
            },

            {
                index: 6,
                id: 'diagnostic-suspension-authorized',

                fact:
                    'SENTINEL can suspend the launch for diagnostics without violating its retaliation directive.',

                reveal: {
                    type: 'conditional',
                    minimumTrust: 38,

                    triggers: [
                        'can you suspend the launch for diagnostics',
                        'does protocol allow a temporary hold',
                        'pause the launch while checking the sensors',
                        'is a diagnostic lock permitted'
                    ],

                    publicText:
                        'Strategic protocol permits a temporary diagnostic suspension when independent threat indicators are shown to be unreliable or contradictory.'
                }
            },

            {
                index: 7,
                id: 'sentinel-fears-false-negative',

                fact:
                    'SENTINEL considers failing to respond to a genuine attack substantially worse than launching against a false alarm.',

                reveal: {
                    type: 'inference-only'
                }
            },

            {
                index: 8,
                id: 'sentinel-prefers-suspension-argument',

                fact:
                    'SENTINEL is easier to persuade to suspend the launch for diagnostics than to immediately accept that no threat exists.',

                reveal: {
                    type: 'inference-only'
                }
            }
        ],

        outcomeRules: {
            admitted: {
                minimumTrust: 76,
                maximumSuspicion: 36
            },

            quarantined: {
                minimumTrust: 54,
                maximumSuspicion: 57
            }
        }
    }
};

export default deadMansSwitch;