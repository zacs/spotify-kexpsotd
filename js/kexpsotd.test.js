require([
  '$api/models',
  '$views/list#List',
  '$api/search',
  '$views/throbber#Throbber'
], function (models, List, search, Throbber) {
  'use strict';

  var totalSongs=0, availableSongs=0;

  // HTML escaping
  function htmlEscape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // HTML unescaping
  function htmlUnescape(str) {
    return String(str)
      .replace('&amp;', '&')
      .replace('&quot;', '"')
      .replace('&#39;', '\'')
      .replace('&lt;', '<')
      .replace('&gt;', '>');
  }

  // Construct the search term for a single track
  function constructSearchTerm(str) {
    return 'artist:"' + str.split(' - ')[0] + '" track:"' + str.split(' - ')[1] + '"';
  }


  // Build playlist view
  function buildList(trackURIArray) {
    var arr = trackURIArray;
    var throbber = Throbber.forElement(document.getElementById('loading'));
    models.Playlist
      .createTemporary("kexpsotd" + new Date().getTime())
      .done(function (playlist) {
        playlist.load("tracks").done(function () {
          playlist.tracks.add.apply(playlist.tracks, arr).done(function () {
            // Create list
            var list = List.forCollection(playlist, {
              style: 'rounded'
            });

            document.getElementById('playlist-player').appendChild(list.node);
            list.init();
            document.getElementById('stats').innerHTML = availableSongs + ' out of ' + totalSongs + ' available on Spotify.';
          });
        });
      });
    throbber.hide();
  }

  // Get top search results for track
  function getTrackFromSearch(searchStr) {
    var promise = new models.Promise();
    var mySearch = search.Search.search(searchStr);

    mySearch.tracks.snapshot(0, 1).done(function(snapshot) {
      console.log('Found', snapshot.length, 'result(s) for', mySearch.query);
      if (snapshot.length>0) {availableSongs++;}
      snapshot.loadAll().done(function(tracks) {
        promise.setDone(tracks[0]);
      }).fail(function (f) {
        promise.setFail(f);
      });
    });

    return promise;
  }

  // Get all tracks from KEXP
  function loadKexpSOTD(feed_uri) {
    var xhr = new XMLHttpRequest();
    var kexpTracks = [];
    var rawEntries, song;
    xhr.open('GET', feed_uri);
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      rawEntries = xhr.responseText.split('<item>');
      rawEntries.shift();
      rawEntries.forEach(function(entry) {
        song = htmlUnescape(entry.split('<title>')[1].split('</title>')[0]);
        console.log('Found song: ' + constructSearchTerm(song));
        kexpTracks.push(constructSearchTerm(song));
      });

      var promises = [];

      for (var i = 0; i < kexpTracks.length; i++) {
        totalSongs++;
        var promise = getTrackFromSearch(kexpTracks[i]);
        promises.push(promise);
      }

      models.Promise.join(promises)
        .done(function (tracks) {
          console.log('Loaded all tracks', tracks);
        })
        .fail(function (tracks) {
          console.error('Failed to load at least one track.', tracks);
        })
        .always(function (tracks) {
          // filter out results from failed promises
          buildList(tracks.filter(function(t) {
            return t !== undefined;
          }));
        });
    }
    xhr.send(null);
  }

  // When application has loaded, run loadKexpSOTD
  models.application.load('arguments').done(loadKexpSOTD('http://feeds.kexp.org/kexp/songoftheday'));

});
