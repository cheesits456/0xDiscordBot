#!/usr/bin/env bash
git clone https://github.com/cheesits456/0xDiscordBot.git
mv config.json config.bak.json
ls -QA | grep -ve "config.bak.json\|0xDiscordBot\|guilds\|node_modules" | xargs rm -rf
cp -rf ./0xDiscordBot/. .
rm -rf ./0xDiscordBot
npm i
exit 0
