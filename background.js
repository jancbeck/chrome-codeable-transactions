// Regex-pattern to check URLs against. 
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https:\/\/app\.codeable\.io\/users\/transactions/;

// A function to use as callback
function getTransactionItems( items ) {

	// Save as file
	var url = 'data:text/csv,' + encodeURIComponent(CSV(items));
	var today = new Date();

	chrome.downloads.download({
		url: url,
		filename: 'Codeable transactions - ' + today.toDateString() + '.csv'
	});
	
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {

	// ...check the URL of the active tab against our pattern and...
    if (urlRegex.test(tab.url)) {
        // ...if it matches, send a message specifying a callback too
        chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, getTransactionItems);
    }

});

// Returns a csv from an array of objects with
// values separated by tabs and rows separated by newlines
// http://stackoverflow.com/a/22792982
function CSV(array) {

    // Use first element to choose the keys and the order
    var keys = Object.keys(array[0]);

    // Build header
    var result = keys.join(",") + "\n";

    // Add the rows
    array.forEach(function(obj){
        keys.forEach(function(k, ix){
            if (ix) result += ",";
            result += '"' + obj[k] + '"';
        });
        result += "\n";
    });

    return result;
}