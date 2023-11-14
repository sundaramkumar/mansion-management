<?
$version = 2.000;
$update_server = "http://localhost/mansion/updates";
$baseFolder = "F:\\projects\\mansion\\";
if (function_exists('salt')) {
	$salt = base64_decode(salt());
}

if(function_exists('NoLic')){
	$unlic = base64_decode(NoLic());
}else{
	$unlic = "Fatal Error in handling License";
	// exit;
}

if (function_exists('coords')) {
	$coords = base64_decode(coords());
}
$smsa = "admin";
$smsp = "admin";
?>