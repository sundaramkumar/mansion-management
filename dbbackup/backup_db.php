<?php
/**
 * Backup_db.php
 *
 *
 */
 session_start();
// error_reporting(0);
if(!isset($_SESSION['username']) || !isset($_SESSION['userid']) ){
    //echo "Not authenticated.....";
    header("location: ./login.php");
    exit;
}

require_once("../config/dbconn.php");
require_once("../includes/functions.php");

if($_POST['todo'])
$todo = $_POST['todo'];


/***************
Restore database
***************/

if($todo == "RESTOREDB"){
// print_r($_FILES);
        $vercode  = trim($_POST['text']);
        $verfResult = verification($vercode);
        if($verfResult==0){
            echo "{ success: false,title:'Authentication Failed',msg:'Incorrect Transaction Password'}";
        }else{
            $output = $_FILES['backupfile']['tmp_name'];
        //$_FILES["proof".$i]["tmp_name"]
            include 'mysql_backup.class.php';
            //     You need to use physical path to this file. e.g. ../data/backup.txt
            //$output = "backup.sql";

            //---- this must be the same as the one you used for backup.
            $structure_only = false;

            restore_tables(HOSTNAME, "test", USERNAME, PASSWORD, $output, $structure_only);
        }
}

/***************
Backup database
***************/

if($todo == "BACKUPDB"){
    backup_tables(HOSTNAME, USERNAME, PASSWORD, DATABASE);
}



/*********************************************************
Backup the db OR just a table using backup_tables function
*********************************************************/
function backup_tables($host,$user,$pass,$name,$tables = '*'){
	//echo $host.'##'.$user.'##'.$pass.'##'.$name.'##'.$tables;
    $date_time   = date('Y-m-d H:i:s');
    $return  = "-- Backup Mansion Database\n";
    $return .= "-- http://www.amofly.com\n";
    $return .= "\n";
    $return .= "-- Created on ".$date_time;
    $return .= "\n\n";
    $return .= 'SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";';
    $return .= "\n\n";
    $return .= "--\n";
    $return .= "-- Database: `".$name."`";
    $return .= "\n--\n\n";
    $return .= "-- --------------------------------------------------------\n";

    //$return .= "DROP database ".$name;
    //$return .= "\n\n";

    $link = mysql_connect($host,$user,$pass);
    mysql_select_db($name,$link);

    //get all of the tables
    if($tables == '*')
    {
        $tables = array();
        $result = mysql_query('SHOW TABLES');
        while($row = mysql_fetch_row($result))
        {
            $tables[] = $row[0];
        }
    }
    else
    {
        $tables = is_array($tables) ? $tables : explode(',',$tables);
    }

    //cycle through
    foreach($tables as $table)
    {
        $result = mysql_query('SELECT * FROM '.$table);
        $num_fields = mysql_num_fields($result);

        //$return.= 'DROP TABLE '.$table.';';        
        $return .= "-- \n-- Table structure for table `".$table."`\n-- \n";
        $row2 = mysql_fetch_row(mysql_query('SHOW CREATE TABLE '.$table));
        $return .= $row2[1].";\n\n";

        $return .= "-- \n-- Dumping data for table `".$table."`\n-- \n";

        for ($i = 0; $i < $num_fields; $i++)
        {
            //echo mysql_field_type($result,$i)." - ";
            while($row = mysql_fetch_row($result))
            {
                $return.= 'INSERT INTO '.$table.' VALUES(';
                for($j=0; $j<$num_fields; $j++)
                {
                    $row[$j] = addslashes($row[$j]);
                    $row[$j] = ereg_replace("\n","\\n",$row[$j]);
                    if (isset($row[$j])) {
                        //if field value is not empty
                        $return.= '"'.$row[$j].'"' ;
                    }
                    else {//if field value is empty
                        //if the field type is date
                        if(mysql_field_type($result,$i) == "date")
                            return "0000-00-00";
                        else if(mysql_field_type($result,$i) == "datetime")//if the field type is datetime
                            return "0000-00-00 00:00:00";
                        else //else other types
                            $return.= '""';
                    }
                    if ($j<($num_fields-1)) { $return.= ','; }
                }
                $return.= ");\n";
            }
        }
        $return .= "-- --------------------------------------------------------\n";
        $return.="\n\n\n";
    }
	//echo $return;
    //save file
    //$handle = fopen('db-backup-'.time().'-'.(md5(implode(',',$tables))).'.sql','w+');
    //$filename='backup.sql';
    $date       = date('d_m_Y');
    $backuptime = date("H_i_s");  
    $filename   = 'backup_'.$date.'.sql'; //'backup_'.$date.'_'.$backuptime.'.sql';
    $path       = './backupdata/'.$filename;
    $downloadPath = './dbbackup/backupdata/'.$filename;
    $handle     = fopen($path,'w');
   
    fwrite($handle,$return);
    fclose($handle);
	$mgs = '';
	if(file_exists($path)){
        echo "{ success: true,msg:'".$downloadPath."'}";
    }else{
        echo "{ success: false,msg:'Backup Failed'}";
    }
}

/*********************************************************
Resote the db
*********************************************************/
function restore_tables($db_server,$db_name,$db_admin_name,$db_admin_pass,$output,$structure_only){
    mysql_query("CREATE DATABASE `".$db_name."`");
    $backup = new mysql_backup($db_server,$db_name,$db_admin_name,$db_admin_pass,$output,$structure_only);
    $str = $backup->restore();
    if($str != 1 ){
        echo "{ success: false,msg:'".$str."'}";
    }else{
        echo "{ success: true,msg:'Database restored Sucessfully. <br/><b class='tableTextM'>Note:</b>Please Logout and login again to see the restored data or press f5 to reload the page'}";
    }    
}

?>