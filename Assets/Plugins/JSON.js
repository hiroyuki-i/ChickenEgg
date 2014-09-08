/*
 * UnityScript JSON Parser
 * by Fraser McCormick (unityscripts@roguishness.com)
 * http://twitter.com/flimgoblin
 * http://www.roguishness.com/unity/
 *
 * You may use this script under the terms of either the MIT License 
 * or the Gnu Lesser General Public License (LGPL) Version 3. 
 * See:
 * http://www.roguishness.com/unity/lgpl-3.0-standalone.html
 * http://www.roguishness.com/unity/gpl-3.0-standalone.html
 * or
 * http://www.roguishness.com/unity/MIT-license.txt
 */

public static function ParseJSON(json):Hashtable{
	var hash=new Hashtable();
	var parents=new Array();
	var array:Array;
	var quote="\""[0];
		var quoted=false;
		var haveValue=false;
		var quotedString="";
		var isKey=true;
		var lastKey="";
		var inArray=false;
		for(var i=1;i<json.length-1;i++){
			var c=json[i];
			if(c==quote){
				if(quoted){
					// end of an element
					quoted=false;
					haveValue=true;
				}else{
					// start of an element
					quoted=true;
					quotedString="";
				}
			}else{
			
				if(quoted){
					quotedString+=c;
				}else{
					if(c=="{"[0]){
						if(inArray){
							// hash in an array
							hash=new Hashtable();
							array[array.length]=hash;
							parents.Push(array);
							inArray=false;
						}else{
							// open a new hash
							hash[lastKey]=new Hashtable();
							parents.Push(hash);
							hash=hash[lastKey];
							lastKey="";
						}
					}else if(c=="["[0]){
						// start of an array
					
						if(inArray){
							// array in an array
							array[array.length]=new Array();
							parents.Push(array);
							array=array[array.length-1];
						}else{
							// array in a hash
							array=new Array();
							parents.Push(hash);
							hash[lastKey]=array;
							lastKey="";
						}
						inArray=true;				
					}else if(c=="]"[0] || c=="}"[0]){
						// end of array
						
						if(haveValue || quotedString){
							if(inArray){
								array.Push(quotedString);
							}else{
								hash[lastKey]=quotedString;
								lastKey="";
							}
							haveValue=false;
							quotedString="";
						}

						var par=parents.Pop();
						if(par instanceof Hashtable){
							hash=par;
							inArray=false;
						}else{
							array=par;
							inArray=true;
						}
						
					}else if(c==":"[0]){
						lastKey=quotedString;
						haveValue=false;
						quotedString="";
					}else if(c==","[0]){
						// end of value
						
						if(haveValue || quotedString){
							if(inArray){
								array.Push(quotedString);
							}else{
								hash[lastKey]=quotedString;
								lastKey="";
							}
							haveValue=false;
							quotedString="";
						}
					}else{
						quotedString+=c;
					}
				}
			}
		}
		if(haveValue || quotedString){
			if(inArray){
				array.Push(quotedString);
			}else{
				hash[lastKey]=quotedString;
				lastKey="";
			}
			haveValue=false;
		}
	
	return hash;
}
