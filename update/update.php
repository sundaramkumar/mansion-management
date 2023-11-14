<?php
error_reporting(E_ALL);
require("../config/constants.php");
require("./update.class.php");

$update=new appupdate($update_server,$version);

echo "Checking for updates...<br>";ob_flush();

if($update->check_for_updates()) {
	echo "<br>Updates found (version ".$update->server_version.")<br>";ob_flush();
	echo "<br>Building file list :<br>";ob_flush();
	echo $update->print_updated_files_list();ob_flush();

	echo "<br>Checking for write permisions :<br>";ob_flush();
	if($update->check_if_are_writable()) {
		echo "All files are writable.<br>";ob_flush();
	} else {
		echo "Some files are not writable.<br>";ob_flush();
	}
	foreach ($update->writable_files as $file=>$value) {
		echo $file."=".$value."<br>";ob_flush();
	}

	echo "<br>Starting to update files... <br>";ob_flush();
	if($update->update_files()===true) {
		echo "<br>All the files are updated succesfuly<br>";ob_flush();
	} else {
		echo "<br>Some errors ocured while updating the files. Please contact support.<br>";ob_flush();
	}
} else {
	echo "<br>No update neccesary. <br>";ob_flush();
}
?>

