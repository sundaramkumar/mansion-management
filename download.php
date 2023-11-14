<?
/**
 * download.php
 *
 * To download files/images
 *
 *
 */
error_reporting(0);
if( isset($_GET) && $_GET['obj']!='' ){
	$filename = $_GET['obj'];
	$fileBaseName = basename($filename);
	//Add for separting Testcase Log Files executed in Remotely
	$remotefile = $_GET['remote'];
	// required for IE, otherwise Content-disposition is ignored
	if($remotefile == 'remote'){
		header('Content-Type: application/octet-stream');
		header("Content-Transfer-Encoding: Binary"); 
		header("Content-disposition: attachment; filename=\"".$fileBaseName."\""); 
		readfile($filename);
		die();
	}
	if(ini_get('zlib.output_compression'))
	  ini_set('zlib.output_compression', 'Off');
	$file_extension = strtolower(substr(strrchr($filename,"."),1));

	if( $filename == "" ){
	  echo "<html><title>Download</title><body>ERROR: download file NOT SPECIFIED.</body></html>";
	  exit;
	}
	elseif (!fclose(fopen($filename, "r")) ){
	  // echo $filename;	
	  echo "<html><title>Download</title><body>ERROR: Remote File not found. </body></html>";
	  exit;
	}
	elseif ( ! file_exists( $filename ) && $remotefile!='remote'){
	  echo "<html><title>Download</title><body>ERROR: File not found. </body></html>";
	  exit;
	}
	
	switch( $file_extension ){
		case "pdf":
			$ctype="application/pdf";
			break;
		case "exe":
			$ctype="application/octet-stream";
			break;
		case "zip":
			$ctype="application/zip";
			break;
		case "doc":
			$ctype="application/msword";
			break;
		case "xls":
			$ctype="application/vnd.ms-excel";
			break;
		case "xlsx":
			$ctype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
			break;
		case "ppt":
			$ctype="application/vnd.ms-powerpoint";
			break;
		case "gif":
			$ctype="image/gif";
			break;
		case "png":
			$ctype="image/png";
			break;
		case "jpeg":
		$ctype="image/jpeg";
		case "jpg":
			$ctype="image/jpg";
			break;
		default:
			$ctype="application/octet-stream";
	}
	header("Pragma: public"); // required
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header("Cache-Control: private",false); // required for certain browsers
	header("Content-Type: $ctype");
	header("Content-Disposition: attachment; filename=\"".basename($filename)."\";" );
	header("Content-Transfer-Encoding: binary");
	header("Content-Length: ".filesize($filename));
	readfile("$filename");
	exit();
}else if( isset($_POST) && $_POST['dwgContents']!='' ){

	$ctype="application/octet-stream";
	header("Pragma: public"); // required
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header("Cache-Control: private",false); // required for certain browsers
	header("Content-Type: $ctype");
	header("Content-Disposition: attachment; filename=\"drawing.xml\";" );
	header("Content-Transfer-Encoding: binary");
	//header("Content-Length: ".filesize($filename));
	echo $_POST['dwgContents'];
	exit();
}
?>
