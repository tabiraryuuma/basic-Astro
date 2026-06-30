# 下記のインストールしてください
npm install --save-dev chokidar-cli

npm ls chokidar-cli
その後、「npm run watch-images」が使えるか確認お願いします。


# 自動監視したい場合
※ npm run dev とは別のターミナルで実行してください。
※ npm run dev を停止していても実行できます。

npm run watch-images 

📌 画像を追加・削除・リネームすると、自動で index.ts が更新されます。

---------
# 画像を追加・削除・リネームしたら（自動監視を使わない場合）
npm run generate-images

📌 index.ts を最新の状態へ更新します。

----------
# Astroで読み込む
import * as 場所名 from "使用するフォルダーのパス";

例）
import * as Top from "../assets/image/top";
import * as Itoshima810 from "../assets/image/Itoshima810";
import * as Itoshima808 from "../assets/image/Itoshima808";
import * as CommonIcons from "../assets/SVG";

---------
# 画像使用の際
<img src={場所名.画像名.src} alt="">

例）
<img src={Itoshima810.HeroImage.src} alt="">
<img src={Top.Room01.src} alt="">
<img src={Itoshima808.HeroImage.src} alt="">
***

---
## リネームとは？？
ファイル名やフォルダ名を変更すること

---
## 【更新履歴】
作成：R8 6/26
v1.0
- index.ts 自動生成
- watch-images 対応
- import * as ○○ に対応
- export default 対応