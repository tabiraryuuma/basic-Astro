const fs = require("fs");
const path = require("path");

// assetsフォルダ
const assetsDir = path.join(__dirname, "../src/assets");

// 対応する拡張子
const exts = [".webp", ".png", ".jpg", ".jpeg", ".svg"];

/**
 * ファイル名を PascalCase に変換
 * hero-image.webp → HeroImage
 * room_01.webp → Room01
 * LINE_1.svg → Line1
 * 1-mainvisual.webp → Image1Mainvisual
 */
function toPascalCase(filename) {
  const name = path.parse(filename).name;

  let pascal = name
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .split(/\s+/)
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");

  if (/^\d/.test(pascal)) {
    pascal = "Image" + pascal;
  }

  return pascal;
}

function processFolder(folder) {
  const items = fs.readdirSync(folder, {
    withFileTypes: true,
  });

  const imageFiles = items
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .filter((file) => exts.includes(path.extname(file)));

  if (imageFiles.length > 0) {
    const svg = imageFiles
      .filter((f) => f.endsWith(".svg"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const images = imageFiles
      .filter((f) => !f.endsWith(".svg"))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    let content = `// ⚠️ このファイルは自動生成されています。\n`;
    content += `// 手動で編集しないでください。\n\n`;


    // SVG
    if (svg.length) {
      content += "// SVG\n";

      svg.forEach((file) => {
        const exportName = toPascalCase(file);
        content += `export { default as ${exportName} } from "./${file}";\n`;
      });

      content += "\n";
    }

    // Images
    if (images.length) {
      content += "// Images\n";

      images.forEach((file) => {
        const exportName = toPascalCase(file);
        content += `export { default as ${exportName} } from "./${file}";\n`;
      });

      content += "\n";
    }


    const indexPath = path.join(folder, "index.ts");

    // ★ここが新しく追加した部分
    // 内容が同じなら保存しない
    if (fs.existsSync(indexPath)) {
      const oldContent = fs.readFileSync(indexPath, "utf8");

      if (oldContent === content) {
        console.log(
          `⏭️ ${path.relative(assetsDir, folder)}/index.ts (変更なし)`
        );
      } else {
        fs.writeFileSync(indexPath, content, "utf8");
        console.log(
          `✅ ${path.relative(assetsDir, folder)}/index.ts`
        );
      }
    } else {
      fs.writeFileSync(indexPath, content, "utf8");
      console.log(
        `✅ ${path.relative(assetsDir, folder)}/index.ts`
      );
    }
  }

  // サブフォルダも処理
  items
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      processFolder(path.join(folder, item.name));
    });
}

processFolder(assetsDir);

console.log("\n🎉 index.ts の生成が完了しました！");