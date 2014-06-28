/**
 * This function generates visual data about each region.
 * @param config The configuration file.
 * @constructor
 */
function DataLayer(config){

    var cName='animation';
    var ctx=getCanvas(cName);

    var xScale=1.338;
    var yScale=1.348;
    var zMan=new ZoomManager(xScale,yScale,ctx);

    //Minimum zoom levels for showing certain information
    var minBattleZoom=1.40;
    var minHitPointZoom=1.00;

    //Load explosion image.
    var battleMark=new Image();
    battleMark.src=config["ImageLocs"]["combat"];


    this.zoomIn=function(){
        zMan.zoomIn();
    }

    this.zoomOut=function(){
        zMan.zoomOut();
    }



    var showRegDamage=function(gameState){
        if(zMan.getZoom()>=minHitPointZoom){
            gameState["regionStates"].forEach(function(reg){
                var xO=0;
                var yO=0;
                var rName=reg["name"]
                var w=25/zMan.getZoom()
                var lX=w*reg["hitPoints"]/(1000);
                var xT=(reg["xPos"]-10)+xO;
                var yT=(reg["yPos"]-10)+yO;
                ctx.fillStyle="#00FF00";
                ctx.fillRect(xT,yT,lX,5/zMan.getZoom());
                ctx.fillStyle="#FF0000";
                ctx.fillRect(xT+lX,yT,(w-lX),5/zMan.getZoom());
                ctx.strokeStyle="#000000";
                ctx.strokeRect(xT,yT,w,5/zMan.getZoom());
            });
        }
    }

    var showMoveCommands=function(gameState){
        Object.keys(gameState["moveCommands"]).forEach(function(name){
            gameState["moveCommands"][name].forEach(function(loc){
                var x=avg(loc["x1"],loc["x2"]);
                var y=avg(loc["y1"],loc["y2"]);
                var lineCol="";
                if(name=="Host"){
                    lineCol="#EEE9E9"
                }else{
                    lineCol="#8B2323"
                }
                    var dX=0;
                    var dY=0;
                    var n=loc["sCity"]+"_"+loc["eCity"];
                    var nR=loc["eCity"]+"_"+loc["sCity"];
                    var x1=loc["x1"]+dX;
                    var x2=loc["x2"]+dX;
                    var y1=loc["y1"]+dY;
                    var y2=loc["y2"]+dY;

                    drawArrow(x1,y1,x2,y2,ctx,lineCol);

                if(loc["conflict"]==true){
                    if(zMan.getZoom()>=minBattleZoom){
                        ctx.drawImage(battleMark,loc["x2"]+15,loc["y2"],15/zMan.getZoom(),15/zMan.getZoom())
                    }
                }
            })
        })
    }

    this.update=function(gameState){
        clearCanvas(cName);
        showRegDamage(gameState);
        showMoveCommands(gameState);

    }
}