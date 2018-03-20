var uid=getCookie("uid");
var token= getCookie("token");
$.removeCookie('parentId', { path: '/' });
loadApplicationHistory();
function loadApplicationHistory(){


    if(uid==='null'){
        window.location.href="./index.html";
        //alert(uid);
    }else{
        //get user application history
        //console.log(uid);
        var form = new FormData();
        form.append("namespaceId", "999964");
        form.append("applyUserId", uid);
        form.append("token",token);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": requestUrl+"/evh/incubator/listIncubatorApply",
            "method": "POST",
            "processData": false,
            /*xhrFields: {
             withCredentials: true
             },*/
            beforeSend: function(xhr){
                xhr.withCredentials = true;
            },
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }

        $.ajax(settings).done(function (response) {
            var obj= JSON.parse(response);
            var applicationList=obj.response.dtos;

            //alert(applicationList.length);
            if(obj.errorCode==200){
                populateApplicationHistory(applicationList);
            }else{
                layer.msg(obj.errorCode)
            }


            // console.log(response);
            //console.log(token);
        });
        //alert(uid);
        //console.log(uid);
    }
}

function populateApplicationHistory(applicationList){
    var totalNumber
    if(applicationList==null){
        totalNumber=0
    }else{
        totalNumber=applicationList.length;
    }

    if(totalNumber==0){
        $(".pg-cont-myAcc-myHome-fo-new").css({display:'block'});
        $(".pg-cont-myAcc-myHome-fo-od").css({display:'none'})
    }else{

        $(".pg-cont-myAcc-myHome-fo-new").css({display:'none'});
        $(".pg-cont-myAcc-myHome-fo-od").css({display:'block'})
        var i;
        var tableHeader="<tr>"+
                        "<th style=\"width: 30px\">No</th>"+
                        "<th>项目名称</th>"+
                        "<th>所属分类</th>"+
                        "<th>附件</th>"+
                        "<th>提交时间</th>"+
                        "<th>审核状态</th>"+
                        "<th>操作</th>"+
                        "</tr>";
        $("#applicationHistory > thead ").append(tableHeader);
        var hasInProcess=0;
        for(i=0;i<totalNumber;i++){
            var number=i+1;
            var application=applicationList[i];
            var busAttachments=application.businessLicenceAttachments;
            var planBookAttachments=application.planBookAttachments;
            var canResubmit=application.reApplyFlag;
            var bisAttName="";
            var planBookName="";
            var resubitButton="";
            if(busAttachments!=null){
                var j;
                for(j=0;j<busAttachments.length;j++){
                    if(busAttachments[j].contentUrl!=null){
                        if(j==0){
                            bisAttName+="<a href=\""+busAttachments[j].contentUrl+"\">营业执照</a>";
                        }else{
                            bisAttName+="<a href=\""+busAttachments[j].contentUrl+"\">营业执照</a>";
                        }
                    }
                }
            }
            if(planBookAttachments!=null){
                var k;
                for(k=0;k<planBookAttachments.length;k++){
                    if(planBookAttachments[k].contentUrl!=null){
                        if(k==0){
                            planBookName+="<a href=\""+planBookAttachments[k].contentUrl+"\">创业计划书</a>";
                        }else{
                            planBookName+="<a href=\""+planBookAttachments[k].contentUrl+"\">创业计划书</a>";
                        }
                    }
                }
            }
            var status="";
            var approveOpinion="";
            var notificationMsg="";
            var approveStatus=application.approveStatus;
            approveOpinion=application.approveOpinion;

            if(approveStatus==0){
                status="<span style='color:darkgreen' class='approveOpinion'>待审核</span>" +
                    "<div style='display: none' class='opinion'>"+approveOpinion+"</div> ";
                /*hasInProcess=1;
                resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"resubmitProject("+application.id+")\">重新提交</div>";
            */
                if(canResubmit==1){
                    resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"resubmitProject("+application.id+")\">重新提交</div>";
                }else{
                    resubitButton="<div style=\"color: #e7e7e7;font-weight: 600; cursor: pointer\">重新提交</div>";
                }
            }
            if(approveStatus==1){
                status="<div style=\"color:darkgreen;\" class=\"approveOpinion\">已拒绝</br><span style=\"color: gray;font-weight: 400; cursor: pointer;font-size: 11px\" onclick=\"displayApproveResponse("+"'"+approveOpinion.trim()+"'"+")\">&nbsp;&nbsp;查看拒绝理由</span></div>"
                if(canResubmit==1){
                    resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"resubmitProject("+application.id+")\">重新提交</div>";
                }else{
                    resubitButton="<div style=\"color: #e7e7e7;font-weight: 600; cursor: pointer\">重新提交</div>";
                }
            }
            if(approveStatus==2){
                status="<div style='color:darkgreen;' class='approveOpinion'>已通过</div>"
                if(canResubmit==1){
                    resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"resubmitProject("+application.id+")\">重新提交</div>";
                }else{
                    resubitButton="<div style=\"color: #e7e7e7;font-weight: 600; cursor: pointer\">重新提交</div>";
                }
                /*if(hasInProcess==1){
                    notificationMsg="现在只能重新提交在审核中的记录";
                    resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"displayApproveResponse("+"'"+notificationMsg+"'"+")\">重新提交</div>";
                }else{
                    resubitButton="<div style=\"color: red;font-weight: 600; cursor: pointer\" onclick=\"resubmitProject("+application.id+")\">重新提交</div>";
                }*/
            }
            var timestamp = application.createTime ; // replace your timestamp
            var createTime = new Date(timestamp);
            //var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
            var tableRow = "<tr>" +
                "<td>" +number +
                "<td>" + application.projectName +
                "</td><td>" + application.projectType +
                "</td><td style=\"text-align: center\">" + bisAttName +"</br>"+planBookName +
                "</td><td style=\"text-align: center\">" + createTime.toDateString()+
                "</td><td style=\"text-align: center\">" + status +
                "<td style=\"text-align: center\">"+resubitButton+"</td>";
            //alert(tableRow)
            $("#applicationHistory > tbody ").append(tableRow);
        }

    }
}
function displayApproveResponse(comment){
    layer.msg(comment);
}


function resubmitProject(applicationId){

    $.layer({
        shade: [0],
        area: ['auto','auto'],
        dialog: {
            msg: '提醒：您重新提交的资料会覆盖前一份，评审时以最新提交的资料为准',
            btns: 2,
            type: 4,
            btn: ['确定','取消'],
            yes: function(){
                $.cookie("parentId",applicationId);
                window.location.href="apply.html";
            }, no: function(){
                layer.msg('取消成功', 1, 10);
            }
        }
    });

}

function processApplicationResubmission(application){
    var uid= $.cookie("uid");
    var token= $.cookie("token");
    var userData={
        "token":token,
        "namespaceId":'999964',
        "communityId":'240111044332060166',
        "applyUserId":uid
    }
    var id=application.id;
    var teamName= application.teamName;
    var teamRepresentative=application.chargerName;
    var applyType=application.applyType;
    var projectType=application.projectType;

    var projectName=application.projectName;
    var phoneNumber=application.chargerPhone;
    var resEmail= application.chargerEmail;

    var busAttachments=application.businessLicenceAttachments;
    var planBookAttachments=application.planBookAttachments;

    var businessLicenceAttachmentsUrl;
    var businessLicenceAttachmentsUri;
    var businessLicenceAttachmentsName;
    var businessLicenceAttachmentsSize;
    var businessLicenceAttachmentsType;
    if(busAttachments!=null){
        var j;
        for(j=0;j<busAttachments.length;j++){
            if(busAttachments[j].contentUrl!=null){
                businessLicenceAttachmentsUrl=busAttachments[j].contentUrl;
                businessLicenceAttachmentsUri=busAttachments[j].contentUri;
                businessLicenceAttachmentsName=busAttachments[j].name;
                businessLicenceAttachmentsSize=busAttachments[j].fileSize;
                businessLicenceAttachmentsType=busAttachments[j].contentType;
            }
        }
    }
    var planBookAttachmentsUrl;
    var planBookAttachmentsUri;
    var planBookAttachmentsName;
    var planBookAttachmentsSize;
    var planBookAttachmentsType;
    if(planBookAttachments!=null){
        var k;
        for(k=0;k<planBookAttachments.length;k++){
            if(planBookAttachments[k].contentUrl!=null){
                planBookAttachmentsUrl= planBookAttachments[k].contentUrl;
                planBookAttachmentsUri=planBookAttachments[k].contentUri;
                planBookAttachmentsName=planBookAttachments[k].name;
                planBookAttachmentsSize=planBookAttachments[k].fileSize;
                planBookAttachmentsType=planBookAttachments[k].contentType;
            }
        }
    }
    //get user information from the registration server
    /*alert(businessLicenceAttachmentsUri);
     alert(businessLicenceAttachmentsUrl);
     alert(planBookAttachmentsUri);
     alert(planBookAttachmentsUrl);
     alert(applyType);*/
    //alert(projectType);
    var form = new FormData();
    form.append("parentId",id);
    form.append("token", userData.token);
    form.append("namespaceId", userData.namespaceId);
    form.append("communityId", userData.communityId);
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
    form.append("planBookAttachments[1].contentType", 'file');
    form.append("planBookAttachments[1].name", planBookAttachmentsName);
    form.append("planBookAttachments[1].fileSize", planBookAttachmentsSize);

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://wechattest.zuolin.com/evh/incubator/addIncubatorApply",
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
            layer.msg('提交成功', 1, 13);
        }else if(error==10002){
            layer.msg("现在只能重新提交在审核中的记录。");
        }else{
            layer.msg("很抱歉提交失败，请重新提交");
        }
    });
}

function getCookie( name ) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    var end = null;
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
        end = document.cookie.indexOf(";", begin);
    } else {
        begin += 2;
        end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }

    return decodeURI(dc.substring(begin + prefix.length, end) ).replace(/"/g, '');
}