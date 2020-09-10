![Banner](https://github.com/cheesits456/0xDiscordBot/raw/readme-images/banner.png)  
_This is a bot for the 0x Community on Discord, created with :heart: by [cheesits456](https://github.com/cheesits456)_

# Table of Contents

- [Features](#features)
  - [Staking Stats](#staking-stats)
  - [Network Volume Stats](#network-volume-stats)
  - [Network Transaction Feed](#network-transaction-feed)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)

# Features

<img align="right" alt="Staking Stats" src="https://github.com/cheesits456/0xDiscordBot/raw/readme-images/stats.png" width="340">

## Staking Stats

<p align="justify">Provides information about the current staking epoch, such as the total ZRX currently staked, or how much time is remaining until the epoch expires. Stats are provided in the form of viewable but unjoinable voice channels, collapsable under their own category at the top of the server's channel list.</p>

## Network Volume Stats

<p align="justify">Provides information about the total dollar value (USD) of all trades on the ZRX network for the past 24 hours, as well as all time. Similar to the staking stats, the network volume statistics also use a voice channel in its own collapsable category.</p>

## Network Transaction Feed

<p align="justify">Utilizes the <a href="https://docs.0xtracker.com/api-reference/introduction">0x Tracker API</a> to post details about every transaction on the ZRX Network to a read-only text channel in Discord. The Discord messages also contain a link to that transaction's page on the 0x Tracker website, as well as a Twitter link to draft a new Tweet about the transaction.</p>

![Network Transactions](https://github.com/cheesits456/0xDiscordBot/raw/readme-images/transaction.png)

# Getting Started

## Requirements

<p align="justify">You'll need the following installed on your system in order to proceed with setup:</p>

- Git
- Node.js v14 or higher

## Installation

Execute the following commands to download the repo and install the node dependencies:

```bash
git clone https://github.com/cheesits456/0xDiscordBot.git
cd 0xDiscordBot
npm i
```
