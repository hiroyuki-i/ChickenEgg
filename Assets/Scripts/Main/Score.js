
import LitJson;

var countHiyoko : GUIText;
var userIdGUI : GUIText;
var HighScoreGUI : GUIText;
var verticalStyle : GUIStyle; 
var labelStyle_Label : GUIStyle;
var horizontalStyle : GUIStyle;
var labelStyle_Rank : GUIStyle;
var labelStyle_UserId  : GUIStyle;
var labelStyle_Score  : GUIStyle;

private var userId : String;
private var currentScore : int;
private var highScore : int;
private var highScoreUpdateDeltaTime : float = 0.0;
private var isRankingDisplay : boolean = false;
private var isRankingConnected : boolean = false;
private var rankingArray : JsonData = null;
private var flashMessage : FlashMessage;

#if UNITY_EDITOR
	private var URL : String = "localhost";
#else
	private var URL : String = "http://chickenegg.unity.psalm.me";
#endif

function Start () {
	//set default display and username.
	currentScore = 0;
	userIdGUI.text = PlayerPrefs.GetString("userId","") + "'s";
	highScore = PlayerPrefs.GetInt("highScore");
	displayHighScore();
	//gui positioning
	verticalStyle.fixedWidth = Screen.width * 0.7;
	verticalStyle.margin.left = (Screen.width - verticalStyle.fixedWidth) / 2;
	//welcome message.
	flashMessage = gameObject.GetComponent(FlashMessage);
	flashMessage.displayMessage("Hi! " + PlayerPrefs.GetString("userId","") + "!!");
}

function Update () {
	countHiyoko.text = currentScore.ToString() + " Hiyoko !";
	if(currentScore >= highScore){
		PlayerPrefs.SetInt("highScore",currentScore);
		highScore = currentScore;
		displayHighScore();
		if(highScoreUpdateDeltaTime == 0.0 && highScore > 0){
			postScore();
			flashMessage.displayMessage("New HighScore! You got it!!");
			highScoreUpdateDeltaTime = Time.deltaTime;
		}else if(highScoreUpdateDeltaTime == 0.0 && highScore == 0){
			postScore();
			flashMessage.displayMessage("Niwatori Heaven!!");
			highScoreUpdateDeltaTime = Time.deltaTime;
		}else if(highScoreUpdateDeltaTime > 10.0){
			postScore();
			flashMessage.displayMessage("Recorded Highscore!!");
			highScoreUpdateDeltaTime = Time.deltaTime;
		}else{
			highScoreUpdateDeltaTime += Time.deltaTime;
		}
	}else{
		if(currentScore == 1){
			flashMessage.displayMessage("The burning hand moment!!");
		}
	}
}

function OnApplicationQuit(){
	if(currentScore > highScore){
		PlayerPrefs.SetInt("highScore",currentScore);
		highScore = currentScore;
		postScore();
	}
}

function addScore(){
	currentScore++;	
}

function displayHighScore(){
	HighScoreGUI.text = "Hi-Score " + highScore.ToString();
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
	GUI.skin.button.padding.top = 10;
	GUI.skin.button.padding.bottom = 10;
	if(isRankingDisplay == false){
		if(GUI.Button(Rect( Screen.width - 130 , 10 , 120 , 45),"Ranking")){
			isRankingDisplay = true;
		}
	}
}

function rankingDisplay(){
	if(GUI.Button(Rect( Screen.width - 130, 10 , 120 , 45),"Close")){
		isRankingDisplay = false;
		rankingArray = null;
		return;
	}
	if(isRankingConnected == false && rankingArray != null){
		GUILayout.BeginVertical(verticalStyle);
		GUILayout.Label("Ranking",labelStyle_Label);
		GUILayout.BeginHorizontal(horizontalStyle);
		GUILayout.Label("No.",labelStyle_Rank);
		GUILayout.Label("Player name",labelStyle_UserId);
		GUILayout.Label("Score",labelStyle_Score);
		GUILayout.EndHorizontal();
		var row : int = 0;
		for(var i = 0; i < rankingArray.Count; i++){
			row++;
			GUILayout.BeginHorizontal(horizontalStyle);
			GUILayout.Label(row.ToString(),labelStyle_Rank);
			GUILayout.Label(rankingArray[i]["userId"].ToString(),labelStyle_UserId);
			GUILayout.Label(rankingArray[i]["score"].ToString(),labelStyle_Score);
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
		if(GUI.Button(Rect( Screen.width - 160, Screen.height - 40 , 150 , 30),"Delete your acount.")){
			currentScore = 0;
			highScore = 0;
			postScore();
			PlayerPrefs.DeleteAll();
			Application.LoadLevel("auth");
		}
	}else{
		GUI.Label(Rect(Screen.width / 2 , Screen.height / 2, 100 ,30),"Now Loading...");
		if(isRankingConnected == false){
			StartCoroutine("getRanking");
		}
	}
}

function getRanking(){
	isRankingConnected = true;
	var form : WWWForm = new WWWForm();
	form.AddField("userId",PlayerPrefs.GetString("userId"));
	form.AddField("userHash",PlayerPrefs.GetString("userHash"));
	form.AddField("score",highScore);
	var www : WWW = new WWW(URL + "/hiyoko/ranking/",form);
	yield www;
	if(www.error == null && www.text != "false"){
		rankingArray = JsonMapper.ToObject(www.text);
		isRankingConnected = false;
		Debug.Log("Score::ranking return : " + www.text);
	}
}

function postScore(){
	var form : WWWForm = new WWWForm();
	form.AddField("userId",PlayerPrefs.GetString("userId"));
	form.AddField("userHash",PlayerPrefs.GetString("userHash"));
	form.AddField("score",highScore);
	var www : WWW = new WWW(URL + "/hiyoko/highscore/",form);
	yield www;
	if(www.error == null && www.text == "true"){
		Debug.Log("Score::postScore save!");
		return;
	}else{
		Debug.Log("Score::postScore failed to save !");
		return;
	}
}