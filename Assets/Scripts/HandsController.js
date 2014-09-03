#pragma strict

function Update () {
	if(Input.touchCount > 0){
		var touchPoint : Vector2 = Camera.main.ScreenToWorldPoint(Input.GetTouch(0).position);
	}else if(Input.GetMouseButtonUp(0)){
			touchPoint = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	}
	if((Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Ended) || Input.GetMouseButtonUp(0) ){
		Debug.Log(touchPoint);
		var touchObject : Collider2D[]  = Physics2D.OverlapPointAll(touchPoint);
		for(var i = 0; i< touchObject.length; i++ ){
			if(touchObject[i].gameObject.name == "Niwatori"){
				Debug.Log(touchObject[i].gameObject.name);
				touchObject[i].gameObject.GetComponent(Niwatori).touched();
				break;
			}
		}
	}
}