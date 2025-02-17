# Lambda Client
A custom game client for [deadshot.io](https://deadshot.io) <br>
The successor to [Quasar](https://github.com/LordPhyre/Quasar-DSC), with pretty much the same features, just done better

## Overview
Lambda Client adds the following features to the game:
- **Resource Swapper** - Modify any in-game feature that relies on a file, like weapon cosmetics, sounds, etc.
- **Colorblind Filters** - Filters for many types of colorblindness, including Protanopia, Deuteranopia, and Tritanopia. More info below.
- **Discord RPC** - Show your friends on Discord how cool you are.
- **Brainrot Mode** - Is normal Deadshot too boring? Try brainrot mode, where random brainrot videos are overlaid onto the game.
- **Aimbot** - For Lambda Client premium members only. See below for how to get premium.

## Feature Usage
**Resource Swapper**
- Lambda Client provides quick upload buttons in the menu for the following features: 
    - Default AR (weapon and player)
    - Default SMG (weapon and player)
    - Default Shotgun (weapon and player)
    - Default Sniper (weapon and player)
    - Main Menu background
- To swap other resources, you'll have to do it yourself. Here's how:
    - Identify the resource you want to swap. In Lambda Client, you can open the DevTools with Ctrl+Shift+I.
    - Once in the DevTools panel, find the "Network" tab, then reload the page with Ctrl+R.
    - A bunch of game files will be shown in a list, now it's up to you to find what you want. 
    - When you find a file you want to change, Right Click > Copy > Copy URL, then paste it somewhere. Take note of the filepath after "deadshot.io".
    - Recreate this filepath in the Lambda Client swap folder, which will be in Documents/Lambda/Swapper. Most of the folders should already be there, but create any that aren't.
    - For example, the default AR skin is located at https://deadshot.io/weapons/ar2/arcomp.webp, so to change it you will need a file called arcomp.webp under Documents/Lambda/Swapper/weapons/ar2/
    - Make any changes to the file you want, then reload again with Ctrl+R or the Apply Changes button in the Lambda Client menu.

**Colorblind Filters**
- Unlike justatree (the deadshot.io developer), we actually care about the colorblind community. As such, Lambda Client provides filters that attempt to correct the following types of colorblindness:
    - Protanopia
    - Deuteranopia
    - Tritanopia
    - Achromatopsia
- We realize that everyone with colorblindness has differences, so we also provide sliders to create a custom filter that suits your needs.

**Aimbot**
- The Lambda Client team is proud to offer one of the only working aimbots in the game. Because the developer of Deadshot doesn't really appreciate people making cheats, we are charging for its use. This is because it takes much more maintenance, as the relavent game code is repeatedly obfuscated with every update.
- To unlock Lambda Client Premium, just send us $5 on CashApp, at $sillyindividual43. In the optional note, write "Lambda Client Premium", followed by your Deadshot username. For example: `Lambda Client Premium - justatree`