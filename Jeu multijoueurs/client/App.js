class App
{

  constructor()
  {
    
    this.TOUCHE_DROITE = 39;
    this.TOUCHE_GAUCHE = 37;
    this.TOUCHE_HAUT = 38;
    this.TOUCHE_BAS = 40;

    this.multiNode = new MultiNode();

    this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
    this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
    this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
    this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);

    this.listeJoueur = {};
    this.pseudonymeJoueur = "";
    this.pseudonymeAutreJoueur = "";

    this.formulaireAuthentification = document.getElementById("formulaire-authentification");
    this.formulaireAuthentification.addEventListener("submit", (evenementsubmit) => this.soumettreAuthentificationJoueur(evenementsubmit));

    this.champsPseudonyme = document.getElementById("champ-pseudonyme");

    this.boutonAuthentification = document.getElementById("bouton-authentification");

    this.ecranJeu = document.getElementById("ecran-jeu");
    this.ecranFin = document.getElementById("fin-jeu");
    
    this.ecranJeu.style.display = "none";
    this.ecranFin.style.display = "none";

    let dessin = document.getElementById("dessin");
  }

  confirmerConnexion()
  {
    console.log("Je suis connecté !");

    console.log("confirmerConnexion() => this.pseudonymeJoueur = this.champsPseudonyme.value;");
    this.pseudonymeJoueur = this.champsPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  }
  
  confirmerAuthentification(autresParticipants)
	{
    console.log("Je suis authentifié.");
    console.log("Les autres participants sont " + JSON.stringify(autresParticipants));
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;
    this.ajouterJoueur(this.pseudonymeJoueur);

    if(autresParticipants.length == 0)
    {
      console.log("pseudonymePremierJoueur == ", this.pseudonymeJoueur);
      this.pseudonymePremierJoueur = this.pseudonymeJoueur;
    } 

    if(autresParticipants.length > 0)
		{
      //this.pseudonymePremierJoueur = this.pseudonymeJoueur;
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(autresParticipants[0]);
      this.afficherPartie();
  	}
  }

  ajouterJoueur(pseudonyme)
	{
    console.log("ajouterJoueur : " + pseudonyme);
    this.listeJoueur[pseudonyme] = {score: 0, tirage: null};
  }

  soumettreAuthentificationJoueur(evenementsubmit)
	{
    console.log("soumettreAuthentificationJoueur");
    evenementsubmit.preventDefault();
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  apprendreAuthentification(pseudonyme)
	{
    console.log("Nouvel ami " + pseudonyme);
    this.ajouterJoueur(pseudonyme);

    console.log("apprendreAuthentificqtion(pseudonyme) => this.pseudonymeAutreJoueur = pseudonyme");
    this.pseudonymeAutreJoueur = pseudonyme;
    this.afficherPartie();
  }

  afficherPartie()
  {
    this.formulaireAuthentification.style.display = "none";
    
    console.log("PseudonymeJoueur: " + this.pseudonymeJoueur);
    console.log("PseudonymeAutreJoueur: " + this.pseudonymeAutreJoueur);
    this.ecranJeu.style.display = "block";
    this.scene = new createjs.Stage(dessin);

    console.log("pseudonymeJoueur: " + this.pseudonymeJoueur + " pseudonymePremierJoueur: " + this.pseudonymePremierJoueur);
    if(this.pseudonymePremierJoueur == this.pseudonymeJoueur)
    {	  
      console.log("afficherPartie() => if(this.pseudonymePremierJoueur == this.pseudonymeJoueur) => this.persoMarche = new AnimationPerso");
      this.persoMarche = new AnimationPerso(this.scene);

      console.log("afficherPartie() => if(this.pseudonymePremierJoueur == this.pseudonymeJoueur) => this.persoMarche2 = new AnimationPerso2");
      this.persoMarche2 = new AnimationPerso2(this.scene);
    }
    else
    {
      console.log("afficherPartie() => else du if(this.pseudonymePremierJoueur == this.pseudonymeJoueur) => this.persoMarche = new AnimationPerso2");
      this.persoMarche = new AnimationPerso2(this.scene);

      console.log("afficherPartie() => else du if(this.pseudonymePremierJoueur == this.pseudonymeJoueur) => this.persoMarche2 = new AnimationPerso");
	    this.persoMarche2 = new AnimationPerso(this.scene);
    }	  
    this.joueurActif = "";

	  this.piece = new Piece(this.scene);
	  this.piece2 = new Piece(this.scene);
    this.piece3 = new Piece(this.scene);
    this.piece4 = new Piece(this.scene);
    this.piece5 = new Piece(this.scene);
	  
    this.estCharge = false;
	  
	  this.champsPieceRestante = document.getElementById("piece");
    this.champsJoueur = document.getElementById("joueur");
    this.champsAutreJoueur = document.getElementById("autreJoueur");

	  this.pieceRestante = 5;

	  this.champsPieceRestante.innerHTML = this.pieceRestante;
    this.champsJoueur.innerHTML =" " + this.pseudonymeJoueur;
    this.champsAutreJoueur.innerHTML = this.pseudonymeAutreJoueur;

    createjs.Ticker.addEventListener("tick", evenementtick => this.boucler(evenementtick));
    createjs.Ticker.setFPS(7.5);
  }

  recevoirVariable(variable)
  {
    console.log(variable);

    let message = JSON.parse(variable.valeur);
    console.log(message);
    //console.log(message.piece);

    if(variable.cle == App.MESSAGE.FIN)
    {
      console.log("Fin de partie !");
      this.ecranJeu.style.display = "none";
      this.ecranFin.style.display = "block";
    }

    if(message.pseudonyme == this.pseudonymeJoueur)
    {
      switch(variable.cle)
      {
        case App.MESSAGE.PIECE:
          this.effacerPiece(message.piece);
          break;
        
        case App.MESSAGE.AVANCER:
          console.log("pseudonymeJoueur.avancer");
          this.deplacementJoueur(1);
          break;
        
        case App.MESSAGE.RECULER:
          console.log("pseudonymeJoueur.reculer");
          this.deplacementJoueur(2);
          break;
      
        case App.MESSAGE.MONTER:
          console.log("pseudonymeJoueur.monter");
          this.deplacementJoueur(3);
          break;
        
        case App.MESSAGE.DESCENDRE:
          console.log("pseudonymeJoueur.descendre");
          this.deplacementJoueur(4);
          break;
      }
    }

    else
    {
      switch(variable.cle)
      {
        case App.MESSAGE.PIECE:
          this.effacerPiece(message.piece);
          break;
        
        case App.MESSAGE.AVANCER:
          console.log("pseudonymeAutreJoueur.avancer");
          this.deplacementAutreJoueur(1);
          break;
        
        case App.MESSAGE.RECULER:
          console.log("pseudonymeAutreJoueur.reculer");
          this.deplacementAutreJoueur(2);
          break;
      
        case App.MESSAGE.MONTER:
          console.log("pseudonymeAutreJoueur.monter");
          this.deplacementAutreJoueur(3);
          break;
        
        case App.MESSAGE.DESCENDRE:
          console.log("pseudonymeAutreJoueur.descendre");
          this.deplacementAutreJoueur(4);
          break;
      }
    }
  }
  
  boucler(evenementtick)
  {
    if(!this.estCharge && this.persoMarche.estCharge && this.persoMarche2.estCharge && this.piece.estCharge && this.piece2.estCharge && this.piece3.estCharge && this.piece4.estCharge && this.piece5.estCharge)
	  {
      this.estCharge = true;
      this.persoMarche.afficher();
      console.log("this.persoMarche.afficher()");

      this.persoMarche2.afficher();
      console.log("this.persoMarche2.afficher()");

      this.piece.afficher(300,0);
      this.piece2.afficher(200, 150);
      this.piece3.afficher(400, 265);
      this.piece4.afficher(1300, 328);
      this.piece5.afficher(650, 529);

      window.addEventListener("keydown", evenementkeydown => this.gererTouche(evenementkeydown));
    }
    this.scene.update(evenementtick);
  }

  gererTouche(evenementkeydown)
  {
    let message = {pseudonyme: this.pseudonymeJoueur}
    console.log("gererTouche : "+evenementkeydown.keyCode);
    switch(evenementkeydown.keyCode)
    {
      case this.TOUCHE_DROITE:
        this.multiNode.posterVariableTextuelle(App.MESSAGE.AVANCER, JSON.stringify(message));
        break;
      case this.TOUCHE_GAUCHE:
        this.multiNode.posterVariableTextuelle(App.MESSAGE.RECULER, JSON.stringify(message));
        break;
      case this.TOUCHE_HAUT:
        this.multiNode.posterVariableTextuelle(App.MESSAGE.MONTER, JSON.stringify(message));
        break;
      case this.TOUCHE_BAS:
        this.multiNode.posterVariableTextuelle(App.MESSAGE.DESCENDRE, JSON.stringify(message));      
        break;
    }   
  }
	
  deplacementJoueur(action)
  {
    switch(action)
    {
      case 1:
        this.persoMarche.avancer();
        break;

      case 2:
        this.persoMarche.reculer();
        break;
      
      case 3: 
        this.persoMarche.monter();
        break;
      
      case 4:
        this.persoMarche.descendre();
        break;
    }

    this.verifierCollisionJoueur();
  }
	
  verifierCollisionJoueur()
  {
    if(this.piece.getVisibility() && this.testerCollisionRectangle(this.persoMarche.determinerRectangleOccupe(), this.piece.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(1);
    }
    
    if(this.piece2.getVisibility() && this.testerCollisionRectangle(this.persoMarche.determinerRectangleOccupe(), this.piece2.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(2);
    }

    if(this.piece3.getVisibility() && this.testerCollisionRectangle(this.persoMarche.determinerRectangleOccupe(), this.piece3.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(3);
    }

    if(this.piece4.getVisibility() && this.testerCollisionRectangle(this.persoMarche.determinerRectangleOccupe(), this.piece4.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(4);
    }

    if(this.piece5.getVisibility() && this.testerCollisionRectangle(this.persoMarche.determinerRectangleOccupe(), this.piece5.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(5);
    }
  }

  // PARTIE AUTRE JOUEUR
  deplacementAutreJoueur(action)
  {
    switch(action)
    {
      case 1:
        this.persoMarche2.avancer();
        break;

      case 2:
        this.persoMarche2.reculer();
        break;
      
      case 3: 
        this.persoMarche2.monter();
        break;
      
      case 4:
        this.persoMarche2.descendre();
        break;
    }

    this.verifierCollisionAutreJoueur();
  }
	
  verifierCollisionAutreJoueur()
  {
    if(this.piece.getVisibility() && this.testerCollisionRectangle(this.persoMarche2.determinerRectangleOccupe(), this.piece.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(1);
    }
    
    if(this.piece2.getVisibility() && this.testerCollisionRectangle(this.persoMarche2.determinerRectangleOccupe(), this.piece2.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(2);
    }

    if(this.piece3.getVisibility() && this.testerCollisionRectangle(this.persoMarche2.determinerRectangleOccupe(), this.piece3.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(3);
    }

    if(this.piece4.getVisibility() && this.testerCollisionRectangle(this.persoMarche2.determinerRectangleOccupe(), this.piece4.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(4);
    }

    if(this.piece5.getVisibility() && this.testerCollisionRectangle(this.persoMarche2.determinerRectangleOccupe(), this.piece5.determinerRectangleOccupe()))
    {
      this.enleverNombrePiece(5);
    }
  }

  testerCollisionRectangle(rectangleA, rectangleB)
  {
    if(rectangleA.x >= rectangleB.x + rectangleB.largeur ||rectangleA.x + rectangleA.largeur <= rectangleB.x ||
       rectangleA.y >= rectangleB.y + rectangleB.hauteur ||rectangleA.y + rectangleA.hauteur <= rectangleB.y){
      return false;
    }
    return true;
  }
  
  enleverNombrePiece(pieceEnlever)
  {
    
    //this.verifierFinPartie();
    let message=
    {
      pseudonyme: this.pseudonymeJoueur,
      piece: pieceEnlever
    }
    this.multiNode.posterVariableTextuelle(App.MESSAGE.PIECE, JSON.stringify(message));
  }

  effacerPiece(numero)
  {

    if(numero == 1)
    {
      this.piece.detruire();	
    }

    if(numero == 2)
    {
      this.piece2.detruire();	
    }

    if(numero == 3)
    {
      this.piece3.detruire();	
    }

    if(numero == 4)
    {
      this.piece4.detruire()
    }

    if(numero == 5)
    {
      this.piece5.detruire();	
    }

    this.pieceRestante = this.pieceRestante-0.5;
    this.champsPieceRestante.innerHTML = this.pieceRestante;
  }
}

App.MESSAGE = {
  PIECE : "PIECE",

  AVANCER: "AVANCER",
  RECULER: "RECULER",
  MONTER: "MONTER",
  DESCENDRE: "DESCENDRE",

  FIN: "FIN_PARTIE"
};

new App();