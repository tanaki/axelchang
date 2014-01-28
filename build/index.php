<?php
	
	$BASE_URL = "/";
	$PROD = true;

	/*
	if ( preg_match( '/test/', $_SERVER["REQUEST_URI"] ) ) {
		$BASE_URL = "/test/";
		$PROD = true;
	}
	*/

	$jsonData = file_get_contents('data/copy.json');
	$rawData = json_decode($jsonData);

	if ( isset($_COOKIE["acm_lang"]) ) {
		$lang = $_COOKIE["acm_lang"];
	} else {
		$lang = "fr";
	}
?>
<!doctype html>
<!--[if lt IE 8]>      <html class="lang-<?php echo $lang; ?> ie8 ie7 ie"> <![endif]-->
<!--[if IE 8]>         <html class="lang-<?php echo $lang; ?> ie8 ie"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="lang-<?php echo $lang; ?>">         <!--<![endif]-->
	<head>

		<link rel="shortcut icon" href="<?php echo $BASE_URL; ?>favicon.ico" />

		<meta charset="utf-8" />
		<title>Axel Chang - <?php echo $rawData->copy->$lang->title; ?></title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="<?php echo $BASE_URL; ?>css/style.css">

		<!--[if lt IE 9]>
		    <script src="js/libs/html5shiv.js"></script>
		    <script type="text/javascript" src="js/libs/respond.min.js"></script>
		<![endif]-->
	</head>
	<body>

		<div id="wrapper">

			<header>
				<nav>
					<ul class="nav-left">
						<li><a href="/portfolio"><?php echo $rawData->copy->$lang->portfolio; ?></a></li>
						<li><a href="/about"><?php echo $rawData->copy->$lang->about; ?></a></li>
					</ul>
					<h1>
						<a href="/">
							<img src="<?php echo $BASE_URL; ?>img/logo.png" alt="Axel Chang - Make up Artist" class="logo-white">
							<img src="<?php echo $BASE_URL; ?>img/logo-black.png" alt="Axel Chang - Make up Artist" class="logo-black">
						</a>
					</h1>
					<ul class="nav-right">
						<li><a href="/contact"><?php echo $rawData->copy->$lang->contact; ?></a></li>
						<li class="last"><a href="/news"><?php echo $rawData->copy->$lang->news; ?></a></li>
					</ul>
				</nav>

				<div class="mobile-nav">
					<a href="#" class="open">Open</a>
					<ul>
						<li><a href="/portfolio"><?php echo $rawData->copy->$lang->portfolio; ?></a></li>
						<li><a href="/about"><?php echo $rawData->copy->$lang->about; ?></a></li>
						<li><a href="/contact"><?php echo $rawData->copy->$lang->contact; ?></a></li>
						<li><a href="/news"><?php echo $rawData->copy->$lang->news; ?></a></li>
					</ul>
				</div>
			</header>

			<div class="main-content">
				
			</div>

			<footer>

				<div class="footer-inside">
					<a href="#modal-credits" class="infos" rel="modal">Info</a>

					<div class="social-container">
						<ul>
							<li><a class="footer-fb" href="http://facebook.com/axel.changmaquilleur" target="_blank">Facebook</a></li>
							<li><a class="footer-tb" href="http://axelchang.tumblr.com/" target="_blank">Tumblr</a></li>
							<li><a class="footer-tw" href="http://twitter.com/ChangAxel" target="_blank">Twitter</a></li>
						</ul>
					</div>

					<div class="lang-container">
						<ul>
							<li>
								<a href="#" class="lang fr" data-lang="fr">FR</a>
							</li>
							<li>
								<a href="#" class="lang en" data-lang="en">EN</a>
							</li>
							<li>
								<a href="#" class="lang de" data-lang="de">DE</a>
							</li>
						</ul>
					</div>
				</div>
			</footer>

			<div class="spin-box"></div>

		</div>

		<div id="modal-credits" class="hidden">
			Design<br/><a href="http://marielaurent.fr" target="_blank">Marie Laurent</a><br/><br/>
			Developpement<br/><a href="http://cargocollective.com/nicopigelet" target="_blank">Nicolas Pigelet</a><br/><br/>
			Traducteurs<br/><div class="name">Gillian McBride<br/>Cora Ungeheuer</div><br/><br/>
		</div>
		
		<!-- LIBS -->
		<!-- // <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js"></script> -->
		<script type="text/javascript" src="<?php echo $BASE_URL; ?>js/libs/jquery-1.10.2.min.js"></script>
		<!-- <script type="text/javascript" src="/js/libs/libs.min.js"></script> -->
		<script type="text/javascript" src="<?php echo $BASE_URL; ?>js/libs/libs.js"></script>

		<!-- COMPILED SCRIPT -->
		<!-- <script type="text/javascript" src="/js/AC.min.js"></script> -->
		<script type="text/javascript" src="<?php echo $BASE_URL; ?>js/AC.js"></script>
		<script type="text/javascript">

			AC.Lang = '<?php echo $lang; ?>';
			AC.Copy = <?php echo $jsonData; ?>;

			AC.Utils.isProd = '<?php echo $PROD; ?>';
			AC.Locations.Root = '<?php echo $BASE_URL; ?>';
			AC.Locations.Templates = '<?php echo $BASE_URL; ?>templates/';
			AC.Locations.Images = '<?php echo $BASE_URL; ?>img/';
			
			AC.Locations.JSON = '<?php echo $BASE_URL; ?>data/koken_proxy.php';
			//AC.Locations.JSON = '<?php echo $BASE_URL . ( $PROD ? "data/koken_proxy.php" : "data/data.json"); ?>';
		</script>

		<!--script type="text/javascript">

			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-37550556-1']);
			_gaq.push(['_trackPageview']);

			(function() {
			var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
			ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
			var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
			})();

		</script-->
	</body>
</html>