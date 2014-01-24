function GameMap(){


    var socket = io.connect('http://192.17.224.200:880');//Connect to server.

    var mapGen=new Europe();
    var data=mapGen.generateMap();
    var regions=data["regions"];
    var players=data["players"];





    //Below are methods for processing input from clients

    var clickA=null;
    var clickB=null;

    this.clearClicks=function(){
        clickA=null;
        clickB=null;
    }

    /**
     * @param pt
     */
    this.processClick=function(pt){
        if(clickA==null){
            clickA=pt;
        }
        else{
            clickB=pt;
            this.processTwoClicks();
            this.clearClicks();
        }
    }

    /**
     * This function is called when two clicks are made.
     */
    this.processTwoClicks=function(){
        var r1=null;
        var min1=99999;
        var r2=null;
        var min2=99999;
        regions.forEach(function(region){
            var rLoc=region.getLocation();
            if(rLoc.getDistance(clickA)<min1){
                r1=region;
                min1=rLoc.getDistance(clickA);
            }
            if(rLoc.getDistance(clickB)<min2){
                r2=region;
                min2=rLoc.getDistance(clickB);
            }
        });
        var a=r1.getLocation();
        var b=r2.getLocation();
        console.log(a.getX()+":"+ a.getY()+" "+ b.getX()+":"+ b.getY());
        this.setMovementCommand(r1,r2);
    }

    this.getFirstClick=function(){
        var arr={};
        if(clickA===null){
            arr["x"]=-1;
            arr["y"]=-1;
        }else{
            arr["x"]=clickA.getX();
            arr["y"]=clickA.getY();
        }
        return arr;
    }

    /**
     * This function sets movement between two regions.
     */
    this.setMovementCommand=function(r1,r2){
        players[0].addMoveCommand(r1,r2);
        //If r1 and r2 are owned by the same player, troops will move.
        //if r1 and r2 are owned by different players, the troops will attack.
    }




    this.updateState=function(){


        //Perform updateState actions.
        players.forEach(function(player){
            player.updateState();
        });


        //Build troops for each region
        regions.forEach(function(region){
            region.buildTroop();
        });


        var renderState=regions.map(function(region){
            return region.getRenderState();
        });

        var regionState=renderState.map(function(state){
            var arr={};
            arr["owner"]=state.getOwner();
            arr["xPos"]=state.getX();
            arr["yPos"]=state.getY();
            arr["size"]=state.getSize();
            arr["army"]=state.getArmy();
            return arr;
        });
        var moveCommands=[];
        players.forEach(function(player){
          //  console.log("Move commands:"+player.getMoveCommands());
            moveCommands=moveCommands.concat(player.exportMoveCommands());
        });
        socket.emit('hostRegionState', { data: regionState});
        return {"regionStates":regionState,"moveCommands":moveCommands};
    }

    this.getRegionCount=function(){
        return regions.length;
    }

    this.getPlayerStates=function(){
        return players.map(function(p){
            return p.getScore();
        });
    }
}
