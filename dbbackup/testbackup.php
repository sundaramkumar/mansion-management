<?php
$DB_HOST="localhost";
$DB_USER="root";
$DB_PASS="secRet123";
$DB_NAME="eztest";
$date   = date('d-m-Y');
$backuptime = date("H-i-s");  
//$handle = fopen('./backupdata/eztest_'.$date.'_'.$backuptime.'.sql','w+');	
$filename='eztest_'.$date.'_'.$backuptime.'.sql';
$path = "./backupdata/".$filename;
exec('backup_process.bat backup '.$DB_HOST.' '.$DB_USER.' '.$DB_PASS.' '.$DB_NAME.' '.$path,$retval);
print_r($retval);
/*echo $command = "mysqldump --opt --skip-extended-insert --complete-insert -h ".$DB_HOST." -u ".$DB_USER." -p ".$DB_PASS." ".$DB_NAME." > backup_1.sql"; 
exec($command, $ret_arr, $ret_code);
echo "ret_arr: <br />";
print_r($ret_arr);*/

?>