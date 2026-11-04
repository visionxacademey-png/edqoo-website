$heroDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\hero'
$spokenDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\spoken-tutorial'
$langDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\spoken-tutorial\languages'
$scratchDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\scratch'

# Slide 1 Mobile: tamil-english (Young confident Indian tech learner with headset)
Copy-Item "$langDir\tamil-english.jpg" "$heroDir\hero-slide-1-mobile.jpg" -Force
Copy-Item "$langDir\tamil-english.webp" "$heroDir\hero-slide-1-mobile.webp" -Force

# Slide 1 Desktop: fluency-builder-plan (Young Indian tech learner at laptop with bookshelves)
Copy-Item "$spokenDir\fluency-builder-plan.jpg" "$heroDir\hero-slide-1-desktop.jpg" -Force
Copy-Item "$spokenDir\fluency-builder-plan.jpg" "$heroDir\hero-slide-1-desktop.webp" -Force

# Slide 2: Keep existing hero-slide-2 (Indian female data analyst with headphones & notes) - it's already perfectly aligned!

# Slide 3 Mobile: hindi-english (Young Indian AI engineer with glasses, headset & mic) - COMPLETELY FIXES the clipped face issue from the screenshot!
Copy-Item "$langDir\hindi-english.jpg" "$heroDir\hero-slide-3-mobile.jpg" -Force
Copy-Item "$langDir\hindi-english.webp" "$heroDir\hero-slide-3-mobile.webp" -Force

# Slide 3 Desktop: Keep hero-slide-3-desktop (Mentor & student collaborating in glass office on architecture diagram) - perfect on desktop widescreen!

# Slide 4 Mobile: test-slide4-crop (Executive Indian woman in navy blazer in boardroom)
Copy-Item "$scratchDir\test-slide4-crop.jpg" "$heroDir\hero-slide-4-mobile.jpg" -Force
Copy-Item "$scratchDir\test-slide4-crop.jpg" "$heroDir\hero-slide-4-mobile.webp" -Force

# Slide 4 Desktop: corporate-english (Executive glass office overlooking skyline at twilight)
Copy-Item "$spokenDir\corporate-english.jpg" "$heroDir\hero-slide-4-desktop.jpg" -Force
Copy-Item "$spokenDir\corporate-english.jpg" "$heroDir\hero-slide-4-desktop.webp" -Force

Write-Output "Successfully updated all hero images in public/images/hero!"

