<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Twitter Mapping - Map a Keyword</title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<link rel="stylesheet" type="text/css" href="css/bootstrap.css">
		<link rel="stylesheet" href="http://js.arcgis.com/3.13/esri/css/esri.css">
		<link rel="stylesheet" href="css/main.css">

		<script src="http://js.arcgis.com/3.13/"></script>
		<script src="js/bootstrap.js"></script>

		<link href='http://fonts.googleapis.com/css?family=Lobster' rel='stylesheet' type='text/css'>

	</head>

	<body>
		<div class="container">

			<form id="form" class="form-horizontal">
				<fieldset>

				<!-- Form Name -->
				<legend style="text-align: center; font-size: 40px; font-family: 'Lobster', cursive;"><img src="imgs/esri.png" class="logo"> Geo Tweets</legend>

				<!-- Twitter input-->
				<div class="form-group";>
					<label class="col-md-4 control-label" for="tag" style="color: #55acee;"></label>
					<div class="col-md-4">
					<input id="tag" name="tag" type="text" placeholder="Twitter Tag" class="form-control input-md" required="">

					</div>
				</div>
				<!-- Go button -->
				<div class="control-group">
				  <div class="col-md-4"></div>
				  <div class="col-md-4 controls go">
					<button id="singlebutton" name="singlebutton" class="btn btn-primary gobutton">Go!</button>
				  </div>
				</div>

				</fieldset>
			</form>

			<div id="map">
				<div id="search"></div>
			</div>

		</div>

		<script src="js/twitter.js"></script>
	</body>
</html>
