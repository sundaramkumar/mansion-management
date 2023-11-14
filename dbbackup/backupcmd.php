<?php
/**
 * create path in system vars for php.exe
 * set path for the dest
 * set path for the mysql dir
 */

error_reporting(E_ALL);
require_once("f:\\projects\\mansion\\mail\\PHPMailerAutoload.php");

$dbhost = 'localhost';
$dbuser = 'root';
$dbpass = 'secRet123';
$db = "mansion";
$dest = "f:\\projects\\mansion\\dbbackup\\backupdata\\";
$backup_file = $dest.$db."_". date("Y_m_d") . '.sql';
$command = "C:\\xampp\\mysql\\bin\\mysqldump --opt -h ".$dbhost." -u ".$dbuser." -p".$dbpass." ".$db." > ".$backup_file;

// Try adding the return value if this script is about to be used for backup from the UI
system($command);

if(file_exists($backup_file)){

	// new masks
	$subject="backup for ".date("d/m/Y");
	$message="Dear Admin,<br/>Pls find the attached backup for ".date("d/m/Y")."<br/><br/>Regards,<br/>Mansion Management Software<br/><a href='http://www.amofly.com'>AmoFly</a>";

	// text/html
	
	
	// echo $message."<br>";
	//send_mail($mail["sender"],$member["email"],$subject,$message,$mail["mailtype"]);	
	
	
	// require("class.phpmailer.php");
	try{
		$mail = new PHPMailer();
		
		// $mail->SMTPDebug  = 2;
		$mail->Debugoutput = 'html';
		
		$mail->SMTPAuth   = true;                  // enable SMTP authentication
		$mail->isSMTP();
		$mail->Mailer = 'smtp';
		$mail->SMTPSecure = "tls"; //"tls";                 // sets the prefix to the servier
		$mail->Host       = "smtp.gmail.com";      // sets GMAIL as the SMTP server
		$mail->Port       = 587; //465;


		// When sending email using PHPMailer, you need to send from a valid email address
		// In this case, we setup a test email account with the following credentials:
		// email: send_from_PHPMailer@bradm.inmotiontesting.com
		// pass: password
		$mail->Username = "sbmachna05@gmail.com";  // SMTP username
		$mail->Password = "Redhat!23"; // SMTP password

		// $email is the user's email address the specified
		// on our contact us page. We set this variable at
		// the top of this page with:
		// $email = $_REQUEST['email'] ;
		// $mail->From = "guyfromchennai@gmail.com"; //$mailInfo["sender"]; //$email;
		// $mail->FromName = "Webmaster"; //$name;
		$mail->setFrom('sbmachna05@gmail.com', 'Sri Balaji Mansion (Annexe)');

		// below we want to set the email address we will be sending our email to.
		$mail->AddAddress("sbmachna05@gmail.com", "Admin");

		// set word wrap to 50 characters
		$mail->WordWrap = 50;
		// set email format to HTML
		$mail->IsHTML(true);


		$mail->Subject = $subject; //"You have received a mail from your website!";

		// $message is the user's message they typed in
		// on our contact us page. We set this variable at
		// the top of this page with:
		// $message = $_REQUEST['message'] ;
		$mail->Body    = nl2br($message);
		$mail->AltBody = $message;
		$mail->AddAttachment($backup_file);
		// echo "sending....";
		// print_r($mail);
		$mail->Send();
		echo "sent";

		// if(!$mail->Send())
		// {
		   // $str =  "Message could not be sent. ";
		   // $str .=  "Mailer Error: " . $mail->ErrorInfo;
		   // //exit;
		// }else{
			// $str =  "Message has been sent";
		// }
		
	} catch (phpmailerException $e) {
		echo $e->errorMessage(); //Pretty error messages from PHPMailer
	} catch (Exception $e) {
		echo $e->getMessage(); //Boring error messages from anything else!
	}
}


?>