import "@testing-library/jest-dom";

/*
 * react-scripts 5 ships a Jest setup that predates React 18, so it never sets
 * the act() environment flag. Without it every state update triggered from a
 * test logs an "not wrapped in act(...)" warning.
 */
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
