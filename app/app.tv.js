Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui.tv', 'joshfire/utils/splashscreen', 'joshfire/uielements/panel'], function(BaseApp, Class, Data, UI, Splash, Panel) {
  
  return Class(BaseApp, {

    id: 'defaultApp',

    uiClass: UI,

    dataClass: Data,

    setup: function(callback) {
      var _this = this,
          menu = _this.ui.element('/sidebarleft/menu'),
          itemGrid = _this.ui.element('/content/itemGrid'),          
          itemList = _this.ui.element('/content/itemList'),
          detailPanel = _this.ui.element('/detail'),
          title = _this.ui.element('/sidebarleft/header/title'),
          backBtn = _this.ui.element('/detail/back');

      this.splash = new Splash();

      // Change app name globally
      document.title = Joshfire.factory.config.app.name;

      // on menu select, assign the corresponding dataPath to itemList
      menu.subscribe('select', function(event, data) {
        console.warn('menu item has been selected', data[0][0]);
        var datasourceId = data[0][0];
        // Set the new dataPath
        var ds = _app.data.get('/datasource/' + datasourceId);

        var item = '/content/itemList';
        // if videos or pictures, display a grid
        console.log("ds.col", ds.col);
        if(ds.col == 'videos' || ds.col == 'photos') {
          console.log("use item grid");
          item = '/content/itemGrid';
        }
        _this.ui.element("/content").switchTo(item);
        _this.ui.element(item).setDataPath('/datasource/' + datasourceId + '/');
        _this.ui.moveTo('focus', item );

        // TODO: do not do this here
        _this.splash.remove();
      });

      // handle select on itemList and itemGrid
      var generateSelectDataFunction = function(uiElement) {
        return function(event, data) {
          detailPanel.show();
          _this.ui.moveTo('focus', '/detail/back');

          // store in the back button the origin of the datapath
          backBtn.previousPath = uiElement.path;

          var dataToDisplay = uiElement.dataPath + data[0];
          console.log( "detail", uiElement.path, dataToDisplay );
          detailPanel.setDataPath( dataToDisplay );
        }
      }

      itemList.subscribe('select', generateSelectDataFunction(itemList));
      itemGrid.subscribe('select', generateSelectDataFunction(itemGrid));

      // Close details when pushing back button
      backBtn.subscribe('select', function(event, data) {
        detailPanel.hide();
        _this.ui.moveTo('focus', backBtn.previousPath);
      });

      // Handling focus style on back button      
      backBtn.subscribe('afterFocus', function() {
        backBtn.addClass('focused');
      });
      backBtn.subscribe('afterBlur', function() {
        backBtn.removeClass('focused');
      });

      // select first item
      menu.selectByIndex(0);

      callback(null, true);
    }

  });

});