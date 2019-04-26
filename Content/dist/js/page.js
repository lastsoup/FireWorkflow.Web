$(document).ready(function () {
    $("#mainHeadName,#mainHeadActive").text("创建任务");
    $("#mainHeadContent").text("任务列表");
    x$('#maincontent').xhr('inner', './page/createtask.html?t=' + new Date().getTime());
    $(".treeview-menu a,.root-menu a").not($("#wfdesinger")).click(function () {
        var href=$(this).attr("action-href");
        var text=$(this).text();
        var title=$(this).attr("action-title");
        $(".treeview-menu li").removeClass("active");
        $(this).parent().addClass("active");
        $("#mainHeadName,#mainHeadActive").text(text);
        $("#mainHeadContent").text(title);
        x$('#maincontent').xhr('inner', './page/'+href+'.html?t=' + new Date().getTime());
    });

    var username="manager";
    $.getJSON(host+"/api/SetCookie?name="+username+"&callback=?", function (data) {
        if(data.Res=="Success")
        {
            $("#username").text(username);
            alert(username+"登录成功！");
        }
         
    });
    $("#load-mask").hide(); 

    $(document).on('click', "[data-toggle='fullscreen']", function () {
        var doc = document.documentElement;
        if ($(document.body).hasClass("full-screen")) {
            $(document.body).removeClass("full-screen");
            document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen && document.webkitExitFullscreen();
        } else {
            $(document.body).addClass("full-screen");
            doc.requestFullscreen ? doc.requestFullscreen() : doc.mozRequestFullScreen ? doc.mozRequestFullScreen() : doc.webkitRequestFullscreen ? doc.webkitRequestFullscreen() : doc.msRequestFullscreen && doc.msRequestFullscreen();
        }
    });
    //  $.ajax({
    //         type: "GET",
    //         url:host+"/api/workitemlist?state=0",
    //         cache: false,
    //         async: true,
    //         dataType: "jsonp",
    //         jsonp: 'callback',
    //         timeout:2000,
    //         success: function (data) {
    //            $("#load-mask").hide();  
    //         },
    //         error: function () {
    //            if(confirm("可能是证书错误引起的超时，是否验证证书？")){
    //                 alert("请确保浏览器没有阻止弹出框，否则数据无法正常显示！")
    //                 //建立安全连接
    //                 var l=(screen.availWidth-300)/2;
    //                 var t=(screen.availHeight-300)/2; 
    //                 var winObj=window.open(host+"/api/SetCookie?name=manager",'newindow','height=300,width=300,top='+t+',left='+l+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
    //                 var loop = setInterval(function() {   
    //                     if(winObj.closed) {  
    //                         clearInterval(loop);  
    //                         $("#load-mask").hide(); 
    //                     }  
    //                 }, 1000);
    //            }else{
    //              $("#load-mask").hide();
    //            }
    //         }

    //       });
});
