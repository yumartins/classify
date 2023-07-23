<?php 
  function theme () {
    wp_enqueue_style('classify-css', plugins_url('dist/zod.css', __FILE__));
  }

  add_action ('wp_enqueue_scripts', 'theme');
  add_action ('admin_enqueue_scripts', 'theme');
?>