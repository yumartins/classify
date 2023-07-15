<?php 
class ClassifyFormPage {
  /**
   * Start up
   */
  public function __construct() {
    add_shortcode('classify-form', array($this, 'classify_form'));
  }

  /**
   * Instance shortcode
   */
  public function classify_form() {
    echo '<div id="classify-form"></div>';
    echo "<script type='module' src='". plugin_dir_url(__DIR__) ."dist/form.js'></script>";
  }
}

$classify_form_page = new ClassifyFormPage();
?>