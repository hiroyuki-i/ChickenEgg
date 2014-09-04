#pragma strict

var speed : int = 8;
var eggTime : float = 10;
private var elapsedTime : float;
private var isActiveEgg : boolean = false;
private var anime : Animator;
private var score : Score;

function Start () {
	rigidbody2D.velocity = transform.up.normalized * speed;
	anime = GetComponent(Animator);
	score = FindObjectOfType(Score);
}

function Update () {
	elapsedTime += Time.deltaTime;
	if(elapsedTime > eggTime && isActiveEgg == false){
		anime.SetBool("isBirth",true);
		isActiveEgg = true;
	}
}

function fadeOut(){
	anime.SetBool("isFly",true);
	addScore();
}

function addScore(){
	score.addScore();
}