#pragma strict

var Egg : GameObject;
private var EggShotPosition : GameObject;
private var touchState : int = 0;
private var countTouch : int = 0;
private var countTouchTotal : int = 0;
private var touchWait : float = 0;

var speed : float;
var touchWaitingTime : float;
private var rightEndPosition : Vector2;
private var leftEndPosition : Vector2;
private var isRight : boolean = true;
private var adjustNiwatoriPosition : float = 0.7;

function Start () {
	var windowSize : Vector2 = Camera.main.ViewportToWorldPoint(new Vector2(1,1));
	gameObject.transform.position = new Vector2(windowSize.x * 0 , windowSize.y * 0.5);
	setCountTouch();
	EggShotPosition = GameObject.Find("Niwatori").transform.GetChild(0).gameObject;
	//end position
	rightEndPosition = Camera.main.ViewportToWorldPoint(new Vector2(1,1));
	rightEndPosition.x = rightEndPosition.x - adjustNiwatoriPosition;
	leftEndPosition = Camera.main.ViewportToWorldPoint(new Vector2(0,0));
	leftEndPosition.x = leftEndPosition.x + adjustNiwatoriPosition;
}

function FixedUpdate(){
	touchWait = touchWait - Time.deltaTime;
	if(touchWait < 0){
		//end position?
		var pos = transform.position;
		if(pos.x < leftEndPosition.x || pos.x > rightEndPosition.x){
			if(isRight){
				isRight = false;
				transform.position.x = rightEndPosition.x;
				transform.localScale.x = -1;
			}else{
				isRight = true;
				transform.position.x = leftEndPosition.x;
				transform.localScale.x = 1;
			}
		}
		//random turn?
		if(1 == parseInt(Random.Range(1.0 ,1000.0))){
			if(isRight){
				isRight = false;
				transform.localScale.x = -1;
			}else{
				isRight = true;
				transform.localScale.x = 1;
			}
		}
		
		if(1 == parseInt(Random.Range(1.0 ,60.0))){
			//move to right or left
			var x = (isRight) ? 1 : -1;
			transform.Translate(new Vector3(x, 0 ,0) * 0.3);
		}
	}
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
	
	touchWait = touchWaitingTime;
}

function setCountTouch(){
	countTouch = parseInt(Random.Range(1.0 ,4.0));
}

