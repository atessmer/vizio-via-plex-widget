
$API = function() {
   _standardHeaders = {
      'Accept':                     'application/json',
      'X-Plex-Platform':            'Yahoo! Connected TV',
      'X-Plex-Client-Identifier':   tv.system.deviceId,
      'X-Plex-Product':             'Plex for Yahoo! Connected TV',
      'X-Plex-Device':              tv.system.deviceVersion,
      'X-Plex-Device-Name':         tv.system.deviceBrand
   };

   _pmsPort = 32400;

   function handleFetchResponse(u) {
      KONtx.utility.WaitIndicator.down();

      if (u.response != 200) {
         log('PLEX_ERROR: fetch returned HTTP code ' + u.response);
         return;
      }

      var result = JSON.parse(u.result);
      for each(var element in result._children) {
         if (element.key[0] == '/') {
            element.path = element.key;
         } else {
            element.path = u.path + element.key + '/';
         }
      }

      u.callback(result);
   };

   function buildURL(path, urlParams) {
      var url = "http://" + $preferences.getHost() + ':' + _pmsPort + path;
      if (urlParams && urlParams != {}) {
         url += "?" + Object.keys(urlParams).map(function(k) {
            return [k, urlParams[k]].join("=");
         }).join("&");
      }
      return url;
   }

   function buildRequest(path, headers, urlParams) {
      var u = new URL();

      // Merge standard headers into caller's so caller can overwrite defaults
      var allHeaders = $merge(headers, _standardHeaders);
      Object.keys(allHeaders).forEach(function(k) {
         u.setRequestHeader(k, allHeaders[k]);
      });

      u.location = buildURL(path, urlParams);

      return u;
   }

	return {
      'fetchData': function(path, startIndex, maxCount, callback) {
         if (KONtx.application.isPhysicalNetworkDown()) {
            log("The network is down!");
            return;
         }

         KONtx.utility.WaitIndicator.up();

         headers = {
            'X-Plex-Container-Start':  startIndex,
            'X-Plex-Container-Size':   maxCount,
         };

         var u = buildRequest(path, headers, {});
         u.path = path;
         u.callback = callback;
         u.fetchAsync(handleFetchResponse.bindTo(this));
      },

      'sendTimeline': function(time) {
         if (KONtx.application.isPhysicalNetworkDown()) {
            log("The network is down!");
            return;
         }

         var video = KONtx.messages.fetch("playlist." +
                           KONtx.mediaplayer.playlist.get().PlaylistID);

         urlParams = {
            'time':        time,
            'duration':    video.duration,
            'state':       'playing',
            'ratingKey':   video.ratingKey,
            'key':         video.key
         };

         var u = buildRequest("/:/timeline", {}, urlParams);
         u.fetchAsync(function(u) {});
      },

      'buildURL': function(path) {
         return buildURL(path, {});
      },
	}
}();
