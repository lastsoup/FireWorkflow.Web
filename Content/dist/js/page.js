//var host = "http://10.211.55.11:8084/wfapi";
var host = "https://58.213.48.24:3001";
var WFUrl = "http://58.213.48.24:3002/WorkflowProcessView.aspx";
var InstanceStateEnum = { 0: "INITIALIZED", 1: "RUNNING", 7: "COMPLETED", 9: "CANCELED" };
$(document).ready(function () {
    $("#mainHeadName,#mainHeadActive").text("创建任务");
    /*$.getJSON(host+"/api/SetCookie?name=manager&callback=?", function (data) {
        
    });*/
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

     $.ajax({
            type: "GET",
            url:host+"/api/workitemlist?state=0",
            cache: false,
            async: true,
            dataType: "jsonp",
            jsonp: 'callback',
            timeout:2000,
            success: function (data) {
               $("#load-mask").hide();  
            },
            error: function () {
               if(confirm("可能是证书错误引起的超时，是否验证证书？")){
                    alert("请确保浏览器没有阻止弹出框，否则数据无法正常显示！")
                    //建立安全连接
                    var l=(screen.availWidth-300)/2;
                    var t=(screen.availHeight-300)/2; 
                    var winObj=window.open(host+"/api/SetCookie?name=manager",'newindow','height=300,width=300,top='+t+',left='+l+',toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
                    var loop = setInterval(function() {   
                        if(winObj.closed) {  
                            clearInterval(loop);  
                            $("#load-mask").hide(); 
                        }  
                    }, 1000);
               }else{
                 $("#load-mask").hide();
               }
            }

          });
});
