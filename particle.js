config = {
    count:30,
    show:true,
    //distance:100
    distance:window.screen.width > window.screen.height?window.screen.width/8:window.screen.height/8
}
window.onload = ()=>{new p5(s,'particleBG')}


let library = document.createElement('script')
library.src = 'p5.min.js'
document.head.appendChild(library)

const s = (p) => {

    console.log('Particle Loaded')

    particles = []
    
    //config = config

    p.setup = ()=>{
        p.createCanvas(p.windowWidth, p.windowHeight)
        for(let i = 0; i < config.count; i++){
            particles.push(createParticle())
        }
    }

    createParticle = ()=>{
        let pos = p.createVector(p.random(0,p.width),p.random(0,p.height))
        let vel = p.createVector(p.random(0,p.width),p.random(0,p.height))
        return new Particle(pos,vel,p.random(0.00,5.00),p.random(0.001,0.01),config.distance)
    }
    p.draw = ()=>{
        p.background(0)

        for(let pi = particles.length-1; pi > 0; pi--){
            if(config.show){
                particles[pi].show(p)
            }
           
            particles[pi].update()
            particles[pi].isEdge(p,particles,pi)
            particles[pi].connect(p,particles)
        }
    }

};

class Particle{
    constructor(pos,vel,size = 0,fade = 0.01,distance){
        this.pos = pos
        this.vel = vel

        this.grow = true
        this.fade = fade
        this.size = size
        this.max_size = 5

        this.distance = distance
    }

    connect(p,particles){
        particles.forEach((part)=>{
            let dst = p.dist(this.pos.x,this.pos.y,part.pos.x,part.pos.y)
            if(dst < this.distance){
                if(this.size < 1) return
                p.push()
                p.strokeWeight(p.map(dst,0,this.distance,1,0))
                p.stroke('ORANGE')
                p.line(this.pos.x,this.pos.y,part.pos.x,part.pos.y)
                p.pop()
            }
        })
    }

    isEdge(p){
        let pos = this.pos
        if(pos.x <= 0 || pos.x > p.width || pos.y < 0 || pos.y > p.height){
            this.size = 0
            this.pos = p.createVector(p.random(0,p.width),p.random(0,p.height))
            this.vel = p.createVector(p.random(0,p.width),p.random(0,p.height))
            this.vel.rotate(p.random(0,360))
        }
    }

    update(){
        let dir = this.vel.setMag(1)
        this.pos.sub(dir)

        if(this.grow){
            if(this.size < this.max_size){
                this.size+=this.fade
            }else{
                this.grow = false
            }
        }else{
            if(this.size > 0){
                this.size-=this.fade
            }else{
                this.grow = true
            }
        }
    }

    show(p){
        p.fill('ORANGE')
        p.ellipse(this.pos.x,this.pos.y,p.map(p.cos(this.size),0,1,0,this.max_size))
    }
}