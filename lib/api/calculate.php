<?php 
  function calculate(WP_REST_Request $request) {
    require_once 'estimate.php';

    $params = json_decode($request->get_body(), true);

    $amount = estimate($params);

    return wp_send_json(array(
      'amount' => $amount,
    ));
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/calculate', array(
      'methods' => 'POST',
      'callback' => 'calculate',
    ));
  });
?> 