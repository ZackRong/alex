/**
 * Created by Nostalgie on 21-Jan-18.
 */
$(document).ready(function(){

    loadApplicationsInProcess();
    loadCommunityId();
    //load categories
    //alert("hello")
    //get categories from server-- ajax request



})
function loadCategories(){
    var token = $.cookie("token");
    var form = new FormData();
    form.append("token",token );

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/evh/incubator/listIncubatorProjectType",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
        //alert(response);
        var categories=[];
        var obj= JSON.parse(response);
        var status=obj.errorCode;
        if(status==200){
            categories=obj.response.dtos;
            populateCategories(categories);
        }else{
            populateCategories(categories)
        }
    });
}
function loadCommunityId(){
    var token = $.cookie("token");
    var form = new FormData();
    form.append("token", token);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/evh/ui/user/listUserRelatedScenes",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }

    $.ajax(settings).done(function (response) {
        response = response.replace(/([^\\])":(\d{15,})/g,'$1":"$2"');
        response = response.replace(/([\[,]])(\d{15,})/g,'$1"$2"');
        var obj=JSON.parse(response);
        var status=obj.errorCode;
        if(status==200){
            //console.log(obj);
            $("#community-id").val(obj.response[0].communityId);
            console.log("object-name"+obj.response[0].name)
            console.log("scene token"+obj.response[0].sceneToken)
        }else{
            console.log("out put status"+status)
        }
    });
}
function populateCategories(categories){
    var selectCategories= document.getElementById("categories-list");
    var listSize=categories.length;
    var i;
    for(i = 0; i<listSize; i++){
        var category=categories[i]
        var option = document.createElement('option');
        option.value = category.name;
        option.text = category.name;
        selectCategories.add(option)
    }
}
function changeMeOne(){
    $("#text-one").css({display:'block'})
    $("#text-two").css({display:'none'})
    //$("#incubator").checked=true;
    $("#incubator").prop("checked", true);
    $("#accelerator").prop("checked", false);
    //$("#accelerator").checked=false;

}
function changeMeTwo(){
    $("#text-one").css({display:'none'})
    $("#text-two").css({display:'block'})
    //$("#incubator").checked=false;
    //$("#accelerator").checked=true;
    $("#incubator").prop("checked", false);
    $("#accelerator").prop("checked", true);
}


//make application
$("#apply-form").submit(function(e){
    e.preventDefault();
    checkIfUserIsAuthenticatedAndSubmit()
})

function checkIfUserIsAuthenticatedAndSubmit(){
    var uid= $.cookie("uid");
    var token= $.cookie("token");
    var contentServer= $.cookie("contentServer")+"/";
    var serverUrl= "http://"+contentServer+"upload/file";
    if(token==='null'){
        window.location.href="./index.html";
    }else{
        var userData={
            "token":token,
            "namespaceId":'999964',
            "applyUserId":uid,
            "serverUrl":serverUrl
        }
        handleApplicationProcess(userData)
    }//send request
}

function handleApplicationProcess(userData){
    //validate form
    var parentId=$("#parent-id").val();
    var teamName= $("#team-name").val();
    var teamRepresentative=$("#team-representative").val();
    var applyType=1;
    var projectTypeList=$("#categories-list").val();
    var communtiyId=$("#community-id").val();
    var h;
    var projectType="";
    for(h=0;h<projectTypeList.length;h++){
        if(h==0){
            projectType+=projectTypeList[h]
        }else{
            projectType+=","+projectTypeList[h]
        }

    }

    var projectName=$("#project-name").val();
    var phoneNumber=$("#contact-phone").val();
    var resEmail= $("#email").val();
    var businessLicenceAttachmentsUrl= $("#business-cert-url").val();
    var businessLicenceAttachmentsUri= $("#business-cert-uri").val();
    var businessLicenceAttachmentsName= $("#business-cert-name").val();
    var businessLicenceAttachmentsSize= $("#business-cert-size").val();
    var businessLicenceAttachmentsType= $("#business-cert-type").val();
    var planBookAttachmentsUrl= $("#business-plan-url").val();
    var planBookAttachmentsUri= $("#business-plan-uri").val();
    var planBookAttachmentsName= $("#business-plan-name").val();
    var planBookAttachmentsSize= $("#business-plan-size").val();
    var planBookAttachmentsType= $("#business-plan-type").val();
    //get user information from the registration server
    var appType= $('.apply-type:checked').val();
    if(appType==0){
        applyType=0;
    }
    /*alert(businessLicenceAttachmentsUri);
    alert(businessLicenceAttachmentsUrl);
    alert(planBookAttachmentsUri);
    alert(planBookAttachmentsUrl);
    alert(applyType);*/
    //alert(projectType);
    var form = new FormData();
    if(parentId!=0){
        form.append("parentId",parentId);
    }
    form.append("token", userData.token);
    form.append("namespaceId", userData.namespaceId);
    form.append("communityId", ''+communtiyId);
    form.append("applyUserId", userData.applyUserId);
    form.append("teamName", teamName);
    form.append("projectType", projectType);
    form.append("projectName", projectName);
    form.append("chargerName", teamRepresentative);
    form.append("chargerPhone", phoneNumber);
    form.append("chargerEmail", resEmail);
    form.append("applyType", applyType);
    form.append("businessLicenceAttachments[0].contentUri", businessLicenceAttachmentsUri);
    form.append("businessLicenceAttachments[0].contentUrl", businessLicenceAttachmentsUrl);
    form.append("businessLicenceAttachments[0].contentType", businessLicenceAttachmentsType);
    form.append("businessLicenceAttachments[0].name", businessLicenceAttachmentsName);
    form.append("businessLicenceAttachments[0].fileSize", businessLicenceAttachmentsSize);
    form.append("planBookAttachments[1].contentUri", planBookAttachmentsUri);
    form.append("planBookAttachments[1].contentUrl", planBookAttachmentsUrl);
    form.append("planBookAttachments[1].contentType", planBookAttachmentsType);
    form.append("planBookAttachments[1].name", planBookAttachmentsName);
    form.append("planBookAttachments[1].fileSize", planBookAttachmentsSize);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "/evh/incubator/addIncubatorApply",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
        var obj=JSON.parse(response);
        var error=obj.errorCode;
        if(error==200){
            $.cookie("parentId",null);
            $.removeCookie('parentId', { path: '/' });
            $("#application-in-process").css({display:'none'});
            $("#application-form").css({display:'none'});
            $("#notification-message").css({display:'block'});
        }else{
            layer.msg("很抱歉提交失败，请重新提交");
        }
    });

   // alert(resEmail)
}

function uploadBusinessCert(){
    var uid= $.cookie("uid");
    var token= $.cookie("token");
    var contentServer= $.cookie("contentServer")+"/";
    var serverUrl= "http://"+contentServer+"upload/file";
    var communityId=$("#community-id").val()
    if(token==='null'){
        layer.msg("先要登录才能上传文件");
    }else{
        var userData={
            "token":token,
            "namespaceId":'99994',
            "communityId": ''+communityId,
            "applyUserId":uid,
            "serverUrl":serverUrl
        }
        //upload file
        var businessCert = $('#business-cert')[0].files[0];
        uploadFile(businessCert,userData,2);
    }//send request
}
function uploadPlanBook(){
    var uid= $.cookie("uid");
    var token= $.cookie("token");
    var contentServer= $.cookie("contentServer")+"/";
    var serverUrl= "http://"+contentServer+"upload/file";
    var communityId=$("#community-id").val()
    if(token==='null'){
        layer.msg("先要登录才能上传文件");
    }else{
        var userData={
            "token":token,
            "namespaceId":'99994',
            "communityId": ''+communityId,
            "applyUserId":uid,
            "serverUrl":serverUrl
        }
        //upload file
        var planBook = $('#business-plan')[0].files[0];
        uploadFile(planBook,userData,1);
    }//send request
}
function uploadFile(file,userData,type){
    var form = new FormData();
    form.append("token", userData.token);
    form.append("upload_file", file);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": userData.serverUrl,
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    };

    $.ajax(settings).done(function (response) {
        var res=JSON.parse(response);
        var errorCode=res.errorCode;
        if(errorCode==0){
            var documentUrl=res.response.url;
            var documentUri=res.response.uri;
            if(type==1){
                $("#business-plan-url").val(documentUrl);
                $("#business-plan-uri").val(documentUri);
                $("#business-plan-name").val(file.name);
                $("#business-plan-size").val(file.size);
                $("#business-plan-type").val(file.type);
                $("#business-plan-url-not").text("上传成功");
            }else{
                $("#business-cert-url").val(documentUrl);
                $("#business-cert-uri").val(documentUri);
                $("#business-cert-name").val(file.name);
                $("#business-cert-size").val(file.size);
                $("#business-cert-type").val(file.type);
                $("#business-cert-url-not").text("上传成功");
            }
            //handleApplicationProcess(userData,documentUrl);
        }else{
            $("#business-plan-url-not").text("上传失败");
            $("#business-cert-url-not").text("上传失败");
        }
       // alert(response);
        //console.log(response);

    });
}
function loadApplicationsInProcess(){
    var url= "/evh/incubator/findIncubatorAppling";

    var uid=getCookie("uid");
    var token= getCookie("token");



    if(uid==='null'){
        window.location.href="../index.html";
        //alert(uid);
    }else{
        //get user application history
        //console.log(uid);
        var form = new FormData();
        var applicationId=getCookie("parentId");

        if(applicationId==='null'){
            //alert(applicationId)
            url= "/evh/incubator/findIncubatorAppling";

        }else{
            url="/evh/incubator/findIncubatorApply";
            form.append("id",applicationId);
        }
        form.append("namespaceId", "999964");
        form.append("applyUserId", uid);
        form.append("token",token);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url":url,
            "method": "POST",
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (response) {
            var obj= JSON.parse(response);
            var applicationList=obj.response;


            if(obj.errorCode==200){
                if(applicationList!=null){
                    $("#application-in-process").css({display:'block'});
                    $("#application-form").css({display:'block'});
                    populateApplicationInfo(applicationList);
                    loadCategories();
                }else{
                    $("#application-in-process").css({display:'none'});
                    $("#application-form").css({display:'block'});
                    loadCategories();
                }
            }else{
                //alert("I am here")
                $("#application-in-process").css({display:'none'});
                $("#application-form").css({display:'block'});
                loadCategories();
            }
        });
    }
}
function populateApplicationInfo(application){
    $("#community-id").val(application.communityId);
    $("#parent-id").val(application.id);
    $("#team-name").val(application.teamName);
    $("#team-representative").val(application.chargerName);
    $("#project-name").val(application.projectName);
    $("#contact-phone").val(application.chargerPhone);
    $("#email").val(application.chargerEmail);
    var busAttachments=application.businessLicenceAttachments;
    var planBookAttachments=application.planBookAttachments;
    if(busAttachments!=null){
        var j;
        for(j=0;j<busAttachments.length;j++){
            if(busAttachments[j].contentUrl!=null){
                $("#business-cert-url").val(busAttachments[j].contentUrl);
                $("#business-cert-uri").val(busAttachments[j].contentUri);
                $("#business-cert-name").val(busAttachments[j].name);
                $("#business-cert-size").val(busAttachments[j].fileSize);
                $("#business-cert-type").val(busAttachments[j].contentType);
                $("#bus-submitted").attr("href",busAttachments[j].contentUrl);
                $("#bus-submitted").css({display:'block'})
            }
        }
    }
    if(planBookAttachments!=null){
        var k;
        for(k=0;k<planBookAttachments.length;k++){
            if(planBookAttachments[k].contentUrl!=null){
                $("#business-plan-url").val(planBookAttachments[k].contentUrl);
                $("#business-plan-uri").val(planBookAttachments[k].contentUri);
                $("#business-plan-name").val(planBookAttachments[k].name);
                $("#business-plan-size").val(planBookAttachments[k].fileSize);
                $("#business-plan-type").val(planBookAttachments[k].contentType);
                $("#plan-submitted").attr("href",planBookAttachments[k].contentUrl);
                $("#plan-submitted").css({display:'block'})
            }
        }
    }

    $(".pg-cont-reg-form-item-input-send").val("重新提交");
}
function redirectUserToRegistration(){
    window.location.href = "register.html";
}
function redirectToLogin(){
    window.location.href="../index.html";
}




