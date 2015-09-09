var sidebarForThread = new WeakMap();
var sidebarTemplatePromise = null;

InboxSDK.load('1', 'sdk_hr-hiring-link_6e178ad679').then(function(sdk){	
	// the SDK has been loaded			
	sdk.Conversations.registerMessageViewHandlerAll(function(messageView){		
		var threadView = messageView.getThreadView();		
		var content = messageView.getBodyElement();
		var cleanContent = content.getElementsByTagName('div');
		var rawWords = jQuery(cleanContent).text();
		var myTestString = "3TEN8,8tracks,aboutLife,AccelOps,Acupera,Adara Media,AdsNative,Advisor Software,Amazon,AnalyticsMD,Apigee,Apollo Lightspeed (SkilledUp),Appbackr,Apple,Art.com,Asana,Autodesk,Avi Networks,AxiomZen,Bigcommerce,Bina Technologies,BinWise,Blackbird Technologies,BlackLocus,Blast Analytics,Blend Labs,BloomSky,Blue Shell,BlueTalon,Blurb,Bolt Threads,bop.fm,Brandcast,Breeze,BuildingConnected,Caarbon,Captricity,Cask.io,Change.org,CheckMate,Choice Hotels,Clara Labs,ClassDojo,Clearmob,Clever,Cloud Physics,Clutch Analytics,Coinbase,CollectivePoint,CoverHound,Creative Channel Services,Creativebug,Crunchyroll,Dailymotion,Digital Insight,DocuSign,EAT Club,Edthena,Educents,Enfos,Entertainment Partners,eShares inc.,Exabeam,ExtendTV,Famous Industries,FEM Inc.,FiveStars,Fixstream,FoundersCard,Front Gate Tickets,Funding Circle,Fundly,FunnelEnvy,GearLaunch,General Things,GeneStamp,GlassLab Games,Gliffy,GoGoGab,Green Dot,GSPANN,Hearsay Social,HelloSign,Hero Digital,Hightail,Hint Health,Hiplead,Homejoy,Human Diagnosis Project,Indiegogo,InkaBinka,Inkling,Intro (formally Workalytics),Intuit,Jolata,JPMorgan Chase,JVST,KISSmetrics,Klout/Lithium Technologies,Komprise,Kumu,Learning Ray,Left Field Labs,LEVEL Studios,Life Assistant Technologies Inc.,LIVESTRONG,Local Libations,Lonely Planet,Loudr.FM,Loup,Lumiata,LuxeValet,Macys.com,Maestro.io,Maker,Man Crates,Manhattan Prep (Kaplan),Mavenlink,McKinsey & Company,MerchantAtlas,MetroDigi,Microsoft,Mimosa Networks,Mindbits,Minerva Project,Minted,Mixpanel,mNectar,Model N,MuleSoft,MyVest,Netpulse,Neustar,Newsbound,NextdoorPros,Nisum Technologies,NodePrime,Nyansa,One North,Onor,OpenTable,Oseberg,Pantry Labs,Pariveda Solutions,Pathbrite,Pearlshare,Pivotal Labs,Pixc,Pixlee,Place (Formerly The Backplane),Poll Everywhere,Popsugar,Pure Energies,Qubit,Rdio,RealtyShares,Rebilly, Recurly,Redbird Advanced Learning,Relevvant,Remedy,Reputation.com,Restless Bandit,RethinkDB,Revinate,ROI DNA,Roostify,Sapho,Sauce Labs,Scripted,ScriptRock,Segment.io,SFG Media Group,SHIFT,ShipHawk,Shipwire,Siberia.io,Sipree,Slice Technologies,SoFi,SolarCity,Soldsie,Sparked.com,Springbox,Steelbrick,StitchFix,StoryBox (formally VideoGenie),Stroll Health,Swisscom Cloud Lab,Syapse,SYNQY,Sysdig Cloud (formerly Draios),Tachyus,Tapp.TV,Teespring,The RealReal,Touch of Modern,Traction Labs,Tripping,Trove,Upstart,UserTesting,uStudio,Velope,VentureBeat,Versal,Vertical Mass,VerticalResponse,Vida Health,Vitagene,Vulcun (EmailCherry),Wagon,Walker & Co Brands,Wealthfront,Weather Underground,WibiData,Yammer,Yerdle,YesTattoo,Yiftee,Yuzu,Zendesk,Zenefits,Ziploop,"						
		var partnersArray = myTestString.split(',');		
		var partners = [];
		
		// Papa.parse(file, {
		// 	complete: function(results) {
		// 		console.log("Finished:", results.data);
		// 	}
		// });	

		var partnerList = myTestString.split(/\s*,\s*/);
		var wordsFromEmail = rawWords.split(/\s+/g);	    
		
		var partnerTmp = partnerList.join(',').toLowerCase();
		var emailTmp = wordsFromEmail.join(',').toLowerCase();
		var partnerArray = partnerTmp.split(',');
		var emailArray = emailTmp.split(',');
								
		var newNew = partnerArray.diff(emailArray);				
		// var cleanedArr = cleanUpArray(newNew);		
		cleanUpArray(threadView, newNew);
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

function cleanUpArray(threadView, partnersList){
	if (partnersList.length < 2) {		
		noPartnerFound(threadView, partnersList)
	} else {
		addHiringPartnerSidebar(threadView, partnersList)
	}	
}

function addHiringPartnerSidebar(threadView, customer) {
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
	  	customer,    		    
	    sidebarTemplatePromise
	])
	.then(function(results) {  		  	
		var customer = results[0]; 	
		console.log(customer);
		console.log('-------');	    
		var html = results[1];        
	    var template = _.template(html);	    
	    sidebarForThread.get(threadView).innerHTML = sidebarForThread.get(threadView).innerHTML + template({
	    	customer: customer      		      
	    });
	});
}

function get(url, params, headers) {
	return Promise.resolve(
		$.ajax({
			url: url,
			type: "GET",
			data: params,
			headers: headers
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
