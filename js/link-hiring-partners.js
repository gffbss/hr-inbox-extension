var sidebarForThread = new WeakMap();
var sidebarTemplatePromise = null;

InboxSDK.load('1', 'sdk_hr-hiring-link_6e178ad679').then(function(sdk){	
	// the SDK has been loaded			
	sdk.Conversations.registerMessageViewHandlerAll(function(messageView){		
		var threadView = messageView.getThreadView();		
		var content = messageView.getBodyElement();
		var cleanContent = content.getElementsByTagName('div');
		var rawWords = jQuery(cleanContent).text();						
		var removeSpecialCharacters = rawWords.replace(/[^\w\s]/gi, '');
						
		partners = get(chrome.runtime.getURL('updated-hp-2-1-2016.csv'), null, null);				
		
		Promise.all([			  		    
	    	partners
		])
		.then(function(results) {  		  													
			var partnerArray = cleanUpList(results[0], removeSpecialCharacters);											
			var partnerObject = toObject(partnerArray);				
			
			createSideBar(threadView, partnerObject); 	
		});							
	});
});

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

function cleanUpList(partners, words){							
	var wordsLower = words.toLowerCase()
	partners = partners.split('\n');
	
	// Clean up partner array to remove end of line and strange eol characters
	partners = partners.map(function (partner) {
		return partner.toLowerCase().slice(0, partner.length - 2);
	})
		
	// Filter our array and string to find matches
	return _.filter(partners, function(partner){
		return wordsLower.includes(partner);
	});	
}

function createSideBar(threadView, partnersObject){	
	if (partnersObject[0] != null) {	
		addHiringPartnerSidebar(threadView, partnersObject)
	} else {			
		noPartnerFound(threadView, partnersObject)		
	}	
}

function get(url, params, headers) {
	return Promise.resolve(
		$.ajax({
			url: url,
			type: "GET",
			data: params,
			headers: headers,					
		})
	);
}

function noPartnerFound(threadView, partner) {	
	if (!sidebarForThread.has(threadView)) {
		sidebarForThread.set(threadView, document.createElement('div'));
		
		threadView.addSidebarContentPanel({
			el: sidebarForThread.get(threadView),
			title: "-- No Partners Found --",
			iconUrl: chrome.runtime.getURL('images/hr-infinity-logo.png')
		});
	}
}	

function addHiringPartnerSidebar(threadView, partners) {
	if (!sidebarForThread.has(threadView)) {
		sidebarForThread.set(threadView, document.createElement('div'));
		
		threadView.addSidebarContentPanel({
			el: sidebarForThread.get(threadView),
			title: "Hiring Partner Mentioned",
			iconUrl: chrome.runtime.getURL('images/hr-infinity-logo.png')
		});
	}

	if (!sidebarTemplatePromise) {		
	    sidebarTemplatePromise = get(chrome.runtime.getURL('sidebarTemplate.html'), null, null);	        			    
	}

	Promise.all([			  	    		    
	    sidebarTemplatePromise,	 
	    partners	    
	])
	.then(function(results) {  		  									
		var html = results[0];        
	    var template = _.template(html);		    
	    var partner = results[1];		
	    
	    sidebarForThread.get(threadView).innerHTML = sidebarForThread.get(threadView).innerHTML + template({
	    	partner: partner      		      
	    });
	});
}

