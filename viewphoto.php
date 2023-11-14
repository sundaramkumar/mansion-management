<?
/*****
 * viewphoto.php
 ***/
session_start();
// error_reporting(E_ALL);


if($_REQUEST['id'] && $_REQUEST['name']){
    $p1 = "./guestsPhotos/".$_REQUEST['id'].'_'.str_replace(" ", "", $_REQUEST['name']).'_photo.png';
    $p2 = "./guestsSign/".$_REQUEST['id'].'_'.str_replace(" ", "", $_REQUEST['name']).'_sign.png';
    if(!file_exists($p2)){
        $p2 = './images/nophoto.png';
    }
    if(!file_exists($p1)){
        $p1 = './images/nophoto.png';
    }  
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
          <td bgcolor="#ffffff" align="center">Photo</td>
          <td bgcolor="#ffffff" align="center">Sign</td>
        </tr>
        <tr>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p1;?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
          <td bgcolor="#ffffff" align="center"><img src="<?=$p2;?>" width="100" height="50" onclick="javascript:setPreview(this.src)"/></td>
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