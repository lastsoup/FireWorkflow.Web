var dagred3Story = function(svgelement) {
    this.g = new dagreD3.graphlib.Graph().setGraph({});
    this.g.setDefaultEdgeLabel(function() { return {}; });
    this.g.graph().marginx = 10;
    this.g.graph().marginy = 10;
    this.g.graph().rankdir = "LR";
    this.g.graph().ranksep = 30;
    this.g.graph().nodesep = 30;
    this.svg = d3.select(svgelement);
    this.inner = this.svg.append("g");
    this.dagreD3render = new dagreD3.render();
};

//创建xml的流程
/*dagred3Story.prototype.createProcess=function(data,sy)
{
        var getId=function(tagName){
          var Node=father.getElementsByTagName(tagName);
          var Id=$(Node).attr("Id");
          return Id;
        }
        var father=$(data)[0].firstElementChild;
        var FrameArry=new Array();
        //添加开始/结束
        var StartNode=["setRadiusNode",getId("fpdl:StartNode"),"开始"];
        var EndNode=["setRadiusNode",getId("fpdl:EndNode"),"结束"];
        FrameArry.push(StartNode);
        FrameArry.push(EndNode);
        //添加同步器
        var syArry=[];
        var Synchronizer=father.getElementsByTagName('fpdl:Synchronizer');
        if(sy){
            $.each(Synchronizer,function(n,i) {
                var Id=$(i).attr("Id");
                FrameArry.push(["setSynchronizer",Id]);
            });
        }else
        {
            $.each(Synchronizer,function(n,i) {
                var Id=$(i).attr("Id");
                syArry.push(["setSynchronizer",Id]);
            });
        }
        //添加任务
        var Activity=father.getElementsByTagName('fpdl:Activity');
         $.each(Activity,function(n,i) {
            var Id=$(i).attr("Id");
            var DisplayName=$(i).attr("DisplayName");
            var ext=$(this.getElementsByTagName("fpdl:ExtendedAttribute"));
            var name=$(ext[ext.length-1]).attr("Name");
            var setFlag=name=="decision"?"setMilestone":"setActivity";
            FrameArry.push([setFlag,Id,DisplayName]);
        });
        //添加流程
        var Transition=father.getElementsByTagName('fpdl:Transition');
        if(!sy) {
            var syStr=syArry.join(",");
            var syObject=new Object();
            var newTr = $.map(Transition, function (n) {
                var To=$(n).attr("To");
                var index=syStr.indexOf(To);
                if(index<0) {
                    return n;
                }else
                {
                    var From = $(n).attr("From");
                    syObject[To]=From;
                }
            });

            $.each(newTr, function (n, i) {
                var From = $(i).attr("From");
                var f=syObject[From];
                From =typeof(f)!="undefined"?f:From;
                var To =$(i).attr("To");
                var DisplayName = $(i).attr("DisplayName");
                FrameArry.push(["AddDependencyEdge", From, To, DisplayName]);

            });

        }else {
            $.each(Transition, function (n, i) {
                var From = $(i).attr("From");
                var To = $(i).attr("To");
                var DisplayName = $(i).attr("DisplayName");
                FrameArry.push(["AddDependencyEdge", From, To, DisplayName]);

            });
        }
        return FrameArry;
}*/

//创建数据库获取的流程
//sy是同步器
dagred3Story.prototype.createFlow=function(data,sy)
{
    var getId=function(tagName){
        var Node=father.find(tagName)
        var Id=$(Node).attr("Id");
        return Id;
    }
    var father=$(data);
    var FrameArry=new Array();
    var TaskObject=new Object();
    //添加开始/结束
    var StartNode=["setStartNode",getId("StartNode"),"开始"];
    var EndNode=["setEndNode",getId("EndNode"),"结束"];
    FrameArry.push(StartNode);
    FrameArry.push(EndNode);
    //添加同步器
    var syArry=[];
    var Synchronizer=father.find('Synchronizer');
    if(sy){
        $.each(Synchronizer,function(n,i) {
            var Id=$(i).attr("Id");
            FrameArry.push(["setSynchronizer",Id]);
        });
    }else
    {
        $.each(Synchronizer,function(n,i) {
            var Id=$(i).attr("Id");
            syArry.push(["setSynchronizer",Id]);
        });
    }
    //添加任务
    var Activity=father.find('Activity');
    $.each(Activity,function(n,i) {
        var Id=$(i).attr("Id");
        var DisplayName=$(i).attr("DisplayName");
        var ext=$(this.getElementsByTagName("ExtendedAttribute"));
        var name=$(ext[ext.length-1]).attr("Name");
        var setFlag=name=="decision"?"setMilestone":"setActivity";
        //添加任务
        var tasks=[];
        $(i).find("Task").each(function(){
            var DisplayName=$(this).attr("DisplayName");
            var task={"DisplayName":DisplayName,"task":""};
            //tasks.push(task);
            TaskObject[Id]=task;
        });
         $(i).find("TaskRef").each(function(){
            var Reference=$(this).attr("Reference");
            var DisplayName=father.find("[Id='"+Reference+"']").attr("DisplayName");
            var task={"DisplayName":DisplayName,"task":""};
            //tasks.push(task);
            TaskObject[Id]=task;
        });
        //FrameArry.push(["setTip",Id,tasks]);
        TaskObject
        FrameArry.push([setFlag,Id,DisplayName]);
    });
    //添加流程
    var Transition=father.find('Transition');
    if(!sy) {
        var syStr=syArry.join(",");
        var syObject=new Object();
        var newTr = $.map(Transition, function (n) {
            var To=$(n).attr("To");
            var index=syStr.indexOf(To);
            if(index<0) {
                return n;
            }else
            {
                var From = $(n).attr("From");
                syObject[To]=From;
            }
        });

        $.each(newTr, function (n, i) {
            var From = $(i).attr("From");
            var f=syObject[From];
            From =typeof(f)!="undefined"?f:From;
            var To =$(i).attr("To");
            var DisplayName = $(i).attr("DisplayName");
            FrameArry.push(["AddDependencyEdge", From, To, DisplayName]);

        });

    }else {
        $.each(Transition, function (n, i) {
            var From = $(i).attr("From");
            var To = $(i).attr("To");
            var DisplayName = $(i).attr("DisplayName");
            FrameArry.push(["AddDependencyEdge", From, To, DisplayName]);

        });
    }
    return {"Frame":FrameArry,"Task":TaskObject};
}

//获取地址参数
$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//var host = "http://10.211.55.11:8084/wfapi";
var host = "https://58.213.48.24:3001";
var WorkflowProcessId;
var InstanceStateEnum = { 0: "INITIALIZED", 1: "RUNNING", 7: "COMPLETED", 9: "CANCELED" };
dagred3Story.prototype.initFlow=function(){
    var index = 0,name,obj=this;
   /* switch(index)
    {
        case 0:
        name="LoanProcess"
        break;
        case 1:
        name="Goods_Deliver_Process"
        break;
    }
     $.get("Designer/"+name+".xml",function(data){
        console.log(data);
        var frame=obj.createProcess(data,false);
        obj.initFrame(frame);
    });*/

    WorkflowProcessId=$.getUrlParam("WorkflowProcessId");
    if(!WorkflowProcessId)
    {
        var ProcessId=$.getUrlParam("ProcessId");
        var Version=$.getUrlParam("Version");
        var ProcessInstanceId=$.getUrlParam("ProcessInstanceId");
        $.getJSON(host+"/api/GetFlowDetail?ProcessId="+ProcessId+"&Version="+Version+"&ProcessInstanceId="+ProcessInstanceId+"&callback=?", function(data){
            var wd=data.WorkFlow;
            var task=data.TaskInstance;
            var ProcessContent=wd.ProcessContent.replace(/fpdl:/g,"");
            $(".viewtitle .title").html(wd.DisplayName);
            $(".viewtitle .chart-des").html(wd.Description);
            $(".viewtitle .down")
            console.log(data);
            var frame=obj.createFlow(ProcessContent,false);
            obj.initFrame(frame,task);
        });
    }else {
        $.getJSON(host+"/api/GetFlowItem?flowItemId=" + WorkflowProcessId + "&callback=?", function (data) {
            var ProcessContent = data.ProcessContent.replace(/fpdl:/g, "");
            $(".viewtitle .title").html(data.DisplayName);
            $(".viewtitle .chart-des").html(data.Description);
            var frame = obj.createFlow(ProcessContent, false);
            obj.initFrame(frame);

        });
    }
   
}

function setSVG(svg_label,text,style){
    var tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
    tspan.textContent = text;
    $.extend(true, tspan.style, style);
    svg_label.appendChild(tspan);
    return svg_label;
}

dagred3Story.prototype.initWebFrame = function(Frame) {
 var g=this.g;  
 this.g.graph().ranksep = 30;
 this.g.graph().nodesep = 30;
 var framobj=new Object();
 Frame.forEach(function(x) {
    var step=x.StepNumber+"_s";
    var newx=typeof (framobj[step]) == "undefined" ?(new Array()):(framobj[step]);
    newx.push(x);
    framobj[step]=newx;
 });
  var From=null;
  for(var name in framobj){
     var item=framobj[name];
     item.forEach(function(x){
        var workitems = typeof (x.workitems[0]) == "undefined" ? [{ActorId:"无",Id:"none"}]: x.workitems;
        var ActorId="";
        var table = document.createElement("table");
        workitems.forEach(function(i) {
            ActorId=ActorId+" "+i.ActorId;
        });
        var svg_label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        svg_label.setAttribute('dy', '1em');
        svg_label.setAttribute('x', '1');
        setSVG(svg_label,x.DisplayName+": ",null);
        var statefill = x.State == TaskInstanceStateEnum[1] ? "#F18308" : "#878787";
        var label=setSVG(svg_label,ActorId,{fill:statefill,fontWeight:"bold"});
        g.setNode(x.Id,{rx:5,ry:5,label: label, labelType: 'svg'});
        //g.setNode(x.Id,{rx:5,ry:5,label:x.DisplayName+": "+ActorId});
        if(From){
           From.forEach(function(f){
                g.setEdge(f.Id, x.Id, {arrowheadStyle: "fill: #333"});
            })
        }
     });
     From=item;
  }
 this.dagreD3render(this.inner,this.g);
 var initialScale = 1;
 this.svg.attr('width', this.g.graph().width * initialScale);
 this.svg.attr('height', this.g.graph().height * initialScale);
}

var setLable=function(text){
    var svg_label = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg_label.textContent = text;
    return svg_label;
}


//加载设置节点操作
dagred3Story.prototype.initFrame = function(f,tasks) {
        this.g.graph().ranksep = 50;
        this.g.graph().nodesep = 20;
        this.g.graph().rankdir = defaultFlowOption.rankdir;
        var loadNode=function(x,t){
            var rectfill="#3E7E9C";
            var linefill="#89bcde";
            var runningclass=t&&t.ActivityId?"run":"";
            if(t){
                linefill=rectfill = t.State == InstanceStateEnum[1] ? "#F18308" : "#878787";
            }
            switch(x[0]) {
                case 'removeNode':
                    this.g.removeNode(x[1])
                    break;
                case 'setActivity':
                    //矩形
                    this.g.setNode(x[1],{label:x[2],class:runningclass,style: "fill:"+rectfill });
                    break;
                case 'setStartNode':
                    //开始矩形
                    this.g.setNode(x[1],{label:x[2],rx:10,ry:10,shape: 'rect',style: "fill:"+rectfill});
                    break;
               case 'setEndNode':
                    //结束矩形
                    this.g.setNode(x[1],{label:x[2],rx:10,ry:10,shape: 'rect',style: "fill:"+rectfill});
                    break;
                case 'setRadiusNode':
                    //圆角矩形
                    this.g.setNode(x[1],{label:x[2],rx:10,ry:10,shape: 'rect'});
                    break;
                case 'setMilestone':
                    //菱形（选择）
                    this.g.setNode(x[1],{label:x[2],shape: 'diamond',class:runningclass,style: "fill:"+rectfill})
                    break;
                case 'setSynchronizer':
                    //S同步器
                    this.g.setNode(x[1],{label:'S',shape: 'circle',padding:5})
                    break;
                case 'AddDependencyEdge':
                {
                    //添加连接线
                    var xlable=setLable(x[3]);
                    this.g.setEdge(x[1], x[2], {
                        label:x[3]
                        ,curve: defaultFlowOption.curve//d3.curveBasis 、curveLinear
                        ,labeloffset:10
                        ,style:"stroke:"+linefill
                        ,arrowheadStyle: "fill:"+linefill
                        ,labelpos: defaultFlowOption.labelpos //c、l、r
                        ,arrowhead: defaultFlowOption.arrowhead//vee、normal、undirected
                    });
                    break;
                }
                default:
                    console.log ("Schedule Network element "+x+" is not implemented")
                }
        }.bind(this);

        if(WorkflowProcessId){
             f.Frame.forEach(function(x) {
                 loadNode(x);
              });
           
        }else{
            //判断是否办结
            var state=$.grep(tasks,function(n,i){
                return n.State != InstanceStateEnum[7];
            }).length;
            f.Frame.forEach(function(x) {
                 
                   var ActivityId=x[0]=="AddDependencyEdge"?x[2]:x[1];
                   var t=$.grep(tasks,function(n,i){
                         return n.ActivityId === ActivityId;
                   })[0];
                    //绑定到悬浮数据
                   if(t){
                      f.Task[t.ActivityId]["task"]=t;
                   }
                   if(state==0){
                     t={"State":"COMPLETED","ActivityId":(typeof(t)=="undefined"?"":t.ActivityId)};
                   }else{
                     t=x[0]=="setStartNode"?{"State":"COMPLETED"}:t;
                   }
                loadNode(x,t);
            });
        }

        if (this.g) {
            this.dagreD3render(this.inner,this.g);
            var inner=this.inner;
            //缩放
            var zoom = d3.zoom().on("zoom", function() {inner.attr("transform", d3.event.transform);});
            this.svg.call(zoom);
            //悬浮提示框
            this.inner.selectAll("g.node").attr("title", function(v) { 
                var task=f.Task[v];
                if(task){
                    var x=task["task"];
                    var ActorId='';
                   if(x){
                     x.workitems.forEach(function(i) {
                        ActorId=ActorId+" "+i.ActorId;
                     });
                   }
                   var dom='<p>任务名：'+task.DisplayName+'</p>';
                   if(ActorId){
                    dom=dom+'<p>执行人：'+ActorId+'</p>';
                   }
                   return dom;
                }
            }).each(function(v) {
                   if(f.Task[v]){
                    $(this).tipsy({ gravity: "w", opacity: 1, html: true });
                   }
                });
            //居中
            var initialScale = 1;
            var w=500,h=500;
            var svg=this.svg;
            var setSize=function(){
              svg._groups.forEach(function(x) {
              w=$(x).parent().width();
              h=$(x).parent().height();
            });
              svg.attr('width', w);
              svg.attr('height', h);
            }
            $(window).resize(function() {
                setSize();
            });
            setSize();
            var x=(w - this.g.graph().width * initialScale) / 2;
            var y=(h- this.g.graph().height * initialScale) / 2;
            this.svg.call(zoom.transform, d3.zoomIdentity.translate(x,y).scale(initialScale));

        }
};
