<?php
/****************************************
*
* cpanel.php
*
******************************************/
session_start();
$pagetitle    = "Mansion Management System - ".$_SESSION['cname']; //Mansion Management System";
$pageloadmsg  = "Mansion Management System";
$projectheading = $_SESSION['cname']; 

$_SESSION['reportsTitle'] = "Mansion Management System";
$_SESSION['version']="B";

//print_r($_SESSION);
//exit;
// error_reporting(E_ALL);
//ini_set('display_errors','On');

if( (!isset($_SESSION['userid']) || !isset($_SESSION['username']) || !isset($_SESSION['usertype']) ) && ($_SESSION['usertype']!='U' || $_SESSION['usertype']!='A' ) ){
	//echo "Not authenticated.....";
	header("location: ./index.php");
	exit;
}

require_once("./config/dbconn.php");
require_once("./proc.php");
require_once("./config/constants.php");

?>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?=$pagetitle;?></title>
<link rel="stylesheet" type="text/css" href="./extjs4.1/resources/css/ext-all.css" />
<!--link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all-slate.css" id="theme"-->
<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<link rel="stylesheet" type="text/css" href="./plugins/css/redInfoWindow.css" />
<style>

   /* for word wrapping inside grid cells */
  td.x-grid-cell {
      overflow: hidden;
  }
  td.x-grid-cell div.x-grid-cell-inner {
      white-space: nowrap !important;
      /*white-space: normal !important;*/
  }

  .save{
      background-image: url(./images/save_btn_image.png) !important ;
  }
  .search{
      background-image: url(./images/search.png) !important ;
  }
  .new {
      background-image: url('./images/table_add.png') !important;
  }
  .edit {
      background-image: url('./images/edit_btn.gif') !important;
  }
  .delete {
      background-image: url('./images/delete.png') !important;
  }
  .refresh {
      background-image: url(./images/refresh.png) !important;
  }
  .view {
      background-image: url(./images/view1.png) !important;
  }

  .print{
      background-image: url(./images/printer.png) !important ;
  }

  .barchart{
          background-image: url(./images/chart_bar.png) !important ;
  }

  .add_but {
  background-image: url('./images/add.png') !important;   
  }
  .del_but {
  background-image: url('./images/delete.png') !important;    
  }
  .smsalert {
  background-image: url('./images/mail_send.png') !important;   
  }
          
</style>
<link rel="SHORTCUT ICON" href="./favicon.ico">

<script type="text/javascript" src="./extjs4.1/ext-all.js"></script>

<script type="text/javascript">
//var username = "< ? = $_SESSION['exusername']; ? >";

function setUsername(){
  // var strStatusMsg = '<div style="width:300px;float:left;">Logged in as '+"<font color='#f30'><B><?=$_SESSION['username'];?></B></font></div><div style='float:right;text-align:right;width:200px;'><a href='#' onclick='javascript:showLicense()'>View EULA</a></div>";
  // Ext.getCmp('statusMsg').setTitle(strStatusMsg);
	Ext.getCmp('statusMsg').setTitle('Logged in as '+"<font color='#f30'><B><?=$_SESSION['username'];?></B></font>");
	gpsCook.set('loadpage',"<?=$_SESSION['loadpage'];?>");
	loadSessionPage();
}
var version = "<?=$_SESSION['version'];?>";
var usertype = "<?=$_SESSION['usertype'];?>";
</script>

<script type="text/javascript" src="./plugins/SearchField.js"></script>
<script type="text/javascript" src="./plugins/RowExpander.js"></script>
<script type="text/javascript" src="./plugins/datetime.js"></script>
<!-- <script type="text/javascript" src="./plugins/GroupingSummary.js"></script> -->
<script type="text/javascript" src="./plugins/GroupSummary.js"></script>
<script type="text/javascript" src="./plugins/vtypes.js"></script>

<script type="text/javascript" src="./plugins/rgraph/RGraph.common.core.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.common.effects.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.common.dynamic.js"></script>
<script type="text/javascript" src="./plugins/rgraph/RGraph.gauge.js"></script>


<script type="text/javascript" src="./scripts/innovtrack.js"></script>
<script type="text/javascript" src="./scripts/layout.js"></script>
<script type="text/javascript" src="./scripts/menu.js"></script>
<script type="text/javascript" src="./scripts/dashboard.js"></script>
<script type="text/javascript" src="./scripts/rooms.js"></script>
<script type="text/javascript" src="./scripts/guests.js"></script>
<script type="text/javascript" src="./scripts/expenses.js"></script>
<script type="text/javascript" src="./scripts/transactions.js"></script>
<script type="text/javascript" src="./scripts/billing.js"></script>
<script type="text/javascript" src="./scripts/roomreports.js"></script>
<script type="text/javascript" src="./scripts/guestreports.js"></script>
<script type="text/javascript" src="./scripts/rentreports.js"></script>
<script type="text/javascript" src="./scripts/expensereports.js"></script>
<!-- <script type="text/javascript" src="./scripts/combo.js"></script> -->
<script type="text/javascript" src="./scripts/functions.js"></script>
<script type="text/javascript" src="./scripts/settings.js"></script>
<!--script type="text/javascript" src="./plugins/extinfowindow.js"></script-->
<!--
<link rel="stylesheet" type="text/css" href="plugins/portal.css">
<script type="text/javascript" src="plugins/classes.js"></script>
-->



</head>
<body oncontextmenu="return false">
<div id="loading">
    <div class="loading-indicator"><img src="./extjs4.1/resources/themes/images/default/shared/large-loading.gif" width="32" height="32" style="margin-right:8px;float:left;vertical-align:top;"/><?=$pageloadmsg;?><br /><span id="loading-msg">Loading. Please wait...</span></div>
</div>
<div id="north">
    <table width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td width="180" align="right" class="tableTextW" valign="middle"><img src="data:image/png;base64,<?=custlogo();?>" width="178" height="70"/></td>
        <td valign="middle" class="pageHeading" style="padding-top:5px;font-wight:bold;vertical-align: middle;text-align:left;"><b><?=$projectheading;?></b><span class="tableTextBlue"><br/><?=$coords;?></span></td>
        <td width="180" valign="top" class="pageHeading" style="padding-top:5px;padding-left:5px;font-wight:bold;vertical-align: top"></td>
        <!--td align="right" class="tableTextW">&#160;&#160;[&#160;<a href="#" onClick="confLogout()"><span class="tableTextW"><U>Logout</U></span></a>&#160;]&#160;</td-->
        <!-- <img src="./images/help.png"/>&#160;&#160;<a href="#" onClick="confLogout()"><img src="./images/logout.png"/></a>&#160;&#160;</td> -->
        <td width="180" valign="top" class="pageHeading" style="padding-top:5px;padding-right:5px;font-wight:bold;vertical-align: top"><img src="./images/logo-inside.png" width="178" height="70"/></td>
      </tr>
    </table>
</div>
</body>
</html>