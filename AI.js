/****
* author: Chao Xiang
* update: May 12
* Theory: This is a dynamic system, we get two kinds of nano bots that can move
* positively, and source one that can only be changed of position by push,those
* are that drving system requires. H bot can move to a place in aid of V bots.
* the same with V bots, and S bots need help from both of them.
* H(x,y)=F1(V,x0,y0);
* V(x,y)=F2(H,x0,y0);
* S(x,y)=F3(H,V,x0,y0);
* while with O and T bots to be obstacles, we have
* H(x,y)=F1(V,O,T,x0,y0);
* V(x,y)=F2(H,O,T,x0,y0);
* S(x,y)=F3(H,V,O,T,x0,y0);
* This dynamics system truly behaves not linearly, but highly nonlinearly, so we
* use learning methods to approach the solution.
* If we are to solve F3 out, we need to get F1 and F2 clear.
* The nanobots are going to self-orgnize itself to build rules of F1 and F2, F3.
* F1->F2->F3
****/

// AI Algorithm test
/*** Easy Move for AI Processing Actions ***/
var point=(function()
{
    return funciton(x,y)
    {
        this.x=x;
        this.y=y;
    };
})();

// we need a stack to push those actions, and then push them into a pipeline
var pipeline=(function(){
    return function(){
        var me=this;
        var acts=[];
        this.push=function(move){
            var b=move.b; // bot 
            var p=move.p; // position
            acts.push({'bot':b,'position':p});
        };
        this.pop=function(){
            var m=acts.pop();
            m.bot.move_to(m.position);
        };
        this.empty=function(){
            while(acts.length>0)
            {
                me.pop();
            }
        };
    };
})();

var action=(function()
{
	// goes to the direction that enables the source bot to get close the target
	this.start_random_mode=function()
	{
	    // for each nanobot, we try to collect the steps that makes it closer to
	    // target
	    
	};
	
    // push action is just a logic link of different actions
    this.push=(function(){
        return function(o,p){
            
        };
    });
	this.move=(function(){
        // p is instance of Point(x,y)
        // o is instance of bot
	    return function(o,p)
        {
            // move a bot to certain position p(x,y), from o.p(x0,y0)
            // in equation form, it is: move(o, o.p.x, o.p.y, p.x, p.y)
            if(!(o instanceof bot))
            {
                set.log('Error, '+o+' is not a bot, cannot do action[move].');
                return false;
            }
            if(!(o instanceof point))
            {
                set.log('Error, '+p+' is not a point, cannot do action[move].');
                return false;
            }
            if(o.type=='H'&&o.get_y()==p.y)
            {
                o.move_to(p);
                return true;
            }
            if(o.type=='V'&&o.get_x()==p.x)
            {
                o.move_to(p);
                return true;
            }
            // if this move is a compicated one that cannot be realized
            // by simply set the bot there, but use others' push
            if(o.type=='H')
            {
                // this move will be finished by two crossed action
                // firstly, complete the horizontal move
                o.move_to(p);
                // secondly use the push way
                
                
                return true;
            }
        }
    })();
	
})();