/** 
 * Process input from the year-guesser container and output results to the DOM
 * */

$(function onReady() {
    const container = $("#year-guesser");
    const results = $("#guesserResults");
    const resultsList = $("#guesserResultsList");

    results.hide();
    // container is hidden by default: here it is shown only once the page and script load
    container.removeClass("invisible");

    $("#guesserForm").on("submit", processForm); 

    function processForm() {
        const dow = $("#guesserDow").find(":selected").val();
        const month = $("#guesserMonth").val();
        const day = $("#guesserDay").val();
        const list = [dow, month, day, 'guess 2024', 'guess 2017', 'guess 2010'];

        populateList(list);
    }

    /**
     * Populate results list with the items given
     * @param {HTML[]} items 
     */
    function populateList(items) {
        resultsList.empty();
        for (let i = 0; i < items.length; i++) {
            addListItem(items[i]);
        }
        results.show();
    }

    /**
     * Add a new list item to the results list
     * @param {HTML} innerHtml html of the list item
     */
    function addListItem(innerHtml) {
        const newItem = $("<li>");

        newItem.html(innerHtml);
        resultsList.append(newItem);
    }
})