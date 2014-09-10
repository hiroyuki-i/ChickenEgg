#pragma strict

import System;

private var userId : String;
private var URL : String = "127.0.0.1";

function Start () {
	userId = PlayerPrefs.GetString("userId","");
	var userHash : String = PlayerPrefs.GetString("userHash","");
	if(userId.length > 0 && userHash.Length > 0){
		Application.LoadLevel("Main");
	}
}

function OnGUI(){
	var centerWidthPosition = Screen.width / 2 - 150;
	var centerHeightPosition = Screen.height / 2 - 30;
	GUI.Label(Rect(centerWidthPosition,centerHeightPosition,300,30),"Enter your name.");
	userId = GUI.TextField(Rect(centerWidthPosition,centerHeightPosition + 30,300,30),userId,32);
	if(GUI.Button(Rect(centerWidthPosition,centerHeightPosition + 70 , 150 , 30),"Register")){
		registrationUserName();
	}
}

function registrationUserName(){

	if(userId.length == 0){
		EditorUtility.DisplayDialog("Error!","error:001 ユーザーネームが入力されていません。","OK");
		return;
	}

	var userHash : String = uniqueID();
	var form : WWWForm = new WWWForm();
	form.AddField("userId",userId);
	form.AddField("userHash",userHash);
	var www : WWW = new WWW(URL + "/user/register/",form);
	yield www;
	
	Debug.Log("returnVal:" + www.error);
	
	try{
		if(www.error == null && www.text != "error"){
			var returnValue = JSON.Parse(www.text);
		}else{
			throw "error:002 登録エラー！再度お試しください！";
		}
		
		if(!isset(returnValue["userHash"]) || userHash != returnValue["userHash"]){
			throw "error:003 登録エラー！再度お試しください！"; 
		}
		if(!isset(returnValue["state"]) || returnValue["state"] == "duplication"){
			throw "このユーザーネームは既に使用されています。"; 
		}
		
		//register 
		if(isset(returnValue["state"]) && returnValue["state"] == "registered"
		&& userId == returnValue["userId"]){
			Debug.Log("save userName!");
			PlayerPrefs.SetString("userId",returnValue["userId"].ToString());
			PlayerPrefs.SetString("userHash",returnValue["userHash"].ToString());
		}else{
			throw "error:004 登録エラー！再度お試しください！"; 
		}
		Application.LoadLevel("Main");
		
	}catch( message ){
		EditorUtility.DisplayDialog("Error!",message.Message,"OK");
	}
}

function uniqueID(){
	 return parseInt(UnityEngine.Random.Range(1.0 ,1000.0)).ToString() + DateTime.Now.Ticks.ToString();
}

function isset( data ){
    return ( typeof( data ) != 'undefined' );
}