const fs = require("fs");
const path = require("path");

const assetsDir = path.join(__dirname, "../src/assets");

const exts = [".webp", ".png", ".jpg", ".jpeg", ".svg"];

/**
 * ファイル名を PascalCase に変換
 * hero-image.webp → HeroImage
 * room_01.webp → Room01
 * LINE_1.svg → Line1
 */
function toPascalCase(filename) {
  const name = path.parse(filename).name;

  return name
    .toLowerCase()
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
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
      .sort();

    const images = imageFiles
      .filter((f) => !f.endsWith(".svg"))
      .sort();

    let content = `// ⚠️ このファイルは自動生成されています。\n`;
    content += `// 手動で編集しないでください。\n\n`;

    // export default用
    const exportNames = [];

    // SVG
    if (svg.length) {
      content += "// SVG\n";

      svg.forEach((file) => {
        const exportName = toPascalCase(file);

        exportNames.push(exportName);

        content += `export { default as ${exportName} } from "./${file}";\n`;
      });

      content += "\n";
    }

    // Images
    if (images.length) {
      content += "// Images\n";

      images.forEach((file) => {
        const exportName = toPascalCase(file);

        exportNames.push(exportName);

        content += `export { default as ${exportName} } from "./${file}";\n`;
      });

      content += "\n";
    }

    // export default
    content += "export default {\n";

    exportNames.forEach((name) => {
      content += `  ${name},\n`;
    });

    content += "};\n";

    fs.writeFileSync(
      path.join(folder, "index.ts"),
      content,
      "utf8"
    );

    console.log(`✅ ${path.relative(assetsDir, folder)}/index.ts`);
  }

  // サブフォルダも再帰的に処理
  items
    .filter((item) => item.isDirectory())
    .forEach((item) => {
      processFolder(path.join(folder, item.name));
    });
}

processFolder(assetsDir);

console.log("\n🎉 index.ts の生成が完了しました！");