<div class="col-sm-4 side">
	<div class="side-one">

		<div class="row heading">
			<div class="col-sm-6 col-xs-6 heading-avatar">
				<div class="heading-avatar-icon" >
					<img src="https://bootdey.com/img/Content/avatar/avatar1.png" style="float: left;">
					<p style="margin-left: 50px;"><?php echo ucfirst($_SESSION['name']); ?></p>
				</div>
			</div>
			<div class="col-sm-1 col-xs-1  heading-dot  pull-right">
				<i class="fa fa-plus pull-right" aria-hidden="true" ng-click="addGroup()"></i>
			</div>
			<!-- <div class="col-sm-2 col-xs-2 heading-compose  pull-right">
				<i class="fa fa-comments fa-2x  pull-right" aria-hidden="true"></i>
			</div> -->
		</div>

		<div class="row searchBox">
			<div class="col-sm-12 searchBox-inner">
				<div class="form-group has-feedback">
					<input id="searchText" type="text" class="form-control" name="searchText" placeholder="Search">
					<span class="glyphicon glyphicon-search form-control-feedback"></span>
				</div>
			</div>
		</div>

		<div class="row sideBar">
			<?php
if (!empty($chatFriends)) {
	foreach ($chatFriends as $key => $row) {
		$receiver_id = $row['receiver_id'];
		$group_id = $row['group_id'];
		$name = ucfirst($row['name']);
		$profileImg = $row['profileImg'];
		$onlineTime = $row['onlineTime'];
		//$time = time();
		//$diffTime = $time - $onlineTime;
		$onlineTime = date('Y-m-d h:i:s a', $onlineTime);
		?>
			<!-- sender_id, receiver_id, group_id, receiver_name, receiver_img -->
				<div class="row sideBar-body" ng-click="getChat('<?php echo $_SESSION['userId']; ?>','<?php echo $receiver_id; ?>', '<?php echo $group_id; ?>', '<?php echo $name; ?>', '<?php echo $profileImg; ?>');">
					<div class="col-sm-3 col-xs-3 sideBar-avatar">
						<div class="avatar-icon">
							<img src="<?php echo $profileImg; ?>">
						</div>
					</div>
					<div class="col-sm-9 col-xs-9 sideBar-main">
						<div class="row">
							<div class="col-sm-8 col-xs-8 sideBar-name">
								<span class="name-meta"><?php echo $name; ?>
								</span>
							</div>
							<!-- <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
								<span class="time-meta pull-right"><?php echo $onlineTime; ?>
								</span>
							</div> -->
						</div>
					</div>
				</div>
				<?php
}
}
?>


<div class="col-sm-12 col-xs-12 group-heading">
	Group
</div>
			<?php
if (!empty($groupFriends)) {
	foreach ($groupFriends as $key => $row) {
		$group_id = $row['group_id'];
		$group_name = ucfirst($row['group_name']);
		$profileImg = $row['groupIcon'];
		$onlineTime = date('Y-m-d h:i:s a', $row['onlineTime']);
		?>
			<!-- sender_id, group_id, receiver_name, receiver_img -->
				<div class="row sideBar-body" ng-click="getChatGroup('<?php echo $_SESSION['userId']; ?>','<?php echo $group_id; ?>','<?php echo $group_name; ?>', '<?php echo $profileImg; ?>');">
					<div class="col-sm-3 col-xs-3 sideBar-avatar">
						<div class="avatar-icon">
							<img src="<?php echo $profileImg; ?>">
						</div>
					</div>
					<div class="col-sm-9 col-xs-9 sideBar-main">
						<div class="row">
							<div class="col-sm-8 col-xs-8 sideBar-name">
								<span class="name-meta"><?php echo $group_name; ?>
								</span>
							</div>
							<!-- <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
								<span class="time-meta pull-right"><?php echo $onlineTime; ?>
								</span>
							</div> -->
						</div>
					</div>
				</div>
				<?php
}
}
?>
			</div>
		</div>
	</div>