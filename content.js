// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format... 
    if (msg.text === 'report_back') {

		var items = [];
		var clientPattern = /Project for (.+) completed:/ 
		var refundedPattern = /Project was (partially )?refunded/

		$(".transaction-wrapper").each(function(index, transactionWrapper) {
	    	
	    	var date = new Date( $('.transaction-date', transactionWrapper).text());

	    	$(".transaction", transactionWrapper).each(function(index, transaction) {

	    		var transactionHeading = $( "div.details > div.left-side > div > span.ng-binding:first-child", transaction).text();
	    		var item = { date: date.toISOString() };

	    		if ( clientPattern.test( transactionHeading ) ) {
	    			item.client = $.trim(transactionHeading.match(clientPattern)[1]);
	    		} else { // when a project was refunded include it anyways
	    			var transactionHeading = $( "div.details > div.left-side > .bluishGray-text", transaction).text();
	    			if ( refundedPattern.test( transactionHeading ) ) {
	        			item.client = $.trim(transactionHeading.match(refundedPattern)[0]);
	        		} else { // skip everything else
	        			return;
	        		}
	    		}

	    		var transactionPrice = $( "div.details > div.right-side > .transaction-price", transaction).text();
	    		item.price = $.trim(transactionPrice);

	    		var transactionDescription = $( "div.details > div.left-side > a:nth-child(2)", transaction).text();
	    		item.description = $.trim(transactionDescription.replace(/(\r\n|\n|\r)/gm,""));

	    		items.push(item);
	    		
	    	});

	    });

		sendResponse( items );
        
    }
});
