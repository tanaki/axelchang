<?php

	header('Content-type: application/json');

	$data = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/slug:portfolio/content'));
	$dataAbout = json_decode( file_get_contents('http://axelchang.com/koken/api.php?/text') );
	$dataNews = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/slug:news/content'));

	foreach ( $dataAbout->text as $text ) {	
		if ( $text->slug == "about-french" ) {
			$dataAboutFR = $text->content;
		}
		if ( $text->slug == "about-english" ) {
			$dataAboutEN = $text->content;
		}
		if ( $text->slug == "about-german" ) {
			$dataAboutDE = $text->content;
		}
	}

	// Start JSON
	echo '{';

	$max = count($data->albums);
	$i = 0;

	echo '"portfolio" : [';
	foreach ( $data->albums as $album ) {

		$descTrans = getTranslation($album->description);

		echo '{';
			echo '"id" : "' . $album->id . '",';
			echo '"title" : {';
				echo '"en" : "' . $descTrans['en'] . '",';
				echo '"fr" : "' . $descTrans['fr'] . '",';
				echo '"de" : "' . $descTrans['de'] . '"';
			echo '},';
			echo '"slug" : "' . $album->slug . '",';
			echo '"cover" : "' . $album->covers[0]->presets->medium->url . '",';
			echo '"width" : "' . $album->covers[0]->presets->medium->width . '",';
			echo '"height" : "' . $album->covers[0]->presets->medium->height . '",';
			echo '"images" : [';

				$jsonAlbum = json_decode(file_get_contents('http://axelchang.com/koken/api.php?/albums/'.$album->id.'/content')); 
				$maxContent = count($jsonAlbum->content);
				$j = 0;
				foreach ( $jsonAlbum->content as $content ) {

					$captionTrans = getTranslation($content->caption);

					echo '{';
						echo '"img" : "' . $content->presets->huge->url . '",';
						echo '"credits" : {';
							echo '"en" : "' . clean($captionTrans['en']) . '",';
							echo '"fr" : "' . clean($captionTrans['fr']) . '",';
							echo '"de" : "' . clean($captionTrans['de']) . '"';
						echo '}';
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

			$translations = getTranslation($article->caption);

			echo '{';
				echo '"id" : "' . $article->id . '",';
				echo '"slug" : "' . $article->slug . '",';
				echo '"text" : {';
					echo '"en" : "' . $translations["en"] . '",';
					echo '"fr" : "' . $translations["fr"] . '",';
					echo '"de" : "' . $translations["de"] . '"';
				echo '},';
				echo '"img" : "' . $article->presets->huge->url . '"';
			echo '}';

			if ( $k < $maxArticle - 1 ) echo ',';
			$k++;

		}

	echo '],

		"about" : {
			"image" : "img/axel-chang.jpg",
			"imagetablet" : "img/axel-chang-tablet.jpg",
			"fr" : "' . addslashes(encodeAccent(trim($dataAboutFR))) . '",
			"en" : "' . addslashes(trim($dataAboutEN)) . '",
			"de" : "' . addslashes(encodeAccent(trim($dataAboutDE))) . '"
		},

		"contact" : {
			"email" : {
				"link" : "mailto:chang.axel@gmail.com",
				"label" : "chang.axel@gmail.com"
			},
			"phone" : {
				"link" : "tel:0033659561110",
				"label" : "06 59 56 11 10"
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
			},
			"linkedin" : {
				"link" : "http://fr.linkedin.com/pub/axel-chang/4a/207/732",
				"label" : "LinkedIn"
			}
		}';
	
	// End JSON
	echo '}';
	

	function clean($string) {
		//$string = str_replace('', '-', $string); // Replaces all spaces with hyphens.
		//return preg_replace('/[^A-Za-z0-9 \-\[\]\"]/', '', $string); // Removes special chars.
		return htmlentities(trim($string));
	}

	function encodeAccent($temp) {
		return htmlspecialchars_decode(htmlentities($temp, ENT_NOQUOTES, 'UTF-8'), ENT_NOQUOTES);
	}

	function getTranslation ( $text ) {
		$trans = array();

		$splitted = ( preg_split("/\{\/[a-z]{2}\}/", $text) );

		foreach ( $splitted as $split ) {

			$split = preg_replace("/\{/", "", $split);
			$split = explode("}", $split);
			$trans[ $split[0] ] = $split[1];
		}

		return $trans;
	}

?>