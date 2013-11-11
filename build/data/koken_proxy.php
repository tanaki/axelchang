<?php

	header('Content-type: application/json');

	$data = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/slug:portfolio/content'));
	$dataAboutFR = json_decode( file_get_contents('http://axelchang.com/koken/api.php?/text/slug:about-french') );
	$dataAboutEN = json_decode( file_get_contents('http://axelchang.com/koken/api.php?/text/slug:about-english') );
	$dataAboutDE = json_decode( file_get_contents('http://axelchang.com/koken/api.php?/text/slug:about-german') );
	$dataNews = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/slug:news/content'));

	// Start JSON
	echo '{';

	$max = count($data->albums);
	$i = 0;

	echo '"portfolio" : [';
	foreach ( $data->albums as $album ) {

		echo '{';
			echo '"id" : "' . $album->id . '",';
			echo '"title" : "' . $album->title . '",';
			echo '"slug" : "' . $album->slug . '",';
			echo '"cover" : "' . $album->covers[0]->presets->medium->url . '",';
			// echo '"coverLow" : "' . $album->covers[0]->presets->tiny->url . '",';
			echo '"images" : [';

				$jsonAlbum = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/'.$album->id.'/content')); 
				$maxContent = count($jsonAlbum->content);
				$j = 0;
				foreach ( $jsonAlbum->content as $content ) {
					echo '{';
						echo '"img" : "' . $content->presets->huge->url . '",';
						// echo '"low" : "' . $content->presets->medium->url . '",';
						echo '"credits" : "' . clean($content->caption) . '"';
					echo '}';

					if ( $j < $maxContent - 1 ) echo ',';
					$j++;
				}

			echo ']';
		echo '}';

		if ( $i < $max - 1 ) echo ',';
		$i++;
	}
	echo '],';

	echo '"news" : [';

		$maxArticle = count($dataNews->content);
		$k = 0;
		
		foreach ( $dataNews->content as $article ) {

			echo '{';
				echo '"id" : "' . $article->id . '",';
				echo '"slug" : "' . $article->slug . '",';
				echo '"text" : "' . $article->caption . '",';
				echo '"img" : "' . $article->presets->huge->url . '"';
			echo '}';

			if ( $k < $maxArticle - 1 ) echo ',';
			$k++;

		}


	echo '],

		"about" : {
			"image" : "img/axel-chang.jpg",
			"imagetablet" : "img/axel-chang-tablet.jpg",
			"fr" : "' . addslashes(encodeAccent(trim($dataAboutFR->content))) . '",
			"en" : "' . addslashes(encodeAccent(trim($dataAboutEN->content))) . '",
			"de" : "' . addslashes(encodeAccent(trim($dataAboutDE->content))) . '"
		},

		"contact" : {
			"email" : {
				"link" : "mailto:chang.axel@gmail.com",
				"label" : "chang.axel@gmail.com"
			},
			"phone" : {
				"link" : "#",
				"label" : "06 39 78 52 70"
			},
			"facebook" : {
				"link" : "http://facebook.com/axel.changmaquilleur",
				"label" : "facebook.com/axel.changmaquilleur"
			},
			"tumblr" : {
				"link" : "http://axelchang.tumblr.com/",
				"label" : "axelchang.tumblr.com/"
			},
			"twitter" : {
				"link" : "http://twitter.com/ChangAxel",
				"label" : "twitter.com/ChangAxel"
			}
		}';
	
	// End JSON
	echo '}';

	function clean($string) {
		$string = str_replace('', '-', $string); // Replaces all spaces with hyphens.
		return preg_replace('/[^A-Za-z0-9 \-]/', '', $string); // Removes special chars.
	}

	function encodeAccent($temp) {
		return htmlspecialchars_decode(htmlentities($temp, ENT_NOQUOTES, 'UTF-8'), ENT_NOQUOTES);
	}

?>