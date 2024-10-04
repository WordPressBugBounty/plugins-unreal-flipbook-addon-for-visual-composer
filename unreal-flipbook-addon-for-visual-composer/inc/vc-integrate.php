<?php
  namespace iberezansky\fb3d;


  add_action('init', '\iberezansky\fb3d\integrate');

  function fb3d_selector_field($settings, $value) {
    ob_start();
    ?>
    <div class="ct-<?php echo(esc_attr($settings['type']))?>">
      <input name="<?php echo(esc_attr($settings['param_name']))?>" class="wpb_vc_param_value" type="hidden" value="<?php echo(esc_attr($value))?>" />
      <div class="mount-node"></div>
    </div>
    <script type="text/javascript">
      fb3d.initVCProps();
    </script>
    <?php
     return ob_get_clean();
  }

  function integrate() {
    if(defined('WPB_VC_VERSION')) {
      vc_add_shortcode_param('3d-flip-book-selector', '\iberezansky\fb3d\fb3d_selector_field');
      global $fb3d;
      $skins = array('default'=> 'default');
      foreach($fb3d['templates'] as $name=> $data) {
        $skins[isset($data['caption'])? $data['caption']: $name] = $name;
      }
      vc_map(array(
        'name' => __('Unreal FlipBook', POST_ID),
        'description' => __('3D FlipBook Powered Physics Engine', POST_ID),
        'base' => POST_ID,
        'class' => '',
        'controls' => 'full',
        'icon' => 'vc-3d-flip-book-icon',
        'category' => __('Content', 'js_composer'),
        'admin_enqueue_js' => array(ASSETS_JS.'vc-integrate.js'),
        'admin_enqueue_css' => array(ASSETS_CSS.'vc-integrate.css'),
        'front_enqueue_js'=> array(ASSETS_JS.'vc-integrate.js'),
        'front_enqueue_css'=> array(ASSETS_CSS.'vc-integrate.css'),
        'params' => array( array(
          'type' => '3d-flip-book-selector',
          'holder' => 'div',
          'class' => '',
          'param_name' => 'id',
          'value' => '0',
          'save_always' => true,
          'group'=> __('3D FlipBook', POST_ID)
        ), array(
          'type' => 'checkbox',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Title', POST_ID),
          'param_name' => 'title',
          'value' => 'false',
          'description' => __('Should the title be displayed', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'dropdown',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Mode', POST_ID),
          'param_name' => 'mode',
          'value' => array(
            __('Fullscreen', POST_ID) => 'fullscreen',
            __('Thumbnail', POST_ID) => 'thumbnail',
            __('Thumbnail and Lightbox', POST_ID) => 'thumbnail-lightbox',
            __('Lightbox activation link', POST_ID) => 'link-lightbox'
          ),
          'description' => __('Select a view mode', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'dropdown',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Skin', POST_ID),
          'param_name' => 'template',
          'value' => $skins,
          'description' => __('Select a skin', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'dropdown',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Lightbox', POST_ID),
          'param_name' => 'lightbox',
          'value' => array(
            __('Dark', POST_ID) => 'dark',
            __('Light', POST_ID) => 'light'
          ),
          'description' => __('Select a lightbox theme', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'textfield',
          'holder' => 'div',
          'class' => '',
          'heading' => __('CSS classes', POST_ID),
          'param_name' => 'classes',
          'value' => '',
          'description' => __('Add 3D FlipBook container CSS classes', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'textarea_html',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Link content', POST_ID),
          'param_name' => 'content',
          'value' => '',
          'description' => __('Add any content that will be an activation link for the lightbox', POST_ID),
          'group'=> __('View mode', POST_ID)
        ), array(
          'type' => 'textfield',
          'holder' => 'div',
          'class' => '',
          'heading' => __('Deep linking', POST_ID),
          'param_name' => 'urlparam',
          'value' => 'fb3d-page',
          'description' => __('Deep linking URL parameter name (http://example.com?fb3d-page=1)', POST_ID),
          'group'=> __('Advanced', POST_ID)
        ) )
      ));
    }
    else {
      add_action('admin_notices', '\iberezansky\fb3d\showVCUndefinedNotice');
    }
  }

  function showVCUndefinedNotice() {
    $plugin_data = get_plugin_data(MAIN);
    ?>
    <div class='notice notice-info is-dismissible'>
      <p>
        <b><?php echo($plugin_data['Name']) ?></b> requires <b>WPBakery Page Builder</b> plugin to be installed and activated on your site.
      </p>
    </div>
    <?php
  }

?>
