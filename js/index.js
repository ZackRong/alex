//var requestUrl="http://park-test.chuangyechang.com";
var phoneRegionCode="86";
var requestUrl="";
$(document).ready(function () {

    $(".pg-cont-myAcc-lt-vert-nav-item").click(function () {
        $(".pg-cont-myAcc-lt-vert-nav-item").removeClass('active')
        $(this).addClass('active')
        if($("#acc-myHome").hasClass('active')){
            window.location.href="account.html";

        }

        if( $("#acc-apply").hasClass('active')){
            window.location.href="apply.html";
        }




    })
    $(".inner-apply").click(function (){
        window.location.href="apply.html";

    })

})
function logout(){
    $.cookie("uid",null);
    $.cookie("token",null);
    $.cookie("parentId",null);
    window.location.href="./index.html";
}


