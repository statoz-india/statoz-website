"""Rebuild the checked-in Latin WOFF2 from the original variable font.

Requires fonttools[woff] (fonttools 4.68.0 / Brotli 1.2.1 used initially).
Run from the project root after installing those tools in .cache/font-tools.
"""
import sys

sys.path.insert(0, '.cache/font-tools')
from fontTools import subset
from fontTools.ttLib import TTFont

font = TTFont('public/assets/fonts/space-grotesk-variable.ttf')
subsetter = subset.Subsetter()
subsetter.populate(unicodes=(
    list(range(0x100)) + list(range(0x2000, 0x2070)) +
    [0x131, 0x152, 0x153, 0x2bb, 0x2bc, 0x2c6, 0x2da, 0x2dc,
     0x304, 0x308, 0x329, 0x2074, 0x20ac, 0x2122, 0x2191, 0x2193,
     0x2212, 0x2215, 0xfeff, 0xfffd]
))
subsetter.subset(font)
font.flavor = 'woff2'
font.save('public/assets/fonts/space-grotesk-variable.woff2')
