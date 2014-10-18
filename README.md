Minecraft Snaps (Beta)
======================

Contact me [@Antrikshy](http://twitter.com/Antrikshy) with any questions or suggestions.

Minecraft Snaps is a simple app for Mac (Windows version in the works) that helps you to save versions, or 'snapshots', of your Minecraft worlds. This way, you can back your worlds up before doing something risky. It allows you to restore any previous versions of the worlds with one click.

![](http://i.imgur.com/YSNe7Zf.png)

Minecraft Snaps was made possible [node-webkit](https://github.com/rogerwang/node-webkit), an awesome project from Roger Wang and Intel and by [Bootstrap](http://www.getbootstrap.com/). The app is written entirely in web technologies and Node.js.

How it works
------------
Minecraft Snaps backs up worlds by simply making copies of Minecraft saves folders. On first run, it creates its own folder in your app data folder. When you click 'New snapshot' in the app, it copies the selected world as-is into this folder, separate from your Minecraft folders.

>Remember: Only create new snapshots after saving and closing your map in the game. Also, do not restore snapshots with the world open, or the game may overwrite your restored snapshot when you save.

Download
--------
If you want to download a release version of the app, look in the `build` folder.

Contribute
----------
To test the app on your own computer, download a zipped version of the repo and use [nuwk!](http://codeb.it/nuwk/) to build by placing all the source files in the `App` folder created by said app. See node-webkit instructions for help with testing. Make sure to edit `package.json` and change the `frame` variable to `true` to see the console and browser controls.

Currently, the app only works on Mac. On Windows, the `mkdirSync` function does not work correctly. I will really appreciate a fix for this.
