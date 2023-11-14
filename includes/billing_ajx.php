<?php
/******
 *
 * guests_ajx.php
 *
 ***/
session_start();
// error_reporting(E_ALL);
include_once("../config/dbconn.php");
include_once("../config/constants.php");
include_once("./functions.php");
if( isset($_SESSION) && isset($_SESSION['customerid']) )
	$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_bills_List"){
	$whereStr = "";
	if($_POST['filterText'] && $_POST['filterText']!=''){
		$filterText = $_POST['filterText'];
		// $whereStr = ' WHERE ( guestName like "%'.$filterText.'%" OR ';
		// $whereStr .= ' mobile="'.$filterText.'" OR ';
		// $whereStr .= ' nativePhone="'.$filterText.'" OR ';
		// $whereStr .= ' occupationPhone="'.$filterText.'" OR ';
		// $whereStr .= ' localPhone="'.$filterText.'" OR ';
		// $whereStr .= ' vehicleNo like "%'.$filterText.'%" ) ';
		$whereStr = ' WHERE ( ';
		$whereStr .= ' receiptNo="'.$filterText.'" OR ';
		$whereStr .= ' month like "%'.$filterText.'%" ) ';
		$rentReportsQuery = "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate, DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts $whereStr ORDER BY billDate DESC";
	}elseif ($_POST['guestId'] && $_POST['guestId']!='') {		
		$whereStr = ' WHERE guestId="'.$_POST['guestId'].'"';
		$rentReportsQuery = "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate, DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts $whereStr ORDER BY billDate DESC";
	}elseif ($_POST['searchFor'] && $_POST['searchFor']!='') {
		if($_POST['searchFor']=="Paid"){
			$whereStr = ' WHERE month="'.$_POST['month'].'"';
			// *** Generate List of all Guest who have paid the Rent for the selected month *** 
			$rentReportsQuery = "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate, DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts $whereStr ORDER BY billDate DESC";
		}
	}else{
	// error_reporting(E_ALL);
		// echo $rentReportsQuery = "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate, DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts WHERE month like %date_format((now(),'%b')% ORDER BY billDate DESC";
		$rentReportsQuery = "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate, DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts WHERE month like '%".substr(date("F"), 0,3)."%' ORDER BY billDate DESC";

	}
	/**********
	 * Select only guests staying currently. We can view all guests including vacated guest in reports separately.
	 ***/	
	$rentReportsQry = mysql_query($rentReportsQuery);
/*	$rentReportsQry = mysql_query(
							"SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate,
							DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn 
							FROM receipts 
							$whereStr 
							ORDER BY billDate DESC"
						);*/
	$recCnt = mysql_num_rows($rentReportsQry);
	
	while($rentReportRes = mysql_fetch_array($rentReportsQry )){

		$myData[] = array(
			'receiptId'  	 	=> $rentReportRes['receiptId'],
			'receiptNo'  	 	=> $rentReportRes['receiptNo'],
			'getGuestName'  	 	=> getGuestName($rentReportRes['guestId']),
			'billDate'  => $rentReportRes['billDate'],
			'month'  => $rentReportRes['month'],
			'amount'  => $rentReportRes['amount'],
			'addedOn'  => $rentReportRes['addedOn'],
			'addedBy'   	=> getUserName($rentReportRes['addedBy'])
		);
	}
	$myData = array('BILLS' => $myData, 'totalCount' => $recCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_Receipt"){
	$guestId 	= $_POST['guestId'];
	$guestName 	= $_POST['guestName'];
	$billDate 	= date("Y-m-d",strtotime($_POST['billDate']));  
	$month 	= $_POST['month'];
	$amount 	= $_POST['amount'];
	$address 	= $_POST['address'];
	$vercode  = trim($_POST['text']);
	$verfResult = verification($vercode);
	if($verfResult==0){
		echo "{ success: false,title:'Authentication Failed',msg:'Incorrect Transaction Password'}";
	}else{
		$chkQry	= mysql_query("SELECT * FROM receipts WHERE guestId=$guestId AND month='".$month."'");
		$chkCnt	= mysql_num_rows($chkQry);
		if($chkCnt == 0){
			$roomQry = 'INSERT INTO receipts(billDate,guestId,month,amount,addedBy,addedOn) 
						VALUES( "'.$billDate.'","'.
									$guestId.'","'.
									$month.'","'.
									$amount.'","'.
									$_SESSION['userid'].'","'.
									date('Y-m-d').'")';
	//"'.$roomNo.'","'.$roomCapacity.'")';
			$roomRes = mysql_query($roomQry);
			if($roomRes){
				$receiptId = mysql_insert_id();
				/**
				 * Update no of guests in rooms table
				 **/
				$receiptNo = 'BMA'.$receiptId;
				$updateQry = "UPDATE receipts SET receiptNo='".$receiptNo."' WHERE receiptId='".$receiptId."'";
				$roomRes = mysql_query($updateQry);
				if($roomRes){
					$err1="";
				}else{
					//$error	= mysql_error();
					$err1 = "<br/>But Error while updating Receipt No for Receipt ID: ".$receiptId;
				}
				$mobile = getMobile($guestId);
				if($mobile!="" && strlen($mobile)<=10){
					$strMsg = "Dear ".$_POST['guestName'].", Received the rent for ".$month.". Thanks for your payment.";
					sendReceiptConfirmation($guestId,$mobile,$strMsg);
				}else{
					$err1 .= "<br/>Mobile not in proper format. So SMS not sent";
				}
				echo "{ success: true,msg:'Receipt Saved Successfully.".$receiptNo.".$err1'}";
			}
			else
				echo "{ success: false,msg:'Error while adding new Receipt.'}";
		}else{
			echo "{ success: false,msg:'Receipt for the selected Month <b>$month</b> Already Exists...'}";
		}
	}
}

if($todo == "Get_RentCollection_Details"){
	$startdate 	= $_POST['startdate'];
	$enddate 	= $_POST['enddate'];
	// echo "SELECT count(receiptId) as noOfPaid,SUM(amount) as collectionAmount FROM receipts WHERE billDate BETWEEN '".$startdate."' AND "."'$enddate' ";
	$chkQry	= mysql_query("SELECT count(receiptId) as noOfPaid,SUM(amount) as collectionAmount FROM receipts WHERE billDate BETWEEN '".$startdate."' AND "."'$enddate' ");
	$chkCnt	= mysql_num_rows($chkQry);	
	if($chkCnt>0){
		while($roomRes = mysql_fetch_array($chkQry )){
			// $roomRes = mysql_fetch_array($chkQry);
			$noOfPaid = $roomRes['noOfPaid'];
			$collectionAmount = $roomRes['collectionAmount'];
		}			
		$guestQry	= mysql_query("SELECT * FROM guests WHERE status='S' ");
		$guestCnt	= mysql_num_rows($guestQry);			
		$pendingFrom=0;

		if($noOfPaid < $guestCnt){
			$pendingFrom = $guestCnt - $noOfPaid;
		}
		$msg = $noOfPaid."|*|".$pendingFrom."|*|".$guestCnt."|*|".$collectionAmount;
		echo "{ success: true,msg:'".$msg."'}";
	}else{
		echo "{ success: false, msg:'No Records Found'}";
	}
}

if($todo=="PendingList"){
// SELECT * FROM guests 
// WHERE 
// guestId NOT IN
// (
//     select guestId from receipts WHERE month="Nov 2014" 
// )	
	$whereStr = "";
	if ($_POST['searchFor'] && $_POST['searchFor']!='') {
		if($_POST['searchFor']=="Pending")		
			$whereStr = ' WHERE month="'.$_POST['month'].'"';
		if($whereStr!="")
			$rentReportsQuery = " SELECT * FROM guests WHERE status='S' AND guestId NOT IN ( select guestId from receipts $whereStr )	";

		$rentReportsQry = mysql_query($rentReportsQuery);
		$recCnt = mysql_num_rows($rentReportsQry);

		while($rentReportRes = mysql_fetch_array($rentReportsQry )){

			if($rentReportRes['reasonOfStay']=='B')
				$reasonOfStay = 'Business';
			else if($rentReportRes['reasonOfStay']=='R')
				$reasonOfStay = 'Residence';
			else if($rentReportRes['reasonOfStay']=='S')
				$reasonOfStay = 'Student';
			else if($rentReportRes['reasonOfStay']=='E')
				$reasonOfStay = 'Employee';

		
			$status = ($rentReportRes['status']=='S')?'Staying':'Vacated';

			$myData[] = array(
				'guestId'  	 	=> $rentReportRes['guestId'],
				'guestName'  	 	=> $rentReportRes['guestName'],
				'fatherName'  => $rentReportRes['fatherName'],
				'nativePlace'  => $rentReportRes['nativePlace'],
				'address'  => $rentReportRes['address'],
				'nativePhone'  => $rentReportRes['nativePhone'],
				'permanentAddress'  => $rentReportRes['permanentAddress'],
				'permanentPhone'  => $rentReportRes['permanentPhone'],
				'localAddress'  => $rentReportRes['localAddress'],
				'localPhone'  => $rentReportRes['localPhone'],
				'occupation'  => $rentReportRes['occupation'],
				'occupationPhone'  => $rentReportRes['occupationPhone'],
				'mobile'  => $rentReportRes['mobile'],
				'lastResidenceAddress'  => $rentReportRes['lastResidenceAddress'],
				'lastResidencePhone'  => $rentReportRes['lastResidencePhone'],
				'reasonOfStay'  => $reasonOfStay,
				'joiningDate'   	=> $rentReportRes['joiningDate'],
				'vacatingDate'   	=> ($rentReportRes['vacatingDate']=='00/00/0000')?"":$rentReportRes['vacatingDate'],
				'advanceAmount'   	=> $rentReportRes['advanceAmount'],
				'advanceDate'   	=> $rentReportRes['advanceDate'],
				'roomNo'   	=>  getRoomNo($rentReportRes['roomId']),
				'vehicleNo'   	=> $rentReportRes['vehicleNo'],
				'status'   	=> $status,
				'comments'   	=> $rentReportRes['comments']
			);
		}
		$myData = array('GUESTS' => $myData, 'totalCount' => $recCnt);
		header('Content-Type: application/x-json');
	    echo json_encode($myData);

	}


}



/*************
 *
 * XL Reports
 *
 ********/

/**
 * Generate List of all Guest who haven't paid the Rent for the selected month
 */
if($_REQUEST['todo'] == 'GenXL_PendingGuestsList'){
	$whereStr = "";
	$rentReportsQuery = "";

	if ($_REQUEST['searchFor'] && $_REQUEST['searchFor']!='') {
		if($_REQUEST['searchFor']=="Pending"){		
			$whereStr = ' WHERE month="'.$_REQUEST['month'].'"';
			$filename	= $_REQUEST['month']."_pending_list".".xlsx"; //$_REQUEST['month'].
			$rentReportsQuery = " SELECT * FROM guests WHERE status='S' AND guestId NOT IN ( select guestId from receipts $whereStr )	";
		}
	}
	$rentReportsQry = mysql_query($rentReportsQuery);
	$recCnt = mysql_num_rows($rentReportsQry);

	if($recCnt == 0){
		echo '{ success: false,Msg:"No Matching records Found"}';
	}else{		
		require_once('../PHPExcel.php');
		require_once('../PHPExcel/Reader/Excel2007.php');
		require_once '../PHPExcel/IOFactory.php';
		ini_set("memory_limit", "2000M");
		//Execution Time unlimited
		set_time_limit (0);

		$objPHPExcel = new PHPExcel();
		// Set properties
		//echo date('H:i:s') . " Set properties\n";
		$objPHPExcel->getProperties()->setCreator("Mansion Management Systems by AmoFly")
			 ->setLastModifiedBy("Mansion Management Systems")
			 ->setTitle("Pending Rent payment Guests Report")
			 ->setSubject("Pending Rent payment Guests Report")
			 ->setDescription("Guests details who have not yet paid the rent")
			 ->setKeywords("office 2007 openxml php")
			 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A1', "#");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(4);
		$objPHPExcel->getActiveSheet()->setCellValue('B1', "Guest Name");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C1', "Room No");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(9);
		$objPHPExcel->getActiveSheet()->setCellValue('D1', "Mobile");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('E1', "Occupation");
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);
		$objPHPExcel->getActiveSheet()->setCellValue('F1', "Occupation Phone");
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(18);
		$objPHPExcel->getActiveSheet()->setCellValue('G1', "Joining Date");
		$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('H1', "Vacated Date");
		$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('I1', "Reason Of Stay");
		$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(19);
		$objPHPExcel->getActiveSheet()->setCellValue('J1', "Vehicle No");
		$objPHPExcel->getActiveSheet()->getColumnDimension('J')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('K1', "Status");
		$objPHPExcel->getActiveSheet()->getColumnDimension('K')->setWidth(14);

		$rowno = 1;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A1:K1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		// $objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_BLUE);
		$objPHPExcel->getActiveSheet()->getStyle('A1:K1')->getFill()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'839ebf')));
		$objPHPExcel->getActiveSheet()->getStyle('A1:K1')->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);		
		$objPHPExcel->getActiveSheet()->getStyle('A1:K1'.$rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(16);


		while($rentReportRes = mysql_fetch_array($rentReportsQry )){

			$rowno++;

			if($rentReportRes['reasonOfStay']=='B')
				$reasonOfStay = 'Business';
			else if($rentReportRes['reasonOfStay']=='R')
				$reasonOfStay = 'Residence';
			else if($rentReportRes['reasonOfStay']=='S')
				$reasonOfStay = 'Student';
			else if($rentReportRes['reasonOfStay']=='E')
				$reasonOfStay = 'Employee';

		
			$status = ($rentReportRes['status']=='S')?'Staying':'Vacated';

			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":K".$rowno."'")->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":K".$rowno."'")->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle('B' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $rowno-1);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $rentReportRes['guestName']);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, getRoomNo($rentReportRes['roomId']));
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno,  $rentReportRes['mobile']);
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $rowno,  $rentReportRes['occupation']);
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $rowno,  $rentReportRes['occupationPhone']);
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $rowno,  $rentReportRes['joiningDate']);
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $rowno,  ($rentReportRes['vacatingDate']=='00/00/0000')?"":$rentReportRes['vacatingDate']);
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $rowno, $reasonOfStay);
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $rowno,  $rentReportRes['vehicleNo']);
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $rowno,  $status);

		}

		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename='.$filename);
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');			
	}

}


/**
 * Generate List of all Guest who have paid the Rent for the selected month
 * 
 */
if($_REQUEST['todo'] == 'GenXL_PaidGuestsList'){
	$whereStr = "";
	if ($_REQUEST['searchFor'] && $_REQUEST['searchFor']!='') {
		if($_REQUEST['searchFor']=="Paid"){		
			$whereStr = ' WHERE month="'.$_REQUEST['month'].'"';
			$filename	= $_REQUEST['month']."_paid_list".".xlsx"; //$_REQUEST['month'].
		}
	}
	/**********
	 * Select only guests staying currently. We can view all guests including vacated guest in reports separately.
	 ***/	
	// echo "SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate,DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn FROM receipts $whereStr ORDER BY billDate DESC";

	$roomQry = mysql_query(
							"SELECT *,DATE_FORMAT(billDate,'%d/%m/%Y') as billDate,
							DATE_FORMAT(addedOn,'%d/%m/%Y') as addedOn 
							FROM receipts 
							$whereStr 
							ORDER BY billDate DESC"
						);
	$roomsCnt = mysql_num_rows($roomQry);

	if($roomsCnt == 0){
		echo '{ success: false,Msg:"No Matching records Found"}';
	}else{		
		require_once('../PHPExcel.php');
		require_once('../PHPExcel/Reader/Excel2007.php');
		require_once '../PHPExcel/IOFactory.php';
		ini_set("memory_limit", "2000M");
		//Execution Time unlimited
		set_time_limit (0);

		$objPHPExcel = new PHPExcel();
		// Set properties
		//echo date('H:i:s') . " Set properties\n";
		$objPHPExcel->getProperties()->setCreator("Mansion Management Systems by AmoFly")
			 ->setLastModifiedBy("Mansion Management Systems")
			 ->setTitle("Guests Report")
			 ->setSubject("Guests Report")
			 ->setDescription("Guests details based on the Staying Status")
			 ->setKeywords("office 2007 openxml php")
			 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A1', "#");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(4);
		$objPHPExcel->getActiveSheet()->setCellValue('B1', "Receipt No");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(20);
		$objPHPExcel->getActiveSheet()->setCellValue('C1', "Due Date");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(11);
		$objPHPExcel->getActiveSheet()->setCellValue('D1', "Guest Name");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(19);
		$objPHPExcel->getActiveSheet()->setCellValue('E1', "Month");
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(12);
		$objPHPExcel->getActiveSheet()->setCellValue('F1', "Amount");
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(9);
		$objPHPExcel->getActiveSheet()->setCellValue('G1', "Billed By");
		$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('H1', "Bill Date");
		$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(14);

		$rowno = 1;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A1:H1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		// $objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_BLUE);
		$objPHPExcel->getActiveSheet()->getStyle('A1:H1')->getFill()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'839ebf')));
		$objPHPExcel->getActiveSheet()->getStyle('A1:H1')->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);		
		$objPHPExcel->getActiveSheet()->getStyle('A1:H1'.$rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(16);


		while($roomRes = mysql_fetch_array($roomQry )){

			$rowno++;

			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":H".$rowno."'")->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":H".$rowno."'")->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle('B' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
			$objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
			$objPHPExcel->getActiveSheet()->getStyle('F' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);

			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $rowno-1);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $roomRes['receiptNo']);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $roomRes['billDate']);
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno,  getGuestName($roomRes['guestId']));
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $rowno,  $roomRes['month']);
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $rowno,  $roomRes['amount']);
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $rowno,  getUserName($roomRes['addedBy']));
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $rowno,  $roomRes['addedOn']);

		}
		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename='.$filename);
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');				
	}

}


?>