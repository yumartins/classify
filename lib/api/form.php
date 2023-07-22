<?php 
  function upload($file, $filename, $post_id) {
    $file_extension_type = array('jpg', 'jpeg', 'jpe', 'png', 'bmp');

    $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($file_extension, $file_extension_type)) {
      return wp_send_json(array(
        'message' => __('The uploaded file is not a valid file. Please try again.'),
        'filename' => esc_html($file['name']),
      ), 400);
    }

    $attachment_id = media_handle_upload($filename, $post_id, []);

    if (is_wp_error($attachment_id)) {
      return wp_send_json(array(
        'message' => $attachment_id->get_error_message(),
        'filename' => esc_html($file['name']),
      ), 400);
    }

    $attachment = wp_prepare_attachment_for_js($attachment_id);
    
    if (!$attachment) {
      return wp_send_json(array(
        'message' => __('Image cannot be uploaded.'),
        'filename' => esc_html($file['name']),
      ), 400);
    }

    return $attachment;
  }

  function save_form(WP_REST_Request $request) {
    $params = json_decode($request->get_body(), true);

    $address = array(
      'city' => $params['address']['city'],
      'state' => $params['address']['state'],
      'street' => $params['address']['street'],
      'number' => $params['address']['number'],
      'neighborhood' => $params['address']['neighborhood'],
    );

    $data = wp_insert_post(array(
      'post_type' => 'classify',
      'post_title' => $params['name'],
      'meta_input' => array(
        'body' => $params['body'],
        'city' => $params['city'],
        'state' => $params['state'],
        'email' => $params['email'],
        'phone' => $params['phone'],
        'title' => $params['title'],
        'endAt' => $params['endAt'],
        'street' => $params['street'],
        'number' => $params['number'],
        'startAt' => $params['startAt'],
        'logoType' => $params['logoType'],
        'category' => $params['category'],
        'bodyType' => $params['bodyType'],
        'titleType' => $params['titleType'],
        'subscriber' => $params['subscriber'],
        'neighborhood' => $params['neighborhood'],
        'numberOfColumns' => $params['numberOfColumns'],
      ),
    ));

    if ($data && !is_wp_error($data)) {
      return wp_send_json(array(
        'id' => $data,
      ));
    }
  }

  function upload_files() {
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');

    $logo = null;
    $gallery = [];
    $post_id = $_POST['post_id'];

    $gallery_files = $_FILES['gallery'];

    if (isset($_FILES['logo'])) {
      $logo = upload($_FILES['logo'], 'logo', $post_id);
    }

    if (isset($gallery_files)) {
      foreach($gallery_files['name'] as $key=>$value) {
        $file = array(
          'name' => $gallery_files['name'][$key],
          'type' => $gallery_files['type'][$key],
          'size' => $gallery_files['size'][$key],
          'error' => $gallery_files['error'][$fkeyile],
          'tmp_name' => $gallery_files['tmp_name'][$key],
        );

        $_FILES = array('upload_gallery' => $file);

        $data = upload($file, 'upload_gallery', $post_id);

        array_push($gallery, $data);
      }
    }

    return wp_send_json(array(
      'logo' => $logo,
      'gallery' => $gallery,
      'post_id' => $post_id,
    ));
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/form', array(
      'methods' => 'POST',
      'callback' => 'save_form',
    ));

    register_rest_route('classify', '/upload', array(
      'methods' => 'POST',
      'callback' => 'upload_files',
    ));
  });
?> 