// Menu Jquery Section

var menuShow=false;

$(document).on("click", "#mobileMenu", function() {
    menuShow=true;
    $('#mobileMenuBox').fadeIn(200);
});

$(document).on("click", "#mobileMenuClose", function() {
    menuShow=false;
    $('#mobileMenuBox').fadeOut(200);
});

$( window ).resize(function() {
    if($(window).width()>1024){
        $('#mobileMenuBox').css('display','block');
    }else{
        if(menuShow){
            $('#mobileMenuBox').css('display','block');
        }else{
            $('#mobileMenuBox').css('display','none');
        }
    }
});

// END Menu Jquery Section
