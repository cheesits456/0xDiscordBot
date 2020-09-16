#!/usr/bin/env bash
rm -rf ./0xDiscordBot
git clone https://github.com/cheesits456/0xDiscordBot.git
mv config.js config.bak.js
ls -QA | grep -ve "config.bak.js\|0xDiscordBot\|guilds\|node_modules" | xargs rm -rf
cp -rf 0xDiscordBot/. .
rm -rf 0xDiscordBot
npm i
exit 0
