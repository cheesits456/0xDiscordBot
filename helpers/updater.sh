#!/usr/bin/env bash
mv config.json config.bak.json 2> /dev/null
ls -QA | grep -ve "config.bak.json\|0xDiscordBot\|guilds\|node_modules" | xargs rm -rf
cp -rf ./0xDiscordBot/. .
rm -rf ./0xDiscordBot
exit 0
