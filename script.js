function move() {
    var elem = document.getElementById("burning-bar");
    var width = 1;
    var id = setInterval(frame, 10);
  
    function frame() {
      if (width >= 1000) {
        clearInterval(id);
      } else {
        width++;
        elem.style.width = width/10 + '%';
      }
    }
  }
  