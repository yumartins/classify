<?php
class ClassifyDetailPage {
  /**
   * Start up
   */
  public function __construct() {
    add_action('init', array($this, 'classify_page'));
    add_action('add_meta_boxes', array($this, 'classify_custom_fields'));
  }

  /**
   * Add page
   */
  public function classify_page() {
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
  }

  /**
   * Options page callback
   */
  public function classify_custom_fields() {
    function fields() {
      echo '<div id="classify-detail"></div>';
      echo "<script type='module' src='". plugin_dir_url(__DIR__) . "dist/detail.js'></script>";
    }

    add_meta_box('classify-content', 'Informações', 'fields', 'classify');
  }
}

if(is_admin())
  $classify_detail_page = new ClassifyDetailPage();
?>