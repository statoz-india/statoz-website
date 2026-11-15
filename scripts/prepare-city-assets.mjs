import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRTextureBasisu } from '@gltf-transform/extensions';
import { dedup, prune, weld, meshopt, textureCompress, mergeDocuments, simplify, unpartition } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { createRequire } from 'node:module';

await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const root = path.resolve('.cache/city-assets');
const destination = path.resolve('public/assets/city');
await mkdir(destination + '/licenses', { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [];
const require = createRequire(import.meta.url);
const ktx = await require(path.join(root, 'libktx/libktx.js'))();

async function compressTextures(document) {
  document.createExtension(KHRTextureBasisu).setRequired(true);
  for (const texture of document.getRoot().listTextures()) {
    const input = texture.getImage();
    if (!input) continue;
    const image = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const info = new ktx.textureCreateInfo();
    const levels = Math.floor(Math.log2(Math.max(image.info.width, image.info.height))) + 1;
    Object.assign(info, { vkFormat: ktx.VkFormat.R8G8B8A8_SRGB, baseWidth: image.info.width, baseHeight: image.info.height, baseDepth: 1, numDimensions: 2, numLevels: levels, numLayers: 1, numFaces: 1, isArray: false, generateMipmaps: false });
    const output = new ktx.texture(info, ktx.TextureCreateStorageEnum.ALLOC_STORAGE);
    for (let level = 0; level < levels; level++) {
      const width = Math.max(1, image.info.width >> level), height = Math.max(1, image.info.height >> level);
      const pixels = level ? await sharp(image.data, { raw: image.info }).resize(width, height).raw().toBuffer() : image.data;
      const result = output.setImageFromMemory(level, 0, 0, new Uint8Array(pixels));
      if (result.value !== 0) throw new Error('KTX2 image upload failed: ' + result.value);
    }
    const parameters = new ktx.basisParams();
    parameters.qualityLevel = 180; parameters.compressionLevel = 1; parameters.threadCount = 1;
    const result = output.compressBasis(parameters);
    if (result.value !== 0) throw new Error('KTX2 compression failed: ' + result.value);
    texture.setImage(new Uint8Array(output.writeToMemory())).setMimeType('image/ktx2');
    output.delete(); parameters.delete(); info.delete();
  }
}

const kits = [
  { name: 'city-kit', creator: 'Kenney', source: 'https://kenney.nl/assets/', models: [
    ['building-a', 'city-kit-commercial/Models/GLB format/building-a.glb'],
    ['building-d', 'city-kit-commercial/Models/GLB format/building-d.glb'],
    ['building-g', 'city-kit-commercial/Models/GLB format/building-g.glb'],
    ['building-k', 'city-kit-commercial/Models/GLB format/building-k.glb'],
    ['building-tower-a', 'city-kit-commercial/Models/GLB format/building-skyscraper-a.glb'],
    ['building-tower-d', 'city-kit-commercial/Models/GLB format/building-skyscraper-d.glb'],
    ['streetlight', 'city-kit-roads/Models/GLB format/light-square.glb'],
    ['grandstand', 'racing-kit/Models/GLTF format/grandStandCovered.glb'],
    ['pit-garage', 'racing-kit/Models/GLTF format/pitsGarage.glb'],
    ['tree', 'racing-kit/Models/GLTF format/treeLarge.glb'],
    ['race-car', 'racing-kit/Models/GLTF format/raceCarOrange.glb'],
  ] },
  { name: 'downtown-kit', creator: 'Quaternius', source: 'https://quaternius.com/packs/downtowncitymegakit.html', models: [
    ['downtown-large', 'downtown-city-megakit/Exports/glTF (Godot)/Building_Large_2.gltf'],
    ['downtown-medium', 'downtown-city-megakit/Exports/glTF (Godot)/Building_Medium_2_001.gltf'],
    ['downtown-small', 'downtown-city-megakit/Exports/glTF (Godot)/Building_Small_1.gltf'],
  ] },
];

for (const kit of kits) {
  const document = new Document();
  const scene = document.createScene(kit.name); document.getRoot().setDefaultScene(scene);
  for (const [alias, relative] of kit.models) {
    const file = path.join(root, relative);
    const bytes = await readFile(file);
    const input = await io.read(file);
    if (kit.creator === 'Quaternius') {
      // Aerial view needs the exterior; strip expensive interior and unused channel maps.
      for (const mat of input.getRoot().listMaterials()) {
        mat.setNormalTexture(null).setOcclusionTexture(null).setMetallicRoughnessTexture(null).setRoughnessFactor(.68).setMetallicFactor(.12);
        if (/Glass|FakeInterior/i.test(mat.getName())) mat.setEmissiveFactor([.12, .25, .35]);
      }
      await input.transform(prune(), simplify({ simplifier: MeshoptSimplifier, ratio: .42, error: .005 }));
    }
    const mapping = mergeDocuments(document, input);
    const wrapper = document.createNode(alias);
    for (const inputScene of input.getRoot().listScenes()) {
      const mappedScene = mapping.get(inputScene);
      for (const child of [...mappedScene.listChildren()]) { mappedScene.removeChild(child); wrapper.addChild(child); }
      mappedScene.dispose();
    }
    scene.addChild(wrapper);
    records.push({ id: alias, sourceFile: relative, creator: kit.creator, source: kit.creator === 'Kenney' ? kit.source + relative.split('/')[0] : kit.source, license: 'CC0-1.0', sourceSha256: hash(bytes), output: '/assets/city/' + kit.name + '.glb', modifications: 'Selected, normalized at runtime, deduplicated, reduced textures, Meshopt compressed. Quaternius exteriors simplified for the aerial view.' });
  }
  await document.transform(prune(), dedup(), weld(), textureCompress({ encoder: sharp, targetFormat: 'png', resize: [512, 512] }));
  await compressTextures(document);
  await document.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }), unpartition());
  const output = await io.writeBinary(document);
  await writeFile(path.join(destination, kit.name + '.glb'), output);
  console.log(kit.name + ': ' + output.byteLength + ' bytes, ' + document.getRoot().listTextures().length + ' textures');
}
await copyFile(path.join(root, 'city-kit-commercial/License.txt'), destination + '/licenses/Kenney.txt');
await copyFile(path.join(root, 'downtown-city-megakit/License_Standard.txt'), destination + '/licenses/Quaternius.txt');
await mkdir(destination + '/basis', { recursive: true });
for (const name of ['basis_transcoder.js', 'basis_transcoder.wasm']) await copyFile('node_modules/three/examples/jsm/libs/basis/' + name, destination + '/basis/' + name);
await copyFile('node_modules/three/examples/jsm/libs/basis/README.md', destination + '/licenses/Basis-README.md');
await writeFile(destination + '/manifest.json', JSON.stringify({ version: 1, licenses: ['/assets/city/licenses/Kenney.txt', '/assets/city/licenses/Quaternius.txt'], assets: records }, null, 2));
// A neutral loading frame is replaced with a capture of the actual city after visual QA.
for (const [name, width, height] of [['city-poster', 1600, 1000], ['city-mobile', 700, 1000]]) {
  try { await readFile(destination + '/' + name + '.webp'); } catch { await sharp({ create: { width, height, channels: 3, background: '#070c1f' } }).webp({ quality: 80 }).toFile(destination + '/' + name + '.webp'); }
}
