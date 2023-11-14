<?php
/**
 * sendSms.php
 * @param [type] $host         [description]
 * @param [type] $port         [description]
 * @param [type] $username     [description]
 * @param [type] $password     [description]
 * @param [type] $phoneNoRecip [description]
 * @param [type] $msgText      [description]
 */
// error_reporting(E_ALL);
// ini_set('display_errors','On');
// echo "start";
function sendReceiptConfirmationSMS ($host, $port, $username, $password, $phoneNoRecip, $msgText) { 

/* Parameters:
    $host – IP address or host name of the NowSMS server
    $port – "Port number for the web interface" of the NowSMS Server
    $username – <span class="notranslate">"SMS Users"</span> account on the NowSMS server
    $password – Password defined for the <span class="notranslate">"SMS Users"</span> account on the NowSMS Server
    $phoneNoRecip – One or more phone numbers (comma delimited) to receive the text message
    $msgText – Text of the message
*/
 
    $fp = fsockopen($host, $port, $errno, $errstr);
    if (!$fp) {
        // echo "errno: $errno \n";
        $res = "Error: ".$errno.":".$errstr;
        return $res;
    }
    
    fwrite($fp, "GET /?Phone=" . rawurlencode($phoneNoRecip) . "&Text=" . rawurlencode($msgText) . " HTTP/1.0\n");
    if ($username != "") {
       $auth = $username . ":" . $password;
       $auth = base64_encode($auth);
       fwrite($fp, "Authorization: Basic " . $auth . "\n");
    }
    fwrite($fp, "\n");
  
    $res = "";
 
    while(!feof($fp)) {
        $res .= fread($fp,1);
    }
    fclose($fp);
    
 
    return $res;
}


/* 
	This code provides an example of how you would call the SendSMS function from within
   	a PHP script to send a message.  The response from the NowSMS server is echoed back from the script.
*/ 
// $x   = SendSMS("127.0.0.1", 8800, "admin", "admin", "9003013383", "Dear Mr.Kumar, Received the rent for Nov2014. Thanks for your payment.");
// echo $x;



/* This code provides an example of sending a message via NowSMS as the result of a web form posting.

   First, here’s a very simple HTML web form that provides an example of what you need in your
   web form.

<HTML> 
<HEAD><TITLE>Send SMS</TITLE></HEAD> 
<BODY> 
<form method="post" action="sendsmsscript.php"> 
<table border="1"> 
<tr> 
<td>Mobile Number:</td> 
<td><input type="text" name="phone" size="40"></td> 
</tr> 
<tr> 
<td valign="top">Text Message:</td> 
<td><textarea name="text" cols="80" rows="10"></textarea> 
</tr> 
<tr> 
<td colspan="2" align="center"> 
<input type="submit" value="Send"> 
</td> 
</tr> 
</table> 
</form> 
</BODY> 
</HTML> 

   Second, here’s the PHP script that would parse the parameters from the form posting, and then call
   the SendSMS function to submit the message.

if (isset($_REQUEST[‘phone’])) { 
   if (isset($_REQUEST[‘text’])) { 
      $x = SendSMS("127.0.0.1", 8800, "username", "password", $_REQUEST[‘phone’], $_REQUEST[‘text’]); 
      echo $x; 
   } 
   else { 
      echo "ERROR : Message not sent — Text parameter is missing!\r\n"; 
   } 
} 
else { 
   echo "ERROR : Message not sent — Phone parameter is missing!\r\n"; 
} 

*/
 
?>