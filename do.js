/*** load some resource from remote server begin ***/

var icons=[];
icons['S'] = new Image();
icons['S'].src = 'bots/S.jpg';
icons['H'] = new Image();
icons['H'].src = 'bots/H.jpg';
icons['V'] = new Image();
icons['V'].src = 'bots/V.jpg';
icons['O'] = new Image();
icons['O'].src = 'bots/O.jpg';
icons['T'] = new Image();
icons['T'].src = 'bots/T.jpg';
// if we want to use the icons, just code line like this:
// ctx.drawImage(icons.S);

/*** load some resource from remote server end ***/


var cv = document.getElementById('can');
cv.style.cursor = 'crosshair';
var ctx = cv.getContext('2d');

//console.log(ctx);
var set=[];
set.d=15;
set.w=30;// unit is set.d*1
set.h=30;// unit is set.d*1
set.style='rgb(40,80,160)';
set.logee=document.getElementById('tip');
set.screen=document.getElementById('game-screen');
set.screen.x=parseInt(set.screen.style.left);
set.screen.y=parseInt(set.logee.style.height);
set.session=0;
set.source=[];
set.target=[];
set.time=0;
set.unit=100;
set.interval=0;
set.bots=[];
set.start_game=function(){};
set.end_game=function(){};
set.get_distance=function(s,t)
{
	return (s.get_x()-t.get_x())*(s.get_x()-t.get_x())+(s.get_y()-t.get_y())*(s.get_y()-t.get_y());
};
set.log=function(LOGINFO)
{
	set.logee.innerHTML = LOGINFO;
};
set.m=(function() // m is map of all registered bots
{
	var m=new Array();
	for(var i=0;i<set.w;i++)
	{
		m[i]=new Array();
		for(var j=0;j<set.h;j++)
		{
			// means the place is not taken by any bot
			m[i][j]=0;	
		}
	}
	return m;
})();

/*** components definition here ***/
// copy operation between two images
function copy(im1,im2)
{
    // shalow copy won't solve the prolem,like this:
    //imdata.data=ctx.getImageData(0,0,240,200).data;//[wrong way to copy]

    // deep copy
    var n=im1.data.length;
    for(var i=0;i<n;i++)
    {
        im2.data[i]= im1.data[i];
    }
}

// function to copy color struct
function copy_color(color)
{
	// deep copy the color arg
	return {r:color.r,g:color.g,b:color.b,a:color.a};
}

// create a image with initial black color
function create()
{
    var im=ctx.createImageData(set.w*set.d,set.h*set.d);
    return im;
}

// grayscalize the image
function grayscale(im)
{
    var nim = create();
    copy(im,nim);
    var n = nim.data.length;
    for(var i=0;i<n;i+=4)
    {
        var r=im.data[i];
        var g=im.data[i+1];
        var b=im.data[i+2];
        var a=im.data[i+3];
        nim.data[i+2]=nim.data[i+1]=nim.data[i]=parseInt(0.3*r+0.59*g+0.11*b);
    }
    return nim;
}

// update the scene
function update(oim)
{
	// according to some rules, update them
	// actually we could something more to make this works better
	return oim;
}

// render the scene when move something
function render()
{
	// clear tip area
	// set.logee.innerHTML = '';
    // redraw rect place
    var nim = update(set.im);
    ctx.putImageData(nim,set.w,set.h);
}

function clear()
{
	ctx.fillStyle = set.style;
	ctx.fillRect(0,0,set.w*set.d,set.h*set.d);
}
// initial 
clear();

function erase(x,y)
{
	ctx.fillStyle = set.style;
	ctx.fillRect(x*set.d,y*set.d,set.d,set.d);
	// add borders
	// in 4 directions
	ctx.beginPath();
	ctx.strokeStyle='rgb(250,250,250)';
	ctx.lineWidth=1;
	ctx.strokeRect(x*set.d,y*set.d,set.d,set.d);
	set.m[x][y]=0;
}
// test
// erase(10,10);

/*** function definition end ***/

/*** some post-function sets are created here ***/
set.im=create();

/*** class ***/
/**
* arg structure:
* arg={name:name,x:x,y:y,type:type}
**/
var bot=(function()
{
		return function(arg)
		{
			var me=this;
			var name=arg.name;
			var x=arg.x;
			var y=arg.y;
			var type=arg.type;
			this.get_name=function()
			{
				return name;
			};
			this.get_x=function()
			{
				return x;
			}
			this.get_y=function()
			{
				return y;
			};
			this.get_type=function()
			{
				return type;
			};
			// some initial action
			//register
			if(set.m[x][y]==0)
			{
				set.m[x][y]=me;	
			}
			else
			{
				set.log('ERROR WHEN ATEMPTING TO PUT BOTS ON POSITION('+x+','+y+')');
			}
			
			this.print=function()
			{
				set.log('name: '+name+'<br/>'+'x: '+x+'<br/>'+'y: '+y+'<br/>');		
			};
			this.draw=function()
			{
				var im=set.im;// doesn't copy,but copy pointer only
				var d=set.d;
				var w=set.w;
				var h=set.h;
				/** previous thought is : use color to identify bots, this is not very reasonable
				// start point is : (x*d,y*d)
				// end point is: (x*d+d,y*d+d)
				// first line is: (x*d,y*d)->(x*d,y*d+d)
				for(var i=x*d;i<x*d+d;i++)
				{
					for(var j=y*d;j<y*d+d;j++)
					{
						im.data[(i*w*d+j)*4]=color.r;
						im.data[(i*w*d+j)*4+1]=color.g;
						im.data[(i*w*d+j)*4+2]=color.b;												
						im.data[(i*w*d+j)*4+3]=color.a;						
					}
				}
				render();
				**/
				// use images to render : faster and better looking
				set.m[x][y]=me;
				ctx.drawImage(icons[type],x*d,y*d);
				
			};
			// remember each time just move by a little
			// there should be a label to show if the move action is successful
				function _left()
				{
					var near=set.m[x-1][y];
					if(near==0)
					{
						// erase the old one
						erase(x,y);
						--x;
						me.draw();
						set.log(name+' move left');
					}
					else
					{
						// means being taken by bots
						if(near.push_left())
						{
							// then me move left too
							erase(x,y);
							--x;
							me.draw();
							set.log(name+' move left');
						}
						else
						{
							set.log(name+' cannot move left!');
							return false;
						}
					}
					
					return true;	
				};
			// positive way to move
			this.move_left=function()
			{
				if(x==0)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H')
				{
					return _left();
				}
				else
				{
					set.log(name+' cannot move left or right!');
					return false;
				}
			};
			
			// passive way to move
			this.push_left=function()
			{
				if(x==0)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H'||type=='V'||type=='S')
				{
					return _left();
				}
				if(type=='O')
				{
					set.log(name+' is an obstacle, cannot move!');
					return false;
				}
				if(type=='T')
				{
					set.log(name+' is a target, cannot move!');
					return false;
				}
			};
			
			// move right
			function _right()
				{
					var near=set.m[x+1][y];
					if(near==0)
					{
						// erase the old one
						erase(x,y);
						++x;
						me.draw();
						set.log(name+' move right');
					}
					else
					{
						// means being taken by bots
						if(near.push_right())
						{
							// then me move left too
							erase(x,y);
							++x;
							me.draw();
							set.log(name+' move right');
						}
						else
						{
							set.log(name+' cannot move right!');
							return false;
						}
					}
					
					return true;	
				};
			// positive way to move
			this.move_right=function()
			{
				if(x==set.w-1)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H')
				{
					return _right();
				}
				else
				{
					set.log(name+' can only move left or right!');
					return false;
				}
			};
			
			// passive way to move
			this.push_right=function()
			{
				if(x==set.w-1)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H'||type=='V'||type=='S')
				{
					return _right();
				}
				if(type=='O')
				{
					set.log(name+' is an obstacle, cannot move!');
					return false;
				}
				if(type=='T')
				{
					set.log(name+' is a target, cannot move!');
					return false;
				}
			};
			
			/*********** moving up and down *********/
			function _up()
				{
					var near=set.m[x][y-1];
					if(near==0)
					{
						// erase the old one
						erase(x,y);
						--y;
						me.draw();
						set.log(name+' move up');
					}
					else
					{
						// means being taken by bots
						if(near.push_up())
						{
							// then me move left too
							erase(x,y);
							--y;
							me.draw();
							set.log(name+' move up');
						}
						else
						{
							set.log(name+' cannot move up!');
							return false;
						}
					}
					
					return true;	
				};
			// positive way to move
			this.move_up=function()
			{
				if(y==0)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='V')
				{
					return _up();
				}
				else
				{
					set.log(name+' cannot move up and down!');
					return false;
				}
			};
			
			// passive way to move
			this.push_up=function()
			{
				if(y==0)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H'||type=='V'||type=='S')
				{
					return _up();
				}
				if(type=='O')
				{
					set.log(name+' is an obstacle, cannot move!');
					return false;
				}
				if(type=='T')
				{
					set.log(name+' is a target, cannot move!');
					return false;
				}
			};
		// MOVING DOWN
			function _down()
				{
					var near=set.m[x][y+1];
					if(near==0)
					{
						// erase the old one
						erase(x,y);
						++y;
						me.draw();
						set.log(name+' move down');
					}
					else
					{
						// means being taken by bots
						if(near.push_down())
						{
							// then me move left too
							erase(x,y);
							++y;
							me.draw();
							set.log(name+' move down');
						}
						else
						{
							set.log(name+' cannot move down!');
							return false;
						}
					}
					
					return true;	
				};
			// positive way to move
			this.move_down=function()
			{
				if(y==set.h-1)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='V')
				{
					return _down();
				}
				else
				{
					set.log(name+' cannot move up and down!');
					return false;
				}
			};
			
			// passive way to move
			this.push_down=function()
			{
				if(y==set.h-1)
				{
					set.log('reached the edge already!');
					return false;
				}
				if(type=='H'||type=='V'||type=='S')
				{
					return _down();
				}
				if(type=='O')
				{
					set.log(name+' is an obstacle, cannot move!');
					return false;
				}
				if(type=='T')
				{
					set.log(name+' is a target, cannot move!');
					return false;
				}
			};
			
			// a global in use method to move to certain point
			var move_steps=(function()
			{
				return function(action,n)
				{
					var times=n;
					function do_next()
					{
						if(times>0&&action())
						{
							times--;
							setTimeout(do_next,set.unit);
						}
					}
					do_next();
				};
			})();
			
			this.move_to=function(p)
			{
				var dis=[];
				dis.dx = p.x-x;
				dis.dy = p.y-y;
				if(dis.dx>0)
				{
					move_steps(me.move_right,Math.abs(dis.dx));
				}
				else
				{
					move_steps(me.move_left,Math.abs(dis.dx));
				}
				if(dis.dy>0)
				{
					move_steps(me.move_down,Math.abs(dis.dy));
				}
				else
				{
					move_steps(me.move_up,Math.abs(dis.dy));
				}
			};
			
			return me;	
		};
})();

/*** deal with event class ***/

// select bot
var select=(function()
{
	return function(target,p)
	{
		//set.log(p1.x+','+p1.y+','+target.name+','+target.type+','+target.x+','+target.y);
		if(target==0){set.log(p.x+','+p.y);}
		else
		{
			set.log('robot '+target.get_name()+' is selected');
			// store the state of selecting
			set.session=target;
			// if session is clear with 0, then means nothing is selected, 
			// else means target is waited to be dealed with
		}
		
	};
})();

// put 
var put=(function()
{
	// target is a blank space or object, p is a point
	return function(target,p)
	{
		set.session.move_to(p);
		set.log('robot '+set.session.get_name()+' is done.');
		set.session=0;
	};
})();

var detect=(function()
{
	return function()
	{
		// detect if a bot is touched
		var p1=[];
		p1.x=event.clientX-set.screen.x;
		p1.y=event.clientY-set.screen.y;
		// map the mouse position to 
		p1.x=Math.floor(p1.x/set.d);
		p1.y=Math.floor(p1.y/set.d);
		var target=set.m[p1.x][p1.y];
		// determine to touch or put
		if(set.session==0)
		{
			select(target,p1);
		}
		else
		{
			put(target,p1);
		}
	};
})();

// some drawing helpful functions 
set.drawHL=(function()
{
	return function(h)
	{
		ctx.beginPath();
		ctx.moveTo(0,h*set.d);
		ctx.lineTo(set.d*set.w,h*set.d);
		ctx.strokeStyle='rgb(250,250,250)';
		ctx.lineWidth=1;
		ctx.stroke();
		return set;
	};
})();

set.drawVL=(function()
{
	return function(w)
	{
		ctx.beginPath();
		ctx.moveTo(w*set.d,0);
		ctx.lineTo(w*set.d,set.d*set.w);
		ctx.strokeStyle='rgb(250,250,250)';
		ctx.lineWidth=1;
		ctx.stroke();
		return set;
	};
})();

// add event listener
cv.addEventListener('mousedown',detect, false);

// initial the scene
// draw horizontal lines
for(var i=0;i<set.h;i++)
{
	set.drawHL(i);
}
// draw vertical lines
for(var i=0;i<set.h;i++)
{
	set.drawVL(i);
}

// GAME-LEVEL FUNCTIONS
set.generate_scene=(function()
{
	return function()
	{
		set.source=new bot({name:'S1',x:13,y:7,type:'S'});
		set.source.draw();
		
		set.bots['H1']=new bot({name:'H1',x:6,y:12,type:'H'});
		set.bots['H1'].draw();

		set.bots['V1']=new bot({name:'V1',x:10,y:9,type:'V'});
		set.bots['V1'].draw();
		
		set.bots['O1']=new bot({name:'O1',x:9,y:8,type:'O'});
		set.bots['O1'].draw();
		
		set.target=new bot({name:'T1',type:'T',x:10,y:16});
		set.target.draw();
	};	
})();

// check if successful
set.check=function()
{
	setInterval(function()
	{
		if(set.get_distance(set.source,set.target)<=1)
		{
			set.log('YOU WIN! COST:<font color=RED>'+Math.floor(set.time*set.unit/1000)
				+'</font> seconds, more difficult? click NEXT');
		}
	},set.unit);
};

set.start_game=(function()
{
	return function()
	{
		set.generate_scene();
		set.time=0;
		if(set.interval!=0)
		{
			cleartInterval(set.interval);
		}
		set.interval=setInterval(function()
		{
			++set.time;
			//set.log(Math.floor(set.time*set.unit*0.001));
			// need to check if the source touch the target
			if(set.get_distance(set.source,set.target)<=1)
			{
				set.end_game();
			}
		},set.unit);
		set.check();
	};
})();

set.end_game=(function()
{
	return function()
	{
		clearInterval(set.interval);
	};
})();

set.start_game();

// a flash
var n=30;
var n1=30;
var timer=setInterval(function(){
		if(--n>0)
		{
			set.bots['V1'].move_down();	
		}
		else
		{
			clearInterval(timer);
		}
	},set.unit);
	
// A QUIZ
var timer1=setInterval(function(){
		if(--n1>0)
		{
			set.bots['H1'].move_right();
		}
		else
		{
			clearInterval(timer1);
		}
	},set.unit);
