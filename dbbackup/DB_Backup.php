<?php
/*$host = 'localhost'
$user = 'root'
$pass = 'redhat'
$backupDir = "/home/user/www/mysqlbackups";
$backupFileName = "backup.sql";
$back = $backupDir.$backupFileName;*/

$todo = $_POST['todo'];

if($todo == "BACKUPDB"){
system(sprintf("mysqldump -h localhost -u eztestext -peztestext test > /tmp/GATEWAY.sql"));
echo 'BACKUP Taken successfully.';
}
else
{
echo 'BACKUP not Taken';
}
?>
