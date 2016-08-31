/*
Vikram Sringari
5/18/2016
CSE 154 AC
HW6: BestReads
This JavaScript file gives functionality to the bestreads website.
When a book is clicked it shows the user information about that book,
including, the author, the average rating, a description, and reviews.
When the home button is clicked the user goes back to the home page. 
*/
(function() {
	
	"use strict";
	
	var bookTitle; // from the book that is clicked
	
	var SUCCESS = 200; // test for proper server connection
	
	// This function takes the user to the home screen of the website in
	// the begining. This home screen contains a virtual shelf of books
	// It also allows the user to go back to the home screen if home is 
	// clicked (only if not in the home page).
	window.onload = function(){
		home();
		var homeButton = document.getElementById("back");
		homeButton.onclick = home;		
	};
	
	// This function goes to the  home screen if home is 
	// clicked and only if one is not on the home page.
	function home(){
		if(document.getElementById("allbooks").innerHTML == ""){
			searchData("books", allBooks);
		}
	}
	
	// This function takes the a mode which is used to dettermine the extension
	// to the php page that XML/JSON/html/text data is extracted from, and then runs 
	// a loadfunction that takes the data and outputs on the page.
	function searchData(mode, loadFunction) {
		var ajax = new XMLHttpRequest();
		ajax.onload = loadFunction;
		var url = "https://webster.cs.washington.edu/students/stripes7/hw6/bestreads.php" + 
			"?mode=" + mode;
		ajax.open("GET", url, true);	
		ajax.send();
	}
	
	// This functio shows only the page of the book that is clicked on.
	// It shows the user information about that book, including, the 
	// author, the average rating, a description, and reviews. 
	// These books only come from the data available.
	function load() {
		visibility("none", "allbooks");
		visibility("", "singlebook");
		bookTitle = this.className; // enables the user to go to page of the book that is clicked
		document.getElementById("cover").src = "books/"+bookTitle+"/cover.jpg";
		document.getElementById("allbooks").innerHTML = ""; 
		searchData("info&title=" + bookTitle, oneBookInfo);
		searchData("description&title=" + bookTitle, oneBookDescription);
		searchData("reviews&title=" + bookTitle, oneBookReview);	
	}
	
	// This function shows only all the books, (only their picture and title)
	// These books only come from the data available.
	// If the image of the book or the title of the books is clicked the 
	// page for that book is shown
	function allBooks(){
		visibility("none", "singlebook");
		visibility("", "allbooks");
		if(this.status == SUCCESS){
			var title = this.responseXML.querySelectorAll("title");
			var folder = this.responseXML.querySelectorAll("folder");
			for (var i = 0; i < title.length; i++) {
				var book = document.createElement("div");
				var text = document.createElement("p");
				var image = document.createElement("img");
				var fileName = folder[i].textContent; 
				var img = "books/" + fileName + "/cover.jpg";
				image.src = img;
				image.alt = fileName;
				image.className = fileName; // gives classname to get to its page
				text.className = fileName;
				text.innerHTML = title[i].textContent;
				book.appendChild(image);
				book.appendChild(text);
				document.getElementById("allbooks").appendChild(book);
				image.onclick = load;
				text.onclick = load;
			}
		}	
	}
	
	// This function gets the information for the page of the book that was clicked.
	// This info includes the title, the author, and the number of stars(/5).
	function oneBookInfo(){
		if(this.status == SUCCESS){
			var info = JSON.parse(this.responseText);
			var title = info.title;
			document.getElementById("title").innerHTML = title;
			var author = info.author;
			document.getElementById("author").innerHTML = author;
			var stars = info.stars;
			document.getElementById("stars").innerHTML = stars;
		}
	}
	
	// This function gets the description for the page of the book that was clicked.
	function oneBookDescription(){
		if(this.status == SUCCESS){
			var description = this.responseText;
			document.getElementById("description").innerHTML = description;
		}
	}
	
	// This function gets the reviews for the page of the book that was clicked.
	// This number of reviews will vary based on book
	function oneBookReview(){
		if(this.status == SUCCESS){
			var review = this.responseText;
			document.getElementById("reviews").innerHTML = review;
		}
	}
	
	// Dettermines what item is visible on the page
	// Takes the id of the item in question and the state of the display
	// to dettermine the if it is visible.
	function visibility(display, id) {
		document.getElementById(id).style.display = display;
	}
	
})();