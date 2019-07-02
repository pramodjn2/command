<div class="col-sm-8 conversation">
				<div class="row heading">
					<div class="col-sm-2 col-md-1 col-xs-3 heading-avatar">
						<div class="heading-avatar-icon">
							<img src="{{chatData.img}}">
						</div>
					</div>
					<div class="col-sm-8 col-xs-7 heading-name">
						<a class="heading-name-meta">{{chatData.receiver_name}}
						</a>
						<span class="heading-online" ng-if="chatData.is_group == '0'">Online</span>
					</div>
					<div class="col-sm-1 col-xs-1  heading-dot pull-right">
						<i class="fa fa-ellipsis-v fa-2x  pull-right" aria-hidden="true"></i>
					</div>
				</div>

				<div class="row message" id="conversation">
					<div class="row message-previous" ng-repeat = "message in messagess | limitTo:1">
						<div class="col-sm-12 previous" ng-if="messagess.length > '9'">
							<a onclick="previous(this)" id="ankitjain28" name="20">
								Show Previous Message! {{messagess.length}}
							</a>
						</div>
					</div>


					<div class="row message-body" ng-repeat = "message in messagess">
						<!-- sender -->
						<div class="col-sm-12 message-main-sender" ng-if="message.senderId == session_user_id">
							<div class="sender">
								<div class="message-text">
									<!-- <div class="text-right">
										{{message.senderName}}
									</div>
 -->
									<p ng-if="message.msgType == '' || message.msgType == 'text'"> {{message.msg}}</p>
									<p ng-if="message.msgType == 'image'">
										<img src="http://192.168.1.20:3000/images/{{message.msg}}" style="height: 300px; width: 300px;">
									</p>
									<p ng-if="message.msgType == 'audio'">
										<audio controls autoplay src="http://192.168.1.20:3000/audio/{{message.msg}}">
									        Your browser does not support the
									        <code>audio</code> element.
									    </audio>
									</p>


								</div>
								<span class="message-time pull-right">
									{{message.sendTimestamp*1000 | date:'MMM-d, HH:mm'}}
								</span>
							</div>
						</div>

						<!-- sender end -->
						<!-- receiver -->
						<div class="col-sm-12 message-main-receiver" ng-if="message.senderId != session_user_id">
							<div class="receiver">
								<div class="message-text">
									<div class="text-right" ng-if="chatData.is_group == '1'">
										{{message.senderName}}
									</div>

									<p ng-if="message.msgType == '' || message.msgType == 'text'"> {{message.msg}}</p>
									<p ng-if="message.msgType == 'image'">
										<img src="http://192.168.1.20:3000/images/{{message.msg}}" style="height: 300px; width: 300px;">
									</p>
									<p ng-if="message.msgType == 'audio'">
										<audio controls autoplay src="http://192.168.1.20:3000/audio/{{message.msg}}">
									        Your browser does not support the
									        <code>audio</code> element.
									    </audio>
									</p>


								</div>
								<span class="message-time pull-right">
									{{message.sendTimestamp*1000 | date:'MMM-d, HH:mm'}}
								</span>
							</div>
						</div>
						<!-- receiver end -->
					</div>
				</div>

				<div class="row reply">
					<!-- <p ng-model="chatData.group_id">{{chatData.group_id}}</p>
					<p ng-model="chatData.typing">{{chatData.typing}}</p> -->
					<form type="submit" ng-submit="chat_send()">
					<div class="col-sm-11 col-xs-11 reply-main">



						<textarea class="form-control" rows="1" id="message" ng-model="chatData.message" ng-keyup="chat_keyup();"></textarea>
						<input type="hidden" id="receiver_name" ng-model="chatData.receiver_name">
						<input type="hidden" id="receiver_id" ng-model="chatData.receiver_id">
						<input type="hidden" id="sender_id" ng-model="chatData.sender_id">
						<input type="hidden" id="group_id" ng-model="chatData.group_id">

					</div>

					<div type="submit" class="col-sm-1 col-xs-1 reply-send" ng-click="chat_send()">
						<i class="fa fa-send fa-2x" aria-hidden="true"></i>

					</div>
				</form>
				</div>
			</div>