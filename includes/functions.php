<?php
// error_reporting(E_ALL);
function getRoomNo($roomId){
	$roomQry = mysql_query('SELECT roomNo FROM rooms WHERE roomId = "'.$roomId.'"');
	$roomRes = mysql_fetch_array($roomQry);
	return $roomRes['roomNo'];
} 

function getGuestName($guestId){
	$roomQry = mysql_query('SELECT guestName FROM guests WHERE guestId = "'.$guestId.'"');
	$roomRes = mysql_fetch_array($roomQry);
	return $roomRes['guestName'];
}

function verification($vercode){
    $username = $_SESSION['username'];
    $verfQry = "SELECT *
                FROM users
                WHERE
                    username = '".$username."'
                    AND
                    (
                    password = PASSWORD('".$vercode."')
                    OR
                    password = OLD_PASSWORD('".$vercode."')
                    )";
    $result = mysql_query($verfQry);
    $verfCnt = mysql_num_rows($result);
    return $verfCnt;
}

function gAccHeads($qryval,$qryfield,$selfiled){
	$listQry = "SELECT ".$selfiled." FROM accountheads WHERE ".$qryfield."='".$qryval."'";
	    $result = mysql_query($listQry);
	    if(!$result) {
	        $message  = 'Invalid query: ' . mysql_error() . "\n";
	        $message .= 'Whole query: ' . $listQry;
	        die($message);
	    }else{
	        while($rows = mysql_fetch_array($result)){	           
	            return $rows[$selfiled];
	        }
    }
}
function TruncateString($haystack, $needle) { 
    //Find the position of $needle 
    $pos=strpos($haystack,$needle); 
    
    // If not found, no truncation required 
    if ($pos == FALSE) 
        return $haystack; 

    // Truncate string at $needle 
    return substr($haystack,0,$pos); 
} 

function getUserName($userid){
	// echo 'SELECT username FROM users WHERE userid = "'.$userid.'"';
	$memberQry = mysql_query('SELECT username FROM users WHERE userid = "'.$userid.'"');
	$memberRes = mysql_fetch_array($memberQry);
	return $memberRes['username'];
}

function sendReceiptConfirmation($guestId,$mobile,$strMsg){
    global $smsa,$smsp;
    require_once("../sendSMS.php");

    if($mobile!="" && strlen($mobile)<=10){
        $x   = sendReceiptConfirmationSMS("127.0.0.1", 8800, $smsa, $smsp, $mobile, $strMsg);
        $msgStr="";
        while ($x) { 
            $x = strstr ($x, "MessageID="); 
            if ($x) { 
                $msgidString = substr ($x, 0, strpos($x,"\r\n")); 
                if (!$msgidString) $msgidString = $x; 
                    $recipString = strstr ($msgidString, "Recipient="); 
                if ($recipString) { 
                    $msgidString = substr ($msgidString, 10); // Skip "MessageID=" 
                    $msgidString = TruncateString ($msgidString, " "); // Truncate message id at " " 
                    $msgidString = TruncateString ($msgidString, ","); // Truncate message id at "," 
                    $msgidString = TruncateString ($msgidString, ".req"); // If message id includes ".req", remove it 
                    $recipString = substr ($recipString, 10); // Skip "Recipient=" 
                    $recipString = TruncateString ($recipString, " "); // Truncate recipient at " " -- shouldn't be necessary 
                    $recipString = TruncateString ($recipString, ","); // Truncate recip at "," -- shouldn't be necessary 
                    $msgStr = "Debug: MSGID=" . $msgidString . " ... RECIP=" . $recipString . "\n"; 
                } 
                $x = strstr ($x, "\r\n"); 
            } 
        } 

        $smsQry = 'INSERT INTO smslogs(guestId,mobile,message,smsLog,sentOn) 
                    VALUES( "'.$guestId.'","'.
                                $mobile.'","'.
                                $strMsg.'","'.
                                $msgStr.'","'.
                                date('Y-m-d H:i:s').'")';
        $smsRes = mysql_query($smsQry);
        // if(substr($x, 0,6)=="Error:")
        // echo $x;
    }
}

function getMobile($guestId){
    $roomQry = mysql_query('SELECT mobile FROM guests WHERE guestId = "'.$guestId.'"');
    $roomRes = mysql_fetch_array($roomQry);
    return $roomRes['mobile'];
}

function do_post_request($url, $data, $optional_headers = null){
	$params = array('http' => array(
			  'method' => 'GET',
			  'content' => $data
			));
	if ($optional_headers !== null) {
		$params['http']['header'] = $optional_headers;
	}
	$ctx = stream_context_create($params);
	$fp = @fopen($url, 'rb', false, $ctx);
	if (!$fp) {
		throw new Exception("Problem with $url, $php_errormsg");
	}
	$response = @stream_get_contents($fp);
	if ($response === false) {
		throw new Exception("Problem reading data from $url, $php_errormsg");
	}
	return $response;
}

function sendSMS($cellno, $smsStr){
	$path  = "/var/spool/sms/outgoing/";
	$filename = $cellno.mt_rand();
	$contents = "To: ".$cellno."\n\n".$smsStr;
	$fh = fopen($path.$filename, 'w+');
	fwrite($fh,$contents);
	fclose($fh);
}


class cRc4{
    private $pStr;  //processed string
    public function cRc4($data,$pwd){
        $pwd = $keyfile;
        $pwd_length = strlen($pwd);
        
        //added to avoid the "devisible by zero" error
        if ($pwd_length > 0){ 
            for ($i = 0; $i < 255; $i++) {
                $key[$i] = ord(substr($pwd, ($i % $pwd_length)+1, 1));
                $counter[$i] = $i;
            }
        }
        for ($i = 0; $i < 255; $i++) {
            $x = ($x + $counter[$i] + $key[$i]) % 256;
            $temp_swap = $counter[$i];
            $counter[$i] = $counter[$x];
            $counter[$x] = $temp_swap;
        }
        for ($i = 0; $i < strlen($data); $i++) {
            $a = ($a + 1) % 256;
            $j = ($j + $counter[$a]) % 256;
            $temp = $counter[$a];
            $counter[$a] = $counter[$j];
            $counter[$j] = $temp;
            $k = $counter[(($counter[$a] + $counter[$j]) % 256)];
            $Zcipher = ord(substr($data, $i, 1)) ^ $k;
            $Zcrypt .= chr($Zcipher);
        }
        $this->pStr = $Zcrypt;        
    }
    public function getProcessedStr(){
        return $this->pStr;
    }
    
    public function hex2bin($hexdata){
        for ($i=0;$i<strlen($hexdata);$i+=2) {
            $bindata.=chr(hexdec(substr($hexdata,$i,2)));
        }
        $this->pStr = $bindata;
    }   
}
?>
