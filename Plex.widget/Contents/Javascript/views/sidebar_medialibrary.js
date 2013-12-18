
var PlexMediaLibrarySidebarView = new KONtx.Class({
	ClassName: 'PlexMediaLibrarySidebarView',
	
	Extends: KONtx.system.SidebarView,

   config: {
      // Location to being traversing library hierarchy
      rootPath: '/library/',

      // Number of buffered pages ahead/behind
      loadFactor: 4,
   },

   cellCreator: function() {
      var cell = new KONtx.control.GridCell({
         styles: {
            height: KONtx.utility.scale(35),
            width: this.width
         },
         events: {
            onSelect: function(event) {
               var view = this.grid.owner;
               switch (this.plexObj._elementType) {
                  case 'Directory':
                     view.changeDir.bindTo(view)(this.plexObj);
                     break;

                  case 'Video':
                     KONtx.messages.store("playlist." + this.plexObj.key, this.plexObj);
                     KONtx.application.loadView('view-Player',
                                                {PlaylistID: this.plexObj.key});
                     break;
               }
            }
         }
      });

      cell.textLabel = new KONtx.element.Text({
         styles: {
            color: '#FFFFFF',
            fontSize: KONtx.utility.scale(16),
            hAlign: 'left',
            vAlign: 'center'
         }
      }).appendTo(cell);

      return cell;
   },

   cellUpdater: function(cell, data) {
      cell.plexObj = data;
      switch (data._elementType) {
         case 'Directory':
         case 'Video':
            cell.textLabel.data = cell.plexObj.title;
            break

         default:
            cell.textLabel.data = 'ERROR: unknown type ('
                                + data._elementType + ')';
            break;
      }
   },

	createView: function() {
      var __baseID = (this.id || this.ClassName);

		this.controls = {};

      this.config = $merge(this.config, {
         breadcrumbs: [],
      });

      this.controls.back = new KONtx.control.BackButton({
         guid: __baseID+'.BackButton',
         label: $_('menu_main'),
      }).appendTo(this);

      this.controls.up = new KONtx.control.TextButton({
         guid: __baseID+'.Up',
         label: '..',
         styles: {
            vOffset: this.controls.back.outerHeight,
         },
         events: {
            onSelect: function(event) {
               var view = this.owner;
               view.changeDir.bindTo(view)(null);
            },
         },
      }).appendTo(this).hide();

      this.controls.page = new KONtx.control.PageIndicator({
         guid: __baseID+'.PageIndicator',
         styles: {
            vAlign: 'bottom',
            vOffset: this.height,
         }
      }).appendTo(this);

      var gridHeight = this.height - (this.controls.back.height +
                                      this.controls.up.height +
                                      this.controls.page.height);
      var rowHeight = 35;
      var gridRows = Math.floor((gridHeight/rowHeight));

      this.config.pager = new KONtx.utility.Pager(gridRows,
                                                  gridRows * this.config.loadFactor,
                                                  this.fetch, this,
                                                  this.config.loadFactor);

      this.controls.grid = new KONtx.element.Grid({
         guid: __baseID+'.Grid',
         pager: this.config.pager,
         columns: 1,
         rows: gridRows,
         manageWaitIndicator: true,
         cellCreator: this.cellCreator,
         cellUpdater: this.cellUpdater,
         styles: {
            width: this.width,
            height: gridHeight,
            vOffset: this.controls.up.outerHeight
         }
      }).appendTo(this);
      this.controls.grid.attachAccessories(this.controls.page);

      this.changeDir({'path': this.config.rootPath});

	},

   changeDir: function(dir) {
      if (dir == null) {
         // Back to previous path

         if (this.config.breadcrumbs.length == 0) {
            // XXX: exit app, or go to main menu?
            return;
         }

         var prev = this.config.breadcrumbs.pop();
         this.config.path = prev.path;
         this.config.page = prev.page;

         if (this.config.path == this.config.rootPath) {
            this.controls.up.hide();
         }
      } else {
         if (dir.path == this.config.path) {
            return;
         }

         if (dir.path != this.config.rootPath) {
            this.config.breadcrumbs.push({
               path: this.config.path,
               page: this.controls.grid.getCurrentPage(),
            });
            this.controls.up.show();
         }
         this.config.path = dir.path;
         this.config.page = 0;

         this.controls.grid.focus();
         this.controls.grid.focusCell({row: 0, column: 0});
      }

      this.config.pager.initItems([], this.controls.grid.getCellCount() * (this.config.page + 1));
      this.controls.grid.changePage(this.config.page);
   },

   fetch: function(params) {
      var ctx = {
         'view': this,
         'params': $unlink(params),
      };

      $API.fetchData(this.config.path, params.page * params.per_page,
                     params.per_page, this.fetchCB.bindTo(ctx));
   },

   fetchCB: function(result) {
      this.view.config.pager.onGotPage(this.params, result._children, result.totalSize);

      // The focused cell seems to loose it's highlighting, so re-focus on it
      var focusCell = this.view.controls.grid.getFocusCoordinates();
      if (focusCell) {
         this.view.controls.grid.focusCell(focusCell);
      }
   },

});
