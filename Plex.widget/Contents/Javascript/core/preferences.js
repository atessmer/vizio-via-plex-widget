
$preferences = function() {
	var options = {};
	var current_options_version = 1;
	
	var staticInit = function() {
		fetchConfig();
	}();
	
	function fetchConfig() {
		try {
			options = JSON.parse(currentAppConfig.get("options"));
		} catch(e) {
			initConfig();
		}

		if(options.version != current_options_version) {
		   // here you would add logic to migrate old data when you incremented the options version
			initConfig();
		}		
	};
	
	function initConfig() {
		options = {
			'version': current_options_version,
         'host': '',
		}
      saveConfig();
	};
	
	function saveConfig() {
		try {
			currentAppConfig.set("options", JSON.stringify(options));
		} catch (e) {
			log("\n\n!!!!!!!!!!!!!!!!!Error saving config preferences!\n!!!!!!!!!!!!!!!!!!!!!!\n\n");
		}
	};

   return {
      'getHost': function() {
         fetchConfig();
         return options.host;
      },

      'saveHost': function(host) {
         fetchConfig();
         options.host = host;
         saveConfig();
      },
   }
}();
