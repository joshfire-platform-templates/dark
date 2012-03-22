/**
 * UI fragments are data tree elements that can be instanciate in a datatree.
 */
Joshfire.define(['joshfire/class', 'joshfire/tree.ui', 'joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'src/ui-components'], function(Class, UITree, List, Panel, PanelManager, Button, UI, UIFragments) {
return {
  /**
   * @param toGrid : list of object type for wich to dispkay content as grid
   */
  itemList : function(params) {
    params = params || {};
    params.toGrid = params.toGrid || ['ImageObject'];
    
    var gridIf = "(item['@type'] || item.itemType) === '" + params.toGrid[0] + "'";
    for (var i = 1; i < params.toGrid.length; i ++) {
      gridIf += " || (item['@type'] || item.itemType) === '" + params.toGrid[i] + "'";
    }

    return {  
      id: 'itemList',
      scroller: true,
      scrollOptions:{
        useTransition:true
      },
      type: List,
      htmlClass: 'itemList',
      loadingTemplate: '<div class="loading"></div>',
      itemTemplate: "<li id='<%=itemHtmlId%>' " + 
                    "data-josh-ui-path='<%= path %>' data-josh-grid-id='<%= item.id %>'" + 
                    "class='josh-List joshover item-<%= (item['@type'] || item.itemType).replace('/', '') %> mainitemlist " + 
                    // grid view
                    "<% if (" + gridIf + ") { %>" +
                      " grid" +
                    "<% } else { %>" +
                    // list view
                      " list" +
                    "<% } %>" +
                    "' >" +
                    "<%= itemInner %>" + 
                    "</li>",
      itemInnerTemplate:
        '<% if ((item["@type"] || item.itemType) === "ImageObject") { %>' +
          UI.tplItemThumbnail +
        '<% } else if ((item["@type"] || item.itemType) === "Article/Status") { %>' +
          UI.tplTweetItem +
        '<% } else if ((item["@type"] || item.itemType) === "Event") { %>' +
          UI.tplEventItem +   
        '<% } else if ((item["@type"] || item.itemType) === "Article" && item.url && item.url.indexOf("spreadsheets.google.com") != -1) { %>' +
          '<div class="directory">' +
            UI.tplItemThumbnail +
            '<p class="name"><%= item.name %></p>' + 
            '<p class="description"><%= item.description %></p>' + 
            '<span class="list-arrow"></span>' +
          '</div>' +
        '<% } else { %>' +
          UI.tplItemPreview +
          '<div class="title"><%= item.name %></div>' +
          UI.getItemDescriptionTemplate(70) +
          '<span class="list-arrow"></span>' +
        '<% } %>'
    };
  },

  title : function() {
    return {
            id: 'title',
            type: Panel,
            innerTemplate: UI.tplHeader
          };
  },

  menu : function(params) {
    params = params || {id: 'menu'};

    return {
          id: params.id,
          type: List,
          htmlClass: 'menu',
          dataPath: '/datasourcelist/',
          itemInnerTemplate: '<div class="picto item-<%= item.config.col %>"></div><div class="name"><%= item.name %></div>',
          onData: function(data) {} // trigger data, WTF?
        };
  },

  /**
   * @param app : a reference to the current application (in a UITree class, this.app)
   * @param treePosition : (optional) the string depresenting the position of the instanciated fragment in the tree. (need more work on this) 
   * @param uiDataMaster
   * @param videoPanelType : (default to "video.youtube")
   */
  detail : function(params) {
    params = params || {};
    params.videoPanelType = params.videoPanelType || "video.youtube";

    return {
      id: 'detail',
      type: Panel,            
      htmlClass: 'detailView',
      loadingTemplate: '<div class="loading"></div>',
      uiDataMaster: params.uiDataMaster,        
      autoShow: false,
      children: [
        {
          // Article and default
          id: 'article',
          htmlClass: 'detailViewItem',
          type: Panel,
          scroller: true, 
          scrollOptions:{
            useTransition:true
          },
          uiDataMaster: params.uiDataMaster,
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
            var thisEl = params.app.ui.element(params.treePosition + '/detail/article').htmlEl;
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
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/article').insertScroller();
          }
        },
        {
          // Twitter
          id: 'twitter',
          htmlClass: 'detailViewItem',                     
          type: Panel,
          uiDataMaster: params.uiDataMaster,
          scroller: true,
          scrollOptions:{
            useTransition:true
          },              
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: UI.tplTweetPage,
          onData: function(ui) {
            var thisEl = params.app.ui.element(params.treePosition + '/detail/twitter').htmlEl;
            if ((ui.data['@type'] || ui.data.itemType) === 'Article/Status') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/twitter').insertScroller();
          }
        },
        {
          // Google spreadsheets
          id: 'google',
          htmlClass: 'detailViewItem',                  
          type: Panel,
          scroller: true,
          scrollOptions:{
            useTransition:true
          },               
          uiDataMaster: params.uiDataMaster,
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
            var thisEl = params.app.ui.element(params.treePosition + '/detail/google').htmlEl;
            if ((ui.data['@type'] || ui.data.itemType) === 'Article' && ui.data.url && ui.data.url.indexOf("spreadsheets.google.com") != -1) {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/google').insertScroller();
          }
        },
        {
          // Flickr
          id: 'image',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,
          scrollOptions:{
            useTransition:true
          },                
          uiDataMaster: params.uiDataMaster,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: '<img class="picture-fullscreen" src="<%= data.contentURL %>" alt="" />',
          onData: function(ui) {
            var thisEl = params.app.ui.element(params.treePosition + '/detail/image').htmlEl;
            if ((ui.data['@type'] || ui.data.itemType) === 'ImageObject') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/image').insertScroller();
          }
        },
        {
          // Event
          id: 'event',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,
          scrollOptions:{
            useTransition:true
          },               
          uiDataMaster: params.uiDataMaster,
          loadingTemplate: '<div class="loading"></div>',
          innerTemplate: UI.tplEventPage,
          onData: function(ui) {
            var thisEl = params.app.ui.element(params.treePosition + '/detail/event').htmlEl;
            if ((ui.data['@type'] || ui.data.itemType) === 'Event') {
              $(thisEl).show();
            } else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/event').insertScroller();
          }
        },
        {
          // Video
          id: 'video',
          type: Panel,
          htmlClass: 'detailViewItem',                     
          scroller: true,
          scrollOptions:{
            useTransition:true
          },        
          loadingTemplate: '<div class="loading"></div>',
          uiDataMaster: params.uiDataMaster,
          onData: function(ui) {
            var thisEl = params.app.ui.element(params.treePosition + '/detail/video').htmlEl,
                player = params.app.ui.element(params.treePosition + '/detail/video/player.youtube');

            if (((ui.data['@type'] || ui.data.itemType) === 'VideoObject') && ui.data.publisher && (ui.data.publisher.name === 'Youtube')) {
              player.playWithStaticUrl({
                url: ui.data.url.replace('http://www.youtube.com/watch?v=', ''),
                width: '100%'
              });
              $(thisEl).show();
            }
            else {
              $(thisEl).hide();
            }
          },
          onAfterRefresh : function() {
            params.app.ui.element(params.treePosition + '/detail/video').insertScroller();
          },
          children: [
            {
              id: 'title',
              type: Panel,
              uiDataMaster: params.uiDataMaster,
              innerTemplate:
                '<div class="title"><h1><%= data.name %></h1>' +
                UI.tplDataAuthor +
                '</div>'
            },
            {
              id: 'player.youtube',
              type: params.videoPanelType,
              autoShow: true,
              controls: true,
              noAutoPlay: false
            }
          ]
        }
      ]
    };
  },
  about : function(app, treePosition) {
    return {
      id: 'about',
      scroller: true,
      scrollOptions:{
            useTransition:true
          },         
      type: Panel,
      htmlClass: 'about',   
      loadingTemplate: '<div class="loading"></div>',          
      autoShow: false,
      innerTemplate: UI.tplAboutPage,
      onAfterRefresh : function() {
        app.ui.element(treePosition + '/about').insertScroller();
      }
    };
  }
};
});
