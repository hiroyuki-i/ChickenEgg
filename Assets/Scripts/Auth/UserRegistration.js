//#pragma strict

import System;
import SimpleJSON;

private var userId : String;
private var errorMessage : String = "";
var errorMessageStyle : GUIStyle;

#if UNITY_EDITOR
	private var URL : String = "http://chickenegg.unity.psalm.me";
#else
	private var URL : String = "http://chickenegg.unity.psalm.me";
#endif

function Start () {
	userId = PlayerPrefs.GetString("userId","");
	var userHash : String = PlayerPrefs.GetString("userHash","");
	if(userId.length > 0 && userHash.Length > 0){
		Debug.Log("userId:" + userId + " userHash:" + userHash);
		Application.LoadLevel("Main");
	}
}

function OnGUI(){
	var centerWidthPosition = Screen.width / 2 - 150;
	var centerHeightPosition = Screen.height / 2 - 30;
	GUI.Label(Rect(centerWidthPosition,centerHeightPosition - 30,300,30),errorMessage,errorMessageStyle);
	GUI.Label(Rect(centerWidthPosition,centerHeightPosition,300,30),"Enter your name.");
	userId = GUI.TextField(Rect(centerWidthPosition,centerHeightPosition + 30,300,30),userId,32);
	if(GUI.Button(Rect(centerWidthPosition,centerHeightPosition + 70 , 150 , 30),"Register")){
		registrationUserName();
	}
}

function registrationUserName(){

	if(userId.length == 0){
		errorMessage = "error:001 ユーザーネームが入力されていません。";
		return;
	}

	var userHash : String = uniqueID();
	var form : WWWForm = new WWWForm();
	form.AddField("userId",userId);
	form.AddField("userHash",userHash);
	var www : WWW = new WWW(URL + "/user/register/",form);
	yield www;

	Debug.Log(www.text);
	try{
		if(www.error == null && www.text != "error"){
			var returnValue = JSON.Parse(www.text);
			var rState : String = returnValue["state"];
			var rUserId : String = returnValue["userId"];
			var rUserHash : String = returnValue["userHash"];
		}else{
			throw www.error + "/" + www.text + "error:002 登録エラー！再度お試しください！";
		}
		
		if(isset(returnValue["userHash"]) == false || userHash != rUserHash){
			throw "error:003 登録エラー！再度お試しください！"; 
		}
		if(isset(returnValue["state"]) == false || rState== "duplication"){
			throw "このユーザーネームは既に使用されています。"; 
		}
		
		//register registered
		if(isset(returnValue["state"]) == true && rState == "registered" && userId == rUserId){
			Debug.Log("save userName!");
			PlayerPrefs.SetString("userId",rUserId);
			PlayerPrefs.SetString("userHash",rUserHash);
		}else{
			throw "error:005 登録エラー！再度お試しください！"; 
		}
		Application.LoadLevel("Main");
		
	}catch( message ){
		errorMessage = message.Message;
	}
}

function uniqueID(){
	 return parseInt(UnityEngine.Random.Range(1.0 ,1000.0)).ToString() + DateTime.Now.Ticks.ToString();
}

function isset( data ){
    return ( typeof( data ) != 'undefined' );
}