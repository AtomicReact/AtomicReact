Atomic.setOnRender('simpleAtom', function(id, thisElement){
  //See dev Tools->console:
  console.log('The id is: ', id);
  console.log('One simpleAtom has been rendered: ', thisElement);

  //Let's get a button element inside simpleAtom
  let myButton = Atomic.getChild(thisElement, 'myButton');
  //now we can to any thing with this myButton
  myButton.onclick = function(){
    alert('The button has been clicked!');
  };

});
