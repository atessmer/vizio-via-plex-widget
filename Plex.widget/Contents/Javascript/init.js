
include("Framework/kontx/1.6/src/all.js");

include("Javascript/core/event_handlers.js");
include("Javascript/core/api.js");
include("Javascript/core/preferences.js");

include("Javascript/views/snippet.js");
//include("Javascript/views/now_playing_snippet.js");
include("Javascript/views/sidebar_main.js");
include("Javascript/views/sidebar_medialibrary.js");
include("Javascript/views/sidebar_preferences.js");
include("Javascript/views/basicplayer.js");

KONtx.application.init({
	views: [
		{ id: 'view-Main', viewClass: PlexMainSidebarView },
		{ id: 'view-MediaLibrary', viewClass: PlexMediaLibrarySidebarView },
		{ id: 'view-Preferences', viewClass: PlexPreferencesSidebarView },
		{ id: 'view-Player', viewClass: BasicPlayerView },
		{ id: 'view-Settings', viewClass: KONtx.views.AboutBox },
		{ id: 'snippet-main', viewClass: PlexSnippetView },
	],
	defaultViewId: 'view-Main',
	settingsViewId: 'view-Settings',
});

EventHandlers.onApplicationStartup.subscribeTo(KONtx.application, ['onApplicationStartup'], EventHandlers);
EventHandlers.onNetworkHideDialog.subscribeTo(KONtx.application, ['onNetworkHideDialog'], EventHandlers);
EventHandlers.handlerPlayerEvent.subscribeTo(KONtx.mediaplayer, ['onStateChange'], EventHandlers);
