<?php
/******
 *
 * rooms_ajx.php
 *
 ***/
session_start();
if( isset($_SESSION) && !isset($_SESSION['footprint']) ){
	?>
	<script type="text/javascript">
	window.location.href='../logout.php';
	</script>
	<?
	exit;
}
error_reporting(0);
include_once("../config/dbconn.php");
include_once("./functions.php");
if( isset($_SESSION) && isset($_SESSION['customerid']) )
	$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_Rooms_List"){
	$roomStatus	= $_POST['roomStatus'];
	if($roomStatus == '')
		$where = "";
	else if($roomStatus == 'E')
		$where = " WHERE noOfGuests = 0 ";
	else if($roomStatus == 'P')
		$where = " WHERE noOfGuests < roomCapacity AND noOfGuests >0 ";
	else if($roomStatus == 'F')
		$where = " WHERE noOfGuests = roomCapacity ";

	
	$roomQry = mysql_query("SELECT roomId,roomNo,roomCapacity,roomStatus,noOfGuests FROM rooms $where ORDER BY roomNo ASC");
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


if($todo == "Add_Room"){
	$roomNo			= $_POST['roomNo'];
	$roomCapacity 	= $_POST['roomCapacity'];

	$chkQry	= mysql_query("SELECT * FROM rooms WHERE roomNo='".$roomNo."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$roomQry = 'INSERT INTO rooms(roomNo, roomCapacity) VALUES("'.$roomNo.'","'.$roomCapacity.'")';
		$roomRes = mysql_query($roomQry);
		if($roomRes){
			/***
			 *
			 * Create new table specific to this customer for managing his devices
			 *
			 ****/
			echo "{ success: true,msg:'Room <b>$roomNo</b> Added Successfully.'}";
		}
		else
			echo "{ success: false,msg:'Error while adding new Room.'}";
	}else{
		echo "{ success: false,msg:'Room Number <b>$roomNo</b> Already Exists.'}";
	}
}

if($todo == "Edit_Room"){
	$roomId		= $_POST['roomId'];
	$roomNo			= $_POST['roomNo'];
	$roomCapacity 	= $_POST['roomCapacity'];
		

	$chkQry	= mysql_query("SELECT * FROM rooms WHERE roomNo='".$roomNo."' AND roomId!='".$roomId."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$roomQry = 'UPDATE rooms SET
						roomNo 			= "'.$roomNo.'",
						roomCapacity 	= "'.$roomCapacity.'"
						WHERE roomId= "'.$roomId.'"';
		$roomRes = mysql_query($roomQry);
		if($roomRes){
			echo "{ success: true,msg:'<b>$roomNo</b> Updated Successfully'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating Room No $roomNo.'.mysql_error()}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other Room with the same  <b>$roomNo</b> Exists.'}";
	}
}

if($todo == "Delete_Room"){
	$roomId		= $_POST['roomId'];
	$roomNo	= $_POST['roomNo'];
	$chkQry	= mysql_query("SELECT * FROM rooms WHERE roomNo='".$roomNo."' AND roomId='".$roomId."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$customerQry = "DELETE FROM rooms WHERE roomNo='".$roomNo."' AND roomId='".$roomId."'";
		$customerRes = mysql_query($customerQry);
		if(!mysql_error()){
			/****
			 *
			 * Delete other details etc
			 *
			 ***/
		}
		if($customerRes){
			echo "{ success: true,msg:'Room <b>$roomNo</b> Deleted Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while deleting Room $roomNo'}";
		}
	}else{
		echo "{ success: false,msg:'The Room <b>$roomNo</b> does not Exist.'}";
	}
}



if($_REQUEST['todo'] == 'GenXL_RoomsList'){
	$rStatus="";
	$rStatus = $_REQUEST['roomStatus'];

	if($rStatus == '' || $rStatus == 'A')
		$where = "";
	else if($rStatus == 'E')
		$where = " WHERE noOfGuests = 0 ";
	else if($rStatus == 'P')
		$where = " WHERE noOfGuests < roomCapacity AND noOfGuests >0 ";
	else if($rStatus == 'F')
		$where = " WHERE noOfGuests = roomCapacity ";

	// echo "SELECT roomId,roomNo,roomCapacity,roomStatus,noOfGuests FROM rooms $where ORDER BY roomNo ASC";
	$roomQry = mysql_query("SELECT roomId,roomNo,roomCapacity,roomStatus,noOfGuests FROM rooms $where ORDER BY roomNo ASC");
	$roomsCnt = mysql_num_rows($roomQry);

	if($roomsCnt == 0){
		echo '{ success: false,Msg:"No Matching Rooms Founds"}';
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
			 ->setTitle("Rooms Status")
			 ->setSubject("Rooms Status")
			 ->setDescription("Rooms Status details based on the noOfGuests")
			 ->setKeywords("office 2007 openxml php")
			 ->setCategory("Export");
		$objPHPExcel->setActiveSheetIndex(0);
		$objPHPExcel->getActiveSheet()->setCellValue('A1', "#");
		$objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(4);
		$objPHPExcel->getActiveSheet()->setCellValue('B1', "Room No");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(9);
		$objPHPExcel->getActiveSheet()->setCellValue('C1', "Room Capacity");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(14);
		$objPHPExcel->getActiveSheet()->setCellValue('D1', "Room Status");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);
		$objPHPExcel->getActiveSheet()->setCellValue('E1', "No Of Guests");
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(14);

		$rowno = 1;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		// $objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_BLUE);
		$objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'839ebf')));
		$objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);		
		$objPHPExcel->getActiveSheet()->getStyle('A1:E1'.$rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(16);

		while($roomRes = mysql_fetch_array($roomQry )){
			$rowno++;
			// echo $roomRes['roomNo']." test ".$roomRes['noOfGuests'];
			if($roomRes['noOfGuests']==0){
				$objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_RED);
				$roomStatus = 'Empty';
			}
			else if($roomRes['noOfGuests'] < $roomRes['roomCapacity'] ){
				$objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_YELLOW);
				// $objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getFont()->getColor()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'FEA725')));
				$roomStatus = 'Partial';
			}
			else{
				$objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getFont()->getColor()->setARGB(PHPExcel_Style_Color::COLOR_GREEN);
				// $objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getFont()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'#008000')));
				$roomStatus = 'Full';
			}
			// echo $roomStatus;
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":E".$rowno."'")->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":E".$rowno."'")->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);

			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $rowno-1);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $roomRes['roomNo']);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, $roomRes['roomCapacity']);
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno, $roomStatus);
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $rowno,  $roomRes['noOfGuests']);
		}
	}


	$filename	= "RoomStatus_".date("d.m.Y").".xlsx";

	$objPHPExcel->setActiveSheetIndex(0);
	header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	header('Content-Disposition: attachment;filename='.$filename);
	header('Cache-Control: max-age=0');
	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
	$objWriter->save('php://output');
}

?>