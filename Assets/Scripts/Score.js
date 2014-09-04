#pragma strict

var countHiyoko : GUIText;
private var currentScore : int = 0;

function Start () {
	currentScore = 0;
}

function Update () {
	countHiyoko.text = currentScore.ToString() + "Hiyoko !";
}

function addScore(){
	currentScore++;	
}