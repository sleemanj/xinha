<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>Example of Xinha</title>
  <link rel="stylesheet" href="full_example.css" />
</head>
</body>
<?php
	foreach($_REQUEST as $key=>$value){
	  if(substr($key,0,10) == 'myTextarea') {
      echo '<h3 style="border-bottom:1px solid black;">'.$key.'(source):</h3><xmp style="border:1px solid black; width: 100%; height: 200px; overflow: auto;">'.$value.'</xmp><br/>';
			echo '<h3 style="border-bottom:1px solid black;">'.$key.'(preview):</h3>'.$value;
    }
  }
?>
</body>
</html>