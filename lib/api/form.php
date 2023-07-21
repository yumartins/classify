<?php 
  function save_form(WP_REST_Request $request) {
    $params = json_decode($request->get_body(), true);

    $address = array(
      'city' => $params['address']['city'],
      'state' => $params['address']['state'],
      'street' => $params['address']['street'],
      'number' => $params['address']['number'],
      'neighborhood' => $params['address']['neighborhood'],
    );

    wp_insert_post(array(
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

    return $params;
  }

  add_action('rest_api_init', function() {
    register_rest_route('classify', '/form', array(
      'methods' => 'POST',
      'callback' => 'save_form',
    ));
  });
?> 