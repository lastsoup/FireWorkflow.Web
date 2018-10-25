//var host = "http://10.211.55.11:8084/wfapi";
var host = "https://58.213.48.24:3001";
var WFUrl = "http://58.213.48.24:3002/WorkflowProcessView.aspx";
var InstanceStateEnum = { 0: "INITIALIZED", 1: "RUNNING", 7: "COMPLETED", 9: "CANCELED" };
$(document).ready(function () {
    //建立安全连接
    // window.open(host+"/api/SetCookie?name=manager",'newindow','height=300,width=300,top=0,left=0,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no');
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
               alert(22);
            }

          });
});
