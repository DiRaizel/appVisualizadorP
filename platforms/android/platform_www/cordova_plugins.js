cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesis",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesis.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "window.speechSynthesis"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisUtterance",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisUtterance.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisUtterance"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisEvent",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisEvent.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisEvent"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisVoice",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisVoice.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisVoice"
      ]
    },
    {
      "id": "phonegap-plugin-speech-synthesis.SpeechSynthesisVoiceList",
      "file": "plugins/phonegap-plugin-speech-synthesis/www/SpeechSynthesisVoiceList.js",
      "pluginId": "phonegap-plugin-speech-synthesis",
      "clobbers": [
        "SpeechSynthesisVoiceList"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "phonegap-plugin-speech-synthesis": "0.1.1"
  };
});