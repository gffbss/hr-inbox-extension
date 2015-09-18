var sidebarForThread = new WeakMap();
var sidebarTemplatePromise = null;

InboxSDK.load('1', 'sdk_hr-hiring-link_6e178ad679').then(function(sdk){	
	// the SDK has been loaded			
	sdk.Conversations.registerMessageViewHandlerAll(function(messageView){		
		var threadView = messageView.getThreadView();		
		var content = messageView.getBodyElement();
		var cleanContent = content.getElementsByTagName('div');
		var rawWords = jQuery(cleanContent).text();						
		
		var wordsFromEmail = rawWords.split(/\s+/g);	    
		var emailTmp = wordsFromEmail.join(',').toLowerCase();		
		var emailArray = emailTmp.split(',');		
		
		partners = get(chrome.runtime.getURL('new_hiring_partners.csv'), null, null);		
		
		Promise.all([			  		    
	    	partners	    
		])
		.then(function(results) {  		  													
			var partnerArray = cleanUpList(results[0]);			
			var confirmedPartners = _.intersection(partnerArray, emailArray)
			console.log(confirmedPartners);
			var partnerObject = toObject(confirmedPartners);	
			console.log(partnerObject);			
			createSideBar(threadView, partnerObject); // NEED TO CHECK FOR EMPTY OBJECT	
		});							
	});
});

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

function cleanUpList(partners){
	var partnerList = partners.split(/\s*,\s*/);
	var partnerTmp = partnerList.join(',').toLowerCase();
	var partnerArray = partnerTmp.split(',');
	return partnerArray;
}

function createSideBar(threadView, partnersList){
	if (partnersList.length < 2) {				
		noPartnerFound(threadView, partnersList)
	} else {
		addHiringPartnerSidebar(threadView, partnersList)
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

function addHiringPartnerSidebar(threadView, partners, emailContents) {
	if (!sidebarForThread.has(threadView)) {
		sidebarForThread.set(threadView, document.createElement('div'));
		
		threadView.addSidebarContentPanel({
			el: sidebarForThread.get(threadView),
			title: "HR Hiring Partners",
			iconUrl: chrome.runtime.getURL('images/hr-infinity-logo.png')
		});
	}

	if (!sidebarTemplatePromise) {		
	    sidebarTemplatePromise = get(chrome.runtime.getURL('sidebarTemplate.html'), null, null);	        			    
	}

	Promise.all([		
	  	emailContents,    		    
	    sidebarTemplatePromise,	 
	    partners	    
	])
	.then(function(results) {  		  	
		var emailContents = results[0]; 
		var partner = results[2];				
		
		var html = results[1];        
	    var template = _.template(html);		    
	    
	    sidebarForThread.get(threadView).innerHTML = sidebarForThread.get(threadView).innerHTML + template({
	    	partner: partner      		      
	    });
	});
}

