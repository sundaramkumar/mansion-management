<?php
require_once('./config/lang/eng.php');
require_once('./tcpdf.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator('Jenisan PMS');
$pdf->SetAuthor('Jenisan Land Promoters');
$pdf->SetTitle('Receipt');
$pdf->SetSubject('Jenisan Receipt');
$pdf->SetKeywords('Receipt, Jenisan, JLP');

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
$pdf->setPrintFooter(false);
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
$pdf->Image('./images/billbgwmark.jpg', 0, 0, 803, 442, 'JPG', '', '', false, 300, '', false, false, 0, false, false, true);
$html = '<table width="800" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td width="800">
        <table width="800" border="0" cellspacing="1" cellpadding="0">

      <tr>
        <td align="center"><table width="750" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="2"><img src="./images/spacer.gif" height="23" with="10"/></td>
          </tr>
          <tr>
            <td colspan="2">
            <table width="750" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="30" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="127">TG230132</td>
                <td width="80" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="310" style="text-align:left;">Mahakavi bharathiyar Nagar </td>
                <td width="75" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="128" style="text-align:left;">Cash Plot </td>
              </tr>
            </table>
            </td>
          </tr>
          <tr>
            <td colspan="2"><img src="./images/spacer.gif" height="20" with="10"/></td>
          </tr>
          <tr>
            <td colspan="2"><table width="750" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td width="97" height="22" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="450" style="text-align:left;">Kumar Sundaram </td>
                <td width="80" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="123" style="text-align:left;">JLP2773072</td>
              </tr>
            </table></td>
          </tr>
          <tr>
            <td colspan="2"><img src="./images/spacer.gif" height="20" with="10"/></td>
          </tr>
          <tr>
            <td colspan="2">
                <table width="750" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="155" height="25" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                    <td width="595" style="text-align:left;">Thousand Two hundred and fifty only </td>
                  </tr>
                </table>
            </td>
          </tr>
          <tr>
            <td colspan="2">&nbsp;</td>
          </tr>
          <tr>
            <td colspan="2"><table width="750" height="20" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td width="97" height="20" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="165" style="text-align:left;">GDFF59080</td>
                <td width="272" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="216" style="text-align:left;">March 2012 </td>
              </tr>
            </table></td>
          </tr>
          <!--tr>
            <td colspan="2">&nbsp;</td>
          </tr-->
          <tr>
            <td colspan="2"><table width="750" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td colspan="3"><img src="./images/spacer.gif" height="1" with="10"/></td>
          </tr>
              <tr>
                <td width="27" height="20" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
                <td width="95" height="19" style="text-align:left;">Cash</td>
                <td width="488" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
              </tr>
            </table></td>
          </tr>
          <tr>
            <td colspan="2" style="line-height:3px;"><img src="./images/spacer.gif" height="5" with="1"/></td>
          </tr>
          <tr>
            <td width="352">
                <table width="145" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="80" align="center" style="font-family:Arial, Helvetica, sans-serif;font-weight:bold;font-size:16pt;color:#FFFFFF;">&nbsp;</td>
                    <td width="65" style="text-align:left;">1250</td>
                  </tr>
                </table>
            </td>
            <td width="398" align="right">
                <table width="377" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="320" height="26" align="center" style="font-family:Arial, Helvetica, sans-serif;font-weight:bold;font-size:18px;color:#FFFFFF;">&nbsp;</td>
                    <td width="54" style="text-align:left;vertical-align:bottom;">30,000</td>
                  </tr>
                </table>
            </td>
          </tr>
          <tr>
            <td colspan="2" style="padding-left:15px;font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#000;">&nbsp;</td>
          </tr>
          <tr>
            <td colspan="2" style="padding-left:15px;font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#000;">&nbsp;</td>
          </tr>
          <tr>
            <td height="25" colspan="2" align="right" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
          </tr>
          <tr>
            <td colspan="2" align="right" style="font-family:Arial, Helvetica, sans-serif;font-weight:normal;font-size:16px;color:#54A13E;">&nbsp;</td>
          </tr>
        </table></td>
      </tr>
    </table></td>
  </tr>
</table>
';


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

// set pdf viewer preferences
$pdf->setViewerPreferences($preferences);
//zoom page to 100% in pdf reader
$pdf->SetDisplayMode('real');

// output the HTML content
$pdf->writeHTML($html, false, false, false, false, 'left');

// reset pointer to the last page
$pdf->lastPage();

// ---------------------------------------------------------

//Close and output PDF document
$pdf->Output('jenisanreceipt.pdf', 'I'); //force to download
