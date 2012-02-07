Joshfire.define(['joshfire/app', 'joshfire/class', './src/tree.data', './src/tree.ui.phone', 'joshfire/utils/splashscreen', 'joshfire/uielements/panel', './src/lib/ba-linkify', 'src/ui-components'], function(BaseApp, Class, Data, UI, Splash, Panel, linkify, UItpl) {
  
  return Class(BaseApp, {

    id: 'defaultApp',

    uiClass: UI,

    dataClass: Data,

    setup: function(callback) {
      var _this = this,
          footer = _this.ui.element('/footer'),
          itemList = _this.ui.element('/content/itemList'),
          detailPanel = _this.ui.element('/content/detail'),
          twitterPanel = _this.ui.element('/content/detail/twitter'),
          articlePanel = _this.ui.element('/content/detail/article'),
          prevBtn = _this.ui.element('/header/prev'),
          logo = _this.ui.element('/header/title');

      this.splash = new Splash();

      // Change app name globally
      document.title = Joshfire.factory.config.app.name;

      // Populate footer
      footer.subscribe('data', function(event, data) {
        // We have data, remove splashscreen
        // Todo: it may better to remove it "onAfterShow" or "onAfterInsert"
        _this.splash.remove();

        // Select the first tab on our footer
        footer.selectByIndex(0);
      });

      // Handle clicks on footer
      footer.subscribe('select', function(event, data) {
        var datasourceId = data[0][0];

        // if about page
        if(datasourceId == 'about') {
          _this.ui.element('/content/about').show();
          return;
        }

        // Set the new dataPath
        _this.ui.element('/content/itemList').setDataPath('/datasource/' + datasourceId + '/');

        // Show itemList, because we could be on a detail panel
        _this.ui.element('/content').switchTo('itemList');

        // Hide prev button (todo: check if it's visible before doing so)
        prevBtn.hide();
      });

      // Open item when selected
      itemList.subscribe('select', function(event, data) {
        _this.ui.element('/content/detail').show();
      });

      itemList.subscribe('afterRefresh', function(event, data) {
        // if list is empty, display a message
        var $items = $('#defaultApp__content__itemList li');
        if($items.length == 0) {
          $('#defaultApp__content__itemList').html(UItpl.tplNothingToSeeHere);
        }

        // if list is a grid, add a clear:both at the end for scrolling
        if( $('#defaultApp__content__itemList li.grid').length > 0 ) {
          if( ! $('#defaultApp__content__itemList ul li').last().hasClass('clearfix') ) {
            $('#defaultApp__content__itemList ul').append('<li class="clearfix"></li>');
          }
        }
      });

      // Show prev button when viewing details
      detailPanel.subscribe('afterShow', function(event, data) {
        prevBtn.show();
      });

      // linkify the tweets
      twitterPanel.subscribe('afterRefresh', function(event, data) {
        var cb = function( text, href ) {
          return href ? '<a href="' + href + '" title="' + href + '" rel="external" target="_blank">' + text + '<\/a>' : text;
        }
        $('.linkify').html( linkify( $('.linkify').text(), {callback: cb} ) );
      });

      // make sure links are target=_blank in articles
      articlePanel.subscribe('afterRefresh', function(event, data) {
        $('a', articlePanel.htmlEl).attr('target', '_blank').attr('rel', 'external');
      });

      // when the menu is built, create the "more" button
      footer.subscribe('afterShow', function(event, data) {
        var $menuitems = $('#defaultApp__footer li');
        if($menuitems.length > 5) {
          $($menuitems[3]).after("<li class='more-footer'><div class='picto'></div><div class='name'>more</div></li>");
        }
        $('.more-footer').bind('click', function(){
          $('#defaultApp__footer').toggleClass("opened");
        }); 
      });

      // Show previous panel now
      prevBtn.subscribe('select', function(event, data) {
        _this.ui.element('/content').switchTo('itemList');

        // _this.ui.element('/header/prev') == this?
        // Also, we could hide the button after displaying /content/itemList
        prevBtn.hide();
      });

      callback(null, true);
    }

  });

});