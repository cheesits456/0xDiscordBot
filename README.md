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
  - [Config Options](#config-options)
    - [UserStatus](#userstatus)
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

# Configuration

## Config Files

### config.js

| Parameter | Type                                   | Description                                                                                        |
|:----------|:---------------------------------------|:---------------------------------------------------------------------------------------------------|
| feedIcons | Boolean                                | Whether or not to use token icon emojis in transaction feed channel                                |
| owners    | Array&lt;UserID&gt;                    | Users who are allowed to use the restart command                                                   |
| prefix    | String                                 | The default prefix for the bot                                                                     |
| statuses  | Array&lt;[UserStatus](#userstatus)&gt; | Bot statuses to show in member list<br>• minimum of 1<br>• no maximum<br>• cycles every 15 seconds |
| token     | String                                 | The token of your Discord Bot                                                                      |

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
| `{traders}` | The number of active traders within the last 24 hours |
| `{trades}`  | The number of trades made withing the last 24 hours   |

<details><summary>Sample <code>UserStatus</code></summary>

```js
{
	name: "{trades} trades (24h)",
	type: "WATCHING"
}
```

</details>

# Usage

## Running the Bot

<p align="justify">With the config set up, you can now start the bot with the following command:</p>

```bash
./start.sh
```

To kill the bot's main process, Press <kbd>CTRL</kbd> + <kbd>C</kbd> in its terminal window.

## Commands

<p align="justify">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisis pellentesque feugiat. Maecenas id erat dignissim libero egestas cursus sit amet non nibh. Duis lobortis finibus tincidunt. Sed eu ligula at enim eleifend congue vitae eu massa. Integer eleifend nunc magna, quis rhoncus risus eleifend et.</p>

# Author

<img alt="Profile Pic" src="https://github.com/cheesits456/cheesits456/raw/master/avatar.gif" align="left" height="75">

### [cheesits456][github] <br> [![EMail][email-img]][email] [![Website][website-img]][website]

# License

This project is licensed under [AGPL-3.0][license]

<!-- Link Anchors -->

[banner-img]:		https://github.com/cheesits456/0xDiscordBot/raw/readme-images/banner.png
[email-img]:		https://img.shields.io/badge/-E--Mail-e722e7?style=for-the-badge
[transaction-img]:	https://github.com/cheesits456/0xDiscordBot/raw/readme-images/transaction.png
[website-img]:		https://img.shields.io/badge/-Website-e722e7?style=for-the-badge

[email]:	mailto:quin@cheesits456.dev
[github]:	https://github.com/cheesits456
[license]:	https://github.com/cheesits456/0xDiscordBot/blob/master/LICENSE.md
[website]:	https://cheesits456.dev
