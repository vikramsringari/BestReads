<?php
	/*
	Vikram Sringari
	5/18/2016
	CSE 154 AC
	HW6: BestReads
	This PHP file stores information, descriptions, reviews for each book and stores 
	the book list. This information comes from files kept in the server. This php file
	stores the books' info in JSON, the stores the description as plain text and the 
	reviews and HTML. This book list stored as XML
	*/
	$title = $_GET["title"]; # title of book folder
	
	$mode = $_GET["mode"]; # name of mode of php url
	
	$PATH = "books/$title/"; # beginning of the path for file
	
	if ($mode == "info") { # used to find information on books
		$bookInfos = glob($PATH . "info.txt"); # gets files kept on server
		createInfo($bookInfos);
	} elseif ($mode == "description"){ # used to find description of books
		$bookDescriptions = glob($PATH . "description.txt"); # gets files kept on server 
		createDescription($bookDescriptions);
	} elseif ($mode == "reviews"){ # used to find reviews of books
		$bookReviews = glob($PATH . "review" . "*" . ".txt"); # gets files kept on server
		createReview($bookReviews);	
	} elseif ($mode == "books"){ # used to find all book and their folder
		createBooks();
	}

	# Takes in all files of info on each book and gives the title, author
	# stars. These peices of information are kept as JSON.
	function createInfo($bookInfos) {;
		foreach ($bookInfos as $bookInfo) {
			$info = file($bookInfo, FILE_IGNORE_NEW_LINES);
			$data = array (
				"title" => $info[0],
				"author" => $info[1],
				"stars" => $info[2]
				);
			header("Content-type: application/json");
			print(json_encode($data));
		}
	}
	
	# Takes in all files of description on each book and gives the 
	# description for the book. These descriptions are kept as text.
	function createDescription($bookDescriptions){
		foreach ($bookDescriptions as $bookDescription) {
			$data = file_get_contents($bookDescription);
			header("Content-type: text/plain");
			print($data);
		}
	}
	
	# Takes in all files of reviews on each book and gives the 
	# reviews for the book. There are multiple reviews per book.
	# These descriptions are kept as HTML.
	function createReview($bookReviews) {
		foreach ($bookReviews as $bookReview) {
			$review = file($bookReview, FILE_IGNORE_NEW_LINES);
			?>
				<h3><?=$review[0]?><span> <?=$review[1]?></span></h3>
				<p><?=$review[2]?></p> 
			<?php
		}
	}
	
	# Creates XML for all books and a title and a folder file 
	# path are given for each book. The books tag is an outer tag 
	# that holds all book tags. These hold the file and title tags.
	function createBooks(){
		$stories = glob("books/" . "*"); # gets files kept on server
		$dom = new DOMDocument();
		$books = $dom->createElement("books");
		foreach ($stories as $story) {
			$info = file($story ."/info.txt", FILE_IGNORE_NEW_LINES);
			$book = $dom->createElement("book");
			$bookTitle = $dom->createElement("title");
			$folder = $dom->createElement("folder");
			$text = $dom->createTextNode($info[0]);
			$bookTitle->appendChild($text);
			$folderName = str_replace("books/","",$story); # get specific file path
			$text2 = $dom->createTextNode($folderName);
			$folder->appendChild($text2);
			$book->appendChild($bookTitle);
			$book->appendChild($folder);
			$books->appendChild($book);
			$dom->appendChild($books);
		}
		header("Content-type: text/xml");
		print($dom->saveXML());
	}
	
?>
	
	
