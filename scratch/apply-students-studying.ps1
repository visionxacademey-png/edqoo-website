$heroDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\hero'
$spokenDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\public\images\spoken-tutorial'
$scratchDir = 'c:\Users\aswin\OneDrive\Desktop\edqoo\scratch'

# Slide 1: Library Students Collaborative Study
# Desktop: 3 students around library table with laptops and books
# Mobile: 2 students smiling together over laptop and case study notebook
# Already restored via git checkout 5dbbf78 for slide 1

# Slide 2: Female Student Studying Python & Data Science
# Desktop: hero-slide-2-desktop.jpg (already in place)
# Mobile: hero-slide-2-mobile.jpg (already in place with "TECH COURSE NOTES : PYTHON")

# Slide 3: Male Student Studying on MacBook in Library (focused, ambitious, head in top 15%-40%)
Copy-Item "$scratchDir\test-student-study-crop.jpg" "$heroDir\hero-slide-3-mobile.jpg" -Force
Copy-Item "$scratchDir\test-student-study-crop.jpg" "$heroDir\hero-slide-3-mobile.webp" -Force
Copy-Item "$spokenDir\ielts-intensive.jpg" "$heroDir\hero-slide-3-desktop.jpg" -Force
Copy-Item "$spokenDir\ielts-intensive.jpg" "$heroDir\hero-slide-3-desktop.webp" -Force

# Slide 4: Female Student Smiling & Writing Study Notes with Pen & Laptop
Copy-Item "$scratchDir\test-female-student-crop.jpg" "$heroDir\hero-slide-4-mobile.jpg" -Force
Copy-Item "$scratchDir\test-female-student-crop.jpg" "$heroDir\hero-slide-4-mobile.webp" -Force
Copy-Item "$spokenDir\communicative-english.jpg" "$heroDir\hero-slide-4-desktop.jpg" -Force
Copy-Item "$spokenDir\communicative-english.jpg" "$heroDir\hero-slide-4-desktop.webp" -Force

Write-Output "Successfully updated hero slides with students studying images!"

