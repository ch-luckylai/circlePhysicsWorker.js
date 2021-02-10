TEST = 1

function getMousePos(evt) {
    var rect = evt.srcElement.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left - 240,
        y: 180 - (evt.clientY - rect.top)
    };
}


class Render{
	constructor(selector){
		this.canvas = document.querySelector(selector);
		this.ctx = this.canvas.getContext("2d") 
	}
	
	clear(){
		this.ctx.clearRect(0,0,480,360)
	}
	
	draw(circle){
		this.ctx.beginPath()
		this.ctx.arc(circle.position.x + 240 ,180 - circle.position.y,
			circle.r,0,2*Math.PI)
		this.ctx.stroke()
	}
}



function Create(option){
	World.push({x:option.x,y:option.y,r:10,restitution:0.8})
}

function log(c){
	console.log("Vx : ", c.linearVelocity.x)
	console.log("Vy : ", c.linearVelocity.y)
}


if(TEST){
	window.onload = function(){
		rd = new Render("Canvas")
		rd.canvas.addEventListener("click",function(evt){
			Create(getMousePos(evt))
		})
		setInterval(function(){
			for(let _ = 0 ; _ < World.framePerTick  ; _ ++ )	{
				World.update()
				rd.clear()
				for(let i = 0 ; i < World.BodiesLen ; i ++){
					rd.draw(World.Bodies[i])
				}	
			}
		},30)
	}
}

