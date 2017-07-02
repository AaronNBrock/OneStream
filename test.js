/**
 * Created by Bench on 5/7/2016.
 */


var sourceText = 'You smell funny! ';


var sourceLang = 'auto';


var targetLang = 'de';


/* Option 1 */

//var translatedText = LanguageApp.translate(sourceText, sourceLang, targetLang)

/* Option 2 */

var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
    + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);

console.log(url);

