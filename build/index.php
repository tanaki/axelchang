<?php
	
	$BASE_URL = "/";
	$PROD = false;

	if ( preg_match( '/test/', $_SERVER["REQUEST_URI"] ) ) {
		$BASE_URL = "/test/";
		$PROD = true;
	}
?>
<!doctype html>
<html>
	<head>

		<meta charset="utf-8" />
		<title>Axel Chang - Make up Artist</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

		<link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="<?php echo $BASE_URL; ?>css/style.css">
	</head>
	<body>

		<div id="wrapper">

			<header>
				<nav>
					<ul class="nav-left">
						<li><a href="/portfolio">Portfolio</a></li>
						<li><a href="/about">About</a></li>
					</ul>
					<h1>
						<a href="/">
							<img src="<?php echo $BASE_URL; ?>img/logo.png" alt="Axel Chang - Make up Artist" class="logo-white">
							<img src="<?php echo $BASE_URL; ?>img/logo-black.png" alt="Axel Chang - Make up Artist" class="logo-black">
						</a>
					</h1>
					<ul class="nav-right">
						<li><a href="/contact">Contact</a></li>
						<li class="last"><a href="/news">News</a></li>
					</ul>
				</nav>
			</header>

			<div class="main-content">
				
			</div>

			<footer>
				<ul>
					<li><a class="footer-fb" href="http://facebook.com/axel.changmaquilleur" target="_blank">Facebook</a></li>
					<li><a class="footer-tb" href="http://axelchang.tumblr.com/" target="_blank">Tumblr</a></li>
					<li><a class="footer-tw" href="http://twitter.com/ChangAxel" target="_blank">Twitter</a></li>
				</ul>
			</footer>

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
			AC.Locations.Root = '<?php echo $BASE_URL; ?>';
			AC.Locations.Templates = '<?php echo $BASE_URL; ?>templates/';
			AC.Locations.Images = '<?php echo $BASE_URL; ?>img/';
			//AC.Locations.JSON = '<?php echo $BASE_URL; ?>data/data.json';
			//AC.Locations.JSON = '<?php echo ( $PROD ? "/koken/" : $BASE_URL . "data/koken_proxy.php"); ?>';
			//AC.Locations.JSON = '<?php echo $BASE_URL; ?>data/koken_proxy.php';
			AC.Locations.JSON = '<?php echo $BASE_URL . ( $PROD ? "data/koken_proxy.php" : "data/data.json"); ?>';
		</script>
		
	</body>
</html>