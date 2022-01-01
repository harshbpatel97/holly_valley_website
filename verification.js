jQuery(document).ready(function($){
    if (sessionStorage.getItem('advertOnce') !== 'true') {
        sessionStorage.setItem('advertOnce','true');
        $('.box').show();
    }else{
        $('.box').hide();
    }

    $('#refresh-page').on('click',function(){
        $('.box').hide();
        sessionStorage.setItem('advertOnce','true');
        window.location.href = "home.html";

    });

    $('#reset-session').on('click',function(){
        $('.box').show();
        sessionStorage.setItem('advertOnce','');
        window.location.href = "unverified.html"
    });
});