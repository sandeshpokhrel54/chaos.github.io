//random function
function random(min,max)
{
    return (Math.floor(Math.random() * (max - min + 1 )) + min);
}

// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let pivx = width/2;
let pivy = height/4;
let g = 2;
function dpendulum(angle1,angle2)
{
    this.color = 'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')' ;

    //first bob
    this.mass1 = 20;
    this.string1 = 199;
    this.angle1 = Math.PI / 180 * angle1;
    this.angularvel1 = 0;
    this.angularacc1 = 0;
    this.bob1posx = pivx + this.string1 * Math.sin(this.angle1);
    this.bob1posy = pivy + this.string1 * Math.cos(this.angle1);
    

    //second bob
    this.mass2 = 40;
    this.string2 = 245;
    this.angle2 =  Math.PI / 180  * angle2; 
    this.angularvel2 = 0;
    this.angularacc2 = 0;
    this.bob2posx = this.bob1posx + this.string2 * Math.sin(this.angle2);
    this.bob2posy = this.bob1posy + this.string2 * Math.cos(this.angle2);
    this.history = [];
      
}

dpendulum.prototype.draw = function()
{
    ctx.beginPath();
    //bob1
    ctx.fillStyle = this.color;
    ctx.arc(this.bob1posx,this.bob1posy,15,0,2*Math.PI);
    ctx.fill();
    //bob2
    ctx.arc(this.bob2posx,this.bob2posy,15,0,2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    if (!hide)
    {
    //string1
    ctx.beginPath();
    ctx.moveTo(pivx,pivy);
    ctx.lineTo(this.bob1posx,this.bob1posy);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F0F7D4';
    ctx.stroke();
    //string2
    ctx.beginPath();
    ctx.moveTo(this.bob1posx,this.bob1posy);
    ctx.lineTo(this.bob2posx,this.bob2posy);
    ctx.strokeStyle = '#347B98';
    ctx.lineWidth = 4;
    ctx.stroke();
    }
    
}

dpendulum.prototype.update = function()
{

    //using formula to calculate angular acceleration,angular velocity and angles

    let theta1 = this.angle1;
    let theta2 = this.angle2;
    let num1 = - g * (2 * this.mass1 + this.mass2) * Math.sin(theta1) ;  
    let num2 = - this.mass2 * g * Math.sin(theta1 - 2 * theta2 );
    let num3 = - 2 * Math.sin(theta1 - theta2) * this.mass2 ;
    let num4 = this.angularvel2 * this.angularvel2 * this.string2 + this.angularvel1*this.angularvel1 * this.string1 * Math.cos(theta1 - theta2);
    let nume1 = num1 + num2 + (num3) * (num4);
    let deno1 = this.string1 * (2*this.mass1 + this.mass2 - this.mass2 * Math.cos(2*theta1 - 2*theta2));
    this.angularacc1 = nume1/deno1;

    let nume2 = 2 * Math.sin(theta1 - theta2) * (this.angularvel1*this.angularvel1*this.string1*(this.mass1 + this.mass2) + g * (this.mass1 + this.mass2)* Math.cos(theta1) + this.angularvel2 * this.angularvel2 *this.string2 *this.mass2 * Math.cos(theta1 - theta2));
    let deno2 = this.string2 * (2*this.mass1 + this.mass2 - this.mass2 * Math.cos(2*(theta1 - theta2)));
    this.angularacc2 = nume2/deno2;

    
    this.angularvel1 += this.angularacc1;
    this.angularvel2 += this.angularacc2;
    this.angle1 += this.angularvel1;
    this.angle2 += this.angularvel2;
  
    //updating positions

    this.bob1posx = pivx + this.string1 * Math.sin(this.angle1);
    this.bob1posy = pivy + this.string1 * Math.cos(this.angle1);
    this.bob2posx = this.bob1posx + this.string2 * Math.sin(this.angle2);
    this.bob2posy = this.bob1posy + this.string2 * Math.cos(this.angle2);
    
    //update history
    this.history.push([this.bob2posx, this.bob2posy]);
    this.history = this.history.slice(-50);

}


let hide = false;


let bobs = [];
let  slider = document.querySelector('.slider');
let PNumber = slider.value;
Start = function()
{    
    bobs = [];
    let bobby;
    for (let i = 0; i<PNumber ; i++)
    {
        bobby = new dpendulum(90,i+45);  // each ball only slightly different position from another 
        bobs.push(bobby);
    }

    addEventListener('click',Hidestrings);
}

Hidestrings = function()
{
    if (hide)
        hide = false;
    else
        hide = true;
}
    

const DRAW_TRAIL =true;
//initializing bobs

Start();
slider.oninput = function(){
    PNumber = this.value;
    Start();
}


function loop()
{
   ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,width,height);
    
    for(let j=0 ; j<bobs.length;j++)
    {
        bobs[j].draw();
        bobs[j].update();
    

        if(DRAW_TRAIL)
        {
            ctx.beginPath();
            ctx.strokeStyle = '#FCBA12';
            ctx.moveTo(bobs[j].history[0][0], bobs[j].history[0][1]);
            for(const point of bobs[j].history)
                {
                    ctx.lineTo(point[0], point[1]);
    
                }
                ctx.stroke();
        }
    }

    requestAnimationFrame(loop);

}
loop();

