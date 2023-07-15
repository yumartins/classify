<?php 
  function classify_page() {
    register_post_type('classify', array(
      'labels' => array(
        'name' => __('Classificados'),
        'singular' => __('Classificado'),
        'new_item' => __('Novo classificado'),
        'add_new_item' => __('Adicionar novo classificado'),
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

  function classify_custom_fields() {
    function fields() {
      echo '<div id="classify-configuration"></div>';
      echo "<script type='module' src='". plugins_url('/dist/index.js', __FILE__) ."'></script>";
    }

    add_meta_box('classify-content', 'Informações', 'fields', 'classify');
  };

  add_action('init', 'classify_page');
  add_action('add_meta_boxes', 'classify_custom_fields');
?>