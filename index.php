<?php

/**
 *
 * index.php
 *
 ***/
$pagetitle		= "Mansion Management System"; 
$pageloadmsg	= ""; 
$projectheading	= "Mansion Management System"; 
// ini_set('display_errors', 1); 
// error_reporting( E_ALL);
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title><?=$pagetitle;?></title>
        <script type="text/javascript" src="./scripts/functions.js"></script>
        <!-- Our CSS stylesheet file -->
        <link rel="stylesheet" href="./css/login.css" />
        <!-- <link rel="stylesheet" type="text/css" href="./extjs4.7/resources/css/ext-all.css" /> -->
		<script type="text/javascript" src="./extjs4.7/ext-all.js"></script>
        <!-- JavaScript includes -->
		<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
		<script src="./scripts/loginscript.js"></script>        <!--[if lt IE 9]>
          <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
        <![endif]-->
        <script>
        	function userForm(that){
        		if(that.value=='')
        			that.value=(that.id=='username')?'username':'password';
        		else
        			return false;
        	}

        	function doRemember(that){
        		if(that.checked){
        			that.value = 1;
        		}else{
        			that.value = "";
        		}
        	}
        </script>

    </head>
    
    <body>
  
    	<!-- <div id="header">
    		<h1><?=$projectheading;?></h1>
    	</div> -->
		<div id="formContainer">
			<form id="login" method="post" action="./includes/login_ajx.php" autocomplete="off">
				<a href="#" id="flipToRecover" class="flipLink">Forgot?</a>
				<input type="text" name="username" id="username" value="username" onfocus="this.value='';" onblur="userForm(this)" />
				<input type="password" name="password" id="password" value="password" onfocus="this.value='';" onblur="userForm(this)" />
				<input type="submit" name="Submit" value="Login" onclick="document.getElementById('login').submit()" />
				<input type="checkbox" id="remember_me" name="remember_me" value="" label="Remember me" onclick="doRemember(this)"/><div id="rememberme">Remember me</div>
			</form>
			<form id="recover" method="post" action="./">
				<a href="#" id="flipToLogin" class="flipLink">Forgot?</a>
			</form>			
			<div id="err">
				<?
				if($_REQUEST && $_REQUEST['msg']!=''){
					echo $_REQUEST['msg'];
				}
				?>
			</div>
		</div>

        <footer>
	        <h2><i>&copy; <?=date("Y");?></i> Mansion Management System</h2><br/>
            <a class="tzine" href="http://www.amofly.com" target="_blank">Powered by <i>Amo<b>Fly</b></i></a>
        </footer>
<?php	
if(!$_REQUEST && $_REQUEST['msg']==''){
	//check that if the cookie is set. If so, just authenticate the user
	//else take to the login page
	$cook_val = $_COOKIE["cook"];
	$cook_arr = explode(',',$cook_val);
	// print_r($cook_arr);
	// echo $_SERVER['HTTP_REFERER'];
	if($cook_arr[0]!="" && $cook_arr[1]!="")
	{
		?>
		<script type="text/javascript">
		$('#username').val("<?=$cook_arr[0];?>");
		$('#password').val("<?=$cook_arr[1];?>");
		// console.log("<?=$cook_arr[1];?>");
		</script>	
		<?
		// echo $_SERVER['HTTP_REFERER'];
		$parts = explode('/', $_SERVER["HTTP_REFERER"]);
		$file = $parts[count($parts) - 1];	
		if($file!="logout.php"){	
			// ob_start();
			?>
			<script type="text/javascript">
			// console.log("here3");
			window.location.href="./includes/login_ajx.php";
			</script>
			<?
			//header("location: ./includes/login_ajx.php");
			//exit;
			// ob_end_flush();
		}else{
			?>		
			<!-- <script type="text/javascript" src="scripts/login.js"></script> -->
			<?php
		}	
	}
	else{
	?>		
	<!-- <script type="text/javascript" src="scripts/login.js"></script> -->
	<?php
	}
}
?>          


    </body>
</html>

