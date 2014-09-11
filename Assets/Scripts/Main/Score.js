//#pragma strict
import SimpleJSON;

var countHiyoko : GUIText;
var HiScore : GUIText;
var verticalStyle : GUIStyle; 
var labelStyle_Label : GUIStyle;
var horizontalStyle : GUIStyle;
var labelStyle_Rank : GUIStyle;
var labelStyle_UserId  : GUIStyle;
var labelStyle_Score  : GUIStyle;

private var currentScore : int;
private var highScore : int;
private var highScoreUpdateDeltaTime : float = 0.0;
private var isRankingDisplay : boolean = false;
private var URL : String = "localhost";
private var isConnected : boolean = false;
private var rankingArray;

function Start () {
	currentScore = 0;
	highScore = PlayerPrefs.GetInt("highScore");
	displayHighScore();
	verticalStyle.fixedWidth = Screen.width * 0.7;
	verticalStyle.margin.left = (Screen.width - verticalStyle.fixedWidth) / 2;
}

function Update () {
	countHiyoko.text = currentScore.ToString() + " Hiyoko !";
	if(currentScore >= highScore){
		PlayerPrefs.SetInt("highScore",currentScore);
		highScore = currentScore;
		displayHighScore();
		if(highScoreUpdateDeltaTime > 10.0 || highScoreUpdateDeltaTime == 0.0){
			postScore();
			highScoreUpdateDeltaTime = Time.deltaTime;
		}else{
			highScoreUpdateDeltaTime += Time.deltaTime;
		}
	}
	
}
function OnApplicationQuit(){
	if(currentScore >= highScore){
		PlayerPrefs.SetInt("highScore",currentScore);
		highScore = currentScore;
		postScore();
		Debug.Log("hiscore update! in applicationQuit ");
	}
}

function addScore(){
	currentScore++;	
}

function displayHighScore(){
	HiScore.text = "Hi-Score " + highScore.ToString();
}

function OnGUI(){
	if(isRankingDisplay){
		GUI.ModalWindow(
			100,
			Rect(0,0,Screen.width, Screen.height),
			rankingDisplay,
			""
		);
	}
	if(GUI.Button(Rect( Screen.width - 90 , 10 , 80 , 30),"Ranking")){
		isRankingDisplay = true;
	}
}

function rankingDisplay(){
	if(GUI.Button(Rect( Screen.width - 90, 10 , 80 , 30),"Close")){
		isConnected = false;
		isRankingDisplay = false;
	}
	if(isConnected == true && rankingArray != null){
		GUILayout.BeginVertical(verticalStyle);
		GUILayout.Label("Ranking",labelStyle_Label);
		GUILayout.BeginHorizontal(horizontalStyle);
		GUILayout.Label("No.",labelStyle_Rank);
		GUILayout.Label("Player name",labelStyle_UserId);
		GUILayout.Label("Score",labelStyle_Score);
		GUILayout.EndHorizontal();
		var row : int = 0;
		for(var i in rankingArray){
			row++;
			GUILayout.BeginHorizontal(horizontalStyle);
			GUILayout.Label(row.ToString(),labelStyle_Rank);
			GUILayout.Label(i["userId"],labelStyle_UserId);
			GUILayout.Label(i["score"],labelStyle_Score);
			GUILayout.EndHorizontal();
		}
		while(row < 10){
			row++;
			GUILayout.BeginHorizontal(horizontalStyle);
			GUILayout.Label(row.ToString(),labelStyle_Rank);
			GUILayout.Label("no player",labelStyle_UserId);
			GUILayout.Label("0",labelStyle_Score);
			GUILayout.EndHorizontal();
		}
		GUILayout.EndVertical();
		if(GUI.Button(Rect( Screen.width - 160, Screen.height - 30 , 150 , 20),"Delete your acount.")){
			PlayerPrefs.DeleteAll();
			Application.LoadLevel("auth");
		}
	}else{
		GUI.Label(Rect(Screen.width / 2 , Screen.height / 2, 100 ,30),"Now Loading...");
		getRanking();
	}
}

function getRanking(){
	var form : WWWForm = new WWWForm();
	form.AddField("userId",PlayerPrefs.GetString("userId"));
	form.AddField("userHash",PlayerPrefs.GetString("userHash"));
	form.AddField("score",highScore);
	var www : WWW = new WWW(URL + "/hiyoko/ranking/",form);
	yield www;
	if(www.error == null){
		rankingArray = JSON.Parse(www.text);
	}
	isConnected = true;
}

function postScore(){
	var form : WWWForm = new WWWForm();
	form.AddField("userId",PlayerPrefs.GetString("userId"));
	form.AddField("userHash",PlayerPrefs.GetString("userHash"));
	form.AddField("score",highScore);
	var www : WWW = new WWW(URL + "/hiyoko/highscore/",form);
	yield www;
	if(www.error == null){
		Debug.Log("this::postScore save!");
	}
}