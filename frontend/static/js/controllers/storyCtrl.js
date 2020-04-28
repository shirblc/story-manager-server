/*
	storyCtrl.js
	Story Manager Controller
	
	Written by Shir Bar Lev
*/

//story manager controller
//contains the currently viewed story
angular.module('StoryManager')
	.controller('storyCtrl', ['$stateParams', 'librarian', 'loadData', '$state', function($stateParams, librarian, loadData, $state) {
		//variable declaration
		var vm = this;
		this.stories = loadData;
		var storyDetails = loadData[$stateParams.id-1];
		this.storyName = storyDetails.name;
		this.storySynopsis = storyDetails.synopsis;
		this.chapters = storyDetails.chapters;
		this.storyID = storyDetails.id;
		this.chapter = loadChapterData();
		this.forDeletion;
		//the chapter being edited.
		this.editedChapter = $stateParams.chapterID;
		
		/*
		Function Name: loadChapterData()
		Function Description: Checks to see whether the current page has a "chapterID" value,
							which means it's a chapter-edit page. If it is, fetches the data
							of the chapter being edited for the template to fill in.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		function loadChapterData() {
			if($stateParams.chapterID)
				{
					return vm.chapters[$stateParams.chapterID - 1];
				}
		}
		
		/*
		Function Name: changeDetails()
		Function Description: Changes the name and synopsis of the story.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.changeDetails = function() {
			vm.storyName = document.getElementById("storyTitle").value;
			vm.storySynopsis =  document.getElementById("storySynopsis").value;
			vm.stories[vm.storyID-1].name = vm.storyName;
			vm.stories[vm.storyID-1].synopsis = vm.storySynopsis;
			librarian.updateStories(vm.stories);
		};
		
		/*
		Function Name: deleteItem()
		Function Description: Opens a popup to confirm whether to delete the selected item.
		Parameters: toDelete - the item which needs to be deleted.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.deleteItem = function(toDelete) {
			document.getElementById("modalBox").className = "on";
			document.getElementById("deletePopUp").classList.remove("off");
			document.getElementById("deletePopUp").classList.add("on");
			if(typeof toDelete != "string")
				vm.forDeletion = "All chapters";
			else
				vm.forDeletion = toDelete;
		};
		
		/*
		Function Name: delete()
		Function Description: Deletes whatever the user asked to delete.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.delete = function() {
			//if the user requested to delete the story
			if(vm.forDeletion == vm.storyName)
				{
					vm.stories.splice(vm.storyID-1, 1);
					librarian.updateStories(vm.stories);
					$state.go("home");
				}
			//if the user requested to delete all the chapters
			else if(vm.forDeletion == "All chapters")
				{
					vm.chapters = [];
					vm.stories[vm.storyID-1].chapters = [];
					librarian.updateStories(vm.stories);
				}
			//if it's not either of those, the user requested to delete a chapter
			else
				{
					var chapterNum = vm.forDeletion.substr(8,1);
					vm.removeChapter(chapterNum);
				}
		};
		
		
		/*
		Function Name: closePopUp()
		Function Description: Aborts deletion and closes the popup.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.closePopUp = function() {
			document.getElementById("modalBox").className = "off";
			
			//if the delete popup is the one from which the function was called, the function hides 
			//it.
			if(document.getElementById("deletePopUp").classList.contains("on"))
				{
					document.getElementById("deletePopUp").classList.add("off");
					document.getElementById("deletePopUp").classList.remove("on");
				}
			//if it wasn't the delete popup, it was the "add" popup, so the function
			//hides it instead
			else
				{
					document.getElementById("addPopUp").classList.add("off");
					document.getElementById("addPopUp").classList.remove("on");
				}
		};
		
		/*
		Function Name: changeChapterDetails()
		Function Description: Changes the name and synopsis of the selected chapter.
		Parameters: None
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.changeChapterDetails = function()
		{
			var chapterNumber = document.getElementById("chapterID").value;
			
			//checks whether there's already a chapter there
			//if there is
			if(vm.chapters[chapterNumber-1])
				{
					vm.chapters.splice(chapterNumber-1, 0, {
						number: chapterNumber, 
						title: document.getElementById("chapterTitle").value, 
						synopsis: document.getElementById("chapterSynopsis").value
					});
					
					vm.chapters.forEach(function(chapter, index) {
						chapter.number = index + 1;
					});
				}
			//if there isn't
			else
				{
					vm.chapters[chapterNumber-1].name = document.getElementById("chapterTitle").value;
					vm.chapters[chapterNumber-1].synopsis = document.getElementById("chapterSynopsis").value;
				}
			
			vm.stories[vm.storyID-1].chapters = vm.chapters;
			librarian.updateStories(vm.stories);
			
			vm.changeState();
		}
		
		/*
		Function Name: changeState()
		Function Description: Once the user is done updating the chapter, sends the user back to the
							story page.
		Parameters: None
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.changeState = function() {
			$state.go('story', {id: vm.storyID});
		}
		
		/*
		Function Name: openAddPanel()
		Function Description: Opens the panel allowing the user to insert the details for the new
							chapter.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.openAddPanel = function() {
			document.getElementById("modalBox").className = "on";
			document.getElementById("addPopUp").classList.remove("off");
			document.getElementById("addPopUp").classList.add("on");
		}
		
		/*
		Function Name: addChapter()
		Function Description: Adds a new chapter.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.addChapter = function()
		{
			//checks whether a number was entered for chapter number
			//if there was, places the chapter in the given place
			//it there wasn't, simply adds it at the end of the current chapters array
			var numChapter = (document.getElementById("chapterID").value) ? (document.getElementById("chapterID").value) : (vm.chapters.length + 1);
			
			//checks if there's already a chapter there
			//if there is
			if(vm.chapters[numChapter-1])
				{
					vm.chapters.splice(numChapter-1, 0, {
						number: numChapter, 
						title: document.getElementById("chapterTitle").value, 
						synopsis: document.getElementById("chapterSynopsis").value
					});
					
					vm.chapters.forEach(function(chapter, index) {
						chapter.number = index + 1;
					});
				}
			//if there isn't
			else
				{
					//adds the chapter to the array in the story controller and sends it to the librarian
					vm.chapters.push({
						number: numChapter, 
						title: document.getElementById("chapterTitle").value, 
						synopsis: document.getElementById("chapterSynopsis").value
					});
				}
			
			vm.stories[vm.storyID-1].chapters = vm.chapters;
			librarian.updateStories(vm.stories);
			
			//removes the modal box and popup
			document.getElementById("modalBox").className = "off";
			document.getElementById("addPopUp").classList.add("off");
			document.getElementById("addPopUp").classList.remove("on");
		}
		
		/*
		Function Name: openRemovePanel()
		Function Description: Opens the panel allowing the user to choose which chapters to delete.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.openRemovePanel = function() {
			document.querySelectorAll(".remove").forEach(function(chapter) {
				chapter.classList.add("on");
				chapter.classList.remove("off");
			})
			
			document.getElementById("doneBtn").classList.add("on");
			document.getElementById("doneBtn").classList.remove("off");
		}
		
		/*
		Function Name: closeRemovePanel()
		Function Description: Closes the panel allowing the user to choose which chapters to delete.
		Parameters: None.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.closeRemovePanel = function() {
			document.querySelectorAll(".remove").forEach(function(chapter) {
				chapter.classList.add("off");
				chapter.classList.remove("on");
			})
			
			document.getElementById("doneBtn").classList.add("off");
			document.getElementById("doneBtn").classList.remove("on");
		}
		
		/*
		Function Name: removeChapter()
		Function Description: Deletes a chapter.
		Parameters: chapterNumber - number of the chapter to delete.
		----------------
		Programmer: Shir Bar Lev.
		*/
		this.removeChapter = function(chapterNumber)
		{
			vm.chapters.splice(chapterNumber, 1);
			vm.stories[vm.storyID-1].chapters = vm.chapters;
			librarian.updateStories(vm.stories);
		}
}]);