spotify-kexpsotd
================

Spotify app which renders an always-up-to-date playlist for KEXP's Song of the Day.

Note: About a week after I finished this app, Spotify has discontinued their local apps service. Unfortunately this means I can never official publish the app. It's still certainly possible to install the app for your own use, though. Instructions below.

Easy Installation
-----------------
If you trust running remote scripts, you can install by running the following command:

    curl -fsSL https://raw.githubusercontent.com/zacs/spotify-kexpsotd/master/install.sh | sh

Once that has completed, restart Spotify and in the search bar type `spotify:app:kexpsotd`. The app will now load, and you can add it as a favorite if you'd like. 

Manual Installation
-------------------

Note: In order to use the app, you may need to be [registered as a Spotify developer](https://developer.spotify.com/my-account). I haven't been able to verify this yet, but will update the README when I have. 

1. Create a `Spotify` folder in your home directory (Mac) or in your Documents folder (Windows).
2. Navigate to that folder in your shell (Terminal.app on Mac or cmd.exe on Windows)
3. Download the app by running `git clone https://github.com/zacs/spotify-kexpsotd.git`
4. Restart Spotify
5. In the search bar, type `spotify:app:kexpsotd`
6. The app should now load. If you want to access it more easily in the future, just hit the `Add` button on the top bar, and the app will stay in your left-hand pane

That's it! Yes, it's lame that the app can't be put in the App Finder, but something is better than nothing. I'll add a shell script install alternative in the next day or two to automate the above process, for anyone who wants to install that way.
