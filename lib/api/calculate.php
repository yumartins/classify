<?php 
  function calculate(WP_REST_Request $request) {
    $params = json_decode($request->get_body(), true);

    return wp_send_json($params);
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/calculate', array(
      'methods' => 'POST',
      'callback' => 'calculate',
    ));
  });
?> 