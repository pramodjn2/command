var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var ip = require("ip");
var mysql = require('mysql'); 
var request     = require('ajax-request'); // ubunto
const requests = require('request'); // cento s
var http = require('http');
var async = require("async");
var cors = require('cors');

var app = express();
app.use(cors())

var server = http.createServer(app);
var io = require('socket.io').listen(server);

//io.set('transports', ['websockets']);
var cron = require('node-cron');
var multer = require('multer');
var fs = require('fs');
var formidable = require('formidable');
var moment = require('moment');
var momentTimeZone = require('moment-timezone');
momentTimeZone.tz.setDefault("Asia/Calcutta");
const v = require('node-input-validator');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/users',express.static(__dirname + '/users'));
app.use('/images',express.static(__dirname + '/images'));
app.use('/chat_images',express.static(__dirname + '/chat_images'));
app.use('/presciption',express.static(__dirname + '/presciption'));
app.use('/lab_reports',express.static(__dirname + '/lab_reports'));
app.use('/radiology_reports',express.static(__dirname + '/radiology_reports'));

var con = require('./config');
var base_url = "";
var room = []

var FCM          = require('fcm-node');
var serverKey    = "AAAARkEYKUI:APA91bGwi3ndieduFg6gFYAlHjBWuV5-JCwI4qO0IuwUCisIgZQJll6oF7guAs-FWDJz9ZkoxYE44qqxs65LEvfJF74Ld3rrfK2DrUhZakOh-eTSbnupXG9-MZEH-xE4wOuxwtIrVlrd";
var fcm          = new FCM(serverKey);
var constant     = require('./routes/constant');


/*var whitelist = ['http://evil.com/']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
*/


app.all('/*', function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*"); 
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', false);



  /* start version check */
  if(req.headers.version != '1'){
       res.json({
        status:0,
        error_code:460,
        error_line:3,
        message:constant.NEW_VERSION
      })
      return true;
  } 

  /*if(req.headers.userid == '46'){
    return false;
  }*/
  /* end version check */
  //console.log(req.headers)
  if (typeof req.headers.userid !== 'undefined' && req.headers.userid.length > 0) {
      let sql = "SELECT u.* from user as u where u.id = '"+req.headers.userid+"' && status = 'Disable'";
      con.query(sql, function (err, result) {
        if (err) {
        }else{
          if(result && result.length > '0'){
              res.json({
                  status:0,
                  error_code:461,
                  error_line:3,
                  message:constant.ACCOUNT_BLOCK_BY_ADMIN
              })
              return true;
          }else{
            next();
          }
        }
      });
  }else{
    next();
  }

  /* start token no check */
  var originalUrl = req.originalUrl;
    console.log(originalUrl);
    console.log(req.body);
  /*  
    next();*/
  /* end token no check */
});

// file include
var common = require('./routes/common');
var userController = require('./routes/user');
var manageController = require('./routes/manage');
var articleController = require('./routes/article');
var doctorController = require('./routes/doctor');
var followFollowingController = require('./routes/followFollowing');
var blockUsersController = require('./routes/blockUsers');
var notificationController = require('./routes/notification');
var appointmentController = require('./routes/appointment');
var postFromController = require('./routes/postFrom');
var presciptionController = require('./routes/presciption');
var reminderController = require('./routes/reminder');
var radiologyReportController = require('./routes/radiologyReport');
var labreportController       = require('./routes/labreport');
var referController  = require('./routes/referController');


// api start

//Refer apis
app.post('/api/refer-patient',referController.referPatient);
app.post('/api/refer-by-you',referController.referByYou);
app.post('/api/refer-to-you',referController.referToYou);
app.post('/api/user-detail-list',userController.particulardetail);
app.post('/api/medicine-search',userController.medicineSearch);
app.post('/api/presciption-timeslot',manageController.timeslot);

// manage
app.get('/',userController.user);
app.get('/api/user-list',manageController.userList);
app.get('/api/week',manageController.getWeeks);
app.get('/api/country',manageController.getCountries);
app.get('/api/registration-council',manageController.getRegistrationCouncil);
app.get('/api/qualification',manageController.getQualification);
app.get('/api/specialties',manageController.getSpecialties);
app.get('/api/relatives',manageController.getRelative);
app.get('/api/contact-us',manageController.contactUs);
app.get('/api/help-support',manageController.helpSupport);
app.post('/api/pages',manageController.getPages);

//notification
app.post('/api/notification-list',notificationController.notificationList);
app.post('/api/notification-read',notificationController.notificationRead);
app.post('/api/notification-clear',notificationController.notificationDelete);

// article
app.post('/api/article-add',postFromController.articleSave);
app.post('/api/article-update',postFromController.articleUpdate);
app.post('/api/my-article-time-line-list',articleController.articleTimeLinePostList);
app.post('/api/time-line-list',articleController.articleTimeLineList);
app.post('/api/article-like',articleController.articleLike);
app.post('/api/comment-add',articleController.commentAdd);
app.post('/api/comments-list',articleController.commentsList);
app.post('/api/article-delete',articleController.articleDelete);
app.post('/api/article-share-status',articleController.articleShareStatus);
app.post('/api/article-comment-like',articleController.articleCommentLike);

// relative
app.post('/api/relative-add',postFromController.relativeSave);
app.post('/api/relative-update',postFromController.relativeUpdate);
app.post('/api/relatives-list',userController.relativesList);

// user
app.post('/api/user-details',userController.userdetails);

app.post('/api/registration',userController.registration);
app.post('/api/login',userController.login);
app.post('/api/forgot-password',userController.forgotPassword);
app.post('/api/otp-verify',userController.otpVerify);
app.post('/api/change-password',userController.changePassword);
app.post('/api/update-lat-long',userController.updateLatLong);
app.post('/api/profile-update',postFromController.profileUpdate);
app.post('/api/profile-image-update',postFromController.profileImageUpdate);

// block and unblock request - follow & followers request
app.post('/api/send-following',blockUsersController.sendFollowing);
app.post('/api/send-un-following',blockUsersController.sendUnFollowing);
app.post('/api/follow-following-list',followFollowingController.followFollowingList);
app.post('/api/pendding-user-request',followFollowingController.penddingUserRequest);
app.post('/api/accept-request',blockUsersController.acceptRequest);
app.post('/api/reject-request',followFollowingController.rejectRequest);
app.post('/api/block-user',blockUsersController.blockUser);
app.post('/api/unblock-user',blockUsersController.unblockUser);
app.post('/api/block-user-list',followFollowingController.blockUserList);
app.post('/api/follow-following-search',followFollowingController.followFollowingSearch);

//search
app.post('/api/common-search',userController.commonSearch);

// user block
app.post('/api/block-user-profile',blockUsersController.blockUserProfile);
app.post('/api/un-block-user-profile',blockUsersController.unBlockUserProfile);

//doctor
app.post('/api/all-users-listing',doctorController.allUsersListing);
app.post('/api/doctor-complete-registration',doctorController.doctorCompleteRegistration);
app.post('/api/search-doctor',doctorController.searchDoctor);
app.post('/api/doctor-all-count',doctorController.doctorAllCount);
app.post('/api/doctor-profile',doctorController.doctorProfile);
app.post('/api/doctor-clinic',doctorController.doctorClinicInfo);
app.post('/api/submit-rating-review',doctorController.ratingReviewSubmit);
app.post('/api/get-rating-review',doctorController.ratingReviewGet);
app.post('/api/get-doctorPofile',doctorController.webprofile);

app.post('/api/get-doctor-block-week-days',doctorController.getBlockWeekDaysList);
app.post('/api/delete-week-time-slote',doctorController.deleteWeekTimeSlote);

// doctor profile update
app.post('/api/doctor-info',doctorController.doctorInfo);
app.post('/api/block-days',doctorController.insertBlockDays);
app.post('/api/basic-info-update',doctorController.updateDoctorInfo);
app.post('/api/clinic-info-update',doctorController.updateClinicInfo);
app.post('/api/education-info-update',doctorController.updateEducationInfo);
app.post('/api/medical-info-update',doctorController.updateResgistrationInfo);

app.post('/api/update-week-days',doctorController.updateWeekDays);
app.post('/api/update-time-slot',doctorController.updateTimeSlot);
app.post('/api/get-block-details',doctorController.getBlockDetails);

// appointment 
app.post('/api/appointment-select',appointmentController.selectAppointment);
app.post('/api/add-patient',appointmentController.addPatient);
app.post('/api/appointment-create',appointmentController.createAppointment);
app.post('/api/appointment-reschedule',appointmentController.rescheduleAppointment);
app.post('/api/appointment-cancel',appointmentController.cancalAppointment);
app.post('/api/appointment-history',appointmentController.historyAppointment);
app.post('/api/appointment-detail',appointmentController.detailAppointment);

app.post('/api/doctor-appointment-history',appointmentController.historyDoctorAppointment);
app.post('/api/doctor-appointment-cancel',appointmentController.cancalDoctorAppointment);
app.post('/api/doctor-add-patient',appointmentController.doctorAddPatient);

//presciption
app.post('/api/add-presciption',postFromController.addPresciption);
app.post('/api/update-presciption',postFromController.updatePresciption);
app.post('/api/list-presciption',presciptionController.listPresciption);
app.post('/api/delete-presciption',presciptionController.deletePresciption);

//medical presciption
app.post('/api/add-medical-presciption',presciptionController.addMedicalPresciption);

//Radiology-reports
app.post('/api/list-radiology-report',radiologyReportController.listRadiologyReport);
app.post('/api/add-radiology-report',radiologyReportController.addRadiologyReport);
app.post('/api/update-radiology-report',radiologyReportController.updateRadiologyReport);
app.post('/api/delete-radiology-report',radiologyReportController.deleteRadiologyReport);

// addlab_report
app.post('/api/add-lab-report',labreportController.addlab_report);
app.post('/api/update-lab-report',labreportController.updatelab_report);
app.post('/api/list-lab-report',labreportController.listlabreport);
app.post('/api/delete-lab-report',labreportController.deletelabreport);

//reminder
app.post('/api/add-reminder',reminderController.addReminder);
app.post('/api/update-reminder',reminderController.updateReminder);
app.post('/api/delete-reminder',reminderController.deleteReminder);

//medical
app.post('/api/add-medical-visit-form',userController.addmedicalvisit);
app.post('/api/update-medical-visit-form',userController.updatemedicalvisit);
app.post('/api/list-medicine-presciption',doctorController.listmedicinepresciption);

// chat 
app.post('/api/chat-friends',userController.chatFriends);
app.post('/api/getChats',userController.getChats);
app.post('/api/checkFriendStatus',userController.checkFriendStatus);
app.post('/api/chat-friend-remove',userController.chatFriendRemove);
app.post('/api/chat-friend-block-mute',userController.chatFriendBlockMute);
app.post('/api/update-setting',userController.updateSetting);
// api end

cron.schedule('0 * * * *', function(){
  function cronDeleteTempAppointment(){
      var date        = new Date();
      var durationInMinutes   = 5;
      var startTime       = Math.floor(date.setDate(date.getDate()) / 1000);
      var beforeTime      = Math.floor(date.setMinutes(date.getMinutes() - durationInMinutes) / 1000);
      if(beforeTime != ''){
        var deleteSql = "DELETE from appointment_temp where create_dt <= "+beforeTime;
        con.query(deleteSql, function(err,result){ });
      }
  }
  cronDeleteTempAppointment();
});


cron.schedule('*/15 * * * *', function(){
  function cronAppointmentStatusChanges(){
    var nornal_date     = new Date().getTime();
    nornal_date     = parseInt(nornal_date);
    var nornal_date_new = moment(nornal_date).format('YYYY-MM-DD');
    let sql_main = "SELECT * FROM appointment where appointment_date < '"+nornal_date_new+"' && appointment_status = '7' limit 25";
    con.query(sql_main, function (err, result) {
     if(result && result.length > 0){
        result.forEach(function(item){
             let update_query = "UPDATE appointment SET appointment_status = '5' WHERE id = '"+item.id+"' ";
             con.query(update_query, function (err, result) {
           });  
       });
     }
   });
  }
  cronAppointmentStatusChanges();
});


/* image upload */
  const DIR = './public/chat_images/';
  let storage = multer.diskStorage({
      destination: function (req, file, callback) {
        callback(null, DIR);
      },
      filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
  });
   
  let upload = multer({storage: storage});

  app.post('/api/image/upload',upload.single('file'), function (req, res) {
   message : "Error! in image upload.";
   console.log(req.file);
   var insertId;
      if (!req.file) {
          message = "Error! in image upload."
          res.json({
          status:0,
          message:message,
        });
        } else {
     res.json({
            status:1,
            message:'Successfully! image uploaded!',
            results:req.file.filename
          });

    }
  });
/* end */


// socket start
io.sockets.on('connection', function(socket) {
 
  // room connect
  socket.on('room', function (room) {
    console.log(room + ' joined the chat.');
    socket.room = room;
    socket.join(room);
  });

  // typing
  socket.on('typing', function(request) {
    var group_id = request.group_id;
    var sender_id = request.sender_id;
    var sender_name = request.sender_name;
    var message = request.message ? request.message : 'Typing..';
    io.sockets.in(group_id).emit('responce_typing', {status : 1, group_id : group_id, sender_id : sender_id, message : message});
  });

  // online status and time update
  socket.on('onlineTimeUpdate', function(request) {
    var user_id = request.userid;
    var onlineStatus = request.onlineStatus ? request.onlineStatus : 'Offline';
    var user_online = 1;

      if(onlineStatus == 'Offline'){
       user_online = 0;
      }
      let dt = new Date().getTime() / 1000;
          dt = Math.floor(dt);
      let sql = "UPDATE user SET onlineStatus = '"+onlineStatus+"', onlineTime = '"+dt+"' WHERE Id = '"+user_id+"'";
      con.query(sql, function (err, result) {
        if (err){
          throw err;  
        }
        socket.broadcast.emit('responce_updateTime', {status : 1, userid : user_id, onlineStatus : onlineStatus, updatedtime : dt});
      });
  });

  // get chat
  socket.on('getChat', function(request) {
     var chatRoomId = request.group_id;
     var sender_id = request.sender_id;
     getChats(chatRoomId,sender_id);
  });

  // get one to one chat
  function getChats(chatRoomId,sender_id, limit=10){
    let sql =  "select *,(select count(id) from message where chatRoomId = '"+chatRoomId+"' ) as total_records from (select * from message where chatRoomId = '"+chatRoomId+"'  ORDER BY id DESC limit "+limit+") tmp order by tmp.id asc";
      con.query(sql, (error, results, fields) => {
        if (error) {
            //return console.error(error.message);
        }
        io.sockets.in(chatRoomId).emit('responce_chat', {status : 1, is_group : 0, results : results});
      });
  }

  // Send chat
  socket.on('sendChat', function(request) {
    saveChatInDatabase(request.sender_id, request.receiver_id, request.group_id, request.message, request.is_group, request.sender_name, request.msgType, request.lat, request.lang, request.mute);
  });

  // Save chat function 
  function saveChatInDatabase(sender_id, receiver_id, group_id, message, is_group = '0', sender_name = '', msgType = 'text', lat = '', lang = '', mute = '0') {

   var  new_date = Date.now();
   new_date = new_date / 1000; 
   new_date = Math.floor(new_date);
   message=mysql_real_escape_string(message);

   unreadCount(group_id, receiver_id, sender_id, message, msgType);
   let sql = "INSERT INTO message(chatRoomId, senderId, receiverId, msg, sendTimestamp ,senderName, msgType, lat, lang)VALUES('"+group_id+"', '"+sender_id+"', '"+receiver_id+"', '"+message+"', '"+new_date+"', '"+sender_name+"', '"+msgType+"', '"+lat+"', '"+lang+"')";
    con.query(sql, function (err, result) {
      if (err) throw err;
        getChatsChatingTime(group_id,sender_id,1, 0, message, msgType, receiver_id);
 
            
            var sql = "SELECT * FROM chatRoom where group_id = '"+group_id+"' && receiver_id = '"+receiver_id+"' &&  reciver_mute = '0'";
            con.query(sql, (error, results, fields) => {
              if(results && results.length>0){
                send_notification(sender_id, receiver_id, group_id, message, sender_name, msgType, mute);
              }else{
                var sql = "SELECT * FROM chatRoom where group_id = '"+group_id+"' && sender_id = '"+receiver_id+"' &&  sender_mute = '0'";
                con.query(sql, (error, results, fields) => {
                  if(results && results.length>0){
                    send_notification(sender_id, receiver_id, group_id, message, sender_name, msgType, mute);
                  }
                });

              }
            });
     
    });
  }

  // one ot one 
  function send_notification(sender_id, receiverId, group_id, msg, sender_name, msgType = 'text'){
   
    let sql = "select (select profile_img from user where id= '"+sender_id+"') as profile_img, u.id as user_id, u.device_token, u.device_type from user as u WHERE u.id = '"+receiverId+"' && device_token != '' && device_type != '' && chat_status = '0'";
    con.query(sql, (error, results, fields) => {
        if(results && results.length>0){
          for (var i =0; results.length>i; i++) {
              
                var device_token = results[i].device_token;
                var profile_image = results[i].profile_img;
                var device_type = results[i].device_type;

                if(msgType == 'location'){
                   var bodyContent  = 'share live location';
                   var title        = sender_name +" share live location";
                }else if(msgType == 'image'){
                   var bodyContent  = 'https://facemednode.consagous.co.in/chat_images/'+msg;
                   var title        = sender_name +" send new image ";
                }else{
                  var bodyContent  = msg;
                  var title        = sender_name +" send new message ";
                }

                if(device_type == 'ios'){
                    if(msgType == 'image'){
                      var bodyContent  = 'share new image';
                    }
                        var message = {to: device_token,
                                  collapse_key: 'true',
                                   notification:{
                                      'notification_slug' : 'Custom_Notification',
                                      'group_id' : group_id,
                                      'sender_id' : sender_id,
                                      'title': title,
                                      'body': bodyContent,
                                      'msg': bodyContent,
                                      'profile_image' : profile_image,
                                      'user_name' : sender_name,
                                      'is_group' : 0,
                                      'msgType' : msgType,
                                      'sound' : 'default'                                       
                                    }
                                };
                      fcm.send(message, function(err, response){
                      if (err) {
                        console.log("Something has gone wrong!",err);
                      } else {
                        console.log("Successfully sent with response: ", response);
                      }
                    });
                }else if(device_type == 'android'){
                    var message = {to: device_token,
                                  collapse_key: 'true',
                                   data:{
                                      'notification_slug' : 'Custom_Notification',
                                      'group_id' : group_id,
                                      'sender_id' : sender_id,
                                      'title': title,
                                      'body': bodyContent,
                                      'msg': bodyContent,
                                      'profile_image' : profile_image,
                                      'user_name' : sender_name,
                                      'is_group' : 0,
                                      'msgType' : msgType,
                                      'sound' : 'default'                                       
                                    }
                                };
                      fcm.send(message, function(err, response){
                      if (err) {
                        console.log("Something has gone wrong!",err);
                      } else {
                        console.log("Successfully sent with response: ", response);
                      }
                    });
                }
             
          }
       }
    });
    return true;
  }

  mysql_real_escape_string =function (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
       switch (char) {
           case "\0":
               return "\\0";
           case "\x08":
               return "\\b";
           case "\x09":
               return "\\t";
           case "\x1a":
               return "\\z";
           case "\n":
               return "\\n";
           case "\r":
               return "\\r";
           case "\"":
           case "'":
           case "\\":
           case "%":
               return "\\"+char; // prepends a backslash to backslash, percent,
                                 // and double/single quotes
       }
    });
  }


  function unreadCount(group_id, receiver_id, sender_id='', message = '', msgType = ''){
    let dt = new Date().getTime() / 1000;
      dt = Math.floor(dt);

    let sql =  "select * from unreadCount WHERE chatroomId = '"+group_id+"'  AND userId = '"+receiver_id+"'";
    con.query(sql, (error, results, fields) => {
    if (error) {
        throw error; 
    }
      if(results && results.length > 0){
        //update
        let sql = "UPDATE unreadCount SET unreadCount = unreadCount + 1, lastMessageTime = '"+dt+"' WHERE userId = '"+receiver_id+"' AND chatroomId = '"+group_id+"'";
          con.query(sql, function (err, result) {
            if (err){
              throw err;  
            }
          });

          var unreadCount = results[0].unreadCount;
          unreadCount = unreadCount + 1;
         // var lastMessageTime = results[0].lastMessageTime;
          var lastMessageTime = dt;
          socket.broadcast.emit('responce_unreadCount', {status : 1, line_number : 5001, group_id : group_id, sender_id : sender_id, unreadCount : unreadCount, message : message, msgType : msgType, lastMessageTime : lastMessageTime });
      }else{
        // insert
        socket.broadcast.emit('responce_unreadCount', {status : 1, line_number : 5031, group_id : group_id, sender_id : sender_id, unreadCount : '1', message : message, msgType : msgType, lastMessageTime : dt});

        let sql = "INSERT INTO unreadCount(userId, chatroomId, unreadCount, lastMessageTime)VALUES('"+receiver_id+"', '"+group_id+"', '1', '"+dt+"')";
        con.query(sql, function (err, result) {
          if (err) throw err;
          });
      }
    });
  }

  function getChatsChatingTime(chatRoomId, sender_id, limit=10, is_group = 0, message='', msgType='', receiver_id =''){
      let dt = new Date().getTime() / 1000;
           dt = Math.floor(dt);
      if(is_group == '0'){
       let sqlUpdate = "UPDATE chatRoom SET lastMsg = '"+message+"', messageType = '"+msgType+"', lastMessageTime = '"+dt+"' WHERE group_id = '"+chatRoomId+"'";
          con.query(sqlUpdate, function (err, result) {
            if (err){
              throw err;  
            }
          }); 
      }

      let sql =  "select *,(select count(id) from message where chatRoomId = '"+chatRoomId+"' ) as total_records from (select * from message where chatRoomId = '"+chatRoomId+"'  ORDER BY id DESC limit "+limit+") tmp order by tmp.id asc";
        con.query(sql, (error, results, fields) => {
      if (error) {
          //return console.error(error.message);
      }
      io.sockets.in(chatRoomId).emit('responce_chat', {status : 1, is_group : is_group, results : results});
      });
  }

// get chat acknowledgement 
socket.on('getChatAcknowledgement', function(request) {

    var chat_id = request.chat_id;
    var msgStatus = request.msgStatus ? request.msgStatus : 1;
    var group_id = request.group_id;
    let dt = new Date().getTime() / 1000;
         dt = Math.floor(dt);
    var user_id = request.user_id;

    if(msgStatus == '2' ){
       getUnreadCount(group_id,user_id);
       let sql = "UPDATE message SET msgStatus = '"+msgStatus+"', readTimestamp = '"+dt+"' WHERE id = '"+chat_id+"'";
       con.query(sql, function (err, result) {
          if (err){
            throw err;  
          }else{
            io.sockets.in(group_id).emit('responce_messageStatusUpdate', request);
          } 
        });
    }else if(msgStatus == '1' ){
       let sql = "UPDATE message SET msgStatus = '"+msgStatus+"', recieveTimestamp = '"+dt+"' WHERE id = '"+chat_id+"'";
       con.query(sql, function (err, result) {
          if (err){
            throw err;  
          }else{
            io.sockets.in(group_id).emit('responce_messageStatusUpdate', request);
          } 
        });
    }else{
        let sql = "UPDATE message SET msgStatus = '"+msgStatus+"', sendTimestamp = '"+dt+"' WHERE id = '"+chat_id+"'";
          con.query(sql, function (err, result) {
          if (err){
              throw err;  
          }else{
              io.sockets.in(group_id).emit('responce_messageStatusUpdate', request);
          } 
      });
    }
});

function getUnreadCount(group_id, user_id){

    let dt = new Date().getTime() / 1000;
         dt = Math.floor(dt);

    let sql =  "SELECT * FROM message where chatRoomId = '"+group_id+"' ORDER BY id  DESC";
    con.query(sql, (error, results, fields) => {
    if (error) {
        throw error; 
    }
      if(results && results.length > 0){
        //update
        let sql = "UPDATE unreadCount SET unreadCount = 0, lastMessageTime = '"+dt+"' WHERE chatroomId = '"+group_id+"' AND userId = '"+user_id+"'";
          con.query(sql, function (err, result) {
            if (err){
              throw err;  
            }
          });
      }
    });
}



});
/*end*/ 

var port = process.env.PORT || 4006; 
server.listen(port);
var ip = ip.address();
console.log('Magic happens at http://'+ip+':'+port);
