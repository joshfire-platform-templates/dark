Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube', 'src/ui-components', 'src/ui-fragments', 'joshfire/vendor/underscore'], function(Class, UITree, List, Panel, PanelManager, Button, Video, UI, UIFragments, _) {

  return Class(UITree, {

    buildTree: function() {

      var app = this.app;

      return [
        {
          id: 'sidebarleft',
          type: Panel,
          children: [
            {
              id: 'header',
              type: Panel,
              children: [{
                id: 'title', // the title or the logo
                type: Panel,
                innerTemplate: UI.tplHeader
              }]
            },
            {
              id: 'menu',
              type: List,
              dataPath: '/datasourcelist/',
              itemInnerTemplate: '<div class="picto item-<%= item.config.col %>"></div><div class="name"><%= item.name %></div>',
              orientation:'left',
              beforeGridExit: function(self, direction) {
                if (direction == 'right') {
                  app.ui.moveTo('focus', '/content/itemList');
                  app.ui.element('/content/itemList').focusByIndex([0]);
                }
              }
            }
          ]
        },
        {
          id: 'content',
          type: PanelManager,
          uiMaster: '/sidebarleft/menu',
          children: [
            _.extend(
              UIFragments.itemList({toGrid: []}),
              {
                orientation: 'left', // left means a list going down
                beforeGridExit: function(self, direction) {
                  switch (direction) {
                    case 'left' :
                      app.ui.moveTo('focus', '/sidebarleft/menu');
                      break;
                  }
                }
              }
            ),
            {
              id: 'itemGrid',
              type: List,
              loadingTemplate: '<div class="loading"></div>',
              itemTemplate: '<li id="<%=itemHtmlId%>" data-josh-ui-path="<%= path %>" data-josh-grid-id="<%= item.id %>" ' + 
                              'class="josh-List joshover item-<%= item["@type"] || item.itemType %> "' + 
                              '><%= itemInner %></li>',
              itemInnerTemplate:
                '<% if ((item["@type"] || item.itemType) === "VideoObject" || (item["@type"] || item.itemType) === "ImageObject") { %>' +
                  UI.tplItemPreview +
                  '<div class="title"><%= item.name %></div>' +
                '<% } %>',
              beforeGridExit: function(self, direction) {
                // This is a Hack. This should be handled by a Grid Element of the Joshfire framework.

                // CSS impose a grid of 4 element in width
                var widthElements = 4;

                var coords = app.ui.element('/content/itemGrid').grid.currentCoords;

                switch (direction) {
                  case 'down' :
                    var gotoIndex = coords[0] + widthElements;
                    if( gotoIndex <  app.ui.element('/content/itemGrid').data.length ) {
                      app.ui.element('/content/itemGrid').grid.goTo( [gotoIndex, 0] );
                    }
                    break;
                  case 'up' :
                    var gotoIndex = coords[0] - widthElements;
                    if(gotoIndex < 0) {
                      app.ui.moveTo('focus', '/sidebarleft/menu');
                    } else {
                      // the followingline doesn't work well: the grid coordinates are not updated 
                      //app.ui.element('/content/itemList').focusByIndex(gotoIndex);
                      app.ui.element('/content/itemGrid').grid.goTo( [gotoIndex, 0] );
                    }
                  break;
                }
              }
            }
          ]
        },
        // This is a copy of what you can find in UIFragments.detail, but the code was too different to think about using it
        {
          id: 'detail',
          type: Panel,            
          htmlClass: 'detailView',
          loadingTemplate: '<div class="loading"></div>',       
          autoShow: false,
          children: [
            {
              id: 'back',
              type: Button,
              label: 'Back'
            },
            {
              // Article and default
              id: 'article',
              htmlClass: 'detailViewItem',
              uiDataSync: '/detail',
              type: Panel,
              scroller: true, 
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate:
                '<div>' +
                '<div class="title"><h1><% if (data && data.name) { print(data.name); } %></h1>' +
                  UI.tplDataAuthor +
                '</div>' +
                '<div class="body">'+
                  '<% if (data.articleBody) { print(data.articleBody); } %>' +
                '</div>' +
                '</div>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/article').htmlEl;
                var type = ui.data['@type'] || ui.data.itemType;
                if (type === 'VideoObject' ||
                  type === 'ImageObject' ||
                  type === 'Article/Status' ||
                  type === 'Event' ||
                  (type === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1)
                  ) {
                  $(thisEl).hide();
                }
                else {
                  $(thisEl).show();
                }
              }
            },
            {
              // Twitter
              id: 'twitter',
              htmlClass: 'detailViewItem',                     
              type: Panel,
              uiDataSync: '/detail',
              scroller: true,                   
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate: UI.tplTweetPage,
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/twitter').htmlEl;
                if ((ui.data['@type'] || ui.data.itemType) === 'Article/Status') {
                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              }
            },
            {
              // Google spreadsheets
              id: 'google',
              htmlClass: 'detailViewItem',                  
              type: Panel,                  
              uiDataSync: '/detail',
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate:  '<div class="directory">' +
                                '<% if (data.image) { %>' +
                                  '<div class="picture"><img src="<%= data.image.contentURL %>"></div>' +
                                '<% } %>' +
                                '<p class="name"><%= data.name %></p>' + 
                                '<p class="description"><%= data.description %></p>' + 
                                '<% if (data.articleBody) { %>' +
                                  '<p class="content"><%= data.articleBody %></p>' +
                                '<% } %>' +
                              '</div>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/google').htmlEl;
                if ((ui.data['@type'] || ui.data.itemType) === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1) {
                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              }
            },
            {
              // Flickr
              id: 'image',
              type: Panel,
              htmlClass: 'detailViewItem',                     
              uiDataSync: '/detail',
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate: '<img class="picture-fullscreen" src="<%= data.contentURL %>" alt="" />',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/image').htmlEl;
                if ((ui.data['@type'] || ui.data.itemType) === 'ImageObject') {
                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              }
            },
            {
              // Event
              id: 'event',
              type: Panel,
              htmlClass: 'detailViewItem',                     
              uiDataSync: '/detail',
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate: UI.tplEventPage,
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/event').htmlEl;
                if ((ui.data['@type'] || ui.data.itemType) === 'Event') {
                  $(thisEl).show();
                } else {
                  $(thisEl).hide();
                }
              }
            },
            {
              // Video
              id: 'video',
              type: Panel,
              htmlClass: 'detailViewItem',                     
              uiDataSync: '/detail',              
              loadingTemplate: '<div class="loading"></div>',
              innerTemplate:
                '<div class="videoplayer"></div>',
              onData: function(ui) {
                var thisEl = app.ui.element('/detail/video').htmlEl;

                if ((ui.data['@type'] || ui.data.itemType) === 'VideoObject') {
                  $(thisEl).show();
                }
                else {
                  $(thisEl).hide();
                }
              },
              onAfterRefresh : function() {
                var element = app.ui.element('/detail/video');
                mediaFactory.resolve(element.data, { width: "100%", height: "100%" }).toHtml(function(err, html) {
                  $('.videoplayer', $(element.htmlEl)).html(html);
                });
              }
            }
          ]
        }
      ];
    }

  });

});