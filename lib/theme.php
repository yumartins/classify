<?php 
  function theme () {
    wp_enqueue_style('classify-css', plugins_url('dist/index.css', __FILE__));
  }

  add_action ('admin_enqueue_scripts', 'theme');
?>