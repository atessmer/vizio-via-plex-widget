
var NowPlayingSnippetView = new KONtx.Class({
	ClassName: 'NowPlayingSnippetView',
	
	Extends: KONtx.system.ProfileSnippetView,
	
	initView: function() {
		this._handleActivateSnippet.subscribeTo(this, ['onActivateSnippet'], this);
	},

	_handleActivateSnippet: function(event) {
		event.preventDefault();
		event.stopPropagation();
		KONtx.application.setHostResultToViewId(event, 'view-Player');
	},
	
		
	createView: function() {
		this.controls.text = new KONtx.element.Text({
			label: $_('now_playing'),
			styles: {
				color: "#ffffff",
				fontSize: KONtx.utility.scale(20),
				vAlign: "center",
				hAlign: "center"
			},
		}).appendTo(this);
	},
});
