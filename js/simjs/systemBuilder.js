class Body{
        constructor(body_data=[]){
                if (body_data == []){
                        body_data=["body",1,
                        0,0,0,
                        0,0,0,
                        0,0,0];
                      }
                this.name=body_data[0];
                this.mass=body_data[1];
                this.position=new Point([body_data[2],body_data[3],body_data[4]]);
                this.velocity=new Point([body_data[5],body_data[6],body_data[7]]);
                this.acceleration=new Point([body_data[8],body_data[9],body_data[10]]);
                this.orientation=new Point();
                this.angVelocity=new Point();
                this.acceleration.reset();
                this.radius=.03;
              }
};
class Point{
        constructor( position_data=[0,0,0]){
                this.x=position_data[0];
                this.y=position_data[1];
                this.z=position_data[2];
              }
        reset(){
                this.x=0;
                this.y=0;
                this.z=0;
              }
};

class Galaxy{
    constructor(){
        this.stars = [];
        this.theta = 0;
        this.dTheta = .05;
        this.maxTheta = 10;
        this.alpha = 2000;
        this.beta = 0.25;
        this.e = 2.71828182845904523536;
        this.starDensity = 1;
        while (this.theta< this.maxTheta){
            this.theta+=this.dTheta;
            const randMax = 2000/(1+this.theta/2);
            const randMin = 0-randMax;
            this.starDensity = 10/(1+this.theta/2);
            for (const i=0; i<=this.starDensity;i++){
                const xPos = this.alpha*(Math.pow(this.e,(this.beta*this.theta)))*Math.cos(this.theta);
                const yPos = this.alpha*(Math.pow(this.e,(this.beta*this.theta)))*Math.sin(this.theta);
                const xPos = xPos+ Math.random() * (randMax - randMin) + randMin;
                const yPos = yPos+Math.random() * (randMax - randMin) + randMin;
                const zPos = Math.random() * (randMax - randMin) + randMin;
                const newStar = new Star(xPos,yPos,zPos, "star", "cos");
                this.stars.push(newStar);
            }
        }
    }
}

class Star{
          constructor(xPos=30000, yPos=0, zPos=0, player="duh", aName="default"){
                this.body = new Body(["body",1,xPos,yPos,zPos,0,0,0,0,0,0]);
                this.color = [0.0,0.0,1.0];
                this.mass = 16;
                this.radius = 6.6;
                this.temp= 33000;
                this.buildrandom();
              }
            buildrandom(){
                const starrand = Math.random()*10000;
                if (starrand < 7600){
                        this.mtype();}
                if (starrand < 8800 && starrand > 7600){
                        this.ktype();}
                if (starrand < 9400 && starrand > 8800){
                        this.gtype();}
                if (starrand < 9700 && starrand > 9400){
                        this.ftype();}
                if (starrand < 9800 && starrand > 9900){
                        this.atype();}
                if (starrand < 9900 &&starrand > 9950){
                        this.btype();}
                if (starrand < 9950){
                        this.otype();}
            }
            otype(){
                this.color = [1.0,0.0,0.0];
                this.mass = 16;
                this.radius = 6.6;
                this.temp= 33000;
              }
            btype(){
                this.color = [0.5,0.5,0.8,1.0];
                this.mass = 2.1;
                this.radius = 1.8;
                this.temp= 10000;
                }
            atype(){
                this.color = [1.0,1.0,1.0,1.0];
                this.mass = 1.4;
                this.radius = 1.4;
                this.temp= 7500;
                }
            ftype(){
                this.color = [1.0,1.0,0.8,1.0];
                this.color = [1.0,0.0,0.0];
                this.mass = 1;
                this.radius = 1;
                this.temp= 6000;
                }
            gtype(){
                this.color = [1.0,1.0,0.0,1.0];
                this.mass = .8;
                this.radius = 0.9;
                this.temp= 5200;
                }
            ktype(){
                this.color = [1.0,0.2,0.2,1.0];
                this.mass = .7;
                this.radius = 0.5;
                this.temp= 3700;
                }
            mtype(){
                    this.color = [1.0,0.0,0.0,1.0];
                    this.mass = .2;
                    this.radius = .2;
                    this.temp= 2000;
                    }
}

class GridSystem{
         constructor(bodies=[]){
                this.count = bodies.length;
                this.player=0;
                this.names = [""];
                this.mass= [0.0];
                this.rad = [0.0];
                this.pos = [[0.0,0.0,0.0]];
                this.ori = [[0.0,0.0,0.0]];
                this.vel = [[0.0,0.0,0.0]];
                this.acc = [[0.0,0.0,0.0]];
                this.allocated =1;
                this.collisions = [];
                this.removed=[];
                for (const i = 0; i<this.count; i++){
                      this.addSpace();
                      }
                const i = 0
                for (const body of bodies){
                        if (body.name == "player"){
                                this.player = i;
                              }
                        this.insertBody(body, i)
                        i+=1;
                      }
                for(const i =0; i< this.count; i++){
                        console.log(bodies[i]);
                      }
         }
         getPlayerIndex() {
                const i=0;
                const lasti = 0;
                for (const name of this.names){
                        if (name == "player"){
                                this.player = i;
                                lasti=i;
                                return i;
                              }
                        else{
                                i+=1;
                              }
                }
                return i;
              }



         insertBody(body, i){
                this.names[i] = body.name;
                this.mass[i] = body.mass;
                this.rad[i] = body.radius;
                this.pos[i][0] = body.position.x;
                this.pos[i][1] = body.position.y;
                this.pos[i][2] = body.position.z;

                this.ori[i][0] = body.orientation.x;
                this.ori[i][1] = body.orientation.y;
                this.ori[i][2] = body.orientation.z;

                this.vel[i][0] = body.velocity.x;
                this.vel[i][1] = body.velocity.y;
                this.vel[i][2] = body.velocity.z;

                this.acc[i][0] = body.acceleration.x;
                this.acc[i][1] = body.acceleration.y;
                this.acc[i][2] = body.acceleration.z;
              }

         moveBody(source,dest){
                this.names[dest]=this.names[source];
                this.mass[dest]=this.mass[source];
                this.rad[dest]=this.rad[source];
                this.pos[dest]=this.pos[source];
                this.ori[dest]=this.ori[source];
                this.vel[dest]=this.vel[source];
                this.acc[dest]=this.acc[source];
                this.names[source]="OLD";
}

         removeBody( i){
                if(i != this.player){
                        if (i == this.count -1){
                                const foo=1;
                              }
                        else{
                                this.moveBody(this.count-1, i);}
                        this.count -=1;
                        this.getPlayerIndex();

                    }
                  }

         resetAcc(){
              for (const i = 0; i<this.count; i++){
                    this.acc[i] = [0.0,0.0,0.0];
                  }
                  }

         addSpace(){
                this.allocated +=1;
                this.names.push("");
                this.mass.push(0.0);
                this.rad.push(0.0);
                this.pos.push([0.0,0.0,0.0]);
                this.ori.push([0.0,0.0,0.0]);
                this.vel.push([0.0,0.0,0.0]);
                this.acc.push([0.0,0.0,0.0]);
              }
}
const G=2.93558*Math.pow(10,-4);
const epsilon = 0.01;

class soPhysics{
        constructor(aSystem, maxMark=100000, dt=.02) {
                this.dt=dt;
                this.system = aSystem;
                this.gridSystem = new GridSystem(aSystem.bodies);
                this.maxMark=maxMark;
                this.fitness=this.system.evaluate(this.system.bodies);
                this.sumFit=this.fitness;
                this.t=0;
                this.count=1;
                this.collisions=[];
              }

        collisionDetected( player, names, mass,pos, vel, acc, rad, ith, jth) {
                if (names[jth]!='player' && names[ith]!='player') {
                        this.combineBodies(player, names, mass, pos, vel, acc, rad, ith, jth);
                }
        }
        combineBodies( player, names, mass,pos, vel, acc, rad, ith, jth) {
                pos[jth][0] = (pos[ith][0]*mass[ith] + pos[jth][0]*mass[jth])/((mass[ith]+mass[jth]));
                pos[jth][1] = (pos[ith][1]*mass[ith] + pos[jth][1]*mass[jth])/((mass[ith]+mass[jth]));
                pos[jth][2] = (pos[ith][2]*mass[ith] + pos[jth][2]*mass[jth])/((mass[ith]+mass[jth]));
                vel[jth][0] = (((mass[ith]*vel[ith][0])+(mass[jth]*vel[jth][0])/((mass[ith]+mass[jth]))));
                vel[jth][1] = (((mass[ith]*vel[ith][1])+(mass[jth]*vel[jth][1])/((mass[ith]+mass[jth]))));
                vel[jth][2] = (((mass[ith]*vel[ith][2])+(mass[jth]*vel[jth][2])/((mass[ith]+mass[jth]))));
                mass[jth] = mass[ith] + mass[jth];
                mass[ith] = 0.00000000000000000000000000000000000000000000000001;
                pos[ith][0]=10;
                pos[ith][1]=10;
                pos[ith][2]=10;
                vel[ith][0]=0;
                vel[ith][1]=0;
                vel[ith][2]=0;
                names[ith]= 'DELETED';
                this.gridSystem.collisions.push(jth);
                this.gridSystem.removed.push(ith);
                this.gridSystem.getPlayerIndex();

        }
        evaluateStep() {
                this.accelerate();
                for (const body of this.system.bodies) {
                        this.calculate_velocity(body,this.dt);
                        this.calculate_position(body,this.dt);
                        body.acceleration.reset();
                        this.sumFit+=this.system.evaluate(this.system.bodies);
                        this.t+=this.dt;
                      }
                this.count+=1;
        }
        evaluate() {
                this.t=0;
                this.count=1;
                this.accelerate();
                this.sumFit=0;
                while (this.count<this.maxMark) {
                        this.evaluateStep();
                }
                this.fitness = this.system.evaluate(this.bodies);
                this.avgStability = this.sumFit/this.count;
                return this.avgStability;
        }

        accGravSingle( player, names, mass, pos, vel, acc, rad, ith, jth) {
                const d_x = pos[jth][0] - pos[ith][0];
                const d_y = pos[jth][1] - pos[ith][1];
                const d_z = pos[jth][2] - pos[ith][2];
                const radius = Math.pow(d_x,2) + Math.pow(d_y,2) + Math.pow(d_z,2);
                const rad2 = Math.sqrt(radius);
                const grav_mag = 0.0;
                if (rad2 > rad[ith]+rad[jth]) {
                        grav_mag = G/(Math.pow((radius+epsilon),(3.0/2.0)));
                        grav_x=grav_mag*d_x;
                        grav_y=grav_mag*d_y;
                        grav_z=grav_mag*d_z;
                        acc[ith][0] +=grav_x*mass[jth];
                        acc[ith][1] +=grav_y*mass[jth];
                        acc[ith][2] +=grav_z*mass[jth];
                        acc[jth][0] +=grav_x*mass[ith];
                        acc[jth][1] +=grav_y*mass[ith];
                        acc[jth][2] +=grav_z*mass[ith];

                } else {
                        grav_mag = 0;
                        this.collisionDetected(player, names, mass, pos,vel, acc, rad, ith, jth);

                }
        }

        accelerateCuda() {
                const G=2.93558*Math.pow(10,-4);
                const epsilon = 0.01;
                for (const i=0; i< this.gridSystem.length; i++) {
                        if(this.gridSystem.names[i] != 'DELETED') {
                                for (const j=0; j<i;j++) {
                                        if(this.gridSystem.names[j] != 'DELETED') {
                                                this.accGravSingle(this.gridSystem.player,this.gridSystem.names,this.gridSystem.mass,this.gridSystem.pos,this.gridSystem.vel,this.gridSystem.acc,this.gridSystem.rad,i, j);
                                        }
                                }

                        }
                }
                this.calVelPosCuda();
                this.gridSystem.resetAcc();
                for (const i=0; i< this.gridSystem.length; i++) {
                        if (this.gridSystem.names[i]=='DELETED') {
                                this.gridSystem.removeBody(i);
                        }
                }

                this.gridSystem.collisions = [];
             }


        calVelPosCuda() {
                for (const i=0; i< this.gridSystem.length;i++) {
                        this.gridSystem.vel[i][0]+=this.dt*this.gridSystem.acc[i][0];
                        this.gridSystem.vel[i][1]+=this.dt*this.gridSystem.acc[i][1];
                        this.gridSystem.vel[i][2]+=this.dt*this.gridSystem.acc[i][2];
                        this.gridSystem.pos[i][0]+=this.dt*this.gridSystem.vel[i][0];
                        this.gridSystem.pos[i][1]+=this.dt*this.gridSystem.vel[i][1];
                        this.gridSystem.pos[i][2]+=this.dt*this.gridSystem.vel[i][2];
                }
        }
      }

      class System{
              constructor(seed=1, starcount=1, bodycount=1, abodyDistance=2, abodySpeed=0.05) {

                      this.seed = seed;
                      this.star = new Star();
                      this.starCount=starcount;
                      this.bodyCount= bodycount;
                      this.bodies=[];
                      this.bodyDistance = abodyDistance;
                      this.bodySpeed = abodySpeed;
                      if (seed !=0) {
                              this.build();
                      } else {
                              this.buildSol();
                      }
                      console.log ('bodyCount: '+this.bodies.length);
                      this.stability = 0.5 - this.evaluate(this.bodies);

                      this.avgStability=0.5 - this.evaluate(this.bodies);
              }
      moveToStar() {
              for (const body of this.bodies) {
                      body.position.x += this.star.body.position.x;
                      body.position.y += this.star.body.position.y;
                      body.position.z += this.star.body.position.z;
                    }
                  }
      getStar( body_data) {
              body_data.push(randomuniform(.4,1));
              for (const j=0 ;j<=2;j++) {
                      body_data.push(0.0);
              }
              body_data.push(0.0);
              for (const j=0 ;j<=2;j++)  {
                      body_data.push(0.0);
              }
              body_data.push(0.0);
              return body_data;
              }
  getSymPlanets() {
          const body_data=[];
          body_data.push('body_X');
          body_data.push(randomuniform(.000001,.4));
          if (quadrantconst > 0) {
                  body_data.push(randomuniform(0,this.bodyDistance));
                  body_data.push(randomuniform(0,this.bodyDistance));
                  body_data.push(0.0);
                  body_data.push(randomuniform(0,this.bodySpeed));
                  body_data.push(randomuniform(-this.bodySpeed,0));
                  body_data.push(0.0);
                }
          if (quadrantconst< 0) {
                  body_data.push(randomuniform(-this.bodyDistance,0));
                  body_data.push(randomuniform(-this.bodyDistance,0));
                  body_data.push(0.0);
                  body_data.push(randomuniform(-this.bodySpeed,0));
                  body_data.push(randomuniform(0,this.bodySpeed));
                  body_data.push(0.0);
                }
    }
    getDirectedPlanet() {
            const quadrantconst =1;
            const body_data=[];
            body_data.push('body_X');
            body_data.push(randomuniform(.000001,.01));
            if (quadrantconst > 0) {
                    body_data.push(randomuniform(0,this.bodyDistance));
                    body_data.push(randomuniform(0,this.bodyDistance));
                    body_data.push(randomuniform(0,this.bodyDistance/64));}
            if (quadrantconst< 0) {
                    body_data.push(randomuniform(-this.bodyDistance,0));
                    body_data.push(randomuniform(-this.bodyDistance,0));
                    body_data.push(randomuniform(-this.bodyDistance/64,0));}
            if (quadrantconst > 0) {
                    body_data.push(randomuniform(0,this.bodySpeed));
                    body_data.push(randomuniform(-this.bodySpeed,0));
                    body_data.push(randomuniform(0,this.bodySpeed/32));}
            if (quadrantconst < 0) {
                    body_data.push(randomuniform(-this.bodySpeed,0));
                    body_data.push(randomuniform(0,this.bodySpeed));
                    body_data.push(randomuniform(-this.bodySpeed/32),0);}
            return body_data;
            }

            getPlanet( body_data) {
                    body_data.push(randomuniform(.000001,.01));
                    for (const j of range(0,2)) {
                            body_data.push(randomuniform(-this.bodyDistance,this.bodyDistance));}
                    body_data.push(0.0);
                    for (const j of range(0,2)) {
                            body_data.push(randomuniform(-this.bodySpeed,this.bodySpeed));}
                    body_data.push(0.0);
                    return body_data;
                  }
            buildSol() {
                    this.bodies=[];
                    const body_data=['Sol',1,0,0,0,0,0,0,0,0,0];
                    this.bodies.push(Body(body_data));
                    body_data=['Earth',0.000003,0,1,0,.04,0,0,0,0,0];
                    this.bodies.push(Body(body_data));
                  }
            build() {
                    for (const i=0; i< this.bodyCount; i++) {
                            if (i < this.starCount) {
                                    this.addStar();
                            } else {
                                    this.addSinglePlanet();

                            }
                          }
                        }


        addStar() {
                const body_data = this.getStar(['star']);
                const body = new Body(body_data);
                this.bodies.push(body);
              }
        reverseBody( adata) {
                const bdata = adata;
                bdata[2]= 0 - adata[2];
                bdata[3]= 0 - adata[3];
                bdata[4]= 0 - adata[4];
                bdata[5]= 0 - adata[5];
                bdata[6]= 0 - adata[6];
                bdata[7]= 0 - adata[7];
                return bdata;
              }
        addSinglePlanet() {
                console.log('adding Body');
                const body_data = this.getDirectedPlanet();
                const aBody = new Body(body_data);
                const bBody = new Body(this.reverseBody(body_data));
                const otherBodies = [];
                otherBodies.push(this.bodies[0]);
                otherBodies.push(aBody);
                otherBodies.push(bBody);
                const fitness = this.evaluateN(otherBodies);
                while (fitness<.1 || fitness>1) {
                        console.log ('testing configuration');
                        const adata = this.getDirectedPlanet();
                        const aBody = new Body(adata);
                        const bdata = this.reverseBody(adata);
                        const bBody = new Body(bdata);
                        const otherBodies = [];
                        otherBodies.push(this.bodies[0]);
                        otherBodies.push(aBody);
                        otherBodies.push(bBody);
                        fitness=this.evaluateN(otherBodies);
                      }
                this.bodies.push(aBody);
                this.bodies.push(bBody);
                return aBody;

                }
                                            ;
      addPlanet() {
              console.log('adding body');
              const body_data = [];
              body_data.push('body_X');
              body_data = this.getPlanet(body_data);
              const aBody = new Body(body_data);
              this.bodies.push(aBody);
              console.log ('new stability');
              console.log (this.evaluate(this.bodies));
              while (this.evaluate(this.bodies)>1) {
                      this.bodies.pop();
                      this.addPlanet();
                    }
              return;

              }

              evaluate( someBodies){
                      console.log("bodies");
                      console.log(someBodies);
                      const kinetic=0.0;
                      const potential=0.0;
                      const G=2.93558*Math.pow(10,-4);
                      for (const body of someBodies) {
                              console.log(body);
                              const vel = body.velocity;
                              const vel_sq = (Math.pow(vel.x,2) + Math.pow(vel.y,2) + Math.pow(vel.z,2));
                              kinetic += 0.5*body.mass*vel_sq;
                            }
                      for (const i=0; i<someBodies.length; i++) {
                              const current_body=someBodies[i];
                              const current_position=current_body.position;
                              for (const j=0; j <i; j++) {
                                      const other_body=someBodies[j];
                                      const other_position=other_body.position;
                                      const d_x=(other_position.x-current_position.x);
                                      const d_y=(other_position.y-current_position.y);
                                      const d_z=(other_position.z-current_position.z);
                                      const radius = Math.pow((Math.pow(d_x,2) + Math.pow(d_y,2) + Math.pow(d_z,2)),(0.5));
                                      if (radius >0 ) {
                                              potential -= G*current_body.mass*other_body.mass/radius;}
                                            }
                      }
                      try {
                              return Math.abs(kinetic/potential);
                      } catch (err) {
                              return 100;

                      }
              }
            //   evaluateBodies( someBodies) {
            //           kinetic=0.0;
            //           potential=0.0;
            //           G=2.93558*10**-4;
            //           for (body of someBodies) {
            //                   vel = body.velocity;
            //                   vel_sq = (vel.x**2 + vel.y**2 + vel.z**2);
            //                   kinetic += 0.5*body.mass*vel_sq;
            //                 }
            //           for (i of range(0,len(someBodies))) {
            //                   current_body=someBodies[i];
            //                   current_position=current_body.position;
            //                   for (j of range(0,i)) {
            //                           other_body=someBodies[j];
            //                           other_position=other_body.position;
            //                           d_x=(other_position.x-current_position.x);
            //                           d_y=(other_position.y-current_position.y);
            //                           d_z=(other_position.z-current_position.z);
            //                           radius = (d_x**2 + d_y**2 + d_z**2)**(0.5);
            //                           if (radius >0 ) {
            //                                   potential -= G*current_body.mass*other_body.mass/radius;}
            //                                 }
            //           }
            //           try {
            //                   return abs(kinetic/potential);
            //           } catch () {
            //                   return 100.0;
            //                 }
            // }

              evaluateN( somebodies) {
                      const tempSys =new System();
                      tempSys.bodies = somebodies;
                      const tempEval = new soPhysics(tempSys,1000000,.01);
                      return tempEval.sumFit;
                    }

              bodies() {
                      return this.bodies;

              }
              convertToMeters(){
                for(const body of this.bodies){
                  body.position.x *= 149600000000;
                  body.position.y *= 149600000000;
                  body.position.z *= 149600000000;

                  body.velocity.x *= 149600000000;
                  body.velocity.y *= 149600000000;
                  body.velocity.z *= 149600000000;

                  body.radius = ((Math.sqrt(body.mass))/50)+.001;
                  body.radius *= 149600000000;
                }
              }
}