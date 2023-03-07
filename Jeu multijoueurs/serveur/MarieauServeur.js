const MultiNodeServeur = require('./MultiNodeServeur.js');

class Variable
{
  static type = "texte";
  static cle = null;
  static valeur = null;

  static formaterPourMessage()
  {
    return {
      type : this.type,
      cle : this.cle,
      valeur : this.valeur
    }
  }
}

class VariablePiece  extends Variable 
{
  static cle = "PIECE";

  static setValeur(pieceRestante, pieceEnlever){
    let valeurObjet = { pieceRestante: pieceRestante, valeur : pieceEnlever };
    this.valeur = JSON.stringify(valeurObjet);
  }
}

//VariableFinPartie est une variable de type "texte" avec une clé "FIN_PARTIE"
//Les valeurs de la variable sont pseudonyme (joueur perdant) et valeur (true indique qu'il a perdu)
class VariableFinPartie extends Variable { static cle = "FIN_PARTIE"; }

class MarieauJoueur extends MultiNodeServeur.Joueur
{
  constructor(pseudonyme, pointDeVie){
    super(pseudonyme);
    this.pointDeVie = pointDeVie;
  }
}

class MarieauServeur
{
  constructor()
  {
    this.multiNodeServeur = new MultiNodeServeur.Serveur();
    //Surcharge des méthode de MultiNodeServeur.js pour les besoins du jeu Attaque
    this.multiNodeServeur.actionReceptionMessageTransfertVariable = (messageTransfertVariable) => this.actionReceptionMessageTransfertVariable(messageTransfertVariable);
    this.multiNodeServeur.actionFinReceptionMessage = () => this.actionFinReceptionMessage();
    this.multiNodeServeur.actionCreerJoueur = (pseudonyme) => this.actionCreerJoueur(pseudonyme);

    this.pieceRestante = 5;
  }


  actionReceptionMessageTransfertVariable(messageTransfertVariable)
  {
    let variableCle = messageTransfertVariable.variable.cle;
    switch (variableCle) 
    {
      case VariablePiece.cle :
        this.pieceRestante = this.pieceRestante - 0.5;
        break;
    }

    this.multiNodeServeur.repondreTransfertVariable(messageTransfertVariable);
  }


  actionFinReceptionMessage()
  {
    console.log("MarieauServeur.actionFinReceptionMessage");
    let finPartie = this.verifierFinPartie();

    //S'il existe
    if(finPartie)
    {
      //Créer un nouveau message VariableFinPartie
      let messageTransfertVariable = this.multiNodeServeur.messageTransfertVariable;
      messageTransfertVariable.variable = VariableFinPartie.formaterPourMessage();

      //Transférer le message à tous les clients
      this.multiNodeServeur.repondreTransfertVariable(messageTransfertVariable);
    }
  }


  actionCreerJoueur(pseudonyme){
    //Création d'un joueur spécifique pour le jeu Marieau ou autre
    return new MarieauJoueur(pseudonyme, 20);
  }

  verifierFinPartie()
  {
    var fin = new Boolean(false);
    if(this.pieceRestante === 0)
    {
      console.log("Vous avez finis le jeux petits malins");  

      fin = Boolean(true);
      console.log("Fin de partie: " + fin);
    }
    else
    {
      console.log("Pieces restantes:" + this.pieceRestante);  

      fin = false;
      console.log("Fin de partie: " + fin);

    }

    return fin;
  }

}

new MarieauServeur();