#!/bin/bash
# Purpose: Ease install for KEXP SOTD Spotify app.

set -e

# Set install location -- this is where Spotify app must exist locally
INSTALL_PATH="$HOME/Spotify"

# Clone the repo locally so it can be run
if [[ ! -d $INSTALL_PATH ]]; then
    mkdir -p $INSTALL_PATH
    git clone https://github.com/zacs/spotify-kexpsotd.git $INSTALL_PATH
    echo "KEXP SOTD installed. Restart Spotify then type 'spotify:app:kexpsotd' to run the app."
fi
