---
title: "Deskmeet X300とRyzen5700GでCPUが異常発熱したときの対処"
description: "Asrock Deskmeet X300とRyzen 5700Gの組み合わせで起動したとき、突然のシャットダウンに見舞われました"
pubDate: "2023-10-21"
category: "PC・技術メモ"
tags: ["PC・技術メモ"]
eyecatch: ""
slug: "n9e1b67dcd5c3"
---

## Deskmeet 熱暴走からのシャットダウン

Asrock Deskmeet X300とRyzen 5700Gの組み合わせで起動したとき、突然のシャットダウンに見舞われました
バラしてみるとCPUのバックパネルが触れないほどの高温

なんとか起動してRyzenmasterで確認すると、CPU77℃ Ryzen Graphics98℃!?でした

熱暴走問題に対する解決策を色々考えてみたものの、意外なところに答えがありました

## 冷却できてるのか分解して確認

まずはこれは何とかして冷却せねば、と考えて

とりあえず蓋開けて動作 だなと

対処するまでの奮闘を記録に残しておきます

まずは蓋を開けて動作
みるみるうちに温度が上がって、起動直後から95℃のサーマルスロットリングに到達

## Windows11破損！？再インストールしても熱暴走

これはおかしい、と思いBIOSでCPUのVIDを1.000Vに固定したら、OS起動せず。そのまま回復モードに突入するも破損し復旧できず あちゃーと思いながら再インストール

Windows11を再インストールするも状況変わらず
Asrockのドライバ
[https://www.asrock.com/nettop/AMD/DeskMeet%20X300%20Series/index.jp.asp](https://www.asrock.com/nettop/AMD/DeskMeet%20X300%20Series/index.jp.asp)

Adrenalin 23.9.2 (WHQL Recommended)
[https://www.amd.com/ja/support/apu/amd-ryzen-processors/amd-ryzen-7-5000-g-series-desktop-processors-radeon-graphics/amd](https://www.amd.com/ja/support/apu/amd-ryzen-processors/amd-ryzen-7-5000-g-series-desktop-processors-radeon-graphics/amd)

ともに最新版にしても変わらず

## BIOSのバージョンアップ

でBIOSを探してみるとVer.1.40の次を発見
Ver1.40E(Beta)2023/3/27
[https://www.asrock.com/nettop/AMD/DeskMeet%20X300%20Series/index.jp.asp#BIOS](https://www.asrock.com/nettop/AMD/DeskMeet%20X300%20Series/index.jp.asp#BIOS)

こんなことで治るのか、と思いつつBIOSアップデート

直った！！

温度はCPU48℃ GPU66℃ と明らかな低下
100%負荷かけても70℃そこそこ

犯人はBIOSでした

DeskmeetのCPUファンと電源ファンの間は1cmもないくらいギチギチなので、そんなもんかと運用していたのですが、それは不正解だったらしい

AGESAのバージョンが悪かったのか
調べても情報が無かったのでNoteに残しておきます
