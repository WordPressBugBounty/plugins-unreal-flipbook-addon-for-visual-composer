<?php
  namespace iberezansky\fb3d;

  function init_local_templates() {
    global $fb3d;
    $fb3d['templates'] = [
      'short-white-book-view'=> [
        'styles'=> [
          ASSETS_CSS.'font-awesome.min.css',
          ASSETS_CSS.'short-white-book-view.css'
        ],
        'links'=> [],
        'html'=> ASSETS_TEMPLATES.'default-book-view.html',
        'script'=> ASSETS_JS.'default-book-view.js',
        'sounds'=> [
          'startFlip'=> ASSETS_SOUNDS.'start-flip.mp3',
          'endFlip'=> ASSETS_SOUNDS.'end-flip.mp3'
        ]
      ]

    ];
  }

  $fb3d['lightboxes'] = [
    'light' => [
      'caption'=> 'Light Glass Box'
    ],
    'dark' => [
      'caption'=> 'Dark Glass Box'
    ],
    'dark-shadow' => [
      'caption'=> 'Dark Glass Shadow'
    ],
    'light-shadow' => [
      'caption'=> 'Light Glass Shadow'
    ]
  ];

  function init_templates() {
    global $fb3d;
    $fb3d['templates'] = apply_filters('fb3d_templates', $fb3d['templates']);
  }

  add_action('init', 'iberezansky\fb3d\init_templates', 11);

  function update_templates_cache() {
    global $fb3d;
    $us = [];
    foreach($fb3d['templates'] as $t) {
      $us[$t['html']] = 1;
      $us[$t['script']] = 1;
      foreach($t['styles'] as $s) {
        $us[$s] = 1;
      }
    }
    $urls = [];
    foreach($us as $u=>$v) {
      $urls[substr($u, strpos($u, '/plugins/')+9)] = file_get_contents(template_url_to_path($u));
    }

    $path = template_url_to_path(ASSETS_JS.'skins-cache.js');
    $old = file_exists($path)? file_get_contents($path): '';
    $new = implode('', [
      'FB3D_CLIENT_LOCALE.templates=', preg_replace('/"http.*?plugins\\\\\//i', '"', json_encode($fb3d['templates'])), ';',
      'FB3D_CLIENT_LOCALE.jsData.urls=', json_encode($urls), ';'
    ]);
    if($old!==$new) {
      file_put_contents($path, $new);
    }
  }

  add_action('init', 'iberezansky\fb3d\update_templates_cache', 12);

?>
