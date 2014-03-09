require([
    '$api/models',
    '$api/search',
    '$views/list#List'
  ], function(models, search, List) {

  function htmlEscape(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function htmlUnescape(str) {
    return String(str)
      .replace('&amp;', '&')
      .replace('&quot;', '"')
      .replace('&#39;', '\'')
      .replace('&lt;', '<')
      .replace('&gt;', '>');
  }

  function constructSearchTerm(str) {
    return 'artist:"' + str.split(' - ')[0] + '" title:"' + str.split(' - ')[1] + '"';
  }

  function createList(trackUriArray) {
    // create spotify Collection object
    var playlist = models.Playlist.createTemporary('kexpsotd');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://feeds.kexp.org/kexp/songoftheday');
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      rawEntries = xhr.responseText.split('<item>');
      rawEntries.shift();
      rawEntries.forEach(function(entry) {
        foo = htmlUnescape(entry.split('<title>')[1].split('</title>')[0]);
        console.log(constructSearchTerm(foo));
        var mySearch = search.Search.search(constructSearchTerm(foo));
        console.log(mySearch);
        // do spotify fuzzy search for entry.title
        // add top result to list
      });
    }
    // make sure list is in right order (probably need to reverse?)
    xhr.send(null); // is this necessary?

    // for testing below...
    var playlist = models.Playlist.fromURI('spotify:user:billboard.com:playlist:6UeSakyzhiEt4NB3UAd6NQ');
    var list = List.forPlaylist(playlist);
    //var myCollection = models.Collection.
    // var list = List.forCollection();
    return list;
  }

  function loadSongs() {
    /* This app is definitely too simple to need arguments, I think...
    var args = models.application.arguments;
    if (args) {
      var lastArg = args[args.length - 1];
      if (lastArg !== 'index' && lastArg !== 'tabs') {
        return;
      }
    } */

    var playlist = document.getElementById('playlist-player');
    playlist.innerHTML = '<img src="img/loading_indicator.png" />';
    kexpList = createList();
    // do the shit to put kexpList into the div
    playlist.innerHTML = '';
    document.getElementById('playlist-player').appendChild(kexpList.node);
    kexpList.init();
  }

  // When application has loaded, run loadSongs function
  models.application.load('arguments').done(loadSongs);

  // When arguments change, run pages function
  /* See above statement about not needing arguments...
  models.application.addEventListener('arguments', loadSongs); */
}); // require
