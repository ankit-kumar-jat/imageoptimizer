# ImageOptimizer

Online service that optimize images (PNG, JPG, GIF, BMP and TIF) using lossless and lossy compression to shrink images to the minimum possible size while keeping the required level of quality. lossless compression keeps 100% quality of image.

## Key Features

>   1. keep 100% quality while do lossless compression
>   2. choose you want exif data or not
>   3. provide single click download for optimized picture
>   4. shows the original file size and optimized file size
>   5. shows the percentage of gain
>   6. shows the date when the file will be deleted from the server(Usually it will be the same day you uploade image)

## Limitions

limits its use to PNG, JPG, GIF, BMP and TIF pictures for FREE up to 5MB

## Library Used

it provides a FREE optimization of pictures, for the most standard filetypes (PNG, JPG, GIF, BMP and TIF). It allows reductions until 80% by using differents algorithms :

* PNGQuant to strip unneeded chunks from PNGs. PNGQuant is a lossy compression library for PNG images. This library preserves a full alpha transparency. See www.pngquant.org for more informations.
* JPEGOptim provides lossless optimization (based on optimizing the Huffman tables). JPEGOptim is one of the most efficient library for JPG conversion among JpegTrans, mozjpeg and jpegrescan. See www.github.com/tjko/jpegoptim for more informations.
* OptiPNG is based on PNGCrush, and also includes part of PNGRewrite code for palette rewriting. Unlike PNGCrush, all trials are performed in memory, and it does some image reductions automatically. It's a PNG reducer that's used by lot of online optimizers. See www.optipng.sourceforge.net for more informations.

## Optimization Examples

