class AnimationPerso2{
  constructor(scene){

    this.scene = scene;
    this.estCharge = false;
    this.imagePerso2 = new Image();
    this.imagePerso2.addEventListener("load", evenementload => this.creerSprite(evenementload));
    this.imagePerso2.src = "illustration/persoTest.png";
  }
	
  determinerRectangleOccupe(){
    	return {
      		x: this.spritePersoMarche.x,
      		y: this.spritePersoMarche.y,
      		largeur: this.spritePersoMarche.getBounds().width,
      		hauteur: this.spritePersoMarche.getBounds().height
    	};
  	}

  creerSprite(evenementload){
    console.log("Image persoSpriteSheet.png chargée");

    let spriteSheetPersoMarche = new createjs.SpriteSheet({
      images: [this.imagePerso2],

      frames:{
        width: 64,
        height: 64
      },

      animations:{
        marcher: [18,19,20,21,22,23,24,25,26],
        arriere: [0,1,2,3,4,5,6,7,8]
      }
    });
    console.log("spriteSheetPeroMarche créée");

    this.spritePersoMarche = new createjs.Sprite(spriteSheetPersoMarche,"marcher");

    //this.spritePersoMarche.scaleX = this.spritePersoMarche.scaleY = 0.5;

    this.spritePersoMarche.setBounds(0,0, 40,40);

    this.estCharge = true;
    console.log("spritePersoMarche créée");

  }

  afficher(){
    this.spritePersoMarche.x = 0;
    this.spritePersoMarche.y = 556;
    this.scene.addChild(this.spritePersoMarche);
    console.log("spritePersoMarche ajoutée à la scène");
  }

  avancer(){
    console.log("this.persoMarche2.avancer()");

    this.spritePersoMarche.x = this.limiterMouvement(this.spritePersoMarche.x + 10, this.spritePersoMarche.y).x;
    
    if(this.spritePersoMarche.scaleX < 0){
      this.spritePersoMarche.scaleX *= -1;
    }
    
  }
  reculer(){
    this.spritePersoMarche.x = this.limiterMouvement(this.spritePersoMarche.x - 10, this.spritePersoMarche.y).x;
    if(this.spritePersoMarche.scaleX > 0){
      this.spritePersoMarche.scaleX *= -1;
    }
  }

  monter(){
    this.spritePersoMarche.y = this.limiterMouvement(this.spritePersoMarche.x, this.spritePersoMarche.y - 10).y;
  }

  descendre(){
    this.spritePersoMarche.y = this.limiterMouvement(this.spritePersoMarche.x, this.spritePersoMarche.y + 10).y;
  }

  limiterMouvement(testX, testY){
    let nouveauX = testX;
    let nouveauY = testY;

    if(testX + this.spritePersoMarche.getBounds().width > this.scene.largeur){
      nouveauX  = this.scene.largeur - this.spritePersoMarche.getBounds().width;
    }else if(testX < 0){
      nouveauX = 0;
    }

    if(testY + this.spritePersoMarche.getBounds().height > this.scene.hauteur){
      nouveauY  = this.scene.hauteur - this.spritePersoMarche.getBounds().height;
    }else if(testY < 0){
      nouveauY = 0;
    }

    console.log("limiterMouvement {x: nouveauX, y: nouveauY}",{x: nouveauX, y: nouveauY});
    return {x: nouveauX, y: nouveauY};

  }

  determinerRectangleOccupe(){
    return {
      x: this.spritePersoMarche.x,
      y: this.spritePersoMarche.y,
      largeur: this.spritePersoMarche.getBounds().width,
      hauteur: this.spritePersoMarche.getBounds().height
    };
  }
}