#pragma strict

var Egg : GameObject;
private var EggShotPosition : GameObject;
private var touchState : int = 0;
private var countTouch : int = 0;
private var countTouchTotal : int = 0;

function Start () {
	var windowSize : Vector2 = Camera.main.ViewportToWorldPoint(new Vector2(1,1));
	gameObject.transform.position = new Vector2(windowSize.x * 0.75 , windowSize.y * 0.7);
	setCountTouch();
	EggShotPosition = GameObject.Find("Niwatori").transform.GetChild(0).gameObject; 
}

function touched(){
	countTouch--;
	countTouchTotal++;
	if(countTouch == 0 && touchState == 0){
		// born egg.
		Instantiate(Egg,EggShotPosition.transform.position,EggShotPosition.transform.rotation);
		
		//reset statement.
		touchState = 0;
		countTouchTotal = 0;
		setCountTouch();
	}else if(countTouch == 0 && touchState < 3){
		//touchState.
		
		//reset statement.
		touchState++;
		setCountTouch();
	}
}

function setCountTouch(){
	countTouch = parseInt(Random.Range(1.0 ,4.0));
}

