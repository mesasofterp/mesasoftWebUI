var site = site || {};
site.window = $(window);
site.document = $(document);
site.Width = site.window.width();
site.Height = site.window.height();

var Background = function() {

};

Background.headparticle = function() {   

   if ( !Modernizr.webgl ) {
      alert('Tarayıcınız WebGL\'i desteklemiyor');
   }

   var camera, scene, renderer;
   var mouseX = 0, mouseY = 0;
   var p;

   var windowHalfX = site.Width / 2;
   var windowHalfY = site.Height / 2;

   Background.camera = new THREE.PerspectiveCamera( 35, site.Width / site.Height, 1, 2000 );
   Background.camera.position.z = 300;

   // scene
   Background.scene = new THREE.Scene();

   // texture
   var manager = new THREE.LoadingManager();
   manager.onProgress = function ( item, loaded, total ) {
      //console.log('webgl, twice??');
      //console.log( item, loaded, total );
   };


   // particles
   var p_geom = new THREE.Geometry();
   var p_material = new THREE.ParticleBasicMaterial({
   color: 0x7D7DFF,
   // color: 0x06A24F,
      size: 1.9
   });

   // model
var loader = new THREE.OBJLoader(manager);

loader.load('js/head.obj', function(object) {

    object.traverse(function(child) {
        if (child instanceof THREE.Mesh) {

            // Texture kullanmak istersen burayı açabilirsin
            // child.material.map = texture;

            var scale = 8;

            // Vertices’i p_geom’e ekle
            child.geometry.vertices.forEach(function(v) {
                p_geom.vertices.push(new THREE.Vector3(v.x * scale, v.y * scale, v.z * scale));
            });
        }
    });

    // Sahneye ekle
    Background.scene.add(p);

}, undefined, function(error) {
    console.error('OBJ yüklenirken hata oluştu:', error);
});


   p = new THREE.ParticleSystem(
      p_geom,
      p_material
      );

   Background.renderer = new THREE.WebGLRenderer({ alpha: true });
   Background.renderer.setSize( site.Width, site.Height );
   Background.renderer.setClearColor(0x000000, 0);

   $('.particlehead').append(Background.renderer.domElement);
   $('.particlehead').on('mousemove', onDocumentMouseMove); // Fare dinleyicisini ekle
   site.window.on('resize', onWindowResize);

   function onWindowResize() {
      windowHalfX = site.Width / 2;
      windowHalfY = site.Height / 2;
      Background.camera.aspect = site.Width / site.Height;
      Background.camera.updateProjectionMatrix();
      Background.renderer.setSize( site.Width, site.Height );
   }

   // Fare hareketini yakalayan fonksiyonu geri ekle
   function onDocumentMouseMove( event ) {
      mouseX = ( event.clientX - windowHalfX ) / 2;
      mouseY = ( event.clientY - windowHalfY ) / 2;
   }

   var introComplete = false;
   function introAnimation() {
      if ($('.site-blocks-cover-form').length) {
        TweenMax.to(Background.camera.position, 2.5, { y: 80, ease: Power2.easeInOut });
        var scrollTarget = $('.site-blocks-cover-form').offset().top - 180;
        $('html, body').animate({
            scrollTop: scrollTarget
        }, 2500, 'easeInOutExpo', function() {
            introComplete = true;
        });
      } else {
        introComplete = true;
      }
   }

   Background.animate = function() { 
      Background.ticker = TweenMax.ticker;
      Background.ticker.addEventListener("tick", Background.animate);
      render();
   }

   function render() {
      // Sadece giriş animasyonu bittikten sonra fareyi takip et
      if (introComplete) {
        Background.camera.position.x += ( (mouseX * .5) - Background.camera.position.x ) * .05;
        Background.camera.position.y += ( -(mouseY * .5) - Background.camera.position.y ) * .05;
      }

      Background.camera.lookAt( Background.scene.position );
      Background.renderer.render( Background.scene, Background.camera );
   }

   render();
   Background.animate();
   introAnimation(); 

}; 

Background.headparticle();