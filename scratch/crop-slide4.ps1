Add-Type -AssemblyName System.Drawing
$srcPath = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\spoken-tutorial\corporate-english.jpg'
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# Source is 1376 x 768
# Executive is centered around X = 860, Y = 350
$cropH = 768
$cropW = [int]($cropH * (896.0 / 1200.0)) # 573px
$cropX = 600
$cropY = 0

$dest = [System.Drawing.Bitmap]::new(896, 1200)
$g = [System.Drawing.Graphics]::FromImage($dest)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$rectDest = [System.Drawing.Rectangle]::new(0, 0, 896, 1200)
$rectSrc = [System.Drawing.Rectangle]::new($cropX, $cropY, $cropW, $cropH)
$g.DrawImage($src, $rectDest, $rectSrc, [System.Drawing.GraphicsUnit]::Pixel)

$dest.Save('c:\Users\aswin\OneDrive\Desktop\edqoo\scratch\test-slide4-crop.jpg', [System.Drawing.Imaging.ImageFormat]::Jpeg)
$g.Dispose()
$dest.Dispose()
$src.Dispose()
Write-Output "Successfully cropped slide 4"

