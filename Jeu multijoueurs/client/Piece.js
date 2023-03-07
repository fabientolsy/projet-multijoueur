class Piece
{
	constructor(scene)
	{
		this.scene = scene;
		this.estCharge = false;
		this.image = new Image();
		this.image.addEventListener("load", evenementload => this.creerBitmap(evenementload));
		this.image.src = "illustration/piece.png";
	}
	
	getVisibility()
	{
		if(!this.bitmap) return false;
		return this.bitmap.visible;
	}
	
	determinerRectangleOccupe(){
    	return {
      		x: this.bitmap.x,
      		y: this.bitmap.y,
      		largeur: this.bitmap.getBounds().width,
      		hauteur: this.bitmap.getBounds().height
    	};
  	}
	
	creerBitmap(evenementload)
	{
		console.log("Image de piece en chargement !");
		this.bitmap = new createjs.Bitmap(this.image);
		//this.bitmap.setBounds(this.bitmap.x, 450);
		this.bitmap.scaleX = this.bitmap.scaleY = 0.15;
		this.bitmap.setBounds(
      	this.bitmap.x,
      	this.bitmap.y,
      	900 * 0.15,
      	500 * 0.15);
		this.estCharge = true;
		console.log("Image de piece chargée");
	}
	
	afficher(positionX, positionY)
	{
		console.log("this.piece.afficher()");
		
		/*this.bitmap.x = 300;
    	this.bitmap.y = 0;*/
		
		this.bitmap.x = positionX;
		this.bitmap.y = positionY;
		
    	console.log("bitmap ajoutée à la scène");
    	this.scene.addChild(this.bitmap);
	}
	
	detruire()
	{
		console.log("DESTRUCTION !");
		this.bitmap.visible = false;
		//this.scene.removeChild(this.bitmap);		
	}
}