class De
{
	constructor()
	{
	  this.multiNode = new MultiNode();
    this.multiNode.confirmerConnexion = () => this.confirmerConnexion();
    this.multiNode.confirmerAuthentification = (autresParticipants) => this.confirmerAuthentification(autresParticipants);
    this.multiNode.apprendreAuthentification = (pseudonyme) => this.apprendreAuthentification(pseudonyme);
    this.multiNode.recevoirVariable = (variable) => this.recevoirVariable(variable);
    this.listeJoueur = {};
    this.pseudonymeJoueur = "";
    this.pseudonymeAutreJoueur = "";
    this.joueur_actif = "";
    this.formulaireAuthentification = document.getElementById("formulaire-authentification");
    this.formulaireAuthentification.addEventListener("submit", (evenementsubmit) => this.soumettreAuthentificationJoueur(evenementsubmit))
    this.champPseudonyme = document.getElementById("champ-pseudonyme");
    this.boutonAuthentification = document.getElementById("bouton-authentification");
    this.boutonTirage = document.getElementById("bouton-tirage");
    this.boutonLancer = document.getElementById("bouton-lancer");
    this.formulaireJeu = document.getElementById("formulaire-jeu");
    this.formulaireTirage = document.getElementById("formulaire-determiner-premier-joueur");
    this.formulaireTirage.addEventListener("submit", (evenementsubmit) => this.lancerDeTirage(evenementsubmit));
    this.formulaireJeu.addEventListener("submit", (evenementsubmit) => this.soumettreAttaque(evenementsubmit))
    this.formulaireJeu.style.display = "none";
    this.formulaireTirage.style.display = "none";
    this.valeurTirage = document.getElementById("valeur-tirage")
    this.champScore = document.getElementById("champ-score");
    this.champValeurDe = document.getElementById("champ-valeur-des");
    this.informationAutreJoueur = document.getElementById("information-autre-joueur");
    this.champScoreAutreJoueur = document.getElementById("champ-score-autre-joueur");
    this.formulaireJeu.style.display = "none";
	  this.compteurTour = 0;
	  this.champCompteurTour = document.getElementById("champ-compteur-tour");
	}

	confirmerConnexion()
	{
    console.log("Je suis connecté.");
    //Le serveur nous confirme que nous sommes bien connecté, nous pouvons faire une demande d'authentification
    this.pseudonymeJoueur = this.champPseudonyme.value;
    this.multiNode.demanderAuthentification(this.pseudonymeJoueur);
  	}

  confirmerAuthentification(autresParticipants)
	{
    console.log("Je suis authentifié.");
    console.log("Les autres participants sont " + JSON.stringify(autresParticipants));
    this.formulaireAuthentification.querySelector("fieldset").disabled = true;
    this.ajouterJoueur(this.pseudonymeJoueur);
    if(autresParticipants.length > 0)
		{
      this.pseudonymeAutreJoueur = autresParticipants[0];
      this.ajouterJoueur(autresParticipants[0]);
      this.afficherTirageAuSort();
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
    //La demande de connexion au serveur est asynchrone, il faut attendre la réponse du serveur
    //pour faire une demande d'authentification
    this.multiNode.connecter();
    this.boutonAuthentification.disabled = true;
  }

  apprendreAuthentification(pseudonyme)
	{
    console.log("Nouvel ami " + pseudonyme);
    this.ajouterJoueur(pseudonyme);
    this.pseudonymeAutreJoueur = pseudonyme;
    this.afficherTirageAuSort();
  }

  afficherTirageAuSort()
  {
    this.formulaireTirage.style.display = "block";
  }

  tirerDe()
	{
    return Math.floor(Math.random() * 6) + 1;	
  }

  lancerDeTirage(evenementsubmit)
  {
    this.boutonTirage.disabled = true;
    console.log("Tirage au sort")
    evenementsubmit.preventDefault();
    
    let message = 
	  {
      pseudonyme : this.pseudonymeJoueur,
      valeur : this.tirerDe()
    };
    this.multiNode.posterVariableTextuelle(De.MESSAGE.TIRAGE, JSON.stringify(message));
    this.valeurTirage.value = message.valeur;
  }
	
	
  recevoirVariable(variable)
	{
    console.log("Surcharge de recevoirVariable " + variable.cle + " = " + variable.valeur);
    let message = JSON.parse(variable.valeur);
    if(message.pseudonyme == this.pseudonymeJoueur)
    {
      switch (variable.cle) 
      {

        case De.MESSAGE.TIRAGE:
          this.determinerDebutPartie(message);
          break;

        case De.MESSAGE.LANCE_DE:
          this.monterPointsJoueur(message);
		      if(!this.validerFinPartie(message)) this.debuterTour(this.determinerTour(message));
          break;
      }
    }
    else
    {
      switch (variable.cle) 
      {
        case De.MESSAGE.TIRAGE:
          this.determinerDebutPartie(message);
          break;

        case De.MESSAGE.LANCE_DE:
          this.monterPointsAutreJoueur(message);
		      if(!this.validerFinPartie(message)) this.debuterTour(this.determinerTour(message));
          break;
      }
    }
  }

  determinerDebutPartie(message)
  {
    this.listeJoueur[message.pseudonyme].tirage = message.valeur;
    if(this.listeJoueur[this.pseudonymeJoueur].tirage && this.listeJoueur[this.pseudonymeAutreJoueur].tirage)
    {
	    this.afficherPartie();
      if(this.listeJoueur[this.pseudonymeJoueur].tirage > this.listeJoueur[this.pseudonymeAutreJoueur].tirage)
      {
        this.debuterTour(this.pseudonymeJoueur);
      }
      else
      {
        this.debuterTour(this.pseudonymeAutreJoueur);
      }
    }
  }
	
	determinerTour(message)
	{
		if(message.valeur1 == message.valeur2) return message.pseudonyme
		if(message.pseudonyme == this.pseudonymeJoueur) return this.pseudonymeAutreJoueur;
		return this.pseudonymeJoueur;
	}

  debuterTour(pseudonyme)
  {
    console.log("Debuter tour: ", pseudonyme);
	  this.compteurTour++;
	  this.champCompteurTour.value = this.compteurTour;
	  
	  if(pseudonyme == this.pseudonymeJoueur)
		{
			this.boutonLancer.disabled = false;
			this.champValeurDe.value = "";
		}
	  else
		{
			this.boutonLancer.disabled = true;
		}
  }

  afficherPartie()
	{
    this.formulaireTirage.style.display = "none";
    this.informationAutreJoueur.innerHTML =
    this.informationAutreJoueur.innerHTML.replace("{nom-autre-joueur}", this.pseudonymeAutreJoueur);
    this.champScoreAutreJoueur.value = this.listeJoueur[this.pseudonymeAutreJoueur].score;
    this.champScore.value = this.listeJoueur[this.pseudonymeJoueur].score;
    this.formulaireJeu.style.display = "block";
  }

  soumettreAttaque(evenementsubmit)
  {
	  console.log("soumettreAttaque");
    evenementsubmit.preventDefault();
    
	  let de1 = this.tirerDe();
    let de2 = this.tirerDe();

	  this.champValeurDe.value = de1 + " + " + de2;
    let message = 
	  {
      pseudonyme : this.pseudonymeJoueur,
      valeur1 : de1,
	    valeur2: de2
    };
    this.multiNode.posterVariableTextuelle(De.MESSAGE.LANCE_DE, JSON.stringify(message));
  }
	
  monterPointsJoueur(message)
  {
    console.log("pseudonymeJoueur: " + this.pseudonymeJoueur + " gagne des points(" + this.listeJoueur[this.pseudonymeJoueur].score + ")"); 
    console.log("Score1: ", this.listeJoueur[this.pseudonymeJoueur]);
    this.listeJoueur[this.pseudonymeJoueur].score += (message.valeur1 + message.valeur2);
    console.log("Score2: ", this.listeJoueur[this.pseudonymeJoueur]);
    this.champScore.value = this.listeJoueur[this.pseudonymeJoueur].score; 
  }

  monterPointsAutreJoueur(message)
  {
    console.log("pseudonymeAutreJoueur: " + this.pseudonymeAutreJoueur + " gagne des points (" + this.listeJoueur[this.pseudonymeAutreJoueur].score + ")");
    this.listeJoueur[this.pseudonymeAutreJoueur].score += (message.valeur1 + message.valeur2);
    this.champScoreAutreJoueur.value = this.listeJoueur[this.pseudonymeAutreJoueur].score;
  }
	
	validerFinPartie(message)
	{
		if(this.listeJoueur[this.pseudonymeJoueur].score >= De.SCORE_MAXIMUM)
		{
			alert("Vous avez gange ! BRAVO")
			return true;
		}
		if(this.listeJoueur[this.pseudonymeAutreJoueur].score >= De.SCORE_MAXIMUM)
		{
			alert("Vous avez perdu ! DOMMAGE")
			return true;
		}
		return false;
	}
}

De.NOMBRE_JOUEUR_REQUIS = 2;
De.NOMBRE_POINT_DE_VIE = 0;
De.FORCE_MAXIMUM = 5;
De.SCORE_MAXIMUM = 60;
De.MESSAGE = {
    LANCE_DE : "LANCE_DE",
    TIRAGE: "TIRAGE",	
};

new De();