Atomic.setOnRender('lista', function(id, thisElement){
  console.log('onRender da lista');
  var entradaDoNome = Atomic.getChild(thisElement, 'entradaDoNome');
  var btnAdd = Atomic.getChild(entradaDoNome, 'btnAcao');
  var nome = Atomic.getChild(entradaDoNome, 'caixaDeTexto');

  btnAdd.onclick = function(){
    // console.log(Atomic.getChildren(thisElement));
    // Atomic.create('item', ["nome"]);
    var propNome = {
      key: "nome",
      value: nome.value
    }
    Atomic.addChildren(thisElement, "item", [propNome]);
  }

});

Atomic.setOnNewChildrenAdded('lista', function(id, thisElement, childrenAdded){
  console.log('setOnNewChildrenAdded da lista');
  console.log(childrenAdded);
  var btnRemover = Atomic.getChild(childrenAdded, 'btnRemover');
  btnRemover.onclick = function(){
    Atomic.getChildren(thisElement).removeChild(childrenAdded);
  }
});
