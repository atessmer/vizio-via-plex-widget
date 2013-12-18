
var EventHandlers = {
	onApplicationStartup: function(event) {
    	//$API.fetchPlaylists();
	},
	
	onNetworkHideDialog: function(event) {
		if(event.payload.type == 1) {
			var playlists = KONtx.messages.fetch("playlists");
			if(playlists instanceof Array) {
				log("We have our data, so we are good to go.");
				return;
			} else {
				log("We don't have any config data yet, so we need to go back to dock and not allow the dialog to dismiss itself.");
				event.preventDefault();
				$API.fetchPlaylists();
				$preferences.checkConnectionBitrate();
			}
		} else {
			log("Ignoring hide network dialog of type 2");
		}
	},

	handlerPlayerEvent: function(event) {
      /*
		switch(event.type) {
			case 'onStateChange':
				switch(event.payload.newState) {
					case KONtx.mediaplayer.constants.states.PLAY:
						if(!this._snippetAdded) {
							KONtx.application.addViewConfig({ id: 'snippet-nowplaying', viewClass: NowPlayingSnippetView });
							this._snippetAdded = true;
						}
						break;
					case KONtx.mediaplayer.constants.states.UNKNOWN:
					case KONtx.mediaplayer.constants.states.ERROR:
					case KONtx.mediaplayer.constants.states.STOP:
					case KONtx.mediaplayer.constants.states.EOF:
						KONtx.application.removeView('snippet-nowplaying');
						this._snippetAdded = false;
						break;
				}
				break;
		}
      */
	}
};
