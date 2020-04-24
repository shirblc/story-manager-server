//install event listener
this.addEventListener("install", function(event) {
	event.waitUntil(
		//open a cache
		caches.open("story-mgr-v1").then(function(cache) {
			//site assets to cache
			let toCache = [
				'index.html',
				'/views/chapterEdit.html',
				'/views/libraryMgr.html',
				'/views/settings.html',
				'/views/storyEdit.html',
				'/views/storyMgr.html',
				'/js/app.js',
				'/js/services/librarian.js',
				'/js/controllers/libraryCtrl.js',
				'/js/controllers/settingsCtrl.js',
				'/js/controllers/storyCtrl.js',
				'/data/stories.json',
				'/css/styles.css',
				'/css/Noteworthy-Lt.ttf'
			];
			
			//add the assets to cache
			cache.addAll(toCache);
			//error
		}).catch(function(error) {
			console.log(error);
		})
	)
});

//fetch event listener
this.addEventListener("fetch", function(event) {
	let reqUrl = event.request.url;
	let urlToGet;
	
	//if the requested page is the home page
	if(reqUrl.pathname == "/")
		urlToGet = "index.html";\
	else
		urlToGet = reqUrl;
	
	//response
	event.respondWith(
		caches.match(urlToGet).then(function(response) {
			//if the url exists in the cache
			if(response)
				{
					//fetches the url from the server and checks whether it was
					//updated after it was cached. If it was, replaces the URL in
					//the cache with the newly fetched one
					fetch(urlToGet).then(function(fetchResponse) {
						//checks the "last modified" date for both the cached and the
						//fetched urls
						let fetchedDate = fetchResponse.headers.get("Last-Modified");
						let cachedDate = response.headers.get("Last-Modified");
						let fetchedDateSec = new Date(fetchedDate);
						let cachedDateSec = new Date(cachedDate);
						
						//if the asset was changed since it was cached, replace the
						//cached asset with the new asset
						if(fetchedDateSec > cachedDateSec)
							caches.open("story-mgr-v1").then(function(cache) {
								cache.put(urlToGet, fetchResponse);
							})
					})
					
					//returns the response from cache
					return response;
				}
			//if the url doesn't exist in the cache
			else
				{
					//if the url isn't in the cache,
					//fetch it and add it to the cache
					fetch(urlToGet).then(function(response) {
						caches.open("story-mgr-v1").then(function(cache) {
							cache.put(urlToGet, response);
						})
					//since fetch only fails when there's no connection,
					//if "catch" is called it means there's no connection
					}).catch(function() {
						console.log("There's no internet connection!");
					});
					
					//fetches the url from the internet and returns the response
					return fetch(urlToGet);
				}
		})
	);
});

//message event listener, in case the application sends a message to the
//service worker
this.addEventListener("message", function(event) {
	//open the current cache
	caches.open("story-mgr-v1").then(function(cache) {
		//details and blob for the stories
		let responseDetails = { "status": 200, "statusText": "OK" };
		let stories = new Blob(event.data, {type: "application/json"});
		
		//replaces the existing "stories.json"
		cache.put("/data/stories.json", new Response(stories, responseDetails));
	});
});