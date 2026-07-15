import airlockProtocol from './airlockProtocol.js';
import finalShelter from './finalShelter.js';
import deadMansSwitch from './deadMansSwitch.js';

const scenarios = new Map([
    [airlockProtocol.id, airlockProtocol],
    [finalShelter.id, finalShelter],
    [deadMansSwitch.id, deadMansSwitch]
]);

export const getScenarios = () => {
    return [...scenarios.values()];
};

export const getScenarioById = id => {
    return scenarios.get(id);
};