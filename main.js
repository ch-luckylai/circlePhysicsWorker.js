/**
 * @anthor Lucky Lai luckylai1126@foxmail.com
 * @version 1.0
 * 
 * An easy physical engine with gravity , hit events and circle object.
*/


/**
 * A 2d Vector
 * @class
*/
class Vector2{
	/**
	 * build a vector object (x,y)
	 * @constructor
	 * @param {number} x 
	 * @param {number} y
	*/
	constructor(x,y){
		this.x = x
		this.y = y
	}
	
	/**
	 * deep clone a new Vector2 Object
	 * @returns {Vector2}
	*/
	clone(){
		return new Vector2(this.x,this.y)
	}
	
	/**
	 * add a Vector object , the same as +=
	 * @param {Vector2} v
	*/
	add(v){
		this.x += v.x
		this.y += v.y
	}
	
	/**
	 * add v but not change the value, the same as +
	 * @param {Vector2} v
	 * @returns {Vector2}
	*/ 
	added(v){
		return new Vector2(this.x + v.x , this.y + v.y)
	}
	
	/**
	 * multiply a number (scalar) , the same as *
	 * @param {number} mul
	 * @returns {Vector2}
	*/ 
	times(mul){
		return new Vector2(this.x * mul ,this.y * mul)
	}
	
	/**
	 * get the length of vector
	 * @returns {number}
	*/ 
	length(){
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}
	
	/**
	 * get the angle between vector and x-axis
	 * @returns {number}
	*/ 
	angle(){
		if(this.x == 0){
			if(this.y > 0){
				return Math.PI / 2
			}
			return - Math.PI
		}
		if(this.x > 0){
			return Math.atan(this.y / this.x) 
		}
		return Math.atan(this.y / this.x) + Math.PI
	}
	
	
}


/**
 * A 2d Vector
 * @class
*/
class Circle{
	
	/**
	 * build a Circle
	 * init with position , radius(optional) and restitution(optional)
	 * 
	 * @connstructor
	 * @param {Object} option
	*/
	constructor(option){
		this.position = new Vector2(option.x,option.y)
		this.mass = option.mass || 1
		this.invmass = 1 / this.mass
		this.linearVelocity = new Vector2(0,0)
		this.r = option.r || 10
		this.force = new Vector2(0,0)
		this.restitution = option.restitution || 1
		
	}
	
	/**
	 * DO NOT CALL IT
	 * @param {number} dt
	*/ 
	integrateVelocity(dt){
		this.linearVelocity.add(this.force.times(dt * this.invmass))
		this.force = new Vector2(0,0)
	}
	
	/**
	 * DO NOT CALL IT
	 * @param {number} dt
	*/ 
	integratePosition(dt){
		this.position.add(this.linearVelocity.times(dt))
	}
	
	/**
	 * DO NOT CALL IT
	 * @param {number} dt
	*/ 
	applyGravity(dt){
		this.force.add(World.Gravity.times(this.mass*dt))
	}
	
	/**
	 * update Gravity , Velocity and Position
	 * @param {number} dt
	*/ 
	tick(dt){
		this.applyGravity(dt)
		this.integrateVelocity(dt)
		this.integratePosition(dt)
	}
}

/**
 * hit event between two circles
 * @param {Circle} c1
 * @param {Circle} c2
 */
function hitEvent(c1,c2){
	relativeDistanceVect = new Vector2(
		c2.position.x - c1.position.x,
		c2.position.y - c1.position.y
	)
	if (relativeDistanceVect.length() <= c1.r + c2.r){
		let d = c1.r + c2.r
		let dx = c1.position.x - c2.position.x
		let dy = c1.position.y - c2.position.y
		c1.position.add(new Vector2(
			- (relativeDistanceVect.length() - d ) * dx / d / 2,
			- (relativeDistanceVect.length() - d ) * dy / d / 2
		))
		c2.position.add(new Vector2(
			(relativeDistanceVect.length() - d ) * dx / d / 2,
			(relativeDistanceVect.length() - d ) * dy / d / 2
		))
		relativeVelocityVect = new Vector2(
			c2.linearVelocity.x - c1.linearVelocity.x,
			c2.linearVelocity.y - c1.linearVelocity.y
		)
		angleAlpha = relativeVelocityVect.angle() - relativeDistanceVect.angle()
		m1 = c1.mass
		m2 = c2.mass
		v1 = relativeVelocityVect.length() * Math.cos(angleAlpha)
		v2 = 0
		_v1 = (v1 * (m1 - m2) + 2 * m2 * v2 )/ (m1 + m2)
		_v2 = (v2 * (m2 - m1) + 2 * m1 * v1 )/ (m1 + m2) 
		
		
		a = new Vector2(
			-(_v1 - v1)* Math.cos(relativeDistanceVect.angle()) ,
			-(_v1 - v1)* Math.sin(relativeDistanceVect.angle()),
		)
		b = new Vector2(
			-_v2 * Math.cos(relativeDistanceVect.angle()),
			-_v2 * Math.sin(relativeDistanceVect.angle()),
		)
		c1.linearVelocity.add(a)
		c2.linearVelocity.add(b)
	}
}
/**
 * test if the circle hit the wall and reflect it 
 * @param {Circle} circle
 */ 
function hitWall(circle){
	if((World.Size.x - circle.r) < Math.abs(circle.position.x)){
		circle.position.x = Math.sign(circle.position.x) * (World.Size.x - circle.r)
		circle.linearVelocity.x *= - circle.restitution
	}
	if((World.Size.y - circle.r) < Math.abs(circle.position.y)){
		circle.position.y = Math.sign(circle.position.y) * (World.Size.y - circle.r)
		circle.linearVelocity.y *= - circle.restitution
	}
}

/**
 * namespace of the whole engine
 * @namespace World
*/
var World = {}

/**
 * the Gravity of this world
 * @member {Vector2} Gravity
*/

World.Gravity = new Vector2(0,-0.1)
/**
 * the Size of this world
 * @member {Vector2} Size
*/
World.Size = new Vector2(240,180)
/**
 * the Objects in this world
 * @member {Objects[]} Bodies
*/
World.Bodies = []
/**
 * the amount of Objects in this world
 * @member {number} BodiesLen
*/
World.BodiesLen = 0
/**
 * the update rate of the world
 * @member {number} framePerTick
*/
World.framePerTick = 5
/**
 * update time per tick of the world
 * @member {number} timeStep
*/
World.timeStep = 1 / World.framePerTick
/**
 * update the world
 * @function update
*/
World.update = function(){
	for(let i = 0 ; i < World.BodiesLen ; i ++){
		World.Bodies[i].tick(World.timeStep)
	}
	for(let i = 0 ; i < World.BodiesLen ; i ++){
		for(let j = i + 1 ; j < World.BodiesLen ; j ++){
			hitEvent(World.Bodies[i],World.Bodies[j])
		}
	}
	for(let i = 0 ; i < World.BodiesLen ; i ++){
		hitWall(World.Bodies[i])
	}
}

/**
 * push a circle into the world
 * @function update
 * @param {Object} option
*/
World.push = function(option){
	World.Bodies.push(new Circle(option))
	World.BodiesLen ++
}

/**
 * main worker function
 * @function main
*/
function main(args){
	try{
		switch(args.action){
			case "reset":
				World.Bodies = []
				World.BodiesLen = 0
			case "setFramePerTick":
				World.framePerTick = args.value || 30
				World.timeStep = 1 / World.framePerTick
			case "update":
				ticks = args.value || 1
				for(let _ = 0 ;_ < ticks ; _++ ){
					World.update()
				}
			case "getBodies":
				let x = []
				let y = []
				let r = []
				for(let index = 0 ; index < World.BodiesLen ;index ++ ){
					x.push(World.Bodies[index].position.x)
					y.push(World.Bodies[index].position.y)
					r.push(World.Bodies[index].r)
				}
				result = JSON.stringify(
					{x:x,y:y,r:r}
				)
				return {status:"ok",data:result}
			case "addBodies":
				option = JSON.parse(arg.value)
				World.push(option)
			case "deleteBodies":
				World.Bodies.pop(args.value || 0)
				World.BodiesLen --
			case "setWeight":
				World.Size.x = args.value || 240
			case "setHeight":
				World.Size.y = args.value || 180
			case "setGravityX":
				World.Gravity.x = args.value || 0
			case "setGravityY":
				World.Gravity.y = args.value || -0.1
			default:
				return {status:"error","error":"Unknow action"}
			return {status:"ok"}
		}
	}
	catch(e){
		return {"error":"Unknow Error","status":"error"}
	}

}

/*
 * 
 * The following code is used for local testing

TEST = 0

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

*/
