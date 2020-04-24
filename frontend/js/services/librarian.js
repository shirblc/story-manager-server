/*
	librarian.js
	Story Manager Service
	
	Written by Shir Bar Lev
*/

//librarian service to deal with exporting the changes the user makes to their stories
angular.module('StoryManager')
	.service('librarian', [function() {
		//variable declaration
		var vm = this;
		this.myStories = {
			stories: []
		};
		
		/*
		Function Name: updateStories()
		Function Description: 
		Parameters: stories - the updated stories array (including the new/updated story/chapters or
							without the deleted story/chapters).
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.updateStories = function(stories)
		{	
			vm.myStories.stories = stories;
			vm.postToCache();
		}
		
		/*
		Function Name: postToCache()
		Function Description: Sends the updated stories object to the Service Worker so they
							can be cached.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.postToCache = function() {
			navigator.serviceWorker.controller.postMessage(vm.myStories);
		}
}]);