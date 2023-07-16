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
        'title',
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
      $post = get_post();

      $data = get_post_meta($post->ID);
  
      $data = array_combine(array_keys($data), array_column($data, '0'));
      ?>
        <div id="classify-detail"></div>

        <script type="module" src="<?php echo plugin_dir_url(__DIR__) ?>dist/detail.js"></script>

        <script type="module">
          window.sessionStorage.setItem('classify-form', JSON.stringify(<?php echo json_encode($data) ?>))
        </script>
      <?php
    }

    add_meta_box('classify-content', 'Informações', 'fields', 'classify');
  }
}

if(is_admin())
  $classify_detail_page = new ClassifyDetailPage();
?>