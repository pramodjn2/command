<?php include 'common/config.php';?>
<?php include 'Ajax.php';

$api_name = @$_GET['api_name'];
$user_id = @$_GET['user_id'];

if (empty($api_name) || empty($user_id)) {

	$st = array('status' => 0,
		'message' => 'Please send required parameters.',
	);
	dd(json_encode($st));
}

if ($api_name == 'getFriends' && !empty($user_id)) {
	$result = getChatUserFriends($mysqli, $user_id);
	if (!empty($result)) {
		$st = array('status' => 1,
			'result' => $result,
		);
	} else {
		$st = array('status' => 0,
			'message' => 'No friends found',
		);
	}
	dd(json_encode($st));
}

if ($api_name == 'getGroupFriends' && !empty($user_id)) {
	$result = getGroupUserFriends($mysqli, $user_id);
	if (!empty($result)) {
		$st = array('status' => 1,
			'result' => $result,
		);
	} else {
		$st = array('status' => 0,
			'message' => 'No group found',
		);
	}
	dd(json_encode($result));
}

?>