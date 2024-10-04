(function($) {
  window.fb3d = window.fb3d || {}
  fb3d.instances = fb3d.instances || {};
  fb3d.id2post = fb3d.id2post || {};

  fb3d.initVCPreview = function(id) {
    function onLightBox(e) {
      e.preventDefault();
      alert('This action will open the book in Lightbox mode');
    }
    var renderers = {
      thumbnail: function(post) {
        instance.container.html([
          instance.title? [
            '<div class="book-heading">',
              '<h3>', post.title, '</h3>',
            '</div>'
          ].join(''): '',
          '<div class="book-thumbnail">',
            '<div class="pseudo-thumbnail"></div>',
          '</div>'
        ].join(''));
      },
      'thumbnail-lightbox': function(post) {
        instance.container.html([
          instance.title? [
            '<div class="book-heading">',
              '<h3><a href="#">', post.title, '</a></h3>',
            '</div>'
          ].join(''): '',
          '<div class="book-thumbnail">',
            '<a href="#"><div class="pseudo-thumbnail"></div></a>',
          '</div>'
        ].join(''));
        instance.container.find('a').on('click', onLightBox);
      },
      'link-lightbox': function(post) {
        instance.container.on('click', onLightBox);
      },
      fullscreen: function(post) {
        var autoHeight = instance.container.height()<100;
        instance.container.html('');
        if(instance.title) {
          var heading = $([
            '<div class="book-heading">',
              '<h3>', post.title, '</h3>',
            '</div>'
          ].join(''));
          instance.container.append(heading);
        }
        instance.container.append([
          '<div class="book-widget">',
            '<div class="full-size">',
              '<div class="pseudo-3d-flip-book"></div>',
            '</div>',
          '</div>'
        ].join(''));
        var widget = instance.container.find('.book-widget');
        function update() {
          if(autoHeight) {
            instance.container.height(Math.min(0.9*$(window).height(), Math.round(0.75*instance.container.width())));
          }
          widget.height(instance.container.height()-(widget.offset().top-instance.container.offset().top));
        }
        $(window).on('resize', update);
        update();
      }
    };
    function render() {
      renderers[instance.mode](fb3d.id2post[instance.id]);
    }
    function error() {
      instance.container.html([
        '<div class="alert alert-danger">',
          '<span class="fa fa-exclamation-circle"></span> Item is not found',
        '</div>'
      ].join(''));
    }
    function fetchPost() {
      if(fb3d.id2post[instance.id]) {
        render();
      }
      else {
        $.ajax({
            url: fb3d.ajaxurl,
            data: {
              action: 'fb3d_send_post',
              id: instance.id,
            },
            type: 'GET',
            success: function(r) {
              if(r.code) {
                error();
              }
              else {
                fb3d.id2post[instance.id] = r.post;
                render();
              }
            },
            error: error
          });
      }
    }
    function disposeRemoved() {
      var removed = [];
      Object.keys(fb3d.instances).forEach(function(id) {
        if(!$('#'+id).length) {
          removed.push(id);
        }
      });
      removed.forEach(function(id) {
        fb3d.instances[id].dispose();
        delete fb3d.instances[id];
      });
    }
    disposeRemoved();
    if(fb3d.instances[id]) {
      fb3d.instances[id].dispose();
    }
    fb3d.instances[id] = {
      container: $('#'+id),
      dispose: function() {
        instance.container.find('a').off('click', onLightBox);
      }
    };
    var instance = fb3d.instances[id];
    instance.id = instance.container.attr('data-id') || '0';
    instance.title = instance.container.attr('data-title')==='true';
    instance.mode = instance.container.attr('data-mode') || 'thumbnail';
    if(instance.title) {
      fetchPost();
    }
    else {
      render();
    }
  };
})(jQuery);
