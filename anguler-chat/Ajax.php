<?php

function dd($data) {
	echo '<pre/>';
	print_r($data);
	die;

}

/* One two one */
function getChatUserFriends($mysqli, $userId) {

	$sql = "SELECT * FROM chatRoom as c where (c.sender_id = '" . $userId . "' || c.receiver_id = '" . $userId . "') AND c.isGroup = '0' AND c.group_status = 'Active'";
	$query = $mysqli->query($sql);
	$data = '';
	$results = array();
	while ($row = mysqli_fetch_array($query)) {

		$id = $row['id'];
		$sender_id = $row['sender_id'];
		$receiver_id = $row['receiver_id'];
		$group_id = $row['group_id'];

		if ($sender_id != $userId) {
			$userInfo = getUserProfile($mysqli, $sender_id);

			$results[] = array('sender_id' => $userId,
				'receiver_id' => $sender_id,
				'group_id' => $group_id,
				'name' => $userInfo['name'],
				'profileImg' => $userInfo['profileImg'],
				'onlineTime' => $userInfo['onlineTime'],
			);
		} else if ($receiver_id != $userId) {
			$userInfo = getUserProfile($mysqli, $receiver_id);
			$results[] = array('sender_id' => $userId,
				'receiver_id' => $receiver_id,
				'group_id' => $group_id,
				'name' => $userInfo['name'],
				'profileImg' => $userInfo['profileImg'],
				'onlineTime' => $userInfo['onlineTime'],
			);
		}
	}

	return $results;
}

function getUserProfile($mysqli, $userId) {
	$sql = "SELECT * FROM user where id = '" . $userId . "'";
	$query = $mysqli->query($sql);
	return mysqli_fetch_array($query);

}

/* get group user frinds */
function getGroupUserFriends($mysqli, $userId) {
	//SELECT c.group_id, g.groupName, g.groupIcon,g.adminId FROM chatRoom as c join chatRoomGroup as g on c.group_id = g.group_id where (c.sender_id = '1' || c.receiver_id = '1') AND c.isGroup = '1' AND c.group_status = 'Active' group by c.group_id
	$sql = "SELECT c.id, c.sender_id, c.receiver_id, c.group_id, g.groupName, g.groupIcon,g.adminId  FROM chatRoom as c join chatRoomGroup as g on c.group_id = g.group_id where (c.sender_id = '" . $userId . "' || c.receiver_id = '" . $userId . "') AND c.isGroup = '1' AND c.group_status = 'Active' group by c.group_id";
	$query = $mysqli->query($sql);
	$data = '';
	$results = array();
	while ($row = mysqli_fetch_array($query)) {

		$id = $row['id'];
		$sender_id = $row['sender_id'];
		$receiver_id = $row['receiver_id'];
		$group_id = $row['group_id'];
		$groupName = $row['groupName'];
		$groupIcon = $row['groupIcon'];

		if ($sender_id != $userId) {
			//$userInfo = getUserProfile($mysqli, $sender_id);
			$results[] = array('group_id' => $group_id,
				'group_name' => $groupName,
				'groupIcon' => $groupIcon,
			);
		} else if ($receiver_id != $userId) {
			//$userInfo = getUserProfile($mysqli, $receiver_id);
			$results[] = array('group_id' => $group_id,
				'group_name' => $groupName,
				'groupIcon' => $groupIcon,
			);
		}
	}

	return $results;
}
?>
