/** 
 * Process input from the year-guesser container and output results to the DOM
 */

const maxMonth = 12;
const maxDay = 31;
const maxYear = 9999;
const yearsToGuess = 50;

$(() => {
    const results = $("#guesserResults");
    const resultsList = $("#guesserResultsList");
    let iterations = 0;

    // Set up button event handlers
    $("#guesserForm").on("submit", processForm);
    $("#guesserClearButton").on("click", clearForm);

    function clearForm() {
        $("#guesserMonth").val('');
        $("#guesserDay").val('');
        iterations = 0;
        results.hide();
    }

    function processForm() {
        const searchFuture = document.getElementById("guesserFutureBool").checked;
        const dow = parseInt($("#guesserDow").find(":selected").val());
        const month = $("#guesserMonth").val();
        const day = $("#guesserDay").val();

        if (!isLegalDate(month, day)) {
            alert("Invalid month and day entered, please enter a calendar date.");
            return;
        }

        const yearOffset = (yearsToGuess * iterations);
        const years = searchYears(month, day, yearOffset, dow, searchFuture);

        populateList(years);
        iterations++;
    }

    /**
     * Populate results list with the items given
     * @param {HTML[]} items 
     */
    function populateList(items) {
        resultsList.empty();

        for (let i = 0; i < items.length; i++) {
            const newItem = $("<li>");

            newItem.html(items[i]);
            resultsList.append(newItem);
        }

        results.show();
    }
})

/**
 * Find a list of years where the given date falls on the given day of week
 * 
 * @param {number} month month of date
 * @param {number} day day of date
 * @param {number} yearOffset number of years in the past/future
 *  beyond the current year to start searching
 * @param {number} targetDow the day of week to search for, 0 being Sunday
 * @param {boolean} searchFuture true to search future years, false to search past years
 * 
 * @returns list of years where the given date has the desired targetDow
 */
function searchYears(month, day, yearOffset, targetDow, searchFuture) {
    const currentYear = new Date().getUTCFullYear()
    const years = [];

    let year = searchFuture? currentYear + yearOffset : currentYear - yearOffset;
    // Brute force check to find target years. Brute force is fine here
    // since loop has relatively small, fixed-size # of iterations
    for (let i = 0; i < yearsToGuess; i++) {
        if (year < 1 || maxYear < year) break;

        const date = new Date(year, month - 1, day);
        
        if (date.getDay() === targetDow) {
            years.push(year);
        }
        year = searchFuture? year + 1 : year - 1;
    }

    return years;
}

/**
 * Determines if the given month and day form a legal date. Feb 29 is always allowed
 * @param {number} month 
 * @param {number} day 
 * @returns true iff 1 <= month <= 12 and 1 <= day <= 31
 */
function isLegalDate (month, day) {
    return (
        1 <= month && month <= maxMonth &&
        1 <= day && day <= maxDay
    )
}