<?php
session_start();
error_reporting(0);
include_once("../config/dbconn.php");
include_once("./functions.php");
if( isset($_SESSION) && isset($_SESSION['customerid']) )
	$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_Rooms_List"){
/*	//$devtype	= $_POST['devtype'];
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND vh.customerid='".$customerid."'";*/
	
	$roomQry = mysql_query("SELECT roomId,roomNo,roomCapacity,roomStatus,noOfGuests FROM rooms ORDER BY roomNo ASC");
	$roomsCnt = mysql_num_rows($roomQry);
	while($roomRes = mysql_fetch_array($roomQry )){

/*		if($ignition=="OFF")
			$ignition	= '<img src="./images/engineoff.png" title="Engine is Off"/>'; //<span style="color:red;font-weight:bold">'.$ignition.'</span>';
		else
			$ignition	= '<img src="./images/engineon.gif" title="Engine is On"/>'; //<span style="color:green;font-weight:bold">'.$ignition.'</span>';*/
		
		if($roomRes['noOfGuests']==0){
			$roomStatus = '<span style="color:red;font-weight:bold">Empty</span>';
		}
		else if($roomRes['noOfGuests'] < $roomRes['roomCapacity'] ){
			$roomStatus = '<span style="color:orange;font-weight:bold">Partial</span>';
		}
		else{
			$roomStatus = '<span style="color:green;font-weight:bold">Full</span>';
		}

		$myData[] = array(
			'roomId'  	 	=> $roomRes['roomId'],
			'roomNo'  	 	=> $roomRes['roomNo'],
			'roomCapacity'  => $roomRes['roomCapacity'],
			'roomStatus'   	=> $roomStatus,
			'noOfGuests'   	=> $roomRes['noOfGuests']
		);
	}
	$myData = array('ROOMS' => $myData, 'totalCount' => $roomsCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}


if($todo == "Get_Expenses_Today"){
/*	//$devtype	= $_POST['devtype'];
	if($customerid == '3')
		$cust_qry = "";
	else
		$cust_qry = "AND vh.customerid='".$customerid."'";*/

	$totQry	= mysql_query("SELECT * FROM expenses");
	$totCnt	= mysql_num_rows($totQry);

	//$myData[] = array();

	if($totCnt == 0){
		$myData[] = array(
			'expensesId'  	 => 0,			
			'CustomerInfo'   => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{		
		$qry = 'SELECT e.expensesId,DATE_FORMAT(e.date,"%d/%m/%Y") expdate, e.accountHeadId, e.amount, ac.accountHeadName, ac.accountHeadId 
		FROM expenses e,accountheads ac 
		WHERE e.date="'.date('Y-m-d').'" AND e.accountHeadId=ac.accountHeadId';

		$roomQry = mysql_query($qry);
		$roomsCnt = mysql_num_rows($roomQry);
		if($roomsCnt == 0){
			$myData[] = array(
				'expensesId'  	 => 0,			
				'accountHead'   => "<span class='tableTextM'>No Expenses Found for Today</span>"
			);
		}else{			
			while($roomRes = mysql_fetch_array($roomQry )){

				$myData[] = array(
					'expensesId'  	 	=> $roomRes['expensesId'],
					'accountHead'  	 	=> $roomRes['accountHeadName'],
					'amount'  => $roomRes['amount']
				);
			}
		}
	}
	$myData = array('EXPENSES' => $myData, 'totalCount' => $roomsCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}


if($todo == "Change_Password"){
	$old_pwd = $_POST['old_pwd'];
	$new_pwd = $_POST['new_pwd'];
	//$cnfm_pwd = $_POST['cnfmpwd'];
	$userid = $_SESSION['userid'];
	$customerid = $_SESSION['customerid'];
	/* $pwd_qry = mysql_query("SELECT password FROM users where userid='".$userid."'");
	$pwd_res = mysql_fetch_array($pwd_qry);
	$db_pwd	= $pwd_res['password']; */
	$chng_qry =  mysql_query("SELECT * FROM users where userid='".$userid."' AND password=PASSWORD('".$old_pwd."')");
	$chng_cnt = mysql_num_rows($chng_qry);
	if($chng_cnt == 0){
		echo "{ success: false,msg:'Your Current Password is INCORRECT..<br>Please enter correct password.'}";
	}
	else{
		$pwd_update_qry = mysql_query("UPDATE users SET	password=PASSWORD('".$new_pwd."') WHERE userid='".$userid."'");
		if($pwd_update_qry)
			echo "{success: true,msg:'Password Successfully changed'}";
	}
} 


?>