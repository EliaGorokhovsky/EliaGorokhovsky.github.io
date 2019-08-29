/**
 * Rounds a number to a certain number of decimal places
 * @param {number} number 
 * @param {integer} places 
 */
export function roundTo(number, places) {
    return Math.round(number * Math.pow(10, places)) / Math.pow(10, places);
}