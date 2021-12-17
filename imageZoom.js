//imageZoom function
$(document).ready(function(){
    var imgArray = $(".img-design");
    console.log(imgArray);
    for (i = 0; i < imgArray.length; i++){
        $(imgArray[i]).blowup();
    }

});