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
    - [config.js](#configjs)
	- [Icons.js](#iconsjs)
  - [Config Options](#config-options)
    - [UserStatus](#userstatus)
	- [ActivityType](#activitytype)
- [Usage](#usage)
  - [Running the Bot](#running-the-bot)
  - [Commands](#commands)
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

Start by cloning the git repo into a new folder:

```bash
git clone https://github.com/cheesits456/0xDiscordBot.git
```

Next, `cd` into the directory:

```bash
cd 0xDiscordBot
```

And finally, install the node dependencies:

```bash
npm install
```

<hr>

# Configuration

## Config Files

### config.js

**Location:** `./config.js`

<p align="justify">The main configuration file</p>

| Parameter | Type                                   | Description                                                                                          |
|:----------|:---------------------------------------|:-----------------------------------------------------------------------------------------------------|
| feedIcons | Boolean                                | Whether or not to use token icon emojis in transaction feed channel (see also: [Icons.js](#iconsjs)) |
| owners    | Array&lt;UserID&gt;                    | Users who are allowed to use the restart command                                                     |
| prefix    | String                                 | The default prefix for the bot                                                                       |
| statuses  | Array&lt;[UserStatus](#userstatus)&gt; | Bot statuses to show in member list<br>• minimum of 1<br>• no maximum<br>• cycles every 15 seconds   |
| token     | String                                 | The token of your Discord Bot                                                                        |

<details><summary>Sample <code>config.js</code></summary>

```js
module.exports = {
	feedIcons: true,
	owners: [
		"306018440639152128",
		"517534579335233579"
	],
	prefix: "!",
	statuses: [{
		name: "{trades} trades (24h)",
		type: "WATCHING"
	}, {
		name: "{traders} traders (24h)",
		type: "WATCHING"
	}],
	token: "T0K3N"
};
```

</details>

### Icons.js

**Location:** `./base/Icons.js`

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

<details><summary>Example `UserStatus`es</summary>

<img src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus1.png" align="left" height="110">

```js
{
	name: "{trades} trades (24h)",
	type: "WATCHING"
}
```

<img src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus2.png" align="left" height="110">

```js
{
	name: "{traders} traders (24h)",
	type: "LISTENING"
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

To kill the bot's main process, Press <kbd>CTRL</kbd> + <kbd>C</kbd> in its terminal window.

## Commands

<p align="justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis pellentesque feugiat. Maecenas id erat dignissim libero egestas cursus sit amet non nibh. Duis lobortis finibus tincidunt. Sed eu ligula at enim eleifend congue vitae eu massa. Integer eleifend nunc magna, quis rhoncus risus eleifend et.</p>

<hr>

# Author

<img alt="Profile Pic" src="https://github.com/cheesits456/cheesits456/raw/master/avatar.gif" align="left" height="75">

### [cheesits456][github] <br> [![EMail][email-img]][email] [![Website][website-img]][website]

<hr>

# License

This project is licensed under [AGPL-3.0][license]

<!-- Link Anchors -->

[banner-img]:		https://github.com/cheesits456/0xDiscordBot/raw/readme-images/banner.png
[email-img]:		https://img.shields.io/badge/-E--Mail-e722e7?style=for-the-badge
[transaction-img]:	https://github.com/cheesits456/0xDiscordBot/raw/readme-images/transaction.png
[website-img]:		https://img.shields.io/badge/-Website-e722e7?style=for-the-badge
[UserStatus1]:      https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus1.png
[UserStatus2]:      https://github.com/cheesits456/0xDiscordBot/raw/readme-images/UserStatus2.png

[email]:	mailto:quin@cheesits456.dev
[github]:	https://github.com/cheesits456
[license]:	https://github.com/cheesits456/0xDiscordBot/blob/master/LICENSE.md
[website]:	https://cheesits456.dev
