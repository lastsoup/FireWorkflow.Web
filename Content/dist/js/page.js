var host = "https://58.213.48.24:3001";
var WFUrl = "https://58.213.48.24:3002/WorkflowProcessView.aspx";
var InstanceStateEnum = { 0: "INITIALIZED", 1: "RUNNING", 7: "COMPLETED", 9: "CANCELED" };
$(document).ready(function () {
    $("#mainHeadName,#mainHeadActive").text("创建任务");
    $("#mainHeadContent").text("任务列表");
    x$('#maincontent').xhr('inner', './page/createtask.html?t=' + new Date().getTime());
    $(".treeview-menu a").not($("#wfdesinger")).click(function () {
        var href=$(this).attr("action-href");
        var text=$(this).text();
        var title=$(this).attr("action-title");
        $(".treeview-menu li").removeClass("active");
        $(this).parent().addClass("active");
        $("#mainHeadName,#mainHeadActive").text(text);
        $("#mainHeadContent").text(title);
        x$('#maincontent').xhr('inner', './page/'+href+'.html?t=' + new Date().getTime());
    });

    $.get("/Designer/LoanProcess.xml",function(data){
        var father=$(data)[0].firstElementChild;
        var dd=father.getElementsByTagName("fpdl:StartNode");
        console.log($(dd).attr("Id"));
        console.log(data);
    });

     $.get("/Designer/Goods_Deliver_Process.xml",function(data){
        var father=$(data)[0].firstElementChild;
        var dd=father.getElementsByTagName("fpdl:StartNode");
        console.log($(dd).attr("Id"));
        console.log(data);
    });
});
