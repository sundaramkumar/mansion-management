<?php
/******
 *
 * guests_ajx.php
 *
 ***/
session_start();
error_reporting(0);
include_once("../config/dbconn.php");
include_once("./functions.php");

if( isset($_SESSION) && isset($_SESSION['customerid']) )
	$customerid = $_SESSION['customerid'];

$todo = $_POST['todo'];
if($todo == "Get_Guests_List"){
	$whereStr = "";
	if($_POST['filterText'] && $_POST['filterText']!=''){
		$filterText = $_POST['filterText'];
		$whereStr = " WHERE status='S' AND ( guestName like '%".$filterText."%' OR ";
		$whereStr .= ' mobile="'.$filterText.'" OR ';
		$whereStr .= ' nativePhone="'.$filterText.'" OR ';
		$whereStr .= ' occupationPhone="'.$filterText.'" OR ';
		$whereStr .= ' occupation like "%'.$filterText.'%" OR ';
		$whereStr .= ' localPhone="'.$filterText.'" OR ';
		$whereStr .= ' vehicleNo like "%'.$filterText.'%" ) ';
	}elseif ($_POST['filterRoom'] && $_POST['filterRoom']!='') {		
		$whereStr = " WHERE status='S' AND roomId='".$_POST['filterRoom']."'";
	}elseif($_POST['searchFor'] && $_POST['searchFor']!=''){
		$searchFor = $_POST['searchFor'];
		$startdate = $_POST['startdate'];
		$enddate = $_POST['enddate'];
		if($searchFor=="Vacated"){
			$whereStr = " WHERE status='V' AND vacatingDate BETWEEN  '$startdate' AND '$enddate'  ";
		}elseif($searchFor=="Staying"){
			$whereStr = " WHERE status='S' AND vacatingDate='00/00/0000' ";
		}elseif($searchFor=="New"){
			$whereStr = " WHERE status='S' AND vacatingDate='00/00/0000' AND joiningDate BETWEEN '$startdate' AND '$enddate'  ";
		}
	}else{
		$whereStr = " WHERE status='S' ";
	}
	/**********
	 * Select only guests staying currently. We can view all guests including vacated guest in reports separately.
	 ***/	
	//echo "SELECT *,DATE_FORMAT(joiningDate,'%d/%m/%Y') as joiningDate,DATE_FORMAT(advanceDate,'%d/%m/%Y') as advanceDate FROM guests WHERE status='S' $whereStr ORDER BY guestName ASC";
	$roomQry = mysql_query("SELECT *,
		DATE_FORMAT(joiningDate,'%d/%m/%Y') as joiningDate,
		DATE_FORMAT(vacatingDate,'%d/%m/%Y') as vacatingDate,
		DATE_FORMAT(advanceDate,'%d/%m/%Y') as advanceDate 
		FROM guests $whereStr ORDER BY guestName ASC");
	$roomsCnt = mysql_num_rows($roomQry);
	while($roomRes = mysql_fetch_array($roomQry )){

		if($roomRes['reasonOfStay']=='B')
			$reasonOfStay = 'Business';
		else if($roomRes['reasonOfStay']=='R')
			$reasonOfStay = 'Residence';
		else if($roomRes['reasonOfStay']=='S')
			$reasonOfStay = 'Student';
		else if($roomRes['reasonOfStay']=='E')
			$reasonOfStay = 'Employee';

	
		$status = ($roomRes['status']=='S')?'Staying':'Vacated';

		$myData[] = array(
			'guestId'              => $roomRes['guestId'],
			'guestName'            => $roomRes['guestName'],
			'fatherName'           => $roomRes['fatherName'],
			'nativePlace'          => $roomRes['nativePlace'],
			'address'              => $roomRes['address'],
			'nativePhone'          => $roomRes['nativePhone'],
			'permanentAddress'     => $roomRes['permanentAddress'],
			'permanentPhone'       => $roomRes['permanentPhone'],
			'localAddress'         => $roomRes['localAddress'],
			'localPhone'           => $roomRes['localPhone'],
			'occupation'           => $roomRes['occupation'],
			'occupationAddress'    => $roomRes['occupationAddress'],
			'occupationPhone'      => $roomRes['occupationPhone'],
			'mobile'               => $roomRes['mobile'],
			'lastResidenceAddress' => $roomRes['lastResidenceAddress'],
			'lastResidencePhone'   => $roomRes['lastResidencePhone'],
			'reasonOfStay'         => $reasonOfStay,
			'joiningDate'          => $roomRes['joiningDate'],
			'vacatingDate'         => ($roomRes['vacatingDate']=='00/00/0000')?"":$roomRes['vacatingDate'],
			'advanceAmount'        => $roomRes['advanceAmount'],
			'advanceDate'          => $roomRes['advanceDate'],
			'roomNo'               =>  getRoomNo($roomRes['roomId']),
			'vehicleNo'            => $roomRes['vehicleNo'],
			'status'               => $status,
			'comments'             => $roomRes['comments'],
			'viewphoto'            => '<img src="./images/viewphoto.png" title="View Photo" style="cursor:pointer;" onclick="viewphoto('.$roomRes['guestId'].',\''.str_replace(" ", "", $roomRes['guestName']).'\')"/>&#160;&#160;'.'<img src="./images/pdf.png" style="cursor:pointer;" title="Download details as Pdf" onclick="downloadPdf('.$roomRes['guestId'].')"/>'
		);
	}
	$myData = array('GUESTS' => $myData, 'totalCount' => $roomsCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Get_Rooms_List"){
	/**
	 * select only rooms that are not full
	 **/
	$includeStr = "";
	if(isset($_POST['roomNo']) && $_POST['roomNo']!=""){
		$includeStr = " OR roomNo='".$_POST['roomNo']."'";
	}
	$roomQry = mysql_query("SELECT roomId,roomNo FROM rooms WHERE ((roomCapacity > noOfGuests) AND roomStatus!='F')  $includeStr ORDER BY roomNo ASC");
	$roomsCnt = mysql_num_rows($roomQry);
	while($roomRes = mysql_fetch_array($roomQry )){
		
		$myData[] = array(
			'roomId'  	 	=> $roomRes['roomId'],
			'roomNo'  	 	=> $roomRes['roomNo']
		);
	}
	$myData = array('ROOMS' => $myData, 'totalCount' => $roomsCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}

if($todo == "Add_Guest"){
	// print_r($_FILES);
	// if(isset($_FILES['guestuploadPhoto']))
	// 	echo $_FILES['guestuploadPhoto']['tmp_name'];
	// exit;
	$guestName            = $_POST['guestName'];
	$fatherName           = $_POST['fatherName'];
	$mobile               = $_POST['mobile'];
	$nativePlace          = $_POST['nativePlace'];
	$address              = $_POST['address'];
	$nativePhone          = $_POST['nativePhone'];
	$permanentaddress     = $_POST['permanentaddress'];
	$permanentPhone       = $_POST['permanentPhone'];
	$localAddress         = $_POST['localAddress'];
	$localPhone           = $_POST['localPhone'];
	$lastResidenceAddress = $_POST['lastResidenceAddress'];
	$lastResidencePhone   = $_POST['lastResidencePhone'];
	$reasonOfStay         = $_POST['reasonOfStay'];
	$occupation           = $_POST['occupation'];
	$occupationAddress    = $_POST['occupationAddress'];
	$occupationPhone      = $_POST['occupationPhone'];
	$joiningDate          = $_POST['joiningDate'];
	$vacatingDate         = $_POST['vacatingDate'];
	$advanceAmount        = $_POST['advanceAmount'];
	$advanceDate          = $_POST['advanceDate'];
	$roomId               = $_POST['roomId'];
	$vehicleNo            = $_POST['vehicleNo'];
	$comments             = $_POST['comments'];
	$captureImage         = $_POST['imgSrc'];
	$signImage	          = $_POST['imgSignSrc'];
	$status               = "S";
	
	$tempFileName         = "";
	$upload_path          = "../guestsPhotos/";
	$signupload_path = "../guestsSign/";

	$chkQry	= mysql_query("SELECT * FROM guests WHERE mobile='".$mobile."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$roomQry = 'INSERT INTO guests(guestName,fatherName,mobile,nativePlace,nativePhone,address,permanentaddress,permanentPhone,localAddress,
					localPhone,lastResidenceAddress,lastResidencePhone,reasonOfStay,occupation,occupationAddress,occupationPhone,joiningDate,vacatingDate,advanceAmount,advanceDate,roomId,vehicleNo,status,comments
					) VALUES( "'.$guestName.'","'.
								$fatherName.'","'.
								$mobile.'","'.
								$nativePlace.'","'.
								$nativePhone.'","'.
								$address.'","'.
								$permanentaddress.'","'.
								$permanentPhone.'","'.
								$localAddress.'","'.
								$localPhone.'","'.
								$lastResidenceAddress.'","'.
								$lastResidencePhone.'","'.
								$reasonOfStay.'","'.
								$occupation.'","'.
								$occupationAddress.'","'.
								$occupationPhone.'","'.
								$joiningDate.'","'.
								$vacatingDate.'","'.
								$advanceAmount.'","'.
								$advanceDate.'","'.
								$roomId.'","'.
								$vehicleNo.'","'.
								$status.'","'.
								$comments.'")';
//"'.$roomNo.'","'.$roomCapacity.'")';
		$roomRes = mysql_query($roomQry);
		if($roomRes){
			$guestId = mysql_insert_id();
			/**
			 * Update no of guests in rooms table
			 **/
			$roomQry = mysql_query("SELECT noOfGuests,roomStatus,roomCapacity from rooms WHERE roomId='".$roomId."'");
			$roomqRes = mysql_fetch_array($roomQry);
			$noOfGuests = $roomqRes['noOfGuests'];
			$roomStatus = $roomqRes['roomStatus'];
			$roomCapacity = $roomqRes['roomCapacity'];


			$noOfGuests = $noOfGuests+1;

			if($noOfGuests < $roomCapacity)
				$roomStatus = 'P';
			if($noOfGuests == $roomCapacity)
				$roomStatus = 'F';


			$updateQry = 'UPDATE rooms SET 
						noOfGuests    = "'.$noOfGuests.'",
						roomStatus    = "'.$roomStatus.'"
						WHERE roomId = "'.$roomId.'"';
			$roomRes = mysql_query($updateQry);
			if($roomRes){
				$err1="";
			}else{
				//$error	= mysql_error();
				$err1 = "<br/>Error while updating No of Guests for Room No $roomNo";
			}			
			/**
			 * Save the photo of the guest with the guestname and guestid
			 **/
			$err2 = "";
			if( isset($_FILES) && isset($_FILES['guestuploadPhoto']) && $_FILES["guestuploadPhoto"]["error"]==0 && isset($_FILES['guestuploadSign']) && $_FILES["guestuploadSign"]["error"]==0 ){
				// if($_FILES['guestuploadPhoto'])
					if( isset($_FILES['guestuploadPhoto']) && $_FILES["guestuploadPhoto"]["error"]==0 ){
						if( $_FILES['guestuploadPhoto']['type']=='image/png' ){
							// $ext = ($_FILES['guestuploadPhoto']['type']=='image/png')?"png":"jpg";
							$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_photo.png'; //.$ext;
							if(! move_uploaded_file($_FILES['guestuploadPhoto']['tmp_name'], $upload_path.$tempFileName) )
								$err2 .= "<br/>Error while saving uploaded Photo";
						}else{
							$err2 .= "<br/>Photo has to be in PNG format";
						} 
					}else{
						$err2 .= "<br/>Photo not uploaded";
					}

					if( isset($_FILES['guestuploadSign']) && $_FILES["guestuploadSign"]["error"]==0 ){
						if( $_FILES['guestuploadSign']['type']=='image/png' ){
							// $ext = ($_FILES['guestuploadSign']['type']=='image/png')?"png":"jpg";
							$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_sign.png'; //.$ext;
							if(! move_uploaded_file($_FILES['guestuploadSign']['tmp_name'], $signupload_path.$tempFileName) )
								$err2 .= "<br/>Error while saving uploaded Signature";
						}else{
							$err2 .= "<br/>Signature has to be in PNG format";
						} 
					}else{
						$err2 .= "<br/>Signature not uploaded";
					}					
			}else{				
				if($guestId && $guestId!=0){				
					$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_photo.png'; //remove spaces in guestname
					$captureImage = str_replace('data:image/png;base64,', '', $captureImage);
					$captureImage = str_replace(' ', '+', $captureImage);
					//if the image is not updated during the edit process, then the image string will not be base64 encoded image. 
					//so test if the image is changed and a new image is captured. then process and stored.
					//else don't save/overwrite the iamge. leave the past image as it is						
					if(  ( base64_encode(base64_decode($captureImage, true)) === $captureImage) && (strpos($captureImage,$tempFileName) === false) ){  // 
						$captureData = base64_decode($captureImage);
						file_put_contents($upload_path.$tempFileName, $captureData);
					}					
					// $captureData = base64_decode($captureImage);
					// file_put_contents($upload_path.$tempFileName, $captureData);
					$err2 = "";
				}else{
					$err2 = "<br/>Photo Not Saved Successfully";
				}

				/**
				 * Save the photo of the guest's signature with the guestname and guestid
				 **/
				
				if($guestId && $guestId!=0){				
					$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_sign.png';	//remove spaces in guestname
					$signImage = str_replace('data:image/png;base64,', '', $signImage);
					$signImage = str_replace(' ', '+', $signImage);
					//if the image is not updated during the edit process, then the image string will not be base64 encoded image. 
					//so test if the image is changed and a new image is captured. then process and stored.
					//else don't save/overwrite the iamge. leave the past image as it is					
					if(  ( base64_encode(base64_decode($signImage, true)) === $signImage) && (strpos($signImage,$tempFileName) === false) ){  // 
						$captureData = base64_decode($signImage);
						file_put_contents($signupload_path.$tempFileName, $captureData);
					}						
					// $captureData = base64_decode($signImage);
					// file_put_contents($signupload_path.$tempFileName, $captureData);
					$err2 = "";
				}else{
					$err2 .= "<br/>Signature Not Saved Successfully";
				}
			}

			// $guestUpdateQry = 'UPDATE guests SET photo="'.$photoName.'",sign="'.$signName.'" WHERE guestId= "'.$guestId.'"';
			// $guestUpdateRes = mysql_query($guestUpdateQry);			

			echo "{ success: true,msg:'Guest <b>$guestName</b> Added Successfully.$err1.$err2'}";
		}
		else
			echo "{ success: false,msg:'Error while adding new Guest.'}";
	}else{
		echo "{ success: false,msg:'Guest <b>$guestName</b> Already Exists.<br/>There is some other Guest with same Mobile number already exists.'}";
	}
}

if($todo == "Edit_Guest"){
	$guestId              = $_POST['guestId'];
	$guestName            = $_POST['guestName'];
	$fatherName           = $_POST['fatherName'];
	$mobile               = $_POST['mobile'];
	$nativePlace          = $_POST['nativePlace'];
	$address              = $_POST['address'];
	$nativePhone          = $_POST['nativePhone'];
	$permanentaddress     = $_POST['permanentaddress'];
	$permanentPhone       = $_POST['permanentPhone'];
	$localAddress         = $_POST['localAddress'];
	$localPhone           = $_POST['localPhone'];
	$lastResidenceAddress = $_POST['lastResidenceAddress'];
	$lastResidencePhone   = $_POST['lastResidencePhone'];
	$reasonOfStay         = $_POST['reasonOfStay'];
	$occupation           = $_POST['occupation'];
	$occupationAddress    = $_POST['occupationAddress'];
	$occupationPhone      = $_POST['occupationPhone'];
	$joiningDate          = $_POST['joiningDate'];
	$vacatingDate         = $_POST['vacatingDate'];
	$advanceAmount        = $_POST['advanceAmount'];
	$advanceDate          = $_POST['advanceDate'];
	$roomId               = $_POST['roomId'];
	$vehicleNo            = $_POST['vehicleNo'];
	$comments             = $_POST['comments'];
	$status               = $_POST['status'];
	$captureImage         = $_POST['imgSrc'];
	$signImage	          = $_POST['imgSignSrc'];

	if($reasonOfStay=='Business')
		$reasonOfStay = 'B';
	else if($reasonOfStay=='Residence')
		$reasonOfStay = 'R';
	else if($reasonOfStay=='Student')
		$reasonOfStay = 'S';
	else if($reasonOfStay=='Employee')
		$reasonOfStay = 'E';

	$tempFileName = "";
	$upload_path = "../guestsPhotos/";
	$signupload_path = "../guestsSign/";

	$chkQry	= mysql_query("SELECT * FROM guests WHERE guestName='".$guestName."' AND mobile='".$mobile."' AND guestId!='".$guestId."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 0){
		$roomQry = 'UPDATE guests SET
						guestName            = "'.$guestName.'",
						fatherName           = "'.$fatherName.'",
						mobile               = "'.$mobile.'",
						nativePlace          = "'.$nativePlace.'",
						address              = "'.$address.'",
						nativePhone          = "'.$nativePhone.'",
						permanentaddress     = "'.$permanentaddress.'",
						permanentPhone       = "'.$permanentPhone.'",
						localAddress         = "'.$localAddress.'",
						localPhone           = "'.$localPhone.'",
						lastResidenceAddress = "'.$lastResidenceAddress.'",
						lastResidencePhone   = "'.$lastResidencePhone.'",
						reasonOfStay         = "'.$reasonOfStay.'",
						occupation           = "'.$occupation.'",
						occupationAddress    = "'.$occupationAddress.'",
						occupationPhone      = "'.$occupationPhone.'",
						joiningDate          = "'.$joiningDate.'",
						vacatingDate         = "'.$vacatingDate.'",
						advanceAmount        = "'.$advanceAmount.'",
						advanceDate          = "'.$advanceDate.'",
						vehicleNo            = "'.$vehicleNo.'",
						comments             = "'.$comments.'",
						status               = "'.$status.'"
						WHERE guestId        = "'.$guestId.'"';
						// roomId 	= "'.$roomId.'",
		$roomRes = mysql_query($roomQry);
		if($roomRes){
			$err2 = "";
			if( isset($_FILES) && isset($_FILES['guestuploadPhoto']) && $_FILES["guestuploadPhoto"]["error"]==0 && isset($_FILES['guestuploadSign']) && $_FILES["guestuploadSign"]["error"]==0 ){
				// if($_FILES['guestuploadPhoto'])
					if( isset($_FILES['guestuploadPhoto']) && $_FILES["guestuploadPhoto"]["error"]==0 ){
						if( $_FILES['guestuploadPhoto']['type']=='image/png' ){
							// $ext = ($_FILES['guestuploadPhoto']['type']=='image/png')?"png":"jpg";
							$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_photo.png'; //.$ext;
							if(! move_uploaded_file($_FILES['guestuploadPhoto']['tmp_name'], $upload_path.$tempFileName) )
								$err2 .= "<br/>Error while saving uploaded Photo";
						}else{
							$err2 .= "<br/>Photo has to be in PNG format";
						} 
					}else{
						$err2 .= "<br/>Photo not uploaded";
					}

					if( isset($_FILES['guestuploadSign']) && $_FILES["guestuploadSign"]["error"]==0 ){
						if( $_FILES['guestuploadSign']['type']=='image/png' ){
							// $ext = ($_FILES['guestuploadSign']['type']=='image/png')?"png":"jpg";
							$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_sign.png'; //.$ext;
							if(! move_uploaded_file($_FILES['guestuploadSign']['tmp_name'], $signupload_path.$tempFileName) )
								$err2 .= "<br/>Error while saving uploaded Signature";
						}else{
							$err2 .= "<br/>Signature has to be in PNG format";
						} 
					}else{
						$err2 .= "<br/>Signature not uploaded";
					}					
			}else{	
				if($guestId && $guestId!=0){				
					$tempFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_photo.png';
					$captureImage = str_replace('data:image/png;base64,', '', $captureImage);
					$captureImage = str_replace(' ', '+', $captureImage);


					$signFileName = $guestId.'_'.str_replace(" ", "", $guestName).'_sign.png';
					$signImage = str_replace('data:image/png;base64,', '', $signImage);
					$signImage = str_replace(' ', '+', $signImage);
					//if the image is not updated during the edit process, then the image string will not be base64 encoded image. 
					//so test if the image is changed and a new image is captured. then process and stored.
					//else don't save/overwrite the iamge. leave the past image as it is
					if(  ( base64_encode(base64_decode($captureImage, true)) === $captureImage) && (strpos($captureImage,$tempFileName) === false) ){  // 
						$captureData = base64_decode($captureImage);
						file_put_contents($upload_path.$tempFileName, $captureData);
					}
					if(  ( base64_encode(base64_decode($signImage, true)) === $signImage) && (strpos($signImage,$signFileName) === false) ){  // 
						$captureData = base64_decode($signImage);
						file_put_contents($signupload_path.$signFileName, $captureData);
					}				
					$err2 = "";
				}else{
					$err2 = "<br/>Photo Not Saved Successfully";
				}
			}
			//if the guest is vacating, then update the room status and no of guests
			if($vacatingDate!="" && $status=='V'){				
				/**
				 * Update no of guests in rooms table
				 **/
				$roomQry = mysql_query("SELECT noOfGuests,roomStatus,roomCapacity from rooms WHERE roomId='".$roomId."'");
				$roomqRes = mysql_fetch_array($roomQry);
				$noOfGuests = $roomqRes['noOfGuests'];
				$roomStatus = $roomqRes['roomStatus'];
				$roomCapacity = $roomqRes['roomCapacity'];


				$noOfGuests = $noOfGuests-1;

				if($noOfGuests < $roomCapacity)
					$roomStatus = 'P';
				if($noOfGuests == 0)
					$roomStatus = 'E';


				$updateQry = 'UPDATE rooms SET 
							noOfGuests    = "'.$noOfGuests.'",
							roomStatus    = "'.$roomStatus.'"
							WHERE roomId = "'.$roomId.'"';
				$roomRes = mysql_query($updateQry);
				if($roomRes){
					$err2.="";
				}else{
					//$error	= mysql_error();
					$err2 .= "<br/>Error while updating No of Guests for Room No $roomNo";
				}	
			}
			echo "{ success: true,msg:'Details of <b>$guestName</b> Updated Successfully.$err1.$err2'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating details of the guest $guestName.'.mysql_error()}";
		}
	}else{
		echo "{ success: false,msg:'Already there is some other guest with the same mobile <b>$mobile</b> Exists.'}";
	}
}




if($todo == "setCheckoutDate"){
	$guestId              = $_POST['guestId'];
	$guestName            = $_POST['guestName'];
	$vacatingOn         = $_POST['vacatingOn'];
	$comments             = $_POST['comments'];

	$chkQry	= mysql_query("SELECT * FROM guests WHERE guestName='".$guestName."' AND guestId='".$guestId."'");
	$chkCnt	= mysql_num_rows($chkQry);
	if($chkCnt == 1){
		$roomQry = 'UPDATE guests SET
						vacatingOn            = "'.$vacatingOn.'",
						comments             = "'.$comments.'"
						WHERE guestId        = "'.$guestId.'"';
						// roomId 	= "'.$roomId.'",
		$roomRes = mysql_query($roomQry);
		if($roomRes){	
			echo "{ success: true,msg:'Vacating Date for <b>$guestName</b> Updated Successfully.'}";
		}else{
			//$error	= mysql_error();
			echo "{ success: false,msg:'Error while updating details of the Vacating Date.".mysql_error()."'}";
		}
	}else{
		echo "{ success: false,msg:'Not able to find the guest details.'}";
	}
}
if($todo == "Get_Vacating_Guests"){

	$chkQry	= mysql_query("SELECT *,DATE_FORMAT(vacatingOn,'%d/%m/%Y') as vacatingOn FROM guests WHERE vacatingOn BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 2 MONTH) ORDER BY vacatingOn");
	$gCnt = mysql_num_rows($chkQry);
	while($chkRes = mysql_fetch_array($chkQry )){

		$myData[] = array(
			'guestId'              => $chkRes['guestId'],
			'guestName'            => $chkRes['guestName'],
			'vacatingOn'           => $chkRes['vacatingOn']
		);
	}
	$myData = array('VACATING' => $myData, 'totalCount' => $gCnt);
	header('Content-Type: application/x-json');
    echo json_encode($myData);
}
/**
 * handle file uploads of Guest Proofs
 * 
 */
if($todo=="Edit_Proof"){
	$fileUploadErr = "";
	// print_r($_FILES);
	$count =  count($_FILES);
	$i=0;
	$insStrFields = "";
	$insStrValues = "";
	$upStr = "";
	for($j=0; $j<=$count; $j++) {
		$i++;
	  // if ($_FILES['files'][$i]['size'])
	  //   echo $_FILES['files'][$i]['name']."\n";

		$photoSize = $_FILES["proof".$i]["size"] / 1024;
		if($photoSize<=500){
			$photo	= ""; //$_FILES['proof'.$i]['name'];
			$photourl = "../guestsProofs/".$_POST['guestId']."_"."proof".$i.strtolower(substr($_FILES["proof".$i]["name"],-4));
			// echo "\n";
			
			// delete files for current proof
			array_map('unlink', glob("../guestsProofs/".$_POST['guestId']."_"."proof".$i.".*"));
			// if(file_exists("../guestsProofs/".$_POST['guestId']."_"."proof".$i.".*")){
			// 	unlink("../guestsProofs/".$_POST['guestId']."_"."proof".$i.".*");
			// }else{
			// 	echo "../guestsProofs/".$_POST['guestId']."_"."_proof".$i.".* Not exists";
			// }
			$photo="NO";
			if(move_uploaded_file($_FILES["proof".$i]["tmp_name"],$photourl)){
				$photo="YES";
				$insStrFields .= ",proof".$i;
				$insStrValues .= $_FILES["proof".$i]["name"].'","';


				$upStr .= "proof".$i."='".$_FILES["proof".$i]["name"]."'," ;

				// echo $insStrFields."\n";
				// echo $insStrValues."\n";
				// echo "------------\n";
			}
		}else{
			$fileUploadErr .= "Proof$1 File size should be less then to 500KB.<br>";
		}


	}
	// exit;
	$upStr = substr($upStr,0,strlen($upStr)-1);
	$proofUpdateQry = 'UPDATE guestsproof SET '.$upStr.' WHERE guestId= "'.$_POST['guestId'].'"';

	$insStrValues = substr($insStrValues,0,strlen($insStrValues)-3);
	$proofInsertQry = 'INSERT INTO guestsproof(guestId'.$insStrFields.') 
							VALUES( "'.$_POST['guestId'].'","'.								
									$insStrValues.'")';

	$proofCheckQry = mysql_query("SELECT * FROM guestsproof WHERE guestId=".$_POST['guestId']);
	$recCnt = mysql_num_rows($proofCheckQry);

	
	if($recCnt==0){
		$proofInsertRes = mysql_query($proofInsertQry);
		if($proofInsertRes){
			if( $count > 1 ){
				echo "{ success: true,msg:'Proofs of <b>".$_POST['guestName']."</b> Added Successfully.".$fileUploadErr."'}";
			}
			else{
				echo "{ success: false,msg:'".$fileUploadErr."'}";
			}
		}else{
			echo "{ success: false,msg:'".mysql_error()."'}";
		}
	}else{
		$proofUpdateRes = mysql_query($proofUpdateQry);
		if($proofUpdateRes){
			if( $count > 1 ){
				echo "{ success: true,msg:'Proofs of <b>".$_POST['guestName']."</b> Updated Successfully.".$fileUploadErr."'}";
			}
			else{
				echo "{ success: false,msg:'".$fileUploadErr."'}";
			}
		}
	}	

}
/**
 * while loading the proof mgmt window, need to check if there are any id proofs uploaded previously
 * @var [type]
 */
if($todo=="CheckProofExists"){
	if($_POST['guestId']){
		// echo searchForFile("./guestsProofs/".$_POST['guestId']."_proof1.*");
		$p1 = "../guestsProofs/".$_POST['guestId']."_proof1.jpg";
		$p2 = "../guestsProofs/".$_POST['guestId']."_proof2.jpg";
		$p3 = "../guestsProofs/".$_POST['guestId']."_proof3.jpg";
		$p4 = "../guestsProofs/".$_POST['guestId']."_proof4.jpg";
		$p5 = "../guestsProofs/".$_POST['guestId']."_proof5.jpg";
		// echo "$p1--".file_exists($p1);
		if(file_exists($p1) || file_exists($p2) || file_exists($p3) || file_exists($p4) || file_exists($p5)){
			echo "{ success: true,msg:'Exists'}";
		}else{
			echo "{ success: false,msg:'Not Exists'}";
		}
	}
}

/**
 * upload guest photo
 */
if($todo=="UploadPhoto"){
	print_r($_FILES);
}


if($_REQUEST['todo'] == 'GenXL_GuestsList'){
	$whereStr = "";
	$filename = "";
	if($_REQUEST['searchFor'] && $_REQUEST['searchFor']!=''){
		$searchFor = $_REQUEST['searchFor'];
		$startdate = $_REQUEST['startdate'];
		$enddate = $_REQUEST['enddate'];
		$sd = date("d-m-Y",strtotime($startdate));
		$ed = date("d-m-Y",strtotime($enddate));
		if($searchFor=="Vacated"){
			$filename	= "vacated.guests_".$sd."_".$ed.".xlsx";
			$whereStr = " WHERE status='V' AND vacatingDate BETWEEN  '$startdate' AND '$enddate'  ";
		}elseif($searchFor=="Staying"){
			$filename	= "staying.guests_".$sd."_".$ed.".xlsx";
			$whereStr = " WHERE status='S' AND vacatingDate='00/00/0000' ";
		}elseif($searchFor=="New"){
			$filename	= "new.guests_".$sd."_".$ed.".xlsx";
			$whereStr = " WHERE status='S' AND vacatingDate='00/00/0000' AND joiningDate BETWEEN '$startdate' AND '$enddate'  ";
		}
	}else{
		$whereStr = " WHERE status='S' ";
	}
	/**********
	 * Select only guests staying currently. We can view all guests including vacated guest in reports separately.
	 ***/	
	//echo "SELECT *,DATE_FORMAT(joiningDate,'%d/%m/%Y') as joiningDate,DATE_FORMAT(advanceDate,'%d/%m/%Y') as advanceDate FROM guests WHERE status='S' $whereStr ORDER BY guestName ASC";
	$roomQry = mysql_query("SELECT *,
		DATE_FORMAT(joiningDate,'%d/%m/%Y') as joiningDate,
		DATE_FORMAT(vacatingDate,'%d/%m/%Y') as vacatingDate,
		DATE_FORMAT(advanceDate,'%d/%m/%Y') as advanceDate 
		FROM guests $whereStr ORDER BY guestName ASC");
	$roomsCnt = mysql_num_rows($roomQry);
	if($roomsCnt == 0){
		echo '{ success: false,Msg:"No Matching Rooms Found"}';
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

		while($roomRes = mysql_fetch_array($roomQry )){
			$rowno++;

			if($roomRes['reasonOfStay']=='B')
				$reasonOfStay = 'Business';
			else if($roomRes['reasonOfStay']=='R')
				$reasonOfStay = 'Residence';
			else if($roomRes['reasonOfStay']=='S')
				$reasonOfStay = 'Student';
			else if($roomRes['reasonOfStay']=='E')
				$reasonOfStay = 'Employee';

		
			$status = ($roomRes['status']=='S')?'Staying':'Vacated';

			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":K".$rowno."'")->getBorders()->getAllBorders()->setBorderStyle(PHPExcel_Style_Border::BORDER_THIN);
			$objPHPExcel->getActiveSheet()->getStyle("'A".$rowno.":K".$rowno."'")->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_CENTER);
			$objPHPExcel->getActiveSheet()->getStyle('B' . $rowno)->getAlignment()->setWrapText(true)->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);

			$objPHPExcel->getActiveSheet()->setCellValue('A' . $rowno, $rowno-1);
			$objPHPExcel->getActiveSheet()->setCellValue('B' . $rowno, $roomRes['guestName']);
			$objPHPExcel->getActiveSheet()->setCellValue('C' . $rowno, getRoomNo($roomRes['roomId']));
			$objPHPExcel->getActiveSheet()->setCellValue('D' . $rowno,  $roomRes['mobile']);
			$objPHPExcel->getActiveSheet()->setCellValue('E' . $rowno,  $roomRes['occupation']);
			$objPHPExcel->getActiveSheet()->setCellValue('F' . $rowno,  $roomRes['occupationPhone']);
			$objPHPExcel->getActiveSheet()->setCellValue('G' . $rowno,  $roomRes['joiningDate']);
			$objPHPExcel->getActiveSheet()->setCellValue('H' . $rowno,  ($roomRes['vacatingDate']=='00/00/0000')?"":$roomRes['vacatingDate']);
			$objPHPExcel->getActiveSheet()->setCellValue('I' . $rowno, $reasonOfStay);
			$objPHPExcel->getActiveSheet()->setCellValue('J' . $rowno,  $roomRes['vehicleNo']);
			$objPHPExcel->getActiveSheet()->setCellValue('K' . $rowno,  $status);


		}

		// $filename	= "RoomStatus_".date("d.m.Y").".xlsx";

		$objPHPExcel->setActiveSheetIndex(0);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		header('Content-Disposition: attachment;filename='.$filename);
		header('Cache-Control: max-age=0');
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');		


	}


}


?>