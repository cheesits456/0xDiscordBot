![Banner][banner-img]  
_This is a bot for the 0x Community on Discord, created with :heart: by [cheesits456][github]_

<details><summary><b>Table of Contents</b></summary>
<br>

- [Features](#features)
  - [Staking Stats](#staking-stats)
  - [Volume Stats](#volume-stats)
  - [Transaction Feed](#transaction-feed)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
- [Configuration](#configuration)
  - [Config Files](#config-files)
    - [.env](#env)
    - [config.json](#configjson)
	- [Icons.js](#iconsjs)
	- [AmountEmojis.json](#amountemojisjson)
  - [Config Options](#config-options)
    - [UserStatus](#userstatus)
	- [ActivityType](#activitytype)
- [Usage](#usage)
  - [Running the Bot](#running-the-bot)
  - [Commands](#commands)
    - [Bash](#bash)
    - [Eval](#eval)
    - [Ping](#ping)
	- [Prefix](#prefix)
	- [Restart](#restart)
	- [Setup](#setup)
	- [Update](#update)
- [Author](#author)
- [License](#license)

</details><hr>

# Features

<img align="right" alt="Staking Stats" src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/stats.png" width="340">

## Staking Stats

<p align="justify">Provides information about the current staking epoch, such as the total ZRX currently staked, or how much time is remaining until the epoch expires. Stats are provided in the form of viewable but unjoinable voice channels, collapsable under their own category at the top of the server's channel list.</p>

## Volume Stats

<p align="justify">Provides information about the total dollar value (USD) of all trades on the ZRX network for the past 24 hours, as well as all time. Similar to the staking stats, the network volume statistics also use a voice channel in its own collapsable category.</p>

## Transaction Feed

<p align="justify">Utilizes the <a href="https://docs.0xtracker.com/api-reference/introduction">0x Tracker API</a> to post details about every transaction on the ZRX Network to a read-only text channel in Discord. The Discord messages also contain a link to that transaction's page on the 0x Tracker website, as well as a Twitter link to draft a new Tweet about the transaction.</p>

![Network Transactions][transaction-img]

<hr>

# Getting Started

## Requirements

<blockquote align="justify">This bot has only been tested on Linux. It may turn out to work perfectly fine on Windows, but be aware that it also may turn out <b>not</b> to work perfectly fine on Windows</blockquote>

<p align="justify">You'll need the following installed on your system in order to proceed with setup:</p>

- Git
- Node.js v14 or higher

## Installation

Run the following commands in the terminal to get started:

1. `git clone https://github.com/cheesits456/0xDiscordBot.git`
2. `cd ./0xDiscordBot`
3. `npm install`
4. `cp ./.env.example ./.env`

Next, open the `.env` file with your text editor of choice. If you don't want Telegram or Twitter integration, simply leave those keys blank, ie:

```bash
# Telegram bot auth token
TELEGRAM_TOKEN=
```

<hr>

# Configuration

## Config Files

### .env

**Location:** `./.env`

A file of key-value pairs using Bash syntax (used to store API auth tokens securely).

| Key                         | Description                                                                                                                        |
|:----------------------------|:-----------------------------------------------------------------------------------------------------------------------------------|
| DISCORD_TOKEN               | The token for your Discord Bot (obtainable at [Discord's Developer Portal](https://discord.com/developers/applications))           |
| TELEGRAM_TOKEN              | The token for your Telegram Bot (obtainable by messaging [@BotFather](https://t.me/BotFather) on Telegram)                         |
| TWITTER_CONSUMER_KEY        | The API Key for your Twitter Bot (obtainable at [Twitter's Developer Portal](https://developer.twitter.com/en/portal))             |
| TWITTER_CONSUMER_SECRET     | The API Key Secret for your Twitter Bot (obtainable at [Twitter's Developer Portal](https://developer.twitter.com/en/portal))      |
| TWITTER_ACCESS_TOKEN        | The Access Token for your Twitter Bot (obtainable at [Twitter's Developer Portal](https://developer.twitter.com/en/portal))        |
| TWITTER_ACCESS_TOKEN_SECRET | The Access Token Secret for your Twitter Bot (obtainable at [Twitter's Developer Portal](https://developer.twitter.com/en/portal)) |

<details><summary>Sample <code>.env</code></summary>

```bash
# Discord bot auth token
DISCORD_TOKEN=S3CR3T

# Telegram bot auth token
TELEGRAM_TOKEN=T0K3N

# Twitter API tokens
TWITTER_CONSUMER_KEY=WhyDoes
TWITTER_CONSUMER_SECRET=Twitter
TWITTER_ACCESS_TOKEN=HaveFourDifferent
TWITTER_ACCESS_TOKEN_SECRET=AuthTokens

```

</details>

### config.json

**Location:** `./config.json`

| Parameter | Type                                   | Description                                                                                          |
|:----------|:---------------------------------------|:-----------------------------------------------------------------------------------------------------|
| feedIcons | Boolean                                | Whether or not to use token icon emojis in transaction feed channel (see also: [Icons.js](#iconsjs)) |
| owners    | Array&lt;UserID&gt;                    | Users who are allowed to use the restart and setup commands                                          |
| prefix    | String                                 | The default prefix for the bot                                                                       |
| statuses  | Array&lt;[UserStatus](#userstatus)&gt; | Bot statuses to show in member list<br>• minimum of 1<br>• no maximum<br>• cycles every 15 seconds   |

<details><summary>Sample <code>config.json</code></summary>

```json
{
	"feedIcons": true,
	"owners": [
		"306018440639152128",
		"517534579335233579"
	],
	"prefix": "!",
	"statuses": [{
		"name": "{trades} trades (24h)",
		"type": "WATCHING"
	}, {
		"name": "{traders} traders (24h)",
		"type": "WATCHING"
	}]
};
```

</details>

### Icons.js

**Location:** `./base/Icons.js`

<p align="justify"><i>This file's default values will work fine for the official 0x Discord Bot. The documentation for this file is here for other people looking to host their own instance of the bot</i></p>

<p align="justify">This file defines which emojis the bot should use for different tokens in the transaction feed channel. If the <code>feedIcons</code> option in <a href="#configjson">config.json</a> is set to <code>false</code>, this file is ignored. If you're someone looking to host your own separate instance of this bot, the default values set in this file won't work for you - you'll need to change the IDs to ones for emojis your bot has access to (bots can only use emojis from servers they're in).</p>

| Parameter                     | Type    | Description                                                           |
|:------------------------------|:--------|:----------------------------------------------------------------------|
| default                       | EmojiID | The icon used for tokens that don't have an icon defined in this file |
| twitter                       | EmojiID | The icon to display beside the Twitter link                           |
| TokenType (see example below) | EmojiID | The icon to use for the specified token                               |

<details><summary>Sample <code>Icons.js</code></summary>

```js
module.exports = {
	default: "753024461254426674",
	twitter: "752981062128369805"
	ALEPH: "752511902357258240",
	AMPL: "753009860026695680",
	ANT: "752667695736029244",
	BAT: "752379457204912248",
	BUSD: "752392861428875295",
	BZRX: "752466096560537672",
	CARD: "752439167342084157",
	CEL: "752959417795870721",
	CELR: "753011925453111316",
	COMP: "752400408453840966",
	CRV: "752993259495620728",
	DAI: "752385816269029447",
	ENJ: "752385308837806080",
	FOAM: "752532538437926922",
	HT: "752996998457852026",
	HUSD: "753010351993258395",
	KNC: "752406951631257601",
	LEND: "752994151825539103",
	LINK: "752376842463477765",
	LPT: "752517942834626620",
	MANA: "752997376406585435",
	MKR: "753005638593806417",
	OMG: "752487743870992454",
	PAX: "752405441597931572",
	RARI: "753011492944740403",
	REN: "753008350672977950",
	REP: "753006702814691438",
	REPv2: "752516431056207922",
	RWS: "752653343666602025",
	SNX: "752998308280270890",
	STAKE: "753018780606660629",
	TUSD: "752385812079050794",
	UMA: "753009307611693146",
	USDC: "752376590595260527",
	USDT: "752376088960827462",
	WBTC: "753008869256724651",
	WETH: "752990647035625555",
	YFI: "752411230760730694",
	ZAP: "753007418165821561",
	ZRX: "752998693048811571",
	imBTC: "752392862053957673",
	renBTC: "752457288299708439",
	sUSD: "752398395313881098"
}
```

</details>

### AmountEmojis.json

**Location:** `./base/AmountEmojis.json`

<p align="justify">This file defines the conditions for special emojis to appear beside the USD value in the transaction feed channel. It also defines the minimum USD value for a transaction to appear in the <code>#trades</code> channel, as well as the minimum value required for a transaction to get a Twitter post.</p>

<ul>
	<li align="justify">The key with the lowest numeric value determines the minumum USD value required for a transaction to be posted in Discord</li>
	<li align="justify">The lowest numbered key that has a non-empty value determines the minumum USD value required for a transaction to be posted on Twitter</li>
	<li align="justify">Values don't have to be emojis, you can set different messages for different value ranges if desired</li>
</ul>

<details><summary>Sample <code>AmountEmojis.json</code></summary>

```json
{
	"5000": "",
	"200000": "💵💵💵",
	"300000": "💵💵💵💵💵💵",
	"400000": "💵💵💵💵💵💵💵💵💵",
	"500000": "💰💰💰",
	"600000": "💰💰💰💰💰💰",
	"700000": "💰💰💰💰💰💰💰💰💰",
	"800000": "🚀🚀🚀",
	"900000": "🚀🚀🚀🚀🚀🚀",
	"1000000": "🚀🚀🚀🚀🚀🚀🚀🚀🚀",
	"2000000": "🔥🔥🔥",
	"3000000": "🔥🔥🔥🔥🔥🔥",
	"4000000": "🔥🔥🔥🔥🔥🔥🔥🔥🔥",
	"5000000": "🐳🐳🐳",
	"6000000": "🐳🐳🐳🐳🐳🐳",
	"7000000": "🐳🐳🐳🐳🐳🐳🐳🐳🐳",
	"8000000": "🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳",
	"9000000": "🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳",
	"10000000": "🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳🐳"
}
```

</details>

## Config Options

### UserStatus

**Type:** Object

| Parameter | Type                          | Description                                                                     |
|:----------|:------------------------------|:--------------------------------------------------------------------------------|
| name      | String                        | The name of the activity, with support for a couple variable values (see below) |
| type      | [ActivityType](#activitytype) | The type of activity                                                            |

#### Variable Values

| String      | Replaced With                                         |
|:------------|:------------------------------------------------------|
| `{trades}`  | The number of trades made withing the last 24 hours   |
| `{traders}` | The number of active traders within the last 24 hours |

<details><summary>Example UserStatuses</summary>

<img src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus1.png" align="left" height="110">

```json
{
	"name": "{trades} trades (24h)",
	"type": "WATCHING"
}
```

<img src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus2.png" align="left" height="110">

```json
{
	"name": "{traders} traders (24h)",
	"type": "LISTENING"
}
```

</details>

### ActivityType

**Type:** String

Any one of the following values:

- `LISTENING`
- `PLAYING`
- `STREAMING`
- `WATCHING`

<hr>

# Usage

## Running the Bot

<p align="justify">With the config set up, you can now start the bot with the following command:</p>

```bash
./start.sh
```

<p align="justify">To kill the bot's main process, Press <kbd>CTRL</kbd> + <kbd>C</kbd> in its terminal window.</p>

<p align="justify">Once the bot is connected to discord, an invite link will be logged to the console. The invite link can be used to invite the bot to a new server, and has all the necessary permission flags set</p>

## Commands

### Bash

Execute a shell command on the host machine

> This command can only be executed by users set as "owner" in [config.json](#configjson)

### Eval

Execute a JavaScript function

> This command can only be executed by users set as "owner" in [config.json](#configjson)

### Ping

A basic command to check the bot's websocket and processing latency

### Prefix

Used to change the command prefix for the server the command is issued in

> This command can only be executed by server administrators

### Restart

Use this command to shut down and restart the bot

> This command can only be executed by users set as "owner" in [config.json](#configjson)

### Setup

Use this command to create the stat channels and network transaction feed

> This command can only be executed by users set as "owner" in [config.json](#configjson)

### Update

Fetch the most recent version of the bot code from GitHub and automatically merge it with the currently running code

> This command can only be executed by users set as "owner" in [config.json](#configjson)

<hr>

# Author

<img alt="Profile Pic" src="https://github.com/cheesits456/cheesits456/raw/master/avatar.gif" align="left" height="75">

### [cheesits456][github] <br> [![EMail][email-img]][email] [![Website][website-img]][website]
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcheesits456%2F0xDiscordBot.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcheesits456%2F0xDiscordBot?ref=badge_shield)

<hr>

# License

This project is licensed under [AGPL-3.0][license]

<!-- Link Anchors -->

[banner-img]:		https://github.com/cheesits456/0xDiscordBot/raw/readme-images/banner.png
[email-img]:		https://img.shields.io/badge/-E--Mail-e722e7?style=for-the-badge
[transaction-img]:	https://github.com/cheesits456/0xDiscordBot/raw/readme-images/transaction_1.png
[website-img]:		https://img.shields.io/badge/-Website-e722e7?style=for-the-badge
[UserStatus1]:      https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus1.png
[UserStatus2]:      https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus2.png

[email]:	mailto:quin@cheesits456.dev
[github]:	https://github.com/cheesits456
[license]:	https://github.com/cheesits456/0xDiscordBot/blob/master/LICENSE.md
[website]:	https://cheesits456.dev


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcheesits456%2F0xDiscordBot.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcheesits456%2F0xDiscordBot?ref=badge_large)