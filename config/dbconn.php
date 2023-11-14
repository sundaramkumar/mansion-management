<?php
// session_start();
//error_reporting(E_ALL);
define('DB_TYPE', 'mysql');
define('USERNAME', 'root');
define('PASSWORD', 'secRet123');
define('HOSTNAME', 'localhost');
define('DATABASE', 'mansion');

$conn = mysql_connect(HOSTNAME,USERNAME,PASSWORD);
if(!$conn)
    die('Could not connect: ' . mysql_error());

$db_selected = mysql_select_db(DATABASE,$conn);
if (!$db_selected)
    die ('Cannot use Customers Database : ' . mysql_error());





?>
