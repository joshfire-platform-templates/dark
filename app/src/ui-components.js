/**
 * Contain some UI elements that are used in data trees.
 */

Joshfire.define(['joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', 'joshfire/adapters/ios/uielements/video.youtube'], function(List, Panel, PanelManager, Button, Video) {
	return {
    tplHeader : '<% if(Joshfire.factory.config.app.logo) { %>' + 
                  '<div class="titleLogo">' +
                  '<img class="applogo" src="<%= Joshfire.factory.config.app.logo.contentURL %>" alt="<%= Joshfire.factory.config.app.name %>" />' +
                  '</div>' +
                '<% } else { %>' +
                  '<div class="title">' +
                  '<%= Joshfire.factory.config.app.name %>' +
                  '</div>' +
                '<% } %>',

    tplTweetItem :  '<div class="tweet">' +
                  '<div class="tweet-header">' +
                  '<% if (item.author) { %>' +
                    '<% if (item.author[0] && item.author[0].image) { %>' +
                      '<img src="<%= item.author[0].image.contentURL %>" alt="" />' +
                    '<% } %>' +
                    '<p class="user"><span class="name"><%= item.author[0].name %></span>' +
                    '<% if (item.author[0]["foaf:nick"]) { %>' +
                      ' <span class="login">@<%= item.author[0]["foaf:nick"] %></span>' +
                    '<% } %>' +
                    '</p>' +
                  '<% } %>' +
                  '</div>' +
                  '<div class="tweet-content">' +
                    '<p class="content"><%= item.name %></p>' +
                    '<p class="date"><%= prettyDate(item.datePublished) %></p>' + 
                    //'<p class="date"><%= item.datePublished ? toDate(item.datePublished).toTimeString().substring(0, 5) : "" %></p>' + 
                  '</div>' +                                     
                '</div>',

    tplTweetPage : '<div class="tweet">' +
                    '<div class="tweet-header">' +
                    '<% if (data.author) { %>' +
                      '<% if (data.author[0] && data.author[0].image) { %>' +
                        '<img src="<%= data.author[0].image.contentURL %>" alt="" />' +
                      '<% } %>' +
                      '<p class="username"><%= data.author[0].name %></p>' +
                      '<% if (data.author[0]["foaf:nick"]) { %>' +
                        ' <p class="userlogin">@<%= data.author[0]["foaf:nick"] %></p>' +
                      '<% } %>' +
                    '<% } %>' +
                    '</div>' +
                    '<div class="tweet-content">' +
                      '<p class="content linkify"><%= data.name %></p>' +
                      '<p class="date"><%= data.datePublished ? toDate(data.datePublished).toString().substring(0, 21) : "" %></p>' +                  
                    '</div>' +
                  '</div>',                

    tplEventItem : '<div class="event">' +
                    '<% var d = toDate(item.startDate); %>' + 
                    '<p class="startDateDay">' +
                      '<span class="date"><%= d.toDateString() %></span>' +                     
                      '<span class="localedate"><%= d.toLocaleDateString() %></span>' + 
                    '</p>' +
                    '<p class="startDate">' +
                      '<%= d.toTimeString().substring(0, 5) %>' + 
                    '</p>' +
                    '<p class="content"><%= item.name %></p>' +
                  '</div>',

    tplEventPage : '<div class="event">' +
                    '<div class="coords">' +
                      '<p class="Day">' + 
                        '<span class="date"><%= data.startDate ? toDate(data.startDate).toDateString() : "" %></span>' + 
                        '<span class="localedate"><%= data.startDate ? toDate(data.startDate).toLocaleDateString() : "" %></span>' + 
                      '</p>' +
                      '<p class="startDate">'+
                        '<span class="time"><%= data.startDate ? toDate(data.startDate).toTimeString().substring(0, 5) : "" %></span>' +                         
                      '</p>' + 
                      '<p class="endDate"><%= data.endDate ? toDate(data.endDate).toTimeString().substring(0, 5) : "" %></p>' +                       
                      '<% if (data.location) { %>' + 
                        '<p class="location"><%= data.location.name %></p>' +  
                      '<% } %>' +
                    '</div>' +
                    '<div class="event-content">' +
                      '<h2 class="name"><%= data.name %></h2>' +
                      '<p class="description"><%= data.description %></p>' +
                    '</div>' +
                  '</div>',

    tplItemPreview :  '<div class="preview">' +
                        '<% if (item.image) { %>' +
                          '<img src="<%= item.image.contentURL %>">' +
                        '<% } %>'+
                      '</div>',

    tplItemThumbnail :  '<% if (item.image && item.image.contentURL) { %>' +
                          '<div class="thumbnail" style="background-image:url(\'<%=item.image.contentURL%>\')"></div>' +
                        '<% } %>',
    
    tplDataAuthor:  '<% if (data.author && data.author[0] && data.author[0].name) { %>' +
                      '<p class="author">By <strong><%= data.author[0].name %></strong></p>' +
                    '<% } %>',

    tplAboutPage: '<div class="aboutpage">' +
                    //'<% if(Joshfire.factory.config.app.logo) { %>' + 
                    //  '<img class="applogo" src="<%= Joshfire.factory.config.app.logo.contentURL %>" alt="<%= Joshfire.factory.config.app.name %>" />' +
                    //'<% } else { %>' +
                    //  '<h2 class="appname"><%= Joshfire.factory.config.app.name %></h2>' +
                    //'<% } %>' +  
                    '<div class="abouthtml"><%= Joshfire.factory.config.template.options.abouthtml %></div>' +
                  '</div>',

    tplNothingToSeeHere : '<div class="empty-list"><p>Empty</p></div>',

    getItemDescriptionTemplate: function (maxLength) {
      return '<% if (item.description) { %>' +
        '<div class="abstract">' +
          '<% if (item.description.length > ' + maxLength + ') {' +
            'print(item.description.substring(0, ' + maxLength + ') + "…");' +
          '} else {' +
            'print(item.description); ' +
          '} %>' +
        '</div>' +
        '<% } %>';
    }

	};
});
