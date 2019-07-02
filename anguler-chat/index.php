<?php include 'common/config.php';?>
<?php include 'Ajax.php';

$chatFriends = getChatUserFriends($mysqli, $_SESSION['userId']);

$groupFriends = getGroupUserFriends($mysqli, $_SESSION['userId']);
//dd($groupFriends);
?>
<!DOCTYPE html>
<html>
<head>
	<title>Chat</title>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
  <script src="//netdna.bootstrapcdn.com/bootstrap/3.0.0/js/bootstrap.min.js"></script>


	<link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css">

	<!-- <script src="//code.jquery.com/jquery-1.11.1.min.js"></script> -->
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <link href="assets/css/style.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
  <script type="text/javascript">
    var userId = '<?php echo $_SESSION['userId']; ?>';
     var sender_name = '<?php echo ucfirst($_SESSION['name']); ?>';
  </script>
</head>
<body ng-app="myApp" ng-controller="myCtrl" ng-init="myCtrl" >

	<div class="container app">
		<div class="row app-one">
			<?php include 'friends.php';?>
			<?php include 'conversation.php';?>
		</div>
	</div>

<!-- Modal Start -->
<div class="modal fade" id="addGroupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Create Group</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-group">
            <label for="rgroup-name" class="col-form-label">Group Name:</label>
            <input type="text" class="form-control" name="group_name" id="group_name">
          </div>

           <div class="form-group">
            <label for="rgroup-image" class="col-form-label">Group Image:</label>
            <input type="file" class="form-control" name="group_image" id="group_image" style="height: 100%">
          </div>

        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Create Group</button>
      </div>
    </div>
  </div>
</div>
<!-- Modal End -->
<!-- 	<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script> -->
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.7.2/socket.io.js"></script>
	<script type="text/javascript">
		var app = angular.module('myApp', []);
		app.controller('myCtrl', function($scope, $http, $rootScope) {
			$scope.chatData = {};
      $scope.messagess = '';
      $scope.session_user_id = userId;
      $scope.chatData.sender_name = sender_name;

      $scope.chatData.receiver_name='';
      $scope.chatData.receiver_id='';
      $scope.chatData.sender_id='';
      $scope.chatData.group_id='';
      $scope.chatData.message='';
      $scope.chatData.is_group='';
      $scope.chatData.typing='';

			var socket = io.connect('http://192.168.1.20:3000/');
   		socket.on('connect', function() {
         socket.emit('room', userId);
         console.log('room connect')
			});


      // Typing
      var i= 0;
      $scope.chat_keyup = function(){
        console.log(i);

         var data = { message : 'Typing...',
                      group_id : $scope.chatData.group_id,
                      sender_name : $scope.chatData.sender_name,
                    }

         socket.emit('typing', data);
        i++;
      }

      socket.on('responce_typing', function(history) {
        console.log('responce_typing'+history);
           $scope.chatData.typing = history.message;
            $scope.$apply();
      });


      // Receiver chat
      socket.on('responce_chat', function(history) {
        console.log('responce_chat');
         console.log(history);
        if(history.status && (history.results.length > '0')){
              $scope.chatData.is_group = history.is_group;
              if($scope.messagess.length > '0'){
                 var chatRoomId = history.results[0].chatRoomId;
                 if(chatRoomId == $scope.chatData.group_id){
                   $scope.messagess = [].concat($scope.messagess , history.results)
                   let recieveTimestamp = history.results[0].recieveTimestamp;
                   if(recieveTimestamp < '1'){
                     var data = { chat_id : history.results[0].id,
                                  group_id : history.results[0].chatRoomId,
                                }
                     socket.emit('getChatAcknowledgement', data);
                   }
                  }
              }else{
                var chatRoomId = history.results[0].chatRoomId;
                if(chatRoomId == $scope.chatData.group_id){
                  $scope.messagess = history.results;
                }
              }
            $scope.$apply();
            $('#conversation').animate({
                      scrollTop: $('#conversation')[0].scrollHeight}, 2000);
        }
      });



      // Get chat group
      $scope.getChatGroup = function(sender_id, group_id, receiver_name, receiver_img) {
        $scope.chatData.group_id = group_id;
        $scope.chatData.sender_id = sender_id;
        $scope.chatData.receiver_name = receiver_name;
        $scope.chatData.img = receiver_img;
        $scope.chatData.is_group = 1;
        $scope.chatData.typing='';

        socket.emit('room', $scope.chatData.group_id);
       // console.log('room id' + $scope.chatData.group_id);

        if(group_id){
          var data = { group_id : $scope.chatData.group_id,
                    sender_id : $scope.chatData.sender_id,
                    is_group : 1
          }
          $scope.messagess = '';
          socket.emit('getChat', data);
        }
      };



      // Get chat
			$scope.getChat = function(sender_id, receiver_id, group_id, receiver_name, receiver_img) {
        $scope.chatData.group_id = group_id;
        $scope.chatData.sender_id = sender_id;
        $scope.chatData.receiver_id = receiver_id;
				$scope.chatData.receiver_name = receiver_name;
				$scope.chatData.img = receiver_img;
        $scope.chatData.is_group = 0;
        $scope.chatData.typing='';

        socket.emit('room', $scope.chatData.group_id);
       // console.log('room id' + $scope.chatData.group_id);

        if(group_id){
          var data = { group_id : $scope.chatData.group_id,
                    sender_id : $scope.chatData.sender_id,
                    is_group : 0
          }
          $scope.messagess = '';
          socket.emit('getChat', data);
        }

			};


      // Send chat
			$scope.chat_send = function() {
      	/*var dt = new Date().getTime()/1000;
        dt = Math.floor(dt);*/
        if($scope.chatData.message){
         var data = {
                sender_id :   $scope.chatData.sender_id,
                receiver_id : $scope.chatData.receiver_id,
                group_id :    $scope.chatData.group_id,
                message :     $scope.chatData.message,
                is_group :     $scope.chatData.is_group,
                sender_name :     $scope.chatData.sender_name,
        }
          socket.emit('sendChat', data);
				  $scope.chatData.message = '';
			  }
			}



      $scope.addGroup = function(){
        $('#addGroupModal').modal('show');
      }

		});
	/*	$(function(){
			$(".heading-compose").click(function() {
				$(".side-two").css({
					"left": "0"
				});
			});

			$(".newMessage-back").click(function() {
				$(".side-two").css({
					"left": "-100%"
				});
			});
		})*/
	</script>
	</body>
</html>