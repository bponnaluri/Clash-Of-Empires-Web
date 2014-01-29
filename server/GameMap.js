function GameMap(mapGen){

    var socket = io.connect('http://192.17.205.104:880');//Connect to server.

    var data=mapGen.generateMap();
    var regions=data["regions"];
    var players=data["players"];
    //var humanPlayers=[];
    //humanPlayers[0]=players[0];

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
    this.processClick=function(pt,pName){
        if(clickA==null){
            clickA=pt;
        }
        else{
            clickB=pt;
            this.processTwoClicks(pName);
            this.clearClicks();
        }
    }

    this.getRegions=function(){
        return regions;
    }

    this.getPlayers=function(){
        return players;
    }

    /**
     * This method registers a player so that input associated
     * with a player can be processed.
     */
    this.registerPlayer=function(pName){
        var reg=false;
        players.forEach(function(p){
            if(p.getAI() instanceof Computer){
                if(reg===false){
                    p.setAI(new NoAI(pName));
                    console.log("Registering player");
                    reg=true;
                }
            }
        });
    }

    /**
     * This function is called when two clicks are made.
     */
    this.processTwoClicks=function(pName){
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
        console.log("Click locations "+a.getX()+":"+ a.getY()+" "+ b.getX()+":"+ b.getY());
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
    this.setMovementCommand=function(r1,r2,pName){
        players.forEach(function(p){ //Search for the player with the name.
            if(p.getAI().username(p)===pName){
                p.addMoveCommand(r1,r2);
            }
        });
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
        var moveCommands={};
        players.forEach(function(player){
            moveCommands[player.getAI().username(player)]=player.exportMoveCommands();
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
