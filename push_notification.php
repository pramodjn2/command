 <?php
 function androidPush($message,$token,$title){
  //$message = $_POST['message'];
    $documentRoot = $_SERVER['DOCUMENT_ROOT'].'/project name/';
    require($documentRoot.'gcm/GCMPushMessage.php');
 
  $apiKey = "AAAAXR5umLM:APA91bE_SCP8_nQTretloYSAq_yANZLeFu0vY8NVieYasBNixdGBrrBFWsBkR0gKVonHi3RAoKUqgxZO6pdDsnQfXNdvCGxOvorffdAE5Jvg4ZhmBX7d41hbdChFwHHXrQX2BJE33gy1";


        $devices = array();
        $message = $message;
        
        $devices[] =$token;
//$message="dfdf";
        $an = new GCMPushMessage($apiKey);
        $an->setDevices($devices);
        $response = $an->send($message);
       // $var = json_decode($response);
        // if ($response->success == 1) {
        //     $success++;
        // }else {
        //     $failure++;
        // }

        return $response;
      /*$counter = 0;*/
        /* echo "Success = ".$success = $var->success."<br>";
        echo "Failure = ".$failure = $var->failure;   */ 

}

private function sendIosPush($message,$token,$title){
 $ch = curl_init("https://fcm.googleapis.com/fcm/send");
   //The device token.
   //token here
   //Title of the Notification.
   //$title = "Title Notification";
   //Body of the Notification.
   //$body = "This is the body show Notification";
   //Creating the notification array.
   $notification = array('title' =>$title , 'text' => $message);
   //This array contains, the token and the notification. The 'to' attribute stores the token.
   $arrayToSend = array('to' => $token, 'notification' => $notification,'priority'=>'high');
   //Generating JSON encoded string form the above array.
   $json = json_encode($arrayToSend);
   //Setup headers:
   $headers = array();
   $headers[] = 'Content-Type: application/json';
   $headers[] = 'Authorization: key= AAAAXR5umLM:APA91bE_SCP8_nQTretloYSAq_yANZLeFu0vY8NVieYasBNixdGBrrBFWsBkR0gKVonHi3RAoKUqgxZO6pdDsnQfXNdvCGxOvorffdAE5Jvg4ZhmBX7d41hbdChFwHHXrQX2BJE33gy1'; // key here
   //Setup curl, add headers and post parameters.
   curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");                                                                     
   curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
   curl_setopt($ch, CURLOPT_HTTPHEADER,$headers);  
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);     
   //Send the request
   $response = curl_exec($ch);
   //Close request
   curl_close($ch);
   return $response;
}