
var PlexSnippetView = new KONtx.Class({
	ClassName: 'SnippetView',
	
	Extends: KONtx.system.AnchorSnippetView,
		
	createView: function() {
      var container = new KONtx.element.Container({
         styles: {
            vAlign: "center",
            hAlign: "center"
         }
      }).appendTo(this);

      var icon = new KONtx.element.Image({
         src: "Images/960x540/icon.png",
         styles: {
            vAlign: "center",
            hOffset: 0
         }
      }).appendTo(container);

		var text = new KONtx.element.Text({
			label: $_('app_name'),
			styles: {
				color: "#ffffff",
				fontSize: KONtx.utility.scale(20),
				vAlign: "center",
            hOffset: icon.outerWidth + KONtx.utility.scale(10)
			},
		}).appendTo(container);
	},
});
