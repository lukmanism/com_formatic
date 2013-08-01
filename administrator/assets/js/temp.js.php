<?php
	// session_destroy();
	// exit;


	if(!session_start()){
		session_start();
	}

	$rowid = @$_GET['row'];
	$token 	= $_GET['token'];

	switch($_GET['method']){
		case 'store':
			if(!isset($_SESSION[$token])){
				session_unset();
				$_SESSION[$token];
			}
			$_SESSION[$token][$rowid] = $_POST;
			echo json_encode($_SESSION[$token]);
		break;
		case 'load':
			if(!isset($_SESSION[$token])){
				session_unset();
				$_SESSION[$token];
			}
			$_SESSION[$token][$rowid] = $_POST;
			echo json_encode($_SESSION[$token][$rowid]);
		break;
		case 'position':
			foreach($_POST as $key => $values){
				$temp[$token][$key] = $_SESSION[$token][$values];
				unset($_SESSION[$token][$values]);
			}			
			$_SESSION = $temp;
			echo json_encode($_SESSION[$token]);
		break;
		case 'update':
		foreach($_POST as $pName => $pValue){
			$v2 	= explode("\n", $pValue);
			$v2		= array_filter($v2);
			if($pName == 'values' || $pName == 'labels'){
					$values = 'labels';
					$labels = 'values';
				$l1 	= (!empty($_SESSION[$token][$rowid][$labels]))? explode("\n", $_SESSION[$token][$rowid][$labels]): $v2;
				$v1 	= (!empty($_SESSION[$token][$rowid][$values]))? explode("\n", $_SESSION[$token][$rowid][$values]): $v2;
				$diff = array_diff($v1,$v2);
				if(!empty($diff)){
					foreach ($diff as $key => $value) {
						$thatkeys = array_keys($v1, $diff[$key]);
						if(count($l1) != count($v2)){
							unset($l1[$thatkeys[0]]);						
						}
					}					
				} else {
					$diff2 = array_diff($v2,$v1);
					foreach ($diff2 as $key => $value) {
						$thatkeys = array_keys($v2, $diff2[$key]);
						array_splice($l1, $thatkeys[0], 0, $value); 
					}
				}
				$_SESSION[$token][$rowid][$labels] = implode("\n",$l1);
			}
			$_SESSION[$token][$rowid][$pName] = implode("\n",$v2);		
		}
		echo json_encode($_SESSION[$token][$rowid]);
		break;
		case 'get':
			// echo json_encode($_SESSION);
			echo json_encode($_SESSION[$token][$rowid]);
		break;
		case 'push':
			echo json_encode($_SESSION[$token]);
		break;
		case 'delete':
			$temp = $_SESSION[$token];
			session_destroy();
			unset($temp[$rowid]);
			$x = 1;
			foreach ($temp as $key => $value) {
				$temp2[$x] = $value;
				$x++;
			}
			$_SESSION[$token] = $temp2;
			echo json_encode($_SESSION[$token]);
		break;
	}
?>