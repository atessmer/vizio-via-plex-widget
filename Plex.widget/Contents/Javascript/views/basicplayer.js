
var BasicPlayerView = new KONtx.Class({
	ClassName: 'BasicPlayerView',
	
	Extends: KONtx.system.FullscreenView,
	
	initView: function() {
		KONtx.mediaplayer.initialize();
		
		this.dialogs = {};
		
		this.dialogs.error = new KONtx.dialogs.Alert({
			title: $_('video_error_dialog_title'),
			message: $_('video_error_dialog_message'),
			buttons: [
				{ label: $_('dialog_retry_button'), callback: function() {
					KONtx.mediaplayer.playlist.start();
				} },
				{ label: $_('dialog_cancel_button'), callback: function() {
					KONtx.application.previousView();
				} },
			] 
		});
	},
	
	createView: function() {
      //common.debug.show("MEDIA");

		this.controls.overlay = new KONtx.control.MediaTransportOverlay({
         fadeTimeout: 5,
      }).appendTo(this);
	},
	
	focusView: function() {
		this.controls.overlay.focus();
	},
	
	updateView: function() {	
		this._registerHandlers();
		this._resetViewport();
		this._handlePlaylistUpdate(this.persist.PlaylistID);
	},
	
	hideView: function() {
		this._unregisterHandlers();
	},
	
	_handlePlaylistUpdate: function(playlistID) {
		if(KONtx.mediaplayer.isPlaylistEntryActive) {
			if(!playlistID) {
				// we have no new playlist we've been asked to play, so keep playing what we already are playing
				return;
			}
			if(playlistID == KONtx.mediaplayer.playlist.get().PlaylistID) {
				// we have been asked to play the same playlist we are already playing, so just keeping playing it
				return;
			}
		}
		
		// Otherwise, refresh the video info and start playing it
      this.config.playlistID = playlistID
      var video = KONtx.messages.fetch("playlist." + playlistID);
      $API.fetchData(video.path, 0, 1, this._startPlaylist.bindTo(this));
	},

   fmtTime: function(timeMS) {
      function zeroPad(num, places) {
        var zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
      }

      var time = Math.floor(timeMS / 1000);
      var sec = zeroPad(time % 60, 2);
      time = Math.floor(time / 60);
      var min = zeroPad(time % 60, 2);
      var hour = zeroPad(Math.floor(time / 60), 2);

      return Array(hour, min, sec).join(":");
   },
	
	_startPlaylist: function(result) {
		this.controls.overlay.resetState();

      if (result.totalSize != 1) {
         log('--------- ERROR: Unexpected child count (' +
             result._children.length + ') for playlist.' +
             this.playlistID);
         KONtx.application.previousView();
         return;
      }

      var video = result._children[0];
      KONtx.messages.store("playlist." + this.playlistID, video);
		KONtx.mediaplayer.playlist.set(this._createPlaylist(this.playlistID, video));
      KONtx.mediaplayer.playlist.start();
	},
	
	_createPlaylist: function(playlistID, video) {
		var playlist = new KONtx.media.Playlist(); 
		playlist.PlaylistID = playlistID;
		
      var media = video._children.filter(function(c) {
         return c._elementType == 'Media';
      });
      var parts = media[0]._children.filter(function(c) {
         return c._elementType == 'Part';
      });
		for each(var part in parts) {
         playlist.addEntryByURL($API.buildURL(part.key));
		}
		
		return playlist;
	},
	
	_resetViewport: function() {
		var bounds = KONtx.mediaplayer.getDefaultViewportBounds();
		KONtx.mediaplayer.setViewportBounds(bounds);
	},

   _events: [
      'onStateChange',
      'onPlaylistEnd',
      'onStreamLoadError',
      'onRemoteKeyPress',
      'onStartStreamPlayback',
      'onControlPlay',
      'onTimeIndexChanged',
   ],
	
	_registerHandlers: function() {
		if(this._boundPlayerHandler) {
			this._unregisterHandlers();
		}
		this._boundPlayerHandler = this._playerDispatcher.subscribeTo(KONtx.mediaplayer, this._events, this);
	},
	
	_unregisterHandlers: function() {
		if(this._boundPlayerHandler) {
			this._boundPlayerHandler.unsubscribeFrom(KONtx.mediaplayer, this._events);
			this._boundPlayerHandler = null;
		}
	},
	
	_playerDispatcher: function(event) {
		switch(event.type) {
			case 'onStateChange':
				if(event.payload.newState == KONtx.mediaplayer.constants.states.STOP) {
					KONtx.application.previousView();
				}
				if(event.payload.newState == KONtx.mediaplayer.constants.states.ERROR || event.payload.newState == KONtx.mediaplayer.constants.states.UNKNOWN) {
					this.dialogs.error.show();
				}
				break;
			case 'onPlaylistEnd':
				KONtx.application.previousView();				
				break;
			case 'onStreamLoadError':
				this.dialogs.error.show();
				break;
         case 'onRemoteKeyPress':
            switch (event.payload.keyCode) {
               case KONtx.mediaplayer.constants.keys.FASTFORWARD:
                  KONtx.mediaplayer.control.seek(30);
                  break;

               case KONtx.mediaplayer.constants.keys.REWIND:
                  KONtx.mediaplayer.control.seek(-30);
                  break;
            }
            break;
         case 'onStartStreamPlayback':
            var video = KONtx.messages.fetch("playlist." +
                                             KONtx.mediaplayer.playlist.get().PlaylistID);

            if (video.viewOffset && video.viewOffset > 0) {
               event.preventDefault();
               new KONtx.dialogs.Alert({
                  title: $_('video_dialog_play_video'),
                  buttons: [
                     {
                        label: $_('video_dialog_resume_from') + " " +
                               this.fmtTime(video.viewOffset),
                        callback: function() {
                           var video = KONtx.messages.fetch("playlist." +
                                                            KONtx.mediaplayer.playlist.get().PlaylistID);
                           /*
                            * XXX: specifying startIndex doesn't seem to work,
                            *      so store the viewOffset in the playlist and
                            *      seek to it during onControlPlay
                            */
                           KONtx.mediaplayer.playlist.get().viewOffset = video.viewOffset;
                           event.payload.callbackHandler(event.payload.selectedURL,
                                                         Math.floor(video.viewOffset/1000));
                        },
                     },
                     {
                        label: $_('video_dialog_play_from_beginning'),
                        callback: function() {
                           event.payload.callbackHandler(event.payload.selectedURL,
                                                         event.payload.startIndex);
                        },
                     },
                  ] 
               }).show();
            }
            break;
         case 'onControlPlay':
            var viewOffset = KONtx.mediaplayer.playlist.get().viewOffset;
            if (viewOffset) {
               KONtx.mediaplayer.control.seek(KONtx.mediaplayer.playlist.get().viewOffset/1000, true);
               KONtx.mediaplayer.playlist.get().viewOffset = null;
            }
            break;
         case 'onTimeIndexChanged':
            $API.sendTimeline(event.payload.rawTimeIndex);
            break;
			default:
				break;
		}
	}
});
