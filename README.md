#![CHIP_EAST](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/chip_east.png) Chip's Tribute ![CHIPS_WEST](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/chip_west.png)

A recreation of the 90's classic "Chip's Challenge" written entirely in JavaScript for the HTML5 Canvas.

## ![ITEM_CHIP](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/item_chip.png) What is it? ![ITEM_CHIP](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/item_chip.png)

[Chip's Challenge](https://en.wikipedia.org/wiki/Chip%27s_Challenge) was designed by developer Chuck Somerville and released for the Atari Lynx in 1989 by Epyx Games. It was later ported to the Commodore 64, MS-DOS, and... a whole lot of platforms, honestly - including a release for Windows 95. That's the version I'm trying to remake.

It's a fairly simple game - move around and push blocks, pick up items, and cry while [terrifying frog-beasts](http://chipschallenge.wikia.com/wiki/Teeth) chase you across the map. But the game manages to twist these simple mechanics into some truly devious and downright frustrating puzzles, not to mention that several level packs have been created by fans over the years. Surprisingly enough, there is still an active community for this game today!

The folks over at the [Chip's Challenge Wiki](http://chipschallenge.wikia.com/wiki/Chip%27s_Challenge_Wiki) can explain the game better than I can. You can also check out the original games on Steam: [Chip's Challenge 1](http://store.steampowered.com/app/346850/), [Chip's Challenge 2](http://store.steampowered.com/app/348300/) (finally released in 2015!), and Chuck's modern take on the original - [Chuck's Challenge 3D](http://store.steampowered.com/app/262590/). They're all very affordable and very good!

## ![SOCKET](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/socket.png) Why? ![SOCKET](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/socket.png)

Even if you somehow obtain a copy of the Windows version of the game today (which you won't be able to do *legally*), you won't be able to simply run it on any modern machine. The original game was ported to Windows as a 16-bit application, and there's no way to make 16-bit applications run natively on 64-bit operating systems. You'll need to own a rather old machine or boot up a 32-bit Windows VM.

So in the interest of preserving this iconic piece of 90's history, I want to make it available in a format that current players can enjoy. Also, I've never made a video game before, so this seems like a good learning opportunity.

The code for this game will be entirely written from scratch using as few libraries as possible. I plan to implement a level editor and leaderboards as well - but those will wait until the game is at least feature-complete. After that, I might use the custom engine as a jumping off point to create a brand new game! We'll see how this goes.

For the time being, additional questions about this project can be addressed to **runeberrysoftware@gmail.com**

## ![EXIT](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/exit.png) Changelog ![EXIT](https://raw.githubusercontent.com/dolphinspired/CHIPS/master/img/exit.png)

**Alpha**

* 0.2.0 - No feature changes, but a MAJOR code overhaul. App rearchitected for improved modularity.
  * No more global functions/vars! Everything is neatly organized within the *chips* namespace.
  * Levels are now grouped into Levelsets, which are stored on the server as JSON files (Only one exists now: Test.json)
  * Tile and collision are now packed up into a neatly-organized object - no more deplorable switch statements! Would like to export rulesets as JSON in a future release.
  * An actual loading screen! It's not much, but at least the game will now reliably wait for all assets to load before trying to draw.
* 0.1.0 - First commit