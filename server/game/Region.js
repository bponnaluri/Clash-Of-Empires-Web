
function Region(x,y,size){

    var myOwner=null;
    var myLoc=new Point(x,y);
    var mySize=size;
    var borders=[];
    var name=x+":"+y;

    var maxHP=1000;
    var curHP=1000;

    this.loseHP=function(aStr){
        curHP=Math.max(0,curHP-aStr);
    }

    this.heal=function(){
        curHP=Math.min(1000,curHP+1);
    }

    this.getHP=function(){
        return curHP;
    }



    this.setName=function(nm){
        name=nm;
    }

    this.getName=function(){
        return name;
    }

    this.addBorder=function(border){
        borders.push(border);
    }

    this.hasBorder=function(other){
        return borders.indexOf(other)!==-1;
    }

    this.getBorders=function(){
        return borders;
    }

    this.getRenderState=function(){
        return new RegionRenderState(myLoc.getX(),myLoc.getY(),myOwner.getNum(),mySize,myOwner.getArmy(this),curHP);
    }

    this.setOwner=function(owner){
        if(myOwner!==null){
            myOwner.removeRegion(this);
        }
        myOwner=owner;
        owner.addRegion(this);
    }

    this.getOwner=function(){
        return myOwner;
    }

    this.getX=function(){
        return myLoc.getX();
    }

    this.getY=function(){
        return myLoc.getY();
    }

    this.getSize=function(){
        return mySize;
    }

    this.getLocation=function(){
        return myLoc
    }

    this.distance=function(other){
        return myLoc.getDistance(other);
    }

    this.buildTroop=function(){
        myOwner.buildTroop(this);
    }

    /**
     * Generates a string hash for the region for use in dictionaries.
     */
    this.hashCode=function(){
        return myLoc.getX()+":"+myLoc.getY();
    }

}

/**
 * This object is used to export data about the region that will be rendered.
 * @param x
 * @param y
 * @param owner
 * @param size
 * @constructor
 */
function RegionRenderState(x,y,owner,size,army,curHP){

    var myX=x;
    var myY=y;
    var myOwner=owner;
    var mySize=size;
    var myArmy=army;
    var hitPoints=curHP;

    this.getHP=function(){
        return hitPoints;
    }
    this.getArmy=function(){
        return myArmy;
    }

    this.getOwner=function(){
        return myOwner;
    }

    this.getX=function(){
        return myX;
    }

    this.getY=function(){
        return myY;
    }

    this.getSize=function(){
        return mySize;
    }

}