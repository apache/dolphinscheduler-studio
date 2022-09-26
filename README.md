# DolphinScheduler Studio

[![License](https://img.shields.io/badge/license-Apache%202-4EB1BA.svg)](https://www.apache.org/licenses/LICENSE-2.0.html)

DolphinScheduler Studio is a debugging platfrom for [DolphinScheduler](https://github.com/apache/dolphinscheduler).

If you want to contribute, please refer to the [contributing guidelines](./CONTRIBUTING.md) of this project.


## Quick start

install dependencies using **pnpm**

```shell
pnpm install
```
start the development server

```shell
pnpm dev
```

build a studio component

```shell
pnpm build
```

## Install LSP

install sql lsp

```shell
go install github.com/lighttiger2505/sqls@latest
```

install shell lsp
```shell
npm i -g bash-language-server
```

install python lsp
```shell
pip install python-lsp-server
```

## Configuration DB
The connection to the RDBMS is essential to take advantage of the functionality provided by sqls. You need to set the connection to the RDBMS.

## Configuration Methods

Change the configuration to your `server/sql.yml`

```
lowercaseKeywords: false
connections:
  - alias: mysql
    driver: mysql
    proto: tcp
    user: root
    passwd: root
    host: 127.0.0.1
    port: 13306
    dbName: world
```

## Start LSP Server

Open `server` directory and run command

```
python lsp-server.py
```