Atomic.setOnRender('inputeTexto', function(id, thisElement){
  console.log('onRender do inputeTexto');
  var caixaDeTexto = Atomic.getChild(thisElement, 'caixaDeTexto');
  var btnLimpar = Atomic.getChild(thisElement, 'btnLimpar');

  btnLimpar.onclick = function() {
    caixaDeTexto.value = '';
  }
});
