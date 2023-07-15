<?php
class ClassifyConfigurationPage {
  /**
   * Start up
   */
  public function __construct() {
    add_action('admin_menu', array($this, 'add_plugin_page'));
  }

  /**
   * Add options page
   */
  public function add_plugin_page() {
    add_options_page(
      'Settings Admin', 
      'Classificados', 
      'manage_options', 
      'classify', 
      array($this, 'create_admin_page')
    );
  }

  /**
   * Options page callback
   */
  public function create_admin_page() {
    $data = get_option('classify_configuration');

    ?>
    <div class="classify flex flex-col p-10 font-sans">
      <h1 class="!text-2xl font-medium text-gray-900 !p-0">Configuração dos classificados</h1>
      
      <div id="classify-configuration"></div>

      <script type="module" src="<?php echo plugins_url('../dist/configuration.js', __FILE__)  ?>"></script>

      <script type="module">
        window.sessionStorage.setItem('classify-configuration', JSON.stringify(<?php echo json_encode($data) ?>))
      </script>
    </div>
    <?php
  }
}

if(is_admin())
  $classify_configuration_page = new ClassifyConfigurationPage();
?>