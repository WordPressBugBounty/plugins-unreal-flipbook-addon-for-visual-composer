(function($) {
  if(!window.fb3d) {
    window.fb3d = {};
  }
  fb3d.initVCProps = function(type) {
    function onModeChange() {
      var val = fb3d.vcProps.mode.inp.attr('value');
      if(~['thumbnail-lightbox', 'link-lightbox'].indexOf(val)) {
        fb3d.vcProps.lightbox.wid.removeClass('hidden');
      }
      else {
        fb3d.vcProps.lightbox.wid.addClass('hidden');
      }
      if(val==='thumbnail') {
        fb3d.vcProps.template.wid.addClass('hidden');
      }
      else {
        fb3d.vcProps.template.wid.removeClass('hidden');
      }
      if(val==='link-lightbox') {
        fb3d.vcProps.content.wid.removeClass('hidden');
        var mce = $('.vc_properties-list').find('#wpb_tinymce_content_ifr');
        if(mce[0]) {
          mceBody = $(mce[0].contentDocument.body);
          mceBody.html(fb3d.vcProps.content.data);
        }
      }
      else {
        fb3d.vcProps.content.wid.addClass('hidden');
        var mce = $('.vc_properties-list').find('#wpb_tinymce_content_ifr');
        if(mce[0]) {
          var mceBody = $(mce[0].contentDocument.body);
          if(mceBody.html()) {
            fb3d.vcProps.content.data = mceBody.html();
            mceBody.html('');
          }
        }
      }
    }
    function onIdChange(e) {
      fb3d.vcProps.id.inp.attr('value', e.target.value);
    }
    function onClassesChange(e) {
      fb3d.vcProps.classes.inp.attr('value', (e.target.value.match(/([\w\-,]+)/g) || ['']).join(','));
    }
    function onUrlparamChange(e) {
      fb3d.vcProps.urlparam.inp.attr('value', (e.target.value.match(/([\w\-]+)/g) || ['fb3d-page']).join(''));
    }
    function renderPosts() {
      var res = ['<ul>'];
      fb3d.posts.forEach(function(post) {
        res.push('<li><label><input type="radio" name="post-id" value="'+post.ID+'"> '+post.title+'</label></li>')
      });
      res.push('</ul>');
      fb3d.vcProps.id.mount.html(res.join(''));
      var radios = fb3d.vcProps.id.mount.find('input');
      radios.on('change', onIdChange);
      if(fb3d.posts.length) {
        if(fb3d.vcProps.id.inp.attr('value')==='0') {
          onIdChange({target: {value: fb3d.posts[0].ID}});
        }
        radios.filter('[value="'+fb3d.vcProps.id.inp.attr('value')+'"]')[0].checked = true;
      }
    }
    function load3DFlipBookPosts() {
      var pos = -1, data = '........';
      if(fb3d.posts) {
        renderPosts();
      }
      else {
        function animate() {
          if(!fb3d.posts) {
            pos = (pos+1)%data.length;
            fb3d.vcProps.id.mount.html('<div class="wpb_element_label">Loading '+data.substr(0, pos)+'</div>');
            setTimeout(animate, 250);
          }
        }
        animate();
        function error() {
          fb3d.posts = [];
          fb3d.vcProps.id.mount.html('<div class="wpb_element_label error">The server return an error. Try again later.</div>');
        }
        $.ajax({
          url: ajaxurl,
          data: {
            action: 'fb3d_send_posts'
          },
          type: 'GET',
          success: function(r) {
            if(r.code) {
              error();
            }
            else {
              fb3d.posts = r.posts;
              renderPosts();
            }
          },
          error: error
        });
      }
    }
    if(fb3d.vcProps) {
      fb3d.vcProps.dispose();
    }
    var wid = $('.vc_properties-list');
    fb3d.vcProps = {
      id: {
        wid: wid.find('div[data-vc-shortcode-param-name="id"]'),
        inp: wid.find('input[name="id"]'),
        mount: wid.find('.mount-node')
      },
      mode: {
        wid: wid.find('div[data-vc-shortcode-param-name="mode"]'),
        inp: wid.find('select[name="mode"]')
      },
      title: {
        wid: wid.find('div[data-vc-shortcode-param-name="title"]'),
        inp: wid.find('input[name="title"]')
      },
      template: {
        wid: wid.find('div[data-vc-shortcode-param-name="template"]'),
        inp: wid.find('select[name="template"]')
      },
      lightbox: {
        wid: wid.find('div[data-vc-shortcode-param-name="lightbox"]'),
        inp: wid.find('select[name="lightbox"]')
      },
      classes: {
        wid: wid.find('div[data-vc-shortcode-param-name="classes"]'),
        inp: wid.find('input[name="classes"]')
      },
      content: {
        wid: wid.find('div[data-vc-shortcode-param-name="content"]'),
        data: ''
      },
      urlparam: {
        wid: wid.find('div[data-vc-shortcode-param-name="urlparam"]'),
        inp: wid.find('input[name="urlparam"]')
      }
    };
    fb3d.vcProps.mode.inp.on('change', onModeChange);
    fb3d.vcProps.classes.inp.on('keyup', onClassesChange);
    fb3d.vcProps.urlparam.inp.on('keyup', onUrlparamChange);
    fb3d.vcProps.dispose = function() {
      fb3d.vcProps.mode.inp.off('change', onModeChange);
      fb3d.vcProps.classes.inp.off('keyup', onClassesChange);
      fb3d.vcProps.urlparam.inp.off('keyup', onUrlparamChange);
      fb3d.vcProps.id.mount.find('input').off('change', onIdChange);
    };
    onModeChange();
    load3DFlipBookPosts();
  };
})(jQuery);
