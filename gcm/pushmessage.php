<?php
public function gcmMessage() {
    $documentRoot = $_SERVER['DOCUMENT_ROOT'].
    '/project name/';
    require($documentRoot.
        'gcm/GCMPushMessage.php');
    //$this->load->view('GCM Push/GCMPushMessage');

    $this->db->select('*');
    $this->db->order_by('content_id', 'desc');
    $result = $this->db->get('cms_content')->row_array();

    if (!empty($result['content_id'])) {
        $message = substr($result['content_title'], 0, 50);
        //$message = $result['content_title'];

        $id = $result['content_id'];
        $url = base_url().'page.php?id='.$id;
       
        $this->db->select('*');
        $this->db->from('user');
        $this->db->where('uid !=', '');
        $query = $this->db->get();
        $result = $query->result();

        $apiKey = "AAAA85lMU_4:APA91bEYi7GU8W03_wSZxl2t1Kx2TM4tkWEpGyqr-UuZ068pkjB7710g8rMVAgd4PhAcTQ5gPpUtQMUqESOOA9rwHWeccHK6Fhp5z_5TWQbccvJ11wmIADo-dSa_R-47mCfQ9pJs3fsu";

        $devices = array();
        foreach($result as $value) {
            $devices[] = $value->uid;
        }

        //print_r($devices); die;

        $an = new GCMPushMessage($apiKey);
        $an->setDevices($devices);
        $response = $an->send($message, array('id' => $id, 'url' => $url));
        echo $response;
    }
}
?>