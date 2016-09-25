function getTextNodes() {
    var walker = document.createTreeWalker(
        document.body, 
        NodeFilter.SHOW_TEXT, 
        null, 
        false
    );

    var node;
    var textNodes = [];

    while(node = walker.nextNode()) {
    	if(node.nodeValue.trim() !== "") {
    		textNodes.push(node);
    	}
        
    }

    return textNodes;
}

var TA_to_KA_Map = {
	"ழ" : "ೞ",
    "ன" : "ಣ"
};

var KA_to_TA_Map = {

    "ಋ" : "Ru",
    "ಖ" : "க",//"kha"
    "ಗ" : "க",//"ga"
    "ಘ" : "க",//"gha"

    "ಛ" : "ச",//"chchaa"
    "ಝ" : "ஜ",//"jha"

    "ಠ" : "ட",//"tta"
    "ಡ" : "ட",//"da"
    "ಢ" : "ட",//"dda"

    "ಥ" : "த",//"ththa"
    "ದ" : "த",//"dha"
    "ಧ" : "த",//"dhdha"

    "ಫ" : "ப",//"pha"
    "ಬ" : "ப",//"ba"
    "ಭ" : "ப",//"bha"

    "ಶ" : "ஷ",

    "ಂ" : " ஂ",

    "ೃ" : "்ரு"
};

var TA_to_DE_Map = {};

var KA_to_DE_Map = {
    "ೕ" : "ए"
};

var DE_to_TA_Map = {};

var DE_to_KA_Map = {};

// Range checkers

function isTamilUnicode(sUnicode) {
    sUnicode = sUnicode.toUpperCase();
    return sUnicode >= "0B80" && sUnicode <= "0BFF";
}

function isKannadaUnicode(sUnicode) {
    sUnicode = sUnicode.toUpperCase();
    return sUnicode >= "0C80" && sUnicode <= "0CFF";
}

function isDevanagariUnicode(sUnicode) {
   sUnicode = sUnicode.toUpperCase();
   return sUnicode >= "0900" && sUnicode <= "0975";
}

function getUnicodeFromCharacter(character) {
    return ("0000" + character.charCodeAt(0).toString(16).toUpperCase()).slice(-4);
}

function getCharacterFromUnicode(sUnicode) {
    return String.fromCharCode(parseInt(sUnicode, 16))
}

// Converters

function getKannadaUnicodeFromTamil(sTamilUnicode) {
    return sTamilUnicode.replace("B", "C");
}

function getTamilUnicodeFromKannada(sTamilUnicode) {
    return sTamilUnicode.replace("C", "B");
}

function getDevanagariUnicodeFromTamil(sTamilUnicode) {
    return "0" + (parseInt(sTamilUnicode, 16) - 640).toString(16);
}

function getDevanagariUnicodeFromKannada(sKannadaUnicode) {
    return "0" + (parseInt(sKannadaUnicode, 16) - 896).toString(16);
}

function getKannadaUnicodeFromDevanagari(sDevanagariUnicode) {
    return "0" + (parseInt(sDevanagariUnicode, 16) + 896).toString(16);
}

function getTamilUnicodeFromDevanagari(sDevanagariUnicode) {
    return "0" + (parseInt(sDevanagariUnicode, 16) + 640).toString(16);    
}

function getTransliteratedCharacter(isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap, character) {
    var fromUnicode = getUnicodeFromCharacter(character);
    if(!isUnicodeRangeValid(fromUnicode)) {
        return character;
    }

    var transformedCharacter = exceptionsMap[character];
    
    var toUnicode = getTransliteratedUnicode(fromUnicode);
    var toCharacter = getCharacterFromUnicode(toUnicode);
    
    transformedCharacter = transformedCharacter ? transformedCharacter : toCharacter;
    return transformedCharacter ? transformedCharacter : character;
}

function getTransliteratedText(text, isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap) {
	var transliteratedText = "";

	transliteratedText = text.split("").map(getTransliteratedCharacter.bind(null, isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap)).join("");
	return transliteratedText;
}

function xLangTransliterate(isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap, node) {

	node.nodeValue = getTransliteratedText(node.nodeValue, isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap);
    return node;
}

var toLanguage = toLanguage || "kannada";
var fromLanguage = fromLanguage || "tamil";

var isUnicodeRangeValid = "";
var getTransliteratedUnicode = "";
var exceptionsMap = "";

if(toLanguage === "kannada" && fromLanguage === "tamil") {
    isUnicodeRangeValid = isTamilUnicode;
    getTransliteratedUnicode = getKannadaUnicodeFromTamil;
    exceptionsMap = TA_to_KA_Map;
}

if(toLanguage === "tamil" && fromLanguage === "kannada") {
    isUnicodeRangeValid = isKannadaUnicode;
    getTransliteratedUnicode = getTamilUnicodeFromKannada;
    exceptionsMap = KA_to_TA_Map;
}

if(toLanguage === "devanagari" && fromLanguage === "tamil") {
    isUnicodeRangeValid = isTamilUnicode;
    getTransliteratedUnicode = getDevanagariUnicodeFromTamil;
    exceptionsMap = TA_to_DE_Map;
}

if(toLanguage === "tamil" && fromLanguage === "devanagari") {
    isUnicodeRangeValid = isDevanagariUnicode;
    getTransliteratedUnicode = getTamilUnicodeFromDevanagari;
    exceptionsMap = DE_to_TA_Map;
}

if(toLanguage === "devanagari" && fromLanguage === "kannada") {
    isUnicodeRangeValid = isKannadaUnicode;
    getTransliteratedUnicode = getDevanagariUnicodeFromKannada;
    exceptionsMap = KA_to_DE_Map;
}

if(toLanguage === "kannada" && fromLanguage === "devanagari") {
    isUnicodeRangeValid = isDevanagariUnicode;
    getTransliteratedUnicode = getKannadaUnicodeFromDevanagari;
    exceptionsMap = DE_to_KA_Map;
}

var textNodes = getTextNodes();
textNodes.forEach(xLangTransliterate.bind(null, isUnicodeRangeValid, getTransliteratedUnicode, exceptionsMap));