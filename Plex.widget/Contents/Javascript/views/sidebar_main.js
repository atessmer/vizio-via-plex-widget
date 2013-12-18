
var PlexMainSidebarView = new KONtx.Class({
	ClassName: 'PlexMainSidebarView',
	
	Extends: KONtx.system.SidebarView,

	createView: function() {
      var __baseID = (this.id || this.ClassName);

		this.controls = {};

      this.controls.medialibrary = new KONtx.control.TextButton({
         guid: __baseID+'.MediaLibrary',
         label: $_('menu_medialibrary'),
         events: {
            onSelect: function(event) {
               KONtx.application.loadView('view-MediaLibrary');
            },
         },
      }).appendTo(this);

      this.controls.preferences = new KONtx.control.TextButton({
         guid: __baseID+'.Preferences',
         label: $_('menu_preferences'),
         styles: {
            vOffset: this.controls.medialibrary.outerHeight,
         },
         events: {
            onSelect: function(event) {
               KONtx.application.loadView('view-Preferences');
            },
         },
      }).appendTo(this);
	},
});
