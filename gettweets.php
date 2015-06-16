<?php
	// Error printing
	//error_reporting(E_ALL);
	//ini_set("display_errors", 1);

	// Authentication variables
	require_once("auth.php");

	// Get the TwitterAPIExchange library
	require_once('TwitterAPIExchange.php');

	$tag = urlencode($_POST["tag"]);
	$count = $_POST["count"];
	$radius = $_POST["radius"];
	$center = $_POST["center"];
	$mapCenter = explode(',', $center );
	$lon = $mapCenter[0];
	$lat = $mapCenter[1];

	// Tokens
	$settings = array(
		'oauth_access_token' => $oauth_access_token,
		'oauth_access_token_secret' => $oauth_access_token_secret,
		'consumer_key' => $consumer_key,
		'consumer_secret' => $consumer_secret
	);

	// Base URL
	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	$getfield = '?q=' . $tag . '&count=' . $count . "&geocode=" . $lat . "," . $lon . "," . $radius . "km";


	$requestMethod = 'GET';
	$twitter = new TwitterAPIExchange($settings);

	$response = $twitter
						-> setGetfield($getfield)
						-> buildOauth($url, $requestMethod)
						-> performRequest();

	echo $response;

?>
