<?php 
  function save_form(WP_REST_Request $request) {
    $params = json_decode($request->get_body(), true);

    wp_insert_post(array(
      'post_type' => 'classify',
      'post_title' => $params['name'],
      'meta_input' => array(
        'email' => $params['email'],
        'phone' => $params['phone'],
      ),
    ));

    return $params;
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/form', array(
      'methods' => 'POST',
      'callback' => 'save_form',
    ));
  });
?> 