<?php
//ini_set('max_execution_time', 7200);
$mysqli = new mysqli("localhost", "root", "", "chat");
if ($mysqli->connect_errno) {
	echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

session_start();

$id = @$_GET['id'];
if ($id == '1') {
	if (empty($_SESSION['userId'])) {
		$_SESSION['userId'] = '1';
		$_SESSION['name'] = 'pramod jain';
	}
} else if ($id == '2') {
	if (empty($_SESSION['userId'])) {
		$_SESSION['userId'] = '2';
		$_SESSION['name'] = 'Bhanuprakash';
	}
} else if ($id == '3') {
	if (empty($_SESSION['userId'])) {
		$_SESSION['userId'] = '3';
		$_SESSION['name'] = 'Anil';
	}
} else {
	if (empty($_SESSION['userId'])) {
		$_SESSION['userId'] = '1';
		$_SESSION['name'] = 'pramod jain';
	}
}
?>