<?
/**
 * expenses_ajx.php
 *
 *
 */
session_start();
error_reporting(0);
//error_reporting(E_ALL);
if(!isset($_SESSION['username']) || !isset($_SESSION['userid']) ){
    //echo "Not authenticated.....";
    header("location: ./login.php");
    exit;
}

require_once("../config/dbconn.php");
require_once("./functions.php");
//loadTables();
$todo = $_POST['todo'];

if($todo=="AccountHead_List"){
	$aheadQry = mysql_query("SELECT * FROM accountheads ORDER BY accountHeadName");
	$aheadCnt = mysql_num_rows($aheadQry);
	if($aheadCnt==0){
		$myData[] = array(
			'accountHeadId' 	=> "",
			'accountHeadName' => "<span class='tableTextM'>No Records Found</span>"
		);
	}else{
		while($aheadRes = mysql_fetch_array($aheadQry)){
			$myData[] = array(
				'accountHeadId' 	=> $aheadRes['accountHeadId'],
				'accountHeadName' => $aheadRes['accountHeadName']
			);
		}
	}
	$myData = array('AHEAD' => $myData, 'totalCount' => $aheadCnt);
	echo json_encode($myData);
}

if($todo=="Add_AccountHead"){
	$accountHeadName = $_POST['accountHeadName'];
	
	$aheadQry = mysql_query("SELECT * FROM accountheads WHERE accountHeadName='".$accountHeadName."'");
	$aheadCnt = mysql_num_rows($aheadQry);
	if($aheadCnt>0){
		echo "{ success: false,Msg:'Account Head \"$accountHeadName\" already exists'}";
	}else{
		$insQry = mysql_query("INSERT INTO accountheads(accountHeadName) VALUES('".$accountHeadName."')");
		if($insQry)
			echo "{ success: true,Msg:'Account Head \"$accountHeadName\" Added Successfully'}";
		else
			echo "{ success: false,Msg:".mysql_error()."}";
	}
}

if($todo == "Update_AccountHead"){
	$accountHeadId 	= $_POST['accountHeadId'];
	$accountHeadName  = $_POST['accountHeadName'];
		
	$aheadQry = mysql_query("SELECT * FROM accountheads WHERE accountHeadId!='".$accountHeadId."' AND accountHeadName='".$accountHeadName."'");
	$aheadCnt = mysql_num_rows($aheadQry);
	if($aheadCnt>0){
		echo "{ success: false,Msg:'Account Head \"$accountHeadName\" already exists'}";
	}else{
		$insQry = mysql_query("UPDATE accountheads SET accountHeadName='".$accountHeadName."' WHERE accountHeadId='".$accountHeadId."'");
		if($insQry)
			echo "{ success: true,Msg:'Account Head \"$accountHeadName\" Updated Successfully'}";
		else
			echo "{ success: false,Msg:".mysql_error()."}";
	}
}

if($todo == "Delete_AccountHead"){
	$accountHeadId 	= $_POST['accountHeadId'];
	$aheadQry = mysql_query("SELECT * FROM accountheads WHERE accountHeadId='".$accountHeadId."'");
	$aheadCnt = mysql_num_rows($aheadQry);
	if($aheadCnt>0){
		$aheadRes = mysql_fetch_array($aheadQry);
		$accountHeadName = $aheadRes['accountHeadName'];
		$vercode  = trim($_POST['text']);
		$verfResult = verification($vercode);
		if($verfResult==0){
			echo "{ success: false,title:'Authentication Failed',Msg:'Incorrect Transaction Password'}";
		}else{
			$expenseQry = mysql_query("SELECT * FROM expenses WHERE accountHeadId='".$accountHeadId."'");
			$expenseCnt = mysql_num_rows($expenseQry);
			if($expenseCnt>0){
				echo "{ success: false,title:'Cannot Delete',Msg:'Expenses found under this Account Head'}";
			}else{
				$delQry = mysql_query("DELETE FROM accountheads WHERE accountHeadId='".$accountHeadId."'");
				if($delQry){
					echo "{ success: true,Msg:'Account Head \"$accountHeadName\" Deleted Successfully'}";
				}else{
					echo "{ success: false,title:'Mysql Error',Msg:".mysql_error()."}";
				}
			}
		}
	}else{
		echo "{ success: false,title:'Not Exists',Msg:'Selected Account Head not found'}";
	}
}
/***************** Transactions Section ************************************/
if($todo=="Get_Expenses_List"){
	
    $start = $_POST['start'];
    $limit = $_POST['limit'];
    if($_POST['scexdate'] && $_POST['scexdate']!='')
    	$scexdate = date("Y-m-d",strtotime($_POST['scexdate']));
    else
    	$scexdate = date("Y-m-d");

    if($_POST['acchead'] && $_POST['acchead']!=''){
    	$accountHeadId = $_POST['acchead'];
    	$joinQry = " AND accountHeadId='".$accountHeadId."'";
    }else{
    	$joinQry="";
    }

	//echo "SELECT * FROM expenses WHERE jdate='".$scexdate."' $joinQry $bidQry ORDER BY jdate,accountHeadId DESC";

    $totQry = mysql_query("SELECT * FROM expenses WHERE date='".$scexdate."' $joinQry  ORDER BY date,accountHeadId DESC");
    $totCnt = mysql_num_rows($totQry);
	//echo "SELECT * FROM expenses WHERE date='".$scexdate."' $joinQry ORDER BY date,accountHeadId DESC LIMIT $start,$limit";
    $expenseQry = mysql_query("SELECT * FROM expenses WHERE date='".$scexdate."' $joinQry ORDER BY date,accountHeadId DESC LIMIT $start,$limit");
    $expenseCnt = mysql_num_rows($expenseQry);

    while($expRes = mysql_fetch_array($expenseQry)){
    	//echo date("d-m-Y",strtotime(expRes['jdate']));
    	//echo "ok";
        $myData[] = array(
               'expensesId'	=> $expRes['expensesId'],
               'accountHeadId'	=> $expRes['accountHeadId'],
               'accountHeadName'=> gAccHeads($expRes['accountHeadId'],'accountHeadId','accountHeadName'),
               'date'		=> date("d-m-Y",strtotime($expRes['date'])),
               'description'		=> stripcslashes($expRes['description']),
               'amount'		=> $expRes['amount'],
               'addedBy'		=> getUserName($expRes['addedBy']),
               'addedOn'		=> date("d-m-Y",strtotime($expRes['addedOn'])),
            );
    }

    if($totCnt==0){
        $myData[] = array(
            'expensesId'    => "",
            'accountHeadName'    => "<span class='tableTextM'>No Records Found</span>"
        );
    }

    $myData = array('EXPENSES' => $myData, 'totalCount' => $totCnt);
    echo json_encode($myData);
}

if($todo=="Add_Expense"){

	$accountHeadId 	= $_POST['accountHeadId'];
	$expdate   	= $_POST['date'];
	$expdesc	= $_POST['description'];
	$expamount	= $_POST['amount'];
	// echo "INSERT INTO expenses(accountHeadId,date,description,amount,addedBy,addedOn) 
	// 					VALUES('".$accountHeadId."','".$expdate."','".$expdesc."','".$expamount."',
	// 					'".$_SESSION['userid']."','".date("Y-m-d")."')";
	$insQry = mysql_query("INSERT INTO expenses(accountHeadId,date,description,amount,addedBy,addedOn) 
						VALUES('".$accountHeadId."','".$expdate."','".$expdesc."','".$expamount."',
						'".$_SESSION['userid']."','".date("Y-m-d")."')");
	if($insQry){
		echo "{ success: true,Msg:'Expenses Added Successfully'}";
	}else{
		echo "{ success: false,Msg:".mysql_error()."}";
	}	
}


if($todo=="Edit_Expense"){
	$expensesId = $_POST['expensesId'];
	
	$accheadid 	= $_POST['accountHeadId'];
	$expdate   	= date("Y-m-d",strtotime($_POST['date']));
	$expdesc	= addslashes($_POST['description']);
	$expamount	= $_POST['amount'];

	$upQry = mysql_query("UPDATE expenses SET 
						accountHeadId='".$accheadid."',
						date='".$expdate."',
						description='".$expdesc."',
						amount='".$expamount."'
						WHERE expensesId='".$expensesId."'");
	if($upQry){
		echo "{ success: true,Msg:'Expense Updated Successfully'}";
	}else{
		echo "{ success: false,Msg:".mysql_error()."}";
	}	
}

if($todo=="Delete_Expense"){
	$expensesId = $_POST['expensesId'];
	$expQry = mysql_query("SELECT expensesId FROM expenses WHERE expensesId='".$expensesId."'");
	$expCnt = mysql_num_rows($expQry);
	if($expCnt>0){
		$vercode  = trim($_POST['text']);
		$verfResult = verification($vercode);
		if($verfResult==0){
			echo "{ success: false,title:'Authentication Failed',Msg:'Incorrect Transaction Password'}";
		}else{
			$delQry = mysql_query("DELETE FROM expenses WHERE expensesId='".$expensesId."'");
			if($delQry){
				echo "{ success: true,Msg:'Selected Expense Deleted Successfully'}";
			}else{
				echo "{ success: false,title:'Mysql Error',Msg:".mysql_error()."}";
			}
		}
	}else{
		echo "{ success: false,title:'Not Found',Msg:'Selected Expense not found'}";
	}
}
/************ Reports *************/
if($todo=="Get_Expenses_Report"){
	
    $start = $_POST['start'];
    $limit = $_POST['limit'];
    if($_POST['startdate'] && $_POST['startdate']!='')
    	$startdate = date("Y-m-d",strtotime($_POST['startdate']));
    else
    	$startdate = date("Y-m-d");

    if($_POST['enddate'] && $_POST['enddate']!='')
    	$enddate = date("Y-m-d",strtotime($_POST['enddate']));
    else
    	$enddate = date("Y-m-d");    

    if($_POST['acchead'] && $_POST['acchead']!=''){
    	$accountHeadId = $_POST['acchead'];
    	$joinQry = " AND accountHeadId='".$accountHeadId."'";
    }else{
    	$joinQry="";
    }

	// echo "SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry  ORDER BY date,accountHeadId DESC";

    $totQry = mysql_query("SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry  ORDER BY date,accountHeadId DESC");
    $totCnt = mysql_num_rows($totQry);
	//echo "SELECT * FROM expenses WHERE date='".$scexdate."' $joinQry ORDER BY date,accountHeadId DESC LIMIT $start,$limit";
    $expenseQry = mysql_query("SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry ORDER BY date,accountHeadId DESC LIMIT $start,$limit");
    $expenseCnt = mysql_num_rows($expenseQry);

    while($expRes = mysql_fetch_array($expenseQry)){
    	//echo date("d-m-Y",strtotime(expRes['jdate']));
    	//echo "ok";
        $myData[] = array(
               'expensesId'	=> $expRes['expensesId'],
               'accountHeadId'	=> $expRes['accountHeadId'],
               'accountHeadName'=> gAccHeads($expRes['accountHeadId'],'accountHeadId','accountHeadName'),
               'date'		=> date("d-m-Y",strtotime($expRes['date'])),
               'description'		=> stripcslashes($expRes['description']),
               'amount'		=> $expRes['amount'],
               'addedBy'		=> getUserName($expRes['addedBy']),
               'addedOn'		=> date("d-m-Y",strtotime($expRes['addedOn'])),
            );
    }

    if($totCnt==0){
        $myData[] = array(
            'expensesId'    => "",
            'accountHeadName'    => "<span class='tableTextM'>No Records Found</span>"
        );
    }

    $myData = array('EXPENSES' => $myData, 'totalCount' => $totCnt);
    echo json_encode($myData);
}


if($_REQUEST['todo'] == "GenXL_Get_Expenses_Report"){
	
     if($_REQUEST['startdate'] && $_REQUEST['startdate']!='')
    	$startdate = date("Y-m-d",strtotime($_REQUEST['startdate']));
    else
    	$startdate = date("Y-m-d");

    if($_REQUEST['enddate'] && $_REQUEST['enddate']!='')
    	$enddate = date("Y-m-d",strtotime($_REQUEST['enddate']));
    else
    	$enddate = date("Y-m-d");    

    if($_REQUEST['acchead'] && $_REQUEST['acchead']!='' && $_REQUEST['acchead']!='undefined'){
    	$accountHeadId = $_REQUEST['acchead'];
    	$joinQry = " AND accountHeadId='".$accountHeadId."'";
    }else{
    	$joinQry="";
    }

    $filename = "expenses_".date("d-m-Y",strtotime($startdate)).".to.".date("d-m-Y",strtotime($enddate)).".xlsx";

	// echo "SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry  ORDER BY date,accountHeadId DESC";

    $totQry = mysql_query("SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry  ORDER BY date,accountHeadId DESC");
    $totCnt = mysql_num_rows($totQry);
	//echo "SELECT * FROM expenses WHERE date='".$scexdate."' $joinQry ORDER BY date,accountHeadId DESC LIMIT $start,$limit";
    $expenseQry = mysql_query("SELECT * FROM expenses WHERE date BETWEEN '".$startdate."' AND '".$enddate."' $joinQry ORDER BY date,accountHeadId DESC");
    $expenseCnt = mysql_num_rows($expenseQry);

	if($totCnt == 0){
		echo '{ success: false,Msg:"No Matching Records Found"}';
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
		$objPHPExcel->getActiveSheet()->setCellValue('B1', "Date");
		$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(13);
		$objPHPExcel->getActiveSheet()->setCellValue('C1', "Account Head");
		$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(19);
		$objPHPExcel->getActiveSheet()->setCellValue('D1', "Description");
		$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
		$objPHPExcel->getActiveSheet()->setCellValue('E1', "Amount");
		$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(13);
		$objPHPExcel->getActiveSheet()->setCellValue('F1', "Entered By");
		$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(13);
		$objPHPExcel->getActiveSheet()->setCellValue('G1', "Entered On");
		$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(13);

		$rowno = 1;
		//Color for the Header
		$objPHPExcel->getActiveSheet()->getStyle('A1:G1')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
		// $objPHPExcel->getActiveSheet()->getStyle('A1:E1')->getFill()->getStartColor()->setARGB(PHPExcel_Style_Color::COLOR_BLUE);
		$objPHPExcel->getActiveSheet()->getStyle('A1:G1')->getFill()->applyFromArray(array('type' => PHPExcel_Style_Fill::FILL_SOLID,'startcolor' => array('rgb' =>'839ebf')));
		$objPHPExcel->getActiveSheet()->getStyle('A1:G1')->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);		
		$objPHPExcel->getActiveSheet()->getStyle('A1:G1'.$rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
		$objPHPExcel->getActiveSheet()->getRowDimension('1')->setRowHeight(16);		

		while($expRes = mysql_fetch_array($expenseQry)){
			$rowno++;
		
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":G".$rowno."'")->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":G".$rowno."'")->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			// $objPHPExcel->getActiveSheet()->getStyle('B' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
			$objPHPExcel->getActiveSheet()->getStyle('D' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
			$objPHPExcel->getActiveSheet()->getStyle('E' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_RIGHT);
			// $objPHPExcel->getActiveSheet()->getStyle('G' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $rowno-1);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, date("d-m-Y",strtotime($expRes['date'])) );
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, gAccHeads($expRes['accountHeadId'],'accountHeadId','accountHeadName') );
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno,  stripcslashes($expRes['description']) );
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $rowno,  number_format($expRes['amount'],2, '.', '') );	// english notation without thousands separator
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $rowno,  getUserName($expRes['addedBy']) );
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $rowno,  date("d-m-Y",strtotime($expRes['addedOn'])) );
		}
	}

		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename='.$filename);
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');		
}
?>