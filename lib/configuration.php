<?php
class ClassifyConfigurationPage {
  /**
   * Holds the values to be used in the fields callbacks
   */
  private $options;

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
    $this->options = get_option('my_option_name');
    ?>
    <div class="flex flex-col p-10 font-sans">
      <h1 class="!text-2xl font-medium text-gray-900 !p-0">Configuração dos classificados</h1>
      
      <div id="classify-configuration"></div>

      <script type="module" src="<?php echo plugins_url('dist/index.js', __FILE__)  ?>"></script>
    </div>
    <?php
  }
}

if(is_admin())
  $classify_configuration_page = new ClassifyConfigurationPage();
?>