import { initializeOrbitEngine } from './dynamicHub.js';
import { initializeTestExecutionEngine } from './cockpitEngine.js';
import { enforceAntiCheatingProtocols } from './antiCheating.js';

document.addEventListener('DOMContentLoaded', () => {
    enforceAntiCheatingProtocols();
    initializeTestExecutionEngine();
    initializeOrbitEngine();
});
