<?
/*****
 * viewimages.php
 ***/
session_start();
error_reporting(0);
include_once("../config/dbconn.php");
include_once("./functions.php");

if($_REQUEST['guestId']){
	$p1 = glob("./guestsProofs/".$_REQUEST['guestId']."_proof1.*");
	$p2 = glob("./guestsProofs/".$_REQUEST['guestId']."_proof2.*");
	$p3 = glob("./guestsProofs/".$_REQUEST['guestId']."_proof3.*");
	$p4 = glob("./guestsProofs/".$_REQUEST['guestId']."_proof4.*");
	$p5 = glob("./guestsProofs/".$_REQUEST['guestId']."_proof5.*");
?>
<link rel="stylesheet" type="text/css" href="./css/styles.css" />
<script>
  function setPreview(imgSrc){
    document.getElementById('preview').src = imgSrc;
  }
</script>
<table width="100%" border="0" cellspacing="0" cellpadding="10">
  <tr>
    <td align="center"><img src="" id="preview" width="350" height="300" /></td>    
  </tr>
</table>  
<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tableTextB">
  <tr>
    <td bgcolor="#a1bcdf">
      <table width="100%" border="0" cellspacing="1" cellpadding="5">
        <tr>
          <td bgcolor="#ffffff" align="center">Proof 1</td>
          <td bgcolor="#ffffff" align="center">Proof 2</td>
          <td bgcolor="#ffffff" align="center">Proof 3</td>
          <td bgcolor="#ffffff" align="center">Proof 4</td>
          <td bgcolor="#ffffff" align="center">Proof 5</td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p1[0];?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p2[0];?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p3[0];?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p4[0];?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p5[0];?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" align="center" colspan="5" class="tableTextM">
            <input type="button" onclick="window.close()" value="Close"/><br/>Click on an image to Preview, right click and 'Save Image As' to download
          </td>
        </tr>  
      </table>
    </td>    
  </tr>
</table>  
<?	
}
?>