#pragma strict

var messageStyle : GUIStyle;
var displayTime : float;
var eraseTime : float;
private var isMessage : boolean = false;
private var displayDeltaTime : float = 0.0;
private var rect : Rect;
private var text : String = "";

function Start () {
	rect = new Rect(Screen.width / 2 - 100 , Screen.height * 0.05 ,200,30);
	isMessage = false;
	text = "";
}

function OnGUI(){
	if(isMessage == true){
		displayDeltaTime = displayDeltaTime + Time.deltaTime;
		var t : float = 0.8;
		if(displayDeltaTime < displayTime){
			var alfa : int = 225;
		}else if(displayDeltaTime > displayTime && displayDeltaTime < eraseTime + displayTime){
			alfa = 225 - Mathf.FloorToInt(((displayDeltaTime - displayTime) / eraseTime) * 225.0);
		}else{
			alfa = 0;
			clear();
		}
		messageStyle.normal.textColor = Color(225,225,225,alfa);
		GUI.Label(rect,text,messageStyle);
	}
}

function displayMessage(message : String){
	text = message;
	isMessage = true;
	displayDeltaTime = 0.0;
}

function clear(){
	isMessage = false;
	text = "";
	displayDeltaTime = 0.0;
}