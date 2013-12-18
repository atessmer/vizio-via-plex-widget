
var PlexPreferencesSidebarView = new KONtx.Class({
	ClassName: 'PlexPreferencesSidebarView',
	
	Extends: KONtx.system.SidebarView,

	createView: function() {
      var __baseID = (this.id || this.ClassName);

		this.controls = {};

      this.controls.back = new KONtx.control.BackButton({
         guid: __baseID+'.BackButton',
         label: $_('menu_preferences'),
      }).appendTo(this);

      var server = new KONtx.control.Header({
         label: $_('label_pms'),
         styles: {
            vOffset: this.controls.back.outerHeight,
         },
      }).appendTo(this);

      this.controls.host = new KONtx.control.TextEntryButton({
         guid: __baseID+'.Host',
         label: $_('label_host'),
         value: $preferences.getHost(),
         styles: {
            vOffset: server.outerHeight,
         },
         keyboard: {
            layout: 'alphanumeric',
         },
         events: {
            onSubmit: function(event) {
               $preferences.saveHost(event.payload.value);
            },
         },
      }).appendTo(this);
   },
});
