<?php 
  function save_configuration(WP_REST_Request $request) {
    $params = json_decode($request->get_body(), true);

    update_option('classify_configuration', $params);

    return $params;
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/configuration', array(
      'methods' => 'POST',
      'callback' => 'save_configuration',
    ));
  });
?> 