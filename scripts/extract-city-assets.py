"""Extract only glTF runtime sources and licenses from the CC0 source archives."""
from pathlib import Path
import zipfile

root = Path('.cache/city-assets').resolve()
for archive in root.glob('*.zip'):
    if archive.stem == 'libktx':
        with zipfile.ZipFile(archive) as bundle:
            destination = root / 'libktx'
            destination.mkdir(exist_ok=True)
            for name in ['libktx.js', 'libktx.wasm']:
                (destination / name).write_bytes(bundle.read(name))
        continue
    destination = root / archive.stem
    count = 0
    with zipfile.ZipFile(archive) as bundle:
        for entry in bundle.infolist():
            name = entry.filename
            if not name.lower().endswith(('.gltf', '.glb', '.bin', '.png', '.jpg', '.txt')):
                continue
            if archive.stem != 'downtown-city-megakit' and 'GLB format/' not in name and 'GLTF format/' not in name and 'license' not in name.lower():
                continue
            if archive.stem == 'downtown-city-megakit' and 'glTF (Godot)/' not in name and 'texture' not in name.lower() and 'license' not in name.lower():
                continue
            target = (destination / name).resolve()
            if not target.is_relative_to(destination):
                raise ValueError('Archive path escapes asset directory: ' + name)
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(bundle.read(entry))
            count += 1
    print(archive.stem + ': extracted ' + str(count) + ' runtime source files')
