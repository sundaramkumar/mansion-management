<?php
/**
 * Police submission report generation
 *
 * Get all rooms
 * Get all guests in a room
 * foreach guest get details, proofs, gen pdf
 * 
 * 
 */
session_start();
error_reporting(E_ERROR);
ini_set('max_execution_time', 0);
ini_set('memory_limit', '256M');

require_once("../config/dbconn.php");
require_once("../proc.php");
require_once("../config/constants.php");

require_once('./config/lang/eng.php');
require_once('./tcpdf.php');

$photoPath = "../guestsPhotos/";
$proofPath = "../guestsProofs/";
$phyFolder = $baseFolder."policerepo\\";

$todo = $_POST['todo'];
if($todo == "Gen_Police_Report"){
    if( isset($_POST['includeProofs']) ){
        $includeProofs = ($_POST['includeProofs']=="N")?"N":"Y" ;
    }else{
        $includeProofs = "Y";
    }

    // set array for viewer preferences
    $preferences = array(
        'HideToolbar' => false,
        'HideMenubar' => false,
        'HideWindowUI' => false,
        'FitWindow' => false,
        'CenterWindow' => true,
        'DisplayDocTitle' => true,
        'NonFullScreenPageMode' => 'UseNone', // UseNone, UseOutlines, UseThumbs, UseOC
        'ViewArea' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
        'ViewClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
        'PrintArea' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
        'PrintClip' => 'CropBox', // CropBox, BleedBox, TrimBox, ArtBox
        'PrintScaling' => 'AppDefault', // None, AppDefault
        'Duplex' => 'DuplexFlipLongEdge', // Simplex, DuplexFlipShortEdge, DuplexFlipLongEdge
        'PickTrayByPDFSize' => true,
        'PrintPageRange' => array(1,1,2,3),
        'NumCopies' => 1
    );

    // Extend the TCPDF class to create custom Header and Footer
    class MYPDF extends TCPDF {

        // Page footer
        public function Footer() {
            global $coords;
            // Position at 15 mm from bottom
            $this->SetY(-15);
            // Set font
            $this->SetFont('helvetica', 'I', 8);
            // Page number
            $this->Cell(0, 10, $_SESSION['cname'].", ".str_replace("<br/>", ", ", $coords), 0, false, 'C', 0, '', 0, false, 'T', 'M');
        }
    }

    $roomQry = mysql_query("SELECT roomId,roomNo,noOfGuests FROM rooms WHERE noOfGuests>0 ORDER BY roomNo ASC");
    $roomsCnt = mysql_num_rows($roomQry);
    while( $roomRes = mysql_fetch_array($roomQry) ){
        $roomId     = $roomRes['roomId'];
        $roomNo     = $roomRes['roomNo'];
        $noOfGuests = $roomRes['noOfGuests'];

        $roomData[] = array(
            'roomId'        => $roomRes['roomId'],
            'roomNo'        => $roomRes['roomNo'],
            'noOfGuests'    => $roomRes['noOfGuests']
        );

        if($noOfGuests >0){
            
            $gQry = mysql_query("SELECT *,
                                DATE_FORMAT(joiningDate,'%d/%m/%Y') as joiningDate,
                                DATE_FORMAT(vacatingDate,'%d/%m/%Y') as vacatingDate,
                                DATE_FORMAT(advanceDate,'%d/%m/%Y') as advanceDate 
                                FROM guests  
                                WHERE 
                                status='S' AND 
                                vacatingDate='00/00/0000'  
                                AND 
                                roomId = ".$roomRes['roomId']."
                                ORDER BY guestName ASC");

            $gCnt = mysql_num_rows($gQry);
            
            $myData = array();
            while( $gRes = mysql_fetch_array($gQry) ){
                if($gRes['reasonOfStay']=='B')
                    $reasonOfStay = 'Business';
                else if($gRes['reasonOfStay']=='R')
                    $reasonOfStay = 'Residence';
                else if($gRes['reasonOfStay']=='S')
                    $reasonOfStay = 'Student';
                else if($gRes['reasonOfStay']=='E')
                    $reasonOfStay = 'Employee';

                
                $status = ($gRes['status']=='S')?'Staying':'Vacated';

                $myData[] = array(
                    'guestId'              => $gRes['guestId'],
                    'guestName'            => $gRes['guestName'],
                    'fatherName'           => $gRes['fatherName'],
                    'nativePlace'          => $gRes['nativePlace'],
                    'address'              => $gRes['address'],
                    'nativePhone'          => $gRes['nativePhone'],
                    'permanentAddress'     => $gRes['permanentAddress'],
                    'permanentPhone'       => $gRes['permanentPhone'],
                    'localAddress'         => $gRes['localAddress'],
                    'localPhone'           => $gRes['localPhone'],
                    'occupation'           => $gRes['occupation'],
                    'occupationAddress'    => $gRes['occupationAddress'],
                    'occupationPhone'      => $gRes['occupationPhone'],
                    'mobile'               => $gRes['mobile'],
                    'lastResidenceAddress' => $gRes['lastResidenceAddress'],
                    'lastResidencePhone'   => $gRes['lastResidencePhone'],
                    'reasonOfStay'         => $reasonOfStay,
                    'joiningDate'          => $gRes['joiningDate'],
                    'vacatingDate'         => ($gRes['vacatingDate']=='00/00/0000')?"":$gRes['vacatingDate'],
                    'advanceAmount'        => $gRes['advanceAmount'],
                    'advanceDate'          => $gRes['advanceDate'],
                    'roomNo'               => $roomNo,
                    'vehicleNo'            => $gRes['vehicleNo'],
                    'status'               => $status,
                    'comments'             => $gRes['comments']
                );
                
            }

            // genPdf($myData,$roomRes['roomNo']);

            try {
                
                $folder = "../policerepo/".$roomNo."/";
                if( is_dir($folder) ){        
                    rmdir($folder);
                }else{
                    mkdir($folder,0777,false);
                }

                foreach($myData as $guest){
                    //is_readable //realpath

                    if( (file_exists($photoPath.$guest['guestId']."_".str_replace(" ", "", $guest['guestName'])."_photo.png")) ){
                        $photoname = $photoPath.$guest['guestId']."_".str_replace(" ", "", $guest['guestName'])."_photo.png"; //  9_mani_photo.png
                    }else{
                        $photoname = "../images/emptyimg.png"; //  9_mani_photo.png
                    }

                    // echo $guest["roomNo"]." - ".$guest["guestName"]."\n";            
                

                    // create new PDF document
                    $pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

                    // set document information
                    $pdf->SetCreator('MMS');
                    $pdf->SetAuthor('Mansion Management Software');
                    $pdf->SetTitle($guest['guestName']);
                    $pdf->SetSubject('Guest Details');
                    $pdf->SetKeywords('Guest Details, Balaji Mansion, '.$guest['guestName']);

                    // set default header data
                    $pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 006', PDF_HEADER_STRING);

                    // set header and footer fonts
                    $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
                    $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

                    // set default monospaced font
                    $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

                    //set margins
                    $pdf->SetMargins(0, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
                    $pdf->SetHeaderMargin(0);
                    $pdf->SetFooterMargin(0);
                    // remove default header/footer
                    $pdf->setPrintHeader(false);
                    // $pdf->setPrintFooter(false);
                    //set auto page breaks
                    $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

                    //set image scale factor
                    $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO); //set 1.25 to 1.5 in config file

                    //set some language-dependent strings
                    $pdf->setLanguageArray($l);

                    // ---------------------------------------------------------

                    // set font
                    $pdf->SetFont('dejavusans', '', 10);
                    $pdf->AddPage();
                    // $imgsrc = "data:image/png;base64,".custlogo();
                    // $imgdata = base64_decode(custlogo());

                    // The '@' character is used to indicate that follows an image data stream and not an image file name
                    // $pdf->Image('@'.$imgdata);

                    // $pdf->Image('./images/billbgwmark.jpg', 0, 0, 803, 442, 'JPG', '', '', false, 300, '', false, false, 0, false, false, true);
                    $html = '
                    <table width="800" border="0" cellspacing="0" cellpadding="0" style="font-family:Calibri,Arial, Helvetica, sans-serif;font-weight:normal;font-size:10pt;color:#333366;">
                      <tr>
                        <td colspan="4"><table width="800" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="26">&nbsp;</td>
                            <td width="179" valign="top"><img src="../images/custlogo.png" width="179" height="99" /></td>
                            <td width="373" valign="top" style="font-family:Calibri,Arial, Helvetica, sans-serif;font-weight:normal;font-size:10pt;color:#333366;"><span style="font-family:Calibri,Arial, Helvetica, sans-serif;font-weight:bold;font-size:16pt;color:#333366;">Balaji Mansion (Annexe)</span>
                              <p>New No 91, Old No 45, Irusappa Street<br />
                              Triplicane. Chennai - 600 005. <br/><b>Phone:</b> 2844 5044, 2844 5756</p></td>
                            <td width="222"><table width="216" border="1" cellpadding="3" cellspacing="0" bordercolor="#333366">
                              <tr>
                                <td width="206"><img src="'.$photoname.'" width="206" height="186" /></td>
                              </tr>
                            </table></td>
                          </tr>
                          <tr>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td>&nbsp;</td>
                            <td style="padding:3px"><table width="213" border="1" cellpadding="2" cellspacing="0" bordercolor="#333366">
                              <tr>
                                <td width="108">Room No </td>
                                <td width="99">'.$guest["roomNo"].'</td>
                              </tr>
                            </table></td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td width="26">&nbsp;</td>
                        <td width="372"><b>Name</b></td>
                        <td width="7">:</td>
                        <td width="521">'.$guest["guestName"].'</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td><b>Father\'s Name </b></td>
                        <td width="7">:</td>
                        <td>'.$guest["fatherName"].'</td>
                      </tr>
                      <tr>
                        <td valign="top">&nbsp;</td>
                        <td valign="top"><b>Native Place &amp; Address, Phone </b></td>
                        <td width="7" valign="top">:</td>
                        <td valign="top"><table width="561" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="5"><img src="images/spacer.gif" width="1" height="100" /></td>
                            <td width="556" valign="top">'.$guest["nativePlace"]."<br/>".$guest["address"]."<br/>Phone: ".$guest["nativePhone"].'</td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td valign="top">&nbsp;</td>
                        <td valign="top"><b>Permanent Address, Phone </b></td>
                        <td width="7" valign="top">:</td>
                        <td valign="top"><table width="561" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="5"><img src="images/spacer.gif" width="1" height="100" /></td>
                            <td width="556" valign="top">'.$guest["permanentAddress"]."<br/>Phone: ".$guest["permanentPhone"].'</td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td valign="top">&nbsp;</td>
                        <td valign="top"><b>Local Address for Communication, Phone </b></td>
                        <td width="7" valign="top">:</td>
                        <td valign="top"><table width="561" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="5"><img src="images/spacer.gif" width="1" height="100" /></td>
                            <td width="556" valign="top">'.$guest["localAddress"]."<br/>Phone: ".$guest["localPhone"].'</td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td valign="top">&nbsp;</td>
                        <td valign="top"><b>Occupation &amp; Full Address, Phone </b></td>
                        <td width="7" valign="top">:</td>
                        <td valign="top"><table width="561" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="5"><img src="images/spacer.gif" width="1" height="100" /></td>
                            <td width="556" valign="top">'.$guest["occupation"]."<br/>".$guest["occupationAddress"]."<br/>Phone: ".$guest["occupationPhone"].'</td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td valign="top">&nbsp;</td>
                        <td valign="top"><b>Last Residence, Phone </b></td>
                        <td width="7" valign="top">:</td>
                        <td valign="top"><table width="561" border="0" cellspacing="0" cellpadding="0">
                          <tr>
                            <td width="5"><img src="images/spacer.gif" width="1" height="100" /></td>
                            <td width="556" valign="top">'.$guest["lastResidenceAddress"]."<br/>Phone: ".$guest["lastResidencePhone"].'</td>
                          </tr>
                        </table></td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td><b>Reason for staying </b></td>
                        <td width="7">:</td>
                        <td>'.$guest["reasonOfStay"].'</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td><b>Joining Date </b></td>
                        <td width="7">:</td>
                        <td>'.$guest["joiningDate"].'</td>
                      </tr>
                      <tr>
                        <td>&nbsp;</td>
                        <td><b>Vacating Date </b></td>
                        <td width="7">:</td>
                        <td>'.$guest["vacatingDate"].'</td>
                      </tr>
                    </table>
                    ';



                    // set pdf viewer preferences
                    $pdf->setViewerPreferences($preferences);
                    //zoom page to 100% in pdf reader
                    $pdf->SetDisplayMode('real');

                    // output the HTML content
                    $pdf->writeHTML($html, false, false, false, false, 'left');


                    if($includeProofs=="Y"){
                        for($i=1;$i<6;$i++){
                            $proof = $proofPath.$guest['guestId']."_proof".$i.".jpg";
                            if( file_exists($proof) ){
                                // echo "<br/>".$proof."<br/>";
                                $pdf->AddPage();
                                $pdf->Image($proof, 0, 0, 0, 0, 'JPG', '', '', false, 300, '', false, false, 0, false, false, true);
                                // $pdf->lastPage();
                            }
                        }
                    }

                    // reset pointer to the last page
                    $pdf->lastPage();
                    // ---------------------------------------------------------
                    $repoPath = $folder;
                    $filename = $guest['guestName'].".pdf";
                    //Close and output PDF document
                    $pdf->Output($repoPath.$filename,'F'); //force to download
                }
            } catch (Exception $e) {
                echo "{ success: false,msg:'Error Occured while generating Report ".$e."'}";        
            }
        }



        unset($myData);

    }
    echo "{ success: true,msg:'Report Generated Successfully'}";
    // system("start F:\projects\mansion\policerepo");

}

function genPdf($myData,$roomNo){
    global $preferences,$photoPath,$proofPath;


}