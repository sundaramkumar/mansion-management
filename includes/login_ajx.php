<?php
#ajxlogin.php
session_start();
// echo (integer)ini_get('display_errors');
// ini_set('display_errors', 1); 
// error_reporting(E_ALL);
include_once("../config/dbconn.php");
require_once("../proc.php");
require_once("../includes/functions.php");
require_once("../config/constants.php");

if($_POST){
	
    if($_POST['username'] && $_POST['password'] ){
		
			$username 		= $_POST['username'];			
			
			$loginQry = mysql_query("SELECT * FROM users WHERE username = '".$_POST['username']."' AND password=PASSWORD('".$_POST['password']."') AND status='E' ");
			$loginCnt = mysql_num_rows($loginQry);
			if($loginCnt == 0){
				// echo "{ success: false, errors: { reason: 'Your Login details do not match.Please Contact Support' }}";
				$msg = "Your Login details do not match.Please Contact Support";
				header("Location: ../index.php?msg=".$msg);
				exit;
			}else{
				if($_POST['remember_me'])
				{												
					$cookie_arr = $_POST['username'].','.$_POST['password'];
					setcookie("cook",$cookie_arr,strtotime("+30 days"),"/");
				}else{
					//if remember me not selected delete the cookie. but when you come to login
					//screen again, the cookied will be removed.
					// if (isset($_COOKIE['cook'])){
					// 	setcookie( "cook", "", time()- 60, "/","", 0);
					// }
				}
				$loginRes = mysql_fetch_array($loginQry);
				$login_status	= $loginRes['status'];
				if($login_status=="D"){
					// echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
					$msg = "Your account is blocked,you have exceeded the no of attempts";
					header("Location: ../index.php?msg=".$msg);
					exit;
				}else{


					if (strtolower(PHP_SHLIB_SUFFIX) === 'dll'){
						$wmi = new COM('winmgmts:{impersonationLevel=impersonate}//./root/cimv2');

						if (!is_object($wmi)) {
							$msg = 'This needs access to WMI. Please enable DCOM';
							header("Location: ../index.php?msg=".$msg);
							exit;
						}

						if(file_exists("../config/mansion.lic")){
						    //decrypt
						    $contents = file_get_contents("../config/mansion.lic");
						    $ugzdata = gzuncompress($contents);
						    $rc4new = new cRc4($ugzdata,$salt);    
						    $dec_data = $rc4new->getProcessedStr( $rc4new->hex2bin( $rc4new->getProcessedStr() ) );

						    if( $dec_data == getFootPrint() ){
						    	$_SESSION['footprint'] = $dec_data ;		    	
						    }else{
						    	header("Location: ../index.php?msg=".$unlic);
						    	exit;
						    }		    
						}else{
							header("Location: ../index.php?msg=".$unlic);
							exit;						
						}		
					}

					$userid 	= $loginRes['userid'];
					$username 	= $loginRes['username'];
					$usertype 	= $loginRes['usertype'];
					// $customerid 	= $loginRes['customerid'];
					$_SESSION['userid'] 	= $userid;
					$_SESSION['username'] 	= $username;
					$_SESSION['usertype'] 	= $usertype;
					$_SESSION['cname']=base64_decode(id());
					// $_SESSION['customerid'] 	= $customerid;

					$upQry = "UPDATE users SET loginip = '". $_SERVER['REMOTE_ADDR'] ."' WHERE userid = '".$loginRes['userid']."'";
					$upRes = mysql_query($upQry);
					
					// $cQry = "SELECT timezone from customers WHERE customerid = $customerid";
					// $cRes = mysql_query($cQry);
					// $cRow = mysql_fetch_array($cRes);
					// $_SESSION['timzone'] = $cRow['timezone'];

					$_SESSION['loadpage']	= 'devices';
					// echo "{ success: true}";
					header("Location: ../cpanel.php");
					exit;
				}
			}
		
    }else{
        // echo "{ success: false, errors: { reason: 'Login failed. Please Try again.' }}";
        $msg =  "Login failed. Please Try again.";
        header("Location: ../index.php?msg=".$msg);
    }
}
else
{
	$cook_val = $_COOKIE["cook"];
	$cook_arr = explode(',',$cook_val);
	if($cook_arr[0]!="" && $cook_arr[1]!="")
	{
		$loginQry = mysql_query("SELECT * FROM users WHERE username = '".$cook_arr[0]."' AND password=PASSWORD('".$cook_arr[1]."') AND status='E' ");
		$loginCnt = mysql_num_rows($loginQry);
		if($loginCnt == 0){
			// echo "{ success: false, errors: { reason: 'Your Login details do not match.Please Contact Support' }}";
			$msg = 'Your Login details do not match.Please Contact Support';
			header("Location: ../index.php?msg=".$msg);
			exit;
		}else{
			$loginRes = mysql_fetch_array($loginQry);
			$login_status	= $loginRes['status'];
			if($login_status=="D"){
				// echo "{ success: false, errors: { reason: 'Your account is blocked,you have exceeded the no of attempts' }}";
				$msg = 'Your account is blocked,you have exceeded the no of attempts';
				header("Location: ../index.php?msg=".$msg);
				exit;
			}else{


				if (strtolower(PHP_SHLIB_SUFFIX) === 'dll'){
					$wmi = new COM('winmgmts:{impersonationLevel=impersonate}//./root/cimv2');

					if (!is_object($wmi)) {
						$msg = 'This needs access to WMI. Please enable DCOM';
						header("Location: ../index.php?msg=".$msg);
						exit;
					}


					if(file_exists("../config/mansion.lic")){
					    //decrypt
					    $contents = file_get_contents("../config/mansion.lic");
					    $ugzdata = gzuncompress($contents);
					    $rc4new = new cRc4($ugzdata,$salt);    
					    $dec_data = $rc4new->getProcessedStr( $rc4new->hex2bin( $rc4new->getProcessedStr() ) );

					    if( $dec_data == getFootPrint() ){
					    	$_SESSION['footprint'] = $dec_data ;		    	
					    }else{
							header("Location: ../index.php?msg=".$unlic);
							exit;					    	
					    }		    
					}else{
						header("Location: ../index.php?msg=".$unlic);
						exit;						
					}		
				}


				$userid 	= $loginRes['userid'];
				$username 	= $loginRes['username'];
				$usertype 	= $loginRes['usertype'];
				$customerid 	= $loginRes['customerid'];
				$_SESSION['userid'] 	= $userid;
				$_SESSION['username'] 	= $username;
				$_SESSION['usertype'] 	= $usertype;
				$_SESSION['customerid'] 	= $customerid;
				$_SESSION['cname']=base64_decode(id());
	
				$upQry = "UPDATE users SET loginip = '". $_SERVER['REMOTE_ADDR'] ."' WHERE userid = '".$loginRes['userid']."'";
				$upRes = mysql_query($upQry);
						
				$cQry = "SELECT timezone from customers WHERE customerid = $customerid";
				$cRes = mysql_query($cQry);
				$cRow = mysql_fetch_array($cRes);
				$_SESSION['timzone'] = $cRow['timezone'];
				$_SESSION['loadpage']	= 'devices';
				header("Location: ../cpanel.php");
				exit;
				//echo "{ success: true}";
			}
		}
	}	
}
?>