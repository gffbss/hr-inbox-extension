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
		console.log(partners);		
		console.log('-------------g-g-g-g-g-------------');
		
		Promise.all([			  		    
	    	partners	    
		])
		.then(function(results) {  		  													
			var turd = mrClean(results[0]);			
			var testing = _.intersection(turd, emailArray)
			console.log(testing);
									
			cleanUpArray(threadView, testing) // NEED TO CHECK FOR EMPTY OBJECT	
		});							
	});
});

Array.prototype.diff = function(getPartnerMatches) {
    var ret = [];
    this.sort();
    getPartnerMatches.sort();
    for(var i = 0; i < this.length; i += 1) {
        if(getPartnerMatches.indexOf( this[i] ) > -1){
        	ret.push({
			    "partner": this[i]
			});            
        }
    }
    return ret;
};

function getDiff(partnerArray, emailArray) {
	var ret = [];
    partnerArray.sort();
    emailArray.sort();    
    
    for(var i = 0; i < emailArray.length; i += 1) {    	
        if(emailArray.indexOf( partnerArray[i] ) > -1){
        	ret.push({
			    "partner": partnerArray[i]
			});            
        }
    }
    console.log(ret);
    return ret;
}

function mrClean(partners){
	var partnerList = partners.split(/\s*,\s*/);
	var partnerTmp = partnerList.join(',').toLowerCase();
	var partnerArray = partnerTmp.split(',');
	return partnerArray;
}

function cleanUpArray(threadView, partnersList){
	if (partnersList.length < 2) {				
		noPartnerFound(threadView, partnersList)
	} else {
		addHiringPartnerSidebar(threadView, partnersList)
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
		console.log(results);								
		console.log('----$$$$---');	    
						
		var html = results[1];        
	    var template = _.template(html);		    
	    
	    sidebarForThread.get(threadView).innerHTML = sidebarForThread.get(threadView).innerHTML + template({
	    	partner: partner      		      
	    });
	});
}

function get(url, params, headers) {
	return Promise.resolve(
		$.ajax({
			url: url,
			type: "GET",
			data: params,
			headers: headers,
			// dataType: 'jsonp'			
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

function parseData(file, callBack) {
	// var file = 'hiring_partners.csv';
	Papa.parse(file, {
		download: true,
		complete: function(turkey) {
			console.log("Finished:", turkey.data);
		}
	});	
}	


// ----------------------------------------- // 
// function intersectionObjects2(a, b, areEqualFunction) {
//     var results = [];
    
//     for(var i = 0; i < a.length; i++) {
//         var aElement = a[i];
//         var existsInB = _.any(b, function(bElement) { return areEqualFunction(bElement, aElement); });

//         if(existsInB) {
//             results.push(aElement);
//         }
//     }
    
//     return results;
// }

// function intersectionObjects() {
//     var results = arguments[0];
//     var lastArgument = arguments[arguments.length - 1];
//     var arrayCount = arguments.length;
//     var areEqualFunction = _.isEqual;
    
//     if(typeof lastArgument === "function") {
//         areEqualFunction = lastArgument;
//         arrayCount--;
//     }
    
//     for(var i = 1; i < arrayCount ; i++) {
//         var array = arguments[i];
//         results = intersectionObjects2(results, array, areEqualFunction);
//         if(results.length === 0) break;
//     }

//     return results;
// }

// var a = [ { id: 1, name: 'jake' } ];
// var b = [ { id: 1, name: 'jake' }, { id:4, name: 'jenny'} ];
// var c = [ { id: 1, name: 'jake' }, { id:4, name: 'jenny'}, { id: 9, name: 'nick'} ];

// var result = intersectionObjects(a, b, c, function(item1, item2) {
//     return item1.id === item2.id;
// });

// console.dir(result);
