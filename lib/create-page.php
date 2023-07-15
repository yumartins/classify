<?php 
  function classify_page() {
    register_post_type('classify', array(

      'labels' => array(
        'name' => __('Classificados'),
        'singular' => __('Classificado')
      ),

      'supports' => array(
        'title'
      ),

      'public' => true,
      'rewrite' => array(
        'slug' => 'classify'
      ),
      'menu_icon' => 'dashicons-welcome-widgets-menus',
      'rest_base' => 'create',
      'has_archive' => true,
      'description' => 'Listagem dos classificados salvos.',
      'show_in_rest' => true,
      'rest_namespace' => 'classify',
    ));

  };

  add_action('init', 'classify_page');
?>