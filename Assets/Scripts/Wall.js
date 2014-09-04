#pragma strict

var WallRight : GameObject;
var WallLeft : GameObject;
var Floor : GameObject;

function Start(){
	var windowSize : Vector2 = Camera.main.ViewportToWorldPoint(new Vector2(1,1));
	var windowSizeMinus : Vector2 = windowSize * -1;
	WallLeft.transform.position = new Vector2(windowSize.x , windowSizeMinus.y);
	WallRight.transform.position = windowSizeMinus;
	Floor.transform.position = windowSizeMinus;
}
